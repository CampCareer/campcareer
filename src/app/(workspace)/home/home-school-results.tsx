"use client"

import Image, { type StaticImageData } from "next/image"
import { useState } from "react"
import { Check } from "lucide-react"
import {
  hasComparablePrograms,
  toggleComparedProgram,
  type SchoolProgramFixture,
  type SchoolResultsFixture,
} from "./home-school-fixtures"
import unswCampus from "../../../../public/blog/images/UNSW.webp"
import universityOfTorontoCampus from "../../../../public/blog/images/UoT.webp"
import melbourneUniversityCampus from "../../../../public/blog/images/Melbourne_University.webp"
import { HomePathSaveFooter } from "./home-path-save"
import { HomeResultHeader, HomeResultMetrics } from "./home-result-ui"

const CAMPUS_CONTEXT_IMAGES: Record<SchoolProgramFixture["imageKey"], StaticImageData> = {
  "campus-a": unswCampus,
  "campus-b": universityOfTorontoCampus,
  "campus-c": melbourneUniversityCampus,
}

type HomeSchoolResultsProps = {
  fixture: SchoolResultsFixture
}

export function HomeSchoolResults({ fixture }: HomeSchoolResultsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => fixture.programs.map((program) => program.id))
  const [detailsMessage, setDetailsMessage] = useState("")
  const selectedPrograms = fixture.programs.filter((program) => selectedIds.includes(program.id))

  const toggleProgram = (programId: string) => {
    setSelectedIds((current) => toggleComparedProgram(current, programId, fixture.programs.map((program) => program.id)))
  }

  return (
    <section className="mx-auto max-w-5xl px-1 pt-4" aria-label="Pathway search results">
      <HomeResultHeader eyebrow="Australia · Nursing" title={fixture.title} description={fixture.description} status={`${fixture.programs.length} programs compared`} />
      <p className="mt-4 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 text-sm leading-6 text-[#4a4842]">{fixture.guidance}</p>

      <QuickOverview programs={fixture.programs} />
      <RecommendedPrograms
        programs={fixture.programs}
        selectedIds={selectedIds}
        onToggle={toggleProgram}
        onViewDetails={(program) => setDetailsMessage(`${program.programName} details will be connected in a later step.`)}
      />
      <ProgramComparison programs={selectedPrograms} />
      <KeyRequirements fixture={fixture} />
      <CareerOutlook fixture={fixture} />
      <HomePathSaveFooter />

      {detailsMessage && <p role="status" className="pb-4 text-sm text-[#6f6d68]">{detailsMessage}</p>}
    </section>
  )
}

function QuickOverview({ programs }: { programs: readonly SchoolProgramFixture[] }) {
  const overview: ReadonlyArray<readonly [string, string]> = [
    ["Programs", `${programs.length} compared`],
    ["Typical tuition", "A$32.5k–43.5k / year"],
    ["Typical duration", "2.3–3 years"],
    ["Registration pathway", "Registered Nurse pathway"],
  ]

  return <HomeResultMetrics items={overview} label="Quick overview" />
}

