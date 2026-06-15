"use client"

import { useRouter } from "next/navigation"
import {
  type CountryCode,
  ALL_COUNTRIES,
  MAJOR_OPTIONS,
  COUNTRY_META,
  majorLabel,
} from "@/lib/degree-risk"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { cn } from "@/lib/utils"

const CHIP_BASE =
  "inline-flex items-center gap-1.5 min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"

function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        CHIP_BASE,
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
        disabled && "cursor-not-allowed opacity-40 hover:border-slate-200"
      )}
    >
      {children}
    </button>
  )
}

export function CompareSelectors({
  field,
  a,
  b,
}: {
  field: string
  a: CountryCode
  b: CountryCode
}) {
  const router = useRouter()
  const t = useTranslations()
  const tc = t.compare
  const rr = t.degreeRisk.result
  const opts = t.degreeRisk.options as Record<string, string>
  const majorName = (slug: string) => opts[slug] ?? majorLabel(slug)

  function push(next: { field?: string; a?: CountryCode; b?: CountryCode }) {
    const f = next.field ?? field
    const na = next.a ?? a
    const nb = next.b ?? b
    router.push(`/compare?field=${f}&a=${na}&b=${nb}`, { scroll: false })
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Major */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{tc.majorLabel}</p>
        <div className="flex flex-wrap gap-2">
          {MAJOR_OPTIONS.map((m) => (
            <Chip key={m.slug} active={field === m.slug} onClick={() => push({ field: m.slug })}>
              {majorName(m.slug)}
            </Chip>
          ))}
        </div>
      </div>

      {/* Country A / Country B */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{tc.countryA}</p>
          <div className="flex flex-wrap gap-2">
            {ALL_COUNTRIES.map((c) => (
              <Chip key={c} active={a === c} disabled={c === b} onClick={() => push({ a: c })}>
                <span className="text-base leading-none">{COUNTRY_META[c].flag}</span>
                {rr.countries[c]}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{tc.countryB}</p>
          <div className="flex flex-wrap gap-2">
            {ALL_COUNTRIES.map((c) => (
              <Chip key={c} active={b === c} disabled={c === a} onClick={() => push({ b: c })}>
                <span className="text-base leading-none">{COUNTRY_META[c].flag}</span>
                {rr.countries[c]}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
