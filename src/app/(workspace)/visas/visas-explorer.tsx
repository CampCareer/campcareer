"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarRange, ChevronRight, Clock, FileBadge2, TrendingUp } from "lucide-react"
import { VISA_KINDS, type VisaEntry } from "@/lib/workspace/visa-catalog"
import { getVisaDetail } from "@/lib/workspace/visa-detail-resolver"
import { visaCanonicalPath } from "@/lib/workspace/visa-routes"
import { getCountryExplorer } from "@/lib/workspace/country-explorer"
import { CategorySearch } from "@/components/workspace/category-search"
import { CountryPill } from "@/components/workspace/country-pill"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { countryDisplayName, localizePath, type Locale } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { VisaDetailPanel } from "./visa-detail-panel"
import { cn } from "@/lib/utils"

const KIND_BADGE: Record<string, string> = {
  Study: "bg-[#eef3fb] text-[#3a5c9a]", Work: "bg-[#f0f5ee] text-[#4a7a33]", "Working holiday": "bg-[#faf3ea] text-[#a0672a]",
  Skilled: "bg-[#f3f0fa] text-[#6a4f9a]", Family: "bg-[#fdf0f0] text-[#a05555]", Temporary: "bg-[#f4f0ee] text-[#8a5a4a]",
}

function kindLabel(locale: Locale, kind: string) {
  if (locale !== "ko") return kind
  return ({ Study: "학업", Work: "취업", "Working holiday": "워킹홀리데이", Skilled: "기술", Family: "가족", Temporary: "임시" } as Record<string, string>)[kind] ?? kind
}

