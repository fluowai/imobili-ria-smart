import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
  numeric,
  integer,
  boolean,
  jsonb,
  date,
} from "drizzle-orm/pg-core";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JsonValue }
  | JsonValue[];
export type JsonObject = { [k: string]: JsonValue };

// Roles globais e por imobiliária
export const appRoleEnum = pgEnum("app_role", [
  "super_admin",
  "admin_imob",
  "corretor",
  "cliente",
]);

// Usuários
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    nome: text("nome").notNull(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    userAgent: text("user_agent"),
    ip: text("ip"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("sessions_user_idx").on(t.userId) }),
);

export const imobiliarias = pgTable("imobiliarias", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  cnpj: text("cnpj"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    role: appRoleEnum("role").notNull().default("corretor"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ unq: uniqueIndex("memberships_user_imob_idx").on(t.userId, t.imobiliariaId) }),
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: appRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ unq: uniqueIndex("user_roles_user_role_idx").on(t.userId, t.role) }),
);

// ============== DOMÍNIO IMOBILIÁRIO ==============

export const imovelTipoEnum = pgEnum("imovel_tipo", ["urbano", "rural"]);
export const imovelStatusEnum = pgEnum("imovel_status", [
  "disponivel",
  "reservado",
  "vendido",
  "alugado",
  "inativo",
]);
export const finalidadeEnum = pgEnum("imovel_finalidade", ["venda", "locacao", "ambos"]);

// Imóveis (urbano + rural em uma tabela, com campos específicos em jsonb)
export const imoveis = pgTable(
  "imoveis",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    codigo: text("codigo").notNull(),
    tipo: imovelTipoEnum("tipo").notNull(),
    finalidade: finalidadeEnum("finalidade").notNull().default("venda"),
    status: imovelStatusEnum("status").notNull().default("disponivel"),
    titulo: text("titulo").notNull(),
    descricao: text("descricao"),
    // localização
    endereco: text("endereco"),
    bairro: text("bairro"),
    cidade: text("cidade"),
    uf: text("uf"),
    cep: text("cep"),
    lat: numeric("lat", { precision: 10, scale: 7 }),
    lng: numeric("lng", { precision: 10, scale: 7 }),
    // valores
    valorVenda: numeric("valor_venda", { precision: 14, scale: 2 }),
    valorLocacao: numeric("valor_locacao", { precision: 14, scale: 2 }),
    valorCondominio: numeric("valor_condominio", { precision: 14, scale: 2 }),
    valorIptu: numeric("valor_iptu", { precision: 14, scale: 2 }),
    // urbano
    areaUtil: numeric("area_util", { precision: 12, scale: 2 }),
    areaTotal: numeric("area_total", { precision: 14, scale: 2 }),
    quartos: integer("quartos"),
    suites: integer("suites"),
    banheiros: integer("banheiros"),
    vagas: integer("vagas"),
    // rural
    areaHa: numeric("area_ha", { precision: 14, scale: 4 }),
    carNumero: text("car_numero"),
    itr: text("itr"),
    // extras
    fotos: jsonb("fotos").$type<string[]>().default([]).notNull(),
    caracteristicas: jsonb("caracteristicas").$type<JsonObject>().default({}).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    codigoIdx: uniqueIndex("imoveis_imob_codigo_idx").on(t.imobiliariaId, t.codigo),
    imobIdx: index("imoveis_imob_idx").on(t.imobiliariaId),
    statusIdx: index("imoveis_status_idx").on(t.status),
  }),
);

// Clientes / Leads
export const pessoaTipoEnum = pgEnum("pessoa_tipo", ["pf", "pj"]);
export const clientes = pgTable(
  "clientes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    tipo: pessoaTipoEnum("tipo").notNull().default("pf"),
    nome: text("nome").notNull(),
    documento: text("documento"), // CPF/CNPJ
    email: text("email"),
    telefone: text("telefone"),
    endereco: text("endereco"),
    observacoes: text("observacoes"),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ imobIdx: index("clientes_imob_idx").on(t.imobiliariaId) }),
);

export const leadStatusEnum = pgEnum("lead_status", [
  "novo",
  "qualificando",
  "visita",
  "proposta",
  "fechado",
  "perdido",
]);
export const leadOrigemEnum = pgEnum("lead_origem", [
  "site",
  "whatsapp",
  "instagram",
  "portal",
  "indicacao",
  "outros",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
    responsavelId: uuid("responsavel_id").references(() => users.id, { onDelete: "set null" }),
    imovelId: uuid("imovel_id").references(() => imoveis.id, { onDelete: "set null" }),
    nome: text("nome").notNull(),
    email: text("email"),
    telefone: text("telefone"),
    origem: leadOrigemEnum("origem").notNull().default("site"),
    status: leadStatusEnum("status").notNull().default("novo"),
    score: integer("score").default(0).notNull(),
    interesse: text("interesse"),
    observacoes: text("observacoes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    imobIdx: index("leads_imob_idx").on(t.imobiliariaId),
    statusIdx: index("leads_status_idx").on(t.status),
  }),
);

