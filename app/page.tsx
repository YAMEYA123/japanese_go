'use client'
import React from 'react'
import Link from 'next/link'
import { useAppStore, getTodayWordOfDay } from '@/lib/store'
import { DRAMAS } from '@/lib/data/dramas'
import { getTodayQuote } from '@/lib/data/quotes'
import SceneIllustration from '@/components/SceneIllustration'
import { toRomaji } from '@/lib/romaji'
import { Flame, BookOpen, Clock, Zap, Target, Volume2, Film } from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 5) return { jp: 'おやすみなさい', zh: '晚安' }
  if (h < 12) return { jp: 'おはようございます', zh: '早上好' }
  if (h < 18) return { jp: 'こんにちは', zh: '下午好' }
  return { jp: 'こんばんは', zh: '晚上好' }
}

export default function HomePage() {
  const { streakDays, srsCards, selectedDramaIds, getDueCount, showRomaji } = useAppStore()
  const greeting = getGreeting()
  const wordOfDay = getTodayWordOfDay()
  const quoteOfDay = getTodayQuote()
  const dueCount = getDueCount()
  const totalLearned = Object.values(srsCards).filter(c => c.repetitions > 0).length
  const myDramas = DRAMAS.filter(d => selectedDramaIds.includes(d.id))

  return (
    <div className="px-4 pt-8 pb-4 space-y-5">
      {/* Greeting */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
            {greeting.jp}
          </h1>
          <p className="text-stone-400 text-sm mt-0.5">{greeting.zh} · 今日も頑張ろう</p>
        </div>
        {dueCount > 0 && (
          <Link href="/practice?mode=10min" className="shrink-0 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm active:bg-red-600 transition-colors">
            {dueCount} 词待复习
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard Icon={Flame} iconColor="text-orange-500" iconBg="bg-orange-100" value={streakDays} label="连续天数" color="from-orange-50 to-amber-50" />
        <StatCard Icon={BookOpen} iconColor="text-blue-500" iconBg="bg-blue-100" value={totalLearned} label="已学词数" color="from-blue-50 to-sky-50" />
        <StatCard Icon={Clock} iconColor={dueCount > 0 ? 'text-red-500' : 'text-emerald-500'} iconBg={dueCount > 0 ? 'bg-red-100' : 'bg-emerald-100'} value={dueCount} label="待复习" color={dueCount > 0 ? 'from-red-50 to-rose-50' : 'from-emerald-50 to-teal-50'} highlight={dueCount > 0} />
      </div>

      {/* Quick practice — 2+1 grid layout */}
      <div>
        <h2 className="text-xs font-semibold text-stone-400 tracking-widest mb-2.5">碎片练习</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[
            { mode: '1min', label: '1分钟', sub: '一词闪记', Icon: Zap, bg: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', href: '/practice?mode=1min' },
            { mode: '5min', label: '5分钟', sub: '翻卡复习', Icon: BookOpen, bg: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', href: '/practice?mode=5min' },
          ].map(m => (
            <Link key={m.mode} href={m.href} className={`${m.bg} border rounded-2xl px-3.5 py-3.5 flex flex-col gap-2 active:scale-[0.97] transition-transform duration-150`}>
              <div className={`w-9 h-9 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                <m.Icon size={16} className={m.iconColor} />
              </div>
              <div>
                <div className="font-bold text-stone-800 text-sm">{m.label}</div>
                <div className="text-xs text-stone-400">{m.sub}</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/practice?mode=10min" className="bg-white border border-stone-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform duration-150">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <Target size={16} className="text-violet-600" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-stone-800 text-sm">10分钟系统复习</div>
            <div className="text-xs text-stone-400">词源卡片 · 全面巩固</div>
          </div>
          <span className="text-stone-300 text-sm">→</span>
        </Link>
      </div>

      {/* Word of the day */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-stone-50">
          <span className="text-xs font-semibold text-stone-400 tracking-widest">今日一词</span>
          <Link href={`/word/${wordOfDay.id}`} className="text-xs text-red-600 font-medium">
            详细解析 →
          </Link>
        </div>
        {wordOfDay.drama_id && (
          <div className="px-3 pt-3">
            <SceneIllustration word={wordOfDay} />
          </div>
        )}
        <div className="px-4 py-3">
          <div className="flex items-baseline gap-2 mb-1" translate="no">
            <span className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
              {wordOfDay.reading}
            </span>
            <span className="text-stone-400 text-sm">{wordOfDay.japanese}</span>
            {showRomaji && <span className="text-stone-300 text-xs">{toRomaji(wordOfDay.reading)}</span>}
          </div>
          <p className="text-stone-700 font-medium">{wordOfDay.meaning_zh}</p>
          {wordOfDay.scene_context && (
            <p className="text-stone-400 text-xs mt-2 leading-relaxed line-clamp-2">{wordOfDay.scene_context}</p>
          )}
        </div>
      </div>

      {/* Quote of the day */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">今日一句</span>
          <button
            onClick={() => {
              if (typeof window === 'undefined' || !window.speechSynthesis) return
              window.speechSynthesis.cancel()
              const u = new SpeechSynthesisUtterance(quoteOfDay.japanese)
              u.lang = 'ja-JP'; u.rate = 0.82
              window.speechSynthesis.speak(u)
            }}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/50 active:text-white/90 transition-colors"
            aria-label="朗读"
          ><Volume2 size={16} /></button>
        </div>
        <div className="relative px-4 py-4">
          <span className="absolute top-0 left-3 text-6xl text-white/8 font-serif leading-none select-none">"</span>
          <p
            className="text-white text-base font-medium leading-relaxed"
            style={{ fontFamily: 'Noto Serif JP, serif' }}
            translate="no"
          >
            {quoteOfDay.japanese}
          </p>
          <p className="text-stone-400 text-xs mt-1.5 leading-relaxed" translate="no">
            {quoteOfDay.reading}
          </p>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed">
            {quoteOfDay.meaning_zh}
          </p>
          <p className="text-stone-500 text-xs mt-2.5">
            — {quoteOfDay.author_zh}
            {quoteOfDay.author !== quoteOfDay.author_zh && (
              <span translate="no"> / {quoteOfDay.author}</span>
            )}
          </p>
        </div>
      </div>

      {/* My dramas */}
      {myDramas.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide">我在追的剧</h2>
            <Link href="/dramas" className="text-xs text-red-600">管理</Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4">
            {myDramas.map(d => (
              <Link
                key={d.id}
                href={`/dramas/${d.id}`}
                className="shrink-0 bg-white rounded-xl px-3.5 py-3 shadow-sm border border-stone-100 min-w-[130px] active:scale-95 transition-transform"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center"
                  style={{ background: d.cover_color }}
                >
                  <Film size={18} className="text-white" />
                </div>
                <p className="text-stone-800 text-sm font-medium line-clamp-1">{d.title_zh}</p>
                <p className="text-stone-400 text-xs mt-0.5">{d.genre}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Link
          href="/dramas"
          className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 shadow-sm border border-dashed border-stone-200"
        >
          <Film size={24} className="text-stone-400" />
          <div>
            <p className="font-medium text-stone-700 text-sm">选择你喜欢的日剧</p>
            <p className="text-stone-400 text-xs mt-0.5">学剧中台词，更有代入感</p>
          </div>
          <span className="ml-auto text-stone-300 text-lg">→</span>
        </Link>
      )}
    </div>
  )
}

function StatCard({
  Icon, iconColor, iconBg, value, label, color, highlight,
}: {
  Icon: React.ElementType; iconColor: string; iconBg: string; value: number; label: string; color: string; highlight?: boolean
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-3 flex flex-col items-center`}>
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-1.5`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className={`text-3xl font-bold tabular-nums ${highlight ? 'text-red-600' : 'text-stone-800'}`}>{value}</div>
      <div className="text-xs text-stone-500 mt-0.5">{label}</div>
    </div>
  )
}
