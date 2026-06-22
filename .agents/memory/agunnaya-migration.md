---
name: Agunnaya Studio migration patterns
description: Lessons from migrating Agunnaya AI Studio from Next.js to Vite+React in pnpm workspace
---

## better-auth client needs absolute URL
`createAuthClient({ baseURL: '/api/auth' })` throws "Invalid base URL" in the browser.
**Fix:** derive base URL from `window.location.origin` at runtime:
```ts
const baseURL = typeof window !== 'undefined'
  ? `${window.location.origin}/api/auth`
  : 'http://localhost:8080/api/auth'
```

## Express v5 wildcard syntax changed
Express v5 (used in api-server) uses `{*path}` not `*` for wildcards.
`router.all("/auth/*", ...)` throws PathError from path-to-regexp v8.
**Fix:** `router.all("/auth/{*path}", ...)`

## better-auth pulls in @opentelemetry/semantic-conventions as runtime dep
Even though `@opentelemetry/*` is in the esbuild externals list (correct), it must also be installed as a real package dep so Node.js can find it at runtime.
**Fix:** `pnpm add @opentelemetry/semantic-conventions` in api-server.

## solc is server-side only
`solc` must run in the api-server — it cannot be imported in the Vite/browser bundle. The /api/compile and /api/deploy endpoints handle all compilation.

## DB schema push command
`pnpm --filter @workspace/db push` (not `db:push` — the script name is just `push`).
