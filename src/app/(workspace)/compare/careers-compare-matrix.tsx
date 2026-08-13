"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Plus, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  appendCareer,
  buildCareerCompareHref,
  getCareerCompareOptions,
  getCareerSelectionStatusMessage,
  parseCareerComparisonState,
  removeCareerAtIndex,
  replaceCareerAtIndex,
  type CareerComparisonState,
} from "@/lib/career-comparison"
import {
  AU_CAREER_COMPARE_CITIES,
  CAREER_COMPARE_MAX_CAREERS,
  CAREER_COMPARE_MISSING_VALUE,
  type AustraliaCareerComparison,
  type CareerCompareId,
} from "@/data/career-comparison/australia"
import {
  getCareerComparisonRows,
  type CareerComparisonDisplayValue,
  type CareerComparisonFieldKey,
  type CareerComparisonRow,
} from "@/data/career-comparison/rows"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

type CareerDisplaySection = {
  title: string
  rows: readonly CareerComparisonRow[]
}

const ROW_LABEL_KO: Record<CareerComparisonFieldKey, string> = {
  typicalEducationRoute: "일반적인 교육 경로",
  typicalEntryQualification: "일반적인 입학 자격",
  studyDuration: "학업 기간",
  qualificationOutcome: "취득 자격",
  registrationRequirement: "전문직 등록",
  registrationAuthority: "등록 기관",
  annualTuition: "연간 유학생 학비",
  estimatedTotalTuition: "예상 총 학비",
  mandatoryStudyCosts: "필수 학업 비용",
  startingIncome: "초기 소득",
  typicalEarnings: "일반적인 소득",
  incomeBasis: "소득 기준",
  employmentOutlook: "고용 전망",
  shortageStatus: "인력 부족·수요 상태",
  geographicScope: "지역 범위",
  timeToProfessionalEntry: "전문직 진입까지 기간",
  registrationOrOnboardingTime: "등록·온보딩 기간",
  officialSources: "공식 출처",
  reviewed: "검토일",
}

function careerDisplayLabel(locale: Locale, career: AustraliaCareerComparison | { id: CareerCompareId; label: string }) {
  if (locale !== "ko") return career.label
  return CANONICAL_CAREER_BY_ID.get(career.id)?.labelKo ?? career.label
}

function careerSelectionStatus(locale: Locale, count: number) {
  if (locale !== "ko") return getCareerSelectionStatusMessage(count)
  return count === 0 ? "비교할 직업을 2개 이상 선택해 주세요." : "비교하려면 직업을 하나 더 선택해 주세요."
}

function rowLabel(locale: Locale, row: CareerComparisonRow) {
  return locale === "ko" ? ROW_LABEL_KO[row.key] : row.label
}

