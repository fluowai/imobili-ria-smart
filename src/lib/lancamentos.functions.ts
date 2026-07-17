import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { requireAuth } from "./auth-middleware";
import { db, schema } from "./db.server";
import { resolveImobiliariaId } from "./tenant.server";

const tipoEnum = z.enum(["receita", "despesa"]);
const statusEnum = z.enum(["pendente", "pago", "atrasado", "cancelado"]);

const upsertSchema = z.object({
  contratoId: z.string().uuid().optional(),
  tipo: tipoEnum,
  status: statusEnum.default("pendente"),
  categoria: z.string().max(80).optional(),
  descricao: z.string().min(1).max(300),
  valor: z.number().nonnegative(),
  vencimento: z.string().optional(),
  pagoEm: z.string().optional(),
});

export const listLancamentos = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ status: statusEnum.optional(), tipo: tipoEnum.optional() })
      .default({})
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const filters = [eq(schema.lancamentos.imobiliariaId, imobiliariaId)];
    if (data.status) filters.push(eq(schema.lancamentos.status, data.status));
    if (data.tipo) filters.push(eq(schema.lancamentos.tipo, data.tipo));
    return db
      .select()
      .from(schema.lancamentos)
      .where(and(...filters))
      .orderBy(desc(schema.lancamentos.createdAt))
      .limit(500);
  });

export const createLancamento = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .insert(schema.lancamentos)
      .values({
        imobiliariaId,
        contratoId: data.contratoId,
        tipo: data.tipo,
        status: data.status,
        categoria: data.categoria,
        descricao: data.descricao,
        valor: String(data.valor),
        vencimento: data.vencimento,
        pagoEm: data.pagoEm,
      })
      .returning();
    return row;
  });

export const updateLancamento = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), patch: upsertSchema.partial() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const patch: Record<string, unknown> = { ...data.patch };
    if (typeof patch.valor === "number") patch.valor = String(patch.valor);
    const [row] = await db
      .update(schema.lancamentos)
      .set(patch)
      .where(
        and(
          eq(schema.lancamentos.id, data.id),
          eq(schema.lancamentos.imobiliariaId, imobiliariaId),
        ),
      )
      .returning();
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

export const deleteLancamento = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    await db
      .delete(schema.lancamentos)
      .where(
        and(
          eq(schema.lancamentos.id, data.id),
          eq(schema.lancamentos.imobiliariaId, imobiliariaId),
        ),
      );
    return { ok: true };
  });
