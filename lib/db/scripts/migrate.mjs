#!/usr/bin/env node
/**
 * Applies every SQL file in ../migrations in lexical order.
 *
 * Each file runs inside a transaction and is recorded in the
 * `_migrations` table, so re-running only applies new files.
 *
 * Usage: pnpm --filter @workspace/db run migrate
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "..", "migrations");

const CANDIDATE_KEYS = [
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL",
  "POSTGRES_URL",
];

function resolveConnectionString() {
  for (const key of CANDIDATE_KEYS) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  throw new Error(
    `No Postgres connection string found. Set one of: ${CANDIDATE_KEYS.join(", ")}.`,
  );
}

function isLocal(url) {
  return /^postgres(ql)?:\/\/[^/]*(localhost|127\.0\.0\.1)/i.test(url);
}

// `sslmode=require` in the URL makes node-postgres do full certificate
// verification, which fails against managed providers' self-signed chains.
function stripSslMode(url) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("ssl");
    return parsed.toString();
  } catch {
    return url;
  }
}

async function main() {
  const raw = resolveConnectionString();
  const local = isLocal(raw);

  const client = new pg.Client({
    connectionString: local ? raw : stripSslMode(raw),
    ...(local ? {} : { ssl: { rejectUnauthorized: false } }),
    connectionTimeoutMillis: 20000,
  });

  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_migrations" (
        "name" text PRIMARY KEY,
        "applied_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    const { rows } = await client.query(`SELECT name FROM "_migrations"`);
    const applied = new Set(rows.map((r) => r.name));

    const files = (await fs.readdir(migrationsDir))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`- skip ${file} (already applied)`);
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      console.log(`- apply ${file}`);

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(`INSERT INTO "_migrations" (name) VALUES ($1)`, [
          file,
        ]);
        await client.query("COMMIT");
        count += 1;
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${error.message}`);
      }
    }

    console.log(
      count === 0
        ? "Database already up to date."
        : `Applied ${count} migration(s).`,
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
