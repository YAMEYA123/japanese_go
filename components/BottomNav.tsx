'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/dramas', label: '剧・文学', icon: '🎬' },
  { href: '/travel', label: '旅游', icon: '✈️' },
  { href: '/practice', label: '练习', icon: '⚡' },
  { href: '/settings', label: '设置', icon: '⚙️' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe z-50">
      <div className="max-w-lg mx-auto flex">
        {TABS.map(tab => {
          const active = tab.href === '/' ? path === '/' : path.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
                active ? 'text-red-600' : 'text-stone-400'
              }`}
            >
              <span className="text-xl leading-tight">{tab.icon}</span>
              <span className={active ? 'font-medium' : ''}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
