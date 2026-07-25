import { Router } from "express";
import { auth } from "../lib/auth";
import {
  getAglBalance,
  getStakedBalance,
  getStakingPositions,
  getTierFromBalance,
  verifyCreditsPurchase,
  previewCreditsForAmount,
  verifyAglTransfer,
  AGL_TREASURY,
  SUBSCRIPTION_AGL,
  SUBSCRIPTION_DAYS,
  type AglTier,
} from "../lib/agl";
import { db } from "@workspace/db";
import { user, aglTransaction } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function getAuthedUser(req: import("express").Request) {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  }
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) return null;
  const [dbUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
  return dbUser ?? null;
}

// ── GET /api/agl/status ───────────────────────────────────────────────────────
// Returns wallet tier, held balance, staked balance, credits, and subscription.
// Tier = getTierFromBalance(held + staked) or subscription override.

router.get("/agl/status", async (req, res) => {
  const u = await getAuthedUser(req);
  if (!u) { res.status(401).json({ error: "Unauthorized" }); return; }

  let heldBalance   = 0;
  let stakedBalance = 0;
  let onChainTier: AglTier = "free";

  if (u.walletAddress) {
    try {
      [heldBalance, stakedBalance] = await Promise.all([
        getAglBalance(u.walletAddress),
        getStakedBalance(u.walletAddress),
      ]);
      onChainTier = getTierFromBalance(heldBalance + stakedBalance);
    } catch (_) {
      // RPC failure — fall through to stored tier
    }
  }

  const subActive = u.subscriptionExpiresAt && u.subscriptionExpiresAt > new Date();
  const effectiveTier: AglTier =
    onChainTier === "enterprise" ? "enterprise"
    : onChainTier === "pro"      ? "pro"
    : subActive                  ? "pro"
    : (u.aglTier as AglTier)    ?? "free";

  if (u.walletAddress && effectiveTier !== u.aglTier) {
    await db.update(user).set({ aglTier: effectiveTier }).where(eq(user.id, u.id));
  }

  res.json({
    wallet:                u.walletAddress ?? null,
    heldBalance,
    stakedBalance,
    onChainBalance:        heldBalance + stakedBalance, // kept for backwards compat
    tier:                  effectiveTier,
    credits:               u.aglCredits ?? 0,
    subscriptionExpiresAt: u.subscriptionExpiresAt ?? null,
    treasury:              AGL_TREASURY || null,
  });
});

// ── POST /api/agl/wallet ──────────────────────────────────────────────────────

router.post("/agl/wallet", async (req, res) => {
  const u = await getAuthedUser(req);
  if (!u) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { address } = req.body as { address?: string };
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    res.status(400).json({ error: "Invalid wallet address" }); return;
  }

  let heldBalance = 0;
  let stakedBalance = 0;
  let tier: AglTier = "free";
  try {
    [heldBalance, stakedBalance] = await Promise.all([
      getAglBalance(address),
      getStakedBalance(address),
    ]);
    tier = getTierFromBalance(heldBalance + stakedBalance);
  } catch (_) {}

  await db.update(user).set({
    walletAddress: address.toLowerCase(),
    aglTier: tier,
  }).where(eq(user.id, u.id));

  res.json({ wallet: address.toLowerCase(), heldBalance, stakedBalance, tier });
});

// ── GET /api/agl/credits/preview ──────────────────────────────────────────────
// Preview how many credits a given AGL amount will yield (no auth required).

router.get("/agl/credits/preview", async (req, res) => {
  const aglAmount = Number((req.query as { amount?: string }).amount ?? "1");
  if (!Number.isFinite(aglAmount) || aglAmount <= 0) {
    res.status(400).json({ error: "amount must be a positive number" }); return;
  }
  try {
    const result = await previewCreditsForAmount(aglAmount);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── POST /api/agl/credits/topup ───────────────────────────────────────────────
// Verifies a purchaseCredits() tx from the AGL Credits contract and grants credits.

router.post("/agl/credits/topup", async (req, res) => {
  const u = await getAuthedUser(req);
  if (!u) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!u.walletAddress) {
    res.status(400).json({ error: "No wallet linked. Connect your wallet first." }); return;
  }

  const { txHash } = req.body as { txHash?: string };
  if (!txHash || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    res.status(400).json({ error: "Invalid tx hash" }); return;
  }

  const existing = await db.select().from(aglTransaction)
    .where(eq(aglTransaction.txHash, txHash)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Transaction already used" }); return;
  }

  const result = await verifyCreditsPurchase(txHash, u.walletAddress);
  if (!result.ok) {
    res.status(400).json({ error: result.error }); return;
  }

  const newCredits = (u.aglCredits ?? 0) + result.creditsGranted;

  await db.insert(aglTransaction).values({
    userId:      u.id,
    txHash,
    type:        "topup",
    aglAmount:   String(result.aglBurned),
    creditsAdded: result.creditsGranted,
  });
  await db.update(user).set({ aglCredits: newCredits }).where(eq(user.id, u.id));

  res.json({
    creditsAdded: result.creditsGranted,
    totalCredits: newCredits,
    aglAmount:    result.aglBurned,
  });
});

// ── POST /api/agl/subscribe ───────────────────────────────────────────────────
// Verifies a 50-AGL treasury transfer and activates a 30-day PRO subscription.

router.post("/agl/subscribe", async (req, res) => {
  const u = await getAuthedUser(req);
  if (!u) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!AGL_TREASURY) { res.status(503).json({ error: "Treasury address not configured" }); return; }

  const { txHash } = req.body as { txHash?: string };
  if (!txHash || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    res.status(400).json({ error: "Invalid tx hash" }); return;
  }

  const existing = await db.select().from(aglTransaction)
    .where(eq(aglTransaction.txHash, txHash)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Transaction already used" }); return;
  }

  const result = await verifyAglTransfer(txHash, AGL_TREASURY, SUBSCRIPTION_AGL);
  if (!result.ok) {
    res.status(400).json({ error: result.error }); return;
  }

  const now     = new Date();
  const current = u.subscriptionExpiresAt && u.subscriptionExpiresAt > now
    ? u.subscriptionExpiresAt : now;
  const expiresAt = new Date(current.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(aglTransaction).values({
    userId:      u.id,
    txHash,
    type:        "subscribe",
    aglAmount:   String(result.amount),
    creditsAdded: 0,
  });
  await db.update(user).set({
    aglTier:               "pro",
    subscriptionExpiresAt: expiresAt,
  }).where(eq(user.id, u.id));

  res.json({ tier: "pro", subscriptionExpiresAt: expiresAt });
});

// ── GET /api/agl/stake/positions ──────────────────────────────────────────────
// Returns all active staking positions for the authenticated user's wallet.

router.get("/agl/stake/positions", async (req, res) => {
  const u = await getAuthedUser(req);
  if (!u) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!u.walletAddress) {
    res.json({ positions: [], totalStakedAgl: 0 }); return;
  }

  try {
    const positions     = await getStakingPositions(u.walletAddress);
    const totalStakedAgl = positions.reduce((sum, p) => sum + p.amount, 0);
    res.json({ positions, totalStakedAgl });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
