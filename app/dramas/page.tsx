'use client'
import Link from 'next/link'
import { DRAMAS } from '@/lib/data/dramas'
import { Film, BookOpen, Map, ScrollText, Sparkles, ChevronRight } from 'lucide-react'

const CATEGORIES = [
  {
    href: '/reading',
    icon: ScrollText,
    iconBg: 'from-stone-800 to-stone-700',
    label: '文豪短篇阅读',
    sub: '川端康成・芥川龍之介・三島由紀夫・太宰治',
    count: null as number | null,
    countLabel: '',
  },
  {
    href: '/dramas/drama',
    icon: Film,
    iconBg: 'from-blue-700 to-blue-600',
    label: '日剧',
    sub: '职场・医疗・法律・推理等热门剧集',
    count: DRAMAS.filter(d => !d.category || d.category === 'drama').length,
    countLabel: '部剧集',
  },
  {
    href: '/dramas/book',
    icon: BookOpen,
    iconBg: 'from-amber-800 to-amber-700',
    label: '文学作品',
    sub: '日本近现代经典小说词汇精选',
    count: DRAMAS.filter(d => d.category === 'book').length,
    countLabel: '部作品',
  },
  {
    href: '/dramas/travel',
    icon: Map,
    iconBg: 'from-teal-700 to-teal-600',
    label: '旅游场景',
    sub: '餐厅、交通、购物、住宿等实用场景',
    count: DRAMAS.filter(d => d.category === 'travel').length,
    countLabel: '个场景',
  },
  {
    href: '/dramas/anime',
    icon: Sparkles,
    iconBg: 'from-purple-800 to-purple-600',
    label: '动漫',
    sub: '进击的巨人・鬼灭之刃・千与千寻・你的名字',
    count: DRAMAS.filter(d => d.category === 'anime').length,
    countLabel: '部作品',
  },
]

export default function DramasPage() {
  return (
    <div className="px-4 pt-8 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Noto Serif JP, serif' }}>
          词库
        </h1>
        <p className="text-stone-500 text-sm mt-1">选择内容，优先学习相关词汇</p>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map(({ href, icon: Icon, iconBg, label, sub, count, countLabel }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 shadow-sm border border-stone-100 active:scale-[0.98] transition-transform duration-150"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-stone-900 text-sm">{label}</p>
              <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">{sub}</p>
              {count !== null && (
                <p className="text-xs text-stone-300 mt-1">{count} {countLabel}</p>
              )}
            </div>
            <ChevronRight size={16} className="text-stone-300 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
