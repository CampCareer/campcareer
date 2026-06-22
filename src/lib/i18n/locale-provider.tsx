'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from './config'
import { dictionaries, type Dictionary } from './dictionaries'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
})

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  // `locale` seeds the initial state only. We intentionally do NOT re-sync it
  // via an effect: pages are statically rendered in DEFAULT_LOCALE, then
  // <LocaleInit> reads the NEXT_LOCALE cookie after mount and calls setLocale().
  // A `useEffect(() => setCurrentLocale(locale), [locale])` here would run after
  // LocaleInit's child effect and clobber the cookie value back to DEFAULT_LOCALE.
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale)

  const setLocale = useCallback((newLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    setCurrentLocale(newLocale)
    document.documentElement.lang = newLocale
  }, [])

  return (
    <LocaleContext.Provider value={{ locale: currentLocale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale
}

export function useSetLocale(): (locale: Locale) => void {
  return useContext(LocaleContext).setLocale
}

export function useTranslations(): Dictionary {
  return dictionaries[useContext(LocaleContext).locale] ?? dictionaries.en
}
