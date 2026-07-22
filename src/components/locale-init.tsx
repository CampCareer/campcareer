'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LOCALE_COOKIE, DEFAULT_LOCALE, isLocale, localeForUi, localeFromPathname } from '@/lib/i18n/config'
import { useSetLocale } from '@/lib/i18n/locale-provider'

export function LocaleInit() {
  const setLocale = useSetLocale()
  const pathname = usePathname()

  useEffect(() => {
    // A locale-prefixed URL is an explicit visitor choice. Prefer it to a
    // stale cookie so shared /ko links render their interactive controls in
    // Korean even before a browser has persisted the locale preference.
    // Next.js locale rewrites resolve `usePathname()` to the internal route
    // on some navigations (for example `/ko/au/study` → `/au/study`). The
    // browser URL remains the visitor-facing source of truth in that case.
    const pathLocale = localeFromPathname(window.location.pathname) ?? localeFromPathname(pathname)
    if (pathLocale) {
      setLocale(localeForUi(pathLocale))
      return
    }

    const value = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
      ?.split('=')[1]
    if (isLocale(value)) {
      setLocale(value)
    } else {
      setLocale(DEFAULT_LOCALE)
    }
  }, [pathname, setLocale])

  return null
}
