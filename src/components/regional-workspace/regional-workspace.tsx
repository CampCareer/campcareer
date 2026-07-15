import Link from "next/link"
import { ArrowUpRight, Bell, BriefcaseBusiness, Building2, CheckCircle2, ExternalLink, SlidersHorizontal, WalletCards } from "lucide-react"
import { AffiliateCtas } from "@/components/partners/partner-cta"

type University = {
  name: string
  city: string
  rank: number
  website: string
}

type JobSignal = {
  code: string
  title: string
  salary: number | null
  shortage: number
  csol: boolean
  searchUrl: string | null
}

type WorkspaceParams = {
  country: string
  state: string
  city: string
  major: string
  goal: string
  scope: "city" | "state"
  jobOrder: "demand" | "salary"
  csolOnly: boolean
}

function filterHref(params: WorkspaceParams, updates: Partial<WorkspaceParams>) {
  const next = { ...params, ...updates }
  const query = new URLSearchParams({
    country: next.country,
    state: next.state,
    city: next.city,
    major: next.major,
    goal: next.goal,
    scope: next.scope,
    jobOrder: next.jobOrder,
    ...(next.csolOnly ? { csol: "1" } : {}),
  })
  return `/regional-workspace?${query}`
}

function FilterLink({ active, href, children }: { active: boolean; href: string; children: React.ReactNode }) {
  return <Link href={href} className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>{children}</Link>
}

function Metric({ label, value, note, tone = "slate" }: { label: string; value: string; note: string; tone?: "slate" | "blue" | "amber" }) {
  const tones = { slate: "border-slate-200 bg-white", blue: "border-blue-200 bg-blue-50", amber: "border-amber-200 bg-amber-50" }
  return <section className={`rounded-xl border p-4 ${tones[tone]}`}><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs leading-5 text-slate-500">{note}</p></section>
}

export function RegionalWorkspace({
  params,
  stateName,
  majorLabel,
  goalLabel,
  universities,
  universityNote,
  jobs,
  jobNote,
  rentSource,
}: {
  params: WorkspaceParams
  stateName: string
  majorLabel: string
  goalLabel: string
  universities: University[]
  universityNote: string
  jobs: JobSignal[]
  jobNote: string
  rentSource: { name: string; url: string; checkedAt: string }
}) {
  return <main className="min-h-screen bg-slate-50">
    <div className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">CampCareer ROI workspace</p><h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{params.city}, {stateName}</h1></div><Link href={`/countries/search?country=${params.country}&major=${params.major}&goal=${params.goal}`} className="text-sm font-semibold text-slate-600 hover:text-blue-700">Change destination</Link></div></div>
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[220px_minmax(0,1fr)_270px]">
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 xl:sticky xl:top-5"><div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-blue-700" /><h2 className="font-semibold text-slate-950">Filters</h2></div><div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">School scope</p><div className="mt-2 space-y-1"><FilterLink active={params.scope === "city"} href={filterHref(params, { scope: "city" })}>In {params.city}</FilterLink><FilterLink active={params.scope === "state"} href={filterHref(params, { scope: "state" })}>All {stateName}</FilterLink></div></div><div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">Career signal</p><div className="mt-2 space-y-1"><FilterLink active={params.jobOrder === "demand"} href={filterHref(params, { jobOrder: "demand" })}>Strongest shortage</FilterLink><FilterLink active={params.jobOrder === "salary"} href={filterHref(params, { jobOrder: "salary" })}>Higher median salary</FilterLink><FilterLink active={params.csolOnly} href={filterHref(params, { csolOnly: !params.csolOnly })}>CSOL pathways only</FilterLink></div></div><div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-blue-950"><Bell className="h-4 w-4" />Job alert</div><p className="mt-2 text-xs leading-5 text-blue-900">Live-listing alerts activate once a job-board provider is connected. Your current focus is shown here so the alert can inherit it.</p><p className="mt-2 text-xs font-medium text-blue-800">{majorLabel} · {params.city}</p></div></aside>

      <section className="min-w-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-slate-600">Focused on <span className="font-semibold text-slate-900">{majorLabel}</span> · {goalLabel}</p><p className="mt-1 text-sm text-slate-500">Compare local study options with verified employment signals before committing to a path.</p></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-3.5 w-3.5" />Australia workspace</span></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric label="City rent benchmark" value="Source pending" note="A city-level rent figure will appear only after a verified feed is connected." tone="amber" /><Metric label="University options" value={`${universities.length} shown`} note={universityNote} tone="blue" /><Metric label="Demand signals" value={`${jobs.length} roles`} note="Based on state shortage evidence, not live vacancy counts." /></div>
        <section className="mt-6 rounded-xl border border-slate-200 bg-white"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 p-5"><div><div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-blue-700" /><h2 className="text-lg font-semibold text-slate-950">University shortlist</h2></div><p className="mt-1 text-sm text-slate-500">Ranked institutions are a starting point. ROI ranking waits for comparable tuition and graduate-outcome evidence.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">QS rank</span></div><div className="divide-y divide-slate-100">{universities.length ? universities.map((university) => <a key={university.name} href={university.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-5 transition hover:bg-slate-50"><div><p className="text-sm font-semibold text-slate-950">{university.name}</p><p className="mt-1 text-sm text-slate-500">{university.city} · QS #{university.rank}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-slate-400" /></a>) : <p className="p-5 text-sm text-slate-500">No ranked institutions are currently listed for this filter.</p>}</div></section>
        <section className="mt-6 rounded-xl border border-slate-200 bg-white"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 p-5"><div><div className="flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-blue-700" /><h2 className="text-lg font-semibold text-slate-950">Career demand signals</h2></div><p className="mt-1 text-sm text-slate-500">{jobNote} Use the live search link to view current openings; the cards themselves are verified state-level shortage signals.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{stateName}</span></div><div className="divide-y divide-slate-100">{jobs.length ? jobs.map((job) => <div key={job.code} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><div className="flex items-center gap-2"><p className="text-sm font-semibold text-slate-950">{job.title}</p>{job.csol && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">CSOL</span>}</div><p className="mt-1 text-sm text-slate-500">Shortage signal {job.shortage}/5{job.salary ? ` · Median AUD ${job.salary.toLocaleString()}` : " · Salary under review"}</p></div>{job.searchUrl ? <a href={job.searchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">Live search <ArrowUpRight className="h-4 w-4" /></a> : null}</div>) : <p className="p-5 text-sm text-slate-500">No shortage signals match the active filter.</p>}</div></section>
      </section>

      <aside className="space-y-4 xl:sticky xl:top-5 xl:h-fit"><section className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2"><WalletCards className="h-4 w-4 text-blue-700" /><h2 className="font-semibold text-slate-950">Cost evidence</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">We do not estimate {params.city} rent from a state average. A city figure is withheld until its source and period are reviewed.</p><a href={rentSource.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">{rentSource.name} <ExternalLink className="h-3.5 w-3.5" /></a><p className="mt-2 text-xs text-slate-500">Source checked {rentSource.checkedAt}</p></section><AffiliateCtas /></aside>
    </div>
  </main>
}
