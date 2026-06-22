'use client'

import { useEffect, useRef } from 'react'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading?: boolean
}

export function ChatMessages({ messages, isLoading = false }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto space-y-3 p-3"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full text-[var(--text-dim)] text-sm">
          Start chatting with an agent
        </div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs px-3 py-2 rounded text-xs font-mono leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[var(--green)] text-[var(--bg)]'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            {msg.content}
            {msg.isStreaming && <span className="inline-block ml-1 animate-pulse">▌</span>}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-2">
          <div className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-2 rounded border border-[var(--border-subtle)]">
            <div className="flex gap-1">
              <span className="inline-block w-2 h-2 bg-[var(--green)] rounded-full animate-bounce" />
              <span className="inline-block w-2 h-2 bg-[var(--green)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="inline-block w-2 h-2 bg-[var(--green)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
