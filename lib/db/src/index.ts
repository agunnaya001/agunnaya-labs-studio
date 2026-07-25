import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import {
  getConnectionString,
  isLocalConnection,
  stripSslMode,
} from "./connection-string";

const { Pool } = pg;

const rawConnectionString = getConnectionString();
const isLocal = isLocalConnection(rawConnectionString);

// Managed Postgres providers (Supabase, Neon, RDS) require TLS but present
// certificates that are not in Node's default trust store.
export const pool = new Pool({
  connectionString: isLocal
    ? rawConnectionString
    : stripSslMode(rawConnectionString),
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
  max: 5,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
export { findConnectionString, getConnectionString } from "./connection-string";
