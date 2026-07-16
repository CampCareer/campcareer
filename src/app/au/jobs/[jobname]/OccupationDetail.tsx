"use client"

import Link from "next/link"
import { ExternalLink, ArrowRight, ArrowUpRight, BriefcaseBusiness, GraduationCap, MapPin, DollarSign, Star } from "lucide-react"
import type { OccupationDetail } from "./sample-data"
import JobListings from "@/app/map/JobListings"
import { AffiliateCtas } from "@/components/partners/partner-cta"
import type { AuOfficialOccupationContent } from "@/lib/au-osca-content"
import type { AuJsaOslRating } from "@/lib/au-jsa-osl"

type RelatedCourse = {
  id: number
  title: string
  courseUrl: string | null
  durationYears: number | null
}

type Props = {
  detail: OccupationDetail
  salary: number | null
  shortageRating: number | null
  nationalJsaRating: AuJsaOslRating | null
  onCSOL: boolean
  stateShortages: { state: string; rating?: number; jsaRating?: AuJsaOslRating }[]
  relatedCourses: RelatedCourse[]
  dataNote: string | null
  officialContent: AuOfficialOccupationContent | null
  careerCategory: { name: string; icon: string } | null
  jsaProfile: { employment_total: number | null; part_time_share_pct: number | null; female_share_pct: number | null; median_age: number | null; full_time_share_pct: number | null; average_full_time_hours: number | null; state_distribution: { name: string; share: number }[]; education_distribution: { name: string; share: number }[]; industries: { name: string; share?: number }[] } | null
  jsaPathways: { qualification_code: string; qualification_title: string; pathway_type: string; licensing_required: boolean; licensing_may_be_required: boolean }[]
  shortageDriver: string | null
  vacancies: { state: string; period: string; vacancy_count: number | null; index_value: number | null; series: string }[]
  outlook: { period_start: string; period_end: string; employment_start: number | null; employment_end: number | null; employment_change: number | null; employment_change_pct: number | null; geography: string }[]
  regionalEmployment: { state: string | null; sa4_name: string | null; employment_total: number | null; annual_change: number | null; annual_change_pct: number | null }[]
  mobility: {
    stock: { financial_year: string; worker_stock: number; stock_delta: number | null; inflow: number | null; outflow: number | null } | null
    paths: { oscaCode: string; title: string; href: string; workerCount: number; nationalShortage: string | null; outlook2035Pct: number | null; onCsol: boolean }[]
  }
}

const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

function ShortageStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
      ))}
    </span>
  )
}

function ShortageLabel({ rating }: { rating: number }) {
  const labels: Record<number, string> = { 1: "Limited", 2: "Moderate", 3: "Shortage", 4: "Strong shortage", 5: "Critical shortage" }
  return <span className="ml-2 text-sm font-semibold text-slate-900">{labels[rating] ?? "—"}</span>
}

const JSA_LABELS: Record<AuJsaOslRating, string> = {
  S: "Shortage",
  M: "Metropolitan shortage",
  R: "Regional shortage",
  NS: "No shortage",
}

