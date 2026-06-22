export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
}

export async function requestAccount(): Promise<string | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('[v0] MetaMask not installed')
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    return accounts?.[0] || null
  } catch (error) {
    console.error('[v0] Error requesting account:', error)
    return null
  }
}

export async function getConnectedAccount(): Promise<string | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null
  }

  try {
    const accounts = (await window.ethereum.request({
      method: 'eth_accounts',
    })) as string[]
    return accounts?.[0] || null
  } catch (error) {
    console.error('[v0] Error getting account:', error)
    return null
  }
}

export async function switchChain(chainId: number): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
    return true
  } catch (error: unknown) {
    const err = error as { code?: number }
    if (err.code === 4902) {
      console.warn('[v0] Chain not added to wallet')
      return false
    }
    console.error('[v0] Error switching chain:', error)
    return false
  }
}

export async function getCurrentChain(): Promise<number | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null
  }

  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    })
    return chainId ? parseInt(chainId as string, 16) : null
  } catch (error) {
    console.error('[v0] Error getting chain:', error)
    return null
  }
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function formatAddress(address: string): string {
  if (!isValidAddress(address)) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}
