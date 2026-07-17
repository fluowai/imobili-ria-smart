-- ============================================================
-- ImobiOS — Schema completo para Supabase
-- Rode no Supabase SQL Editor (uma vez).
-- Usa auth.users do Supabase como fonte da identidade.
-- Multi-tenant por `imobiliaria_id` + memberships + RLS.
-- ============================================================

-- =================== EXTENSÕES ===================
create extension if not exists "pgcrypto";

-- =================== ENUMS ===================
do $$ begin
  create type public.app_role as enum ('super_admin','admin_imob','corretor','cliente');
exception when duplicate_object then null; end $$;

do $$ begin create type public.imovel_tipo as enum ('urbano','rural'); exception when duplicate_object then null; end $$;
do $$ begin create type public.imovel_status as enum ('disponivel','reservado','vendido','alugado','inativo'); exception when duplicate_object then null; end $$;
do $$ begin create type public.imovel_finalidade as enum ('venda','locacao','ambos'); exception when duplicate_object then null; end $$;
do $$ begin create type public.pessoa_tipo as enum ('pf','pj'); exception when duplicate_object then null; end $$;
do $$ begin create type public.lead_status as enum ('novo','qualificando','visita','proposta','fechado','perdido'); exception when duplicate_object then null; end $$;
do $$ begin create type public.lead_origem as enum ('site','whatsapp','instagram','portal','indicacao','outros'); exception when duplicate_object then null; end $$;
do $$ begin create type public.contrato_tipo as enum ('venda','locacao','captacao','administracao'); exception when duplicate_object then null; end $$;
do $$ begin create type public.contrato_status as enum ('rascunho','enviado','assinado','vigente','encerrado','cancelado'); exception when duplicate_object then null; end $$;
do $$ begin create type public.tarefa_status as enum ('aberta','em_andamento','concluida','cancelada'); exception when duplicate_object then null; end $$;
do $$ begin create type public.mensagem_canal as enum ('whatsapp','email','sms','instagram','chat_site'); exception when duplicate_object then null; end $$;
do $$ begin create type public.mensagem_direcao as enum ('in','out'); exception when duplicate_object then null; end $$;
do $$ begin create type public.lancamento_tipo as enum ('receita','despesa'); exception when duplicate_object then null; end $$;
do $$ begin create type public.lancamento_status as enum ('pendente','pago','atrasado','cancelado'); exception when duplicate_object then null; end $$;

-- =================== PERFIS / ROLES ===================

-- Perfil espelha auth.users (nome, avatar). Sem senha (auth.users cuida).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

drop policy if exists "profiles self read"  on public.profiles;
drop policy if exists "profiles self write" on public.profiles;
create policy "profiles self read"  on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles self write" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Trigger para criar profile ao registrar
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_nome text;
  v_imob_nome text;
  v_slug text;
  v_imob_id uuid;
begin
  v_nome := coalesce(new.raw_user_meta_data->>'nome','');
  insert into public.profiles(id, nome) values (new.id, v_nome)
  on conflict (id) do nothing;

  -- Auto-provisiona imobiliária + membership admin para novos signups
  v_imob_nome := coalesce(nullif(new.raw_user_meta_data->>'imobiliaria',''), 'Imobiliária ' || coalesce(v_nome, split_part(new.email,'@',1)));
  v_slug := lower(regexp_replace(v_imob_nome, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(new.id::text, 1, 8);

  insert into public.imobiliarias(nome, slug) values (v_imob_nome, v_slug)
  returning id into v_imob_id;

  insert into public.memberships(user_id, imobiliaria_id, role)
  values (new.id, v_imob_id, 'admin_imob');

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Roles globais (super_admin, etc). NUNCA guardar role no profile.
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

drop policy if exists "user_roles self read" on public.user_roles;
create policy "user_roles self read" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'super_admin'));

-- =================== IMOBILIÁRIAS + MEMBERSHIPS ===================
create table if not exists public.imobiliarias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  cnpj text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.imobiliarias to authenticated;
grant all on public.imobiliarias to service_role;
alter table public.imobiliarias enable row level security;

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  role public.app_role not null default 'corretor',
  created_at timestamptz not null default now(),
  unique (user_id, imobiliaria_id)
);
create index if not exists memberships_imob_idx on public.memberships(imobiliaria_id);
grant select, insert, update, delete on public.memberships to authenticated;
grant all on public.memberships to service_role;
alter table public.memberships enable row level security;

-- Helper: usuário pertence à imobiliária?
create or replace function public.is_member(_imob uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where imobiliaria_id = _imob and user_id = auth.uid()
  );
$$;

drop policy if exists "imob member read"  on public.imobiliarias;
drop policy if exists "imob super admin write" on public.imobiliarias;
create policy "imob member read"  on public.imobiliarias for select to authenticated
  using (public.is_member(id) or public.has_role(auth.uid(),'super_admin'));
create policy "imob super admin write" on public.imobiliarias for all to authenticated
  using (public.has_role(auth.uid(),'super_admin')) with check (public.has_role(auth.uid(),'super_admin'));

drop policy if exists "memberships self read" on public.memberships;
drop policy if exists "memberships admin write" on public.memberships;
create policy "memberships self read" on public.memberships for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'super_admin'));
create policy "memberships admin write" on public.memberships for all to authenticated
  using (public.has_role(auth.uid(),'super_admin')) with check (public.has_role(auth.uid(),'super_admin'));

