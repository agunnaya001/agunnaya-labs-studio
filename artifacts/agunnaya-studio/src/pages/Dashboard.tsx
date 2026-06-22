import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { authClient } from '../lib/auth-client'
import { Logo } from '../components/Logo'
import { FeatureRecommendations } from '../components/FeatureRecommendations'
import { ToastNotification, Toast } from '../components/ToastNotification'
import { AglPanel } from '../components/AglPanel'

interface Project {
  id: number
  name: string
  code: string
  description?: string
  createdAt: string
  updatedAt: string
}

const features = [
  {
    id: 'apps',
    title: 'Generate Apps',
    description: 'Build web applications with AI assistance and Web3 integration',
    icon: '📱',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'contracts',
    title: 'Smart Contracts',
    description: 'Develop, audit, and deploy Solidity contracts on Base',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'games',
    title: 'Generate Games',
    description: 'Create blockchain games with multiplayer support',
    icon: '🎮',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'deploy',
    title: 'Deploy to Base',
    description: 'One-click deployment to Base mainnet with gas optimization',
    icon: '🚀',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'monetize',
    title: 'Monetize with AGL',
    description: 'Integrate native monetization and token economics',
    icon: '💰',
    color: 'from-red-500 to-rose-500',
  },
]

export default function Dashboard() {
  const [, navigate] = useLocation()
  const [session, setSession] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewProject, setShowNewProject] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: Toast['type'] = 'info', duration?: number) => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = { id, message, type, duration }
    setToasts((prev) => [...prev, toast])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession()
        if (!data) {
          navigate('/sign-in')
          return
        }
        setSession(data)
      } catch (error) {
        console.error('Auth error:', error)
        navigate('/sign-in')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  const handleLogout = async () => {
    await authClient.signOut()
    navigate('/sign-in')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
        <div className="text-[var(--green)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" animated={true} />
            <div>
              <div className="font-display text-2xl font-bold text-[var(--green)] tracking-wider">
                AGUNNAYA
              </div>
              <span className="text-sm text-[var(--text-dim)] uppercase tracking-wider">
                Labs Studio
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-dim)]">
              {session?.user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-xs font-mono bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded border border-[var(--border-subtle)] hover:border-[var(--green)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16">
          <h1 className="font-display text-5xl font-bold mb-2 text-[var(--green)]">
            Build Anything With AI
          </h1>
          <p className="text-lg text-[var(--text-mid)] max-w-2xl">
            Choose what you want to create and let AI guide you through every step
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href="/ide"
              className="group relative overflow-hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--green)] transition-all hover:bg-[var(--bg-tertiary)] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--green)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-sm mb-2 text-[var(--text-primary)] group-hover:text-[var(--green)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="absolute inset-0 rounded border border-[var(--green)]/0 group-hover:border-[var(--green)]/50 group-hover:shadow-lg group-hover:shadow-[var(--green)]/20 transition-all pointer-events-none" />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Recent Projects</h2>
              <button
                onClick={() => setShowNewProject(!showNewProject)}
                className="px-3 py-1 text-xs font-bold bg-[var(--green)] text-[var(--bg)] rounded hover:bg-[var(--green-bright)] transition-colors"
              >
                + New Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-8 text-center">
                <div className="text-[var(--text-dim)] mb-3">No projects yet</div>
                <p className="text-sm text-[var(--text-dim)]">
                  Click a feature above or create a new project to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/ide?project=${project.id}`}
                    className="block rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 hover:border-[var(--green)] hover:bg-[var(--bg-tertiary)] transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-mono font-bold text-sm text-[var(--green)] group-hover:text-[var(--green-bright)] transition-colors truncate">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="text-xs text-[var(--text-dim)] mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-dim)] whitespace-nowrap ml-4">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6">
              <h3 className="font-bold text-sm mb-4 text-[var(--green)] uppercase tracking-wider">
                Quick Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-dim)]">Projects</span>
                  <span className="font-mono font-bold text-[var(--green)]">{projects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-dim)]">Deployments</span>
                  <span className="font-mono font-bold text-[var(--green)]">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-dim)]">AI Interactions</span>
                  <span className="font-mono font-bold text-[var(--green)]">0</span>
                </div>
              </div>
            </div>

            <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6">
              <h3 className="font-bold text-sm mb-4 text-[var(--green)] uppercase tracking-wider">
                Resources
              </h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-[var(--text-mid)] hover:text-[var(--green)] transition-colors">→ Documentation</a>
                <a href="#" className="block text-[var(--text-mid)] hover:text-[var(--green)] transition-colors">→ Base Network Docs</a>
                <a href="#" className="block text-[var(--text-mid)] hover:text-[var(--green)] transition-colors">→ API Reference</a>
              </div>
            </div>

            <AglPanel />

            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Recommended For You</h2>
              <FeatureRecommendations
                onSelect={(id) => {
                  addToast(`Loading recommendation: ${id}`, 'info')
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
