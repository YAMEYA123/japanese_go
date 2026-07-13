'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getReadingById, ReadingPassage } from '@/lib/data/readings'

function speakJa(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.75
  window.speechSynthesis.speak(u)
}

const LEVEL_COLORS: Record<string, string> = {
  N5: 'bg-stone-100 text-stone-600',
  N4: 'bg-blue-100 text-blue-700',
  N3: 'bg-teal-100 text-teal-700',
  N2: 'bg-violet-100 text-violet-700',
  N1: 'bg-red-100 text-red-700',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  N3: 'bg-teal-100 text-teal-700',
  N2: 'bg-violet-100 text-violet-700',
  N1: 'bg-red-100 text-red-700',
}

function ParagraphCard({ para, index }: { para: ReadingPassage['paragraphs'][0]; index: number }) {
  const [showReading, setShowReading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-stone-300 font-medium">第 {index + 1} 段</span>
          <button
            onClick={() => speakJa(para.japanese)}
            className="text-sm opacity-40 active:opacity-20"
            aria-label="朗读"
          >🔊</button>
        </div>
        <p
          className="text-stone-900 text-base leading-loose"
          style={{ fontFamily: 'Noto Serif JP, serif', lineHeight: '2.2' }}
          translate="no"
        >
          {para.japanese}
        </p>
      </div>

      <div className="border-t border-stone-50 px-4 py-2 flex gap-3">
        <button
          onClick={() => setShowReading(v => !v)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            showReading ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-500'
          }`}
          translate="no"
        >
          {showReading ? '隐藏' : '显示'}读音
        </button>
        <button
          onClick={() => setShowTranslation(v => !v)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            showTranslation ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
          }`}
        >
          {showTranslation ? '隐藏' : '显示'}译文
        </button>
      </div>

      {showReading && (
        <div className="px-4 pb-3">
          <p className="text-stone-500 text-sm leading-relaxed" translate="no">{para.reading}</p>
        </div>
      )}
      {showTranslation && (
        <div className="px-4 pb-3 border-t border-stone-50 pt-2.5">
          <p className="text-stone-600 text-sm leading-relaxed">{para.translation_zh}</p>
        </div>
      )}
    </div>
  )
}

export default function ReadingDetail() {
  const { id } = useParams<{ id: string }>()
  const passage = getReadingById(id)
  const [grammarExpanded, setGrammarExpanded] = useState(false)
  const [vocabExpanded, setVocabExpanded] = useState(false)

  if (!passage) return <div className="px-4 pt-8 text-stone-500">未找到内容</div>

  return (
    <div className="pb-24">
      {/* Header */}
      <div
        className="relative px-5 pt-12 pb-6"
        style={{ background: passage.cover_color }}
      >
        <Link href="/reading" className="absolute top-4 left-4 text-white/80 text-sm">← 返回</Link>
        <button
          onClick={() => speakJa(passage.paragraphs.map(p => p.japanese).join('　'))}
          className="absolute top-4 right-4 text-white/70 text-lg active:opacity-50"
          aria-label="朗读全文"
        >🔊</button>
        <div>
          <p className="text-white/70 text-sm mb-1">{passage.author} · {passage.work} · {passage.year}</p>
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: 'Noto Serif JP, serif' }} translate="no">
            {passage.work_jp}
          </h1>
          <p className="text-white/60 text-xs mt-1" translate="no">{passage.author_jp} / {passage.work_reading}</p>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFFICULTY_COLORS[passage.difficulty]}`}>
            {passage.difficulty}
          </span>
          <span className="text-white/60 text-xs">{passage.excerpt_label}</span>
          <span className="text-white/60 text-xs">· {passage.genre}</span>
        </div>
      </div>

      {/* Paragraphs */}
      <div className="px-4 pt-4 space-y-3">
        <h2 className="text-xs font-medium text-stone-400 uppercase tracking-wide">原文</h2>
        {passage.paragraphs.map((para, i) => (
          <ParagraphCard key={i} para={para} index={i} />
        ))}
      </div>

      {/* Vocabulary */}
      {passage.vocabulary.length > 0 && (
        <div className="px-4 pt-5">
          <button
            onClick={() => setVocabExpanded(v => !v)}
            className="w-full bg-white rounded-2xl shadow-sm border border-stone-100 px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-700">📚 重要词汇</span>
              <span className="text-xs text-stone-400">({passage.vocabulary.length}个)</span>
            </div>
            <span className="text-stone-300 text-sm">{vocabExpanded ? '▲' : '▼'}</span>
          </button>
          {vocabExpanded && (
            <div className="mt-2 space-y-2">
              {passage.vocabulary.map((v, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 border border-stone-100 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }} translate="no">
                        {v.word}
                      </span>
                      <span className="text-stone-400 text-xs" translate="no">{v.reading}</span>
                      <button
                        onClick={() => speakJa(v.reading)}
                        className="text-xs opacity-40 active:opacity-20"
                      >🔊</button>
                    </div>
                    <p className="text-stone-600 text-sm mt-0.5">{v.meaning}</p>
                  </div>
                  {v.level && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${LEVEL_COLORS[v.level]}`}>
                      {v.level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grammar Notes */}
      {passage.grammar_notes.length > 0 && (
        <div className="px-4 pt-3">
          <button
            onClick={() => setGrammarExpanded(v => !v)}
            className="w-full bg-white rounded-2xl shadow-sm border border-stone-100 px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-violet-700">📖 语法解析</span>
              <span className="text-xs text-stone-400">({passage.grammar_notes.length}个知识点)</span>
            </div>
            <span className="text-stone-300 text-sm">{grammarExpanded ? '▲' : '▼'}</span>
          </button>
          {grammarExpanded && (
            <div className="mt-2 space-y-2">
              {passage.grammar_notes.map((note, i) => (
                <div key={i} className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
                  <div className="flex items-center gap-2 mb-1.5">
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
