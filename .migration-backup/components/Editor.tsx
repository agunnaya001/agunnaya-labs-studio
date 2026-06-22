'use client'

import { useEffect, useRef, useState } from 'react'

export interface EditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export function Editor({ value, onChange, readOnly = false }: EditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineNumbers, setLineNumbers] = useState<string>('')

  useEffect(() => {
    const textarea = editorRef.current
    if (!textarea) return

    textarea.value = value

    const updateLineNumbers = () => {
      const lines = textarea.value.split('\n').length
      setLineNumbers(
        Array.from({ length: lines }, (_, i) => (i + 1).toString()).join('\n')
      )
    }

    updateLineNumbers()

    const handleInput = () => {
      onChange(textarea.value)
      updateLineNumbers()
    }

    const handleScroll = () => {
      const lineNumbersEl = containerRef.current?.querySelector('[data-line-numbers]')
      if (lineNumbersEl) {
        lineNumbersEl.scrollTop = textarea.scrollTop
      }
    }

    textarea.addEventListener('input', handleInput)
    textarea.addEventListener('scroll', handleScroll)

    return () => {
      textarea.removeEventListener('input', handleInput)
      textarea.removeEventListener('scroll', handleScroll)
    }
  }, [value, onChange])

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full overflow-hidden bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)]"
    >
      {/* Line numbers */}
      <div
        data-line-numbers
        className="overflow-hidden bg-[var(--bg)] text-[var(--text-dim)] text-right pr-3 pt-3 pb-3 font-mono text-sm select-none border-r border-[var(--border-subtle)]"
        style={{
          minWidth: '3rem',
          lineHeight: '1.5',
          whiteSpace: 'pre',
        }}
      >
        {lineNumbers}
      </div>

      {/* Editor textarea */}
      <textarea
        ref={editorRef}
        readOnly={readOnly}
        placeholder="// Enter Solidity code here..."
        className="flex-1 p-3 bg-transparent text-[var(--text-primary)] font-mono text-sm resize-none focus:outline-none overflow-auto"
        style={{
          lineHeight: '1.5',
          tabSize: 2,
          caretColor: 'var(--green)',
        }}
        spellCheck="false"
      />
    </div>
  )
}
