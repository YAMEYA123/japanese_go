'use client'
import Link from 'next/link'
import { DRAMAS } from '@/lib/data/dramas'
import { useAppStore } from '@/lib/store'
import { getWordsByDrama } from '@/lib/data/words'
import { Film, BookOpen } from 'lucide-react'

export function DramaCard({ drama, selected, onToggle }: {
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
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: drama.cover_color }}
        >
          {isBook ? <BookOpen size={22} className="text-white" /> : <Film size={22} className="text-white" />}
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
