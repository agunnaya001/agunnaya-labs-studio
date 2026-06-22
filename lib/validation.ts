/**
 * Form validation utilities
 */

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export const validators = {
  email: (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Invalid email address'
    return null
  },

  password: (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain number'
    return null
  },

  projectName: (name: string): string | null => {
    if (!name) return 'Project name is required'
    if (name.length < 3) return 'Name must be at least 3 characters'
    if (name.length > 100) return 'Name must be less than 100 characters'
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) return 'Name can only contain letters, numbers, underscores, and dashes'
    return null
  },

  contractName: (name: string): string | null => {
    if (!name) return 'Contract name is required'
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) return 'Invalid Solidity contract name'
    return null
  },

  solidityCode: (code: string): string | null => {
    if (!code) return 'Code is required'
    if (code.length < 50) return 'Contract code seems too short'
    if (!code.includes('contract')) return 'Code must contain a contract definition'
    return null
  },

  ethereumAddress: (address: string): string | null => {
    if (!address) return 'Address is required'
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return 'Invalid Ethereum address'
    return null
  },

  transactionHash: (hash: string): string | null => {
    if (!hash) return 'Transaction hash is required'
    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) return 'Invalid transaction hash'
    return null
  },

  chainId: (chainId: string | number): string | null => {
    const id = typeof chainId === 'string' ? parseInt(chainId) : chainId
    const validChains = [1, 8453, 42161, 10, 137] // Ethereum, Base, Arbitrum, Optimism, Polygon
    if (!validChains.includes(id)) return `Invalid chain ID. Valid: ${validChains.join(', ')}`
    return null
  },

  url: (url: string): string | null => {
    try {
      new URL(url)
      return null
    } catch {
      return 'Invalid URL'
    }
  },
}

export function validateForm(
  data: Record<string, any>,
  schema: Record<string, (value: any) => string | null>
): ValidationResult {
  const errors: Record<string, string> = {}

  for (const [key, validator] of Object.entries(schema)) {
    const error = validator(data[key])
    if (error) {
      errors[key] = error
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateSignUp(data: {
  email: string
  password: string
  name?: string
}): ValidationResult {
  return validateForm(data, {
    email: validators.email,
    password: validators.password,
  })
}

export function validateProjectCreation(data: {
  name: string
  code: string
}): ValidationResult {
  return validateForm(data, {
    name: validators.projectName,
    code: validators.solidityCode,
  })
}

export function validateContractDeployment(data: {
  chainId: number
  address?: string
}): ValidationResult {
  return validateForm(data, {
    chainId: validators.chainId,
  })
}
