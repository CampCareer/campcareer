import Link from "next/link"
import { ArrowRight, Compass, RefreshCw } from "lucide-react"
import {
  formatPathwayDate,
  getPathwayStages,
  getStageIndex,
  STATUS_ACTIONS,
  type DashboardPathway,
} from "./home-dashboard-config"

type HomeDashboardProps = { pathways: DashboardPathway[]; loadError?: boolean }

const exploreHref = "/home?mode=explore"
const primaryLink = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"
const secondaryLink = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d5d3ce] bg-white px-4 text-sm font-semibold text-[#3a3935] transition hover:border-[#aaa8a1] hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"

function resultHref(pathway: DashboardPathway, anchor?: string) {
  return pathway.isComplete ? `${pathway.href}${anchor ?? ""}` : pathway.href
}

export function HomeDashboard({ pathways, loadError = false }: HomeDashboardProps) {
  const primary = pathways[0]
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <header className="flex flex-col gap-5 border-b border-[#e7e6e3] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1b1b1b] sm:text-4xl">Your pathway dashboard</h1>
          <p className="mt-2 text-[15px] leading-6 text-[#6f6d68]">Continue your selected route and see the next actions that matter.</p>
        </div>
        <Link href={exploreHref} className={secondaryLink}>Explore another pathway <Compass className="size-4" aria-hidden="true" /></Link>
      </header>
      {loadError ? <DashboardError /> : !primary ? <DashboardEmpty /> : <DashboardContent pathways={pathways} />}
    </main>
  )
}

function DashboardError() {
  return (
    <section className="mt-7 rounded-2xl border border-[#e7e6e3] bg-[#fafaf9] p-5 sm:p-6" aria-labelledby="dashboard-error-heading">
      <h2 id="dashboard-error-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">We couldn’t load your saved pathways.</h2>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href={exploreHref} className={primaryLink}><RefreshCw className="size-4" aria-hidden="true" />Try again</Link>
        <Link href={exploreHref} className={secondaryLink}>Explore a pathway</Link>
      </div>
    </section>
  )
}

function DashboardEmpty() {
  return (
    <section className="mt-7 rounded-2xl border border-[#e7e6e3] bg-[#fafaf9] p-5 sm:p-6" aria-labelledby="dashboard-empty-heading">
      <h2 id="dashboard-empty-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">No saved pathways yet</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6f6d68]">Choose your citizenship, a country and an occupation category to create your first pathway.</p>
      <Link href={exploreHref} className={`mt-5 ${primaryLink}`}>Find a pathway <ArrowRight className="size-4" aria-hidden="true" /></Link>
    </section>
  )
}

function DashboardContent({ pathways }: { pathways: DashboardPathway[] }) {
  const primary = pathways[0]
  const actions = STATUS_ACTIONS[primary.values.status]
  const stages = getPathwayStages(primary.values.status)
  const currentStage = getStageIndex(primary.values.status)
  const primaryLabel = primary.isComplete ? actions.primaryLabel : "Add starting country"

  return (
    <div className="space-y-7 pt-7 sm:space-y-8 sm:pt-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-2xl border border-[#dce6f7] bg-[#f7faff] p-5 sm:p-6" aria-labelledby="my-goal-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="my-goal-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">My pathway</h2>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blue-700">Current</span>
          </div>
          <p className="mt-5 text-xl font-semibold tracking-[-0.025em] text-[#1b1b1b]">{primary.originLabel} <span aria-hidden="true">→</span> {primary.countryLabel}</p>
          <p className="mt-1 text-base text-[#4a4842]">{primary.fieldLabel}</p>
          <div className="mt-5 rounded-xl border border-[#dce6f7] bg-white/80 p-3.5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#7a7770]">Selected route</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#3a3935]">{primary.routeLabel}</p>
          </div>
          {!primary.isComplete && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
              This pathway was saved before starting countries were recorded. Add yours to complete the pathway.
            </p>
          )}
          <dl className="mt-5 border-t border-[#dce6f7] pt-5 text-sm">
            <div><dt className="font-medium text-[#6f6d68]">Last updated</dt><dd className="mt-1 font-semibold text-[#3a3935]">{formatPathwayDate(primary.updatedAt)}</dd></div>
          </dl>
          <Link href={resultHref(primary, actions.primaryAnchor)} className={`mt-6 w-full sm:w-auto ${primaryLink}`} aria-label={`${primaryLabel}: ${primary.originLabel} to ${primary.countryLabel}, ${primary.fieldLabel}`}>
            {primaryLabel} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>

        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6" aria-labelledby="current-stage-heading">
          <h2 id="current-stage-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Current stage</h2>
          <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Pathway stages">
            {stages.map((stage, index) => {
              const isCurrent = index === currentStage
              return (
                <li key={stage.id} className={`min-h-24 rounded-xl border p-3 ${isCurrent ? "border-blue-200 bg-blue-50" : "border-[#e7e6e3] bg-[#fafaf9]"}`}>
                  <span className={`grid size-6 place-items-center rounded-full text-xs font-semibold ${isCurrent ? "bg-blue-600 text-white" : "bg-white text-[#6f6d68]"}`}>{index + 1}</span>
                  <span className="mt-3 block text-sm font-semibold leading-5 text-[#3a3935]">{stage.label}</span>
                  {isCurrent && <span className="mt-1 block text-xs font-semibold text-blue-700">Current</span>}
                </li>
              )
            })}
          </ol>
        </section>
      </div>

      <section className="border-t border-[#e7e6e3] pt-7 sm:pt-8" aria-labelledby="next-actions-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="next-actions-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Your next actions</h2>
            <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Continue from the current stage of this route.</p>
          </div>
          <Link href={resultHref(primary, actions.primaryAnchor)} className={primaryLink}>{primaryLabel} <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {actions.actions.map((action, index) => (
            <li key={action.label}>
              <Link href={resultHref(primary, action.anchor)} className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e7e6e3] bg-white px-4 text-sm font-semibold text-[#3a3935] transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f3f2ef] text-xs text-[#6f6d68]">{index + 1}</span>
                {primary.isComplete ? action.label : "Complete pathway details"}
                <ArrowRight className="ml-auto size-4 shrink-0 text-blue-700" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[#e7e6e3] pt-7 sm:pt-8" aria-labelledby="saved-pathways-heading">
        <h2 id="saved-pathways-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Saved pathways</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pathways.slice(0, 6).map((pathway, index) => (
            <li key={pathway.id} className="rounded-2xl border border-[#e7e6e3] bg-white p-4 shadow-[0_8px_20px_-20px_rgba(27,27,27,0.45)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-base font-semibold text-[#1b1b1b]">{pathway.originLabel} <span aria-hidden="true">→</span> {pathway.countryLabel}</p>
                {index === 0 && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Current</span>}
              </div>
              <p className="mt-2 text-sm font-semibold text-[#4a4842]">{pathway.fieldLabel}</p>
              <p className="mt-2 text-sm leading-5 text-[#6f6d68]">{pathway.routeLabel}</p>
              <p className="mt-2 text-sm text-[#6f6d68]">Updated {formatPathwayDate(pathway.updatedAt)}</p>
              <Link href={resultHref(pathway)} className={`mt-4 w-full ${secondaryLink}`} aria-label={`Continue ${pathway.originLabel} to ${pathway.countryLabel} ${pathway.fieldLabel} pathway`}>
                {pathway.isComplete ? "Continue" : "Complete details"} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
