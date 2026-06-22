import { useState } from 'react'

interface Recommendation {
  id: string
  title: string
  description: string
  category: 'feature' | 'optimization' | 'security' | 'performance'
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
  badge?: string
}

const recommendations: Recommendation[] = [
  {
    id: 'gas-optimize',
    title: 'Gas Optimization',
    description: 'Use AI to identify and apply gas optimization patterns to your contracts',
    category: 'optimization',
    difficulty: 'easy',
    icon: '⚡',
    badge: 'Save up to 30% on gas',
  },
  {
    id: 'security-audit',
    title: 'Security Audit',
    description: 'Get AI-powered security analysis and vulnerability detection',
    category: 'security',
    difficulty: 'medium',
    icon: '🔒',
    badge: 'Recommended',
  },
  {
    id: 'multi-sig',
    title: 'Multi-Signature Contracts',
    description: 'Generate secure multi-signature wallet contracts',
    category: 'feature',
    difficulty: 'medium',
    icon: '🔐',
  },
  {
    id: 'nft-standard',
    title: 'NFT Implementation',
    description: 'Implement ERC-721 or ERC-1155 with advanced features',
    category: 'feature',
    difficulty: 'medium',
    icon: '🎨',
  },
  {
    id: 'token-standard',
    title: 'Token Standard',
    description: 'Generate ERC-20 token contracts with advanced features',
    category: 'feature',
    difficulty: 'easy',
    icon: '💎',
  },
  {
    id: 'upgradeable',
    title: 'Upgradeable Contracts',
    description: 'Implement proxy patterns for contract upgrades',
    category: 'feature',
    difficulty: 'hard',
    icon: '🔄',
  },
  {
    id: 'performance-tune',
    title: 'Performance Tuning',
    description: 'Optimize contract execution speed and reduce storage',
    category: 'performance',
    difficulty: 'medium',
    icon: '🚀',
  },
  {
    id: 'testing-suite',
    title: 'Testing Suite',
    description: 'Generate comprehensive test cases for your contracts',
    category: 'optimization',
    difficulty: 'easy',
    icon: '✅',
  },
]

const difficultyColors = {
  easy: 'text-[var(--green)]',
  medium: 'text-[var(--yellow)]',
  hard: 'text-[var(--red)]',
}

const categoryColors = {
  feature: 'border-blue-500/30 text-blue-400',
  optimization: 'border-[var(--green)]/30 text-[var(--green)]',
  security: 'border-[var(--red)]/30 text-[var(--red)]',
  performance: 'border-[var(--yellow)]/30 text-[var(--yellow)]',
}

interface FeatureRecommendationsProps {
  onSelect: (id: string) => void
}

export function FeatureRecommendations({ onSelect }: FeatureRecommendationsProps) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? recommendations
    : recommendations.filter((r) => r.category === filter)

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {['all', 'feature', 'optimization', 'security', 'performance'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2 py-1 text-xs font-mono rounded border transition-colors capitalize ${
              filter === cat
                ? 'bg-[var(--green)] text-[var(--bg)] border-[var(--green)]'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-dim)] border-[var(--border-subtle)] hover:border-[var(--green)] hover:text-[var(--green)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filtered.map((rec) => (
          <button
            key={rec.id}
            onClick={() => onSelect(rec.id)}
            className="w-full text-left p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--green)] hover:bg-[var(--bg-tertiary)] transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--green)] transition-colors">
                    {rec.title}
                  </span>
                  {rec.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/20">
                      {rec.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-dim)] line-clamp-2">{rec.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs border px-1.5 py-0.5 rounded capitalize ${categoryColors[rec.category]}`}>
                    {rec.category}
                  </span>
                  <span className={`text-xs capitalize ${difficultyColors[rec.difficulty]}`}>
                    {rec.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
