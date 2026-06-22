interface QuickPromptsProps {
  agentId: string
  onSelect: (prompt: string) => void
}

const quickPrompts: Record<string, string[]> = {
  architect: [
    'Review contract architecture',
    'Suggest design patterns',
    'Optimize for scalability',
    'Suggest refactoring',
  ],
  'solidity-dev': [
    'Add error handling',
    'Implement events',
    'Add modifiers',
    'Optimize functions',
  ],
  auditor: [
    'Check security issues',
    'Find vulnerabilities',
    'Review access control',
    'Audit reentrancy',
  ],
  'gas-optimizer': [
    'Optimize gas usage',
    'Check storage layout',
    'Suggest unchecked blocks',
    'Optimize loops',
  ],
  tester: [
    'Generate test cases',
    'Add fuzz tests',
    'Test edge cases',
    'Write invariants',
  ],
  frontend: [
    'Show contract ABI usage',
    'Generate frontend code',
    'Add wallet integration',
    'Create transaction helpers',
  ],
  deployer: [
    'Deployment checklist',
    'Gas estimates',
    'Network config',
    'Safe deployment steps',
  ],
  'doc-writer': [
    'Generate NatSpec',
    'Write README',
    'Document functions',
    'Create API docs',
  ],
}

export function QuickPrompts({ agentId, onSelect }: QuickPromptsProps) {
  const prompts = quickPrompts[agentId] || []

  return (
    <div className="grid grid-cols-2 gap-1">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(prompt)}
          className="px-2 py-1 text-xs font-mono text-[var(--text-dim)] bg-[var(--bg)] rounded border border-[var(--border-subtle)] hover:border-[var(--green)] hover:text-[var(--green)] transition-all"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
