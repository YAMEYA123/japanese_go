'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

function speakJa(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}
import Link from 'next/link'
import { DRAMAS } from '@/lib/data/dramas'
import { getWordsByDrama } from '@/lib/data/words'
import { getLinesByDrama, DramaLine } from '@/lib/data/drama-lines'
import { useAppStore } from '@/lib/store'
import { getSRSLabel } from '@/lib/srs'
import { toRomaji } from '@/lib/romaji'

const LEVEL_COLORS: Record<string, string> = {
  N5: 'bg-stone-100 text-stone-600',
  N4: 'bg-blue-100 text-blue-700',
  N3: 'bg-teal-100 text-teal-700',
  N2: 'bg-violet-100 text-violet-700',
  N1: 'bg-red-100 text-red-700',
}

function LineCard({ line }: { line: DramaLine }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full shrink-0">
            {line.speaker}
          </span>
          <button
            onClick={() => speakJa(line.japanese)}
            className="text-sm opacity-40 active:opacity-20 shrink-0"
            aria-label="朗读"
          >🔊</button>
        </div>
        <p
          className="text-stone-900 text-base font-medium leading-relaxed"
          style={{ fontFamily: 'Noto Serif JP, serif' }}
          translate="no"
        >
          {line.japanese}
        </p>
        <p className="text-stone-400 text-xs mt-1 leading-relaxed" translate="no">
          {line.reading}
        </p>
        <p className="text-stone-600 text-sm mt-2 leading-relaxed">
          {line.translation_zh}
        </p>
        <p className="text-stone-400 text-xs mt-1.5 italic leading-relaxed">
          {line.context}
        </p>
      </div>
      {line.grammar_notes.length > 0 && (
        <div className="border-t border-stone-100">
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-violet-600 font-medium"
          >
            <span>📖 语法解析（{line.grammar_notes.length}个知识点）</span>
            <span className="text-stone-300">{expanded ? '▲' : '▼'}</span>
          </button>
          {expanded && (
            <div className="px-4 pb-4 space-y-3">
              {line.grammar_notes.map((note, i) => (
                <div key={i} className="bg-violet-50 rounded-xl px-3 py-2.5 border border-violet-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-violet-700" translate="no">{note.point}</span>
                    {note.level && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${LEVEL_COLORS[note.level]}`}>
                        {note.level}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">{note.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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

export default function DramaDetail() {
  const { id } = useParams<{ id: string }>()
  const drama = DRAMAS.find(d => d.id === id)
  const words = getWordsByDrama(id)
  const lines = getLinesByDrama(id)
  const srsCards = useAppStore(s => s.srsCards)
  const showRomaji = useAppStore(s => s.showRomaji)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  function toggleReveal(wordId: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setRevealed(prev => {
      const next = new Set(prev)
      next.has(wordId) ? next.delete(wordId) : next.add(wordId)
      return next
    })
  }

  if (!drama) return <div className="px-4 pt-8 text-stone-500">未找到剧集</div>

  return (
    <div className="pb-4">
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
      <div className="bg-white px-4 py-3 border-b border-stone-100">
        <p className="text-stone-600 text-sm leading-relaxed">{drama.description}</p>
      </div>
      {lines.length > 0 && (
        <div className="px-4 pt-4 space-y-2.5">
          <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
            经典台词 ({lines.length})
          </h2>
          {lines.map(line => (
            <LineCard key={line.id} line={line} />
          ))}
        </div>
      )}

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
                <div className="flex items-baseline gap-2 flex-wrap" translate="no">
                  <span className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
                    {word.reading}
                  </span>
                  <span className="text-stone-400 text-sm">{word.japanese}</span>
                  {showRomaji && <span className="text-stone-300 text-xs">{toRomaji(word.reading)}</span>}
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); speakJa(word.reading || word.japanese) }}
                    className="text-sm opacity-50 active:opacity-20 leading-none"
                    aria-label="朗读"
                  >🔊</button>
                </div>
                <div
                  className="mt-0.5 flex items-center gap-1"
                  onClick={e => toggleReveal(word.id, e)}
                >
                  {revealed.has(word.id) ? (
                    <p className="text-stone-600 text-sm truncate">{word.meaning_zh}</p>
                  ) : (
                    <span className="text-xs text-stone-300 bg-stone-100 px-2 py-0.5 rounded select-none">
                      点击显示意思
                    </span>
                  )}
                </div>
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
