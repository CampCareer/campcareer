// These are the two locales with reviewed message catalogues.  Additional
// locale paths below are intentionally routed to English until their own
// catalogue and editorial QA are complete.
export const SUPPORTED_LOCALES = ['en', 'ko'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

// Only these locales have a reviewed UI catalogue and may be offered as a
// language choice. Keep planned locales in the routing registry below so a
// future launch does not require URL migrations, but never present an English
// fallback as if it were a finished translation.
export const PUBLISHED_LOCALE_OPTIONS = ['en', 'ko'] as const
export type PublishedLocaleOption = (typeof PUBLISHED_LOCALE_OPTIONS)[number]

export const LOCALE_OPTIONS = ['en', 'ko', 'zh-Hans', 'vi', 'hi', 'es'] as const
export type LocaleOption = (typeof LOCALE_OPTIONS)[number]

export const LOCALE_META: Record<LocaleOption, { label: string; prefix: string | null }> = {
  en: { label: 'English', prefix: null },
  ko: { label: '한국어', prefix: 'ko' },
  'zh-Hans': { label: '简体中文', prefix: 'zh-hans' },
  vi: { label: 'Tiếng Việt', prefix: 'vi' },
  hi: { label: 'हिन्दी', prefix: 'hi' },
  // /es already belongs to CampCareer’s Spain destination hub. Keep that
  // durable URL and reserve a non-colliding locale prefix for Spanish UI.
  es: { label: 'Español', prefix: 'es-419' },
}

const REGION_DISPLAY_CODE_OVERRIDES: Record<string, string> = {
  UK: 'GB',
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function isLocaleOption(value: string | undefined | null): value is LocaleOption {
  return !!value && (LOCALE_OPTIONS as readonly string[]).includes(value)
}

export function isPublishedLocaleOption(value: string | undefined | null): value is PublishedLocaleOption {
  return !!value && (PUBLISHED_LOCALE_OPTIONS as readonly string[]).includes(value)
}

export function localeFromPathname(pathname: string): LocaleOption | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  if (!firstSegment) return null
  return (LOCALE_OPTIONS.find((locale) => LOCALE_META[locale].prefix === firstSegment) ?? null)
}

export function withoutLocalePrefix(pathname: string): string {
  const locale = localeFromPathname(pathname)
  if (!locale) return pathname || '/'
  const prefix = `/${LOCALE_META[locale].prefix}`
  const stripped = pathname.slice(prefix.length)
  return stripped || '/'
}

export function localizePath(pathname: string, locale: LocaleOption): string {
  const barePath = withoutLocalePrefix(pathname)
  const prefix = LOCALE_META[locale].prefix
  return prefix ? `/${prefix}${barePath === '/' ? '' : barePath}` : barePath
}

export function localeForUi(locale: LocaleOption): Locale {
  return locale === 'ko' ? 'ko' : 'en'
}

/**
 * Returns a visitor-facing country or region name for the active UI locale.
 * Product country codes stay stable in URLs/storage while display names are
 * derived at the edge. `UK` is the one public product code that needs the ISO
 * `GB` alias understood by Intl.DisplayNames.
 */
export function countryDisplayName(locale: Locale, countryCode: string, fallbackName?: string): string {
  const normalizedCode = countryCode.trim().toUpperCase()
  if (!normalizedCode) return fallbackName ?? countryCode

  const regionCode = REGION_DISPLAY_CODE_OVERRIDES[normalizedCode] ?? normalizedCode
  try {
    const displayNames = new Intl.DisplayNames(locale === 'ko' ? 'ko-KR' : 'en', { type: 'region' })
    return displayNames.of(regionCode) ?? fallbackName ?? countryCode
  } catch {
    return fallbackName ?? countryCode
  }
}
