import { cookies } from 'next/headers'
import { LOCALE_COOKIE, DEFAULT_LOCALE, isLocale, type Locale } from './config'
import { getDictionary } from './dictionaries'

export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export function getTranslations() {
  return getDictionary(getLocale())
}
