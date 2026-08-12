'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, localeForUi, localeFromPathname } from '@/lib/i18n/config'
import { useSetLocale } from '@/lib/i18n/locale-provider'

export function LocaleInit() {
  const setLocale = useSetLocale()
  const pathname = usePathname()

  useEffect(() => {
    // The URL is the source of truth: bare URLs are always English, while
    // /ko URLs are always Korean. This keeps shared career results from
    // inheriting a different language from an old browser preference.
    // Next.js locale rewrites resolve `usePathname()` to the internal route
    // on some navigations (for example `/ko/au/study` → `/au/study`). The
    // browser URL remains the visitor-facing source of truth in that case.
    const pathLocale = localeFromPathname(window.location.pathname) ?? localeFromPathname(pathname)
    setLocale(pathLocale ? localeForUi(pathLocale) : DEFAULT_LOCALE)
  }, [pathname, setLocale])

  return null
}
