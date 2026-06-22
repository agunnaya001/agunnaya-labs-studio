import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { getAglBalance, getTierFromBalance, CREDITS, type AglTier } from "../lib/agl";
import { db } from "@workspace/db";
import { user } from "@workspace/db";
import { eq } from "drizzle-orm";

async function loadUser(req: Request) {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  }
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) return null;
  const [dbUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
  return dbUser ?? null;
}

async function getEffectiveTier(u: NonNullable<Awaited<ReturnType<typeof loadUser>>>): Promise<AglTier> {
  let onChainTier: AglTier = "free";
  if (u.walletAddress) {
    try {
      const bal = await getAglBalance(u.walletAddress);
      onChainTier = getTierFromBalance(bal);
    } catch (_) {}
  }
  const subActive = u.subscriptionExpiresAt && u.subscriptionExpiresAt > new Date();
  if (onChainTier === "enterprise") return "enterprise";
  if (onChainTier === "pro") return "pro";
  if (subActive) return "pro";
  return (u.aglTier as AglTier) ?? "free";
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  loadUser(req).then((u) => {
    if (!u) { res.status(401).json({ error: "Authentication required" }); return; }
    (req as Request & { aglUser: typeof u }).aglUser = u;
    next();
  }).catch(() => res.status(401).json({ error: "Authentication required" }));
}

export function requireProTier(req: Request, res: Response, next: NextFunction) {
  loadUser(req).then(async (u) => {
    if (!u) { res.status(401).json({ error: "Authentication required" }); return; }
    const tier = await getEffectiveTier(u);
    if (tier === "free") {
      res.status(402).json({
        error: "Pro tier required",
        message: "Hold ≥ 100 AGL or transfer 50 AGL to subscribe for 30 days.",
        upgradeRequired: true,
      });
      return;
    }
    (req as Request & { aglUser: typeof u; aglTier: AglTier }).aglUser = u;
    (req as Request & { aglUser: typeof u; aglTier: AglTier }).aglTier = tier;
    next();
  }).catch(() => res.status(500).json({ error: "Tier check failed" }));
}

export function deductCredits(cost: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    loadUser(req).then(async (u) => {
      if (!u) { res.status(401).json({ error: "Authentication required" }); return; }

      const tier = await getEffectiveTier(u);
      if (tier !== "free") { next(); return; }

      const credits = u.aglCredits ?? 0;
      if (credits < cost) {
        res.status(402).json({
          error: "Insufficient credits",
          message: `This action costs ${cost} credits. You have ${credits}. Transfer AGL to top up.`,
          credits,
          cost,
          upgradeRequired: true,
        });
        return;
      }

      await db.update(user).set({ aglCredits: credits - cost }).where(eq(user.id, u.id));
      next();
    }).catch(() => res.status(500).json({ error: "Credits check failed" }));
  };
}

export const chatCreditGate = deductCredits(CREDITS.chat);
export const auditCreditGate = deductCredits(CREDITS.audit);
