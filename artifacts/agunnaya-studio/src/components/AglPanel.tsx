import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free:       { label: 'FREE',       color: '#9ca3af', bg: '#1f2937' },
  pro:        { label: 'PRO',        color: '#00ff41', bg: '#052e16' },
  enterprise: { label: 'ENTERPRISE', color: '#facc15', bg: '#422006' },
}

const AGL_TOKEN = '0xEA1221B4d80A89BD8C75248Fae7c176BD1854698'

export function AglPanel() {
  const { status, loading, connecting, error, connectWallet, topUpCredits, subscribe } = useWallet()
  const [txHash, setTxHash] = useState('')
  const [subHash, setSubHash] = useState('')
  const [txError, setTxError] = useState('')
  const [txSuccess, setTxSuccess] = useState('')
  const [subError, setSubError] = useState('')
  const [subSuccess, setSubSuccess] = useState('')
  const [working, setWorking] = useState(false)

  if (loading) {
    return (
      <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6">
        <div className="text-xs text-[var(--text-dim)]">Loading AGL status…</div>
      </div>
    )
  }

  const tier = status?.tier ?? 'free'
  const tierStyle = TIER_LABELS[tier] ?? TIER_LABELS.free!

  async function handleTopUp() {
    if (!txHash.trim()) return
    setTxError(''); setTxSuccess(''); setWorking(true)
    try {
      const { creditsAdded } = await topUpCredits(txHash.trim())
      setTxSuccess(`+${creditsAdded} credits added`)
      setTxHash('')
    } catch (e) {
      setTxError(e instanceof Error ? e.message : 'Failed')
    } finally { setWorking(false) }
  }

  async function handleSubscribe() {
    if (!subHash.trim()) return
    setSubError(''); setSubSuccess(''); setWorking(true)
    try {
      const { subscriptionExpiresAt } = await subscribe(subHash.trim())
      const d = new Date(subscriptionExpiresAt).toLocaleDateString()
      setSubSuccess(`PRO active until ${d}`)
      setSubHash('')
    } catch (e) {
      setSubError(e instanceof Error ? e.message : 'Failed')
    } finally { setWorking(false) }
  }

  const subExpiry = status?.subscriptionExpiresAt
    ? new Date(status.subscriptionExpiresAt)
    : null
  const subActive = subExpiry && subExpiry > new Date()

  return (
    <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-[var(--green)] uppercase tracking-wider">AGL Token</h3>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest"
          style={{ color: tierStyle.color, backgroundColor: tierStyle.bg }}
        >
          {tierStyle.label}
        </span>
      </div>

      {!status?.wallet ? (
        <div className="space-y-3">
          <p className="text-xs text-[var(--text-dim)] leading-relaxed">
            Connect your wallet to unlock Pro features. Hold ≥ 100 AGL for unlimited AI access and mainnet deploys.
          </p>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="w-full py-2 text-xs font-bold bg-[var(--green)] text-[var(--bg)] rounded hover:bg-[var(--green-bright)] transition-colors disabled:opacity-50"
          >
            {connecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-dim)]">Wallet</span>
            <span className="font-mono text-[var(--text-primary)]">
              {status.wallet.slice(0, 6)}…{status.wallet.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-dim)]">AGL Balance</span>
            <span className="font-mono font-bold text-[var(--green)]">{status.onChainBalance.toLocaleString()} AGL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-dim)]">Credits</span>
            <span className="font-mono font-bold" style={{ color: status.credits < 10 ? '#f87171' : 'var(--green)' }}>
              {status.credits}
            </span>
          </div>
          {subActive && (
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-dim)]">Subscription</span>
              <span className="text-[var(--green)]">until {subExpiry!.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}

      {status?.wallet && tier === 'free' && (
        <>
          <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-bold">Buy Credits</p>
            <p className="text-[10px] text-[var(--text-dim)] leading-relaxed">
              Transfer any amount of AGL to the treasury. Each AGL = 100 credits.
            </p>
            {status.treasury && (
              <p className="font-mono text-[10px] text-[var(--text-mid)] break-all">
                Treasury: {status.treasury}
              </p>
            )}
            {!status.treasury && (
              <p className="text-[10px] text-amber-400">Treasury address not yet configured.</p>
            )}
            <input
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Paste tx hash after transfer…"
              className="w-full px-3 py-1.5 text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--green)]"
            />
            {txError && <p className="text-[10px] text-red-400">{txError}</p>}
            {txSuccess && <p className="text-[10px] text-[var(--green)]">{txSuccess}</p>}
            <button
              onClick={handleTopUp}
              disabled={working || !txHash.trim()}
              className="w-full py-1.5 text-xs font-bold bg-[var(--bg-tertiary)] text-[var(--green)] border border-[var(--green)] rounded hover:bg-[var(--green)]/10 transition-colors disabled:opacity-40"
            >
              {working ? 'Verifying…' : 'Claim Credits'}
            </button>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-bold">Subscribe — 50 AGL / 30 days</p>
            <p className="text-[10px] text-[var(--text-dim)] leading-relaxed">
              Transfer exactly 50 AGL to treasury for a 30-day PRO subscription.
            </p>
            <input
              value={subHash}
              onChange={(e) => setSubHash(e.target.value)}
              placeholder="Paste tx hash after sending 50 AGL…"
              className="w-full px-3 py-1.5 text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--green)]"
            />
            {subError && <p className="text-[10px] text-red-400">{subError}</p>}
            {subSuccess && <p className="text-[10px] text-[var(--green)]">{subSuccess}</p>}
            <button
              onClick={handleSubscribe}
              disabled={working || !subHash.trim()}
              className="w-full py-1.5 text-xs font-bold bg-[var(--green)] text-[var(--bg)] rounded hover:bg-[var(--green-bright)] transition-colors disabled:opacity-40"
            >
              {working ? 'Verifying…' : 'Activate PRO'}
            </button>
          </div>
        </>
      )}

      <div className="border-t border-[var(--border-subtle)] pt-3">
        <a
          href={`https://basescan.org/token/${AGL_TOKEN}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[10px] text-[var(--text-dim)] hover:text-[var(--green)] transition-colors"
        >
          → View AGL on BaseScan
        </a>
        <p className="text-[10px] text-[var(--text-dim)] mt-1">
          Tier: FREE (0) · PRO (≥100 AGL) · ENTERPRISE (≥1000 AGL)
        </p>
      </div>
    </div>
  )
}
