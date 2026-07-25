/**
 * Resolves the Postgres connection string from the environment.
 *
 * Different hosts expose the connection string under different names:
 *  - `DATABASE_URL`            — the canonical name used by this workspace
 *  - `POSTGRES_URL`            — injected by Vercel Postgres / Supabase integrations
 *  - `POSTGRES_URL_NON_POOLING`— direct (non-pooled) connection, used for migrations
 *
 * Resolving here keeps every consumer (app runtime, drizzle-kit, scripts) in sync
 * instead of each one hard-coding a single variable name.
 */
const POOLED_KEYS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

const DIRECT_KEYS = [
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL",
  "POSTGRES_URL",
] as const;

function firstNonEmpty(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim().length > 0) return value.trim();
  }
  return undefined;
}

export function findConnectionString(): string | undefined {
  return firstNonEmpty(POOLED_KEYS);
}

export function isLocalConnection(url: string): boolean {
  return /^postgres(ql)?:\/\/[^/]*(localhost|127\.0\.0\.1)/i.test(url);
}

/**
 * `node-postgres` maps `sslmode=require` in the connection string onto
 * `verify-full`, which rejects the self-signed certificate chains used by
 * managed providers (Supabase pooler, Neon, RDS) and overrides any `ssl`
 * option passed to the client. Stripping `sslmode` lets the explicit `ssl`
 * option in `src/index.ts` take effect.
 */
export function stripSslMode(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("ssl");
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Connection string for long-lived pooled app connections.
 * Throws a descriptive error when no database is configured.
 */
export function getConnectionString(): string {
  const url = findConnectionString();
  if (!url) {
    throw new Error(
      `No Postgres connection string found. Set one of: ${POOLED_KEYS.join(", ")}.`,
    );
  }
  return url;
}

/**
 * Connection string for schema migrations. Prefers a direct (non-pooled)
 * connection because DDL over a transaction pooler is unreliable.
 */
export function getMigrationConnectionString(): string {
  const url = firstNonEmpty(DIRECT_KEYS);
  if (!url) {
    throw new Error(
      `No Postgres connection string found. Set one of: ${DIRECT_KEYS.join(", ")}.`,
    );
  }
  return url;
}
