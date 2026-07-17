import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../db/schema";

type PgClient = ReturnType<typeof postgres>;
type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __pg?: PgClient;
  __drizzle?: DrizzleDb;
};

function getDb(): DrizzleDb {
  if (globalForDb.__drizzle) return globalForDb.__drizzle;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não configurada");
  }
  const client = globalForDb.__pg ?? postgres(url, { max: 10 });
  if (!globalForDb.__pg) globalForDb.__pg = client;
  const instance = drizzle(client, { schema });
  globalForDb.__drizzle = instance;
  return instance;
}

// Proxy que só resolve o cliente quando efetivamente for usado (dentro de handlers).
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop, receiver) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? (value as Function).bind(real) : value;
  },
}) as DrizzleDb;

export { schema };
