"use client"

import Link from "next/link"
import { ExternalLink, ArrowRight, MapPin, DollarSign, Star } from "lucide-react"
import type { OccupationDetail } from "./sample-data"
import JobListings from "@/app/map/JobListings"
import type { AuOfficialOccupationContent } from "@/lib/au-osca-content"

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
  onCSOL: boolean
  stateShortages: { state: string; rating: number }[]
  relatedCourses: RelatedCourse[]
  dataNote: string | null
  officialContent: AuOfficialOccupationContent | null
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

function OutlookBar({ level, maxLevel = 5 }: { level: number; maxLevel?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxLevel }, (_, i) => (
        <div key={i} className={`h-5 w-7 rounded-sm ${i < level ? "bg-blue-600" : "bg-slate-200"}`} />
      ))}
    </div>
  )
}

export function OccupationDetailClient({ detail, salary, shortageRating, onCSOL, stateShortages, relatedCourses, dataNote, officialContent }: Props) {
  const stateMap = new Map(stateShortages.map((s) => [s.state, s.rating]))

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

      {/* H1 + Meta */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-8 pt-6 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {detail.name} — Australia
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>OSCA {detail.anzscoCode}</span>
            <span>·</span>
            <span>Updated: {detail.lastVerified}</span>
            <span>·</span>
            <span>Sources: {detail.sources.join(", ")}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {/* Snapshot Card */}
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          {/* Shortage Now */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shortage Now</h2>
            <div className="mt-3 flex items-center">
              {shortageRating != null ? (
                <>
                  <ShortageStars rating={shortageRating} />
                  <ShortageLabel rating={shortageRating} />
                </>
              ) : (
                <span className="text-sm text-slate-400">No rating available</span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">by region</p>
            <div className="mt-4 space-y-2">
              {stateShortages.length > 0 ? AU_STATES.map((state) => {
                const rating = stateMap.get(state)
                return (
                  <div key={state} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{state}</span>
                    {rating != null ? (
                      <ShortageStars rating={rating} />
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </div>
                )
              }) : <p className="text-sm leading-5 text-slate-400">State-level shortage data is not yet published for this occupation.</p>}
            </div>
          </div>

          {/* Snapshot details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
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
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700"><Star className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-500">Shortage signal</p>
                  <p className="text-lg font-semibold text-slate-950">
                    {shortageRating != null ? `${["", "LOW", "MODERATE", "SHORTAGE", "HIGH", "CRITICAL"][shortageRating]} (national)` : "Not rated"}
                  </p>
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

        {/* Skills Map + Credentials */}
        <div className="grid gap-5 lg:grid-cols-2">
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
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
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
              {relatedCourses.length > 0 && <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Related study options</p>
                <div className="mt-2 space-y-2">
                  {relatedCourses.map((course) => (
                    course.courseUrl ? <a key={course.id} href={course.courseUrl} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-blue-700 hover:underline">
                      {course.title}{course.durationYears ? ` · ${course.durationYears} years` : ""}
                    </a> : <p key={course.id} className="text-sm text-slate-700">{course.title}{course.durationYears ? ` · ${course.durationYears} years` : ""}</p>
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
        </section>

        {dataNote && <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Data status</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{dataNote}</p>
        </section>}

        {/* 3-year outlook */}
        {detail.outlook && <section className="rounded-2xl border border-slate-200 bg-white p-5">
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

        {/* For employers CTA */}
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-slate-950">For employers & training providers</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Want this occupation data for your industry or workforce plan?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Generate a PDF report with role priority, skill gaps, salary pressure and action plan for your region.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/support/request" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              Request a Pilot Report <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/methodology" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              See sample report
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
