import { useState } from 'react'

interface ContractPreviewProps {
  abi: unknown[]
  bytecode?: string
  compilationTime?: number
}

interface AbiFunction {
  name?: string
  type?: string
  inputs?: Array<{ name: string; type: string }>
  outputs?: Array<{ name: string; type: string }>
  stateMutability?: string
}

export function ContractPreview({ abi, bytecode, compilationTime }: ContractPreviewProps) {
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(new Set())

  const functions = (abi as AbiFunction[]).filter((item) => item.type === 'function') || []
  const events = (abi as AbiFunction[]).filter((item) => item.type === 'event') || []
  const constructors = (abi as AbiFunction[]).filter((item) => item.type === 'constructor') || []

  const toggleExpand = (name: string) => {
    const newExpanded = new Set(expandedFunctions)
    if (newExpanded.has(name)) {
      newExpanded.delete(name)
    } else {
      newExpanded.add(name)
    }
    setExpandedFunctions(newExpanded)
  }

  const getStateMutabilityColor = (mutability?: string) => {
    switch (mutability) {
      case 'payable': return 'text-yellow-400'
      case 'view':
      case 'pure': return 'text-blue-400'
      case 'nonpayable': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  if (abi.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)]">
        <div className="text-[var(--text-dim)] text-sm text-center">
          <div className="text-2xl mb-2">📄</div>
          <div>Compile to see contract ABI</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)] overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider">
            Contract ABI
          </span>
          {compilationTime && (
            <span className="text-xs text-[var(--text-dim)] font-mono">
              {compilationTime}ms
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
        {constructors.length > 0 && (
          <div>
            <div className="font-bold text-[var(--green)] mb-2">constructor</div>
            {constructors.map((fn, idx) => (
              <div key={idx} className="ml-2 text-[var(--text-dim)] space-y-1">
                {fn.inputs?.map((input, i) => (
                  <div key={i} className="text-[var(--text-mid)]">
                    {input.type} {input.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {functions.length > 0 && (
          <div>
            <div className="font-bold text-[var(--green)] mb-2">functions ({functions.length})</div>
            <div className="space-y-1">
              {functions.map((fn, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => toggleExpand(fn.name || `fn-${idx}`)}
                    className="w-full text-left hover:text-[var(--green)] transition-colors py-1 px-2 hover:bg-[var(--bg-tertiary)] rounded"
                  >
                    <span className={getStateMutabilityColor(fn.stateMutability)}>
                      {fn.stateMutability}
                    </span>
                    {' '}
                    <span className="text-[var(--text-primary)]">{fn.name}</span>
                    <span className="text-[var(--text-dim)]">({fn.inputs?.map(i => i.type).join(', ')})</span>
                  </button>
                  {expandedFunctions.has(fn.name || `fn-${idx}`) && fn.inputs && fn.inputs.length > 0 && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {fn.inputs.map((input, i) => (
                        <div key={i} className="text-[var(--text-dim)]">
                          <span className="text-[var(--text-mid)]">{input.type}</span> {input.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div>
            <div className="font-bold text-[var(--green)] mb-2">events ({events.length})</div>
            <div className="space-y-1">
              {events.map((ev, idx) => (
                <div key={idx} className="py-1 px-2 text-[var(--text-dim)]">
                  <span className="text-purple-400">event</span>{' '}
                  <span className="text-[var(--text-primary)]">{ev.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bytecode && (
          <div>
            <div className="font-bold text-[var(--green)] mb-2">bytecode</div>
            <div className="text-[var(--text-dim)] break-all text-[10px] p-2 bg-[var(--bg)] rounded">
              {bytecode.slice(0, 64)}...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
