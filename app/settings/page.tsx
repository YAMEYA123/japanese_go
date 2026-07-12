'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase'

export default function SettingsPage() {
  const { userEmail, setUser, srsCards, streakDays, totalReviewed, selectedDramaIds, showRomaji, setShowRomaji } = useAppStore()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  async function handleLogin() {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
      setSent(true)
    } catch {
      alert('发送失败，请检查邮箱地址')
    }
  }

  async function handleSync() {
    if (!userEmail) { setSyncMsg('请先登录'); return }
    setSyncing(true)
    setSyncMsg('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setSyncMsg('登录已过期，请重新登录'); return }

      await supabase.from('user_progress').upsert({
        user_id: user.id,
        srs_cards: srsCards,
        streak_days: streakDays,
        total_reviewed: totalReviewed,
        selected_drama_ids: selectedDramaIds,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

      setSyncMsg('✓ 同步成功')
    } catch {
      setSyncMsg('同步失败，请稍后重试')
    } finally {
      setSyncing(false)
    }
  }

  const learnedCount = Object.values(srsCards).filter(c => c.repetitions > 0).length

  return (
    <div className="px-4 pt-8 space-y-5">
      <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
        設定
      </h1>

      {/* Display settings */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">显示设置</h2>
        <div className="flex items-center justify-between py-1.5">
          <div>
            <p className="text-stone-700 text-sm font-medium">显示罗马音</p>
            <p className="text-stone-400 text-xs mt-0.5">在假名旁边显示拼音式罗马字</p>
          </div>
          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className={`relative w-11 h-6 rounded-full transition-colors ${showRomaji ? 'bg-red-500' : 'bg-stone-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showRomaji ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-2">
        <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">学习统计</h2>
        {[
          { label: '已学词数', value: learnedCount },
          { label: '累计复习', value: totalReviewed },
          { label: '连续天数', value: `${streakDays} 天` },
        ].map(s => (
          <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-stone-50 last:border-0">
            <span className="text-stone-600 text-sm">{s.label}</span>
            <span className="font-semibold text-stone-900">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">账户 & 同步</h2>
        {userEmail ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm">
                {userEmail[0].toUpperCase()}
              </span>
              <div>
                <p className="text-stone-800 text-sm font-medium">{userEmail}</p>
                <p className="text-stone-400 text-xs">已登录</p>
              </div>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full bg-red-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
            >
              {syncing ? '同步中…' : '立即同步进度'}
            </button>
            {syncMsg && <p className="text-center text-sm text-stone-500">{syncMsg}</p>}
            <button
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                setUser(null, null)
              }}
              className="w-full bg-stone-100 text-stone-600 rounded-xl py-2.5 text-sm"
            >
              退出登录
            </button>
          </div>
        ) : sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📬</div>
            <p className="font-medium text-stone-800">登录链接已发送</p>
            <p className="text-stone-500 text-sm mt-1">请查收邮件并点击链接登录</p>
            <p className="text-stone-400 text-xs mt-2">登录后可在 iPhone 和 iPad 间同步学习进度</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-stone-500 text-sm leading-relaxed">
              登录后可在 iPhone 和 iPad 间同步学习进度，无需密码，发送魔法链接到邮箱即可。
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="输入你的邮箱地址"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-stone-50"
            />
            <button
              onClick={handleLogin}
              disabled={!email.includes('@')}
              className="w-full bg-red-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40"
            >
              发送登录链接
            </button>
          </div>
        )}
      </div>

      {/* Deploy guide */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <h2 className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-2">📱 添加到主屏幕</h2>
        <ol className="space-y-1.5 text-sm text-amber-800">
          <li>1. 在 Safari 中打开本网页</li>
          <li>2. 点击底部「分享」按钮 □↑</li>
          <li>3. 选择「添加到主屏幕」</li>
          <li>4. 即可像 App 一样使用</li>
        </ol>
      </div>
    </div>
  )
}
