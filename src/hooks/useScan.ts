import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { scanPc, isRateLimitError } from '../api/client'
import type { PcHealthReport, RateLimitError } from '../types'

export function useScan(userId: string) {
    const queryClient = useQueryClient()
    const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitError | null>(null)

    const query = useQuery<PcHealthReport, Error>({
        queryKey: ['scan', userId],
        queryFn: () => scanPc(userId),
        enabled: false,        // only run on demand
        retry: false,
        staleTime: 1000 * 60,  // treat result as fresh for 1 min
    })

    async function runScan() {
        setRateLimitInfo(null)
        try {
            await queryClient.fetchQuery({
                queryKey: ['scan', userId],
                queryFn: () => scanPc(userId),
                staleTime: 0,
            })
        } catch (err) {
            if (isRateLimitError(err)) {
                setRateLimitInfo(err.body as RateLimitError)
            }
        }
    }

    return { ...query, runScan, rateLimitInfo }
}