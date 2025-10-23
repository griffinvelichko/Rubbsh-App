'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function UserInfo() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-3 rounded-lg max-w-xs">
      <div className="font-mono space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-green-400">●</span>
          <span className="font-semibold">
            {user.is_anonymous ? 'Anonymous User' : 'Permanent User'}
          </span>
        </div>
        <div className="text-gray-400">
          ID: {user.id.slice(0, 8)}...
        </div>
        <div className="text-gray-400 text-[10px]">
          💡 This ID persists across sessions
        </div>
      </div>
    </div>
  )
}
