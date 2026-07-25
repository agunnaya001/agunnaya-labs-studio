// ─── Contract addresses ───────────────────────────────────────────────────────

const AGL_TOKEN_ADDRESS =
  process.env["AGL_TOKEN_ADDRESS"] ?? "0xEA1221B4d80A89BD8C75248Fae7c176BD1854698";

const AGL_CREDITS_CONTRACT =
  process.env["AGL_CREDITS_CONTRACT"] ?? "0x13866F31c60822Ff70684213b9727915Ddf2c183";

const AGL_STAKING_CONTRACT =
  process.env["AGL_STAKING_CONTRACT"] ?? "0xd4B61B4876c15e78e0275EbA52cf62D55ED5fD30";

const AGL_CHAIN_RPC =
  process.env["AGL_CHAIN_RPC"] ?? "https://mainnet.base.org";

export const AGL_TREASURY =
  process.env["AGL_TREASURY_ADDRESS"] ?? "0x725615639B760DAa64b3e794AA49B5A9a8A7632E";

// ─── Function selectors (keccak256(sig)[0:4]) ─────────────────────────────────
// balanceOf(address)                                    verified: 0x70a08231
// positionCount(address)                                computed:  0x42fd3880
// getPosition(address,uint256)                          computed:  0x3adbb5af
// pendingReward(address,uint256)                        computed:  0xf430cf0d
// previewCredits(uint256)                               computed:  0x393099d9
// creditsPerAGL()                                       computed:  0xda2b4530
// totalStaked()                                         computed:  0x817b1cd2

const SEL = {
  balanceOf:      "0x70a08231",
  positionCount:  "0x42fd3880",
  getPosition:    "0x3adbb5af",
  pendingReward:  "0xf430cf0d",
  previewCredits: "0x393099d9",
  creditsPerAGL:  "0xda2b4530",
  totalStaked:    "0x817b1cd2",
} as const;

// ─── Event topics (keccak256 of full event signature) ─────────────────────────
// CreditsPurchased(address indexed user,uint256 aglBurned,uint256 creditsGranted,uint256 timestamp)
const TOPICS = {
  creditsPurchased: "0x7852f393fd6a99c61648e39af92ae0e784b77281fc2af871edce1b51304ecd7c",
  transfer:         "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
} as const;

// ─── App constants ────────────────────────────────────────────────────────────

export const TIERS = {
  free:       { label: "FREE",       min: 0,    max: 99       },
  pro:        { label: "PRO",        min: 100,  max: 999      },
  enterprise: { label: "ENTERPRISE", min: 1000, max: Infinity },
} as const;
export type AglTier = keyof typeof TIERS;

export const CREDITS = {
  starter:   30,
  perAgl:    100,
  chat:      10,
  audit:     25,
  deployFee: 20,
};

export const SUBSCRIPTION_AGL  = 50;
export const SUBSCRIPTION_DAYS = 30;

// ─── ABI encoding helpers ─────────────────────────────────────────────────────

function padAddr(address: string): string {
  return address.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
}

function padUint(value: bigint | number): string {
  return BigInt(value).toString(16).padStart(64, "0");
}

function decodeUint(hex: string, slot = 0): bigint {
  const h = hex.replace(/^0x/, "");
  const chunk = h.slice(slot * 64, slot * 64 + 64);
  return BigInt("0x" + (chunk || "0"));
}

// ─── JSON-RPC ─────────────────────────────────────────────────────────────────

