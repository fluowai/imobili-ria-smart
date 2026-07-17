import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { requireAuth } from "./auth-middleware";
import { db, schema } from "./db.server";
import type { JsonValue } from "../../db/schema";
import { resolveImobiliariaId } from "./tenant.server";

const tipoEnum = z.enum(["venda", "locacao", "captacao", "administracao"]);
const statusEnum = z.enum([
  "rascunho",
  "enviado",
  "assinado",
  "vigente",
  "encerrado",
  "cancelado",
]);

const upsertSchema = z.object({
  imovelId: z.string().uuid().optional(),
  clienteId: z.string().uuid().optional(),
  tipo: tipoEnum,
  status: statusEnum.default("rascunho"),
  valor: z.number().nonnegative().optional(),
  inicio: z.string().optional(),
  fim: z.string().optional(),
  metadados: z.record(z.any()).default({}) as z.ZodType<Record<string, JsonValue>>,
});

function normalize(data: z.infer<typeof upsertSchema>) {
  return {
    ...data,
    valor: data.valor === undefined ? undefined : String(data.valor),
  };
}

export const listContratos = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ status: statusEnum.optional() }).default({}).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const filters = [eq(schema.contratos.imobiliariaId, imobiliariaId)];
    if (data.status) filters.push(eq(schema.contratos.status, data.status));
    return db
      .select()
      .from(schema.contratos)
      .where(and(...filters))
      .orderBy(desc(schema.contratos.createdAt))
      .limit(500);
  });

export const createContrato = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .insert(schema.contratos)
      .values({ ...normalize(data), imobiliariaId })
      .returning();
    return row;
  });

export const updateContrato = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), patch: upsertSchema.partial() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const patch = data.patch as Record<string, unknown>;
    if (typeof patch.valor === "number") patch.valor = String(patch.valor);
    const [row] = await db
      .update(schema.contratos)
      .set({ ...patch, updatedAt: new Date() })
      .where(
        and(eq(schema.contratos.id, data.id), eq(schema.contratos.imobiliariaId, imobiliariaId)),
      )
      .returning();
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

export const deleteContrato = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    await db
      .delete(schema.contratos)
      .where(
        and(eq(schema.contratos.id, data.id), eq(schema.contratos.imobiliariaId, imobiliariaId)),
      );
    return { ok: true };
  });
