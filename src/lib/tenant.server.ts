import { eq } from "drizzle-orm";
import { db, schema } from "./db.server";

/**
 * Resolve a imobiliária ativa do usuário. Por enquanto, usamos a primeira
 * membership encontrada. Depois adicionaremos seletor de workspace no header.
 */
export async function resolveImobiliariaId(userId: string): Promise<string> {
  const [m] = await db
    .select({ imobiliariaId: schema.memberships.imobiliariaId })
    .from(schema.memberships)
    .where(eq(schema.memberships.userId, userId))
    .limit(1);
  if (!m) throw new Response("Sem imobiliária vinculada", { status: 403 });
  return m.imobiliariaId;
}