async function jsonRpc(method: string, params: unknown[]): Promise<string> {
  const res = await fetch(AGL_CHAIN_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = (await res.json()) as { result?: string; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result ?? "0x";
}

// ─── AGL token ────────────────────────────────────────────────────────────────

export async function getAglBalance(address: string): Promise<number> {
  const raw = await jsonRpc("eth_call", [
    { to: AGL_TOKEN_ADDRESS, data: SEL.balanceOf + padAddr(address) },
    "latest",
  ]);
  return Number(decodeUint(raw) / BigInt(10 ** 18));
}

export function getTierFromBalance(effectiveBalance: number): AglTier {
  if (effectiveBalance >= TIERS.enterprise.min) return "enterprise";
  if (effectiveBalance >= TIERS.pro.min) return "pro";
  return "free";
}

// ─── Credits contract ─────────────────────────────────────────────────────────

/** Preview how many credits a whole-token AGL amount will yield on-chain. */
export async function previewCreditsForAmount(
  aglAmount: number,
): Promise<{ credits: number; ratePerAgl: number }> {
  const amountWei = BigInt(Math.max(1, Math.floor(aglAmount))) * BigInt(10 ** 18);
  const [previewRaw, rateRaw] = await Promise.all([
    jsonRpc("eth_call", [
      { to: AGL_CREDITS_CONTRACT, data: SEL.previewCredits + padUint(amountWei) },
      "latest",
    ]),
    jsonRpc("eth_call", [
      { to: AGL_CREDITS_CONTRACT, data: SEL.creditsPerAGL },
      "latest",
    ]),
  ]);
  return {
    credits:    Number(decodeUint(previewRaw)),
    ratePerAgl: Number(decodeUint(rateRaw)),
  };
}

/**
 * Verify a purchaseCredits() transaction from the AGL Credits contract.
 * The tx must contain a CreditsPurchased event matching the expected user wallet.
 */
export async function verifyCreditsPurchase(
  txHash: string,
  expectedUser: string,
): Promise<{ ok: boolean; aglBurned: number; creditsGranted: number; error?: string }> {
  let receipt: {
    status: string;
    logs: Array<{ address: string; topics: string[]; data: string }>;
  };

  try {
    const raw = await jsonRpc("eth_getTransactionReceipt", [txHash]);
    if (!raw || raw === "0x") {
      return { ok: false, aglBurned: 0, creditsGranted: 0, error: "Transaction not found or pending" };
    }
    receipt = raw as unknown as typeof receipt;
  } catch (e) {
    return { ok: false, aglBurned: 0, creditsGranted: 0, error: (e as Error).message };
  }

  if (receipt.status !== "0x1") {
    return { ok: false, aglBurned: 0, creditsGranted: 0, error: "Transaction reverted" };
  }

  const log = receipt.logs.find(
    (l) =>
      l.address.toLowerCase() === AGL_CREDITS_CONTRACT.toLowerCase() &&
      l.topics[0]?.toLowerCase() === TOPICS.creditsPurchased &&
      l.topics[1]?.toLowerCase().endsWith(expectedUser.replace(/^0x/i, "").toLowerCase()),
  );

  if (!log) {
    return {
      ok: false, aglBurned: 0, creditsGranted: 0,
      error: "No CreditsPurchased event found for your wallet in this transaction",
    };
  }

  // data = abi.encode(aglBurned, creditsGranted, timestamp)  — each 32 bytes
  const data = log.data.replace(/^0x/, "");
  const aglBurned     = Number(decodeUint(data, 0) / BigInt(10 ** 18));
  const creditsGranted = Number(decodeUint(data, 1));

  return { ok: true, aglBurned, creditsGranted };
}

// ─── Staking contract ─────────────────────────────────────────────────────────

export interface StakePosition {
  positionId:     number;
  amount:         number;  // AGL staked
  startTime:      Date;
  unlockTime:     Date;
  tierId:         number;
  aprBasisPoints: number;
  aprPercent:     number;  // aprBasisPoints / 100
  withdrawn:      boolean;
  pendingReward:  number;  // AGL claimable
}

/** Return all active (non-withdrawn) staking positions for a wallet. */
export async function getStakingPositions(address: string): Promise<StakePosition[]> {
  const countRaw = await jsonRpc("eth_call", [
    { to: AGL_STAKING_CONTRACT, data: SEL.positionCount + padAddr(address) },
    "latest",
  ]);
  const count = Number(decodeUint(countRaw));
  if (count === 0) return [];

  const positions = await Promise.all(
    Array.from({ length: count }, (_, posId) =>
      Promise.all([
        jsonRpc("eth_call", [
          { to: AGL_STAKING_CONTRACT, data: SEL.getPosition + padAddr(address) + padUint(posId) },
          "latest",
        ]),
        jsonRpc("eth_call", [
          { to: AGL_STAKING_CONTRACT, data: SEL.pendingReward + padAddr(address) + padUint(posId) },
          "latest",
        ]),
      ]).then(([posRaw, rewardRaw]) => {
        const hex = posRaw.replace(/^0x/, "");
        // Tuple ABI: amount(u256) startTime(u256) unlockTime(u256) tierId(u256) apr(u256) withdrawn(u256)
        const amount         = Number(decodeUint(hex, 0) / BigInt(10 ** 18));
        const startTime      = new Date(Number(decodeUint(hex, 1)) * 1000);
        const unlockTime     = new Date(Number(decodeUint(hex, 2)) * 1000);
        const tierId         = Number(decodeUint(hex, 3));
        const aprBasisPoints = Number(decodeUint(hex, 4));
        const withdrawn      = decodeUint(hex, 5) !== 0n;
        const pendingReward  = Number(decodeUint(rewardRaw) / BigInt(10 ** 18));

        return {
          positionId: posId,
          amount,
          startTime,
          unlockTime,
          tierId,
          aprBasisPoints,
          aprPercent: aprBasisPoints / 100,
          withdrawn,
          pendingReward,
        } satisfies StakePosition;
      }),
    ),
  );

  return positions
    .filter((p) => !p.withdrawn)
    .sort((a, b) => a.positionId - b.positionId);
}

/** Sum of AGL across all active staking positions (for tier calculation). */
export async function getStakedBalance(address: string): Promise<number> {
  const positions = await getStakingPositions(address);
  return positions.reduce((sum, p) => sum + p.amount, 0);
}

// ─── Legacy: raw Transfer verification (used by /agl/subscribe) ───────────────

export async function verifyAglTransfer(
  txHash: string,
  expectedTo: string,
  minAglAmount: number,
): Promise<{ ok: boolean; amount: number; from: string; error?: string }> {
  let receipt: {
    status: string;
    logs: Array<{ address: string; topics: string[]; data: string }>;
  };

  try {
    const raw = await jsonRpc("eth_getTransactionReceipt", [txHash]);
    if (!raw || raw === "0x") {
      return { ok: false, amount: 0, from: "", error: "Transaction not found or pending" };
    }
    receipt = raw as unknown as typeof receipt;
  } catch (e) {
    return { ok: false, amount: 0, from: "", error: (e as Error).message };
  }

  if (receipt.status !== "0x1") {
    return { ok: false, amount: 0, from: "", error: "Transaction reverted" };
  }

  const transfer = receipt.logs.find(
    (log) =>
      log.address.toLowerCase() === AGL_TOKEN_ADDRESS.toLowerCase() &&
      log.topics[0]?.toLowerCase() === TOPICS.transfer &&
      log.topics[2]?.toLowerCase().endsWith(expectedTo.replace(/^0x/i, "").toLowerCase()),
  );

  if (!transfer) {
    return { ok: false, amount: 0, from: "", error: "No AGL Transfer event to treasury found" };
  }

  const amountWei = BigInt(transfer.data === "0x" ? "0x0" : transfer.data);
  const amount    = Number(amountWei / BigInt(10 ** 18));
  const from      = "0x" + (transfer.topics[1] ?? "").slice(-40);

  if (amount < minAglAmount) {
    return {
      ok: false, amount, from,
      error: `Transfer amount ${amount} AGL is below required ${minAglAmount} AGL`,
    };
  }

  return { ok: true, amount, from };
}
