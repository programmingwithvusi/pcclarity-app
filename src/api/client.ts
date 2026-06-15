import type {
    PcHealthReport,
    SubscriptionStatus,
    CreateCheckoutRequest,
    CreateCheckoutResponse,
    RateLimitError,
} from '../types'

const BASE = '/api'

// ── Generic fetch wrapper ─────────────────────────────────────

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })

    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const err = Object.assign(new Error(body.error ?? 'Request failed'), {
            status: res.status,
            body,
        })
        throw err
    }

    return res.json() as Promise<T>
}

// ── PC Health ─────────────────────────────────────────────────

export async function scanPc(userId: string): Promise<PcHealthReport> {
    return request<PcHealthReport>(`/pchealth/scan?userId=${encodeURIComponent(userId)}`)
}

export async function getPcStatus(userId: string): Promise<SubscriptionStatus> {
    return request<SubscriptionStatus>(`/pchealth/status?userId=${encodeURIComponent(userId)}`)
}

// ── Subscription ──────────────────────────────────────────────

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    return request<SubscriptionStatus>(`/subscription/status?userId=${encodeURIComponent(userId)}`)
}

export async function createCheckout(
    payload: CreateCheckoutRequest
): Promise<CreateCheckoutResponse> {
    return request<CreateCheckoutResponse>('/subscription/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

// ── Helpers ───────────────────────────────────────────────────

export function isRateLimitError(err: unknown): err is Error & { body: RateLimitError } {
    return (
        err instanceof Error &&
        'status' in err &&
        (err as Error & { status: number }).status === 429
    )
}

export function formatBytes(bytes: number): string {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`
    return `${(bytes / 1e3).toFixed(0)} KB`
}