'use client'
import Link from 'next/link'
import { DRAMAS } from '@/lib/data/dramas'
import { useAppStore } from '@/lib/store'
import { getWordsByDrama } from '@/lib/data/words'

function DramaCard({ drama, selected, onToggle }: {
  drama: typeof DRAMAS[0]
  selected: boolean
  onToggle: () => void
}) {
  const srsCards = useAppStore(s => s.srsCards)
  const words = getWordsByDrama(drama.id)
  const learned = words.filter(w => srsCards[w.id]?.repetitions > 0).length
  const pct = words.length > 0 ? Math.round((learned / words.length) * 100) : 0
  const isBook = drama.category === 'book'

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${selected ? 'border-red-200' : 'border-stone-100'}`}>
      <div className="flex items-start p-4 gap-3">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl"
          style={{ background: drama.cover_color }}
        >
          {isBook ? '📖' : '🎬'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }} translate="no">
                {drama.title_jp}
              </p>
              <p className="text-stone-500 text-xs">
                {drama.title_zh} · {drama.year}
                {isBook && drama.author && ` · ${drama.author}`}
              </p>
            </div>
            <button
              onClick={onToggle}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                selected ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {selected ? '✓ 学习中' : '+ 加入'}
            </button>
          </div>
          <p className="text-stone-500 text-xs mt-1.5 leading-relaxed line-clamp-2">{drama.description}</p>
          <div className="mt-2.5">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>{drama.genre}</span>
              <span>{learned}/{words.length} 词</span>
            </div>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
      {words.length > 0 && (
        <Link href={`/dramas/${drama.id}`} className="flex items-center justify-between px-4 py-2.5 border-t border-stone-50 text-xs text-red-600 font-medium">
          <span>浏览 {words.length} 个词条</span>
          <span>→</span>
        </Link>
      )}
    </div>
  )
}

export default function DramasPage() {
  const { selectedDramaIds, selectDrama, deselectDrama } = useAppStore()

  const dramas = DRAMAS.filter(d => !d.category || d.category === 'drama')
  const books = DRAMAS.filter(d => d.category === 'book')
  const travel = DRAMAS.filter(d => d.category === 'travel')

  function toggle(id: string) {
    selectedDramaIds.includes(id) ? deselectDrama(id) : selectDrama(id)
  }

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
          词库
        </h1>
        <p className="text-stone-500 text-sm mt-1">选择内容，优先学习相关词汇</p>
      </div>

      {/* 文豪阅读入口 */}
      <Link
        href="/reading"
        className="flex items-center gap-3 bg-gradient-to-r from-stone-800 to-stone-700 rounded-2xl px-4 py-3.5 mb-6 active:scale-98 transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
          📜
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">文豪短篇阅读</p>
          <p className="text-white/60 text-xs mt-0.5">川端康成・芥川龍之介・三島由紀夫・太宰治</p>
        </div>
        <span className="text-white/40 text-sm">→</span>
      </Link>

      <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">🎬 日剧</h2>
      <div className="space-y-3 mb-6">
        {dramas.map(d => (
          <DramaCard key={d.id} drama={d} selected={selectedDramaIds.includes(d.id)} onToggle={() => toggle(d.id)} />
        ))}
      </div>

      <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">📖 文学作品</h2>
      <div className="space-y-3 mb-6">
        {books.map(d => (
          <DramaCard key={d.id} drama={d} selected={selectedDramaIds.includes(d.id)} onToggle={() => toggle(d.id)} />
        ))}
      </div>

      <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">🗺️ 旅游场景</h2>
      <div className="space-y-3">
        {travel.map(d => (
          <DramaCard key={d.id} drama={d} selected={selectedDramaIds.includes(d.id)} onToggle={() => toggle(d.id)} />
        ))}
      </div>
    </div>
  )
}
