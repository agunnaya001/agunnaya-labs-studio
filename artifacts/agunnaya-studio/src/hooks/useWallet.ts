import { useState, useEffect, useCallback } from 'react'

// ─── Contract addresses (Base mainnet) ────────────────────────────────────────
const AGL_TOKEN            = '0xEA1221B4d80A89BD8C75248Fae7c176BD1854698'
const AGL_CREDITS_CONTRACT = '0x13866F31c60822Ff70684213b9727915Ddf2c183'

// Function selectors
// approve(address,uint256)   = 0x095ea7b3  (well-known ERC-20)
// purchaseCredits(uint256)   = 0xbef101fb  (keccak256 verified)
const SEL_APPROVE          = '0x095ea7b3'
const SEL_PURCHASE_CREDITS = '0xbef101fb'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AglStatus {
  wallet:                string | null
  heldBalance:           number
  stakedBalance:         number
  onChainBalance:        number   // heldBalance + stakedBalance (backwards compat)
  tier:                  'free' | 'pro' | 'enterprise'
  credits:               number
  subscriptionExpiresAt: string | null
  treasury:              string | null
}

export interface StakePosition {
  positionId:     number
  amount:         number
  startTime:      string   // ISO string from API
  unlockTime:     string   // ISO string from API
  tierId:         number
  aprBasisPoints: number
  aprPercent:     number
  withdrawn:      boolean
  pendingReward:  number
}

export interface StakingData {
  positions:     StakePosition[]
  totalStakedAgl: number
}

interface EthProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

function getEth(): EthProvider | null {
  return (window as unknown as { ethereum?: EthProvider }).ethereum ?? null
}

// ─── ABI encoding helpers (no external deps) ──────────────────────────────────

function abiAddr(address: string): string {
  return address.replace(/^0x/i, '').toLowerCase().padStart(64, '0')
}

function abiUint(value: bigint): string {
  return value.toString(16).padStart(64, '0')
}

// ─── API base ─────────────────────────────────────────────────────────────────

const API_BASE = `${window.location.origin}/api`

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWallet() {
  const [status,       setStatus]       = useState<AglStatus | null>(null)
  const [stakingData,  setStakingData]  = useState<StakingData | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [connecting,   setConnecting]   = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  // ── Fetch AGL status ────────────────────────────────────────────────────────

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/agl/status`, { credentials: 'include' })
      if (res.ok) setStatus(await res.json())
    } catch (_) {}
    finally { setLoading(false) }
  }, [])

  // ── Fetch staking positions ─────────────────────────────────────────────────

  const fetchStakingPositions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/agl/stake/positions`, { credentials: 'include' })
      if (res.ok) setStakingData(await res.json())
    } catch (_) {}
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Fetch staking positions once wallet is known
  useEffect(() => {
    if (status?.wallet) fetchStakingPositions()
  }, [status?.wallet, fetchStakingPositions])

  // ── Connect wallet ──────────────────────────────────────────────────────────

  const connectWallet = useCallback(async () => {
    const eth = getEth()
    if (!eth) { setError('No wallet found. Install MetaMask or a compatible wallet.'); return }
    setConnecting(true)
    setError(null)
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[]
      const address  = accounts[0]
      if (!address) { setError('No account selected'); return }
      const res = await fetch(`${API_BASE}/agl/wallet`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      if (!res.ok) { setError((await res.json()).error ?? 'Failed to save wallet'); return }
      await fetchStatus()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Wallet connection failed')
    } finally { setConnecting(false) }
  }, [fetchStatus])

  // ── Preview credits (on-chain read) ────────────────────────────────────────

  const previewCredits = useCallback(async (aglAmount: number): Promise<{ credits: number; ratePerAgl: number } | null> => {
    if (aglAmount <= 0) return null
    try {
      const res = await fetch(`${API_BASE}/agl/credits/preview?amount=${encodeURIComponent(aglAmount)}`)
      if (!res.ok) return null
      return await res.json() as { credits: number; ratePerAgl: number }
    } catch (_) { return null }
  }, [])

  // ── Purchase credits on-chain (approve + purchaseCredits via MetaMask) ──────
  // Returns the purchaseCredits tx hash which the backend will verify.

  const purchaseCreditsOnChain = useCallback(async (aglAmount: number): Promise<string> => {
    const eth = getEth()
    if (!eth)          throw new Error('No wallet found. Install MetaMask.')
    if (!status?.wallet) throw new Error('No wallet connected.')

    const amountWei = BigInt(Math.max(1, Math.floor(aglAmount))) * BigInt(10 ** 18)

    // Step 1 — Approve Credits contract to spend AGL
    const approveTxHash = await eth.request({
      method: 'eth_sendTransaction',
      params: [{
        from: status.wallet,
        to:   AGL_TOKEN,
        data: SEL_APPROVE + abiAddr(AGL_CREDITS_CONTRACT) + abiUint(amountWei),
      }],
    }) as string

    // Wait for the approval to be mined before spending allowance
    await waitForReceipt(eth, approveTxHash)

    // Step 2 — Call purchaseCredits (burns AGL, emits CreditsPurchased)
    const purchaseTxHash = await eth.request({
      method: 'eth_sendTransaction',
      params: [{
        from: status.wallet,
        to:   AGL_CREDITS_CONTRACT,
        data: SEL_PURCHASE_CREDITS + abiUint(amountWei),
      }],
    }) as string

    return purchaseTxHash
  }, [status?.wallet])

  // ── Submit credits tx hash to backend ──────────────────────────────────────

  const topUpCredits = useCallback(async (txHash: string) => {
    const res = await fetch(`${API_BASE}/agl/credits/topup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txHash }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Top-up failed')
    await Promise.all([fetchStatus(), fetchStakingPositions()])
    return data as { creditsAdded: number; totalCredits: number; aglAmount: number }
  }, [fetchStatus, fetchStakingPositions])

  // ── Subscribe (50 AGL treasury transfer) ───────────────────────────────────

  const subscribe = useCallback(async (txHash: string) => {
    const res = await fetch(`${API_BASE}/agl/subscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txHash }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Subscribe failed')
    await fetchStatus()
    return data as { tier: string; subscriptionExpiresAt: string }
  }, [fetchStatus])

  return {
    status,
    stakingData,
    loading,
    connecting,
    error,
    connectWallet,
    previewCredits,
    purchaseCreditsOnChain,
    topUpCredits,
    subscribe,
    refresh: fetchStatus,
    refreshStaking: fetchStakingPositions,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Poll for a transaction receipt (max 90 s). Throws on timeout or revert. */
async function waitForReceipt(eth: EthProvider, txHash: string, maxMs = 90_000): Promise<void> {
  const deadline = Date.now() + maxMs
  while (Date.now() < deadline) {
    const receipt = await eth.request({
      method:  'eth_getTransactionReceipt',
      params:  [txHash],
    }) as { status: string } | null

    if (receipt) {
      if (receipt.status !== '0x1') throw new Error('Transaction reverted')
      return
    }
    await sleep(2500)
  }
  throw new Error('Transaction not mined within 90 seconds. Check your wallet.')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
