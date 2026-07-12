'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, syncFromServer } = useAppStore()

  useEffect(() => {
    useAppStore.getState().hydrate()

    const supabase = createClient()

    async function loadProgress(userId: string) {
      const { data } = await supabase
        .from('user_progress')
        .select('srs_cards, streak_days, total_reviewed, selected_drama_ids')
        .eq('user_id', userId)
        .single()
      if (data) {
        syncFromServer({
          srsCards: data.srs_cards ?? {},
          streakDays: data.streak_days ?? 0,
          totalReviewed: data.total_reviewed ?? 0,
          selectedDramaIds: data.selected_drama_ids ?? [],
        })
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user.id, session.user.email ?? null)
        loadProgress(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user.id, session.user.email ?? null)
        if (event === 'SIGNED_IN') loadProgress(session.user.id)
      } else {
        setUser(null, null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, syncFromServer])

  return <>{children}</>
}
