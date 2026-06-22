import { agents } from '../lib/agents'

export interface AgentGridProps {
  selectedId?: string
  onSelect: (agentId: string) => void
}

export function AgentGrid({ selectedId, onSelect }: AgentGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onSelect(agent.id)}
          className={`flex flex-col gap-1 p-2 rounded border-2 transition-all ${
            selectedId === agent.id
              ? 'border-[var(--green)] bg-[var(--green-muted)] text-[var(--green)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--border-bright)]'
          }`}
        >
          <span className="text-lg">{agent.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider">{agent.name}</span>
          <span className="text-[10px] text-[var(--text-dim)] leading-tight">{agent.tagline}</span>
        </button>
      ))}
    </div>
  )
}
