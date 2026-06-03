'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PanelLeft, PanelLeftClose, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'
import { LanguageToggle } from '@/components/language-toggle'
import { useTranslations } from '@/lib/i18n/locale-provider'
import type { User } from '@supabase/supabase-js'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/roi-explorer': 'ROI Explorer',
  '/compare': 'Country Compare',
  '/checklist': 'Checklist',
  '/timeline': 'Timeline',
  '/career-path': 'Career Map',
}

export function Header({ onToggleSidebar, onToggleMobile, collapsed }: { onToggleSidebar?: () => void; onToggleMobile?: () => void; collapsed?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const title = pageTitles[pathname] ?? 'CampCareer'
  const t = useTranslations()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          aria-label="Open menu"
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
        <h1 className="font-semibold text-slate-800 text-sm">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <LanguageToggle />
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {t.common.signOut}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/login')}
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            {t.common.signIn}
          </Button>
        )}
      </div>
    </header>
  )
}
