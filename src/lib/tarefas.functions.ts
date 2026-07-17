import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { requireAuth } from "./auth-middleware";
import { db, schema } from "./db.server";
import { resolveImobiliariaId } from "./tenant.server";

const statusEnum = z.enum(["aberta", "em_andamento", "concluida", "cancelada"]);

const upsertSchema = z.object({
  responsavelId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  clienteId: z.string().uuid().optional(),
  imovelId: z.string().uuid().optional(),
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(4000).optional(),
  status: statusEnum.default("aberta"),
  vencimento: z.string().datetime().optional(),
});

function normalize(data: z.infer<typeof upsertSchema>) {
  return {
    ...data,
    vencimento: data.vencimento ? new Date(data.vencimento) : undefined,
  };
}

export const listTarefas = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ status: statusEnum.optional() }).default({}).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const filters = [eq(schema.tarefas.imobiliariaId, imobiliariaId)];
    if (data.status) filters.push(eq(schema.tarefas.status, data.status));
    return db
      .select()
      .from(schema.tarefas)
      .where(and(...filters))
      .orderBy(desc(schema.tarefas.createdAt))
      .limit(500);
  });

export const createTarefa = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .insert(schema.tarefas)
      .values({ ...normalize(data), imobiliariaId })
      .returning();
    return row;
  });

export const updateTarefa = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), patch: upsertSchema.partial() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const patch: Record<string, unknown> = { ...data.patch };
    if (typeof patch.vencimento === "string") patch.vencimento = new Date(patch.vencimento);
    if (patch.status === "concluida" && !patch.concluidaEm) patch.concluidaEm = new Date();
    const [row] = await db
      .update(schema.tarefas)
      .set(patch)
      .where(and(eq(schema.tarefas.id, data.id), eq(schema.tarefas.imobiliariaId, imobiliariaId)))
      .returning();
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

export const deleteTarefa = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    await db
      .delete(schema.tarefas)
      .where(and(eq(schema.tarefas.id, data.id), eq(schema.tarefas.imobiliariaId, imobiliariaId)));
    return { ok: true };
  });
