"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronDown, Plus, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  formatProgramCompareValue,
  type ProgramCompareItem,
} from "@/lib/data-foundation/program-compare-contract"

type Props = {
  availablePrograms: readonly ProgramCompareItem[]
}

type ProgramComparisonRow = {
  key: string
  label: string
  values: readonly ReactNode[]
}

type ProgramComparisonSection = {
  title: string
  rows: readonly ProgramComparisonRow[]
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
  if (!location) return "—"
  return [location.campusName, location.cityName, location.regionName].filter(Boolean).join(", ") || "—"
}

export default function ProgramsCompareMatrix({ availablePrograms }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedIds = normalizeIds(searchParams.get("items"), availablePrograms)
  const selectedPrograms = selectedIds
    .map((id) => availablePrograms.find((program) => program.productProgramId === id))
    .filter((program): program is ProgramCompareItem => Boolean(program))
  const [thirdOpen, setThirdOpen] = useState(selectedIds.length >= 3)
  const [chooserSlot, setChooserSlot] = useState<number | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (selectedIds.length >= 3) setThirdOpen(true)
    if (selectedIds.length < 2) setThirdOpen(false)
  }, [selectedIds.length])

  const slots = Array.from({ length: selectedIds.length >= 3 || thirdOpen ? 3 : 2 }, (_, index) => index)
  const showAdd = selectedIds.length === 2 && !thirdOpen
  const canCompare = selectedPrograms.length >= 2
  const sections = comparisonSections(selectedPrograms)

  function update(ids: readonly string[]) {
    router.replace(hrefFor(ids), { scroll: false })
  }

  function closeChooser() {
    const slot = chooserSlot
    setChooserSlot(null)
    if (slot !== null) window.requestAnimationFrame(() => triggerRefs.current[slot]?.focus())
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
    <section className="mt-1" aria-label="Program comparison">
      {!canCompare ? (
        <p className="mb-3 text-sm font-medium text-[#5f5d57]" role="status">
          {selectedPrograms.length === 1 ? "Select one more program to compare." : "Select two programs to start comparing."}
        </p>
      ) : null}

      <DesktopMatrix
        slots={slots}
        selectedPrograms={selectedPrograms}
        chooserSlot={chooserSlot}
        showAdd={showAdd}
        sections={sections}
        triggerRefs={triggerRefs}
        onOpen={setChooserSlot}
        onRemove={remove}
        onAdd={() => setThirdOpen(true)}
        onCancelThird={() => {
          setThirdOpen(false)
          setChooserSlot(null)
        }}
      />

      <MobileMatrix
        slots={slots}
        selectedPrograms={selectedPrograms}
        chooserSlot={chooserSlot}
        showAdd={showAdd}
        sections={sections}
        triggerRefs={triggerRefs}
        onOpen={setChooserSlot}
        onRemove={remove}
        onAdd={() => setThirdOpen(true)}
        onCancelThird={() => {
          setThirdOpen(false)
          setChooserSlot(null)
        }}
      />

      {chooserSlot !== null ? (
        <ProgramChooser
          slot={chooserSlot}
          selectedIds={selectedIds}
          programs={availablePrograms}
          onChoose={choose}
          onClose={closeChooser}
        />
      ) : null}

      <p className="mt-5 text-xs leading-5 text-[#77746e]">Verified canonical fields only. Missing values are shown as —.</p>
    </section>
  )
}

function comparisonSections(programs: readonly ProgramCompareItem[]): readonly ProgramComparisonSection[] {
  const source = (program: ProgramCompareItem) =>
    program.sources[0] ? (
      <a
        key={program.productProgramId}
        className="font-semibold text-blue-700 underline-offset-2 hover:underline"
        href={program.sources[0].url}
        target="_blank"
        rel="noreferrer"
      >
        {program.sources[0].title}
      </a>
    ) : "—"

  return [
    {
      title: "Key metrics",
      rows: [
        { key: "qualification", label: "Qualification", values: programs.map((program) => formatProgramCompareValue(program.qualification, "—")) },
        { key: "duration", label: "Duration", values: programs.map((program) => formatProgramCompareValue(program.duration, "—")) },
        { key: "tuition", label: "International tuition", values: programs.map((program) => formatProgramCompareValue(program.tuition, "—")) },
        { key: "availability", label: "International availability", values: programs.map((program) => formatProgramCompareValue(program.internationalAvailability, "—")) },
      ],
    },
    {
      title: "Study & location",
      rows: [
        { key: "institution", label: "Institution", values: programs.map(displayInstitution) },
        { key: "program", label: "Programme", values: programs.map(displayProgramName) },
        { key: "country", label: "Country", values: programs.map((program) => program.countryDisplayName ?? "—") },
        { key: "location", label: "Campus / city / region", values: programs.map(displayLocation) },
      ],
    },
    {
      title: "Other details",
      rows: [
        { key: "reviewed", label: "Reviewed", values: programs.map((program) => program.reviewedAt ?? "—") },
        { key: "source", label: "Official source", values: programs.map(source) },
      ],
    },
  ]
}

