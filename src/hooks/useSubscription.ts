import { useQuery } from '@tanstack/react-query'
import { getSubscriptionStatus, createCheckout } from '../api/client'

import type { SubscriptionStatus } from '../types'

const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID as string

export function useSubscription(userId: string) {
    const query = useQuery<SubscriptionStatus, Error>({
        queryKey: ['subscription', userId],
        queryFn: () => getSubscriptionStatus(userId),
        staleTime: 1000 * 60 * 5,
    })

    async function upgrade() {
        const { checkoutUrl } = await createCheckout({
            userId,
            priceId: STRIPE_PRICE_ID,
            successUrl: `${window.location.origin}/dashboard?upgraded=true`,
            cancelUrl: `${window.location.origin}/pricing`,
        })
        window.location.href = checkoutUrl
    }

    const isPro = query.data?.isActive && query.data?.plan === 'pro'

    return { ...query, upgrade, isPro: !!isPro }
}