// Contratos
export const contratoTipoEnum = pgEnum("contrato_tipo", [
  "venda",
  "locacao",
  "captacao",
  "administracao",
]);
export const contratoStatusEnum = pgEnum("contrato_status", [
  "rascunho",
  "enviado",
  "assinado",
  "vigente",
  "encerrado",
  "cancelado",
]);

export const contratos = pgTable(
  "contratos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    imovelId: uuid("imovel_id").references(() => imoveis.id, { onDelete: "set null" }),
    clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
    tipo: contratoTipoEnum("tipo").notNull(),
    status: contratoStatusEnum("status").notNull().default("rascunho"),
    valor: numeric("valor", { precision: 14, scale: 2 }),
    inicio: date("inicio"),
    fim: date("fim"),
    metadados: jsonb("metadados").$type<JsonObject>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ imobIdx: index("contratos_imob_idx").on(t.imobiliariaId) }),
);

// Documentos (GED)
export const documentos = pgTable(
  "documentos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    imovelId: uuid("imovel_id").references(() => imoveis.id, { onDelete: "cascade" }),
    contratoId: uuid("contrato_id").references(() => contratos.id, { onDelete: "cascade" }),
    clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "cascade" }),
    nome: text("nome").notNull(),
    tipo: text("tipo").notNull(),
    url: text("url").notNull(),
    mimeType: text("mime_type"),
    tamanho: integer("tamanho"),
    versao: integer("versao").default(1).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ imobIdx: index("documentos_imob_idx").on(t.imobiliariaId) }),
);

// Tarefas / atividades do CRM
export const tarefaStatusEnum = pgEnum("tarefa_status", ["aberta", "em_andamento", "concluida", "cancelada"]);

export const tarefas = pgTable(
  "tarefas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    responsavelId: uuid("responsavel_id").references(() => users.id, { onDelete: "set null" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
    clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "cascade" }),
    imovelId: uuid("imovel_id").references(() => imoveis.id, { onDelete: "set null" }),
    titulo: text("titulo").notNull(),
    descricao: text("descricao"),
    status: tarefaStatusEnum("status").notNull().default("aberta"),
    vencimento: timestamp("vencimento", { withTimezone: true }),
    concluidaEm: timestamp("concluida_em", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    imobIdx: index("tarefas_imob_idx").on(t.imobiliariaId),
    statusIdx: index("tarefas_status_idx").on(t.status),
  }),
);

// Mensagens (caixa unificada leve — corpo real fica no provedor)
export const mensagemCanalEnum = pgEnum("mensagem_canal", [
  "whatsapp",
  "email",
  "sms",
  "instagram",
  "chat_site",
]);
export const mensagemDirecaoEnum = pgEnum("mensagem_direcao", ["in", "out"]);

export const mensagens = pgTable(
  "mensagens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
    canal: mensagemCanalEnum("canal").notNull(),
    direcao: mensagemDirecaoEnum("direcao").notNull(),
    de: text("de"),
    para: text("para"),
    assunto: text("assunto"),
    corpo: text("corpo"),
    lida: boolean("lida").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    imobIdx: index("mensagens_imob_idx").on(t.imobiliariaId),
    leadIdx: index("mensagens_lead_idx").on(t.leadId),
  }),
);

// Financeiro — lançamentos simples
export const lancamentoTipoEnum = pgEnum("lancamento_tipo", ["receita", "despesa"]);
export const lancamentoStatusEnum = pgEnum("lancamento_status", ["pendente", "pago", "atrasado", "cancelado"]);

export const lancamentos = pgTable(
  "lancamentos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    imobiliariaId: uuid("imobiliaria_id").notNull().references(() => imobiliarias.id, { onDelete: "cascade" }),
    contratoId: uuid("contrato_id").references(() => contratos.id, { onDelete: "set null" }),
    tipo: lancamentoTipoEnum("tipo").notNull(),
    status: lancamentoStatusEnum("status").notNull().default("pendente"),
    categoria: text("categoria"),
    descricao: text("descricao").notNull(),
    valor: numeric("valor", { precision: 14, scale: 2 }).notNull(),
    vencimento: date("vencimento"),
    pagoEm: date("pago_em"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    imobIdx: index("lancamentos_imob_idx").on(t.imobiliariaId),
    statusIdx: index("lancamentos_status_idx").on(t.status),
  }),
);
