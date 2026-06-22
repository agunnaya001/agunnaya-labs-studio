const AGL_TOKEN_ADDRESS =
  process.env["AGL_TOKEN_ADDRESS"] ?? "0xEA1221B4d80A89BD8C75248Fae7c176BD1854698";

const AGL_CHAIN_RPC =
  process.env["AGL_CHAIN_RPC"] ?? "https://mainnet.base.org";

export const AGL_TREASURY =
  process.env["AGL_TREASURY_ADDRESS"] ?? "";

export const TIERS = {
  free: { label: "FREE", min: 0, max: 99 },
  pro: { label: "PRO", min: 100, max: 999 },
  enterprise: { label: "ENTERPRISE", min: 1000, max: Infinity },
} as const;
export type AglTier = keyof typeof TIERS;

export const CREDITS = {
  starter: 30,
  perAgl: 100,
  chat: 10,
  audit: 25,
  deployFee: 20,
};

export const SUBSCRIPTION_AGL = 50;
export const SUBSCRIPTION_DAYS = 30;

async function jsonRpc(method: string, params: unknown[]) {
  const res = await fetch(AGL_CHAIN_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = (await res.json()) as { result?: string; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result ?? "0x";
}

export async function getAglBalance(address: string): Promise<number> {
  const selector = "0x70a08231";
  const paddedAddr = address.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
  const data = selector + paddedAddr;
  const raw = await jsonRpc("eth_call", [
    { to: AGL_TOKEN_ADDRESS, data },
    "latest",
  ]);
  const balanceWei = BigInt(raw === "0x" ? "0x0" : raw);
  return Number(balanceWei / BigInt(10 ** 18));
}

export function getTierFromBalance(balance: number): AglTier {
  if (balance >= TIERS.enterprise.min) return "enterprise";
  if (balance >= TIERS.pro.min) return "pro";
  return "free";
}

interface TransferEvent {
  from: string;
  to: string;
  amount: bigint;
}

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

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
      log.topics[0]?.toLowerCase() === TRANSFER_TOPIC &&
      log.topics[2]?.toLowerCase().endsWith(expectedTo.replace(/^0x/i, "").toLowerCase()),
  );

  if (!transfer) {
    return { ok: false, amount: 0, from: "", error: "No AGL Transfer event to treasury found" };
  }

  const amountWei = BigInt(transfer.data === "0x" ? "0x0" : transfer.data);
  const amount = Number(amountWei / BigInt(10 ** 18));
  const from = "0x" + (transfer.topics[1] ?? "").slice(-40);

  if (amount < minAglAmount) {
    return { ok: false, amount, from, error: `Transfer amount ${amount} AGL is below required ${minAglAmount} AGL` };
  }

  return { ok: true, amount, from };
}