function RecommendedPrograms({ programs, selectedIds, onToggle, onViewDetails }: {
  programs: readonly SchoolProgramFixture[]
  selectedIds: readonly string[]
  onToggle: (programId: string) => void
  onViewDetails: (program: SchoolProgramFixture) => void
}) {
  return (
    <section id="programs" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="programs-heading">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="programs-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Recommended programs</h2>
          <p className="mt-1 text-sm text-[#6f6d68]">Local UI fixtures based on reviewed provider records; not a live search or ranking.</p>
        </div>
        <p role="status" aria-live="polite" className="text-sm font-medium text-[#4a4842]">{selectedIds.length} selected for comparison</p>
      </div>
      <div className="mt-4 grid items-stretch gap-4 md:grid-cols-3">
        {programs.map((program) => {
          const selected = selectedIds.includes(program.id)
          return (
            <article key={program.id} className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_12px_30px_-28px_rgba(27,27,27,0.45)] ${selected ? "border-blue-300 ring-1 ring-blue-100" : "border-[#e7e6e3]"}`}>
              <div className="relative h-32 bg-[#eef4ff]">
                <Image src={CAMPUS_CONTEXT_IMAGES[program.imageKey]} alt={program.imageAlt} fill sizes="(min-width: 768px) 31vw, 100vw" className="object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#3a3935]">Campus context</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{program.programType}</span>
                <p className="mt-3 text-sm font-semibold text-[#4a4842]">{program.institutionName}</p>
                <h3 className="mt-1 text-lg font-semibold leading-6 text-[#1b1b1b]">{program.programName}</h3>
                <p className="mt-2 text-sm leading-5 text-[#6f6d68]">{program.location}</p>
                {program.comparisonNote && <p className="mt-3 text-xs font-semibold text-blue-700">{program.comparisonNote}</p>}
                <dl className="mt-4 space-y-2.5 border-t border-[#eeece8] pt-3 text-sm">
                  <Fact term="Estimated tuition" definition={program.tuitionLabel} />
                  <Fact term="Duration" definition={program.durationLabel} />
                  <Fact term="Entry requirement" definition={program.entryRequirement} />
                </dl>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#eeece8] pt-3">
                  <label className="-ml-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#3a3935] focus-within:ring-2 focus-within:ring-blue-600/35">
                    <input
                      type="checkbox"
                      data-program-id={program.id}
                      checked={selected}
                      onChange={() => onToggle(program.id)}
                      className="size-4 rounded border-[#aaa8a1] accent-blue-600"
                    />
                    Compare
                  </label>
                  <button type="button" onClick={() => onViewDetails(program)} className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">
                    View details
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Fact({ term, definition }: { term: string; definition: string }) {
  return <div><dt className="text-[#8a8882]">{term}</dt><dd className="mt-0.5 font-medium leading-5 text-[#3a3935]">{definition}</dd></div>
}

function ProgramComparison({ programs }: { programs: readonly SchoolProgramFixture[] }) {
  const canCompare = hasComparablePrograms(programs.map((program) => program.id))
  const rows: Array<[string, (program: SchoolProgramFixture) => string]> = [
    ["Tuition", (program) => program.tuitionLabel],
    ["Duration", (program) => program.durationLabel],
    ["Location", (program) => program.location],
    ["Entry requirements", (program) => program.entryRequirement],
    ["Program type", (program) => program.programType],
    ["Registration outcome", (program) => program.registrationOutcome],
  ]

  return (
    <section id="program-comparison" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="comparison-heading">
      <h2 id="comparison-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Program comparison</h2>
      {canCompare ? (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-[#e7e6e3] md:grid" style={{ gridTemplateColumns: `minmax(9rem, 1fr) repeat(${programs.length}, minmax(0, 1.35fr))` }}>
            <div className="border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-4 text-sm font-semibold text-[#4a4842]">Compare</div>
            {programs.map((program) => <div key={program.id} className="border-b border-l border-[#e7e6e3] px-4 py-4 text-sm font-semibold leading-5 text-[#1b1b1b]">{program.institutionName}<span className="mt-1 block font-normal text-[#6f6d68]">{program.programName}</span></div>)}
            {rows.flatMap(([label, getValue]) => [
              <div key={`${label}-label`} className="border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 text-sm font-medium text-[#4a4842]">{label}</div>,
              ...programs.map((program) => <div key={`${label}-${program.id}`} className="border-b border-l border-[#e7e6e3] px-4 py-3 text-sm leading-5 text-[#3a3935]">{getValue(program)}</div>),
            ])}
          </div>
          <div className="mt-4 space-y-3 md:hidden">
            {programs.map((program) => (
              <article key={program.id} className="rounded-xl border border-[#e7e6e3] p-4">
                <h3 className="text-sm font-semibold text-[#1b1b1b]">{program.institutionName}</h3>
                <p className="mt-1 text-sm text-[#6f6d68]">{program.programName}</p>
                <dl className="mt-4 space-y-3">{rows.map(([label, getValue]) => <Fact key={label} term={label} definition={getValue(program)} />)}</dl>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p role="status" className="mt-4 rounded-xl border border-dashed border-[#d8d6d0] px-4 py-3 text-sm leading-6 text-[#6f6d68]">Select at least two programs to compare their details side by side.</p>
      )}
    </section>
  )
}

function KeyRequirements({ fixture }: { fixture: SchoolResultsFixture }) {
  return (
    <section id="requirements" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="requirements-heading">
      <h2 id="requirements-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Key requirements</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {fixture.requirements.map((requirement) => (
          <li key={requirement.title} className="flex gap-3 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-3.5">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-700" />
            <span><span className="block text-sm font-semibold text-[#3a3935]">{requirement.title}</span><span className="mt-0.5 block text-sm leading-5 text-[#6f6d68]">{requirement.description}</span></span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CareerOutlook({ fixture }: { fixture: SchoolResultsFixture }) {
  const { careerOutlook } = fixture
  return (
    <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="career-outlook-heading">
      <h2 id="career-outlook-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Career outlook</h2>
      <div className="mt-4 rounded-2xl border border-[#e7e6e3] bg-[#fafaf9] p-4 sm:p-5">
        <p className="text-base font-semibold text-[#1b1b1b]">{careerOutlook.role}</p>
        <div className="mt-3 grid gap-3 text-sm leading-6 text-[#5f5d57] sm:grid-cols-3">
          <p>{careerOutlook.employmentSetting}</p>
          <p>{careerOutlook.careerDirection}</p>
          <p>{careerOutlook.salaryNote}</p>
        </div>
      </div>
    </section>
  )
}
