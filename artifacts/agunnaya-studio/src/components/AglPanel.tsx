import { useState, useEffect, useRef } from 'react'
import { useWallet, type StakePosition } from '../hooks/useWallet'

// ─── Contract addresses shown to users ────────────────────────────────────────
const AGL_TOKEN            = '0xEA1221B4d80A89BD8C75248Fae7c176BD1854698'
const AGL_CREDITS_CONTRACT = '0x13866F31c60822Ff70684213b9727915Ddf2c183'
const AGL_STAKING_CONTRACT = '0xd4B61B4876c15e78e0275EbA52cf62D55ED5fD30'

const TIER_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  free:       { label: 'FREE',       color: '#9ca3af', bg: '#1f2937' },
  pro:        { label: 'PRO',        color: '#00ff41', bg: '#052e16' },
  enterprise: { label: 'ENTERPRISE', color: '#facc15', bg: '#422006' },
}

function basescan(contract: string, type: 'token' | 'address' = 'address') {
  return `https://basescan.org/${type}/${contract}`
}

function shortAddr(addr: string) {
  return addr.slice(0, 6) + '…' + addr.slice(-4)
}

// ─── Staking position row ─────────────────────────────────────────────────────

function PositionRow({ pos }: { pos: StakePosition }) {
  const unlock    = new Date(pos.unlockTime)
  const isLocked  = unlock > new Date()
  const pending   = pos.pendingReward.toFixed(4)

  return (
    <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-3 py-2 space-y-1 text-[11px]">
      <div className="flex justify-between items-center">
        <span className="font-mono font-bold text-[var(--green)]">
          {pos.amount.toLocaleString()} AGL
        </span>
        <span className="text-[var(--text-dim)]">{pos.aprPercent}% APR</span>
      </div>
      <div className="flex justify-between items-center text-[var(--text-dim)]">
        <span>Unlock {unlock.toLocaleDateString()}</span>
        <span
          className="font-medium"
          style={{ color: isLocked ? '#f59e0b' : '#00ff41' }}
        >
          {isLocked ? '🔒 Locked' : '✓ Claimable'}
        </span>
      </div>
      {pos.pendingReward > 0 && (
        <div className="flex justify-between text-[var(--text-dim)]">
          <span>Pending reward</span>
          <span className="font-mono text-[var(--green)]">+{pending} AGL</span>
        </div>
      )}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function AglPanel() {
  const {
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
  } = useWallet()

  // Buy credits state
  const [aglInput,     setAglInput]     = useState('')
  const [preview,      setPreview]      = useState<{ credits: number; ratePerAgl: number } | null>(null)
  const [buyStep,      setBuyStep]      = useState<'idle' | 'approving' | 'purchasing' | 'verifying'>('idle')
  const [buyError,     setBuyError]     = useState('')
  const [buySuccess,   setBuySuccess]   = useState('')

  // Manual tx hash fallback
  const [txHash,       setTxHash]       = useState('')

  // Subscribe state
  const [subHash,      setSubHash]      = useState('')
  const [subError,     setSubError]     = useState('')
  const [subSuccess,   setSubSuccess]   = useState('')
  const [subWorking,   setSubWorking]   = useState(false)

  // Preview debounce
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const amount = Number(aglInput)
    if (!Number.isFinite(amount) || amount <= 0) { setPreview(null); return }
    if (previewTimer.current) clearTimeout(previewTimer.current)
    previewTimer.current = setTimeout(async () => {
      const result = await previewCredits(amount)
      setPreview(result)
    }, 400)
    return () => { if (previewTimer.current) clearTimeout(previewTimer.current) }
  }, [aglInput, previewCredits])

  // ── Buy credits (on-chain) ────────────────────────────────────────────────

  async function handleBuyOnChain() {
    const amount = Number(aglInput)
    if (!Number.isFinite(amount) || amount <= 0) return
    setBuyError(''); setBuySuccess(''); setBuyStep('approving')
    try {
      const purchaseTxHash = await purchaseCreditsOnChain(amount)
      setBuyStep('verifying')
      const result = await topUpCredits(purchaseTxHash)
      setBuySuccess(`+${result.creditsAdded} credits added (burned ${result.aglAmount} AGL)`)
      setAglInput(''); setPreview(null); setBuyStep('idle')
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : 'Purchase failed')
      setBuyStep('idle')
    }
  }

  // ── Manual tx hash fallback ───────────────────────────────────────────────

  async function handleManualTopUp() {
    if (!txHash.trim()) return
    setBuyError(''); setBuySuccess(''); setBuyStep('verifying')
    try {
      const result = await topUpCredits(txHash.trim())
      setBuySuccess(`+${result.creditsAdded} credits added`)
      setTxHash(''); setBuyStep('idle')
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : 'Verification failed')
      setBuyStep('idle')
    }
  }

  // ── Subscribe ─────────────────────────────────────────────────────────────

  async function handleSubscribe() {
    if (!subHash.trim()) return
    setSubError(''); setSubSuccess(''); setSubWorking(true)
    try {
      const data = await subscribe(subHash.trim())
      const d = new Date(data.subscriptionExpiresAt).toLocaleDateString()
      setSubSuccess(`PRO active until ${d}`)
      setSubHash('')
    } catch (e) {
      setSubError(e instanceof Error ? e.message : 'Subscribe failed')
    } finally { setSubWorking(false) }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6">
        <div className="text-xs text-[var(--text-dim)]">Loading AGL status…</div>
      </div>
    )
  }

  const tier      = status?.tier ?? 'free'
  const tierStyle = TIER_STYLE[tier] ?? TIER_STYLE.free!

  const subExpiry = status?.subscriptionExpiresAt ? new Date(status.subscriptionExpiresAt) : null
  const subActive = subExpiry && subExpiry > new Date()

  const buyStepLabel: Record<typeof buyStep, string> = {
    idle:       'Approve & Buy',
    approving:  'Approving AGL…',
    purchasing: 'Sending purchaseCredits…',
    verifying:  'Verifying on-chain…',
  }
  const busy = buyStep !== 'idle'

  return (
    <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-5">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-[var(--green)] uppercase tracking-wider">AGL Token</h3>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest"
          style={{ color: tierStyle.color, backgroundColor: tierStyle.bg }}
        >
          {tierStyle.label}
        </span>
      </div>

      {/* ── Not connected ────────────────────────────────────────────────── */}
      {!status?.wallet ? (
        <div className="space-y-3">
          <p className="text-xs text-[var(--text-dim)] leading-relaxed">
            Connect your wallet to unlock Pro features. Hold ≥ 100 AGL (held + staked) for unlimited AI access and mainnet deploys.
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

        /* ── Connected: balances + tier ─────────────────────────────────── */
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-dim)]">Wallet</span>
            <span className="font-mono text-[var(--text-primary)]">
              {shortAddr(status.wallet)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-dim)]">Held AGL</span>
            <span className="font-mono font-bold text-[var(--green)]">
              {(status.heldBalance ?? status.onChainBalance).toLocaleString()}
            </span>
          </div>
          {(stakingData?.totalStakedAgl ?? 0) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-dim)]">Staked AGL</span>
              <span className="font-mono font-bold text-amber-400">
                {stakingData!.totalStakedAgl.toLocaleString()}
              </span>
            </div>
          )}
          {(stakingData?.totalStakedAgl ?? 0) > 0 && (
            <div className="flex justify-between items-center border-t border-[var(--border-subtle)] pt-1">
              <span className="text-[var(--text-dim)]">Total (Held + Staked)</span>
              <span className="font-mono font-bold text-[var(--green)]">
                {(status.onChainBalance).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-dim)]">Credits</span>
            <span
              className="font-mono font-bold"
              style={{ color: status.credits < 10 ? '#f87171' : 'var(--green)' }}
            >
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

      {/* ── Staking positions ────────────────────────────────────────────── */}
      {status?.wallet && (stakingData?.positions.length ?? 0) > 0 && (
        <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-bold">
            Staking Positions ({stakingData!.positions.length})
          </p>
          <div className="space-y-2">
            {stakingData!.positions.map(pos => (
              <PositionRow key={pos.positionId} pos={pos} />
            ))}
          </div>
          <a
            href={basescan(AGL_STAKING_CONTRACT)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[10px] text-[var(--text-dim)] hover:text-[var(--green)] transition-colors"
          >
            → View Staking Contract on BaseScan
          </a>
        </div>
      )}

      {/* ── Buy Credits (on-chain burn via Credits contract) ─────────────── */}
      {status?.wallet && tier === 'free' && (
        <>
          <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-bold">Buy Credits</p>
            <p className="text-[10px] text-[var(--text-dim)] leading-relaxed">
              AGL is burned via the Credits contract. MetaMask will ask you to approve, then purchase in two steps.
            </p>

            <div className="flex gap-2">
              <input
                value={aglInput}
                onChange={(e) => setAglInput(e.target.value)}
                placeholder="AGL amount…"
                type="number"
                min="1"
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--green)]"
              />
              {preview && (
                <div className="flex items-center px-2 text-[10px] font-bold text-[var(--green)] whitespace-nowrap">
                  → {preview.credits} credits
                </div>
              )}
            </div>

            {preview && (
              <p className="text-[10px] text-[var(--text-dim)]">
                Rate: {preview.ratePerAgl} credits / AGL (on-chain)
              </p>
            )}

            <button
              onClick={handleBuyOnChain}
              disabled={busy || !aglInput || Number(aglInput) <= 0}
              className="w-full py-1.5 text-xs font-bold bg-[var(--green)] text-[var(--bg)] rounded hover:bg-[var(--green-bright)] transition-colors disabled:opacity-40"
            >
              {buyStepLabel[buyStep]}
            </button>

            {/* Manual fallback */}
            <details className="text-[10px] text-[var(--text-dim)]">
              <summary className="cursor-pointer hover:text-[var(--text-primary)] select-none">
                Already sent tx manually? Paste hash here
              </summary>
              <div className="mt-2 space-y-2">
                <p className="leading-relaxed">
                  Call <code className="text-[var(--green)]">purchaseCredits(amount)</code> on the Credits contract, then paste the tx hash.
                </p>
                <p className="font-mono break-all text-[var(--text-mid)]">{AGL_CREDITS_CONTRACT}</p>
                <input
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="0x… purchaseCredits tx hash"
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--green)]"
                />
                <button
                  onClick={handleManualTopUp}
                  disabled={busy || !txHash.trim()}
                  className="w-full py-1.5 text-xs font-bold bg-[var(--bg-tertiary)] text-[var(--green)] border border-[var(--green)] rounded hover:bg-[var(--green)]/10 transition-colors disabled:opacity-40"
                >
                  {buyStep === 'verifying' ? 'Verifying…' : 'Verify Tx'}
                </button>
              </div>
            </details>

            {buyError   && <p className="text-[10px] text-red-400">{buyError}</p>}
            {buySuccess && <p className="text-[10px] text-[var(--green)]">{buySuccess}</p>}
          </div>

          {/* ── Subscribe (treasury transfer) ──────────────────────────── */}
          <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-bold">
              Subscribe — 50 AGL / 30 days
            </p>
            <p className="text-[10px] text-[var(--text-dim)] leading-relaxed">
              Transfer exactly 50 AGL to the treasury, then paste the tx hash.
            </p>
            {status.treasury && (
              <p className="font-mono text-[10px] text-[var(--text-mid)] break-all">
                Treasury: {status.treasury}
              </p>
            )}
            <input
              value={subHash}
              onChange={(e) => setSubHash(e.target.value)}
              placeholder="0x… transfer tx hash"
              className="w-full px-3 py-1.5 text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--green)]"
            />
            {subError   && <p className="text-[10px] text-red-400">{subError}</p>}
            {subSuccess && <p className="text-[10px] text-[var(--green)]">{subSuccess}</p>}
            <button
              onClick={handleSubscribe}
              disabled={subWorking || !subHash.trim()}
              className="w-full py-1.5 text-xs font-bold bg-[var(--green)] text-[var(--bg)] rounded hover:bg-[var(--green-bright)] transition-colors disabled:opacity-40"
            >
              {subWorking ? 'Verifying…' : 'Activate PRO'}
            </button>
          </div>
        </>
      )}

      {/* ── Footer links ─────────────────────────────────────────────────── */}
      <div className="border-t border-[var(--border-subtle)] pt-3 space-y-1">
        <a
          href={basescan(AGL_TOKEN, 'token')}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[10px] text-[var(--text-dim)] hover:text-[var(--green)] transition-colors"
        >
          → AGL Token on BaseScan
        </a>
        <a
          href={basescan(AGL_CREDITS_CONTRACT)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[10px] text-[var(--text-dim)] hover:text-[var(--green)] transition-colors"
        >
          → Credits Contract on BaseScan
        </a>
        <p className="text-[10px] text-[var(--text-dim)] pt-0.5">
          Tier: FREE (0) · PRO (≥ 100 AGL) · ENTERPRISE (≥ 1000 AGL) — held + staked combined
        </p>
      </div>
    </div>
  )
}
