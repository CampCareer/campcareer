"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { ArrowLeft, Check, ChevronDown, Search } from "lucide-react"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { PROGRAM_LEVELS, type ProgramSearchFilters } from "@/lib/programs/program-search"
import { cn } from "@/lib/utils"
import { useProgramNavigation } from "./programs-navigation"

const PUBLISHED_PROGRAM_COUNTRIES = new Set([
  "AU", "CA", "UK", "NZ", "NL", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH", "BE", "ES", "FR", "DE", "SG",
])

function ProgramCountryPicker({
  countryCode,
  onPick,
}: {
  countryCode: string
  onPick: (countryCode: string) => void
}) {
  const locale = useRouteLocale()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const selected =
    LAUNCH_COUNTRIES.find((country) => country.code === countryCode) ?? LAUNCH_COUNTRIES[0]

  useEffect(() => {
    function close(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[hsl(var(--cc-border))] bg-white pl-2 pr-3 text-[13px] font-medium text-[hsl(var(--cc-ink))] transition hover:border-brand/40">
        <img src={selected.image} alt="" width={40} height={28} className="size-5 shrink-0 rounded-full object-cover" />
        <span className="max-w-32 truncate">{selected.name}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-[hsl(var(--cc-muted))] transition", open && "rotate-180")} />
      </button>

      {open && (
        <div role="listbox" aria-label={locale === "ko" ? "프로그램 국가 선택" : "Select a program country"} className="absolute left-0 top-[calc(100%+6px)] z-40 w-64 overflow-hidden rounded-xl border border-[hsl(var(--cc-border))] bg-white p-1 shadow-xl shadow-black/5">
          <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--cc-muted))]">
            {locale === "ko" ? "출처 검토 후 공개" : "Published after source review"}
          </p>
          <ul className="max-h-72 overflow-y-auto">
            {LAUNCH_COUNTRIES.map((country) => {
              const isSelected = country.code === selected.code
              const isPublished = PUBLISHED_PROGRAM_COUNTRIES.has(country.code)
              return (
                <li key={country.code}>
                  <button type="button" role="option" aria-selected={isSelected} onClick={() => { onPick(country.code); setOpen(false) }} className={cn("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition", isSelected ? "bg-[hsl(var(--brand-tint))] text-brand" : "text-[hsl(var(--cc-ink-secondary))] hover:bg-[hsl(var(--cc-canvas))]")}>
                    <img src={country.image} alt="" width={40} height={28} className="size-4 shrink-0 rounded-full object-cover" />
                    <span className="truncate">{country.name}</span>
                    <span className="ml-auto flex items-center gap-2">
                      {!isPublished && <span className="text-[10px] font-semibold uppercase text-[hsl(var(--cc-muted))]">Soon</span>}
                      {isSelected && <Check className="size-3.5" />}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export function ProgramsHeader({
  filters,
}: {
  filters: ProgramSearchFilters
}) {
  const locale = useRouteLocale()
  const replace = useProgramNavigation()
  const { setSelectedCountry } = useSelectedCountry()
  const [query, setQuery] = useState(filters.q)
  const searchableCountry = PUBLISHED_PROGRAM_COUNTRIES.has(filters.country)
  const career = filters.career && filters.career !== "all"
    ? CANONICAL_CAREER_BY_ID.get(filters.career)
    : null
  const careerName = career ? (locale === "ko" ? career.labelKo : career.label) : null
  const careerHref = career
    ? localizePath(`/career?country=${encodeURIComponent(filters.country)}&occupation=${encodeURIComponent(career.id)}`, locale)
    : null

  useEffect(() => setQuery(filters.q), [filters.q])
  useEffect(() => {
    const country =
      LAUNCH_COUNTRIES.find((item) => item.code === filters.country) ?? LAUNCH_COUNTRIES[0]
    setSelectedCountry({ code: country.code, name: country.name, currency: country.currency })
  }, [filters.country, setSelectedCountry])

  function pickCountry(countryCode: string) {
    const country = LAUNCH_COUNTRIES.find((item) => item.code === countryCode)
    if (country) setSelectedCountry({ code: country.code, name: country.name, currency: country.currency })
    replace({
      country: countryCode,
      level: null,
      field: null,
      city: null,
      state: null,
      province: null,
      career: filters.career && filters.career !== "all" ? filters.career : null,
      institution: null,
      pgwp: null,
      duration: null,
      fee: null,
      source: null,
      sort: null,
    })
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    replace({ q: query.trim() || null })
  }

  const placeholder =
    locale === "ko"
      ? careerName
        ? `${careerName} 진입에 관련된 과정 검색`
        : "과정명 또는 학교명으로 검색하세요"
      : careerName
        ? `Search programs related to ${careerName}…`
        : filters.country === "CA"
          ? "Search programs, institutions or cities…"
          : filters.country === "UK"
            ? "Search UK programmes or institutions…"
            : "Search programs or institutions…"

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">{locale === "ko" ? "학업 · 프로그램" : "STUDY · PROGRAMS"}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[hsl(var(--cc-ink))] sm:text-3xl">
              {careerName ? (locale === "ko" ? `${careerName} 진입 프로그램` : `Programs for ${careerName}`) : (locale === "ko" ? "프로그램" : "Programs")}
            </h1>
            <ProgramCountryPicker countryCode={filters.country} onPick={pickCountry} />
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-muted))]">
            {careerName
              ? locale === "ko" ? "목표 커리어에 실제로 연결되는 과정인지 확인하고, 입학·자격·등록 결과를 공식 출처로 검증하세요." : "Check whether each program actually supports entry to this career, then verify admission, qualification and registration outcomes with official sources."
              : locale === "ko" ? "과정 자체보다 어떤 커리어로 이어지는지 먼저 확인하세요." : "Start with the career outcome, then use this catalogue to inspect relevant study options."}
          </p>
        </div>
        {careerHref ? (
          <Link href={careerHref} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline">
            <ArrowLeft className="size-3.5" /> {locale === "ko" ? "Career Page" : "Career Page"}
          </Link>
        ) : null}
      </div>

      {searchableCountry && (
        <form onSubmit={submitSearch} className="mt-6 max-w-3xl">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[hsl(var(--cc-muted))]" />
            <input type="search" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder={placeholder} className="h-[52px] w-full rounded-xl border border-[hsl(var(--cc-border))] bg-white pl-11 pr-24 text-[14px] text-[hsl(var(--cc-ink))] outline-none transition placeholder:text-[hsl(var(--cc-muted))] focus:border-brand focus:ring-2 focus:ring-brand/10" />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-brand px-4 py-2 text-[12px] font-semibold text-white transition hover:opacity-90">
              {locale === "ko" ? "검색" : "Search"}
            </button>
          </label>
        </form>
      )}

      {filters.country === "AU" && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {PROGRAM_LEVELS.map((level) => (
            <button key={level.value} type="button" onClick={() => replace({ level: level.value })} className={cn("shrink-0 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium transition", filters.level === level.value ? "border-brand bg-brand text-white" : "border-[hsl(var(--cc-border))] bg-white text-[hsl(var(--cc-ink-secondary))] hover:border-brand/40 hover:text-brand")}>
              {locale === "ko" ? level.labelKo : level.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