export function VisasExplorer({ initialQuery, initialCountry, initialVisaName, catalog }: { initialQuery: string; initialCountry: string; initialVisaName?: string; catalog: readonly VisaEntry[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useRouteLocale()
  const ko = locale === "ko"
  const { selectedCountry } = useSelectedCountry()
  const [query, setQuery] = useState(initialQuery)
  const [kind, setKind] = useState<string>("all")
  const [country, setCountry] = useState<string>(initialCountry || "all")
  const [selectedKey, setSelectedKey] = useState<string | null>(() => initialCountry && initialVisaName ? `${initialCountry}:${initialVisaName}` : null)

  const countries = useMemo(() => {
    const byCode = new Map<string, string>()
    for (const visa of catalog) if (!byCode.has(visa.countryCode)) byCode.set(visa.countryCode, visa.country)
    return [...byCode.entries()].map(([code, name]) => ({ code, name })).sort((a, b) => countryDisplayName(locale, a.code, a.name).localeCompare(countryDisplayName(locale, b.code, b.name), locale === "ko" ? "ko" : "en"))
  }, [catalog, locale])

  useEffect(() => {
    const validUrlCountry = countries.some((item) => item.code === initialCountry) ? initialCountry : null
    if (validUrlCountry) { setCountry(validUrlCountry); return }
    if (selectedCountry && countries.some((item) => item.code === selectedCountry.code)) setCountry(selectedCountry.code)
  }, [initialCountry, selectedCountry, countries])

  useEffect(() => { if (initialCountry && initialVisaName) setSelectedKey(`${initialCountry}:${initialVisaName}`) }, [initialCountry, initialVisaName])

  function updateCountry(code: string | null) {
    const nextCountry = code ?? "all"
    setCountry(nextCountry); setSelectedKey(null)
    const params = new URLSearchParams(searchParams.toString())
    if (nextCountry === "all") params.delete("country"); else params.set("country", nextCountry)
    const nextQuery = params.toString()
    router.replace(`${localizePath("/visas", locale)}${nextQuery ? `?${nextQuery}` : ""}`, { scroll: false })
  }

  function selectVisa(visa: VisaEntry) {
    setSelectedKey(`${visa.countryCode}:${visa.name}`)
    router.replace(localizePath(visaCanonicalPath(visa.countryCode, visa.name), locale), { scroll: false })
  }

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    return catalog.filter((visa) => {
      if (kind !== "all" && visa.kind !== kind) return false
      if (country !== "all" && visa.countryCode !== country) return false
      if (!q) return true
      const localCountry = countryDisplayName(locale, visa.countryCode, visa.country).toLocaleLowerCase()
      return visa.name.toLocaleLowerCase().includes(q) || visa.country.toLocaleLowerCase().includes(q) || localCountry.includes(q) || visa.note.toLocaleLowerCase().includes(q) || visa.kind.toLocaleLowerCase().includes(q) || kindLabel(locale, visa.kind).toLocaleLowerCase().includes(q)
    })
  }, [catalog, query, kind, country, locale])

  const activeVisa = useMemo(() => {
    if (selectedKey) { const match = results.find((visa) => `${visa.countryCode}:${visa.name}` === selectedKey); if (match) return match }
    return results[0] ?? null
  }, [results, selectedKey])
  const activeDetail = activeVisa ? getVisaDetail(activeVisa.countryCode, activeVisa.name) : null
  const activeCities = activeVisa ? getCountryExplorer(activeVisa.countryCode)?.regions.flatMap((region) => region.cities) : undefined

  return <>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6d4fc4]">{ko ? "탐색" : "Explore"}</p><div className="mt-1.5 flex flex-wrap items-center gap-3"><h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1b1b1b] sm:text-3xl">{ko ? "비자" : "Visas"}</h1><CountryPill onChange={updateCountry} /></div></div></div>

    <div className="mt-6 lg:max-w-xl"><CategorySearch value={query} onChange={setQuery} placeholder={ko ? "비자 검색, 예: 워킹홀리데이 또는 학생 비자…" : "Search visas, e.g. Working Holiday or Student…"} /></div>

    <div className="mt-5 flex flex-wrap gap-2">
      <button type="button" onClick={() => setKind("all")} className={cn("rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition", kind === "all" ? "border-[#6d4fc4] bg-[#6d4fc4] text-white" : "border-[#e0dfdb] bg-white text-[#6f6d68] hover:border-[#6d4fc4]/50 hover:text-[#6d4fc4]")}>{ko ? "전체" : "All"}</button>
      {VISA_KINDS.map((visaKind) => <button key={visaKind} type="button" onClick={() => setKind(visaKind)} className={cn("rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition", kind === visaKind ? "border-[#6d4fc4] bg-[#6d4fc4] text-white" : "border-[#e0dfdb] bg-white text-[#6f6d68] hover:border-[#6d4fc4]/50 hover:text-[#6d4fc4]")}>{kindLabel(locale, visaKind)}</button>)}
    </div>

    <div className="mt-6 flex items-center justify-between"><p className="text-[12.5px] font-medium text-[#a3a19b]">{ko ? `비자 ${results.length}개` : `${results.length} visas`}</p></div>

    {results.length === 0 ? <div className="mt-4 flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-[#e7e6e3] bg-white/50 text-center"><FileBadge2 className="size-6 text-[#c4c2bc]" /><p className="mt-3 text-[13.5px] font-medium text-[#6f6d68]">{ko ? `“${query}”와 일치하는 비자가 없어요.` : `No visas match “${query}”.`}</p></div> :
    <div className="mt-3 grid gap-4 lg:grid-cols-5">
      <div className="flex min-w-0 flex-col gap-2 lg:col-span-2">
        {results.map((visa) => {
          const key = `${visa.countryCode}:${visa.name}`
          const isActive = activeVisa !== null && key === `${activeVisa.countryCode}:${activeVisa.name}`
          const detail = getVisaDetail(visa.countryCode, visa.name)
          return <button key={key} type="button" onClick={() => selectVisa(visa)} className={cn("rounded-xl border bg-white p-4 text-left transition", isActive ? "border-[#6d4fc4]/70 bg-[#faf9ff] ring-1 ring-[#6d4fc4]/30" : "border-[#e7e6e3] hover:border-[#c9c3e8] hover:bg-[#faf9ff]")}>
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-[#1b1b1b]">{visa.name}</p><p className="mt-0.5 text-[12px] text-[#a3a19b]">{countryDisplayName(locale, visa.countryCode, visa.country)}</p></div><span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide", KIND_BADGE[visa.kind] ?? KIND_BADGE.Temporary)}>{kindLabel(locale, visa.kind)}</span></div>
            <p className="mt-2 line-clamp-2 text-[12.5px] leading-5 text-[#6f6d68]">{visa.note}</p>
            <div className="mt-3 flex flex-wrap gap-1.5"><span className="inline-flex items-center gap-1 rounded-md border border-[#e7e6e3] bg-white px-2 py-0.5 text-[11px] font-medium text-[#4d4c48]"><Clock className="size-3 text-[#a3a19b]" />{detail?.processingTime ?? "—"}</span><span className="inline-flex items-center gap-1 rounded-md border border-[#e7e6e3] bg-white px-2 py-0.5 text-[11px] font-medium text-[#4d4c48]"><CalendarRange className="size-3 text-[#a3a19b]" />{detail?.duration ?? "—"}</span><span className="inline-flex items-center gap-1 rounded-md border border-[#e7e6e3] bg-white px-2 py-0.5 text-[11px] font-medium text-[#4d4c48]"><TrendingUp className="size-3 text-[#a3a19b]" />{detail?.successRate ?? "—"}</span></div>
            <span className={cn("mt-3 inline-flex items-center gap-1 text-[12px] font-semibold transition", isActive ? "text-[#6d4fc4]" : "text-[#1b1b1b]")}>{ko ? "상세 보기" : "View Details"} <ChevronRight className="size-3.5" /></span>
          </button>
        })}
      </div>
      <div className="min-w-0 lg:col-span-3">{activeVisa && <VisaDetailPanel visa={activeVisa} detail={activeDetail} cities={activeCities} locale={locale} />}</div>
    </div>}
  </>
}
