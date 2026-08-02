"use client"

import { useRef, useState } from "react"
import { ChevronDown, Plus, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  formatProgramCompareValue,
  type ProgramCompareItem,
} from "@/lib/data-foundation/program-compare-contract"

type Props = {
  availablePrograms: readonly ProgramCompareItem[]
}

function normalizeIds(raw: string | null, available: readonly ProgramCompareItem[]) {
  const allowed = new Set(available.map((program) => program.productProgramId))
  const result: string[] = []
  for (const value of (raw ?? "").split(",")) {
    const id = value.trim()
    if (!id || !allowed.has(id) || result.includes(id)) continue
    result.push(id)
    if (result.length === 3) break
  }
  return result
}

function hrefFor(ids: readonly string[]) {
  const items = ids.length ? `&items=${encodeURIComponent(ids.join(","))}` : ""
  return `/compare?type=program&country=AU&field=nursing${items}`
}

function displayProgramName(program: ProgramCompareItem) {
  return program.programme?.name ?? "Programme data unavailable"
}

function displayInstitution(program: ProgramCompareItem) {
  return program.institution?.name ?? "Institution data unavailable"
}

function displayLocation(program: ProgramCompareItem) {
  const location = program.locations[0]
  if (!location) return "Unavailable"
  return [location.campusName, location.cityName, location.regionName].filter(Boolean).join(", ") || "Unavailable"
}

