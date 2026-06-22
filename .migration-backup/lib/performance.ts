/**
 * Performance optimization utilities
 */

// Debounce function for optimizing frequent function calls
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Throttle function for limiting function execution frequency
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Memoize function for caching function results
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)

    return result
  }) as T
}

// Request idle callback polyfill
export const requestIdleCallbackPolyfill =
  typeof window !== 'undefined' && window.requestIdleCallback
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) => setTimeout(cb, 1)

// Performance mark for monitoring
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && window.performance?.mark) {
    window.performance.mark(`${name}-start`)
  }
}

export function measurePerformance(name: string): number {
  if (typeof window !== 'undefined' && window.performance?.measure) {
    try {
      window.performance.measure(name, `${name}-start`)
      const measure = window.performance.getEntriesByName(name)[0]
      return measure?.duration || 0
    } catch {
      return 0
    }
  }
  return 0
}

// Lazy load observer for images and components
export function lazyLoadObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(callback, {
    threshold: 0.1,
    ...options,
  })
}

// Preload image
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// Batch DOM updates
export function batchDOMUpdates(updates: () => void) {
  requestIdleCallbackPolyfill((deadline) => {
    while (deadline.timeRemaining() > 0 && updates) {
      updates()
      break
    }
  })
}
