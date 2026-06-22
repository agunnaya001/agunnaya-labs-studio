import { Router } from "express";
import { auth } from "../lib/auth";
import {
  getAglBalance,
  getTierFromBalance,
  verifyAglTransfer,
  AGL_TREASURY,
  CREDITS,
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

router.get("/agl/status", async (req, res) => {
  const u = await getAuthedUser(req);
  if (!u) { res.status(401).json({ error: "Unauthorized" }); return; }

  let onChainBalance = 0;
  let onChainTier: AglTier = "free";

  if (u.walletAddress) {
    try {
      onChainBalance = await getAglBalance(u.walletAddress);
      onChainTier = getTierFromBalance(onChainBalance);
    } catch (_) {
      // RPC failure — fall through to stored tier
    }
  }

  const subActive = u.subscriptionExpiresAt && u.subscriptionExpiresAt > new Date();
  const effectiveTier: AglTier =
    onChainTier === "enterprise" ? "enterprise"
    : onChainTier === "pro" ? "pro"
    : subActive ? "pro"
    : (u.aglTier as AglTier) ?? "free";

  if (u.walletAddress && effectiveTier !== u.aglTier) {
    await db.update(user).set({ aglTier: effectiveTier }).where(eq(user.id, u.id));
  }

  res.json({
    wallet: u.walletAddress ?? null,
    onChainBalance,
    tier: effectiveTier,
    credits: u.aglCredits ?? 0,
    subscriptionExpiresAt: u.subscriptionExpiresAt ?? null,
    treasury: AGL_TREASURY || null,
  });
});

router.post("/agl/wallet", async (req, res) => {
  const u = await getAuthedUser(req);
  if (!u) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { address } = req.body as { address?: string };
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    res.status(400).json({ error: "Invalid wallet address" }); return;
  }

  let balance = 0;
  let tier: AglTier = "free";
  try {
    balance = await getAglBalance(address);
    tier = getTierFromBalance(balance);
  } catch (_) {}

  await db.update(user).set({
    walletAddress: address.toLowerCase(),
    aglTier: tier,
  }).where(eq(user.id, u.id));

  res.json({ wallet: address.toLowerCase(), balance, tier });
});

router.post("/agl/credits/topup", async (req, res) => {
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

  const result = await verifyAglTransfer(txHash, AGL_TREASURY, 1);
  if (!result.ok) {
    res.status(400).json({ error: result.error }); return;
  }

  const creditsToAdd = Math.floor(result.amount * CREDITS.perAgl);
  const newCredits = (u.aglCredits ?? 0) + creditsToAdd;

  await db.insert(aglTransaction).values({
    userId: u.id,
    txHash,
    type: "topup",
    aglAmount: String(result.amount),
    creditsAdded: creditsToAdd,
  });
  await db.update(user).set({ aglCredits: newCredits }).where(eq(user.id, u.id));

  res.json({ creditsAdded: creditsToAdd, totalCredits: newCredits, aglAmount: result.amount });
});

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

  const now = new Date();
  const current = u.subscriptionExpiresAt && u.subscriptionExpiresAt > now
    ? u.subscriptionExpiresAt : now;
  const expiresAt = new Date(current.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(aglTransaction).values({
    userId: u.id,
    txHash,
    type: "subscribe",
    aglAmount: String(result.amount),
    creditsAdded: 0,
  });
  await db.update(user).set({
    aglTier: "pro",
    subscriptionExpiresAt: expiresAt,
  }).where(eq(user.id, u.id));

  res.json({ tier: "pro", subscriptionExpiresAt: expiresAt });
});

export default router;