export default function CareersCompareMatrix() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useRouteLocale()
  const comparison = parseCareerComparisonState(searchParams)
  const [thirdOpen, setThirdOpen] = useState(comparison.careerIds.length >= CAREER_COMPARE_MAX_CAREERS)
  const [chooserSlot, setChooserSlot] = useState<number | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (comparison.careerIds.length >= CAREER_COMPARE_MAX_CAREERS) setThirdOpen(true)
    if (comparison.careerIds.length < 2) setThirdOpen(false)
  }, [comparison.careerIds.length])

  const visibleSlotCount = comparison.careerIds.length >= CAREER_COMPARE_MAX_CAREERS || thirdOpen ? CAREER_COMPARE_MAX_CAREERS : 2
  const slots = Array.from({ length: visibleSlotCount }, (_, index) => index)
  const canCompare = comparison.careers.length >= 2
  const showAdd = comparison.careerIds.length === 2 && !thirdOpen
  const sections = buildCareerSections(comparison.careers, locale)

  const updateUrl = (citySlug: string | null, careerIds: readonly CareerCompareId[]) => {
    router.replace(localizePath(buildCareerCompareHref(citySlug, careerIds), locale), { scroll: false })
  }

  const closeChooser = () => {
    const slot = chooserSlot
    setChooserSlot(null)
    if (slot !== null) window.requestAnimationFrame(() => triggerRefs.current[slot]?.focus())
  }

  const chooseCareer = (slot: number, careerId: CareerCompareId) => {
    const nextIds = slot < comparison.careerIds.length
      ? replaceCareerAtIndex(comparison.careerIds, slot, careerId)
      : appendCareer(comparison.careerIds, careerId)
    updateUrl(comparison.citySlug, nextIds)
    closeChooser()
  }

  const removeCareer = (slot: number) => {
    const nextIds = removeCareerAtIndex(comparison.careerIds, slot)
    if (nextIds.length < CAREER_COMPARE_MAX_CAREERS) setThirdOpen(false)
    updateUrl(comparison.citySlug, nextIds)
  }

  const cancelThirdCareer = () => {
    setThirdOpen(false)
    if (chooserSlot === 2) closeChooser()
  }

  return (
    <section className="mt-1" aria-label={locale === "ko" ? "직업 비교" : "Career comparison"}>
      <div className="mb-3 flex justify-end">
        <CareerLocationControl locale={locale} citySlug={comparison.citySlug} onChange={(citySlug) => updateUrl(citySlug, comparison.careerIds)} />
      </div>

      {!canCompare ? (
        <p className="mb-3 text-sm font-medium text-[#5f5d57]" role="status">{careerSelectionStatus(locale, comparison.careers.length)}</p>
      ) : null}

      <DesktopMatrix
        locale={locale}
        comparison={comparison}
        sections={sections}
        slots={slots}
        chooserSlot={chooserSlot}
        showAdd={showAdd}
        triggerRefs={triggerRefs}
        onOpenChooser={setChooserSlot}
        onRemove={removeCareer}
        onAddThird={() => setThirdOpen(true)}
        onCancelThird={cancelThirdCareer}
      />

      <MobileMatrix
        locale={locale}
        comparison={comparison}
        sections={sections}
        slots={slots}
        chooserSlot={chooserSlot}
        showAdd={showAdd}
        triggerRefs={triggerRefs}
        onOpenChooser={setChooserSlot}
        onRemove={removeCareer}
        onAddThird={() => setThirdOpen(true)}
        onCancelThird={cancelThirdCareer}
      />

      {chooserSlot !== null ? (
        <CareerChooser
          locale={locale}
          selectedIds={comparison.careerIds}
          currentId={comparison.careerIds[chooserSlot]}
          onChoose={(careerId) => chooseCareer(chooserSlot, careerId)}
          onClose={closeChooser}
        />
      ) : null}
    </section>
  )
}

function buildCareerSections(careers: readonly AustraliaCareerComparison[], locale: Locale): readonly CareerDisplaySection[] {
  const rows = getCareerComparisonRows(careers)
  const byKey = new Map(rows.map((row) => [row.key, row]))
  const pick = (keys: readonly CareerComparisonFieldKey[]) => keys.flatMap((key) => {
    const row = byKey.get(key)
    return row ? [row] : []
  })

  return [
    {
      title: locale === "ko" ? "핵심 지표" : "Key metrics",
      rows: pick(["studyDuration", "annualTuition", "typicalEarnings", "shortageStatus"]),
    },
    {
      title: locale === "ko" ? "진입 및 요건" : "Entry & requirements",
      rows: pick([
        "typicalEducationRoute",
        "typicalEntryQualification",
        "qualificationOutcome",
        "registrationRequirement",
        "registrationAuthority",
      ]),
    },
    {
      title: locale === "ko" ? "비용" : "Costs",
      rows: pick(["estimatedTotalTuition", "mandatoryStudyCosts"]),
    },
    {
      title: locale === "ko" ? "결과" : "Outcomes",
      rows: pick(["startingIncome", "incomeBasis", "employmentOutlook", "geographicScope"]),
    },
    {
      title: locale === "ko" ? "기타 정보" : "Other details",
      rows: pick(["timeToProfessionalEntry", "registrationOrOnboardingTime", "officialSources", "reviewed"]),
    },
  ]
}

