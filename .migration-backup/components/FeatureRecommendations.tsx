'use client'

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

interface FeatureRecommendationsProps {
  onSelect?: (id: string) => void
}

export function FeatureRecommendations({ onSelect }: FeatureRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const categories = ['feature', 'optimization', 'security', 'performance']
  const filtered = selectedCategory
    ? recommendations.filter((r) => r.category === selectedCategory && !dismissed.has(r.id))
    : recommendations.filter((r) => !dismissed.has(r.id))

  const categoryIcons: Record<string, string> = {
    feature: '✨',
    optimization: '⚙️',
    security: '🛡️',
    performance: '⚡',
  }

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg)]">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Feature Recommendations</h3>
        <p className="text-xs text-[var(--text-dim)] mt-1">
          AI-powered suggestions to enhance your contracts
        </p>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)] flex gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
            selectedCategory === null
              ? 'bg-[var(--green)] text-[var(--bg)]'
              : 'bg-[var(--bg)] text-[var(--text-dim)] hover:text-[var(--text-primary)]'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[var(--green)] text-[var(--bg)]'
                : 'bg-[var(--bg)] text-[var(--text-dim)] hover:text-[var(--text-primary)]'
            }`}
          >
            {categoryIcons[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="divide-y divide-[var(--border-subtle)]">
        {filtered.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-[var(--text-dim)]">No recommendations available</p>
          </div>
        ) : (
          filtered.map((rec) => (
            <div
              key={rec.id}
              className="p-4 hover:bg-[var(--bg-tertiary)] transition-colors group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="text-lg pt-0.5">{rec.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--green)] transition-colors">
                      {rec.title}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded border ${difficultyColors[rec.difficulty]}`}>
                      {rec.difficulty}
                    </span>
                    {rec.badge && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--green)]/20 text-[var(--green)] border border-[var(--green)]/30">
                        {rec.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">{rec.description}</p>
                </div>
                <button
                  onClick={() => {
                    onSelect?.(rec.id)
                    const newDismissed = new Set(dismissed)
                    newDismissed.add(rec.id)
                    setDismissed(newDismissed)
                  }}
                  className="ml-2 px-2 py-1 text-xs font-mono bg-[var(--green)] text-[var(--bg)] rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--green-bright)]"
                >
                  Use
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