-- =================== DOMÍNIO ===================

create table if not exists public.imoveis (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  codigo text not null,
  tipo public.imovel_tipo not null,
  finalidade public.imovel_finalidade not null default 'venda',
  status public.imovel_status not null default 'disponivel',
  titulo text not null,
  descricao text,
  endereco text, bairro text, cidade text, uf text, cep text,
  lat numeric(10,7), lng numeric(10,7),
  valor_venda numeric(14,2), valor_locacao numeric(14,2),
  valor_condominio numeric(14,2), valor_iptu numeric(14,2),
  area_util numeric(12,2), area_total numeric(14,2),
  quartos int, suites int, banheiros int, vagas int,
  area_ha numeric(14,4), car_numero text, itr text,
  fotos jsonb not null default '[]'::jsonb,
  caracteristicas jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (imobiliaria_id, codigo)
);
create index if not exists imoveis_imob_idx on public.imoveis(imobiliaria_id);
create index if not exists imoveis_status_idx on public.imoveis(status);

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  tipo public.pessoa_tipo not null default 'pf',
  nome text not null,
  documento text, email text, telefone text,
  endereco text, observacoes text,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clientes_imob_idx on public.clientes(imobiliaria_id);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  cliente_id uuid references public.clientes(id) on delete set null,
  responsavel_id uuid references auth.users(id) on delete set null,
  imovel_id uuid references public.imoveis(id) on delete set null,
  nome text not null, email text, telefone text,
  origem public.lead_origem not null default 'site',
  status public.lead_status not null default 'novo',
  score int not null default 0,
  interesse text, observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_imob_idx on public.leads(imobiliaria_id);
create index if not exists leads_status_idx on public.leads(status);

create table if not exists public.contratos (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  imovel_id uuid references public.imoveis(id) on delete set null,
  cliente_id uuid references public.clientes(id) on delete set null,
  tipo public.contrato_tipo not null,
  status public.contrato_status not null default 'rascunho',
  valor numeric(14,2),
  inicio date, fim date,
  metadados jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contratos_imob_idx on public.contratos(imobiliaria_id);

create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  imovel_id uuid references public.imoveis(id) on delete cascade,
  contrato_id uuid references public.contratos(id) on delete cascade,
  cliente_id uuid references public.clientes(id) on delete cascade,
  nome text not null, tipo text not null, url text not null,
  mime_type text, tamanho int, versao int not null default 1,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists documentos_imob_idx on public.documentos(imobiliaria_id);

create table if not exists public.tarefas (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  responsavel_id uuid references auth.users(id) on delete set null,
  lead_id uuid references public.leads(id) on delete cascade,
  cliente_id uuid references public.clientes(id) on delete cascade,
  imovel_id uuid references public.imoveis(id) on delete set null,
  titulo text not null, descricao text,
  status public.tarefa_status not null default 'aberta',
  vencimento timestamptz, concluida_em timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists tarefas_imob_idx on public.tarefas(imobiliaria_id);
create index if not exists tarefas_status_idx on public.tarefas(status);

create table if not exists public.mensagens (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  cliente_id uuid references public.clientes(id) on delete set null,
  canal public.mensagem_canal not null,
  direcao public.mensagem_direcao not null,
  de text, para text, assunto text, corpo text,
  lida boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists mensagens_imob_idx on public.mensagens(imobiliaria_id);
create index if not exists mensagens_lead_idx on public.mensagens(lead_id);

create table if not exists public.lancamentos (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  contrato_id uuid references public.contratos(id) on delete set null,
  tipo public.lancamento_tipo not null,
  status public.lancamento_status not null default 'pendente',
  categoria text, descricao text not null,
  valor numeric(14,2) not null,
  vencimento date, pago_em date,
  created_at timestamptz not null default now()
);
create index if not exists lancamentos_imob_idx on public.lancamentos(imobiliaria_id);
create index if not exists lancamentos_status_idx on public.lancamentos(status);

-- =================== GRANTS DE DOMÍNIO ===================
grant select, insert, update, delete on
  public.imoveis, public.clientes, public.leads, public.contratos,
  public.documentos, public.tarefas, public.mensagens, public.lancamentos
to authenticated;

grant all on
  public.imoveis, public.clientes, public.leads, public.contratos,
  public.documentos, public.tarefas, public.mensagens, public.lancamentos
to service_role;

-- =================== RLS DE DOMÍNIO (multi-tenant) ===================
-- Padrão: acesso permitido se o usuário for membro da imobiliária da linha
-- OU super_admin. Escrita idem.

do $$
declare
  t text;
  tables text[] := array[
    'imoveis','clientes','leads','contratos',
    'documentos','tarefas','mensagens','lancamentos'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "tenant read"  on public.%I', t);
    execute format('drop policy if exists "tenant write" on public.%I', t);
    execute format($f$
      create policy "tenant read" on public.%I for select to authenticated
      using (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'))
    $f$, t);
    execute format($f$
      create policy "tenant write" on public.%I for all to authenticated
      using (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'))
      with check (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'))
    $f$, t);
  end loop;
end $$;

-- =================== SEED MÍNIMO (opcional) ===================
-- Descomente para criar uma imobiliária de exemplo:
-- insert into public.imobiliarias (nome, slug) values ('Terra & Lar', 'terra-e-lar')
-- on conflict (slug) do nothing;

-- Fim.
