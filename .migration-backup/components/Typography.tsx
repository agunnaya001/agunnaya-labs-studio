'use client'

import React, { ReactNode } from 'react'

interface TypographyProps {
  children: ReactNode
  className?: string
  responsive?: boolean
}

export function H1({ children, className = '', responsive = true }: TypographyProps) {
  return (
    <h1
      className={`font-display font-bold text-5xl md:text-6xl tracking-wider text-[var(--green)] ${
        responsive ? 'text-pretty' : ''
      } ${className}`}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className = '', responsive = true }: TypographyProps) {
  return (
    <h2
      className={`font-display font-bold text-3xl md:text-4xl tracking-wide text-[var(--text-primary)] ${
        responsive ? 'text-balance' : ''
      } ${className}`}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className = '', responsive = true }: TypographyProps) {
  return (
    <h3
      className={`font-display font-bold text-2xl md:text-3xl tracking-wide text-[var(--text-primary)] ${
        responsive ? 'text-balance' : ''
      } ${className}`}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className = '', responsive = true }: TypographyProps) {
  return (
    <h4
      className={`font-display font-bold text-xl tracking-wide text-[var(--text-primary)] ${
        responsive ? 'text-balance' : ''
      } ${className}`}
    >
      {children}
    </h4>
  )
}

export function Paragraph({
  children,
  className = '',
  responsive = true,
  variant = 'body',
}: TypographyProps & { variant?: 'body' | 'secondary' | 'muted' }) {
  const variants = {
    body: 'text-base text-[var(--text-primary)] leading-relaxed',
    secondary: 'text-sm text-[var(--text-mid)] leading-relaxed',
    muted: 'text-xs text-[var(--text-dim)] leading-relaxed',
  }

  return (
    <p
      className={`${variants[variant]} ${responsive ? 'text-balance' : ''} ${className}`}
    >
      {children}
    </p>
  )
}

export function Label({
  children,
  className = '',
  htmlFor,
}: TypographyProps & { htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-[var(--text-primary)] mb-2 ${className}`}
    >
      {children}
    </label>
  )
}

export function Code({
  children,
  className = '',
  inline = false,
}: TypographyProps & { inline?: boolean }) {
  if (inline) {
    return (
      <code className={`font-mono text-sm bg-[var(--bg-tertiary)] px-2 py-1 rounded text-[var(--green)] ${className}`}>
        {children}
      </code>
    )
  }

  return (
    <pre className={`font-mono text-xs bg-[var(--bg-tertiary)] p-4 rounded overflow-x-auto text-[var(--text-primary)] ${className}`}>
      <code>{children}</code>
    </pre>
  )
}

export function Badge({
  children,
  className = '',
  variant = 'default',
}: TypographyProps & { variant?: 'default' | 'success' | 'error' | 'warning' | 'info' }) {
  const variants = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function Highlight({
  children,
  className = '',
}: TypographyProps) {
  return (
    <mark className={`bg-[var(--green)]/20 text-[var(--green)] px-1 rounded ${className}`}>
      {children}
    </mark>
  )
}
