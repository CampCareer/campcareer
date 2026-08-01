"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, ClipboardCheck } from "lucide-react"
import {
  countCheckedDocuments,
  getSchoolComparisonValues,
  getVisaPreparationValues,
  toggleApplicationShortlist,
  type ApplicationRequirement,
  type ApplicationResultsFixture,
} from "./home-application-fixtures"
import { toHomeSearchQuery } from "./home-search-config"
import { HomePathSaveFooter } from "./home-path-save"
import { HomeResultHeader, HomeResultMetrics } from "./home-result-ui"

type HomeApplicationResultsProps = {
  fixture: ApplicationResultsFixture
}

export function HomeApplicationResults({ fixture }: HomeApplicationResultsProps) {
  const router = useRouter()
  const documentChecklistRef = useRef<HTMLElement>(null)
  const [checkedDocumentIds, setCheckedDocumentIds] = useState<string[]>([])
  const [shortlistedProgramIds, setShortlistedProgramIds] = useState<string[]>([])
  const [shortlistMessage, setShortlistMessage] = useState("")
  const [programDetailsMessage, setProgramDetailsMessage] = useState("")
  const documentIds = fixture.documents.map((document) => document.id)
  const checkedCount = countCheckedDocuments(checkedDocumentIds, documentIds)

  const toggleDocument = (documentId: string) => {
    setCheckedDocumentIds((current) => current.includes(documentId)
      ? current.filter((id) => id !== documentId)
      : [...current, documentId])
  }

  const toggleShortlist = (programId: string) => {
    setShortlistedProgramIds((current) => {
      const next = toggleApplicationShortlist(current, programId, fixture.programs.map((program) => program.id))
      setShortlistMessage(next.length === current.length && !current.includes(programId)
        ? "You can shortlist up to three programs in this session."
        : "")
      return next
    })
  }

  const reviewChecklist = () => {
    documentChecklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    documentChecklistRef.current?.focus({ preventScroll: true })
  }

  const goToSchoolComparison = () => {
    router.push(`/home?${toHomeSearchQuery(getSchoolComparisonValues(fixture)).toString()}`, { scroll: false })
  }

  const goToVisaPreparation = () => {
    router.push(`/home?${toHomeSearchQuery(getVisaPreparationValues(fixture)).toString()}`, { scroll: false })
  }

  return (
    <section className="mx-auto max-w-5xl px-1 pt-4" aria-label="Application preparation results">
      <HomeResultHeader eyebrow="Australia · Nursing" title={fixture.title} description={fixture.description} status="Application preparation" />

      <ApplicationReadiness />
      <EntryRequirements requirements={fixture.requirements} />
      <div className="grid gap-7 lg:grid-cols-2 lg:items-start lg:gap-8">
        <DocumentChecklist
          sectionRef={documentChecklistRef}
          fixture={fixture}
          checkedIds={checkedDocumentIds}
          checkedCount={checkedCount}
          onToggle={toggleDocument}
        />
        <ApplicationTimeline fixture={fixture} />
      </div>
      <ProgramsToApplyTo
        fixture={fixture}
        selectedIds={shortlistedProgramIds}
        shortlistMessage={shortlistMessage}
        onToggleShortlist={toggleShortlist}
        onViewDetails={(programName) => setProgramDetailsMessage(`${programName} details will be connected in a later step.`)}
      />
      <CareerOutcome fixture={fixture} />
      <NextAction onReviewChecklist={reviewChecklist} onComparePrograms={goToSchoolComparison} onPrepareVisa={goToVisaPreparation} />
      <HomePathSaveFooter />
      {programDetailsMessage && <p role="status" className="pb-3 text-sm text-[#6f6d68]">{programDetailsMessage}</p>}
    </section>
  )
}

function ApplicationReadiness() {
  const items: ReadonlyArray<readonly [string, string]> = [
    ["Entry requirements", "Varies by program"],
    ["Documents", "Checklist available"],
    ["English", "Required"],
    ["Application timeline", "Program-specific"],
  ]

  return <HomeResultMetrics items={items} label="Application readiness overview" />
}

