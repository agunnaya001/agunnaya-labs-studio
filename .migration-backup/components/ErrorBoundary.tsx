'use client'

import { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('[v0] Error caught by boundary:', error)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded border border-red-500 bg-red-950/20 text-red-400">
            <div className="font-bold mb-2">Something went wrong</div>
            <details className="text-xs">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="mt-2 overflow-auto text-xs">{this.state.error?.message}</pre>
            </details>
          </div>
        )
      )
    }

    return this.props.children
  }
}

import React from 'react'
