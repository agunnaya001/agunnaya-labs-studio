import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { Editor } from '../components/Editor'
import { Diagnostics } from '../components/Diagnostics'
import { AgentGrid } from '../components/AgentGrid'
import { DeployPane } from '../components/DeployPane'
import { ChatMessages } from '../components/ChatMessages'
import { QuickPrompts } from '../components/QuickPrompts'
import { ToastNotification, Toast } from '../components/ToastNotification'
import { ContractPreview } from '../components/ContractPreview'
import { Logo } from '../components/Logo'
import { defaultSolidityCode, extractContractName } from '../lib/solidity'
import { getAgent } from '../lib/agents'
import { requestAccount, getCurrentChain, switchChain, getConnectedAccount } from '../lib/wallet'

interface Diagnostic {
  message: string
  severity: 'error' | 'warning' | 'info'
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

interface Deployment {
  chainId: number
  address: string
  txHash: string
  timestamp: string
}

export default function IdePage() {
  const [code, setCode] = useState(defaultSolidityCode)
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [isCompiling, setIsCompiling] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState('architect')
  const [compiledAbi, setCompiledAbi] = useState<unknown[]>([])

  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployments, setDeployments] = useState<Deployment[]>([])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)

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
    const initWallet = async () => {
      const account = await getConnectedAccount()
      if (account) {
        setWalletAddress(account)
        const chain = await getCurrentChain()
        if (chain) setChainId(chain)
      }
    }
    initWallet()
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsCompiling(true)
      try {
        const response = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
        const result = await response.json()
        setDiagnostics([...(result.errors || []), ...(result.warnings || [])])
        if (result.abi) {
          setCompiledAbi(result.abi)
        }
      } catch (error) {
        setDiagnostics([{ message: 'Failed to compile contract', severity: 'error' }])
      } finally {
        setIsCompiling(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [code])

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      const account = await requestAccount()
      if (account) {
        setWalletAddress(account)
        const chain = await getCurrentChain()
        if (chain) {
          setChainId(chain)
          addToast('Wallet connected successfully', 'success')
        }
      } else {
        addToast('Wallet connection cancelled', 'warning')
      }
    } catch (error) {
      addToast('Failed to connect wallet', 'error')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleChainSwitch = async (newChainId: number) => {
    try {
      await switchChain(newChainId)
      setChainId(newChainId)
    } catch (error) {
      console.error('Chain switch error:', error)
    }
  }

  const handleDeploy = async (newChainId: number, contractName: string) => {
    if (diagnostics.some((d) => d.severity === 'error')) {
      addToast('Fix compilation errors before deploying', 'error')
      return
    }

    setIsDeploying(true)
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, contractName, chainId: newChainId }),
      })
      const result = await response.json()
      if (!response.ok) {
        addToast(result.message ?? result.error ?? 'Deployment failed', 'error')
      } else if (result.status === 'error') {
        addToast(result.message, 'error')
      } else if (result.txHash) {
        setDeployments([
          ...deployments,
          {
            chainId: newChainId,
            address: result.address || '0x...',
            txHash: result.txHash,
            timestamp: new Date().toISOString(),
          },
        ])
        addToast(`Deployment initiated on network ${newChainId}`, 'success')
      }
    } catch (error) {
      addToast('Deployment failed', 'error')
    } finally {
      setIsDeploying(false)
    }
  }

  const handleSendChat = async (inputOverride?: string) => {
    const inputToSend = inputOverride || chatInput
    if (!inputToSend.trim()) return

    const userMessage: ChatMessage = { role: 'user', content: inputToSend }
    setChatMessages([...chatMessages, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgentId,
          messages: [...chatMessages, userMessage],
          contractCode: code,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({})) as { message?: string; error?: string }
        const msg = errData.message ?? errData.error ?? 'Chat failed'
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ ${msg}` },
        ])
        setIsChatLoading(false)
        return
      }
      if (!response.body) throw new Error('Chat failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      const assistantMessage: ChatMessage = { role: 'assistant', content: '', isStreaming: true }
      setChatMessages((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.done) continue
              if (data.text) {
                fullResponse += data.text
                setChatMessages((prev) => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg && lastMsg.role === 'assistant') {
                    lastMsg.content = fullResponse
                  }
                  return updated
                })
              }
            } catch {
              // ignore
            }
          }
        }
      }

      setChatMessages((prev) => {
        const updated = [...prev]
        const lastMsg = updated[updated.length - 1]
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.isStreaming = false
        }
        return updated
      })
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Failed to get response from agent' },
      ])
    } finally {
      setIsChatLoading(false)
    }
  }

  const contractName = extractContractName(code)

  return (
    <div className="flex h-screen w-screen flex-col bg-[var(--bg)] text-[var(--text-primary)]">
      <header className="flex items-center gap-4 border-b border-[var(--border-subtle)] px-4 py-3 bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-3 flex-1">
          <Link href="/">
            <Logo size="sm" animated={true} />
          </Link>
          <div>
            <div className="font-display text-xl font-bold text-[var(--green)] tracking-wider">
              AGUNNAYA
            </div>
            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider">
              AI Studio
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-dim)] font-mono">{contractName}</span>
          <div className="w-2 h-2 bg-[var(--green)] rounded-full" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden gap-3 p-3">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <Editor value={code} onChange={setCode} />
          </div>
          <div className="h-32 min-h-0">
            <Diagnostics items={diagnostics} isCompiling={isCompiling} />
          </div>
        </div>

        <div className="w-80 flex flex-col gap-3">
          <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)] overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider">
                Chat
              </span>
            </div>
            <ChatMessages messages={chatMessages} isLoading={isChatLoading} />
            <div className="flex gap-2 p-2 border-t border-[var(--border-subtle)]">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendChat()
                  }
                }}
                placeholder="Ask agent..."
                className="flex-1 px-2 py-1 bg-[var(--bg)] text-[var(--text-primary)] text-xs font-mono rounded border border-[var(--border-subtle)] focus:border-[var(--green)] focus:outline-none"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={isChatLoading || !chatInput.trim()}
                className="px-2 py-1 bg-[var(--green)] text-[var(--bg)] text-xs font-bold rounded hover:bg-[var(--green-bright)] disabled:opacity-50 transition-all"
              >
                Send
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)] p-2">
            <div className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">
              Quick Prompts
            </div>
            <QuickPrompts
              agentId={selectedAgentId}
              onSelect={(prompt) => handleSendChat(prompt)}
            />
          </div>
        </div>

        <div className="w-72 flex flex-col gap-3">
          <div className="h-64 flex flex-col min-h-0 bg-[var(--bg-secondary)] rounded border border-[var(--border-subtle)] overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-wider">
                AI Agents
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AgentGrid selectedId={selectedAgentId} onSelect={setSelectedAgentId} />
            </div>
          </div>

          <div className="h-48 min-h-0">
            <ContractPreview abi={compiledAbi} />
          </div>

          <div className="h-72 min-h-0">
            <DeployPane
              isConnected={!!walletAddress}
              address={walletAddress}
              chainId={chainId}
              onConnect={handleConnectWallet}
              onChainSwitch={handleChainSwitch}
              onDeploy={handleDeploy}
              isDeploying={isDeploying}
              deployments={deployments}
            />
          </div>
        </div>
      </div>

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
