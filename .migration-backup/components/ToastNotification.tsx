'use client'

import { useEffect, useState } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration?: number
}

export interface ToastNotificationProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: () => void
}) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const duration = toast.duration || 3000
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onDismiss, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  const bgColor = {
    info: 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)]',
    success: 'bg-[var(--bg-tertiary)] border-[var(--green)]',
    error: 'bg-[var(--bg-tertiary)] border-[var(--red)]',
    warning: 'bg-[var(--bg-tertiary)] border-[var(--yellow)]',
  }[toast.type]

  const textColor = {
    info: 'text-[var(--text-primary)]',
    success: 'text-[var(--green)]',
    error: 'text-[var(--red)]',
    warning: 'text-[var(--yellow)]',
  }[toast.type]

  const icon = {
    info: 'ℹ️',
    success: '✓',
    error: '⚠️',
    warning: '⚡',
  }[toast.type]

  return (
    <div
      className={`pointer-events-auto px-4 py-3 rounded border backdrop-blur-sm transition-all ${bgColor} ${textColor} ${
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-mono">
        <span>{icon}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  )
}
