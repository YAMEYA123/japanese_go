'use client'
import { useState } from 'react'
import { TRAVEL_SCENES, TravelScene, TravelPhrase } from '@/lib/data/travel-phrases'

function speakJa(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.8
  window.speechSynthesis.speak(u)
}

const LEVEL_COLORS: Record<string, string> = {
  N5: 'bg-stone-100 text-stone-500',
  N4: 'bg-blue-50 text-blue-500',
  N3: 'bg-teal-50 text-teal-600',
  N2: 'bg-violet-50 text-violet-600',
  N1: 'bg-red-50 text-red-600',
}

function PhraseCard({ phrase }: { phrase: TravelPhrase }) {
  const [showReading, setShowReading] = useState(false)
  const [showMeaning, setShowMeaning] = useState(false)
  const [showGrammar, setShowGrammar] = useState(false)

  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-stone-100">
      {/* Japanese text + TTS */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-base font-medium text-stone-900 leading-relaxed flex-1"
          style={{ fontFamily: 'Noto Serif JP, serif' }}
          translate="no"
        >
          {phrase.japanese}
        </p>
        <button
          onClick={() => speakJa(phrase.reading)}
          className="text-lg opacity-50 active:opacity-20 shrink-0 mt-0.5"
          aria-label="朗读"
        >
          🔊
        </button>
      </div>

      {/* Toggles row */}
      <div className="mt-1.5 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowReading(v => !v)}
          className="text-xs text-stone-400 underline underline-offset-2"
        >
          {showReading ? '收起读音' : '显示读音'}
        </button>
        <button
          onClick={() => setShowMeaning(v => !v)}
          className="text-xs text-stone-400 underline underline-offset-2"
        >
          {showMeaning ? '收起中文' : '显示中文'}
        </button>
        {phrase.grammar && (
          <button
            onClick={() => setShowGrammar(v => !v)}
            className="text-xs text-violet-500 underline underline-offset-2 flex items-center gap-0.5"
          >
            {phrase.grammar.level && (
              <span className={`text-xs px-1 py-px rounded font-medium mr-0.5 ${LEVEL_COLORS[phrase.grammar.level] ?? ''}`}>
                {phrase.grammar.level}
              </span>
            )}
            {showGrammar ? '收起语法' : '语法解析'}
          </button>
        )}
      </div>

      {showReading && (
        <p className="text-sm text-red-600 mt-1.5 leading-relaxed" translate="no">
          {phrase.reading}
        </p>
      )}
      {showMeaning && (
        <p className="text-sm text-stone-600 mt-1">
          {phrase.meaning_zh}
        </p>
      )}
      {phrase.tip && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 mt-2">
          💡 {phrase.tip}
        </p>
      )}

      {/* Grammar panel */}
      {showGrammar && phrase.grammar && (
        <div className="mt-2.5 bg-violet-50 rounded-xl px-3 py-2.5 space-y-1.5 border border-violet-100">
          <p className="text-xs font-semibold text-violet-700 flex items-center gap-1.5">
            <span>📐</span>
            <span translate="no">{phrase.grammar.pattern}</span>
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            {phrase.grammar.explanation}
          </p>
          {phrase.grammar.example && (
            <p className="text-xs text-violet-600 bg-violet-100/60 rounded-lg px-2 py-1.5 leading-relaxed" translate="no">
              例：{phrase.grammar.example}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function SceneView({ scene, onBack }: { scene: TravelScene; onBack: () => void }) {
  const n2Count = scene.phrases.filter(p => p.grammar?.level === 'N2' || p.grammar?.level === 'N1').length

  return (
    <div>
      {/* Header */}
      <div className={`bg-gradient-to-r ${scene.color} px-4 pt-10 pb-5`}>
        <button onClick={onBack} className="text-white/80 text-sm mb-3 flex items-center gap-1">
          ← 返回
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{scene.icon}</span>
          <div>
            <p className="text-white/70 text-sm">{scene.name_jp}</p>
            <h1 className="text-white text-xl font-bold">{scene.name_zh}常用句</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-white/60 text-xs">{scene.phrases.length} 条短句</p>
          {n2Count > 0 && (
            <p className="text-white/60 text-xs">· {n2Count} 个N2语法点</p>
          )}
          <p className="text-white/60 text-xs">· 点🔊朗读跟读</p>
        </div>
      </div>

      {/* Phrases */}
      <div className="px-4 pt-4 pb-6 space-y-3">
        {scene.phrases.map(p => (
          <PhraseCard key={p.id} phrase={p} />
        ))}

        {/* Grammar level legend */}
        <div className="bg-stone-50 rounded-2xl px-4 py-3 border border-stone-100 mt-2">
          <p className="text-xs font-medium text-stone-500 mb-2">语法难度标识</p>
          <div className="flex flex-wrap gap-2">
            {(['N5','N4','N3','N2','N1'] as const).map(lv => (
              <span key={lv} className={`text-xs px-2 py-0.5 rounded font-medium ${LEVEL_COLORS[lv]}`}>
                {lv} {lv === 'N5' ? '入门' : lv === 'N4' ? '基础' : lv === 'N3' ? '中级' : lv === 'N2' ? '进阶' : '高级'}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TravelPage() {
  const [activeScene, setActiveScene] = useState<TravelScene | null>(null)

  if (activeScene) {
    return <SceneView scene={activeScene} onBack={() => setActiveScene(null)} />
  }

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Noto Serif JP, serif' }}>
        旅行日語
      </h1>
      <p className="text-stone-500 text-sm mb-6">旅游场景必备短句 · 含语法解析 · 点击朗读跟读</p>

      <div className="grid grid-cols-2 gap-3">
        {TRAVEL_SCENES.map(scene => (
          <button
            key={scene.id}
            onClick={() => setActiveScene(scene)}
            className={`bg-gradient-to-br ${scene.color} rounded-2xl p-4 text-left active:scale-95 transition-transform shadow-sm`}
          >
            <span className="text-3xl">{scene.icon}</span>
            <p className="text-white font-bold mt-2">{scene.name_zh}</p>
            <p className="text-white/70 text-xs mt-0.5">{scene.name_jp}</p>
            <p className="text-white/60 text-xs mt-1">{scene.phrases.length} 条短句</p>
          </button>
        ))}
      </div>

      <div className="mt-4 bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3.5">
        <p className="text-violet-800 text-sm font-medium mb-1">📐 语法解析功能</p>
        <p className="text-violet-700 text-xs leading-relaxed">
          每条短句都附有语法解析，点击「语法解析」展开学习语序、时态、敬语等N5～N2知识点，旅游学日语两不误。
        </p>
      </div>

      <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5">
        <p className="text-amber-800 text-sm font-medium mb-1">📌 使用技巧</p>
        <p className="text-amber-700 text-xs leading-relaxed">
          先看日语句子，点🔊听发音并跟读。不懂时再展开读音和中文。每天选一个场景反复练习，直到能直接开口。
        </p>
      </div>
    </div>
  )
}
