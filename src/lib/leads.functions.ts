import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { requireAuth } from "./auth-middleware";
import { db, schema } from "./db.server";
import { resolveImobiliariaId } from "./tenant.server";

const statusEnum = z.enum([
  "novo",
  "qualificando",
  "visita",
  "proposta",
  "fechado",
  "perdido",
]);
const origemEnum = z.enum(["site", "whatsapp", "instagram", "portal", "indicacao", "outros"]);

const upsertSchema = z.object({
  clienteId: z.string().uuid().optional(),
  responsavelId: z.string().uuid().optional(),
  imovelId: z.string().uuid().optional(),
  nome: z.string().min(1).max(200),
  email: z.string().email().optional(),
  telefone: z.string().max(30).optional(),
  origem: origemEnum.default("site"),
  status: statusEnum.default("novo"),
  score: z.number().int().min(0).max(100).default(0),
  interesse: z.string().max(400).optional(),
  observacoes: z.string().max(4000).optional(),
});

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ status: statusEnum.optional() }).default({}).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const filters = [eq(schema.leads.imobiliariaId, imobiliariaId)];
    if (data.status) filters.push(eq(schema.leads.status, data.status));
    return db
      .select()
      .from(schema.leads)
      .where(and(...filters))
      .orderBy(desc(schema.leads.createdAt))
      .limit(500);
  });

export const createLead = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .insert(schema.leads)
      .values({ ...data, imobiliariaId })
      .returning();
    return row;
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), patch: upsertSchema.partial() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .update(schema.leads)
      .set({ ...data.patch, updatedAt: new Date() })
      .where(and(eq(schema.leads.id, data.id), eq(schema.leads.imobiliariaId, imobiliariaId)))
      .returning();
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    await db
      .delete(schema.leads)
      .where(and(eq(schema.leads.id, data.id), eq(schema.leads.imobiliariaId, imobiliariaId)));
    return { ok: true };
  });
