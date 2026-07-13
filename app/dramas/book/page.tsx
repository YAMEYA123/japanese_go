'use client'
import Link from 'next/link'
import { DRAMAS } from '@/lib/data/dramas'
import { useAppStore } from '@/lib/store'
import { BookOpen } from 'lucide-react'
import { DramaCard } from '@/app/dramas/_components/DramaCard'

export default function BookListPage() {
  const { selectedDramaIds, selectDrama, deselectDrama } = useAppStore()
  const books = DRAMAS.filter(d => d.category === 'book')

  function toggle(id: string) {
    selectedDramaIds.includes(id) ? deselectDrama(id) : selectDrama(id)
  }

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-amber-800 to-amber-700 px-5 pt-12 pb-6 relative">
        <Link href="/dramas" className="absolute top-4 left-4 text-white/80 text-sm">← 返回</Link>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
          <BookOpen size={20} className="text-white" />
        </div>
        <h1 className="text-white text-2xl font-bold" style={{ fontFamily: 'Noto Serif JP, serif' }}>文学作品</h1>
        <p className="text-white/60 text-sm mt-1">日本近现代经典小说词汇精选 · {books.length} 部</p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {books.map(d => (
          <DramaCard key={d.id} drama={d} selected={selectedDramaIds.includes(d.id)} onToggle={() => toggle(d.id)} />
        ))}
      </div>
    </div>
  )
}
