import { useState } from 'react'
import { formatAddress } from '../lib/wallet'
import { supportedChains, mainnetChains, testnetChains } from '../lib/chains'

export interface DeployPaneProps {
  isConnected: boolean
  address: string | null
  chainId: number | null
  onConnect: () => void
  onChainSwitch: (chainId: number) => void
  onDeploy: (chainId: number, contractName: string) => void
  isDeploying?: boolean
  deployments: Array<{
    chainId: number
    address: string
    txHash: string
    timestamp: string
  }>
}

export function DeployPane({
  isConnected,
  address,
  chainId,
  onConnect,
  onChainSwitch,
  onDeploy,
  isDeploying = false,
  deployments = [],
}: DeployPaneProps) {
  const [contractName, setContractName] = useState('MyContract')
  const [showTestnets, setShowTestnets] = useState(true)
  const currentChain = chainId ? supportedChains.find((c) => c.id === chainId) : null
  const chainOptions = showTestnets ? testnetChains : mainnetChains

  return (
    <div className="flex h-full flex-col bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)] overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider">
          Deployment
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">
            Wallet
          </label>
          {isConnected && address ? (
            <div className="flex items-center justify-between px-2 py-1 bg-[var(--bg)] rounded border border-[var(--green-border)]">
              <span className="text-xs font-mono text-[var(--green)]">
                {formatAddress(address)}
              </span>
              <div className="w-2 h-2 bg-[var(--green)] rounded-full glow-pulse" />
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="w-full px-3 py-2 bg-[var(--green)] text-[var(--bg)] text-xs font-bold rounded border border-[var(--green)] hover:bg-[var(--green-bright)] transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {isConnected && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">
              Network
            </label>
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => setShowTestnets(true)}
                className={`flex-1 px-2 py-1 text-xs font-mono rounded border transition-all ${
                  showTestnets
                    ? 'bg-[var(--green-muted)] border-[var(--green)] text-[var(--green)]'
                    : 'bg-[var(--bg)] border-[var(--border-subtle)] text-[var(--text-dim)]'
                }`}
              >
                Testnet
              </button>
              <button
                onClick={() => setShowTestnets(false)}
                className={`flex-1 px-2 py-1 text-xs font-mono rounded border transition-all ${
                  !showTestnets
                    ? 'bg-[var(--green-muted)] border-[var(--green)] text-[var(--green)]'
                    : 'bg-[var(--bg)] border-[var(--border-subtle)] text-[var(--text-dim)]'
                }`}
              >
                Mainnet
              </button>
            </div>
            <select
              value={chainId || ''}
              onChange={(e) => onChainSwitch(Number(e.target.value))}
              className="w-full px-2 py-1 bg-[var(--bg)] text-[var(--text-primary)] text-xs font-mono rounded border border-[var(--border-subtle)] focus:border-[var(--green)] focus:outline-none"
            >
              {chainOptions.map((chain) => (
                <option key={chain.id} value={chain.id} className="bg-[var(--bg-secondary)]">
                  {chain.name}
                </option>
              ))}
            </select>
            {currentChain && (
              <div className="text-[10px] text-[var(--text-dim)] space-y-0.5">
                <div>Block Time: {currentChain.blockTime}s</div>
                <a
                  href={currentChain.explorer}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[var(--green)] hover:underline"
                >
                  Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        {isConnected && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">
              Contract Name
            </label>
            <input
              type="text"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              placeholder="MyContract"
              className="w-full px-2 py-1 bg-[var(--bg)] text-[var(--text-primary)] text-xs font-mono rounded border border-[var(--border-subtle)] focus:border-[var(--green)] focus:outline-none"
            />
          </div>
        )}

        {isConnected && (
          <button
            onClick={() => onDeploy(chainId || 1, contractName)}
            disabled={isDeploying || !chainId}
            className="w-full px-3 py-2 bg-[var(--green)] text-[var(--bg)] text-xs font-bold rounded border border-[var(--green)] hover:bg-[var(--green-bright)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isDeploying ? 'Deploying...' : 'Deploy Contract'}
          </button>
        )}

        {deployments.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider block">
              Recent Deployments
            </span>
            <div className="space-y-1">
              {deployments.slice(0, 3).map((deploy, idx) => {
                const chain = supportedChains.find((c) => c.id === deploy.chainId)
                return (
                  <a
                    key={idx}
                    href={`${chain?.explorer}/tx/${deploy.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[10px] text-[var(--green)] hover:text-[var(--green-bright)] font-mono truncate"
                  >
                    {chain?.shortName}: {deploy.address.slice(0, 8)}...
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
