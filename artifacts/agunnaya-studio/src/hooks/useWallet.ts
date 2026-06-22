import { useState, useEffect, useCallback } from 'react'

export interface AglStatus {
  wallet: string | null
  onChainBalance: number
  tier: 'free' | 'pro' | 'enterprise'
  credits: number
  subscriptionExpiresAt: string | null
  treasury: string | null
}

const API_BASE = `${window.location.origin}/api`

export function useWallet() {
  const [status, setStatus] = useState<AglStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/agl/status`, { credentials: 'include' })
      if (res.ok) setStatus(await res.json())
    } catch (_) {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchStatus() }, [fetchStatus])

  const connectWallet = useCallback(async () => {
    const eth = (window as unknown as { ethereum?: { request: (o: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum
    if (!eth) { setError('No wallet found. Install MetaMask or a compatible wallet.'); return }
    setConnecting(true)
    setError(null)
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[]
      const address = accounts[0]
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

  const topUpCredits = useCallback(async (txHash: string) => {
    const res = await fetch(`${API_BASE}/agl/credits/topup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txHash }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Top-up failed')
    await fetchStatus()
    return data as { creditsAdded: number; totalCredits: number; aglAmount: number }
  }, [fetchStatus])

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

  return { status, loading, connecting, error, connectWallet, topUpCredits, subscribe, refresh: fetchStatus }
}
