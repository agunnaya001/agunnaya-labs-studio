/**
 * Analytics tracking utility for monitoring user interactions
 */

export interface AnalyticsEvent {
  name: string
  category?: string
  label?: string
  value?: number
  properties?: Record<string, any>
  timestamp: number
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private isEnabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize analytics only on client side
      this.initializeGA()
    }
  }

  private initializeGA() {
    if (typeof window === 'undefined') return

    // GA4 initialization placeholder
    console.log('[v0] Analytics initialized')
  }

  track(
    name: string,
    category?: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ) {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      name,
      category,
      label,
      value,
      properties,
      timestamp: Date.now(),
    }

    this.events.push(event)

    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: category,
        event_label: label,
        value: value,
        ...properties,
      })
    }

    console.log('[v0] Track event:', event)
  }

  trackPage(path: string, title?: string) {
    this.track('page_view', undefined, path, undefined, {
      page_title: title,
    })
  }

  trackFeature(featureName: string, action: string, data?: Record<string, any>) {
    this.track(`feature_${featureName}`, 'feature', action, undefined, data)
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', 'error', error.message, undefined, {
      stack: error.stack,
      ...context,
    })
  }

  trackPerformance(metric: string, value: number) {
    this.track('performance', 'performance', metric, value)
  }

  trackConversion(type: string, value?: number) {
    this.track('conversion', 'conversion', type, value)
  }

  getEvents() {
    return [...this.events]
  }

  clearEvents() {
    this.events = []
  }

  disable() {
    this.isEnabled = false
  }

  enable() {
    this.isEnabled = true
  }
}

export const analytics = typeof window !== 'undefined' ? new Analytics() : null

// Event tracking shortcuts
export const trackCompile = (success: boolean, time?: number) =>
  analytics?.track('compile', 'editor', success ? 'success' : 'error', time)

export const trackDeploy = (chain: string, success: boolean) =>
  analytics?.track('deploy', 'deployment', chain, success ? 1 : 0)

export const trackChat = (agentId: string, messageLength?: number) =>
  analytics?.track('chat_message', 'chat', agentId, messageLength)

export const trackWallet = (action: string, chain?: string) =>
  analytics?.track('wallet', 'wallet', action, undefined, { chain })

export const trackProjectCreation = (projectType: string) =>
  analytics?.track('project_created', 'projects', projectType)

export const trackFeatureUse = (featureName: string, duration?: number) =>
  analytics?.trackFeature(featureName, 'used', { duration_ms: duration })