function EntryRequirements({ requirements }: { requirements: readonly ApplicationRequirement[] }) {
  return (
    <section id="entry-requirements" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="entry-requirements-heading">
      <div>
        <h2 id="entry-requirements-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Entry requirements</h2>
        <p className="mt-2 max-w-2xl rounded-xl border border-[#e7e6e3] bg-[#fafaf9] px-3 py-2 text-sm leading-6 text-[#5f5d57]">Review each provider’s current requirements before you apply. Details can vary by program.</p>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {requirements.map((requirement) => <RequirementItem key={requirement.id} requirement={requirement} />)}
      </ul>
    </section>
  )
}

function RequirementItem({ requirement }: { requirement: ApplicationRequirement }) {
  const statusLabel = requirement.status === "required" ? "Required" : requirement.status === "varies" ? "Varies by program" : "Not yet verified"

  return (
    <li className="flex gap-3 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-3.5">
      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-700" />
      <span className="min-w-0"><span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-sm font-semibold text-[#3a3935]">{requirement.label}</span><span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#6f6d68]">{statusLabel === "Varies by program" ? "Varies" : statusLabel === "Not yet verified" ? "Not verified" : statusLabel}</span></span><span className="mt-0.5 block text-sm leading-5 text-[#6f6d68]">{requirement.description}</span>{requirement.sourceLabel && <span className="mt-1 block text-xs text-[#8a8882]">{requirement.sourceLabel}</span>}</span>
    </li>
  )
}

function DocumentChecklist({ fixture, checkedIds, checkedCount, onToggle, sectionRef }: {
  fixture: ApplicationResultsFixture
  checkedIds: readonly string[]
  checkedCount: number
  onToggle: (documentId: string) => void
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  return (
  <section id="document-checklist" ref={sectionRef} tabIndex={-1} className="border-t border-[#e7e6e3] py-7 focus-visible:outline-none sm:py-8" aria-labelledby="document-checklist-heading">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="document-checklist-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Document checklist</h2>
        <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Prepared for this session only — this does not confirm submission to a provider.</p>
      </div>
      <p role="status" aria-live="polite" className="text-sm font-semibold text-[#4a4842]">{checkedCount} of {fixture.documents.length} documents checked</p>
    </div>
    <ul className="mt-4 divide-y divide-[#eeece8] rounded-xl border border-[#e7e6e3] bg-white px-4">
      {fixture.documents.map((document) => {
        const id = `application-document-${document.id}`
        return (
          <li key={document.id} className="py-1">
            <label htmlFor={id} className="flex min-h-12 cursor-pointer items-center gap-3 py-2 focus-within:rounded-lg focus-within:ring-2 focus-within:ring-blue-600/35">
              <input id={id} type="checkbox" checked={checkedIds.includes(document.id)} onChange={() => onToggle(document.id)} className="size-4 shrink-0 rounded border-[#aaa8a1] accent-blue-600" />
              <span className="min-w-0"><span className="block text-sm font-medium text-[#3a3935]">{document.label}</span>{document.description && <span className="mt-0.5 block text-sm leading-5 text-[#6f6d68]">{document.description}</span>}</span>
            </label>
          </li>
        )
      })}
    </ul>
  </section>
  )
}

function ApplicationTimeline({ fixture }: { fixture: ApplicationResultsFixture }) {
  return (
    <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="timeline-heading">
      <div>
        <h2 id="timeline-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Application timeline</h2>
        <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Typical application sequence</p>
      </div>
      <ol className="mt-4 space-y-3">
        {fixture.timeline.map((step) => (
          <li key={step.id} className="flex gap-3">
            <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xs font-semibold text-blue-700">{step.order}</span>
            <div className="min-w-0 pb-3">
              <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-[#3a3935]">{step.title}</h3><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${step.phase === "current" ? "bg-blue-600 text-white" : step.phase === "next" ? "bg-blue-50 text-blue-700" : "bg-[#f3f2ef] text-[#6f6d68]"}`}>{step.phase === "current" ? "Current" : step.phase === "next" ? "Next" : "Later"}</span></div>
              <p className="mt-1 text-sm leading-5 text-[#6f6d68]">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProgramsToApplyTo({ fixture, selectedIds, shortlistMessage, onToggleShortlist, onViewDetails }: {
  fixture: ApplicationResultsFixture
  selectedIds: readonly string[]
  shortlistMessage: string
  onToggleShortlist: (programId: string) => void
  onViewDetails: (programName: string) => void
}) {
  return (
    <section id="programs" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="programs-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="programs-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Programs to apply to</h2>
          <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Reviewed program fixtures, not a live provider search or ranking.</p>
        </div>
        <p role="status" aria-live="polite" className="text-sm font-semibold text-[#4a4842]">{selectedIds.length} of 3 shortlisted</p>
      </div>
      <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fixture.programs.map((program) => {
          const shortlisted = selectedIds.includes(program.id)
          return (
            <article key={program.id} className={`flex min-w-0 flex-col rounded-xl border bg-white p-4 ${shortlisted ? "border-blue-300 ring-1 ring-blue-100" : "border-[#e7e6e3]"}`}>
              <p className="text-sm font-semibold text-[#4a4842]">{program.institutionName}</p>
              <h3 className="mt-1 text-base font-semibold leading-6 text-[#1b1b1b]">{program.programName}</h3>
              <p className="mt-2 text-sm leading-5 text-[#6f6d68]">{program.location}</p>
              <dl className="mt-4 space-y-2 border-t border-[#eeece8] pt-3 text-sm"><ProgramFact term="Duration" value={program.durationLabel} /><ProgramFact term="Tuition" value={program.tuitionLabel} /><ProgramFact term="Key entry requirement" value={program.entryRequirement} /></dl>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                <button type="button" onClick={() => onViewDetails(program.programName)} className="min-h-11 rounded-lg px-2 text-left text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">View program details</button>
                <button type="button" aria-pressed={shortlisted} onClick={() => onToggleShortlist(program.id)} className={`min-h-11 rounded-lg border px-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 ${shortlisted ? "border-blue-600 bg-blue-50 text-blue-700" : "border-[#d5d3ce] text-[#3a3935] hover:border-[#aaa8a1]"}`}>{shortlisted ? "Shortlisted" : "Add to shortlist"}</button>
              </div>
            </article>
          )
        })}
      </div>
      {shortlistMessage && <p role="status" className="mt-3 text-sm text-[#6f6d68]">{shortlistMessage}</p>}
    </section>
  )
}

function ProgramFact({ term, value }: { term: string; value: string }) {
  return <div><dt className="text-[#8a8882]">{term}</dt><dd className="mt-0.5 font-medium leading-5 text-[#3a3935]">{value}</dd></div>
}

function CareerOutcome({ fixture }: { fixture: ApplicationResultsFixture }) {
  const { careerOutcome } = fixture
  return (
    <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="career-heading">
      <h2 id="career-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Career outcome</h2>
      <div className="mt-4 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-4">
        <h3 className="text-base font-semibold text-[#1b1b1b]">{careerOutcome.title}</h3>
        <div className="mt-3 grid gap-3 text-sm leading-5 text-[#5f5d57] sm:grid-cols-3"><p>{careerOutcome.workSettings}</p><p>{careerOutcome.registration}</p><p>{careerOutcome.salaryStatus}</p></div>
      </div>
    </section>
  )
}

function NextAction({ onReviewChecklist, onComparePrograms, onPrepareVisa }: { onReviewChecklist: () => void; onComparePrograms: () => void; onPrepareVisa: () => void }) {
  return (
    <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="next-action-heading">
      <div className="rounded-2xl border border-[#e0e8f7] bg-[#f7faff] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="next-action-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Complete your application checklist</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5f5d57]">Confirm program requirements and prepare the documents needed for your application.</p>
          </div>
          <button type="button" onClick={onReviewChecklist} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 sm:w-auto">Review application checklist <ClipboardCheck className="size-4" /></button>
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-[#dce6f7] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={onComparePrograms} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-blue-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">Compare programs <ChevronRight className="size-4" /></button>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center"><span className="text-sm text-[#6f6d68]">Received your offer? Move to visa preparation.</span><button type="button" onClick={onPrepareVisa} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d5d3ce] px-3 text-sm font-semibold text-[#3a3935] hover:border-[#aaa8a1] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">Prepare my visa</button></div>
        </div>
      </div>
    </section>
  )
}
