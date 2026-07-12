'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) { router.replace('/settings'); return }
    const supabase = createClient()
    supabase.auth.exchangeCodeForSession(code).finally(() => {
      router.replace('/settings')
    })
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-stone-500 text-sm">登录中…</p>
    </div>
  )
}
