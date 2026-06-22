import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { authClient } from '../lib/auth-client'
import { Logo } from '../components/Logo'

export default function SignUpPage() {
  const [, navigate] = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Failed to sign up')
        return
      }

      if (data) {
        navigate('/')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" animated={true} />
          <div className="mt-4 text-center">
            <div className="font-display text-3xl font-bold text-[var(--green)] tracking-wider">
              AGUNNAYA
            </div>
            <span className="text-sm text-[var(--text-dim)] uppercase tracking-wider">
              Labs Studio
            </span>
          </div>
        </div>

        <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-8">
          <h1 className="font-display text-2xl font-bold mb-6 text-center">Create Account</h1>

          {error && (
            <div className="mb-4 p-3 rounded border border-[var(--red)]/30 bg-[var(--red)]/10 text-[var(--red)] text-sm font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-3 py-2 bg-[var(--bg)] text-[var(--text-primary)] text-sm font-mono rounded border border-[var(--border-subtle)] focus:border-[var(--green)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 bg-[var(--bg)] text-[var(--text-primary)] text-sm font-mono rounded border border-[var(--border-subtle)] focus:border-[var(--green)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full px-3 py-2 bg-[var(--bg)] text-[var(--text-primary)] text-sm font-mono rounded border border-[var(--border-subtle)] focus:border-[var(--green)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-[var(--green)] text-[var(--bg)] font-bold rounded hover:bg-[var(--green-bright)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-dim)]">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[var(--green)] hover:text-[var(--green-bright)] transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
