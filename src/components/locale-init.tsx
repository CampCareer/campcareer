'use client'

import { useEffect } from 'react'
import { LOCALE_COOKIE, DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config'
import { useSetLocale } from '@/lib/i18n/locale-provider'

export function LocaleInit() {
  const setLocale = useSetLocale()

  useEffect(() => {
    const value = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
      ?.split('=')[1]
    if (isLocale(value)) {
      setLocale(value)
    } else {
      setLocale(DEFAULT_LOCALE)
    }
  }, [setLocale])

  return null
}
