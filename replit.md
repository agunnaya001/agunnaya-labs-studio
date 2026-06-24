# [Project name]
One-line description: Replace this with a single sentence describing what the app does for users.

Badges: (optional) Add CI, license, or Replit button badges here.

## Quickstart (local / Replit)
Prerequisites
- Node.js 24, pnpm, PostgreSQL (dev) or a managed Postgres instance
- Recommended: pnpm 8+, TypeScript 5.9

Local (developer)
1. Install packages:
   - pnpm install
2. Dev server (API):
   - pnpm --filter @workspace/api-server run dev
   - Default dev port: 5000 (ensure server uses `process.env.PORT || 5000`)
3. Typecheck and build:
   - pnpm run typecheck
   - pnpm run build

Replit (recommended setup)
1. Create Replit secrets:
   - DATABASE_URL — Postgres connection string (use a remote DB or Replit DB adapter)
   - Any other secrets (SESSION_SECRET, etc.)
2. Example .replit entry (so Replit runs the API):
   ```
   run = "pnpm --filter @workspace/api-server run dev"
   ```
   If Replit requires an explicit PORT, ensure the server reads `process.env.PORT`.
3. Add startup commands to Replit's UI or the .replit file above. Use the same secrets UI to set DATABASE_URL.

## Run & Operate (common commands)
- pnpm --filter @workspace/api-server run dev — run the API server (port 5000 by default)
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
(Other envs) Add any additional required envs here (SESSION_SECRET, NODE_ENV, etc.)

Tip: For Replit, add these as secrets in the Secrets UI rather than committing .env.

## Stack
- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4) + drizzle-zod
- API codegen: Orval (OpenAPI -> client + Zod)
- Build: esbuild (CJS bundles)

## Where things live
Short map to the important packages and files:
- packages/api-server — express API server source (start here for runtime code and env handling)
- packages/api-spec — OpenAPI spec and orval config (source-of-truth for API contracts)
- packages/db — Drizzle schema and migrations (db push / schema)
- packages/* — other workspace packages (UI, libs, etc.)
(Replace with exact paths if you use different names.)

## Architecture decisions
- Single TypeScript monorepo with pnpm workspaces to share types/schemas between server and clients.
- API contracts are the source of truth: OpenAPI spec + Orval codegen to derive hooks and Zod schemas.
- Drizzle ORM used for strong typed DB models and migrations (dev-only push workflow for schema iteration).

## Product (high-level)
- Short bullet list describing main user-facing capabilities (e.g., "Auth + user profiles", "CRUD API for X", "Background jobs for Y").

## Gotchas / Notes
- Always run codegen after changing the OpenAPI spec: pnpm --filter @workspace/api-spec run codegen
- DB push is intended for development only; prefer migrations for production.
- Ensure the API server binds to `process.env.PORT || 5000` so Replit can set the runtime port.
- If you see "could not connect to Postgres", verify DATABASE_URL and network access (Replit might require an externally hosted Postgres).

## Troubleshooting
- Common startup logs:
  - "listening on port ..." — server successfully started
  - DB connection errors — check DATABASE_URL and ensure the DB accepts remote connections
- Debugging steps:
  1. Check Replit logs / console output
  2. Try running locally with the same DATABASE_URL to reproduce
  3. Ensure codegen and build steps completed if you see type/schema mismatches

## Pointers / Links
- Codegen config: packages/api-spec/orval.config.{js,ts} (or path in repo)
- DB schema: packages/db/src/schema.ts (or path in repo)
- API server entrypoint: packages/api-server/src/index.ts (or path in repo)
- CI/Workflows: .github/workflows/* (CI steps for lint/typecheck/build)
- Contributing: CONTRIBUTING.md (if present)

## Contributing
- Add a short note on the preferred workflow: "Create feature branch, run pnpm install, run typecheck and tests, open PR."

## License
- State the repository license (e.g., MIT) or link to LICENSE file.

---

If you'd like, I can:
- Commit this updated replit.md directly to the repository (I can update the file for you), or
- Generate a .replit example file and a checklist for onboarding new contributors.

Which would you prefer?
