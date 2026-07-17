import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { requireAuth } from "./auth-middleware";
import { db, schema } from "./db.server";
import { resolveImobiliariaId } from "./tenant.server";

const upsertSchema = z.object({
  tipo: z.enum(["pf", "pj"]).default("pf"),
  nome: z.string().min(1).max(200),
  documento: z.string().max(20).optional(),
  email: z.string().email().optional(),
  telefone: z.string().max(30).optional(),
  endereco: z.string().max(200).optional(),
  observacoes: z.string().max(4000).optional(),
  tags: z.array(z.string().max(40)).default([]),
});

export const listClientes = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ busca: z.string().trim().max(120).optional() }).default({}).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const rows = await db
      .select()
      .from(schema.clientes)
      .where(eq(schema.clientes.imobiliariaId, imobiliariaId))
      .orderBy(desc(schema.clientes.createdAt))
      .limit(200);
    const q = data.busca?.toLowerCase();
    return q
      ? rows.filter((r) =>
          `${r.nome} ${r.email ?? ""} ${r.telefone ?? ""} ${r.documento ?? ""}`
            .toLowerCase()
            .includes(q),
        )
      : rows;
  });

export const getCliente = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .select()
      .from(schema.clientes)
      .where(and(eq(schema.clientes.id, data.id), eq(schema.clientes.imobiliariaId, imobiliariaId)));
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

export const createCliente = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .insert(schema.clientes)
      .values({ ...data, imobiliariaId })
      .returning();
    return row;
  });

export const updateCliente = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), patch: upsertSchema.partial() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    const [row] = await db
      .update(schema.clientes)
      .set({ ...data.patch, updatedAt: new Date() })
      .where(and(eq(schema.clientes.id, data.id), eq(schema.clientes.imobiliariaId, imobiliariaId)))
      .returning();
    if (!row) throw new Response("Não encontrado", { status: 404 });
    return row;
  });

export const deleteCliente = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const imobiliariaId = await resolveImobiliariaId(context.userId);
    await db
      .delete(schema.clientes)
      .where(and(eq(schema.clientes.id, data.id), eq(schema.clientes.imobiliariaId, imobiliariaId)));
    return { ok: true };
  });
