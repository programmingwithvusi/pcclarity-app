// ── PC Health ────────────────────────────────────────────────

export interface DiskMetrics {
    totalBytes: number
    freeBytes: number
    junkBytes: number
    usedPercent: number
}

export interface RamMetrics {
    totalBytes: number
    availableBytes: number
    usedPercent: number
}

export interface StartupMetrics {
    count: number
    programs: string[]
}

export type IssueSeverity = 'critical' | 'warning' | 'info'

export interface HealthIssue {
    id: string
    severity: IssueSeverity
    title: string
    detail: string
}

export interface PcHealthReport {
    healthScore: number
    scoreLabel: 'Good' | 'Fair' | 'Poor'
    disk: DiskMetrics
    ram: RamMetrics
    startup: StartupMetrics
    issues: HealthIssue[]
    scannedAt: string
}

// ── Subscription ─────────────────────────────────────────────

export type Plan = 'free' | 'pro'

export interface SubscriptionStatus {
    userId: string
    isActive: boolean
    plan: Plan
    expiresAt?: string
}

export interface CreateCheckoutRequest {
    userId: string
    priceId: string
    successUrl: string
    cancelUrl: string
}

export interface CreateCheckoutResponse {
    sessionId: string
    checkoutUrl: string
}

// ── Rate limit error shape ────────────────────────────────────

export interface RateLimitError {
    error: string
    retryAfterMinutes: number
    upgradeUrl: string
}