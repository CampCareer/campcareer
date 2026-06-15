'use client'

import { Button } from '@/components/ui/button'
import { useLocale, useSetLocale } from '@/lib/i18n/locale-provider'
import { type Locale } from '@/lib/i18n/config'

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale()
  const setLocale = useSetLocale()
  const next: Locale = locale === 'ko' ? 'en' : 'ko'

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      aria-label="Toggle language"
      className={className ?? 'text-slate-600 hover:bg-slate-50'}
    >
      {locale === 'ko' ? 'EN' : '한국어'}
    </Button>
  )
}
