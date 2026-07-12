'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DRAMAS } from '@/lib/data/dramas'
import { getWordsByDrama } from '@/lib/data/words'
import { useAppStore } from '@/lib/store'
import { getSRSLabel } from '@/lib/srs'

export default function DramaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const drama = DRAMAS.find(d => d.id === id)
  const words = getWordsByDrama(id)
  const srsCards = useAppStore(s => s.srsCards)

  if (!drama) return <div className="px-4 pt-8 text-stone-500">未找到剧集</div>

  const ORIGIN_COLORS: Record<string, string> = {
    yamato: 'bg-emerald-100 text-emerald-700',
    kango: 'bg-red-100 text-red-700',
    gairaigo: 'bg-blue-100 text-blue-700',
    mixed: 'bg-purple-100 text-purple-700',
  }
  const ORIGIN_NAMES: Record<string, string> = {
    yamato: '大和語',
    kango: '漢語',
    gairaigo: '外来語',
    mixed: '混合',
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="relative h-40 flex items-end p-5" style={{ background: drama.cover_color }}>
        <Link href="/dramas" className="absolute top-4 left-4 text-white/80 text-sm">
          ← 返回
        </Link>
        <div>
          <p className="text-white/70 text-sm">{drama.title_zh}</p>
          <h1 className="text-white text-2xl font-bold mt-0.5" style={{ fontFamily: 'Noto Serif JP, serif' }}>
            {drama.title_jp}
          </h1>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white px-4 py-3 border-b border-stone-100">
        <p className="text-stone-600 text-sm leading-relaxed">{drama.description}</p>
      </div>

      {/* Word list */}
      <div className="px-4 pt-4 space-y-2.5">
        <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
          剧集词条 ({words.length})
        </h2>
        {words.map(word => {
          const status = getSRSLabel(srsCards[word.id])
          return (
            <Link
              key={word.id}
              href={`/word/${word.id}`}
              className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-stone-100 flex items-center gap-3 active:scale-98 transition-transform block"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
                    {word.japanese}
                  </span>
                  <span className="text-stone-400 text-sm">{word.reading}</span>
                </div>
                <p className="text-stone-600 text-sm mt-0.5 truncate">{word.meaning_zh}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ORIGIN_COLORS[word.etymology.origin_type]}`}>
                  {ORIGIN_NAMES[word.etymology.origin_type]}
                </span>
                <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
              </div>
            </Link>
          )
        })}
        {words.length === 0 && (
          <p className="text-stone-400 text-sm text-center py-8">该剧暂无词条</p>
        )}
      </div>
    </div>
  )
}
