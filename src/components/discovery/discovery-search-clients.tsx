"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Building2, CircleAlert, ExternalLink, MapPinned } from "lucide-react"
import { CANONICAL_CAREERS, careersForCategory } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import { BUDGET_BANDS, SEARCH_GOALS, type BudgetBandId, type CountryRankingsData, type DiscoveryEnvelope, type MajorRecommendationsData, type SearchGoalId, type UniversityMatchesData } from "@/lib/discovery/search-contract"
import { localizePath } from "@/lib/i18n/config"
import { useLocale } from "@/lib/i18n/locale-provider"
import { track } from "@/lib/analytics"

function usePathLocale() {
  return useLocale() === "ko" ? "ko" : "en"
}

function productHref(path: string, locale: "en" | "ko", params: Record<string, string>) {
  return `${localizePath(path, locale)}?${new URLSearchParams(params)}`
}

function SearchNotice({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex gap-3"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><h2 className="font-semibold text-amber-950">{title}</h2><p className="mt-1 text-sm leading-6 text-amber-900">{body}</p></div></div></div>
}

export function CountrySearchClient({ initial }: { initial: { career?: string; budget?: string; goal?: string; currency?: string } }) {
  const locale = usePathLocale()
  const router = useRouter()
  const [category, setCategory] = useState(() => CANONICAL_CAREERS.find((career) => career.id === initial.career)?.categoryId ?? "")
  const [career, setCareer] = useState(initial.career ?? "")
  const [budget, setBudget] = useState<BudgetBandId | "">(initial.budget as BudgetBandId ?? "")
  const [goal, setGoal] = useState<SearchGoalId | "">(initial.goal as SearchGoalId ?? "")
  const [result, setResult] = useState<DiscoveryEnvelope<CountryRankingsData> | null>(null)
  const [loading, setLoading] = useState(false)
  const ready = Boolean(career && budget && goal)
  const careers = useMemo(() => category ? careersForCategory(category as typeof CANONICAL_CAREERS[number]["categoryId"]) : [], [category])

  useEffect(() => {
    if (!ready) return
    const controller = new AbortController()
    setLoading(true)
    setResult(null)
    const query = new URLSearchParams({ career, budget, goal, currency: initial.currency ?? "USD" })
    fetch(`/api/v1/country-rankings?${query}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load country rankings")))
      .then((payload) => setResult(payload))
      .catch((error) => { if (error.name !== "AbortError") setResult(null) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [career, budget, goal, initial.currency, ready])

  const href = ready ? productHref("/countries/search", locale, { career, budget, goal, currency: initial.currency ?? "USD" }) : "#"
  return <DiscoveryLayout eyebrow="Countries" title="Which destination fits this career best?" body="Ranked only when CampCareer has exact, current evidence for the career and destination.">
    <form action={href} onSubmit={(event) => { event.preventDefault(); if (!ready) return; track("decision_start", { career, budget, goal }); router.push(href) }} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1.2fr_1fr_1.2fr_auto]">
      <Select label="Career category" value={category} onChange={(value) => { setCategory(value); setCareer("") }} options={[{ value: "", label: "Choose a category" }, ...STUDY_CATEGORIES.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="Career" value={career} disabled={!category} onChange={setCareer} options={[{ value: "", label: "Choose a career" }, ...careers.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="First-year budget" value={budget} onChange={(value) => setBudget(value as BudgetBandId)} options={[{ value: "", label: "Choose a budget" }, ...BUDGET_BANDS.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="Priority" value={goal} onChange={(value) => setGoal(value as SearchGoalId)} options={[{ value: "", label: "Choose a goal" }, ...SEARCH_GOALS.map((item) => ({ value: item.id, label: item.label }))]} />
      <button disabled={!ready} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Rank countries <ArrowRight className="h-4 w-4" /></button>
    </form>
    {!ready ? <SearchNotice title="Start with a career, budget, and priority" body="Choose the four fields above to build a country shortlist." /> : loading ? <LoadingCards /> : result?.data.rankingAvailable ? <RankedCountries result={result.data} locale={locale} /> : <RankingReview explorers={result?.data.explorers ?? []} locale={locale} />}
  </DiscoveryLayout>
}

export function MajorSearchClient({ initial }: { initial: { country?: string; state?: string; goal?: string; budget?: string } }) {
  const locale = usePathLocale()
  const router = useRouter()
  const [country, setCountry] = useState(initial.country ?? "")
  const [state, setState] = useState(initial.state ?? "")
  const [goal, setGoal] = useState<SearchGoalId | "">(initial.goal as SearchGoalId ?? "")
  const [budget, setBudget] = useState<BudgetBandId | "">(initial.budget as BudgetBandId ?? "")
  const [result, setResult] = useState<DiscoveryEnvelope<MajorRecommendationsData> | null>(null)
  const ready = Boolean(country && goal)
  useEffect(() => {
    if (!ready) return
    const controller = new AbortController()
    const query = new URLSearchParams({ country, goal, ...(state ? { state } : {}), ...(budget ? { budget } : {}) })
    fetch(`/api/v1/major-recommendations?${query}`, { signal: controller.signal }).then((response) => response.ok ? response.json() : Promise.reject()).then(setResult).catch(() => setResult(null))
    return () => controller.abort()
  }, [budget, country, goal, ready, state])
  const href = ready ? productHref("/majors/search", locale, { country, goal, ...(state ? { state } : {}), ...(budget ? { budget } : {}) }) : "#"
  return <DiscoveryLayout eyebrow="Majors" title="Which career path fits this place?" body="Choose a destination and optional state or region. Recommendations appear only when regional evidence is complete.">
    <form action={href} onSubmit={(event) => { event.preventDefault(); if (ready) router.push(href) }} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1.2fr_1fr_1.2fr_1fr_auto]">
      <Select label="Destination country" value={country} onChange={setCountry} options={[{ value: "", label: "Choose a country" }, ...LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name }))]} />
      <label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">State or region (optional)</span><input value={state} onChange={(event) => setState(event.target.value)} placeholder="e.g. NSW" className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400" /></label>
      <Select label="Priority" value={goal} onChange={(value) => setGoal(value as SearchGoalId)} options={[{ value: "", label: "Choose a goal" }, ...SEARCH_GOALS.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="Budget (optional)" value={budget} onChange={(value) => setBudget(value as BudgetBandId)} options={[{ value: "", label: "Any budget" }, ...BUDGET_BANDS.map((item) => ({ value: item.id, label: item.label }))]} />
      <button disabled={!ready} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-semibold text-amber-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300">Find paths <ArrowRight className="h-4 w-4" /></button>
    </form>
    {!ready ? <SearchNotice title="Choose a country and priority" body="You can add a state or region when you know where you want to live." /> : <MajorResult result={result} country={country} budget={budget} goal={goal} locale={locale} />}
  </DiscoveryLayout>
}

export function UniversitySearchClient({ initial }: { initial: { country?: string; city?: string; career?: string; budget?: string } }) {
  const locale = usePathLocale()
  const router = useRouter()
  const [country, setCountry] = useState(initial.country ?? "")
  const [category, setCategory] = useState(() => CANONICAL_CAREERS.find((item) => item.id === initial.career)?.categoryId ?? "")
  const [career, setCareer] = useState(initial.career ?? "")
  const [budget, setBudget] = useState<BudgetBandId | "">(initial.budget as BudgetBandId ?? "")
  const [city, setCity] = useState(initial.city ?? "")
  const [result, setResult] = useState<DiscoveryEnvelope<UniversityMatchesData> | null>(null)
  const careers = useMemo(() => category ? careersForCategory(category as typeof CANONICAL_CAREERS[number]["categoryId"]) : [], [category])
  const ready = Boolean(country && career && budget)
  useEffect(() => {
    if (!ready) return
    const controller = new AbortController()
    const query = new URLSearchParams({ country, career, budget, ...(city ? { city } : {}) })
    fetch(`/api/v1/university-matches?${query}`, { signal: controller.signal }).then((response) => response.ok ? response.json() : Promise.reject()).then(setResult).catch(() => setResult(null))
    return () => controller.abort()
  }, [budget, career, city, country, ready])
  const href = ready ? productHref("/universities/search", locale, { country, career, budget, ...(city ? { city } : {}) }) : "#"
  return <DiscoveryLayout eyebrow="Universities" title="Which university fits your budget and career?" body="We only call a university an optimal match when programme, cost, entry requirements, and outcome evidence are complete.">
    <form action={href} onSubmit={(event) => { event.preventDefault(); if (ready) router.push(href) }} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr_1.1fr_1fr_auto]">
      <Select label="Destination country" value={country} onChange={setCountry} options={[{ value: "", label: "Choose a country" }, ...LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name }))]} />
      <Select label="Career category" value={category} onChange={(value) => { setCategory(value); setCareer("") }} options={[{ value: "", label: "Choose a category" }, ...STUDY_CATEGORIES.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="Career" value={career} disabled={!category} onChange={setCareer} options={[{ value: "", label: "Choose a career" }, ...careers.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="First-year budget" value={budget} onChange={(value) => setBudget(value as BudgetBandId)} options={[{ value: "", label: "Choose a budget" }, ...BUDGET_BANDS.map((item) => ({ value: item.id, label: item.label }))]} />
      <button disabled={!ready} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300">Find universities <ArrowRight className="h-4 w-4" /></button>
      <label className="lg:col-span-2 block"><span className="mb-1 block text-xs font-semibold text-slate-600">City (optional)</span><input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Dublin" className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-400" /></label>
    </form>
    {!ready ? <SearchNotice title="Choose a country, career, and budget" body="City is optional; refine it when location matters to your study plan." /> : <UniversityResult result={result} country={country} locale={locale} />}
  </DiscoveryLayout>
}

function DiscoveryLayout({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children: React.ReactNode }) {
  return <div className="bg-slate-50"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-11 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">{eyebrow}</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{body}</p></div></section><main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">{children}</main></div>
}

function Select({ label, value, onChange, options, disabled = false }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; disabled?: boolean }) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span><select aria-label={label} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function LoadingCards() { return <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div> }

function RankingReview({ explorers, locale }: { explorers: CountryRankingsData["explorers"]; locale: "en" | "ko" }) {
  return <section><SearchNotice title="Ranking under review" body="We need at least three countries with exact, current career, cost, tax, housing, and pathway evidence before publishing a 1–2–3 ranking. Explore the available destination data below." /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{explorers.map((country) => <Link key={country.code} href={localizePath(`/countries/${country.slug}`, locale)} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300"><p className="text-xs font-semibold tracking-wide text-slate-400">{country.code}</p><h2 className="mt-1 font-semibold text-slate-950">{country.name}</h2><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{country.reason}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Explore destination <ArrowRight className="h-4 w-4" /></span></Link>)}</div></section>
}

function RankedCountries({ result, locale }: { result: CountryRankingsData; locale: "en" | "ko" }) {
  return <section className="grid gap-4 lg:grid-cols-3">{result.ranked.map((item) => <article key={item.country.code} className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm"><span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-blue-600 px-2 text-sm font-bold text-white">{item.rank}</span><h2 className="mt-4 text-2xl font-semibold text-slate-950">{item.country.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.why}</p><dl className="mt-5 space-y-2 text-sm"><Row label="First-year cash" value={item.financial.firstYearCash} /><Row label="Take-home pay" value={item.financial.takeHome} /><Row label="Immigration status" value={item.immigration.replace("_", " ")} /></dl><Link href={localizePath(`/countries/${item.country.slug}`, locale)} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Open country profile <ArrowRight className="h-4 w-4" /></Link></article>)}</section>
}

function MajorResult({ result, country, budget, goal, locale }: { result: DiscoveryEnvelope<MajorRecommendationsData> | null; country: string; budget: string; goal: string; locale: "en" | "ko" }) {
  if (result?.data.recommendations.length) return <div />
  return <section><SearchNotice title="Regional ranking under review" body="CampCareer will not use nationwide averages to rank a state or region. Explore canonical career paths and the country’s Maps data while local occupation evidence is reviewed." /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(result?.data.discoveryCareers ?? []).slice(0, 8).map((career) => <Link key={career.id} href={productHref("/countries/search", locale, { career: career.id, budget: budget || "50000-75000", goal, currency: "USD" })} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300"><p className="text-sm font-semibold text-slate-950">{career.label}</p><span className="mt-3 inline-flex text-sm font-semibold text-amber-800">Check country fit <ArrowRight className="ml-1 h-4 w-4" /></span></Link>)}</div><Link href={localizePath(`/maps?country=${country.toLowerCase()}`, locale)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><MapPinned className="h-4 w-4" />Explore regional Maps data</Link></section>
}

function UniversityResult({ result, country, locale }: { result: DiscoveryEnvelope<UniversityMatchesData> | null; country: string; locale: "en" | "ko" }) {
  if (result?.data.matches.length) return <div />
  return <section><SearchNotice title="University matches under review" body={result?.data.reason ?? "We are checking programme, tuition, requirements, and graduate-outcome evidence before ranking universities."} /><Link href={localizePath(`/maps?country=${country.toLowerCase()}`, locale)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"><Building2 className="h-4 w-4" />Explore verified institutions on Maps <ExternalLink className="h-4 w-4" /></Link></section>
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 border-b border-slate-100 pb-2"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium capitalize text-slate-800">{value}</dd></div> }
