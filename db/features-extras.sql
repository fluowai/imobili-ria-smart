-- ============================================================
-- FEATURES EXTRAS: Migrador de imóveis + Criativos IA
-- Rode no Supabase SQL Editor depois do db/supabase.sql
-- ============================================================

-- Migrações de imóveis (scraping)
create table if not exists public.migracoes (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  url_origem text not null,
  status text not null default 'pendente', -- pendente | rodando | concluida | erro
  total_encontrados int not null default 0,
  total_importados int not null default 0,
  total_erros int not null default 0,
  log jsonb not null default '[]'::jsonb,
  iniciado_por uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists migracoes_imob_idx on public.migracoes(imobiliaria_id);
grant select, insert, update, delete on public.migracoes to authenticated;
grant all on public.migracoes to service_role;
alter table public.migracoes enable row level security;

drop policy if exists "migracoes tenant read" on public.migracoes;
drop policy if exists "migracoes tenant write" on public.migracoes;
create policy "migracoes tenant read" on public.migracoes for select to authenticated
  using (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'));
create policy "migracoes tenant write" on public.migracoes for all to authenticated
  using (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'))
  with check (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'));

-- Criativos gerados
create table if not exists public.criativos (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references public.imobiliarias(id) on delete cascade,
  imovel_id uuid references public.imoveis(id) on delete set null,
  formato text not null default 'feed', -- feed | story | carrossel
  copy text not null,
  hashtags text,
  cta text,
  logo_url text,
  imagem_url text, -- data URL ou URL pública
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists criativos_imob_idx on public.criativos(imobiliaria_id);
grant select, insert, update, delete on public.criativos to authenticated;
grant all on public.criativos to service_role;
alter table public.criativos enable row level security;

drop policy if exists "criativos tenant read" on public.criativos;
drop policy if exists "criativos tenant write" on public.criativos;
create policy "criativos tenant read" on public.criativos for select to authenticated
  using (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'));
create policy "criativos tenant write" on public.criativos for all to authenticated
  using (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'))
  with check (public.is_member(imobiliaria_id) or public.has_role(auth.uid(),'super_admin'));
