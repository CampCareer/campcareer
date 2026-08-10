"use client"

import type { ReactNode } from "react"
import { BriefcaseBusiness, Check, ChevronDown, MapPin, RotateCcw, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { CANONICAL_CAREERS } from "@/data/career-comparison-catalog"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import {
  CA_PROGRAM_CITIES,
  CA_PROGRAM_PGWP_STATES,
  CA_PROGRAM_PROVINCES,
  type ProgramSearchFilters,
} from "@/lib/programs/program-search"
import { cn } from "@/lib/utils"
import { useProgramNavigation } from "./programs-navigation"

function FilterSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[#ecebe7] py-5 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-[#4d4c48]">
        {icon}
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em]">{title}</h3>
      </div>
      <div className="mt-3 space-y-1">{children}</div>
    </section>
  )
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] transition",
        active
          ? "bg-[#edf5ea] font-semibold text-[#3e7a2e]"
          : "text-[#6f6d68] hover:bg-[#f7f7f5] hover:text-[#1b1b1b]",
      )}
    >
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded border",
          active ? "border-[#3e7a2e] bg-[#3e7a2e] text-white" : "border-[#d9d8d3] bg-white",
        )}
      >
        {active && <Check className="size-3" />}
      </span>
      <span>{label}</span>
    </button>
  )
}

function FiltersContent({ filters }: { filters: ProgramSearchFilters }) {
  const locale = useRouteLocale()
  const replace = useProgramNavigation()
  const clear = () =>
    replace({
      q: null,
      city: null,
      province: null,
      career: null,
      institution: null,
      pgwp: null,
      source: null,
      duration: null,
      sort: null,
    })

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#ecebe7] pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-[#3e7a2e]" />
          <h2 className="text-[14px] font-semibold text-[#1b1b1b]">
            {locale === "ko" ? "캐나다 필터" : "Canada filters"}
          </h2>
        </div>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a8882] transition hover:text-[#3e7a2e]"
        >
          <RotateCcw className="size-3" />
          {locale === "ko" ? "초기화" : "Clear"}
        </button>
      </div>

      <FilterSection
        icon={<BriefcaseBusiness className="size-3.5 text-[#3e7a2e]" />}
        title={locale === "ko" ? "관련 직종" : "Target career"}
      >
        <select
          value={filters.career}
          onChange={(event) => replace({ career: event.target.value })}
          className="h-10 w-full rounded-lg border border-[#deddd8] bg-white px-3 text-[12px] font-medium text-[#4d4c48] outline-none focus:border-[#3e7a2e]"
          aria-label={locale === "ko" ? "관련 직종 선택" : "Select target career"}
        >
          <option value="all">{locale === "ko" ? "80개 직종 전체" : "All 80 target careers"}</option>
          {CANONICAL_CAREERS.map((career) => (
            <option key={career.id} value={career.id}>
              {locale === "ko" ? career.labelKo : career.label}
            </option>
          ))}
        </select>
        <p className="px-1 pt-2 text-[10px] leading-4 text-[#9b9891]">
          {locale === "ko"
            ? "CampCareer가 교육 경로로 검토해 공개한 직종 연결만 포함합니다."
            : "Only career-to-program relationships reviewed for CampCareer publication are included."}
        </p>
      </FilterSection>

      <FilterSection
        icon={<MapPin className="size-3.5 text-[#2563eb]" />}
        title={locale === "ko" ? "프로그램 도시" : "Program city"}
      >
        <FilterButton
          active={filters.city === "all"}
          label={locale === "ko" ? "전체 프로그램 도시" : "All program cities"}
          onClick={() => replace({ city: null })}
        />
        {CA_PROGRAM_CITIES.map((city) => (
          <FilterButton
            key={city.value}
            active={filters.city === city.value}
            label={`${locale === "ko" ? city.labelKo : city.label} · ${city.province}`}
            onClick={() => replace({ city: city.value })}
          />
        ))}
        <p className="px-2.5 pt-2 text-[10px] leading-4 text-[#9b9891]">
          {locale === "ko"
            ? "공개 프로그램 기록의 도시 기준입니다. City profile 링크는 별도 검증된 도시에만 표시됩니다."
            : "Cities come from published program records. City profile links appear only where a separate city profile has been verified."}
        </p>
      </FilterSection>

      <FilterSection
        icon={<MapPin className="size-3.5 text-[#2563eb]" />}
        title={locale === "ko" ? "주·준주" : "Province or territory"}
      >
        <FilterButton
          active={filters.province === "all"}
          label={locale === "ko" ? "캐나다 전체" : "All Canada"}
          onClick={() => replace({ province: null })}
        />
        {CA_PROGRAM_PROVINCES.map((province) => (
          <FilterButton
            key={province.value}
            active={filters.province === province.value}
            label={`${province.value} · ${locale === "ko" ? province.labelKo : province.label}`}
            onClick={() => replace({ province: province.value })}
          />
        ))}
      </FilterSection>

      <FilterSection
        icon={<ShieldCheck className="size-3.5 text-[#8a8882]" />}
        title="PGWP"
      >
        {CA_PROGRAM_PGWP_STATES.map((item) => (
          <FilterButton
            key={item.value}
            active={filters.pgwp === item.value}
            label={locale === "ko" ? item.labelKo : item.label}
            onClick={() => replace({ pgwp: item.value === "all" ? null : item.value })}
          />
        ))}
        <p className="px-2.5 pt-2 text-[10px] leading-4 text-[#9b9891]">
          {locale === "ko"
            ? "미확인은 불가를 뜻하지 않습니다. 공식 근거가 충분하지 않으면 미확인으로 표시합니다."
            : "Not confirmed does not mean ineligible. We show not confirmed when official evidence is insufficient."}
        </p>
      </FilterSection>

      <FilterSection
        icon={<ShieldCheck className="size-3.5 text-[#8a8882]" />}
        title={locale === "ko" ? "출처 근거" : "Source evidence"}
      >
        <FilterButton
          active={filters.source === "all"}
          label={locale === "ko" ? "검토 완료 프로그램 전체" : "All reviewed programs"}
          onClick={() => replace({ source: null })}
        />
        <FilterButton
          active={filters.source === "verified"}
          label={locale === "ko" ? "공식 프로그램 페이지 있음" : "Official program page verified"}
          onClick={() => replace({ source: "verified" })}
        />
      </FilterSection>
    </>
  )
}

export function CaProgramsSidebar({ filters }: { filters: ProgramSearchFilters }) {
  const locale = useRouteLocale()

  return (
    <>
      <details className="rounded-xl border border-[#e7e6e3] bg-white p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-semibold text-[#1b1b1b]">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-[#3e7a2e]" />
            {locale === "ko" ? "필터 열기" : "Open filters"}
          </span>
          <ChevronDown className="size-4 text-[#8a8882]" />
        </summary>
        <div className="mt-5">
          <FiltersContent filters={filters} />
        </div>
      </details>
      <aside className="hidden self-start rounded-xl border border-[#e7e6e3] bg-white p-4 lg:sticky lg:top-20 lg:block">
        <FiltersContent filters={filters} />
      </aside>
    </>
  )
}
