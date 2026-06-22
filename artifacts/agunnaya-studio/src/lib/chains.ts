export interface Chain {
  id: number
  name: string
  shortName: string
  rpc: string
  explorer: string
  blockTime: number
  native: string
}

export const chains: Record<number, Chain> = {
  8453: {
    id: 8453,
    name: 'Base Mainnet',
    shortName: 'base',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    blockTime: 2,
    native: 'ETH',
  },
  84532: {
    id: 84532,
    name: 'Base Sepolia',
    shortName: 'base-sep',
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    blockTime: 2,
    native: 'ETH',
  },
  1: {
    id: 1,
    name: 'Ethereum Mainnet',
    shortName: 'eth',
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    blockTime: 12,
    native: 'ETH',
  },
  11155111: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    shortName: 'eth-sep',
    rpc: 'https://eth-sepolia.public.blastapi.io',
    explorer: 'https://sepolia.etherscan.io',
    blockTime: 12,
    native: 'ETH',
  },
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'arb',
    rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    blockTime: 0.3,
    native: 'ETH',
  },
  421614: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    shortName: 'arb-sep',
    rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: 'https://sepolia.arbiscan.io',
    blockTime: 0.3,
    native: 'ETH',
  },
  10: {
    id: 10,
    name: 'Optimism Mainnet',
    shortName: 'op',
    rpc: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    blockTime: 2,
    native: 'ETH',
  },
  11155420: {
    id: 11155420,
    name: 'Optimism Sepolia',
    shortName: 'op-sep',
    rpc: 'https://sepolia.optimism.io',
    explorer: 'https://sepolia-optimistic.etherscan.io',
    blockTime: 2,
    native: 'ETH',
  },
  137: {
    id: 137,
    name: 'Polygon Mainnet',
    shortName: 'poly',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    blockTime: 2,
    native: 'MATIC',
  },
  80002: {
    id: 80002,
    name: 'Polygon Amoy',
    shortName: 'poly-amoy',
    rpc: 'https://rpc-amoy.polygon.technology',
    explorer: 'https://amoy.polygonscan.com',
    blockTime: 2,
    native: 'MATIC',
  },
}

export function getChain(chainId: number): Chain | undefined {
  return chains[chainId]
}

export function getChainName(chainId: number): string {
  return getChain(chainId)?.name || `Chain ${chainId}`
}

export const supportedChains = Object.values(chains)
export const testnetChains = supportedChains.filter((c) => c.shortName.includes('sep') || c.shortName.includes('amoy'))
export const mainnetChains = supportedChains.filter((c) => !c.shortName.includes('sep') && !c.shortName.includes('amoy'))
