# Agunnaya Labs Studio — Replit Quickstart

AI-powered Solidity IDE with wallet integration, on-chain AGL token gating, and Base mainnet deployment.

## Architecture

Multi-artifact pnpm workspace:

| Artifact | Path | Port | Description |
|---|---|---|---|
| Web App | `artifacts/agunnaya-studio` | 20259 | Vite/React SPA |
| API Server | `artifacts/api-server` | 8080 | Express + better-auth |
| Shared DB | `lib/db` | — | Drizzle ORM + PostgreSQL |
| API Zod | `lib/api-zod` | — | Generated Zod schemas |
| API Client | `lib/api-client-react` | — | React Query hooks |

## Running Locally (Replit)

The managed workflows start both services automatically:

- `artifacts/agunnaya-studio: web` — Vite dev server (port 20259)
- `artifacts/api-server: API Server` — Express API (port 8080)

To install dependencies (web + API only — mobile excluded due to platform constraints):

```bash
pnpm install \
  --filter @workspace/agunnaya-studio \
  --filter @workspace/api-server \
  --filter @workspace/db \
  --filter @workspace/api-zod \
  --filter @workspace/api-client-react
```

To push the DB schema after changes:

```bash
pnpm --filter @workspace/db run push
```

## Environment Variables / Secrets

| Name | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection (auto-provided by Replit DB) |
| `SESSION_SECRET` | yes | better-auth session signing |
| `ANTHROPIC_API_KEY` | yes (for AI chat) | Claude model access |
| `AGL_TOKEN_ADDRESS` | no | Override AGL token address (default: Base mainnet) |
| `AGL_CREDITS_CONTRACT` | no | Override Credits contract address |
| `AGL_STAKING_CONTRACT` | no | Override Staking contract address |
| `AGL_TREASURY_ADDRESS` | no | Override treasury address (default hardcoded) |
| `AGL_CHAIN_RPC` | no | Override Base RPC URL (default: https://mainnet.base.org) |

## On-Chain Contracts (Base Mainnet)

| Contract | Address |
|---|---|
| AGL Token | `0xEA1221B4d80A89BD8C75248Fae7c176BD1854698` |
| AGL Credits | `0x13866F31c60822Ff70684213b9727915Ddf2c183` |
| AGL Staking | `0xd4B61B4876c15e78e0275EbA52cf62D55ED5fD30` |
| Treasury | `0x725615639B760DAa64b3e794AA49B5A9a8A7632E` |

## AGL Token System

Tier access is based on **held + staked AGL combined**:

- FREE: 0–99 AGL
- PRO: ≥ 100 AGL
- ENTERPRISE: ≥ 1000 AGL

**Buy credits**: Users call `purchaseCredits(uint256)` on the Credits contract. AGL is burned, a `CreditsPurchased` event is emitted, and the backend verifies that event to grant credits.

**Subscribe**: Transfer 50 AGL to the treasury address for a 30-day PRO subscription.

## Stack

- Frontend: React 19, Vite 7, Tailwind CSS 4, Wouter, Tanstack Query
- Backend: Express 5, better-auth, Pino logging
- DB: PostgreSQL (Replit built-in) + Drizzle ORM
- Blockchain: Base mainnet, raw JSON-RPC (no ethers.js/wagmi)
- AI: Anthropic Claude via `@ai-sdk/anthropic`
- Solidity: `solc` for compilation and deployment

## User Preferences

- No ethers.js or wagmi — use raw JSON-RPC for all on-chain reads
- Keep contract ABIs and addresses in `artifacts/api-server/src/lib/agl.ts` (backend) and inline constants in frontend components
- pnpm workspace — always use `--filter` flags when installing specific packages
