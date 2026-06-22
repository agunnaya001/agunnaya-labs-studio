'use client'

import { useEffect, useState } from 'react'

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
      case 'payable':
        return 'text-yellow-400'
      case 'view':
      case 'pure':
        return 'text-blue-400'
      case 'nonpayable':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)] overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider">
            Contract Preview
          </span>
          {compilationTime && (
            <span className="text-xs text-[var(--text-dim)] font-mono">
              {compilationTime}ms
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
        {/* Constructors */}
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

        {/* Functions */}
        {functions.length > 0 && (
          <div>
            <div className="font-bold text-[var(--green)] mb-2">functions</div>
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
                    <span className="text-[var(--text-dim)]">()</span>
                  </button>

                  {expandedFunctions.has(fn.name || `fn-${idx}`) && (
                    <div className="ml-4 bg-[var(--bg-tertiary)] rounded p-2 mt-1 space-y-1">
                      {fn.inputs?.length ? (
                        <div>
                          <div className="text-[var(--text-dim)] mb-1">inputs:</div>
                          {fn.inputs.map((input, i) => (
                            <div key={i} className="text-[var(--text-mid)] ml-2">
                              {input.type} {input.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[var(--text-dim)]">no inputs</div>
                      )}
                      {fn.outputs?.length ? (
                        <div>
                          <div className="text-[var(--text-dim)] mb-1">returns:</div>
                          {fn.outputs.map((output, i) => (
                            <div key={i} className="text-[var(--text-mid)] ml-2">
                              {output.type}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <div>
            <div className="font-bold text-[var(--green)] mb-2">events</div>
            <div className="space-y-1">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className="text-[var(--text-dim)] py-1 px-2 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                >
                  {event.name}
                  <span className="text-[var(--text-mid)]">
                    ({event.inputs?.length || 0} params)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bytecode Info */}
        {bytecode && (
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
            <div className="text-[var(--text-dim)]">
              bytecode: {Math.ceil(bytecode.length / 2)} bytes
            </div>
          </div>
        )}

        {/* Empty State */}
        {functions.length === 0 && events.length === 0 && constructors.length === 0 && (
          <div className="text-[var(--text-dim)] italic">no contract data available</div>
        )}
      </div>
    </div>
  )
}
