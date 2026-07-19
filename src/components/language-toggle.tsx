'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useSetLocale } from '@/lib/i18n/locale-provider'
import { LOCALE_META, PUBLISHED_LOCALE_OPTIONS, localeForUi, localeFromPathname, localizePath, type LocaleOption } from '@/lib/i18n/config'

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale()
  const setLocale = useSetLocale()
  const pathname = usePathname()
  const router = useRouter()
  const selectedLocale = localeFromPathname(pathname) ?? locale

  return (
    <label className={className ?? 'text-slate-600'}>
      <span className="sr-only">Language</span>
      <select
        value={selectedLocale}
        onChange={(event) => {
          const next = event.target.value as LocaleOption
          setLocale(localeForUi(next))
          router.replace(localizePath(pathname, next))
        }}
        aria-label="Language"
        className="h-8 max-w-[7.75rem] rounded-md bg-transparent px-1.5 text-xs font-medium outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 max-[360px]:max-w-[4.75rem] max-[360px]:px-1"
      >
        {PUBLISHED_LOCALE_OPTIONS.map((option) => (
          <option key={option} value={option}>{LOCALE_META[option].label}</option>
        ))}
      </select>
    </label>
  )
}
