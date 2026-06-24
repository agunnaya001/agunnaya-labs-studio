# agunnaya-labs-studio — Replit / Local Quickstart

One-line description: A Next.js-based web studio for prototyping apps, shared API specs, and typed DB models.

Badges: Add CI, license, and Replit/Vercel badges to this file or README.

Purpose
- This file documents how to run the project locally and on Replit for quick development previews. Production is deployed to Vercel.

Quick overview
- Monorepo using pnpm workspaces, Next.js for web, Drizzle ORM for DB, Zod for validation, and Orval for OpenAPI-driven codegen.
- Production: Vercel. Replit: ephemeral dev preview only.

Prerequisites
- Node.js 24.x (use node 24 LTS), pnpm (recommended pnpm 8+), PostgreSQL (dev) or a managed Postgres instance.
- TypeScript 5.9+ recommended.
- Optional: Docker (if you prefer running Postgres locally).

Local (developer) setup
1. Install dependencies:
   - pnpm install
2. Create a .env (or use environment variables):
   - Add at minimum the DATABASE_URL and SESSION_SECRET (see .env.example)
3. Start dev server (Next.js web app):
   - pnpm --filter .migration-backup run dev
   - Default port: 3000. The app reads `process.env.PORT || 3000`.
4. Typecheck and build:
   - pnpm run typecheck
   - pnpm run build

Replit (recommended for dev preview)
- Note: Replit is for quick dev previews and experiments. Production is on Vercel.
1. Use a remote Postgres (Replit's hosted DB is not suitable for production). Services: ElephantSQL, Supabase, RDS, Neon, etc.
2. Add Replit secrets (Secrets UI):
   - DATABASE_URL — Postgres connection string (remote DB)
   - SESSION_SECRET — session/signing secret
   - Other optional secrets: SENTRY_DSN, NEXT_PUBLIC_API_BASE, etc.
3. Example .replit file (so Replit runs the Next app):
   ```ini
   run = "pnpm --filter .migration-backup run dev"
   ```
4. If Replit requires an explicit PORT, ensure the app reads `process.env.PORT`.
5. Use the Secrets UI to set secrets. Do not commit .env files or secrets to the repo.

Run & Operate (common commands)
- pnpm --filter .migration-backup run dev — run the Next.js app (dev)
- pnpm run typecheck — full TypeScript typecheck across workspace
- pnpm run build — typecheck + build all packages
- pnpm --filter lib/api-spec run codegen — regenerate API hooks and Zod schemas from OpenAPI (run this after OpenAPI changes)
- pnpm --filter lib/db run push — push DB schema changes (development only)
- Tests:
  - pnpm test
  - pnpm --filter <package> test

Environment variables (recommended)
| Name | Required? | Purpose | Example / Notes |
|------|----------:|---------|-----------------|
| DATABASE_URL | yes | Postgres connection string | postgres://user:pass@host:5432/dbname |
| SESSION_SECRET | yes | Session/signing secret | replace-with-long-random-string |
| NODE_ENV | no | runtime env | development |
| NEXT_PUBLIC_API_BASE | no | Client-side API base URL (if used) | https://api.example.com or http://localhost:3000 |

Tip: For Replit, add these as secrets in the Secrets UI rather than committing .env.

Stack
- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: Next.js
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4) + drizzle-zod
- API codegen: Orval (OpenAPI -> client + Zod)
- Build: esbuild (CJS bundles)

Where things live (quick map)
- lib/api-spec — OpenAPI spec and orval config (source-of-truth for API)
- lib/db — Drizzle schema & migrations
- lib/api-zod — generated/shared Zod schemas
- lib/api-client-react — React client helpers/hooks
- .migration-backup — Next.js web app (dev target on Replit)

Architecture decisions (short)
- Monorepo to share types/schemas between web, clients, and DB.
- OpenAPI is the source of truth; run orval after spec changes.
- Use drizzle-kit for local DB pushes (development only).
- Deploy production to Vercel; Replit for ephemeral previews.

Gotchas / Notes
- Always run codegen after changing the OpenAPI spec:
  - pnpm --filter lib/api-spec run codegen
- DB push (drizzle-kit) is for development only; use proper migrations in production.
- Ensure apps read `process.env.PORT` for hosting platforms.
- If you see "could not connect to Postgres", verify DATABASE_URL, network/VPC rules, and that the DB accepts remote connections. Some managed DBs require IP allowlisting.

Troubleshooting (quick checklist)
1. "listening on port ..." — server started successfully.
2. DB connection errors:
   - Check DATABASE_URL and network access (Vercel/Replit require remote DB with open connections).
   - Try connecting locally with psql or a DB client using the same DATABASE_URL.
3. Type/schema mismatches:
   - Run codegen (orval) and rebuild.
4. Replit-specific:
   - Confirm secrets are set
   - Confirm run command in .replit matches the dev script
5. Reproduce locally using the same DATABASE_URL to rule out Replit networking issues.

Pointers / Links
- Codegen config: lib/api-spec/orval.config.{js,ts}
- DB schema: lib/db/src/schema/index.ts
- React client: lib/api-client-react
- CI/Workflows: .github/workflows/*
- Vercel: production is deployed to Vercel — check the project dashboard for domain and settings.

Security
- Never commit secrets. Use Replit Secrets UI or environment variables in CI.
- Use a long random SESSION_SECRET; rotate if exposed.

Contributing
- Preferred flow: Create a feature branch, run pnpm install, run typecheck and tests, then open a PR.

License
- MIT (see LICENSE)
