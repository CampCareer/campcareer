"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, ClipboardCheck, ExternalLink, ShieldCheck } from "lucide-react"
import {
  countCheckedVisaDocuments,
  getApplicationPreparationValues,
  hasComparableVisaRoutes,
  toggleComparedVisaRoute,
  type VisaRequirement,
  type VisaResultsFixture,
  type VisaRouteFixture,
} from "./home-visa-fixtures"
import { toHomeSearchQuery } from "./home-search-config"
import { HomePathSaveFooter } from "./home-path-save"
import { HomeResultHeader, HomeResultMetrics, ResultVerificationNotice } from "./home-result-ui"

type HomeVisaResultsProps = {
  fixture: VisaResultsFixture
}

export function HomeVisaResults({ fixture }: HomeVisaResultsProps) {
  const router = useRouter()
  const checklistRef = useRef<HTMLElement>(null)
  const [checkedDocumentIds, setCheckedDocumentIds] = useState<string[]>([])
  const [comparedRouteIds, setComparedRouteIds] = useState<string[]>(() => fixture.routes.slice(0, 2).map((route) => route.id))
  const documentIds = fixture.documents.map((document) => document.id)
  const checkedCount = countCheckedVisaDocuments(checkedDocumentIds, documentIds)
  const comparedRoutes = fixture.routes.filter((route) => comparedRouteIds.includes(route.id))
  const officialSource = fixture.routes.find((route) => route.sourceUrl)

  const toggleDocument = (documentId: string) => {
    setCheckedDocumentIds((current) => current.includes(documentId)
      ? current.filter((id) => id !== documentId)
      : [...current, documentId])
  }

  const toggleRoute = (routeId: string) => {
    setComparedRouteIds((current) => toggleComparedVisaRoute(current, routeId, fixture.routes.map((route) => route.id)))
  }

  const reviewChecklist = () => {
    checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    checklistRef.current?.focus({ preventScroll: true })
  }

  return (
    <section className="mx-auto max-w-5xl px-1 pt-4" aria-label="Visa preparation results">
      <HomeResultHeader eyebrow="Australia · Nursing" title={fixture.title} description={fixture.description} status="Visa preparation" verification="Official check required" />
      <ResultVerificationNotice>Visa rules, fees and processing information must be checked with Home Affairs before applying.</ResultVerificationNotice>

      <VisaReadiness />
      <VisaPathways fixture={fixture} comparedIds={comparedRouteIds} onToggle={toggleRoute} />
      <VisaRouteComparison routes={comparedRoutes} />
      <EligibilityChecklist requirements={fixture.requirements} />
      <div className="grid gap-7 lg:grid-cols-2 lg:items-start lg:gap-8">
        <VisaDocumentChecklist sectionRef={checklistRef} fixture={fixture} checkedIds={checkedDocumentIds} checkedCount={checkedCount} onToggle={toggleDocument} />
        <CostAndTiming fixture={fixture} />
      </div>
      <VisaProcess fixture={fixture} />
      <ImportantChecks fixture={fixture} />
      <NextAction officialSource={officialSource} onReviewChecklist={reviewChecklist} onBackToApplication={() => router.push(`/home?${toHomeSearchQuery(getApplicationPreparationValues(fixture)).toString()}`, { scroll: false })} />
      <HomePathSaveFooter headingId="visa-save-path-heading" />
    </section>
  )
}

function VisaReadiness() {
  const items: ReadonlyArray<readonly [string, string]> = [
    ["Visa route", "Check available routes"],
    ["Eligibility", "Verification required"],
    ["Documents", "Checklist available"],
    ["Timing", "Check official source"],
  ]

  return <HomeResultMetrics items={items} label="Visa readiness overview" />
}

