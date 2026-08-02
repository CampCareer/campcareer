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
  getCareerRowsBySection,
  type CareerComparisonDisplayValue,
  type CareerComparisonRow,
} from "@/data/career-comparison/rows"

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
  const sections = getCareerRowsBySection(comparison.careers)

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
    <section className="mt-7" aria-labelledby="career-comparison-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="career-comparison-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Career comparison</h2>
          <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Select or change careers directly in the comparison header.</p>
        </div>
        {canCompare && <p className="text-sm font-medium text-[#5f5d57]">{comparison.careers.length} careers</p>}
      </div>

      <CareerLocationControl citySlug={comparison.citySlug} onChange={(citySlug) => updateUrl(citySlug, comparison.careerIds)} />

      {!canCompare && <p className="mt-4 text-sm font-medium text-[#4a4842]" role="status">{getCareerSelectionStatusMessage(comparison.careers.length)}</p>}

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

      {chooserSlot !== null && (
        <CareerChooser
          selectedIds={comparison.careerIds}
          currentId={comparison.careerIds[chooserSlot]}
          onChoose={(careerId) => chooseCareer(chooserSlot, careerId)}
          onClose={closeChooser}
        />
      )}
    </section>
  )
}

type MatrixProps = {
  comparison: CareerComparisonState
  sections: ReturnType<typeof getCareerRowsBySection>
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
    <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] px-3 py-2.5 sm:px-4" aria-label="Career comparison location">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">Location context</p>
        <p className="mt-0.5 text-sm font-semibold text-[#1b1b1b]">Australia · {citySlug ? AU_CAREER_COMPARE_CITIES.find((city) => city.citySlug === citySlug)?.cityName ?? "National view" : "National view"}</p>
      </div>
      <label className="ml-auto flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4a4842]">
        <span className="sr-only">Choose a city</span>
        <select
          aria-label="Choose a city for career comparison"
          value={citySlug ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          className="min-h-11 rounded-lg border border-[#d8d6d0] bg-white px-3 text-sm font-semibold text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"
        >
          <option value="">National view</option>
          {AU_CAREER_COMPARE_CITIES.map((city) => <option key={city.citySlug} value={city.citySlug}>{city.cityName}</option>)}
        </select>
      </label>
    </div>
  )
}

function DesktopMatrix({ comparison, sections, slots, chooserSlot, showAdd, triggerRefs, onOpenChooser, onRemove, onAddThird, onCancelThird }: MatrixProps) {
  return (
    <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-[#e7e6e3] bg-white md:block">
      <table className="w-full min-w-0 table-fixed border-collapse text-left text-sm">
        <thead className="bg-[#fafaf9]">
          <tr>
            <th scope="col" className="w-48 border-b border-[#e7e6e3] px-4 py-4 font-semibold text-[#4a4842]">Compare</th>
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
            {showAdd && <th scope="col" className="w-16 border-b border-l border-[#e7e6e3] px-2 py-3 text-center"><AddCareerButton onClick={onAddThird} /></th>}
          </tr>
        </thead>
        {comparison.careers.length >= 2 && <tbody>{sections.map((section) => (
          <CareerSectionRows key={section.section} section={section.section} rows={section.rows} slots={slots} careers={comparison.careers} addColumn={showAdd} />
        ))}</tbody>}
      </table>
    </div>
  )
}

function CareerSectionRows({ section, rows, slots, careers, addColumn }: { section: string; rows: readonly CareerComparisonRow[]; slots: readonly number[]; careers: readonly AustraliaCareerComparison[]; addColumn: boolean }) {
  return <>
    <tr><th scope="colgroup" colSpan={slots.length + 1 + (addColumn ? 1 : 0)} className="border-b border-[#e7e6e3] bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section}</th></tr>
    {rows.map((row) => <tr key={row.key}><th scope="row" className="align-top border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 font-medium text-[#4a4842]">{row.label}</th>{slots.map((slot) => <td key={slot} className="align-top border-b border-l border-[#e7e6e3] px-4 py-3">{careers[slot] ? <CareerValue value={row.values[slot] ?? { primary: CAREER_COMPARE_MISSING_VALUE }} /> : null}</td>)}{addColumn && <td className="border-b border-l border-[#e7e6e3]" />}</tr>)}
  </>
}

function MobileMatrix({ comparison, sections, slots, chooserSlot, showAdd, triggerRefs, onOpenChooser, onRemove, onAddThird, onCancelThird }: MatrixProps) {
  return (
    <div className="mt-4 space-y-5 md:hidden">
      <div className="rounded-2xl border border-[#e7e6e3] bg-white p-2" aria-label="Career comparison columns">
        <div className="space-y-2">
          {slots.map((slot) => <CareerMobileHeader key={slot} slot={slot} career={comparison.careers[slot] ?? null} chooserOpen={chooserSlot === slot} triggerRef={(element) => { triggerRefs.current[slot] = element }} onOpen={onOpenChooser} onRemove={onRemove} onCancel={slot === 2 && !comparison.careers[slot] ? onCancelThird : undefined} />)}
        </div>
        {showAdd && <AddCareerButton onClick={onAddThird} mobile />}
      </div>

      {comparison.careers.length >= 2 && <div className="space-y-6">{sections.map((section) => (
        <section key={section.section} aria-labelledby={`mobile-career-section-${section.section.toLowerCase().replaceAll(" ", "-")}`}>
          <h3 id={`mobile-career-section-${section.section.toLowerCase().replaceAll(" ", "-")}`} className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section.section}</h3>
          <div className="mt-2 space-y-4">{section.rows.map((row) => <div key={row.key}><p className="text-sm font-semibold text-[#4a4842]">{row.label}</p><div className="mt-2 space-y-2">{comparison.careers.map((career, index) => <div key={career.id} className="rounded-xl border border-[#e7e6e3] bg-white p-3"><p className="text-xs font-semibold text-[#6f6d68]">{career.label}</p><div className="mt-1"><CareerValue value={row.values[index] ?? { primary: CAREER_COMPARE_MISSING_VALUE }} /></div></div>)}</div></div>)}</div>
        </section>
      ))}</div>}
    </div>
  )
}

