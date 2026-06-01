'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/lib/i18n/locale-provider'
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n/config'

export function LanguageToggle() {
  const router = useRouter()
  const locale = useLocale()
  const next: Locale = locale === 'ko' ? 'en' : 'ko'

  function switchTo(target: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    router.refresh()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => switchTo(next)}
      aria-label="Toggle language"
      className="text-slate-600 hover:bg-slate-50"
    >
      {locale === 'ko' ? 'EN' : '한국어'}
    </Button>
  )
}
