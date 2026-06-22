import { Router } from "express";
import solc from "solc";
import { auth } from "../lib/auth";
import { getAglBalance, getTierFromBalance, type AglTier } from "../lib/agl";
import { db } from "@workspace/db";
import { user } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const MAINNET_CHAIN_IDS = new Set([8453, 1, 42161, 10, 137]);

const chains: Record<number, { name: string; rpc: string; explorer: string }> =
  {
    8453: {
      name: "Base Mainnet",
      rpc: "https://mainnet.base.org",
      explorer: "https://basescan.org",
    },
    84532: {
      name: "Base Sepolia",
      rpc: "https://sepolia.base.org",
      explorer: "https://sepolia.basescan.org",
    },
    1: {
      name: "Ethereum Mainnet",
      rpc: "https://eth.llamarpc.com",
      explorer: "https://etherscan.io",
    },
    11155111: {
      name: "Ethereum Sepolia",
      rpc: "https://eth-sepolia.public.blastapi.io",
      explorer: "https://sepolia.etherscan.io",
    },
    42161: {
      name: "Arbitrum One",
      rpc: "https://arb1.arbitrum.io/rpc",
      explorer: "https://arbiscan.io",
    },
    10: {
      name: "Optimism Mainnet",
      rpc: "https://mainnet.optimism.io",
      explorer: "https://optimistic.etherscan.io",
    },
    137: {
      name: "Polygon Mainnet",
      rpc: "https://polygon-rpc.com",
      explorer: "https://polygonscan.com",
    },
  };

async function getSessionUser(req: import("express").Request) {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  }
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) return null;
  const [dbUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
  return dbUser ?? null;
}

async function getEffectiveTier(u: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>): Promise<AglTier> {
  let onChainTier: AglTier = "free";
  if (u.walletAddress) {
    try {
      const bal = await getAglBalance(u.walletAddress);
      onChainTier = getTierFromBalance(bal);
    } catch (_) {}
  }
  const subActive = u.subscriptionExpiresAt && u.subscriptionExpiresAt > new Date();
  if (onChainTier === "enterprise" || onChainTier === "pro") return onChainTier;
  if (subActive) return "pro";
  return (u.aglTier as AglTier) ?? "free";
}

router.post("/deploy", async (req, res) => {
  try {
    const {
      code,
      contractName,
      chainId,
      deployArgs = [],
    } = req.body as {
      code: string;
      contractName: string;
      chainId: number;
      deployArgs?: unknown[];
    };

    const chain = chains[chainId];
    if (!chain) {
      res.json({ status: "error", message: `Chain ${chainId} not supported` });
      return;
    }

    if (MAINNET_CHAIN_IDS.has(chainId)) {
      const u = await getSessionUser(req);
      if (!u) {
        res.status(401).json({ status: "error", message: "Authentication required for mainnet deployment" });
        return;
      }
      const tier = await getEffectiveTier(u);
      if (tier === "free") {
        res.status(402).json({
          status: "error",
          message: `Mainnet deployment on ${chain.name} requires PRO tier. Hold ≥ 100 AGL or subscribe with 50 AGL/month.`,
          upgradeRequired: true,
        });
        return;
      }
    }

    const input = {
      language: "Solidity",
      sources: { "Contract.sol": { content: code } },
      settings: {
        outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
        optimizer: { enabled: true, runs: 200 },
      },
    };

    const compileOutput = JSON.parse(solc.compile(JSON.stringify(input)));

    if (
      compileOutput.errors?.some(
        (e: { severity: string }) => e.severity === "error",
      )
    ) {
      res.json({ status: "error", message: "Compilation failed" });
      return;
    }

    let bytecode = "";
    let abi: unknown[] = [];

    for (const fileName in compileOutput.contracts) {
      for (const name in compileOutput.contracts[fileName]) {
        if (name === contractName || !bytecode) {
          const contract = compileOutput.contracts[fileName][name];
          bytecode = contract.evm?.bytecode?.object || "";
          abi = contract.abi || [];
        }
      }
    }

    if (!bytecode) {
      res.json({
        status: "error",
        message: `Contract ${contractName} not found in compilation output`,
      });
      return;
    }

    // Actual deployment requires a wallet private key / MetaMask signing on frontend
    // This endpoint validates and compiles, returning the bytecode for client-side deployment
    res.json({
      status: "pending",
      message: `Contract compiled successfully for ${chain.name}. Connect MetaMask to deploy.`,
      txHash: `0x${"0".repeat(64)}`,
      bytecode,
      abi,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.json({ status: "error", message: `Deployment error: ${message}` });
  }
});

export default router;
