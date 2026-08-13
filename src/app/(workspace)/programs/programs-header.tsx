"use client"

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { useSelectedCountry } from "@/components/workspace/country-context"
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
      <button type="button" onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open} className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e0dfdb] bg-white pl-2 pr-3 text-[13px] font-medium text-[#1b1b1b] transition hover:border-[#3e7a2e]/50">
        <img src={selected.image} alt="" width={40} height={28} className="size-5 shrink-0 rounded-full object-cover" />
        <span className="max-w-32 truncate">{selected.name}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-[#9c9a94] transition", open && "rotate-180")} />
      </button>

      {open && (
        <div role="listbox" aria-label={locale === "ko" ? "프로그램 국가 선택" : "Select a program country"} className="absolute left-0 top-[calc(100%+6px)] z-40 w-64 overflow-hidden rounded-xl border border-[#e7e6e3] bg-white p-1 shadow-xl shadow-black/5">
          <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#a3a19b]">
            {locale === "ko" ? "검증 완료 국가부터 공개" : "Published after source review"}
          </p>
          <ul className="max-h-72 overflow-y-auto">
            {LAUNCH_COUNTRIES.map((country) => {
              const isSelected = country.code === selected.code
              const isPublished = PUBLISHED_PROGRAM_COUNTRIES.has(country.code)
              return (
                <li key={country.code}>
                  <button type="button" role="option" aria-selected={isSelected} onClick={() => { onPick(country.code); setOpen(false) }} className={cn("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition", isSelected ? "bg-[#edf5ea] text-[#3e7a2e]" : "text-[#4d4c48] hover:bg-[#fafaf8]")}>
                    <img src={country.image} alt="" width={40} height={28} className="size-4 shrink-0 rounded-full object-cover" />
                    <span className="truncate">{country.name}</span>
                    <span className="ml-auto flex items-center gap-2">
                      {!isPublished && <span className="text-[10px] font-semibold uppercase text-[#b0ada6]">{locale === "ko" ? "준비 중" : "Soon"}</span>}
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

export function ProgramsHeader({ filters }: { filters: ProgramSearchFilters }) {
  const locale = useRouteLocale()
  const replace = useProgramNavigation()
  const { setSelectedCountry } = useSelectedCountry()
  const [query, setQuery] = useState(filters.q)
  const searchableCountry = PUBLISHED_PROGRAM_COUNTRIES.has(filters.country)

  useEffect(() => setQuery(filters.q), [filters.q])
  useEffect(() => {
    const country = LAUNCH_COUNTRIES.find((item) => item.code === filters.country) ?? LAUNCH_COUNTRIES[0]
    setSelectedCountry({ code: country.code, name: country.name, currency: country.currency })
  }, [filters.country, setSelectedCountry])

  function pickCountry(countryCode: string) {
    const country = LAUNCH_COUNTRIES.find((item) => item.code === countryCode)
    if (country) setSelectedCountry({ code: country.code, name: country.name, currency: country.currency })
    replace({ country: countryCode, level: null, field: null, city: null, state: null, province: null, career: null, institution: null, pgwp: null, duration: null, fee: null, source: null, sort: null })
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    replace({ q: query.trim() || null })
  }

  const placeholder = locale === "ko"
    ? filters.country === "CA" ? "과정·학교·도시로 검색하세요. 예: 간호학, 토론토" : filters.country === "NZ" ? "뉴질랜드 과정명 또는 대학명으로 검색하세요" : "과정명 또는 학교명으로 검색하세요"
    : filters.country === "CA" ? "Search programs, institutions or cities…" : filters.country === "UK" ? "Search UK programmes or institutions…" : filters.country === "NZ" ? "Search New Zealand programmes or universities…" : filters.country === "NL" ? "Search Netherlands programmes or institutions…" : "Search programs, e.g. Nursing or Data Science…"

  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">{locale === "ko" ? "탐색" : "Explore"}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-3xl">{locale === "ko" ? "과정" : "Programs"}</h1>
        <ProgramCountryPicker countryCode={filters.country} onPick={pickCountry} />
      </div>

      {searchableCountry && (
        <form onSubmit={submitSearch} className="mt-6 max-w-3xl">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#a3a19b]" />
            <input type="search" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder={placeholder} aria-label={locale === "ko" ? "과정 검색" : "Search programs"} className="h-[52px] w-full rounded-xl border border-[#deddd8] bg-white pl-11 pr-24 text-[14px] text-[#1b1b1b] outline-none transition placeholder:text-[#aaa8a2] focus:border-[#3e7a2e] focus:ring-2 focus:ring-[#3e7a2e]/10" />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#3e7a2e] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#326625]">{locale === "ko" ? "검색" : "Search"}</button>
          </label>
        </form>
      )}

      {filters.country === "AU" && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {PROGRAM_LEVELS.map((level) => (
            <button key={level.value} type="button" onClick={() => replace({ level: level.value })} className={cn("shrink-0 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium transition", filters.level === level.value ? "border-[#3e7a2e] bg-[#3e7a2e] text-white" : "border-[#dfded9] bg-white text-[#686660] hover:border-[#3e7a2e]/45 hover:text-[#3e7a2e]")}>{locale === "ko" ? level.labelKo : level.label}</button>
          ))}
        </div>
      )}
    </>
  )
}