function CareerColumnHeader({ slot, career, chooserOpen, triggerRef, onOpen, onRemove, onCancel }: { slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void }) {
  return <th scope="col" className="relative min-w-0 border-b border-l border-[#e7e6e3] px-3 py-3 align-top"><CareerTrigger slot={slot} career={career} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} className="w-full min-w-0 rounded-xl px-2.5 py-2.5 pr-10 text-left hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35" />{career && <RemoveCareerButton career={career} onClick={() => onRemove(slot)} compact />}{onCancel && <CancelCareerButton onClick={onCancel} compact />}</th>
}

function CareerMobileHeader({ slot, career, chooserOpen, triggerRef, onOpen, onRemove, onCancel }: { slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void }) {
  return <div className="relative rounded-xl border border-[#e7e6e3] p-1.5"><CareerTrigger slot={slot} career={career} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} className="min-h-14 w-full rounded-lg px-3 py-2.5 pr-12 text-left hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35" />{career && <RemoveCareerButton career={career} onClick={() => onRemove(slot)} />}{onCancel && <CancelCareerButton onClick={onCancel} />}</div>
}

function CareerTrigger({ slot, career, chooserOpen, triggerRef, onOpen, className }: { slot: number; career: AustraliaCareerComparison | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; className: string }) {
  const label = career ? `Change career from ${career.label}` : `Select career ${slot + 1}`
  return <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={chooserOpen} aria-label={label} onClick={() => onOpen(slot)} className={className}>{career ? <><span className="block break-words pr-7 text-sm font-semibold leading-5 text-[#1b1b1b]">{career.label}</span><span className="mt-1 block text-xs font-medium text-[#6f6d68]">Australia</span></> : <span className="flex min-h-9 items-center justify-between gap-2 text-sm font-semibold text-[#4a4842]">Select career <ChevronDown aria-hidden="true" className="size-4 text-[#6f6d68]" /></span>}{career && <ChevronDown aria-hidden="true" className="absolute right-5 top-6 size-4 text-[#6f6d68]" />}</button>
}

function RemoveCareerButton({ career, onClick, compact = false }: { career: AustraliaCareerComparison; onClick: () => void; compact?: boolean }) {
  return <button type="button" onClick={onClick} aria-label={`Remove ${career.label} from comparison`} className={`absolute ${compact ? "right-3 top-3 size-11" : "right-2 top-2 size-11"} inline-flex items-center justify-center rounded-lg text-[#6f6d68] hover:bg-[#f0efeb] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35`}><X aria-hidden="true" className="size-4" /></button>
}

function CancelCareerButton({ onClick, compact = false }: { onClick: () => void; compact?: boolean }) {
  return <button type="button" onClick={onClick} aria-label="Cancel empty career column" className={`absolute ${compact ? "right-3 top-3" : "right-2 top-2"} inline-flex min-h-11 items-center rounded-lg px-2 text-xs font-semibold text-[#5f5d57] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35`}>Cancel</button>
}

function AddCareerButton({ onClick, mobile = false }: { onClick: () => void; mobile?: boolean }) {
  return <button type="button" onClick={onClick} aria-label="Add another career" className={`${mobile ? "mt-2 w-full justify-center border border-[#d8d6d0]" : "size-11"} inline-flex min-h-11 items-center rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35`}>{mobile && <span className="mr-1.5">Add career</span>}<Plus aria-hidden="true" className="size-5" /></button>
}

function CareerValue({ value }: { value: CareerComparisonDisplayValue }) {
  return <div className="min-w-0"><p className="break-words text-sm font-semibold leading-5 text-[#1b1b1b]">{value.primary}</p>{value.secondary && <p className="mt-0.5 break-words text-xs leading-5 text-[#6f6d68]">{value.secondary}</p>}</div>
}

function CareerChooser({ selectedIds, currentId, onChoose, onClose }: { selectedIds: readonly CareerCompareId[]; currentId?: CareerCompareId; onChoose: (careerId: CareerCompareId) => void; onClose: () => void }) {
  const options = getCareerCompareOptions(selectedIds, currentId)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose() }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="career-chooser-heading" className="w-full max-w-md rounded-2xl border border-[#e7e6e3] bg-white p-4 shadow-xl"><div className="flex items-start justify-between gap-3"><div><h2 id="career-chooser-heading" className="text-base font-semibold text-[#1b1b1b]">Choose a career</h2><p className="mt-1 text-sm text-[#6f6d68]">Choose a different career for this column.</p></div><button type="button" onClick={onClose} aria-label="Close career chooser" className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-[#6f6d68] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><X aria-hidden="true" className="size-5" /></button></div><div className="mt-4 space-y-2">{options.map((option) => <button key={option.id} type="button" disabled={option.disabled} onClick={() => onChoose(option.id)} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[#e7e6e3] px-3 text-left text-sm font-semibold text-[#1b1b1b] hover:bg-[#fafaf9] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><span>{option.label}</span>{option.disabled && <span className="ml-3 shrink-0 text-xs font-medium text-[#6f6d68]">Selected</span>}</button>)}</div></div></div>
}
