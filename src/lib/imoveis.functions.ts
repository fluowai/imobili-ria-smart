import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { requireAuth } from "./auth-middleware";
import { db, schema } from "./db.server";
import { resolveImobiliariaId } from "./tenant.server";

const listSchema = z
  .object({
    tipo: z.enum(["urbano", "rural"]).optional(),
    status: z
      .enum(["disponivel", "reservado", "vendido", "alugado", "inativo"])
      .optional(),
    busca: z.string().trim().max(120).optional(),
  })
  .default({});

export const listImoveis = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => listSchema.parse(data ?? {}))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const filters = [eq(schema.imoveis.imobiliariaId, imobiliariaId)];
    if (data.tipo) filters.push(eq(schema.imoveis.tipo, data.tipo));
    if (data.status) filters.push(eq(schema.imoveis.status, data.status));

    const rows = await db
      .select()
      .from(schema.imoveis)
      .where(and(...filters))
      .orderBy(desc(schema.imoveis.createdAt))
      .limit(200);

    const q = data.busca?.toLowerCase();
    return q
      ? rows.filter((r) =>
          `${r.titulo} ${r.codigo} ${r.bairro ?? ""} ${r.cidade ?? ""}`
            .toLowerCase()
            .includes(q),
        )
      : rows;
  });

export const getImovel = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .select()
      .from(schema.imoveis)
      .where(and(eq(schema.imoveis.id, data.id), eq(schema.imoveis.imobiliariaId, imobiliariaId)));
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

const upsertSchema = z.object({
  codigo: z.string().min(1).max(40),
  tipo: z.enum(["urbano", "rural"]),
  finalidade: z.enum(["venda", "locacao", "ambos"]).default("venda"),
  status: z
    .enum(["disponivel", "reservado", "vendido", "alugado", "inativo"])
    .default("disponivel"),
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(4000).optional(),
  endereco: z.string().max(200).optional(),
  bairro: z.string().max(120).optional(),
  cidade: z.string().max(120).optional(),
  uf: z.string().length(2).optional(),
  cep: z.string().max(12).optional(),
  valorVenda: z.number().nonnegative().optional(),
  valorLocacao: z.number().nonnegative().optional(),
  valorCondominio: z.number().nonnegative().optional(),
  valorIptu: z.number().nonnegative().optional(),
  areaUtil: z.number().nonnegative().optional(),
  areaTotal: z.number().nonnegative().optional(),
  quartos: z.number().int().nonnegative().optional(),
  suites: z.number().int().nonnegative().optional(),
  banheiros: z.number().int().nonnegative().optional(),
  vagas: z.number().int().nonnegative().optional(),
  areaHa: z.number().nonnegative().optional(),
  carNumero: z.string().max(80).optional(),
  itr: z.string().max(80).optional(),
  fotos: z.array(z.string().url()).default([]),
  caracteristicas: z.record(z.unknown()).default({}),
});

const numToStr = (v: number | undefined) => (v === undefined ? undefined : String(v));

function normalize(input: z.infer<typeof upsertSchema>) {
  return {
    codigo: input.codigo,
    tipo: input.tipo,
    finalidade: input.finalidade,
    status: input.status,
    titulo: input.titulo,
    descricao: input.descricao,
    endereco: input.endereco,
    bairro: input.bairro,
    cidade: input.cidade,
    uf: input.uf,
    cep: input.cep,
    valorVenda: numToStr(input.valorVenda),
    valorLocacao: numToStr(input.valorLocacao),
    valorCondominio: numToStr(input.valorCondominio),
    valorIptu: numToStr(input.valorIptu),
    areaUtil: numToStr(input.areaUtil),
    areaTotal: numToStr(input.areaTotal),
    quartos: input.quartos,
    suites: input.suites,
    banheiros: input.banheiros,
    vagas: input.vagas,
    areaHa: numToStr(input.areaHa),
    carNumero: input.carNumero,
    itr: input.itr,
    fotos: input.fotos,
    caracteristicas: input.caracteristicas,
  };
}

export const createImovel = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .insert(schema.imoveis)
      .values({ ...normalize(data), imobiliariaId, createdBy: context.userId })
      .returning();
    return row;
  });

export const updateImovel = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), patch: upsertSchema.partial() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const patch = upsertSchema.partial().parse(data.patch);
    const values: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) continue;
      if (
        [
          "valorVenda",
          "valorLocacao",
          "valorCondominio",
          "valorIptu",
          "areaUtil",
          "areaTotal",
          "areaHa",
        ].includes(k)
      ) {
        values[k] = String(v);
      } else {
        values[k] = v;
      }
    }
    values.updatedAt = new Date();
    const [row] = await db
      .update(schema.imoveis)
      .set(values)
      .where(and(eq(schema.imoveis.id, data.id), eq(schema.imoveis.imobiliariaId, imobiliariaId)))
      .returning();
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

export const deleteImovel = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    await db
      .delete(schema.imoveis)
      .where(and(eq(schema.imoveis.id, data.id), eq(schema.imoveis.imobiliariaId, imobiliariaId)));
    return { ok: true };
  });
