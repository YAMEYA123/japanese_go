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

function PhraseCard({ phrase }: { phrase: TravelPhrase }) {
  const [showReading, setShowReading] = useState(false)
  const [showMeaning, setShowMeaning] = useState(false)

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

      {/* Reading toggle */}
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
    </div>
  )
}

function SceneView({ scene, onBack }: { scene: TravelScene; onBack: () => void }) {
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
        <p className="text-white/60 text-xs mt-2">{scene.phrases.length} 条常用句 · 点击🔊朗读</p>
      </div>

      {/* Phrases */}
      <div className="px-4 pt-4 pb-6 space-y-3">
        {scene.phrases.map(p => (
          <PhraseCard key={p.id} phrase={p} />
        ))}
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
      <p className="text-stone-500 text-sm mb-6">旅游场景必备短句，点击朗读跟读练习</p>

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

      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5">
        <p className="text-amber-800 text-sm font-medium mb-1">📌 使用技巧</p>
        <p className="text-amber-700 text-xs leading-relaxed">
          先看日语句子，点🔊听发音并跟读。不懂时再展开读音和中文。每天选一个场景，反复练习直到能直接开口。
        </p>
      </div>
    </div>
  )
}
