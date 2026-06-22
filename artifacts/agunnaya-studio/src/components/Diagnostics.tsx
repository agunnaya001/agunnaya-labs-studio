interface Diagnostic {
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface DiagnosticsProps {
  items: Diagnostic[]
  isCompiling?: boolean
}

export function Diagnostics({ items, isCompiling = false }: DiagnosticsProps) {
  const errors = items.filter((item) => item.severity === 'error')
  const warnings = items.filter((item) => item.severity === 'warning')

  return (
    <div className="flex h-full flex-col bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)]">
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2">
        <div className="flex items-center gap-2 flex-1">
          {isCompiling && (
            <div className="w-2 h-2 bg-[var(--green)] rounded-full glow-pulse" />
          )}
          <span className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider">
            Diagnostics
          </span>
        </div>
        <span className="text-xs text-[var(--text-dim)]">
          {errors.length > 0 && (
            <span className="text-[var(--red)] mr-2">
              {errors.length} {errors.length === 1 ? 'error' : 'errors'}
            </span>
          )}
          {warnings.length > 0 && (
            <span className="text-[var(--yellow)]">
              {warnings.length} {warnings.length === 1 ? 'warning' : 'warnings'}
            </span>
          )}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--text-dim)] text-sm">
            {isCompiling ? 'Compiling...' : 'No diagnostics'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-2 p-2 rounded border-l-2 text-xs font-mono ${
                  item.severity === 'error'
                    ? 'bg-[var(--bg)] border-l-[var(--red)] text-[var(--red)]'
                    : item.severity === 'warning'
                      ? 'bg-[var(--bg)] border-l-[var(--yellow)] text-[var(--yellow)]'
                      : 'bg-[var(--bg)] border-l-[var(--green)] text-[var(--green)]'
                }`}
              >
                <span className="flex-shrink-0">
                  {item.severity === 'error' && '⚠️'}
                  {item.severity === 'warning' && '⚡'}
                  {item.severity === 'info' && 'ℹ️'}
                </span>
                <span className="flex-1 break-words">{item.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
