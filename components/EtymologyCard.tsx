'use client'
import { useState, useCallback } from 'react'
import { Word, ReviewQuality } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { getSRSLabel } from '@/lib/srs'
import { toRomaji } from '@/lib/romaji'
import SceneIllustration from '@/components/SceneIllustration'

const ORIGIN_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  yamato: { label: '大和言葉', color: 'bg-emerald-100 text-emerald-800', desc: '日本固有词汇，非汉字来源' },
  kango: { label: '漢語', color: 'bg-red-100 text-red-800', desc: '来自中国的汉字词汇' },
  gairaigo: { label: '外来語', color: 'bg-blue-100 text-blue-800', desc: '来自欧美等语言的外来词' },
  mixed: { label: '混合語', color: 'bg-purple-100 text-purple-800', desc: '多语言来源混合构成' },
}

interface Props {
  word: Word
  onReview?: (quality: ReviewQuality) => void
  showReviewButtons?: boolean
  compact?: boolean
}

function useSpeakJapanese() {
  const [speaking, setSpeaking] = useState(false)
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ja-JP'
    utter.rate = 0.85
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }, [])
  return { speak, speaking }
}

export default function EtymologyCard({ word, onReview, showReviewButtons = false, compact = false }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const { speak, speaking } = useSpeakJapanese()
  const srsCards = useAppStore(s => s.srsCards)
  const showRomaji = useAppStore(s => s.showRomaji)
  const srsStatus = getSRSLabel(srsCards[word.id])
  const origin = ORIGIN_LABELS[word.etymology.origin_type]

  const toggle = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 px-5 py-4 border-b border-stone-100">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }} translate="no">
                {word.reading}
              </span>
              {word.jlpt_level && (
                <span className="text-xs font-medium bg-stone-800 text-white px-1.5 py-0.5 rounded">
                  {word.jlpt_level}
                </span>
              )}
              <button
                onClick={() => speak(word.reading || word.japanese)}
                className={`text-xl leading-none transition-opacity ${speaking ? 'opacity-40' : 'opacity-70 active:opacity-40'}`}
                aria-label="朗读"
              >
                🔊
              </button>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg text-stone-500" translate="no">{word.japanese}</span>
              {showRomaji && <span className="text-sm text-stone-400">{toRomaji(word.reading)}</span>}
            </div>
            <div className="text-base font-medium text-stone-800 mt-1">{word.meaning_zh}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${origin.color}`}>
              {origin.label}
            </span>
            <span className={`text-xs font-medium ${srsStatus.color}`}>
              {srsStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-stone-50">
        {/* Scene illustration + drama context */}
        {word.scene_context && (
          <Section
            icon="🎬"
            title="剧中场景"
            expanded={expanded['scene'] ?? true}
            onToggle={() => toggle('scene')}
          >
            {word.drama_id && (
              <div className="mb-3">
                <SceneIllustration word={word} />
              </div>
            )}
            <p className="text-stone-700 text-sm leading-relaxed">{word.scene_context}</p>
          </Section>
        )}

        {/* Kanji breakdown */}
        <Section
          icon="🔍"
          title="汉字解剖"
          expanded={expanded['kanji'] ?? !compact}
          onToggle={() => toggle('kanji')}
        >
          <div className="space-y-3">
            {word.etymology.kanji_breakdown.map((k, i) => (
              <div key={i} className="bg-stone-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
                    {k.kanji}
                  </span>
                  <span className="text-stone-500 text-sm">{k.reading}</span>
                  <span className="text-stone-700 text-sm font-medium">= {k.meaning}</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">{k.origin}</p>
                {k.zh_modern && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-xs text-stone-400">中文对应：</span>
                    <span className="text-xs text-red-700 font-medium">{k.zh_modern}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Related words */}
        <Section
          icon="🌿"
          title="词根家族"
          expanded={expanded['related']}
          onToggle={() => toggle('related')}
        >
          <div className="flex flex-wrap gap-2">
            {word.etymology.related_words.map((rw, i) => (
              <span key={i} className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-1.5 rounded-lg">
                {rw}
              </span>
            ))}
          </div>
        </Section>

        {/* Chinese comparison */}
        {word.etymology.zh_comparison && (
          <Section
            icon="🇨🇳"
            title="中日对比"
            expanded={expanded['zh']}
            onToggle={() => toggle('zh')}
          >
            <p className="text-stone-700 text-sm leading-relaxed">{word.etymology.zh_comparison}</p>
          </Section>
        )}

        {/* Interesting fact */}
        <Section
          icon="✨"
          title="趣味知识"
          expanded={expanded['fact']}
          onToggle={() => toggle('fact')}
        >
          <p className="text-stone-700 text-sm leading-relaxed">{word.etymology.interesting_fact}</p>
        </Section>
      </div>

      {/* Review buttons */}
      {showReviewButtons && onReview && (
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
          <p className="text-xs text-stone-500 mb-2 text-center">你记住了吗？</p>
          <div className="grid grid-cols-4 gap-2">
            {([
              { q: 1 as ReviewQuality, label: '不会', sub: '重来', color: 'bg-red-100 text-red-700 active:bg-red-200' },
              { q: 2 as ReviewQuality, label: '模糊', sub: '看了懂', color: 'bg-orange-100 text-orange-700 active:bg-orange-200' },
              { q: 4 as ReviewQuality, label: '记得', sub: '稍费力', color: 'bg-blue-100 text-blue-700 active:bg-blue-200' },
              { q: 5 as ReviewQuality, label: '很熟', sub: '秒答', color: 'bg-emerald-100 text-emerald-700 active:bg-emerald-200' },
            ] as const).map(btn => (
              <button
                key={btn.q}
                onClick={() => onReview(btn.q)}
                className={`${btn.color} rounded-xl py-2 flex flex-col items-center transition-transform active:scale-95`}
              >
                <span className="font-semibold text-sm">{btn.label}</span>
                <span className="text-xs opacity-70">{btn.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Section({
  icon,
  title,
  expanded,
  onToggle,
  children,
}: {
  icon: string
  title: string
  expanded?: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-medium text-stone-700">{title}</span>
        </div>
        <span className="text-stone-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && <div className="px-5 pb-4">{children}</div>}
    </div>
  )
}
