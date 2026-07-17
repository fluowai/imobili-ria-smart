import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../db/schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL não configurada");
}

// singleton entre reloads em dev
const globalForDb = globalThis as unknown as { __pg?: ReturnType<typeof postgres> };
const client = globalForDb.__pg ?? postgres(url, { max: 10 });
if (!globalForDb.__pg) globalForDb.__pg = client;

export const db = drizzle(client, { schema });
export { schema };
