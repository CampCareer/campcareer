"use client"

import type { ReactNode } from "react"
import { Check, ChevronDown, Clock3, MapPin, RotateCcw, Search, ShieldCheck, SlidersHorizontal, WalletCards } from "lucide-react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import {
  AU_PROGRAM_STATES,
  PROGRAM_DURATIONS,
  PROGRAM_FEES,
  PROGRAM_FIELDS,
  PROGRAM_SOURCES,
  type ProgramSearchFilters,
} from "@/lib/programs/program-search"
import { cn } from "@/lib/utils"
import { useProgramNavigation } from "./programs-navigation"

function FilterSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[#ecebe7] py-5 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-[#4d4c48]">{icon}<h3 className="text-[12px] font-semibold uppercase tracking-[0.06em]">{title}</h3></div>
      <div className="mt-3 space-y-1">{children}</div>
    </section>
  )
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] transition",
      active ? "bg-[#edf5ea] font-semibold text-[#3e7a2e]" : "text-[#6f6d68] hover:bg-[#f7f7f5] hover:text-[#1b1b1b]",
    )}>
      <span className={cn("grid size-4 shrink-0 place-items-center rounded border", active ? "border-[#3e7a2e] bg-[#3e7a2e] text-white" : "border-[#d9d8d3] bg-white")}>
        {active && <Check className="size-3" />}
      </span>
      <span>{label}</span>
    </button>
  )
}

function FiltersContent({ filters }: { filters: ProgramSearchFilters }) {
  const locale = useRouteLocale()
  const replace = useProgramNavigation()
  const clear = () => replace({ q: null, level: null, field: null, state: null, duration: null, fee: null, source: null, sort: null })

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#ecebe7] pb-4">
        <div className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-[#3e7a2e]" /><h2 className="text-[14px] font-semibold text-[#1b1b1b]">{locale === "ko" ? "필터" : "Filters"}</h2></div>
        <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a8882] transition hover:text-[#3e7a2e]"><RotateCcw className="size-3" />{locale === "ko" ? "초기화" : "Clear"}</button>
      </div>

      <FilterSection icon={<Search className="size-3.5 text-[#8a8882]" />} title={locale === "ko" ? "전공 분야" : "Field of study"}>
        <FilterButton active={filters.field === "all"} label={locale === "ko" ? "전체 분야" : "All fields"} onClick={() => replace({ field: null })} />
        <div className="max-h-64 overflow-y-auto pr-1">
          {PROGRAM_FIELDS.map((field) => <FilterButton key={field.value} active={filters.field === field.value} label={locale === "ko" ? field.labelKo : field.label} onClick={() => replace({ field: field.value })} />)}
        </div>
      </FilterSection>

      <FilterSection icon={<MapPin className="size-3.5 text-[#8a8882]" />} title={locale === "ko" ? "주·준주" : "State or territory"}>
        <FilterButton active={filters.state === "all"} label={locale === "ko" ? "호주 전체" : "All Australia"} onClick={() => replace({ state: null })} />
        {AU_PROGRAM_STATES.map((state) => <FilterButton key={state.value} active={filters.state === state.value} label={`${state.value} · ${locale === "ko" ? state.labelKo : state.label}`} onClick={() => replace({ state: state.value })} />)}
      </FilterSection>

      <FilterSection icon={<Clock3 className="size-3.5 text-[#8a8882]" />} title={locale === "ko" ? "과정 기간" : "Duration"}>
        {PROGRAM_DURATIONS.map((item) => <FilterButton key={item.value} active={filters.duration === item.value} label={locale === "ko" ? item.labelKo : item.label} onClick={() => replace({ duration: item.value === "all" ? null : item.value })} />)}
      </FilterSection>

      <FilterSection icon={<WalletCards className="size-3.5 text-[#8a8882]" />} title={locale === "ko" ? "연간 학비" : "Annual tuition"}>
        {PROGRAM_FEES.map((item) => <FilterButton key={item.value} active={filters.fee === item.value} label={locale === "ko" ? item.labelKo : item.label} onClick={() => replace({ fee: item.value === "all" ? null : item.value })} />)}
      </FilterSection>

      <FilterSection icon={<ShieldCheck className="size-3.5 text-[#8a8882]" />} title={locale === "ko" ? "출처 상태" : "Source status"}>
        {PROGRAM_SOURCES.map((item) => <FilterButton key={item.value} active={filters.source === item.value} label={locale === "ko" ? item.labelKo : item.label} onClick={() => replace({ source: item.value === "all" ? null : item.value })} />)}
      </FilterSection>
    </>
  )
}

export function ProgramsSidebar({ filters }: { filters: ProgramSearchFilters }) {
  const locale = useRouteLocale()
  return (
    <>
      <details className="rounded-xl border border-[#e7e6e3] bg-white p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-semibold text-[#1b1b1b]"><span className="inline-flex items-center gap-2"><SlidersHorizontal className="size-4 text-[#3e7a2e]" />{locale === "ko" ? "필터 열기" : "Open filters"}</span><ChevronDown className="size-4 text-[#8a8882]" /></summary>
        <div className="mt-5"><FiltersContent filters={filters} /></div>
      </details>
      <aside className="hidden self-start rounded-xl border border-[#e7e6e3] bg-white p-4 lg:sticky lg:top-20 lg:block"><FiltersContent filters={filters} /></aside>
    </>
  )
}