export default function ProgramsCompareMatrix({ availablePrograms }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedIds = normalizeIds(searchParams.get("items"), availablePrograms)
  const selectedPrograms = selectedIds.map((id) => availablePrograms.find((program) => program.productProgramId === id)).filter((program): program is ProgramCompareItem => Boolean(program))
  const [thirdOpen, setThirdOpen] = useState(selectedIds.length >= 3)
  const [chooserSlot, setChooserSlot] = useState<number | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const slots = Array.from({ length: selectedIds.length >= 3 || thirdOpen ? 3 : 2 }, (_, index) => index)

  function update(ids: readonly string[]) {
    router.replace(hrefFor(ids), { scroll: false })
  }

  function choose(slot: number, id: string) {
    const next = [...selectedIds]
    if (slot < next.length) next[slot] = id
    else next.push(id)
    const unique = next.filter((value, index) => next.indexOf(value) === index).slice(0, 3)
    update(unique)
    setChooserSlot(null)
    window.requestAnimationFrame(() => triggerRefs.current[slot]?.focus())
  }

  function remove(slot: number) {
    update(selectedIds.filter((_, index) => index !== slot))
    if (selectedIds.length <= 3) setThirdOpen(false)
  }

  return (
    <section className="mt-7" aria-labelledby="program-comparison-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="program-comparison-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Comparison</h2>
          <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Select or change programs directly in the comparison.</p>
        </div>
        {selectedPrograms.length >= 2 && <p className="text-sm font-medium text-[#5f5d57]">{selectedPrograms.length} programs</p>}
      </div>

      {selectedPrograms.length < 2 && <p className="mt-4 text-sm font-medium text-[#4a4842]" role="status">Select two programs to start comparing.</p>}

      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-[#e7e6e3] bg-white md:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead className="bg-[#fafaf9]">
            <tr>
              <th scope="col" className="w-40 border-b border-[#e7e6e3] px-4 py-4 font-semibold text-[#4a4842]">Compare</th>
              {slots.map((slot) => <DesktopHeader key={slot} slot={slot} program={selectedPrograms[slot] ?? null} chooserOpen={chooserSlot === slot} triggerRef={(element) => { triggerRefs.current[slot] = element }} onOpen={setChooserSlot} onRemove={remove} onCancel={slot === 2 && !selectedPrograms[slot] ? () => { setThirdOpen(false); setChooserSlot(null) } : undefined} />)}
              {selectedIds.length === 2 && !thirdOpen && <th scope="col" className="w-16 border-b border-l border-[#e7e6e3] px-2 py-3 text-center"><button type="button" aria-label="Add a third program" onClick={() => setThirdOpen(true)} className="inline-flex size-11 items-center justify-center rounded-xl text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><Plus aria-hidden="true" className="size-5" /></button></th>}
            </tr>
          </thead>
          {selectedPrograms.length >= 2 && <tbody>{comparisonRows(selectedPrograms).map((row) => <tr key={row.label} className="border-b border-[#eeeDEa] last:border-b-0"><th scope="row" className="px-4 py-4 align-top text-xs font-semibold uppercase tracking-[0.06em] text-[#6f6d68]">{row.label}</th>{row.values.map((value, index) => <td key={`${row.label}-${index}`} className="border-l border-[#eeeDEa] px-4 py-4 align-top text-[#1b1b1b]">{value}</td>)}{selectedIds.length === 2 && !thirdOpen && <td className="border-l border-[#eeeDEa]" />}</tr>)}</tbody>}
        </table>
      </div>

      <div className="mt-4 space-y-5 md:hidden" aria-label="Program selection and comparison">
        {slots.map((slot) => <div key={slot}><p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#6f6d68]">Program {slot + 1}</p><MobileHeader slot={slot} program={selectedPrograms[slot] ?? null} chooserOpen={chooserSlot === slot} triggerRef={(element) => { triggerRefs.current[slot] = element }} onOpen={setChooserSlot} onRemove={remove} onCancel={slot === 2 && !selectedPrograms[slot] ? () => { setThirdOpen(false); setChooserSlot(null) } : undefined} /></div>)}
        {selectedIds.length === 2 && !thirdOpen && <button type="button" onClick={() => setThirdOpen(true)} className="inline-flex min-h-11 items-center rounded-xl border border-[#d8d6d0] px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><Plus aria-hidden="true" className="mr-1.5 size-4" /> Add program</button>}
        {selectedPrograms.length >= 2 && <div className="space-y-5">{comparisonRows(selectedPrograms).map((row) => <section key={row.label} className="rounded-xl border border-[#e7e6e3] bg-white p-4"><h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6f6d68]">{row.label}</h3><div className="mt-3 space-y-3">{row.values.map((value, index) => <div key={`${row.label}-${index}`} className="border-t border-[#eeeDEa] pt-3 first:border-t-0 first:pt-0"><p className="text-xs text-[#6f6d68]">{displayInstitution(selectedPrograms[index])}</p><p className="mt-1 break-words text-sm font-medium text-[#1b1b1b]">{value}</p></div>)}</div></section>)}</div>}
      </div>

      {chooserSlot !== null && <ProgramChooser slot={chooserSlot} selectedIds={selectedIds} programs={availablePrograms} onChoose={choose} onClose={() => { const slot = chooserSlot; setChooserSlot(null); window.requestAnimationFrame(() => triggerRefs.current[slot]?.focus()) }} />}
      <p className="mt-5 text-xs leading-5 text-[#6f6d68]">Only verified canonical programme fields are shown. Missing values are not replaced with fixture data.</p>
    </section>
  )
}

function comparisonRows(programs: readonly ProgramCompareItem[]) {
  return [
    { label: "Institution", values: programs.map(displayInstitution) },
    { label: "Programme", values: programs.map(displayProgramName) },
    { label: "Qualification", values: programs.map((program) => formatProgramCompareValue(program.qualification)) },
    { label: "Country", values: programs.map((program) => program.countryDisplayName ?? "Unavailable") },
    { label: "Campus / city / region", values: programs.map(displayLocation) },
    { label: "Duration", values: programs.map((program) => formatProgramCompareValue(program.duration)) },
    { label: "International tuition", values: programs.map((program) => formatProgramCompareValue(program.tuition)) },
    { label: "International availability", values: programs.map((program) => formatProgramCompareValue(program.internationalAvailability)) },
    { label: "Reviewed", values: programs.map((program) => program.reviewedAt ?? "Unavailable") },
    { label: "Official source", values: programs.map((program) => program.sources[0] ? <a key={program.productProgramId} className="text-blue-700 underline-offset-2 hover:underline" href={program.sources[0].url} target="_blank" rel="noreferrer">{program.sources[0].title}</a> : "Unavailable") },
  ]
}

function DesktopHeader({ slot, program, chooserOpen, triggerRef, onOpen, onRemove, onCancel }: { slot: number; program: ProgramCompareItem | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void }) {
  return <th scope="col" className="relative border-b border-l border-[#e7e6e3] px-3 py-3 align-top"><ProgramTrigger slot={slot} program={program} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} /><HeaderAction program={program} slot={slot} onRemove={onRemove} onCancel={onCancel} /></th>
}

function MobileHeader({ slot, program, chooserOpen, triggerRef, onOpen, onRemove, onCancel }: { slot: number; program: ProgramCompareItem | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void }) {
  return <div className="relative rounded-xl border border-[#e7e6e3] bg-white p-1.5"><ProgramTrigger slot={slot} program={program} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} /><HeaderAction program={program} slot={slot} onRemove={onRemove} onCancel={onCancel} mobile /></div>
}

function ProgramTrigger({ slot, program, chooserOpen, triggerRef, onOpen }: { slot: number; program: ProgramCompareItem | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void }) {
  return <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={chooserOpen} aria-label={program ? `Change ${displayInstitution(program)} ${displayProgramName(program)}` : `Select program ${slot + 1}`} onClick={() => onOpen(slot)} className="w-full min-h-14 rounded-lg px-3 py-2.5 pr-11 text-left hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><span className="block pr-7 text-xs font-semibold uppercase tracking-[0.08em] text-[#6f6d68]">{program ? displayInstitution(program) : "Select program"}</span><span className="mt-1 block break-words pr-7 text-sm font-semibold leading-5 text-[#1b1b1b]">{program ? displayProgramName(program) : "Choose a programme"}</span><ChevronDown aria-hidden="true" className="absolute right-4 top-5 size-4 text-[#6f6d68]" /></button>
}

function HeaderAction({ program, slot, onRemove, onCancel, mobile = false }: { program: ProgramCompareItem | null; slot: number; onRemove: (slot: number) => void; onCancel?: () => void; mobile?: boolean }) {
  if (onCancel) return <button type="button" onClick={onCancel} aria-label="Cancel third program" className={`absolute ${mobile ? "right-2 top-2" : "right-3 top-3"} inline-flex min-h-9 items-center rounded-lg px-2 text-xs font-semibold text-[#5f5d57] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35`}>Cancel</button>
  if (!program) return null
  return <button type="button" onClick={() => onRemove(slot)} aria-label={`Remove ${displayInstitution(program)} ${displayProgramName(program)} from comparison`} className={`absolute ${mobile ? "right-2 top-2 size-10" : "right-3 top-3 size-8"} inline-flex items-center justify-center rounded-lg text-[#6f6d68] hover:bg-[#f0efeb] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35`}><X aria-hidden="true" className="size-4" /></button>
}

function ProgramChooser({ slot, selectedIds, programs, onChoose, onClose }: { slot: number; selectedIds: readonly string[]; programs: readonly ProgramCompareItem[]; onChoose: (slot: number, id: string) => void; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 p-4 pt-24" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div role="dialog" aria-modal="true" aria-labelledby="program-chooser-heading" className="w-full max-w-lg rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl"><div className="flex items-start justify-between gap-4"><div><h2 id="program-chooser-heading" className="text-base font-semibold text-[#1b1b1b]">Choose a programme</h2><p className="mt-1 text-sm text-[#6f6d68]">Select a verified canonical option for slot {slot + 1}.</p></div><button type="button" onClick={onClose} aria-label="Close programme chooser" className="inline-flex size-10 items-center justify-center rounded-lg text-[#6f6d68] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><X aria-hidden="true" className="size-4" /></button></div><div className="mt-4 space-y-2">{programs.map((program) => { const disabled = selectedIds.includes(program.productProgramId) && selectedIds[slot] !== program.productProgramId; return <button key={program.productProgramId} type="button" disabled={disabled} onClick={() => onChoose(slot, program.productProgramId)} className="w-full rounded-xl border border-[#e7e6e3] px-3 py-3 text-left text-sm hover:bg-[#fafaf9] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><span className="block font-semibold text-[#1b1b1b]">{displayInstitution(program)}</span><span className="mt-1 block text-[#6f6d68]">{displayProgramName(program)}</span>{disabled && <span className="mt-1 block text-xs text-[#6f6d68]">Already selected</span>}</button>})}</div></div></div>
}
