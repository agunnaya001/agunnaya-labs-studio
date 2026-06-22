---
name: AGL Token Monetization
description: How the AGL ERC-20 token is integrated into Agunnaya AI Studio for on-chain monetization
---

## Token
- Contract: `0xEA1221B4d80A89BD8C75248Fae7c176BD1854698` (AGL on Base mainnet)
- Config env vars: `AGL_TOKEN_ADDRESS`, `AGL_CHAIN_RPC` (default: Base mainnet), `AGL_TREASURY_ADDRESS`

## Architecture
All on-chain reads use raw `eth_call` / `eth_getTransactionReceipt` via `fetch` to a JSON-RPC endpoint — no ethers.js, wagmi, or viem anywhere in the codebase.

**Why:** The codebase convention (from AI agent prompts and task rules) explicitly bans ethers.js/wagmi in examples and code.

## Four monetization models
1. **Token-gating** — `balanceOf` check at API call time; FREE < 100 AGL, PRO ≥ 100, ENTERPRISE ≥ 1000
2. **Credits** — 30 free starter credits per user, 1 AGL transferred to treasury = 100 credits; chat = 10 credits, audit/gas-optimizer = 25 credits
3. **Subscription** — 50 AGL transfer to treasury = 30-day PRO subscription (verified via Transfer event in receipt)
4. **Deploy fee gate** — mainnet deploys (chainIds 8453, 1, 42161, 10, 137) require PRO tier; testnets free

## Key files
- `artifacts/api-server/src/lib/agl.ts` — `getAglBalance()`, `getTierFromBalance()`, `verifyAglTransfer()`
- `artifacts/api-server/src/routes/agl.ts` — `/api/agl/status`, `/api/agl/wallet`, `/api/agl/credits/topup`, `/api/agl/subscribe`
- `artifacts/api-server/src/middlewares/aglGate.ts` — `requireProTier`, `deductCredits(n)` middleware
- `lib/db/src/schema/index.ts` — `walletAddress`, `aglTier`, `aglCredits`, `subscriptionExpiresAt` on `user` table; `aglTransaction` table
- `artifacts/agunnaya-studio/src/hooks/useWallet.ts` — web wallet state hook (EIP-1193 `window.ethereum`)
- `artifacts/agunnaya-studio/src/components/AglPanel.tsx` — web panel UI
- `artifacts/agunnaya-studio-mobile/components/AglPanel.tsx` — mobile panel UI (address input, tx hash topup)

## How to apply
- To check tier in a new route: call `auth.api.getSession` → load user from DB → call `getAglBalance(walletAddress)` → `getTierFromBalance(balance)`
- To verify a payment: call `verifyAglTransfer(txHash, AGL_TREASURY, minAmount)` — it parses the ERC-20 Transfer event from the receipt
- Mobile doesn't have `window.ethereum` so wallet is connected via manual address entry (no signing); web uses EIP-1193
