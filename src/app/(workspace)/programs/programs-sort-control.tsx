"use client"

import type { ChangeEvent } from "react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { PROGRAM_SORTS, type ProgramSearchFilters, type ProgramSort } from "@/lib/programs/program-search"
import { useProgramNavigation } from "./programs-navigation"

export function ProgramsSortControl({
  filters,
  total,
  availableSorts,
}: {
  filters: ProgramSearchFilters
  total: number
  availableSorts?: readonly ProgramSort[]
}) {
  const locale = useRouteLocale()
  const replace = useProgramNavigation()
  const sorts = availableSorts
    ? PROGRAM_SORTS.filter((sort) => availableSorts.includes(sort.value))
    : PROGRAM_SORTS

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-[12.5px] font-medium text-[#8f8c85]">
        {new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-AU").format(total)}{" "}
        {locale === "ko" ? "개 과정" : total === 1 ? "program" : "programs"}
      </p>
      <label className="flex items-center gap-2 text-[11.5px] font-medium text-[#8f8c85]">
        {locale === "ko" ? "정렬" : "Sort by"}
        <select value={filters.sort} onChange={(event: ChangeEvent<HTMLSelectElement>) => replace({ sort: event.target.value })} className="h-9 rounded-lg border border-[#deddd8] bg-white px-3 text-[12px] font-medium text-[#4d4c48] outline-none focus:border-brand focus:ring-2 focus:ring-brand/10">
          {sorts.map((sort) => <option key={sort.value} value={sort.value}>{locale === "ko" ? sort.labelKo : sort.label}</option>)}
        </select>
      </label>
    </div>
  )
}
