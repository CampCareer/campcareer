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

type CareerDisplaySection = {
  title: string
  rows: readonly CareerComparisonRow[]
}

export default function CareersCompareMatrix() {
  const router = useRouter()
  const searchParams = useSearchParams()
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
  const sections = buildCareerSections(comparison.careers)

  const updateUrl = (citySlug: string | null, careerIds: readonly CareerCompareId[]) => {
    router.replace(buildCareerCompareHref(citySlug, careerIds), { scroll: false })
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
    <section className="mt-1" aria-label="Career comparison">
      <div className="mb-3 flex justify-end">
        <CareerLocationControl citySlug={comparison.citySlug} onChange={(citySlug) => updateUrl(citySlug, comparison.careerIds)} />
      </div>

      {!canCompare ? (
        <p className="mb-3 text-sm font-medium text-[#5f5d57]" role="status">{getCareerSelectionStatusMessage(comparison.careers.length)}</p>
      ) : null}

      <DesktopMatrix
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
          selectedIds={comparison.careerIds}
          currentId={comparison.careerIds[chooserSlot]}
          onChoose={(careerId) => chooseCareer(chooserSlot, careerId)}
          onClose={closeChooser}
        />
      ) : null}
    </section>
  )
}

function buildCareerSections(careers: readonly AustraliaCareerComparison[]): readonly CareerDisplaySection[] {
  const rows = getCareerComparisonRows(careers)
  const byKey = new Map(rows.map((row) => [row.key, row]))
  const pick = (keys: readonly CareerComparisonFieldKey[]) => keys.flatMap((key) => {
    const row = byKey.get(key)
    return row ? [row] : []
  })

  return [
    {
      title: "Key metrics",
      rows: pick(["studyDuration", "annualTuition", "typicalEarnings", "shortageStatus"]),
    },
    {
      title: "Entry & requirements",
      rows: pick([
        "typicalEducationRoute",
        "typicalEntryQualification",
        "qualificationOutcome",
        "registrationRequirement",
        "registrationAuthority",
      ]),
    },
    {
      title: "Costs",
      rows: pick(["estimatedTotalTuition", "mandatoryStudyCosts"]),
    },
    {
      title: "Outcomes",
      rows: pick(["startingIncome", "incomeBasis", "employmentOutlook", "geographicScope"]),
    },
    {
      title: "Other details",
      rows: pick(["timeToProfessionalEntry", "registrationOrOnboardingTime", "officialSources", "reviewed"]),
    },
  ]
}