type MatrixProps = {
  locale: Locale
  comparison: CareerComparisonState
  sections: readonly CareerDisplaySection[]
  slots: readonly number[]
  chooserSlot: number | null
  showAdd: boolean
  triggerRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>
  onOpenChooser: (slot: number) => void
  onRemove: (slot: number) => void
  onAddThird: () => void
  onCancelThird: () => void
}

function CareerLocationControl({ locale, citySlug, onChange }: { locale: Locale; citySlug: string | null; onChange: (citySlug: string | null) => void }) {
  const national = locale === "ko" ? "전국" : "National"
  return (
    <label className="relative inline-flex min-h-10 items-center rounded-xl border border-[#deddd9] bg-white transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
      <span className="sr-only">{locale === "ko" ? "직업 비교 지역" : "Career comparison location"}</span>
      <span aria-hidden="true" className="pointer-events-none flex items-center gap-2 px-3 text-sm font-semibold text-[#34332f]">
        {citySlug ? AU_CAREER_COMPARE_CITIES.find((city) => city.citySlug === citySlug)?.cityName ?? national : national}
        <ChevronDown className="size-4 text-[#77746e]" />
      </span>
      <select
        aria-label={locale === "ko" ? "직업 비교 도시 선택" : "Choose a city for career comparison"}
        value={citySlug ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option value="">{national}</option>
        {AU_CAREER_COMPARE_CITIES.map((city) => <option key={city.citySlug} value={city.citySlug}>{city.cityName}</option>)}
      </select>
    </label>
  )
}

function DesktopMatrix({ locale, comparison, sections, slots, chooserSlot, showAdd, triggerRefs, onOpenChooser, onRemove, onAddThird, onCancelThird }: MatrixProps) {
  return (
    <div className="hidden border-y border-[#e7e6e3] bg-white md:block">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="sticky top-14 z-20 w-36 border-b border-[#e7e6e3] bg-white/95 px-4 py-3 backdrop-blur-md xl:w-44">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#77746e]">{locale === "ko" ? "비교" : "Compare"}</span>
                {showAdd ? <AddCareerButton locale={locale} onClick={onAddThird} /> : null}
              </div>
            </th>
            {slots.map((slot) => (
              <CareerColumnHeader
                key={slot}
                locale={locale}
                slot={slot}
                career={comparison.careers[slot] ?? null}
                chooserOpen={chooserSlot === slot}
                triggerRef={(element) => { triggerRefs.current[slot] = element }}
                onOpen={onOpenChooser}
                onRemove={onRemove}
                onCancel={slot === 2 && !comparison.careers[slot] ? onCancelThird : undefined}
              />
            ))}
          </tr>
        </thead>
        {comparison.careers.length >= 2 ? (
          <tbody>
            {sections.map((section) => (
              <CareerSectionRows key={section.title} locale={locale} section={section} slots={slots} careers={comparison.careers} />
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  )
}

function CareerSectionRows({ locale, section, slots, careers }: { locale: Locale; section: CareerDisplaySection; slots: readonly number[]; careers: readonly AustraliaCareerComparison[] }) {
  return (
    <>
      <tr>
        <th colSpan={slots.length + 1} className="border-b border-[#e7e6e3] bg-[#f7f7f5] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section.title}</th>
      </tr>
      {section.rows.map((row) => (
        <tr key={row.key}>
          <th scope="row" className="border-b border-[#ecebe7] bg-white px-4 py-4 align-top text-sm font-medium text-[#5f5d57]">{rowLabel(locale, row)}</th>
          {slots.map((slot) => (
            <td key={slot} className="border-b border-l border-[#ecebe7] px-5 py-4 align-top">
              {careers[slot] ? <CareerValue value={row.values[slot] ?? { primary: CAREER_COMPARE_MISSING_VALUE }} /> : null}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function MobileMatrix({ locale, comparison, sections, slots, chooserSlot, showAdd, triggerRefs, onOpenChooser, onRemove, onAddThird, onCancelThird }: MatrixProps) {
  return (
    <div className="md:hidden">
      <div className="sticky top-14 z-20 -mx-1 border-y border-[#e7e6e3] bg-white/95 px-1 py-2 backdrop-blur-md" aria-label={locale === "ko" ? "직업 비교 열" : "Career comparison columns"}>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <CareerMobileHeader
              key={slot}
              locale={locale}
              slot={slot}
              career={comparison.careers[slot] ?? null}
              chooserOpen={chooserSlot === slot}
              triggerRef={(element) => { triggerRefs.current[slot] = element }}
              onOpen={onOpenChooser}
              onRemove={onRemove}
              onCancel={slot === 2 && !comparison.careers[slot] ? onCancelThird : undefined}
              className={slot === 2 ? "col-span-2" : ""}
            />
          ))}
        </div>
        {showAdd ? (
          <button type="button" onClick={onAddThird} className="mt-2 inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
            <Plus aria-hidden="true" className="mr-1.5 size-4" /> {locale === "ko" ? "직업 추가" : "Add career"}
          </button>
        ) : null}
      </div>

      {comparison.careers.length >= 2 ? (
        <div className="mt-5 space-y-7">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section.title}</h3>
              <div className="mt-2 divide-y divide-[#ecebe7] border-y border-[#ecebe7]">
                {section.rows.map((row) => (
                  <div key={row.key} className="py-4">
                    <p className="text-sm font-medium text-[#5f5d57]">{rowLabel(locale, row)}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {comparison.careers.map((career, index) => (
                        <div key={`${row.key}-${career.id}`} className="min-w-0 rounded-xl bg-[#fafaf9] p-3">
                          <p className="truncate text-[11px] font-semibold text-[#77746e]">{careerDisplayLabel(locale, career)}</p>
                          <div className="mt-1"><CareerValue value={row.values[index] ?? { primary: CAREER_COMPARE_MISSING_VALUE }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function CareerColumnHeader({ locale, slot, career, chooserOpen, triggerRef, onOpen, onRemove, onCancel }: { locale: Locale; slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void }) {
  return (
    <th scope="col" className="sticky top-14 z-20 border-b border-l border-[#e7e6e3] bg-white/95 px-2 py-2 align-top backdrop-blur-md">
      <div className="relative">
        <CareerTrigger locale={locale} slot={slot} career={career} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} />
        {career ? <RemoveCareerButton locale={locale} career={career} onClick={() => onRemove(slot)} /> : null}
        {onCancel ? <CancelCareerButton locale={locale} onClick={onCancel} /> : null}
      </div>
    </th>
  )
}

function CareerMobileHeader({ locale, slot, career, chooserOpen, triggerRef, onOpen, onRemove, onCancel, className }: { locale: Locale; slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void; className?: string }) {
  return (
    <div className={`relative min-w-0 rounded-xl border border-[#e7e6e3] bg-white p-1 ${className ?? ""}`}>
      <CareerTrigger locale={locale} slot={slot} career={career} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} />
      {career ? <RemoveCareerButton locale={locale} career={career} onClick={() => onRemove(slot)} /> : null}
      {onCancel ? <CancelCareerButton locale={locale} onClick={onCancel} /> : null}
    </div>
  )
}

function CareerTrigger({ locale, slot, career, chooserOpen, triggerRef, onOpen }: { locale: Locale; slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void }) {
  const label = career ? careerDisplayLabel(locale, career) : null
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={chooserOpen}
      aria-label={career ? (locale === "ko" ? `${label} 직업 변경` : `Change career from ${career.label}`) : (locale === "ko" ? `직업 ${slot + 1} 선택` : `Select career ${slot + 1}`)}
      onClick={() => onOpen(slot)}
      className="relative min-h-16 w-full rounded-lg px-3 py-2.5 pr-10 text-left hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"
    >
      <span className="block pr-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#77746e]">{locale === "ko" ? `직업 ${slot + 1}` : `Career ${slot + 1}`}</span>
      <span className="mt-1 block break-words pr-5 text-sm font-semibold leading-5 text-[#1b1b1b]">{label ?? (locale === "ko" ? "직업 선택" : "Choose a career")}</span>
      <ChevronDown aria-hidden="true" className="absolute right-3 top-5 size-4 text-[#77746e]" />
    </button>
  )
}

function RemoveCareerButton({ locale, career, onClick }: { locale: Locale; career: AustraliaCareerComparison; onClick: () => void }) {
  const label = careerDisplayLabel(locale, career)
  return (
    <button type="button" onClick={onClick} aria-label={locale === "ko" ? `${label} 비교에서 제거` : `Remove ${career.label} from comparison`} className="absolute right-1 top-1 z-10 inline-flex size-9 items-center justify-center rounded-lg text-[#77746e] hover:bg-[#f0efeb] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
      <X aria-hidden="true" className="size-4" />
    </button>
  )
}

function CancelCareerButton({ locale, onClick }: { locale: Locale; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={locale === "ko" ? "빈 직업 열 취소" : "Cancel empty career column"} className="absolute right-1 top-1 z-10 min-h-9 rounded-lg px-2 text-xs font-semibold text-[#5f5d57] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
      {locale === "ko" ? "취소" : "Cancel"}
    </button>
  )
}

function AddCareerButton({ locale, onClick }: { locale: Locale; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={locale === "ko" ? "세 번째 직업 추가" : "Add a third career"} className="inline-flex size-9 items-center justify-center rounded-lg text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
      <Plus aria-hidden="true" className="size-4" />
    </button>
  )
}

function CareerValue({ value }: { value: CareerComparisonDisplayValue }) {
  const missing = value.primary === CAREER_COMPARE_MISSING_VALUE
  return (
    <div className="min-w-0">
      <p className={`break-words text-sm font-semibold leading-6 ${missing ? "text-[#9a978f]" : "text-[#1b1b1b]"}`}>{missing ? "—" : value.primary}</p>
      {value.secondary ? <p className="mt-0.5 break-words text-xs leading-5 text-[#6f6d68]">{value.secondary}</p> : null}
    </div>
  )
}

function CareerChooser({ locale, selectedIds, currentId, onChoose, onClose }: { locale: Locale; selectedIds: readonly CareerCompareId[]; currentId?: CareerCompareId; onChoose: (careerId: CareerCompareId) => void; onClose: () => void }) {
  const options = getCareerCompareOptions(selectedIds, currentId)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose() }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-labelledby="career-chooser-heading" className="w-full max-w-md rounded-2xl border border-[#e7e6e3] bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="career-chooser-heading" className="text-base font-semibold text-[#1b1b1b]">{locale === "ko" ? "직업 선택" : "Choose a career"}</h2>
            <p className="mt-1 text-sm text-[#6f6d68]">{locale === "ko" ? "이 비교 열에 넣을 직업을 선택하세요." : "Choose a career for this comparison column."}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={locale === "ko" ? "직업 선택 닫기" : "Close career chooser"} className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-[#6f6d68] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {options.map((option) => (
            <button key={option.id} type="button" disabled={option.disabled} onClick={() => onChoose(option.id)} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[#e7e6e3] px-3 text-left text-sm font-semibold text-[#1b1b1b] hover:bg-[#fafaf9] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
              <span>{locale === "ko" ? CANONICAL_CAREER_BY_ID.get(option.id)?.labelKo ?? option.label : option.label}</span>
              {option.disabled ? <span className="ml-3 shrink-0 text-xs font-medium text-[#6f6d68]">{locale === "ko" ? "선택됨" : "Selected"}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