function JsaRatingBadge({ rating }: { rating: AuJsaOslRating }) {
  const className = rating === "S"
    ? "border-rose-200 bg-rose-50 text-rose-800"
    : rating === "M"
      ? "border-violet-200 bg-violet-50 text-violet-800"
      : rating === "R"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-slate-50 text-slate-500"
  return <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${className}`}>{JSA_LABELS[rating]}</span>
}

function OutlookBar({ level, maxLevel = 5 }: { level: number; maxLevel?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxLevel }, (_, i) => (
        <div key={i} className={`h-5 w-7 rounded-sm ${i < level ? "bg-blue-600" : "bg-slate-200"}`} />
      ))}
    </div>
  )
}

const DRIVER_LABELS: Record<string, string> = { long_training_gap: "Long training gap", short_training_gap: "Short training gap", suitability_gap: "Suitability gap", retention_gap: "Retention gap", uncertain: "Cause still uncertain" }
const PATHWAY_LABELS: Record<string, string> = { occupation_ready: "Occupation ready", specialised_training: "Specialised training", progression_pathway: "Progression pathway", pre_vocational: "Pre-vocational", transferable: "Transferable skills" }

export function OccupationDetailClient({ detail, salary, shortageRating, nationalJsaRating, onCSOL, stateShortages, relatedCourses, dataNote, officialContent, careerCategory, jsaProfile, jsaPathways, shortageDriver, vacancies, outlook, regionalEmployment, mobility }: Props) {
  const stateMap = new Map(stateShortages.map((s) => [s.state, s]))
  const visibleStateShortages = AU_STATES
    .map((state) => ({ state, shortage: stateMap.get(state) }))
    .filter(({ shortage }) => shortage && shortage.jsaRating !== "NS")
  const hasShortageSignal = nationalJsaRating != null || shortageRating != null
  const shortageCardMuted = !hasShortageSignal || (nationalJsaRating === "NS" && visibleStateShortages.length === 0)
  const largestRegionalEmployment = Math.max(...regionalEmployment.map((region) => region.employment_total ?? 0), 1)
  const leadingRegion = regionalEmployment[0]
  const mapsHref = `/maps?country=au&state=NSW&occ=${encodeURIComponent(detail.anzscoCode)}`

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      {/* Breadcrumb */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/au" className="hover:text-slate-900">Australia</Link>
            <span>/</span>
            <Link href="/au/jobs" className="hover:text-slate-900">Jobs</Link>
            <span>/</span>
            <span className="text-slate-900">{detail.name}</span>
          </nav>
        </div>
      </section>

      {/* H1 */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-8 pt-6 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {detail.name}
          </h1>
          {careerCategory && <div className="mt-3"><span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-sm font-medium text-blue-800"><BriefcaseBusiness className="h-3.5 w-3.5" />{careerCategory.name}</span></div>}
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {/* Snapshot Card */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Shortage Now */}
          <div className={"order-last rounded-2xl border p-5 " + (shortageCardMuted ? "border-slate-200 bg-slate-100" : "border-slate-200 bg-white")}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shortage Now</h2>
            <div className="mt-3 flex items-center">
              {nationalJsaRating ? (
                <JsaRatingBadge rating={nationalJsaRating} />
              ) : shortageRating != null ? (
                <>
                  <ShortageStars rating={shortageRating} />
                  <ShortageLabel rating={shortageRating} />
                </>
              ) : (
                <span className="text-sm font-medium text-slate-600">No current shortage signal</span>
              )}
            </div>
            {!hasShortageSignal && <p className="mt-3 text-sm leading-5 text-slate-600">No national or state shortage rating is currently published for this occupation.</p>}
            {nationalJsaRating === "NS" && visibleStateShortages.length === 0 && <p className="mt-3 text-sm leading-5 text-slate-600">JSA currently reports no national or state/territory shortage signal for this occupation.</p>}
            {stateShortages.length === 0 ? (
              <p className="mt-4 text-sm leading-5 text-slate-400">State-level shortage data is not yet published for this occupation.</p>
            ) : visibleStateShortages.length > 0 && <>
              <p className="mt-1 text-xs text-slate-400">{nationalJsaRating ? "JSA 2025 · states / territories with a shortage signal" : "by region"}</p>
              <div className="mt-4 space-y-2">
                {visibleStateShortages.map(({ state, shortage }) => (
                  <div key={state} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{state}</span>
                    {shortage?.jsaRating ? (
                      <JsaRatingBadge rating={shortage.jsaRating} />
                    ) : shortage?.rating != null ? (
                      <ShortageStars rating={shortage.rating} />
                    ) : null}
                  </div>
                ))}
              </div>
            </>}
            {shortageDriver && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600"><span className="font-semibold text-slate-800">Why this shortage:</span> {DRIVER_LABELS[shortageDriver] ?? shortageDriver} <span className="text-slate-400">· JSA ANZSCO unit group</span></p>}
          </div>

          {/* Snapshot details */}
          <div className="order-first rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Snapshot</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700"><DollarSign className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-500">Median salary</p>
                  <p className="text-lg font-semibold text-slate-950">{salary != null ? `A$${salary.toLocaleString()}` : "Not available"}</p>
                  {salary != null && <p className="text-xs text-slate-400">Full-time annual (JSA / ABS)</p>}
                </div>
              </div>
              {jsaProfile?.employment_total != null && <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-700"><MapPin className="h-4 w-4" /></div><div><p className="text-xs text-slate-500">People employed</p><p className="text-lg font-semibold text-slate-950">{jsaProfile.employment_total.toLocaleString()}</p><p className="text-xs text-slate-400">JSA profile · ANZSCO mapping</p></div></div>}
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700"><Star className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-500">Shortage signal</p>
                  <p className="text-lg font-semibold text-slate-950">
                    {nationalJsaRating ? `${JSA_LABELS[nationalJsaRating]} (national)` : shortageRating != null ? `${["", "LOW", "MODERATE", "SHORTAGE", "HIGH", "CRITICAL"][shortageRating]} (national)` : "Not rated"}
                  </p>
                  {nationalJsaRating && <p className="mt-1 text-xs leading-4 text-slate-400">JSA categories identify where a shortage occurs; they are not a severity score.</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-green-50 text-green-700"><MapPin className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-500">Visa pathways</p>
                  <p className="text-lg font-semibold text-slate-950">
                    {onCSOL ? "CSOL listed (verify visa)" : "Check current list"}
                  </p>
                  <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    Verify on HomeAffairs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {jsaProfile && <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Where people work</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div><h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">State / territory distribution</h3><div className="mt-3 space-y-2">{jsaProfile.state_distribution.map((item) => <div key={item.name} className="flex items-center gap-3 text-sm"><span className="w-14 font-medium text-slate-700">{item.name}</span><div className="h-2 flex-1 overflow-hidden rounded bg-slate-100"><div className="h-full rounded bg-blue-600" style={{ width: `${Math.min(item.share, 100)}%` }} /></div><span className="w-10 text-right text-slate-500">{item.share}%</span></div>)}</div></div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Education & work pattern</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                {jsaProfile.part_time_share_pct != null && <div className="rounded-lg bg-slate-50 p-3"><p className="flex items-center gap-1.5 text-xs text-slate-500"><span aria-hidden="true">⏱️</span>Part-time</p><p className="mt-1 font-semibold text-slate-950">{jsaProfile.part_time_share_pct}%</p></div>}
                {jsaProfile.female_share_pct != null && <div className="rounded-lg bg-slate-50 p-3"><p className="flex items-center gap-1.5 text-xs text-slate-500"><span aria-hidden="true">♀️</span>Female rate</p><p className="mt-1 font-semibold text-slate-950">{jsaProfile.female_share_pct}%</p></div>}
                {jsaProfile.median_age != null && <div className="rounded-lg bg-slate-50 p-3"><p className="flex items-center gap-1.5 text-xs text-slate-500"><span aria-hidden="true">🎂</span>Median age</p><p className="mt-1 font-semibold text-slate-950">{jsaProfile.median_age}</p></div>}
              </div>
              {jsaProfile.education_distribution.length > 0 && <div className="mt-5">
                <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Highest education</p><p className="text-xs text-slate-400">Share of workers</p></div>
                <div className="mt-3 space-y-3">
                  {[...jsaProfile.education_distribution].sort((a, b) => b.share - a.share).map((item) => <div key={item.name}>
                    <div className="flex items-baseline justify-between gap-3 text-xs"><span className="font-medium text-slate-700">{item.name}</span><span className="shrink-0 font-semibold text-slate-900">{item.share}%</span></div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${item.name}: ${item.share}% of workers`}><div className="h-full rounded-full bg-indigo-600" style={{ width: `${Math.min(item.share, 100)}%` }} /></div>
                  </div>)}
                </div>
              </div>}
            </div>
          </div>
          <p className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-400">JSA occupation profile data, mapped from ANZSCO</p>
        </section>}

        {regionalEmployment.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Regional demand</h2>
              <p className="mt-1 text-xs text-slate-400">Largest local employment bases · JSA NERO, June 2026</p>
            </div>
            {leadingRegion && <div className="rounded-xl bg-blue-50 px-3 py-2 text-right">
              <p className="text-xs font-semibold text-blue-700">Largest employment base</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-950">#1 {leadingRegion.sa4_name ?? "Regional area"}</p>
              <p className="text-xs text-slate-500">{leadingRegion.employment_total?.toLocaleString() ?? "—"} estimated employed</p>
            </div>}
          </div>
          <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600"><span className="font-semibold text-slate-800">How to read this:</span> longer bars show the size of the local workforce, not job vacancies. The percentage shows whether that employment base grew or fell over the year.</p>
          <ol className="mt-5 space-y-4">
            {regionalEmployment.map((region, index) => {
              const employment = region.employment_total ?? 0
              const barWidth = Math.max((employment / largestRegionalEmployment) * 100, employment > 0 ? 3 : 0)
              const annualChange = region.annual_change_pct
              return <li key={(region.state ?? "") + "-" + (region.sa4_name ?? "")} className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3">
                <span className={"grid size-9 place-items-center rounded-full text-sm font-bold " + (index === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>{index + 1}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="font-semibold text-slate-950">{region.sa4_name ?? "Regional area"}</p>
                    <p className="text-sm font-semibold text-slate-900">{employment.toLocaleString()} <span className="font-normal text-slate-500">employed</span></p>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{region.state ?? "Australia"}</p>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100" aria-label={(region.sa4_name ?? "Regional area") + ": " + employment.toLocaleString() + " estimated employed"}>
                    <div className="h-full rounded-full bg-blue-600" style={{ width: barWidth + "%" }} />
                  </div>
                </div>
                <div className="w-20 text-right text-xs">
                  {annualChange != null ? <><p className={"font-semibold " + (annualChange > 0 ? "text-emerald-700" : annualChange < 0 ? "text-rose-700" : "text-slate-600")}>{annualChange > 0 ? "+" : ""}{annualChange}%</p><p className="mt-0.5 text-slate-500">year on year</p></> : <p className="text-slate-400">No change data</p>}
                </div>
              </li>
            })}
          </ol>
        </section>}

        {(mobility.stock || mobility.paths.length > 0) && <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Possible next career moves</h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">Observed Australian worker transitions, not a personalised recommendation · JSA DOM, last available 2020–21</p>
            </div>
            {mobility.stock && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{mobility.stock.financial_year.replace("_", "–")}</span>}
          </div>
          {mobility.stock && <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Workers in this occupation</p><p className="mt-1 text-xl font-semibold text-slate-950">{mobility.stock.worker_stock.toLocaleString()}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Moved in from another occupation</p><p className="mt-1 text-xl font-semibold text-slate-950">{mobility.stock.inflow?.toLocaleString() ?? "—"}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Moved to another occupation</p><p className="mt-1 text-xl font-semibold text-slate-950">{mobility.stock.outflow?.toLocaleString() ?? "—"}</p></div>
          </div>}
          {mobility.paths.length > 0 && <div className="mt-5 grid gap-3 md:grid-cols-2">
            {mobility.paths.map((path) => <Link key={path.oscaCode} href={path.href} className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-950 group-hover:text-blue-700">{path.title}</p><p className="mt-1 text-xs text-slate-500">{path.workerCount.toLocaleString()} workers made this move in 2020–21</p></div><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" /></div>
              <div className="mt-3 flex flex-wrap gap-2">{path.nationalShortage && <JsaRatingBadge rating={path.nationalShortage as AuJsaOslRating} />}{path.outlook2035Pct != null && <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">2035 outlook {path.outlook2035Pct > 0 ? "+" : ""}{path.outlook2035Pct}%</span>}{path.onCsol && <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">CSOL listed</span>}</div>
            </Link>)}
          </div>}
          <p className="mt-4 text-xs leading-5 text-slate-400">Income-tax-return data excludes many contractors and sole traders; transitions below 10 people are not published. Current shortage and outlook labels are shown only as context for each destination.</p>
        </section>}

        {/* What you do + Skills */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* What you do */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-950">What you actually do</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{detail.description}</p>
            {detail.environments.length > 0 && <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Typical environments</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {detail.environments.map((env) => (
                  <span key={env} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{env}</span>
                ))}
              </div>
            </div>}
            {officialContent && (officialContent.alternativeTitles.length > 0 || officialContent.specialisations.length > 0) && <div className="mt-4 space-y-3">
              {officialContent.alternativeTitles.length > 0 && <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alternative titles</p>
                <p className="mt-1 text-sm text-slate-600">{officialContent.alternativeTitles.join(" · ")}</p>
              </div>}
              {officialContent.specialisations.length > 0 && <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Specialisations</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {officialContent.specialisations.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item}</span>)}
                </div>
              </div>}
            </div>}
            {officialContent?.inclusionAndExclusion && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">Scope note: {officialContent.inclusionAndExclusion}</p>}
            {detail.anzscoDescriptionUrl && <a
              href={detail.anzscoDescriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              Read official OSCA description <ExternalLink className="h-3.5 w-3.5" />
            </a>}
          </section>

          {/* Skills Map */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-950">Skills & main tasks</h2>
            {detail.skillsCore.length > 0 ? <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skills to build</h3>
              <ul className="mt-2 space-y-2">
                {detail.skillsCore.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div> : officialContent?.mainTasks.length ? <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Official main tasks</h3>
              <ul className="mt-2 space-y-2">
                {officialContent.mainTasks.map((task) => <li key={task} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />{task}</li>)}
              </ul>
            </div> : <p className="mt-4 text-sm leading-6 text-slate-500">Occupation-specific skills are being verified against an authoritative source.</p>}
            {detail.skillsEdge.length > 0 && <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nice-to-have (edge)</h3>
              <ul className="mt-2 space-y-2">
                {detail.skillsEdge.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>}
          </section>

          {/* Credentials & Pathway */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-950">Credentials & Pathway</h2>
            <div className="mt-4 space-y-4">
              {officialContent?.skillLevel != null && <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">OSCA skill level {officialContent.skillLevel}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">A classification attribute describing the occupation; it is not a personal eligibility or qualification decision.</p>
              </div>}
              {officialContent?.registrationOrLicensing && <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Registration or licensing</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{officialContent.registrationOrLicensing}</p>
              </div>}
              {detail.credentials.length > 0 ? detail.credentials.map((cred) => (
                <div key={cred.title} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{cred.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{cred.details}</p>
                </div>
              )) : <p className="text-sm leading-6 text-slate-500">Licence, registration and qualification requirements vary by employer and state. Verify requirements with the relevant regulator before enrolling or applying.</p>}
              {jsaPathways.length > 0 && <div className="border-t border-slate-100 pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Official VET pathways (JSA TOP)</p><div className="mt-2 space-y-2">{jsaPathways.map((pathway) => <div key={`${pathway.qualification_code}-${pathway.qualification_title}`} className="rounded-lg bg-blue-50 p-3 text-sm"><p className="font-semibold text-slate-900">{pathway.qualification_title}</p><p className="mt-1 text-xs text-blue-800">{PATHWAY_LABELS[pathway.pathway_type] ?? pathway.pathway_type}{pathway.licensing_required ? " · Licence / registration required" : pathway.licensing_may_be_required ? " · Licence may be required" : ""}</p></div>)}</div></div>}
              {relatedCourses.length > 0 && <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Related study options</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {relatedCourses.map((course) => (
                    course.courseUrl ? <a key={course.id} href={course.courseUrl} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                      <div className="flex items-start justify-between gap-3"><GraduationCap className="h-5 w-5 shrink-0 text-blue-600" /><ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" /></div>
                      <p className="mt-3 text-sm font-semibold leading-5 text-slate-900 group-hover:text-blue-700">{course.title}</p>
                      <p className="mt-2 text-xs text-slate-500">{course.durationYears ? `${course.durationYears} years` : "Course details"}</p>
                    </a> : <div key={course.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <GraduationCap className="h-5 w-5 text-slate-500" />
                      <p className="mt-3 text-sm font-semibold leading-5 text-slate-900">{course.title}</p>
                      <p className="mt-2 text-xs text-slate-500">{course.durationYears ? `${course.durationYears} years` : "Course details pending"}</p>
                    </div>
                  ))}
                </div>
              </div>}
            </div>
          </section>
        </div>

        {/* Real jobs right now */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Real jobs right now</h2>
            <span className="text-xs text-slate-400">Live signal from SEEK, Indeed & more</span>
          </div>
          <JobListings what={detail.name} where="Australia" country="AU" />
          <a
            href={`https://www.seek.com.au/${encodeURIComponent(detail.name)}-jobs`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            See all job ads on SEEK <ExternalLink className="h-3.5 w-3.5" />
          </a>
          {vacancies.length > 0 && <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Official vacancy signal · JSA IVI 3-month average (ANZSCO unit group)</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{vacancies.slice(0, 6).map((item) => <div key={`${item.state}-${item.period}`} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{item.state} · {new Date(item.period).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}</p><p className="mt-1 text-base font-semibold text-slate-950">{item.vacancy_count != null ? Math.round(item.vacancy_count).toLocaleString() : item.index_value != null ? item.index_value.toFixed(1) : "—"}</p></div>)}</div></div>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Data status</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Classification</dt><dd className="mt-1 font-medium text-slate-900">OSCA {detail.anzscoCode}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last updated</dt><dd className="mt-1 font-medium text-slate-900">{detail.lastVerified}</dd></div>
            <div className="sm:col-span-2 lg:col-span-1"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sources</dt><dd className="mt-1 leading-5 text-slate-700">{detail.sources.join(" · ")}</dd></div>
          </dl>
          {dataNote && <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">{dataNote}</p>}
        </section>

        {/* 3-year outlook */}
        {outlook.length > 0 ? <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-semibold text-slate-950">2030 & 2035 employment outlook</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{outlook.map((item) => <div key={item.period_end} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">to {new Date(item.period_end).getFullYear()}</p><p className="mt-1 text-xl font-semibold text-slate-950">{item.employment_change_pct != null ? `${item.employment_change_pct > 0 ? "+" : ""}${item.employment_change_pct}%` : "Not available"}</p><p className="mt-1 text-xs text-slate-500">{item.employment_change != null ? `${item.employment_change.toLocaleString()} projected jobs` : "JSA projection · ANZSCO unit group"}</p></div>)}</div></section> : detail.outlook && <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">3-year outlook</h2>
          <div className="mt-4 flex flex-wrap items-end gap-6">
            {detail.outlook.years.map((y) => (
              <div key={y.year} className="text-center">
                <OutlookBar level={y.level} />
                <p className="mt-2 text-xs font-medium text-slate-500">{y.year}</p>
              </div>
            ))}
            <span className="mb-2 text-xs text-slate-400">(forecast)</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{detail.outlook.reason}</p>
        </section>}

        {/* Regional exploration CTA */}
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-slate-950">Where could this career take you?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Compare state-level shortage signals, salary context, study options and visa information for {detail.name}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={mapsHref} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              Explore this career on Maps <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <AffiliateCtas />
      </div>
    </main>
  )
}
