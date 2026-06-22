import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { authClient } from '../lib/auth-client'
import { Logo } from '../components/Logo'

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession()
        setIsAuthenticated(!!data)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }
    checkAuth()
  }, [])

  if (isChecking) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col">
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
            {isAuthenticated ? (
              <Link
                href="/"
                className="px-4 py-2 text-sm font-bold bg-[var(--green)] text-[var(--bg)] rounded hover:bg-[var(--green-bright)] transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-mono text-[var(--text-primary)] hover:text-[var(--green)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-bold bg-[var(--green)] text-[var(--bg)] rounded hover:bg-[var(--green-bright)] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl text-center">
          <h1 className="font-display text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-[var(--green)]">Build Anything</span>
            <br />
            With AI
          </h1>

          <p className="text-xl text-[var(--text-mid)] mb-8 max-w-2xl mx-auto leading-relaxed">
            The AI-powered platform for building Web3 applications, smart contracts, and games on Base. Get started in seconds with intelligent code generation and deployment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <>
                <Link
                  href="/ide"
                  className="px-8 py-4 bg-[var(--green)] text-[var(--bg)] font-bold rounded hover:bg-[var(--green-bright)] transition-all hover:shadow-lg hover:shadow-[var(--green)]/50"
                >
                  Launch IDE
                </Link>
                <Link
                  href="/"
                  className="px-8 py-4 border border-[var(--green)] text-[var(--green)] font-bold rounded hover:bg-[var(--green)]/10 transition-all"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="px-8 py-4 bg-[var(--green)] text-[var(--bg)] font-bold rounded hover:bg-[var(--green-bright)] transition-all hover:shadow-lg hover:shadow-[var(--green)]/50"
                >
                  Start Building
                </Link>
                <button
                  className="px-8 py-4 border border-[var(--green)] text-[var(--green)] font-bold rounded hover:bg-[var(--green)]/10 transition-all cursor-pointer"
                  onClick={() => alert('Wallet connection coming soon!')}
                >
                  Connect Wallet
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-12 text-center">
            What You Can Build
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '📱', title: 'Web Apps', desc: 'React apps with Web3' },
              { icon: '⚙️', title: 'Contracts', desc: 'Solidity on Base' },
              { icon: '🎮', title: 'Games', desc: 'Blockchain games' },
              { icon: '🚀', title: 'Deploy', desc: 'One-click deploy' },
              { icon: '💰', title: 'Monetize', desc: 'With AGL tokens' },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg)] p-6 text-center hover:border-[var(--green)] transition-colors"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-[var(--text-dim)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[var(--text-dim)]">
          <div>© 2024 Agunnaya Labs. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--green)] transition-colors">Docs</a>
            <a href="#" className="hover:text-[var(--green)] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[var(--green)] transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