function VisaPathways({ fixture, comparedIds, onToggle }: { fixture: VisaResultsFixture; comparedIds: readonly string[]; onToggle: (routeId: string) => void }) {
  return (
    <section id="visa-pathways" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="visa-pathways-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 id="visa-pathways-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Visa pathways</h2><p className="mt-1 text-sm leading-6 text-[#6f6d68]">Official-source route entries for exploration, not an eligibility assessment.</p></div>
        <p role="status" aria-live="polite" className="text-sm font-semibold text-[#4a4842]">{comparedIds.length} selected for comparison</p>
      </div>
      <div className="mt-4 grid items-stretch gap-4 sm:grid-cols-2">
        {fixture.routes.map((route) => <VisaRouteCard key={route.id} route={route} compared={comparedIds.includes(route.id)} onToggle={() => onToggle(route.id)} />)}
      </div>
    </section>
  )
}

function VisaRouteCard({ route, compared, onToggle }: { route: VisaRouteFixture; compared: boolean; onToggle: () => void }) {
  const verificationLabel = route.verificationStatus === "verified" ? "Official check" : route.verificationStatus === "needs-review" ? "Verify" : "Not verified"
  const verificationDescription = route.verificationStatus === "verified" ? "Official source linked" : route.verificationStatus === "needs-review" ? "Official confirmation required" : "Source not available"
  return (
    <article className={`flex min-w-0 flex-col rounded-2xl border bg-white p-4 shadow-[0_12px_30px_-28px_rgba(27,27,27,0.45)] ${compared ? "border-blue-300 ring-1 ring-blue-100" : "border-[#e7e6e3]"}`}>
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-blue-700">{route.category}</p><h3 className="mt-1 text-lg font-semibold text-[#1b1b1b]">{route.name}</h3></div><ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-blue-700" /></div>
      <dl className="mt-4 space-y-3 border-t border-[#eeece8] pt-4 text-sm"><Fact term="Purpose" value={route.purpose} /><Fact term="Who it may suit" value={route.intendedApplicant} /><Fact term="Key condition" value={route.keyCondition} /><Fact term="Cost" value={route.costLabel} /><Fact term="Timing" value={route.timingLabel} /></dl>
      <p aria-label={verificationDescription} className="mt-4 text-xs font-medium text-[#6f6d68]"><span className="rounded-full bg-[#f3f2ef] px-2 py-1">{verificationLabel}</span>{route.sourceLabel ? <span className="ml-2">{route.sourceLabel}</span> : ""}</p>
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#eeece8] pt-3"><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#3a3935] focus-within:ring-2 focus-within:ring-blue-600/35"><input type="checkbox" data-visa-route-id={route.id} checked={compared} onChange={onToggle} className="size-4 rounded border-[#aaa8a1] accent-blue-600" />Compare</label>{route.sourceUrl ? <a href={route.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-end gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">View route details <ExternalLink className="size-3.5" /></a> : <button type="button" disabled className="min-h-11 text-right text-sm font-semibold text-[#aaa8a1]">Details being prepared</button>}</div>
    </article>
  )
}

function VisaRouteComparison({ routes }: { routes: readonly VisaRouteFixture[] }) {
  const canCompare = hasComparableVisaRoutes(routes.map((route) => route.id))
  const rows: Array<[string, (route: VisaRouteFixture) => string]> = [
    ["Purpose", (route) => route.purpose],
    ["Intended applicant", (route) => route.intendedApplicant],
    ["Key eligibility condition", (route) => route.keyCondition],
    ["Cost status", (route) => route.costLabel],
    ["Timing status", (route) => route.timingLabel],
    ["Official verification", (route) => route.verificationStatus === "verified" ? "Official source linked" : "Official confirmation required"],
  ]
  return <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="route-comparison-heading"><h2 id="route-comparison-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Visa route comparison</h2>{canCompare ? <><div className="mt-4 hidden overflow-hidden rounded-2xl border border-[#e7e6e3] md:grid" style={{ gridTemplateColumns: `minmax(9rem, 1fr) repeat(${routes.length}, minmax(0, 1.35fr))` }}><div className="border-b border-[#e7e6e3] bg-[#f3f2ef] px-4 py-3 text-sm font-semibold text-[#4a4842]">Compare</div>{routes.map((route) => <div key={route.id} className="border-b border-l border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 text-sm font-semibold leading-5 text-[#1b1b1b]">{route.name}</div>)}{rows.flatMap(([label, value]) => [<div key={`${label}-label`} className="border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 text-sm font-medium text-[#4a4842]">{label}</div>, ...routes.map((route) => <div key={`${label}-${route.id}`} className="border-b border-l border-[#e7e6e3] px-4 py-3 text-sm leading-5 text-[#3a3935]">{value(route)}</div>)])}</div><div className="mt-4 space-y-3 md:hidden">{routes.map((route) => <article key={route.id} className="rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-4"><h3 className="text-base font-semibold text-[#1b1b1b]">{route.name}</h3><dl className="mt-4 space-y-3">{rows.map(([label, value]) => <Fact key={label} term={label} value={value(route)} />)}</dl></article>)}</div></> : <p role="status" className="mt-4 rounded-xl border border-dashed border-[#d8d6d0] px-4 py-3 text-sm leading-6 text-[#6f6d68]">Verified visa route comparison is being prepared. Select at least two official-source routes to compare.</p>}</section>
}

function EligibilityChecklist({ requirements }: { requirements: readonly VisaRequirement[] }) {
  return <section id="eligibility" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="eligibility-heading"><div><h2 id="eligibility-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Eligibility checklist</h2><p className="mt-1 text-sm leading-6 text-[#6f6d68]">This is a planning checklist, not an assessment of your eligibility.</p></div><ul className="mt-4 grid gap-3 sm:grid-cols-2">{requirements.map((item) => { const status = item.status === "required" ? "Required" : item.status === "varies" ? "Varies" : "Verify"; return <li key={item.id} className="flex gap-3 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-3.5"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-700" /><span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-[#3a3935]">{item.label}</span><span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#6f6d68]">{status}</span></span><span className="mt-0.5 block text-sm leading-5 text-[#6f6d68]">{item.description}</span>{item.sourceLabel && <span className="mt-1 block text-xs text-[#8a8882]">{item.sourceLabel}</span>}</span></li> })}</ul></section>
}

function VisaDocumentChecklist({ fixture, checkedIds, checkedCount, onToggle, sectionRef }: { fixture: VisaResultsFixture; checkedIds: readonly string[]; checkedCount: number; onToggle: (documentId: string) => void; sectionRef: React.RefObject<HTMLElement | null> }) {
  return <section id="visa-checklist" ref={sectionRef} tabIndex={-1} className="border-t border-[#e7e6e3] py-7 focus-visible:outline-none sm:py-8" aria-labelledby="visa-documents-heading"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="visa-documents-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Document checklist</h2><p className="mt-1 text-sm leading-6 text-[#6f6d68]">This checklist is for planning only. Confirm the current requirements on the official government website.</p></div><p role="status" aria-live="polite" className="text-sm font-semibold text-[#4a4842]">{checkedCount} of {fixture.documents.length} preparation items checked</p></div><ul className="mt-4 divide-y divide-[#eeece8] rounded-xl border border-[#e7e6e3] bg-white px-4">{fixture.documents.map((document) => { const id = `visa-document-${document.id}`; const status = document.requirementStatus === "required" ? "Required" : document.requirementStatus === "may-be-required" ? "May be required" : "Verify"; return <li key={document.id} className="py-1"><label htmlFor={id} className="flex min-h-12 cursor-pointer items-center gap-3 py-2 focus-within:rounded-lg focus-within:ring-2 focus-within:ring-blue-600/35"><input id={id} type="checkbox" checked={checkedIds.includes(document.id)} onChange={() => onToggle(document.id)} className="size-4 shrink-0 rounded border-[#aaa8a1] accent-blue-600" /><span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium text-[#3a3935]">{document.label}</span><span className="rounded-full bg-[#f3f2ef] px-2 py-0.5 text-[11px] font-semibold text-[#6f6d68]">{status}</span></span><span className="mt-0.5 block text-sm leading-5 text-[#6f6d68]">{document.description}</span></span></label></li> })}</ul></section>
}

function CostAndTiming({ fixture }: { fixture: VisaResultsFixture }) {
  return <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="cost-timing-heading"><h2 id="cost-timing-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Cost and timing</h2><p className="mt-1 text-sm leading-6 text-[#6f6d68]">Current values need an official check before you apply.</p><dl className="mt-4 divide-y divide-[#eeece8] rounded-xl border border-[#e7e6e3] bg-white px-4">{fixture.costAndTiming.map((item) => <div key={item.label} className="grid gap-1 py-3 text-sm sm:grid-cols-[minmax(0,1.2fr)_1fr] sm:gap-4"><dt className="font-medium text-[#3a3935]">{item.label}</dt><dd className="text-[#6f6d68]">{item.value}</dd></div>)}</dl></section>
}

function VisaProcess({ fixture }: { fixture: VisaResultsFixture }) {
  return <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="visa-process-heading"><div><h2 id="visa-process-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Visa process</h2><p className="mt-1 text-sm leading-6 text-[#6f6d68]">Typical visa preparation sequence. Exact steps vary by visa route and applicant circumstances.</p></div><ol className="mt-4 space-y-3">{fixture.timeline.map((step) => <li key={step.id} className="flex gap-3"><span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xs font-semibold text-blue-700">{step.order}</span><div className="min-w-0 pb-3"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-[#3a3935]">{step.title}</h3><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${step.phase === "current" ? "bg-blue-600 text-white" : step.phase === "next" ? "bg-blue-50 text-blue-700" : "bg-[#f3f2ef] text-[#6f6d68]"}`}>{step.phase === "current" ? "Current" : step.phase === "next" ? "Next" : "Later"}</span></div><p className="mt-1 text-sm leading-5 text-[#6f6d68]">{step.description}</p></div></li>)}</ol></section>
}

function ImportantChecks({ fixture }: { fixture: VisaResultsFixture }) {
  return <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="important-checks-heading"><h2 id="important-checks-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Important checks</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{fixture.importantChecks.map((item) => <li key={item.id} className="flex gap-3 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-3.5"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-700" /><span><span className="block text-sm font-semibold text-[#3a3935]">{item.title}</span><span className="mt-0.5 block text-sm leading-5 text-[#6f6d68]">{item.description}</span></span></li>)}</ul></section>
}

function NextAction({ officialSource, onReviewChecklist, onBackToApplication }: { officialSource?: VisaRouteFixture; onReviewChecklist: () => void; onBackToApplication: () => void }) {
  return <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="visa-next-action-heading"><div className="rounded-2xl border border-[#e0e8f7] bg-[#f7faff] p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="visa-next-action-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Review your visa preparation checklist</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-[#5f5d57]">Confirm the current eligibility rules and prepare the documents required for your visa route.</p></div><button type="button" onClick={onReviewChecklist} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 sm:w-auto">Review visa checklist <ClipboardCheck className="size-4" /></button></div><div className="mt-4 flex flex-col gap-2 border-t border-[#dce6f7] pt-4 sm:flex-row sm:items-center sm:justify-between">{officialSource?.sourceUrl ? <a href={officialSource.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-blue-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">View official source <ExternalLink className="size-4" /></a> : <button type="button" disabled className="min-h-11 rounded-lg px-3 text-sm font-semibold text-[#aaa8a1]">Official source link being prepared</button>}<button type="button" onClick={onBackToApplication} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#d5d3ce] px-3 text-sm font-semibold text-[#3a3935] hover:border-[#aaa8a1] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">Back to application preparation <ChevronRight className="size-4" /></button></div></div></section>
}


function Fact({ term, value }: { term: string; value: string }) { return <div><dt className="text-[#8a8882]">{term}</dt><dd className="mt-0.5 font-medium leading-5 text-[#3a3935]">{value}</dd></div> }
