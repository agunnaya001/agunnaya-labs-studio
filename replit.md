# agunnaya-labs-studio
One-line description: A Next.js-based web studio for prototyping apps, shared API specs, and typed DB models.

Badges: (optional) Add CI, license, or Replit button badges here.

## Quickstart (local / Replit)
Prerequisites
- Node.js 24, pnpm, PostgreSQL (dev) or a managed Postgres instance
- Recommended: pnpm 8+, TypeScript 5.9

Local (developer)
1. Install packages:
   - pnpm install
2. Dev server (web):
   - pnpm --filter .migration-backup run dev
   - Default dev port (Next): 3000 (ensure app uses `process.env.PORT || 3000`)
3. Typecheck and build:
   - pnpm run typecheck
   - pnpm run build

Replit (recommended setup — dev preview only; production is on Vercel)
1. Note: Production is deployed to Vercel and the custom domain is configured there. Replit is intended for quick dev previews and experiments.
2. Create Replit secrets:
   - DATABASE_URL — Postgres connection string (use a remote DB)
   - SESSION_SECRET — session/signing secret (if used)
   - Any other secrets (SENTRY_DSN, etc.)
3. Example .replit entry (so Replit runs the Next app):
   ```
   run = "pnpm --filter .migration-backup run dev"
   ```
   If Replit requires an explicit PORT, ensure the app reads `process.env.PORT`.
4. Add startup commands to Replit's UI or the .replit file above. Use the Secrets UI to set DATABASE_URL and other secrets.

## Run & Operate (common commands)
- pnpm --filter .migration-backup run dev — run the Next.js app (dev)
- pnpm run typecheck — full TypeScript typecheck across all packages
- pnpm run build — typecheck + build all packages
- pnpm --filter @workspace/api-spec run codegen — regenerate API hooks and Zod schemas from the OpenAPI spec
- pnpm --filter @workspace/db run push — push DB schema changes (development only)
- Tests (if present):
  - pnpm test or pnpm --filter <package> test

## Required environment variables
| Name | Purpose | Example / Notes |
|------|---------|-----------------|
| DATABASE_URL | Postgres connection string | postgres://user:pass@host:5432/dbname |
| SESSION_SECRET | Session/signing secret (if used) | replace-me |
| NODE_ENV | runtime environment | development | 

Tip: For Replit, add these as secrets in the Secrets UI rather than committing .env.

## Stack
- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: Next.js
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4) + drizzle-zod
- API codegen: Orval (OpenAPI -> client + Zod)
- Build: esbuild (CJS bundles)

## Where things live
Short map to the important packages and files:
- lib/api-spec — OpenAPI spec and orval config (source-of-truth for API contracts)
- lib/db — Drizzle schema and migrations (db push / schema)
- lib/api-zod — generated/shared Zod schemas
- lib/api-client-react — React client helpers/hooks
- .migration-backup — Next.js web app (dev target on Replit)

## Architecture decisions
- Monorepo with pnpm workspaces to share types and schemas between the web app, API clients, and DB models.
- API contracts are the source of truth: maintain OpenAPI in lib/api-spec and run orval to regenerate clients and Zod schemas.
- Drizzle ORM provides strongly-typed DB models; use drizzle-kit for local dev schema pushes.
- Deploy production to Vercel for edge CDN, with Replit used for ephemeral dev previews.

## Product (high-level)
- Prototype and showcase web apps built on shared typed API and DB models.
- Generate and consume OpenAPI-driven typed clients across front-end and back-end.
- Rapid iteration with codegen-driven contracts and local DB pushes for development.

## Gotchas / Notes
- Always run codegen after changing the OpenAPI spec: pnpm --filter lib/api-spec run codegen
- DB push is intended for development only; prefer migrations for production.
- Ensure apps read `process.env.PORT` so hosting platforms (Replit, Vercel) can bind correctly.
- If you see "could not connect to Postgres", verify DATABASE_URL and network access (Vercel/Replit may require an externally hosted Postgres).

## Troubleshooting
- Common startup logs:
  - "listening on port ..." — server successfully started
  - DB connection errors — check DATABASE_URL and ensure the DB accepts remote connections
- Debugging steps:
  1. Check Replit logs / console output (or Vercel build logs for production issues)
  2. Try running locally with the same DATABASE_URL to reproduce
  3. Ensure codegen and build steps completed if you see type/schema mismatches

## Pointers / Links
- Codegen config: lib/api-spec/orval.config.{js,ts}
- DB schema: lib/db/src/schema/index.ts
- React client: lib/api-client-react
- CI/Workflows: .github/workflows/* (CI steps for lint/typecheck/build)
- Vercel: Production is deployed to Vercel; check your project dashboard for the domain and deployment settings.

## Contributing
- Preferred workflow: Create a feature branch, run pnpm install, run typecheck and tests, then open a PR.

## License
- MIT (see LICENSE file in the repo)

---

If you'd like, I can also:
- Add a .env.example (I will create this in the repo),
- Update .replit run command (I will edit the existing .replit to include the run line),
- Or open a PR instead of committing to main.
