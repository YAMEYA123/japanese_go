'use client'
import Link from 'next/link'
import { READINGS } from '@/lib/data/readings'

const DIFFICULTY_COLORS: Record<string, string> = {
  N3: 'bg-teal-100 text-teal-700',
  N2: 'bg-violet-100 text-violet-700',
  N1: 'bg-red-100 text-red-700',
}

const AUTHOR_COLORS: Record<string, string> = {
  '川端康成': 'bg-purple-100 text-purple-700',
  '芥川龍之介': 'bg-stone-100 text-stone-700',
  '三島由紀夫': 'bg-amber-100 text-amber-700',
  '太宰治': 'bg-rose-100 text-rose-700',
}

function groupByAuthor(readings: typeof READINGS) {
  const map = new Map<string, typeof READINGS>()
  for (const r of readings) {
    if (!map.has(r.author)) map.set(r.author, [])
    map.get(r.author)!.push(r)
  }
  return map
}

export default function ReadingPage() {
  const grouped = groupByAuthor(READINGS)

  return (
    <div className="pb-24">
      <div className="bg-white border-b border-stone-100 px-4 pt-10 pb-4">
        <Link href="/dramas" className="text-stone-400 text-sm mb-4 block">← 返回</Link>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>文豪短篇阅读</h1>
        <p className="text-stone-400 text-sm mt-1">川端康成・芥川龍之介・三島由紀夫・太宰治</p>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {Array.from(grouped.entries()).map(([author, passages]) => {
          const authorColor = AUTHOR_COLORS[author] || 'bg-stone-100 text-stone-700'
          return (
            <div key={author}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${authorColor}`} translate="no">
                  {author}
                </span>
                <span className="text-xs text-stone-400" translate="no">
                  {passages[0].author_jp}
                </span>
              </div>
              <div className="space-y-2.5">
                {passages.map(p => (
                  <Link
                    key={p.id}
                    href={`/reading/${p.id}`}
                    className="block bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden active:scale-98 transition-transform"
                  >
                    <div className="flex items-stretch">
                      <div
                        className="w-1.5 shrink-0"
                        style={{ background: p.cover_color }}
                      />
                      <div className="flex-1 px-4 py-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-stone-900 text-base" style={{ fontFamily: 'Noto Serif JP, serif' }} translate="no">
                              {p.work_jp}
                            </p>
                            <p className="text-stone-400 text-xs mt-0.5" translate="no">
                              {p.work} · {p.year} · {p.excerpt_label}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${DIFFICULTY_COLORS[p.difficulty]}`}>
                              {p.difficulty}
                            </span>
                            <span className="text-xs text-stone-300">{p.genre}</span>
                          </div>
                        </div>
                        <p className="text-stone-500 text-xs mt-2 leading-relaxed line-clamp-2" translate="no">
                          {p.paragraphs[0].japanese}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
