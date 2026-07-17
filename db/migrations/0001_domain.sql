-- Domínio imobiliário: imóveis, clientes, leads, contratos, documentos, tarefas, mensagens, financeiro

CREATE TYPE "public"."imovel_tipo" AS ENUM('urbano', 'rural');--> statement-breakpoint
CREATE TYPE "public"."imovel_status" AS ENUM('disponivel', 'reservado', 'vendido', 'alugado', 'inativo');--> statement-breakpoint
CREATE TYPE "public"."imovel_finalidade" AS ENUM('venda', 'locacao', 'ambos');--> statement-breakpoint
CREATE TYPE "public"."pessoa_tipo" AS ENUM('pf', 'pj');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('novo', 'qualificando', 'visita', 'proposta', 'fechado', 'perdido');--> statement-breakpoint
CREATE TYPE "public"."lead_origem" AS ENUM('site', 'whatsapp', 'instagram', 'portal', 'indicacao', 'outros');--> statement-breakpoint
CREATE TYPE "public"."contrato_tipo" AS ENUM('venda', 'locacao', 'captacao', 'administracao');--> statement-breakpoint
CREATE TYPE "public"."contrato_status" AS ENUM('rascunho', 'enviado', 'assinado', 'vigente', 'encerrado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."tarefa_status" AS ENUM('aberta', 'em_andamento', 'concluida', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."mensagem_canal" AS ENUM('whatsapp', 'email', 'sms', 'instagram', 'chat_site');--> statement-breakpoint
CREATE TYPE "public"."mensagem_direcao" AS ENUM('in', 'out');--> statement-breakpoint
CREATE TYPE "public"."lancamento_tipo" AS ENUM('receita', 'despesa');--> statement-breakpoint
CREATE TYPE "public"."lancamento_status" AS ENUM('pendente', 'pago', 'atrasado', 'cancelado');--> statement-breakpoint

CREATE TABLE "imoveis" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "codigo" text NOT NULL,
  "tipo" "imovel_tipo" NOT NULL,
  "finalidade" "imovel_finalidade" DEFAULT 'venda' NOT NULL,
  "status" "imovel_status" DEFAULT 'disponivel' NOT NULL,
  "titulo" text NOT NULL,
  "descricao" text,
  "endereco" text,
  "bairro" text,
  "cidade" text,
  "uf" text,
  "cep" text,
  "lat" numeric(10, 7),
  "lng" numeric(10, 7),
  "valor_venda" numeric(14, 2),
  "valor_locacao" numeric(14, 2),
  "valor_condominio" numeric(14, 2),
  "valor_iptu" numeric(14, 2),
  "area_util" numeric(12, 2),
  "area_total" numeric(14, 2),
  "quartos" integer,
  "suites" integer,
  "banheiros" integer,
  "vagas" integer,
  "area_ha" numeric(14, 4),
  "car_numero" text,
  "itr" text,
  "fotos" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "caracteristicas" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_by" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "clientes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "tipo" "pessoa_tipo" DEFAULT 'pf' NOT NULL,
  "nome" text NOT NULL,
  "documento" text,
  "email" text,
  "telefone" text,
  "endereco" text,
  "observacoes" text,
  "tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "leads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "cliente_id" uuid,
  "responsavel_id" uuid,
  "imovel_id" uuid,
  "nome" text NOT NULL,
  "email" text,
  "telefone" text,
  "origem" "lead_origem" DEFAULT 'site' NOT NULL,
  "status" "lead_status" DEFAULT 'novo' NOT NULL,
  "score" integer DEFAULT 0 NOT NULL,
  "interesse" text,
  "observacoes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "contratos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "imovel_id" uuid,
  "cliente_id" uuid,
  "tipo" "contrato_tipo" NOT NULL,
  "status" "contrato_status" DEFAULT 'rascunho' NOT NULL,
  "valor" numeric(14, 2),
  "inicio" date,
  "fim" date,
  "metadados" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "documentos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "imovel_id" uuid,
  "contrato_id" uuid,
  "cliente_id" uuid,
  "nome" text NOT NULL,
  "tipo" text NOT NULL,
  "url" text NOT NULL,
  "mime_type" text,
  "tamanho" integer,
  "versao" integer DEFAULT 1 NOT NULL,
  "created_by" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "tarefas" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "responsavel_id" uuid,
  "lead_id" uuid,
  "cliente_id" uuid,
  "imovel_id" uuid,
  "titulo" text NOT NULL,
  "descricao" text,
  "status" "tarefa_status" DEFAULT 'aberta' NOT NULL,
  "vencimento" timestamp with time zone,
  "concluida_em" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "mensagens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "lead_id" uuid,
  "cliente_id" uuid,
  "canal" "mensagem_canal" NOT NULL,
  "direcao" "mensagem_direcao" NOT NULL,
  "de" text,
  "para" text,
  "assunto" text,
  "corpo" text,
  "lida" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "lancamentos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "imobiliaria_id" uuid NOT NULL,
  "contrato_id" uuid,
  "tipo" "lancamento_tipo" NOT NULL,
  "status" "lancamento_status" DEFAULT 'pendente' NOT NULL,
  "categoria" text,
  "descricao" text NOT NULL,
  "valor" numeric(14, 2) NOT NULL,
  "vencimento" date,
  "pago_em" date,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

-- FKs
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action;--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_cliente_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_responsavel_fk" FOREIGN KEY ("responsavel_id") REFERENCES "public"."users"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_imovel_fk" FOREIGN KEY ("imovel_id") REFERENCES "public"."imoveis"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_imovel_fk" FOREIGN KEY ("imovel_id") REFERENCES "public"."imoveis"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_cliente_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_imovel_fk" FOREIGN KEY ("imovel_id") REFERENCES "public"."imoveis"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_contrato_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_cliente_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_responsavel_fk" FOREIGN KEY ("responsavel_id") REFERENCES "public"."users"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_lead_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_cliente_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_imovel_fk" FOREIGN KEY ("imovel_id") REFERENCES "public"."imoveis"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_lead_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_cliente_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_imob_fk" FOREIGN KEY ("imobiliaria_id") REFERENCES "public"."imobiliarias"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_contrato_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE set null;--> statement-breakpoint

-- Índices
CREATE UNIQUE INDEX "imoveis_imob_codigo_idx" ON "imoveis" USING btree ("imobiliaria_id","codigo");--> statement-breakpoint
CREATE INDEX "imoveis_imob_idx" ON "imoveis" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "imoveis_status_idx" ON "imoveis" USING btree ("status");--> statement-breakpoint
CREATE INDEX "clientes_imob_idx" ON "clientes" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "leads_imob_idx" ON "leads" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contratos_imob_idx" ON "contratos" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "documentos_imob_idx" ON "documentos" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "tarefas_imob_idx" ON "tarefas" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "tarefas_status_idx" ON "tarefas" USING btree ("status");--> statement-breakpoint
CREATE INDEX "mensagens_imob_idx" ON "mensagens" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "mensagens_lead_idx" ON "mensagens" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lancamentos_imob_idx" ON "lancamentos" USING btree ("imobiliaria_id");--> statement-breakpoint
CREATE INDEX "lancamentos_status_idx" ON "lancamentos" USING btree ("status");
