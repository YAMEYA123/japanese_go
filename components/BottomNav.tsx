'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Film, BookOpen, Zap, Settings } from 'lucide-react'

const TABS = [
  { href: '/', label: '首页', Icon: Home },
  { href: '/dramas', label: '剧・文学', Icon: Film },
  { href: '/gojuuon', label: '五十音', Icon: BookOpen },
  { href: '/practice', label: '练习', Icon: Zap },
  { href: '/settings', label: '设置', Icon: Settings },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-stone-200 pb-safe z-50">
      <div className="max-w-lg mx-auto flex">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center min-h-[52px] py-1.5 gap-0.5 text-xs transition-all duration-200 ${
                active ? 'text-red-600' : 'text-stone-400'
              }`}
            >
              <div className={`w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                active ? 'bg-red-50' : ''
              }`}>
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              </div>
              <span className={active ? 'font-medium' : ''}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
