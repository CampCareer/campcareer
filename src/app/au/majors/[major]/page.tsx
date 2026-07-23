import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, ExternalLink, GraduationCap, MapPinned, ShieldCheck, TrendingUp, WalletCards } from "lucide-react"
import { getStudyConcept, STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { AU_CONCEPT_OCCUPATIONS } from "@/data/au-major-occupation-map"
import costsSnapshot from "@/data/au-major-costs.json"
import { formatOutlook, formatSalaryRange, getAuMajorSignal, prBadge, shortageLabel, shortageLevel } from "@/lib/au-major-signals"
import { pageMetadata } from "@/lib/seo"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { SavedStudyConceptButton } from "@/components/saved/saved-study-concept-button"

export const revalidate = 86400

type CostProvider = {
  name: string
  qsRank?: number
  bachelorFeeAud?: number
  feeAud?: number
  duration?: number
}

type CostProfile = {
  universities?: CostProvider[]
  diplomaOptions?: CostProvider[]
  notes?: string
}

type Params = { major: string }

const COSTS = costsSnapshot as Record<string, CostProfile>

export function generateStaticParams() {
  return STUDY_CONCEPTS.map((concept) => ({ major: concept.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { major } = await params
  const concept = getStudyConcept(major)
  if (!concept) return { title: "Major not found" }
  return pageMetadata({
    title: `${concept.label} in Australia — Courses, Jobs, Salary & PR`,
    description: `Plan a ${concept.label} pathway in Australia: qualification options, course costs, linked occupations, shortage signals, salary range and PR considerations.`,
    path: `/au/majors/${concept.slug}`,
  })
}

export default async function AustralianMajorDetailPage({ params }: { params: Promise<Params> }) {
  const { major } = await params
  const concept = getStudyConcept(major)
  if (!concept) notFound()
  if (major !== concept.slug) permanentRedirect(`/au/majors/${concept.slug}`)

  const signal = getAuMajorSignal(concept.id)
  const pathway = AU_CONCEPT_OCCUPATIONS.find((item) => item.conceptId === concept.id)
  const costs = COSTS[concept.id]
  const category = STUDY_CATEGORIES.find((item) => item.id === concept.category)
  const { Icon, tone } = getStudyCategoryVisual(concept.category)
  const shortage = shortageLevel(signal?.shortage_national_pct ?? null)
  const pr = prBadge(signal?.pr_score ?? null)
  const providers = [...(costs?.universities ?? []), ...(costs?.diplomaOptions ?? [])].slice(0, 6)
  const annualFees = providers.map((provider) => provider.bachelorFeeAud ?? provider.feeAud).filter((fee): fee is number => typeof fee === "number")
  const feeRange = annualFees.length ? `${money(Math.min(...annualFees))}–${money(Math.max(...annualFees))}/yr` : "Check provider"

  return <main className="min-h-screen bg-slate-50">
    <section className="relative overflow-hidden au-discovery-hero">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <Link href="/au/majors" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to majors</Link>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3"><span className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span><p className="text-sm font-semibold text-blue-100">Australia · {category?.label ?? "Major pathway"}</p></div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{concept.label}</h1>
            <p className="mt-3 text-base leading-7 text-blue-50">{concept.description}</p>
          </div>
          <div className="flex flex-wrap gap-2"><SavedStudyConceptButton concept={{ slug: concept.slug, label: concept.label, labelKo: concept.labelKo, category: concept.category }} /><Link href={`/au/study/programs/${concept.slug}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 hover:bg-blue-50">View verified programs <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-6 sm:py-10">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={BriefcaseBusiness} label="Shortage signal" value={shortageLabel(shortage, false)} detail={signal?.shortage_national_pct != null ? `${signal.shortage_national_pct}% of mapped occupations` : "Not available"} tone={shortage === "critical" ? "text-red-700" : shortage === "high" ? "text-orange-700" : "text-slate-700"} />
        <Metric icon={WalletCards} label="Typical salary" value={formatSalaryRange(signal?.salary_min_aud ?? null, signal?.salary_max_aud ?? null) || "Not available"} detail={signal?.salary_median_aud ? `Median ${money(signal.salary_median_aud)}` : "Mapped occupation range"} />
        <Metric icon={TrendingUp} label="2035 outlook" value={formatOutlook(signal?.outlook_2035_change_pct ?? null) || "Not available"} detail={signal?.outlook_direction ? `${signal.outlook_direction} employment outlook` : "Employment projection"} tone="text-emerald-700" />
        <Metric icon={ShieldCheck} label="PR pathway signal" value={pr.label} detail={signal?.pr_note ?? "Check current visa settings"} tone={pr.className.includes("emerald") ? "text-emerald-700" : pr.className.includes("blue") ? "text-blue-700" : "text-slate-700"} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">Credentials & pathway</h2></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Fact label="Pathway type" value={humanize(concept.kind)} />
            <Fact label="Typical duration" value={pathway ? `${pathway.durationYears.min}${pathway.durationYears.min !== pathway.durationYears.max ? `–${pathway.durationYears.max}` : ""} years` : "Check provider"} />
            <Fact label="Qualification options" value={pathway?.qualificationTypes.join(" · ") ?? "Check provider"} />
            <Fact label="Related education fields" value={pathway?.broadFields.map(stripCode).join(" · ") ?? "Check provider"} />
          </div>
          {costs?.notes && <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">{costs.notes}</p>}
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2"><WalletCards className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">Cost snapshot</h2></div>
          <p className="mt-4 text-2xl font-semibold text-slate-950">{feeRange}</p>
          <p className="mt-1 text-sm text-slate-500">Indicative annual international tuition from the current snapshot.</p>
          <Link href={`/au/study/programs/${concept.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">Check current CRICOS programs <ExternalLink className="h-4 w-4" /></Link>
        </aside>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">Where this major can lead</h2></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(signal?.representative_occupations?.length ? signal.representative_occupations : pathway?.representativeOccupations ?? []).map((occupation) => <Link key={occupation.oscaCode} href={`/au/jobs/${occupation.oscaCode}`} className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"><p className="text-xs font-semibold tracking-wide text-blue-700">OSCA {occupation.oscaCode}</p><h3 className="mt-1 font-semibold text-slate-950">{occupation.label}</h3><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-700">View occupation <ArrowRight className="h-4 w-4" /></span></Link>)}</div>
      </section>

      {providers.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4"><div><div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">Indicative providers & tuition</h2></div><p className="mt-1 text-sm text-slate-500">Use these as a cost benchmark; open verified listings before applying.</p></div><Link href={`/au/study/programs/${concept.slug}`} className="hidden text-sm font-semibold text-blue-700 hover:text-blue-800 sm:inline-flex sm:items-center sm:gap-1">Programs <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="pb-3 pr-4 font-semibold">Provider</th><th className="pb-3 pr-4 font-semibold">Annual tuition</th><th className="pb-3 pr-4 font-semibold">Typical duration</th><th className="pb-3 font-semibold">QS rank</th></tr></thead><tbody className="divide-y divide-slate-100">{providers.map((provider) => <tr key={provider.name}><td className="py-4 pr-4 font-semibold text-slate-900">{provider.name}</td><td className="py-4 pr-4 text-slate-700">{money(provider.bachelorFeeAud ?? provider.feeAud)}</td><td className="py-4 pr-4 text-slate-700">{provider.duration ? `${provider.duration} years` : "—"}</td><td className="py-4 text-slate-700">{provider.qsRank ? `#${provider.qsRank}` : "—"}</td></tr>)}</tbody></table></div>
      </section>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm sm:p-6">
        <h2 className="font-semibold text-slate-950">Data status</h2>
        <p className="mt-2">Labour-market signals are derived from the mapped occupations, not a guarantee of a job, visa or admission result. Verify current course fees, CRICOS registration, licensing and visa eligibility with the relevant provider and regulator.</p>
        <div className="mt-4 flex flex-wrap gap-2">{(signal?.data_sources ?? []).map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-700">{source.name}<ExternalLink className="ml-1 inline h-3 w-3" /></a>)}<span className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">Cost snapshot · CRICOS and provider fee schedules</span>{signal?.last_verified && <span className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">Verified {signal.last_verified}</span>}</div>
      </section>
    </div>
  </main>
}

function Metric({ icon: Icon, label, value, detail, tone = "text-slate-950" }: { icon: typeof BriefcaseBusiness; label: string; value: string; detail: string; tone?: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-blue-700" /><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1 text-lg font-semibold ${tone}`}>{value}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></article>
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{value}</p></div>
}

function money(value: number | undefined) {
  return value ? `A$${Math.round(value).toLocaleString()}` : "—"
}

function humanize(value: string) {
  return value.split("_").map((word) => word[0] + word.slice(1).toLowerCase()).join(" ")
}

function stripCode(value: string) {
  return value.replace(/^\d+\s*-\s*/, "")
}
