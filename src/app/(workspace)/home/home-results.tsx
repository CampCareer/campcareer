"use client"

import { useState, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { HomeSchoolResults } from "./home-school-results"
import { getSchoolResultsFixture } from "./home-school-fixtures"
import { HomeFieldExplorerResults } from "./home-field-explorer-results"
import { getFieldExplorerFixture } from "./home-field-fixtures"
import { HomeApplicationResults } from "./home-application-results"
import { getApplicationResultsFixture } from "./home-application-fixtures"
import { HomeVisaResults } from "./home-visa-results"
import { getVisaResultsFixture } from "./home-visa-fixtures"
import {
  getKeyRequirements,
  getPathwayFixtures,
  NEXT_STEPS_BY_STATUS,
  type NextStep,
  type PathwayFixture,
} from "./home-result-fixtures"
import {
  COUNTRY_OPTIONS,
  FIELD_OPTIONS,
  getOptionLabel,
  ORIGIN_OPTIONS,
  STATUS_OPTIONS,
  type PathwaySearchValues,
} from "./home-search-config"
import { getPathwayRouteLabel } from "./home-dashboard-config"
import { HomePathSaveFooter, HomePathSaveProvider } from "./home-path-save"

export function HomeResults({ query }: { query: PathwaySearchValues }) {
  const [actionMessage, setActionMessage] = useState("")
  const schoolFixture = getSchoolResultsFixture(query)
  const fieldExplorerFixture = getFieldExplorerFixture(query)
  const applicationFixture = getApplicationResultsFixture(query)
  const visaFixture = getVisaResultsFixture(query)
  const nextStep = NEXT_STEPS_BY_STATUS[query.status]
  const pathways = getPathwayFixtures(query)
  const requirements = getKeyRequirements(query)

  const withPathwayContext = (children: ReactNode) => (
    <HomePathSaveProvider values={query}>
      <PathwayContextSummary query={query} />
      {children}
    </HomePathSaveProvider>
  )

  if (schoolFixture) return withPathwayContext(<HomeSchoolResults fixture={schoolFixture} />)
  if (fieldExplorerFixture) return withPathwayContext(<HomeFieldExplorerResults fixture={fieldExplorerFixture} />)
  if (applicationFixture) return withPathwayContext(<HomeApplicationResults fixture={applicationFixture} />)
  if (visaFixture) return withPathwayContext(<HomeVisaResults fixture={visaFixture} />)

  return withPathwayContext(
    <section className="mx-auto max-w-5xl px-1" aria-label="Pathway search results">
      <BestNextStep nextStep={nextStep} onAction={() => setActionMessage(`${nextStep.actionLabel} will be connected in the next step.`)} />
      <RecommendedPathways pathways={pathways} />
      {pathways.length > 0 && <CostAndTime pathways={pathways} />}
      <KeyRequirements items={requirements} />
      <MainRisks />
      <OfficialSources destination={getOptionLabel(COUNTRY_OPTIONS, query.country)} />
      <HomePathSaveFooter />
      {actionMessage && <p role="status" className="pt-4 text-sm text-[#6f6d68]">{actionMessage}</p>}
    </section>
  )
}

function PathwayContextSummary({ query }: { query: PathwaySearchValues }) {
  const origin = getOptionLabel(ORIGIN_OPTIONS, query.origin) || "Starting country not set"
  const destination = getOptionLabel(COUNTRY_OPTIONS, query.country)
  const field = getOptionLabel(FIELD_OPTIONS, query.field)
  const situation = getOptionLabel(STATUS_OPTIONS, query.status)
  const route = getPathwayRouteLabel(query)

  return (
    <section className="mx-auto max-w-5xl px-1 pt-5" aria-labelledby="pathway-overview-heading">
      <div className="rounded-2xl border border-[#dce6f7] bg-[#f7faff] p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Pathway overview</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 id="pathway-overview-heading" className="text-2xl font-semibold tracking-[-0.03em] text-[#1b1b1b] sm:text-3xl">
              {origin} <span aria-hidden="true">→</span> {destination}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#4a4842]">{field} <span aria-hidden="true">·</span> {situation}</p>
          </div>
          {!query.origin && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">Add a starting country before saving</span>}
        </div>
        <dl className="mt-5 grid gap-3 border-t border-[#dce6f7] pt-4 md:grid-cols-3">
          <div><dt className="text-xs font-medium text-[#7a7770]">Route</dt><dd className="mt-1 text-sm font-semibold leading-6 text-[#3a3935]">{route}</dd></div>
          <div><dt className="text-xs font-medium text-[#7a7770]">What to verify</dt><dd className="mt-1 text-sm leading-6 text-[#4a4842]">Eligibility, total cost, timing and current rules.</dd></div>
          <div><dt className="text-xs font-medium text-[#7a7770]">Evidence standard</dt><dd className="mt-1 text-sm leading-6 text-[#4a4842]">Use the official authority, provider and regulator sources shown in the result.</dd></div>
        </dl>
        <p className="mt-4 rounded-xl border border-[#e7e6e3] bg-white px-3 py-2 text-sm leading-6 text-[#5f5d57]">
          Nationality, qualifications and changing regulations can affect eligibility. Treat costs and timing as planning estimates until the official source confirms them.
        </p>
      </div>
    </section>
  )
}

function BestNextStep({ nextStep, onAction }: { nextStep: NextStep; onAction: () => void }) {
  return (
    <section className="py-9" aria-labelledby="next-step-heading">
      <p className="text-sm font-semibold text-blue-700">Your best next step</p>
      <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <h2 id="next-step-heading" className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1b1b]">{nextStep.title}</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#6f6d68]">{nextStep.description}</p>
        </div>
        <button
          type="button"
          data-action-target={nextStep.actionTarget}
          onClick={onAction}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"
        >
          {nextStep.actionLabel} <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  )
}

function RecommendedPathways({ pathways }: { pathways: readonly PathwayFixture[] }) {
  return (
    <section id="recommended-pathways" className="border-t border-[#e7e6e3] py-9" aria-labelledby="recommended-pathways-heading">
      <h2 id="recommended-pathways-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Recommended pathways</h2>
      {pathways.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {pathways.map((pathway) => (
            <article key={pathway.type} className="flex min-h-64 flex-col rounded-2xl border border-[#e7e6e3] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">{pathway.type}</p>
              <h3 className="mt-3 text-[17px] font-semibold leading-6 text-[#1b1b1b]">{pathway.title}</h3>
              <dl className="mt-5 space-y-3 text-sm">
                <div><dt className="text-[#8a8882]">Estimated cost</dt><dd className="mt-0.5 font-medium text-[#3a3935]">{pathway.cost}</dd></div>
                <div><dt className="text-[#8a8882]">Estimated time</dt><dd className="mt-0.5 font-medium text-[#3a3935]">{pathway.time}</dd></div>
                <div><dt className="text-[#8a8882]">Key requirement</dt><dd className="mt-0.5 font-medium text-[#3a3935]">{pathway.requirement}</dd></div>
              </dl>
              <button type="button" className="mt-auto pt-5 text-left text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">
                View details
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p role="status" className="mt-4 rounded-xl border border-dashed border-[#dfddd8] px-4 py-3 text-sm text-[#6f6d68]">
          Detailed route recommendations for this selection are being prepared. Use the requirements, risks and official checks below before making a decision.
        </p>
      )}
    </section>
  )
}

function CostAndTime({ pathways }: { pathways: readonly PathwayFixture[] }) {
  return (
    <section className="border-t border-[#e7e6e3] py-9" aria-labelledby="cost-time-heading">
      <h2 id="cost-time-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Cost and time</h2>
      <dl className="mt-4 divide-y divide-[#eceae6] border-y border-[#eceae6]">
        {pathways.map((pathway) => (
          <div key={pathway.type} className="grid gap-2 py-3 text-sm sm:grid-cols-[minmax(0,1.6fr)_1fr_0.8fr] sm:items-center sm:gap-4">
            <dt className="font-medium text-[#3a3935]">{pathway.title}</dt>
            <dd><span className="text-[#8a8882] sm:hidden">Estimated cost: </span>{pathway.cost}</dd>
            <dd><span className="text-[#8a8882] sm:hidden">Estimated time: </span>{pathway.time}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function KeyRequirements({ items }: { items: readonly string[] }) {
  return (
    <section id="key-requirements" className="border-t border-[#e7e6e3] py-9" aria-labelledby="requirements-heading">
      <h2 id="requirements-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Key requirements</h2>
      <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {items.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#4a4842]"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />{item}</li>)}
      </ul>
    </section>
  )
}

function MainRisks() {
  const risks = [
    "Visa, sponsorship, registration or licensing rules can change before you apply.",
    "Your previous qualification or experience may not be recognised in full.",
    "Published tuition, fees, processing times and living costs may change.",
  ]
  return (
    <section id="main-risks" className="border-t border-[#e7e6e3] py-9" aria-labelledby="main-risks-heading">
      <h2 id="main-risks-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Main risks</h2>
      <ul className="mt-4 space-y-3">
        {risks.map((risk) => <li key={risk} className="rounded-xl border border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 text-sm leading-6 text-[#4a4842]">{risk}</li>)}
      </ul>
    </section>
  )
}

function OfficialSources({ destination }: { destination: string }) {
  return (
    <section id="official-sources" className="border-t border-[#e7e6e3] py-9" aria-labelledby="official-sources-heading">
      <h2 id="official-sources-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Official sources to check</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        <li className="rounded-xl border border-[#e7e6e3] p-4 text-sm leading-6 text-[#4a4842]"><span className="block font-semibold text-[#1b1b1b]">Immigration authority</span>{destination} visa and work eligibility rules.</li>
        <li className="rounded-xl border border-[#e7e6e3] p-4 text-sm leading-6 text-[#4a4842]"><span className="block font-semibold text-[#1b1b1b]">Education provider</span>Current entry requirements, tuition and program dates.</li>
        <li className="rounded-xl border border-[#e7e6e3] p-4 text-sm leading-6 text-[#4a4842]"><span className="block font-semibold text-[#1b1b1b]">Professional regulator</span>Recognition, registration and licensing requirements where applicable.</li>
      </ul>
      <p className="mt-3 text-sm leading-6 text-[#6f6d68]">Direct links are displayed when CampCareer has a reviewed source for the selected route.</p>
    </section>
  )
}