type MatrixProps = {
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

function CareerLocationControl({ citySlug, onChange }: { citySlug: string | null; onChange: (citySlug: string | null) => void }) {
  return (
    <label className="relative inline-flex min-h-10 items-center rounded-xl border border-[#deddd9] bg-white transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
      <span className="sr-only">Career comparison location</span>
      <span aria-hidden="true" className="pointer-events-none flex items-center gap-2 px-3 text-sm font-semibold text-[#34332f]">
        {citySlug ? AU_CAREER_COMPARE_CITIES.find((city) => city.citySlug === citySlug)?.cityName ?? "National" : "National"}
        <ChevronDown className="size-4 text-[#77746e]" />
      </span>
      <select
        aria-label="Choose a city for career comparison"
        value={citySlug ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option value="">National</option>
        {AU_CAREER_COMPARE_CITIES.map((city) => <option key={city.citySlug} value={city.citySlug}>{city.cityName}</option>)}
      </select>
    </label>
  )
}

function DesktopMatrix({ comparison, sections, slots, chooserSlot, showAdd, triggerRefs, onOpenChooser, onRemove, onAddThird, onCancelThird }: MatrixProps) {
  return (
    <div className="hidden border-y border-[#e7e6e3] bg-white md:block">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="sticky top-14 z-20 w-36 border-b border-[#e7e6e3] bg-white/95 px-4 py-3 backdrop-blur-md xl:w-44">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#77746e]">Compare</span>
                {showAdd ? <AddCareerButton onClick={onAddThird} /> : null}
              </div>
            </th>
            {slots.map((slot) => (
              <CareerColumnHeader
                key={slot}
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
              <CareerSectionRows key={section.title} section={section} slots={slots} careers={comparison.careers} />
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  )
}

function CareerSectionRows({ section, slots, careers }: { section: CareerDisplaySection; slots: readonly number[]; careers: readonly AustraliaCareerComparison[] }) {
  return (
    <>
      <tr>
        <th colSpan={slots.length + 1} className="border-b border-[#e7e6e3] bg-[#f7f7f5] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section.title}</th>
      </tr>
      {section.rows.map((row) => (
        <tr key={row.key}>
          <th scope="row" className="border-b border-[#ecebe7] bg-white px-4 py-4 align-top text-sm font-medium text-[#5f5d57]">{row.label}</th>
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

function MobileMatrix({ comparison, sections, slots, chooserSlot, showAdd, triggerRefs, onOpenChooser, onRemove, onAddThird, onCancelThird }: MatrixProps) {
  return (
    <div className="md:hidden">
      <div className="sticky top-14 z-20 -mx-1 border-y border-[#e7e6e3] bg-white/95 px-1 py-2 backdrop-blur-md" aria-label="Career comparison columns">
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <CareerMobileHeader
              key={slot}
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
            <Plus aria-hidden="true" className="mr-1.5 size-4" /> Add career
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
                    <p className="text-sm font-medium text-[#5f5d57]">{row.label}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {comparison.careers.map((career, index) => (
                        <div key={`${row.key}-${career.id}`} className="min-w-0 rounded-xl bg-[#fafaf9] p-3">
                          <p className="truncate text-[11px] font-semibold text-[#77746e]">{career.label}</p>
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

function CareerColumnHeader({ slot, career, chooserOpen, triggerRef, onOpen, onRemove, onCancel }: { slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void }) {
  return (
    <th scope="col" className="sticky top-14 z-20 border-b border-l border-[#e7e6e3] bg-white/95 px-2 py-2 align-top backdrop-blur-md">
      <div className="relative">
        <CareerTrigger slot={slot} career={career} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} />
        {career ? <RemoveCareerButton career={career} onClick={() => onRemove(slot)} /> : null}
        {onCancel ? <CancelCareerButton onClick={onCancel} /> : null}
      </div>
    </th>
  )
}

function CareerMobileHeader({ slot, career, chooserOpen, triggerRef, onOpen, onRemove, onCancel, className }: { slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void; className?: string }) {
  return (
    <div className={`relative min-w-0 rounded-xl border border-[#e7e6e3] bg-white p-1 ${className ?? ""}`}>
      <CareerTrigger slot={slot} career={career} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} />
      {career ? <RemoveCareerButton career={career} onClick={() => onRemove(slot)} /> : null}
      {onCancel ? <CancelCareerButton onClick={onCancel} /> : null}
    </div>
  )
}

function CareerTrigger({ slot, career, chooserOpen, triggerRef, onOpen }: { slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void }) {
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={chooserOpen}
      aria-label={career ? `Change career from ${career.label}` : `Select career ${slot + 1}`}
      onClick={() => onOpen(slot)}
      className="relative min-h-16 w-full rounded-lg px-3 py-2.5 pr-10 text-left hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"
    >
      <span className="block pr-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#77746e]">Career {slot + 1}</span>
      <span className="mt-1 block break-words pr-5 text-sm font-semibold leading-5 text-[#1b1b1b]">{career ? career.label : "Choose a career"}</span>
      <ChevronDown aria-hidden="true" className="absolute right-3 top-5 size-4 text-[#77746e]" />
    </button>
  )
}

function RemoveCareerButton({ career, onClick }: { career: AustraliaCareerComparison; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={`Remove ${career.label} from comparison`} className="absolute right-1 top-1 z-10 inline-flex size-9 items-center justify-center rounded-lg text-[#77746e] hover:bg-[#f0efeb] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
      <X aria-hidden="true" className="size-4" />
    </button>
  )
}

function CancelCareerButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Cancel empty career column" className="absolute right-1 top-1 z-10 min-h-9 rounded-lg px-2 text-xs font-semibold text-[#5f5d57] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
      Cancel
    </button>
  )
}

function AddCareerButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Add a third career" className="inline-flex size-9 items-center justify-center rounded-lg text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
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

function CareerChooser({ selectedIds, currentId, onChoose, onClose }: { selectedIds: readonly CareerCompareId[]; currentId?: CareerCompareId; onChoose: (careerId: CareerCompareId) => void; onClose: () => void }) {
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
            <h2 id="career-chooser-heading" className="text-base font-semibold text-[#1b1b1b]">Choose a career</h2>
            <p className="mt-1 text-sm text-[#6f6d68]">Choose a career for this comparison column.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close career chooser" className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-[#6f6d68] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {options.map((option) => (
            <button key={option.id} type="button" disabled={option.disabled} onClick={() => onChoose(option.id)} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[#e7e6e3] px-3 text-left text-sm font-semibold text-[#1b1b1b] hover:bg-[#fafaf9] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
              <span>{option.label}</span>
              {option.disabled ? <span className="ml-3 shrink-0 text-xs font-medium text-[#6f6d68]">Selected</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
