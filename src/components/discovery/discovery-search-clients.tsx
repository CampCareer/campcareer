"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Building2, CircleAlert, ExternalLink, MapPinned } from "lucide-react"
import { CANONICAL_CAREERS, careersForCategory } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { BUDGET_BANDS, SEARCH_GOALS, type BudgetBandId, type DiscoveryEnvelope, type MajorRecommendationsData, type SearchGoalId, type UniversityMatchesData } from "@/lib/discovery/search-contract"
import { LANDING_GOALS, type LandingDiscoveryResult, type LandingGoalId } from "@/lib/discovery/landing-discovery"
import { getLaunchCountry } from "@/data/launch-countries"
import { localizePath } from "@/lib/i18n/config"
import { useLocale } from "@/lib/i18n/locale-provider"
import { recordDiscoveryEvent } from "@/lib/analytics"
import { RegionSelection } from "@/components/discovery/region-selection"

function usePathLocale() {
  return useLocale() === "ko" ? "ko" : "en"
}

function productHref(path: string, locale: "en" | "ko", params: Record<string, string>) {
  return `${localizePath(path, locale)}?${new URLSearchParams(params)}`
}

function SearchNotice({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex gap-3"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><h2 className="font-semibold text-amber-950">{title}</h2><p className="mt-1 text-sm leading-6 text-amber-900">{body}</p></div></div></div>
}

export function CountrySearchClient({ initial }: { initial: { country?: string; major?: string; goal?: string } }) {
  const locale = usePathLocale()
  const router = useRouter()
  const [country, setCountry] = useState(initial.country ?? "everywhere")
  const [major, setMajor] = useState(initial.major ?? "anything")
  const [goal, setGoal] = useState<LandingGoalId | "">(initial.goal as LandingGoalId ?? "")
  const [result, setResult] = useState<LandingDiscoveryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const lastTrackedResult = useRef("")
  const ready = Boolean(goal)
  const selectedCountry = country === "everywhere" ? null : getLaunchCountry(country)

  useEffect(() => {
    if (!ready || selectedCountry) return
    const controller = new AbortController()
    setLoading(true)
    setResult(null)
    const query = new URLSearchParams({ country, major, goal })
    fetch(`/api/v1/landing-discovery?${query}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load country discovery")))
      .then((payload) => setResult(payload))
      .catch((error) => { if (error.name !== "AbortError") setResult(null) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [country, goal, major, ready, selectedCountry])

  useEffect(() => {
    const key = `${country}:${major}:${goal}`
    if ((result || selectedCountry) && lastTrackedResult.current !== key) {
      lastTrackedResult.current = key
      recordDiscoveryEvent("recommendation_result_view", { surface: "country_results", country, major, goal })
    }
  }, [country, goal, major, result, selectedCountry])

  const href = ready ? productHref("/countries/search", locale, { country, major, goal }) : "#"
  return <DiscoveryLayout eyebrow="Countries" title={selectedCountry ? `Choose your region in ${selectedCountry.name}` : "Which destination best fits your goal?"} body={selectedCountry ? "Start with a state or city, then explore the local study and career picture." : "Choose a country, a major, or neither. Your goal is all we need to start exploring."}>
    <form action={href} onSubmit={(event) => { event.preventDefault(); if (!ready) return; recordDiscoveryEvent("recommendation_start", { surface: "country_results", country, major, goal }); router.push(href) }} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1.2fr_1.2fr_auto]">
      <Select label="Where do you want to study?" value={country} onChange={setCountry} options={[{ value: "everywhere", label: "Everywhere" }, ...LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name }))]} />
      <Select label="What do you want to study?" value={major} onChange={setMajor} options={[{ value: "anything", label: "Anything" }, ...STUDY_CONCEPTS.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="What matters most?" value={goal} onChange={(value) => setGoal(value as LandingGoalId)} options={[{ value: "", label: "Choose your goal" }, ...LANDING_GOALS.map((item) => ({ value: item.id, label: item.label }))]} />
      <button disabled={!ready} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">See country signals <ArrowRight className="h-4 w-4" /></button>
    </form>
    {!ready ? <SearchNotice title="Choose what matters most" body="You can leave country as Everywhere and major as Anything; choose a goal to see the best next places and fields to explore." /> : selectedCountry ? <RegionSelection country={selectedCountry} major={major} goal={goal} locale={locale} /> : loading ? <LoadingCards /> : result ? <LandingDiscoveryResults result={result} locale={locale} /> : <SearchNotice title="Discovery results are unavailable" body="Try again in a moment, or open a country profile from the landing page." />}
  </DiscoveryLayout>
}

function LandingDiscoveryResults({ result, locale }: { result: LandingDiscoveryResult; locale: "en" | "ko" }) {
  const majorLabel = result.major?.label ?? "any field"
  const selected = result.selectedCountry
  const results = selected ? [selected, ...result.similar] : result.ranked.slice(0, 3)

  return <section>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Destination signals</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{result.goal.label} for {majorLabel}</h2></div><p className="max-w-xl text-sm leading-6 text-slate-600">{result.note}</p></div>
    {selected && <p className="mt-5 text-sm font-medium text-slate-700"><span className="font-semibold text-blue-700">{selected.name}</span> is your chosen country. These destinations have similarly strong signals for this search.</p>}
    <div className="mt-5 grid gap-4 lg:grid-cols-3">{results.map((country) => <LandingCountryCard key={country.code} country={country} locale={locale} />)}</div>
    {result.input.major === "anything" && <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold text-amber-950">Not sure what to study yet?</h2><p className="mt-1 text-sm leading-6 text-amber-900">The country cards show the fields with the strongest country-level signals. Open a country’s map to explore occupations and regions before you choose a major.</p></div>}
  </section>
}

function LandingCountryCard({ country, locale }: { country: LandingDiscoveryResult["ranked"][number]; locale: "en" | "ko" }) {
  return <article className={`rounded-2xl border bg-white p-5 shadow-sm ${country.selected ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
    <div className="flex items-center justify-between gap-3"><span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-blue-600 px-2 text-sm font-bold text-white">{country.rank}</span>{country.selected && <span className="text-xs font-semibold text-blue-700">Your choice</span>}</div>
    <h3 className="mt-4 text-2xl font-semibold text-slate-950">{country.name}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{country.why}</p>
    <dl className="mt-5 space-y-2 text-sm"><Row label="Graduate salary signal" value={country.firstSalary} /><Row label="First-year cost signal" value={country.initialBudget} /><Row label="Post-study route" value={country.policy} /></dl>
    <p className="mt-4 text-xs leading-5 text-slate-500">Promising fields: {country.bestMajors.join(", ")} · Reviewed {country.evidenceAsOf}</p>
    <div className="mt-5 flex flex-wrap gap-4"><Link href={localizePath(`/countries/${country.slug}`, locale)} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Open country profile <ArrowRight className="h-4 w-4" /></Link><Link href={localizePath(`/maps?country=${country.code.toLowerCase()}`, locale)} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700">Explore jobs on Maps <MapPinned className="h-4 w-4" /></Link></div>
  </article>
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
    {!ready ? <SearchNotice title="Choose a country and priority" body="You can add a state or region when you know where you want to live." /> : <MajorResult result={result} country={country} goal={goal} locale={locale} />}
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

function MajorResult({ result, country, goal, locale }: { result: DiscoveryEnvelope<MajorRecommendationsData> | null; country: string; goal: string; locale: "en" | "ko" }) {
  if (result?.data.recommendations.length) return <div />
  const landingGoal = goal === "lower-first-year-cost" ? "low-cost" : goal === "work-and-immigration" ? "immigration" : "high-income"
  return <section><SearchNotice title="Regional ranking under review" body="CampCareer will not use nationwide averages to rank a state or region. Explore canonical career paths and the country’s Maps data while local occupation evidence is reviewed." /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(result?.data.discoveryCareers ?? []).slice(0, 8).map((career) => <Link key={career.id} href={productHref("/countries/search", locale, { country: "everywhere", major: "anything", goal: landingGoal })} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300"><p className="text-sm font-semibold text-slate-950">{career.label}</p><span className="mt-3 inline-flex text-sm font-semibold text-amber-800">Check country fit <ArrowRight className="ml-1 h-4 w-4" /></span></Link>)}</div><Link href={localizePath(`/maps?country=${country.toLowerCase()}`, locale)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><MapPinned className="h-4 w-4" />Explore regional Maps data</Link></section>
}

function UniversityResult({ result, country, locale }: { result: DiscoveryEnvelope<UniversityMatchesData> | null; country: string; locale: "en" | "ko" }) {
  if (result?.data.matches.length) return <div />
  return <section><SearchNotice title="University matches under review" body={result?.data.reason ?? "We are checking programme, tuition, requirements, and graduate-outcome evidence before ranking universities."} /><Link href={localizePath(`/maps?country=${country.toLowerCase()}`, locale)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"><Building2 className="h-4 w-4" />Explore verified institutions on Maps <ExternalLink className="h-4 w-4" /></Link></section>
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 border-b border-slate-100 pb-2"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium capitalize text-slate-800">{value}</dd></div> }
