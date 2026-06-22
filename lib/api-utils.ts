export interface ApiResponse<T> {
  data?: T
  error?: string
  status: 'success' | 'error'
  code?: number
}

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.message || `API error: ${response.statusText}`,
        errorData
      )
    }

    const data = await response.json()
    return {
      data,
      status: 'success',
      code: response.status,
    }
  } catch (error) {
    const message = error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Unknown error occurred'

    const code = error instanceof ApiError ? error.code : 500

    console.error('[v0] API error:', {
      endpoint,
      code,
      message,
      details: error instanceof ApiError ? error.details : null,
    })

    return {
      error: message,
      status: 'error',
      code,
    }
  }
}

export function handleCompilationError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Compilation failed. Please check your code and try again.'
}

export function handleDeploymentError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for deployment. Please check your wallet balance.'
    }
    if (error.message.includes('user rejected')) {
      return 'Transaction rejected by user'
    }
    return error.message
  }
  return 'Deployment failed. Please try again.'
}

export function handleChatError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      return 'Chat request timed out. Please try again.'
    }
    return error.message
  }
  return 'Failed to get response from AI agent'
}
