import { useState } from 'react'

const KEY = 'pccclarity_user_id'

function generateId(): string {
    return 'user_' + Math.random().toString(36).slice(2, 11)
}

export function useUser() {
    const [userId] = useState<string>(() => {
        const stored = localStorage.getItem(KEY)
        if (stored) return stored
        const id = generateId()
        localStorage.setItem(KEY, id)
        return id
    })

    return { userId }
}