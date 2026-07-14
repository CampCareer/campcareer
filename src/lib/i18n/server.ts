import { cookies, headers } from 'next/headers'
import { LOCALE_COOKIE, DEFAULT_LOCALE, isLocale, type Locale } from './config'
import { getDictionary } from './dictionaries'

export async function getLocale(): Promise<Locale> {
  const routeLocale = (await headers()).get('x-campcareer-locale')
  if (isLocale(routeLocale)) return routeLocale
  const value = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/**
 * The document language follows the reviewed message catalogue, not merely a
 * reserved future URL prefix. This prevents assistive technology and search
 * engines from being told that English fallback content is translated.
 */
export async function getDocumentLocale(): Promise<Locale> {
  const routeLocale = (await headers()).get('x-campcareer-route-locale')
  if (isLocale(routeLocale)) return routeLocale

  const value = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export async function getTranslations() {
  return getDictionary(await getLocale())
}