type MatrixProps = {
  slots: readonly number[]
  selectedPrograms: readonly ProgramCompareItem[]
  chooserSlot: number | null
  showAdd: boolean
  sections: readonly ProgramComparisonSection[]
  triggerRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>
  onOpen: (slot: number) => void
  onRemove: (slot: number) => void
  onAdd: () => void
  onCancelThird: () => void
}

function DesktopMatrix({ slots, selectedPrograms, chooserSlot, showAdd, sections, triggerRefs, onOpen, onRemove, onAdd, onCancelThird }: MatrixProps) {
  return (
    <div className="hidden border-y border-[#e7e6e3] bg-white md:block">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="sticky top-14 z-20 w-36 border-b border-[#e7e6e3] bg-white/95 px-4 py-3 backdrop-blur-md xl:w-44">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#77746e]">Compare</span>
                {showAdd ? <AddButton label="Add a third program" onClick={onAdd} /> : null}
              </div>
            </th>
            {slots.map((slot) => (
              <DesktopHeader
                key={slot}
                slot={slot}
                program={selectedPrograms[slot] ?? null}
                chooserOpen={chooserSlot === slot}
                triggerRef={(element) => { triggerRefs.current[slot] = element }}
                onOpen={onOpen}
                onRemove={onRemove}
                onCancel={slot === 2 && !selectedPrograms[slot] ? onCancelThird : undefined}
              />
            ))}
          </tr>
        </thead>
        {selectedPrograms.length >= 2 ? (
          <tbody>
            {sections.map((section) => (
              <ProgramSectionRows key={section.title} section={section} slots={slots} />
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  )
}

function ProgramSectionRows({ section, slots }: { section: ProgramComparisonSection; slots: readonly number[] }) {
  return (
    <>
      <tr>
        <th colSpan={slots.length + 1} className="border-b border-[#e7e6e3] bg-[#f7f7f5] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">
          {section.title}
        </th>
      </tr>
      {section.rows.map((row) => (
        <tr key={row.key}>
          <th scope="row" className="border-b border-[#ecebe7] bg-white px-4 py-4 align-top text-sm font-medium text-[#5f5d57]">{row.label}</th>
          {slots.map((slot) => (
            <td key={`${row.key}-${slot}`} className="border-b border-l border-[#ecebe7] px-5 py-4 align-top text-sm font-semibold leading-6 text-[#1b1b1b]">
              {row.values[slot] ?? null}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function DesktopHeader({ slot, program, chooserOpen, triggerRef, onOpen, onRemove, onCancel }: { slot: number; program: ProgramCompareItem | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void }) {
  return (
    <th scope="col" className="sticky top-14 z-20 border-b border-l border-[#e7e6e3] bg-white/95 px-2 py-2 align-top backdrop-blur-md">
      <div className="relative">
        <ProgramTrigger slot={slot} program={program} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} />
        <HeaderAction program={program} slot={slot} onRemove={onRemove} onCancel={onCancel} />
      </div>
    </th>
  )
}

function MobileMatrix({ slots, selectedPrograms, chooserSlot, showAdd, sections, triggerRefs, onOpen, onRemove, onAdd, onCancelThird }: MatrixProps) {
  return (
    <div className="md:hidden">
      <div className="sticky top-14 z-20 -mx-1 border-y border-[#e7e6e3] bg-white/95 px-1 py-2 backdrop-blur-md" aria-label="Program comparison columns">
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <MobileHeader
              key={slot}
              slot={slot}
              program={selectedPrograms[slot] ?? null}
              chooserOpen={chooserSlot === slot}
              triggerRef={(element) => { triggerRefs.current[slot] = element }}
              onOpen={onOpen}
              onRemove={onRemove}
              onCancel={slot === 2 && !selectedPrograms[slot] ? onCancelThird : undefined}
              className={slot === 2 ? "col-span-2" : ""}
            />
          ))}
        </div>
        {showAdd ? (
          <button type="button" onClick={onAdd} className="mt-2 inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
            <Plus aria-hidden="true" className="mr-1.5 size-4" /> Add program
          </button>
        ) : null}
      </div>

      {selectedPrograms.length >= 2 ? (
        <div className="mt-5 space-y-7">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section.title}</h3>
              <div className="mt-2 divide-y divide-[#ecebe7] border-y border-[#ecebe7]">
                {section.rows.map((row) => (
                  <div key={row.key} className="py-4">
                    <p className="text-sm font-medium text-[#5f5d57]">{row.label}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {selectedPrograms.map((program, index) => (
                        <div key={`${row.key}-${program.productProgramId}`} className="min-w-0 rounded-xl bg-[#fafaf9] p-3">
                          <p className="truncate text-[11px] font-semibold text-[#77746e]">{displayInstitution(program)}</p>
                          <div className="mt-1 break-words text-sm font-semibold leading-5 text-[#1b1b1b]">{row.values[index]}</div>
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

function MobileHeader({ slot, program, chooserOpen, triggerRef, onOpen, onRemove, onCancel, className }: { slot: number; program: ProgramCompareItem | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void; onRemove: (slot: number) => void; onCancel?: () => void; className?: string }) {
  return (
    <div className={`relative min-w-0 rounded-xl border border-[#e7e6e3] bg-white p-1 ${className ?? ""}`}>
      <ProgramTrigger slot={slot} program={program} chooserOpen={chooserOpen} triggerRef={triggerRef} onOpen={onOpen} />
      <HeaderAction program={program} slot={slot} onRemove={onRemove} onCancel={onCancel} mobile />
    </div>
  )
}

function ProgramTrigger({ slot, program, chooserOpen, triggerRef, onOpen }: { slot: number; program: ProgramCompareItem | null; chooserOpen: boolean; triggerRef: (element: HTMLButtonElement | null) => void; onOpen: (slot: number) => void }) {
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={chooserOpen}
      aria-label={program ? `Change ${displayInstitution(program)} ${displayProgramName(program)}` : `Select program ${slot + 1}`}
      onClick={() => onOpen(slot)}
      className="relative min-h-16 w-full rounded-lg px-3 py-2.5 pr-10 text-left hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"
    >
      <span className="block pr-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#77746e]">{program ? displayInstitution(program) : `Program ${slot + 1}`}</span>
      <span className="mt-1 block break-words pr-5 text-sm font-semibold leading-5 text-[#1b1b1b]">{program ? displayProgramName(program) : "Choose a programme"}</span>
      <ChevronDown aria-hidden="true" className="absolute right-3 top-5 size-4 text-[#77746e]" />
    </button>
  )
}

function HeaderAction({ program, slot, onRemove, onCancel, mobile = false }: { program: ProgramCompareItem | null; slot: number; onRemove: (slot: number) => void; onCancel?: () => void; mobile?: boolean }) {
  if (onCancel) {
    return (
      <button type="button" onClick={onCancel} aria-label="Cancel third program" className={`absolute ${mobile ? "right-1 top-1" : "right-1 top-1"} z-10 min-h-9 rounded-lg px-2 text-xs font-semibold text-[#5f5d57] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35`}>
        Cancel
      </button>
    )
  }
  if (!program) return null
  return (
    <button type="button" onClick={() => onRemove(slot)} aria-label={`Remove ${displayInstitution(program)} ${displayProgramName(program)} from comparison`} className={`absolute ${mobile ? "right-1 top-1" : "right-1 top-1"} z-10 inline-flex size-9 items-center justify-center rounded-lg text-[#77746e] hover:bg-[#f0efeb] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35`}>
      <X aria-hidden="true" className="size-4" />
    </button>
  )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex size-9 items-center justify-center rounded-lg text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
      <Plus aria-hidden="true" className="size-4" />
    </button>
  )
}

function ProgramChooser({ slot, selectedIds, programs, onChoose, onClose }: { slot: number; selectedIds: readonly string[]; programs: readonly ProgramCompareItem[]; onChoose: (slot: number, id: string) => void; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose() }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-3 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-labelledby="program-chooser-heading" className="w-full max-w-lg rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="program-chooser-heading" className="text-base font-semibold text-[#1b1b1b]">Choose a programme</h2>
            <p className="mt-1 text-sm text-[#6f6d68]">Select a verified option for column {slot + 1}.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close programme chooser" className="inline-flex size-10 items-center justify-center rounded-lg text-[#6f6d68] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {programs.map((program) => {
            const disabled = selectedIds.includes(program.productProgramId) && selectedIds[slot] !== program.productProgramId
            return (
              <button key={program.productProgramId} type="button" disabled={disabled} onClick={() => onChoose(slot, program.productProgramId)} className="w-full rounded-xl border border-[#e7e6e3] px-3 py-3 text-left text-sm hover:bg-[#fafaf9] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">
                <span className="block font-semibold text-[#1b1b1b]">{displayInstitution(program)}</span>
                <span className="mt-1 block text-[#6f6d68]">{displayProgramName(program)}</span>
                {disabled ? <span className="mt-1 block text-xs text-[#6f6d68]">Already selected</span> : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
