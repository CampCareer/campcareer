"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, CircleAlert, ExternalLink, Globe2, MapPinned } from "lucide-react"
import type { CountryExplorerData, HomeOverviewData, OverviewOccupationMetric } from "@/lib/home-overview-contract"
import type { CountryMetrics, CountryMoneyPoint, CountryMoneyRange } from "@/lib/workspace/country-metric-contract"
import {
  CATEGORY_OPTIONS,
  CITIZENSHIP_OPTIONS,
  COUNTRY_OPTIONS,
  EXPLORING_CATEGORY,
  getOverviewOptionLabel,
  OTHER_CITIZENSHIP_VALUE,
  type OverviewSearchValues,
} from "./home-overview-config"

type HomeOverviewProps = { query: OverviewSearchValues }
type RequestState = { data: HomeOverviewData | null; error: boolean; loading: boolean }
type ExplorerSelection = { key: string; label: string; type: "field" | "city"; exploreHref?: string }

const initialState: RequestState = { data: null, error: false, loading: true }

export function HomeOverview({ query }: HomeOverviewProps) {
  const [state, setState] = useState<RequestState>(initialState)
  const citizenship = getOverviewOptionLabel(CITIZENSHIP_OPTIONS, query.citizenship)
  const country = getOverviewOptionLabel(COUNTRY_OPTIONS, query.country)
  const category = getOverviewOptionLabel(CATEGORY_OPTIONS, query.category)
  const isDestinationExplorer = query.citizenship === OTHER_CITIZENSHIP_VALUE && query.category === EXPLORING_CATEGORY.value
  const returnPath = `/?citizenship=${encodeURIComponent(query.citizenship)}&country=${encodeURIComponent(query.country)}&category=${encodeURIComponent(query.category)}`

  useEffect(() => {
    const controller = new AbortController()
    setState(initialState)
    const requestParams = new URLSearchParams({ country: query.country, category: query.category })
    if (isDestinationExplorer) requestParams.set("view", "destination")
    fetch(`/api/home/overview?${requestParams.toString()}`, { signal: controller.signal })
      .then(async (response) => response.ok ? response.json() as Promise<HomeOverviewData> : Promise.reject(new Error("Overview request failed")))
      .then((data) => setState({ data, error: false, loading: false }))
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") setState({ data: null, error: true, loading: false })
      })
    return () => controller.abort()
  }, [isDestinationExplorer, query.category, query.country])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-5 sm:px-8 sm:pb-16 sm:pt-6 lg:px-10">
      <OverviewHeader citizenship={citizenship} country={country} category={category} isDestinationExplorer={isDestinationExplorer} />
      {state.loading && <OverviewLoading />}
      {state.error && <OverviewUnavailable />}
      {state.data && <OverviewDashboard data={state.data} country={country} countryCode={query.country} category={category} isExploring={query.category === EXPLORING_CATEGORY.value} isDestinationExplorer={isDestinationExplorer} loginHref={`/login?next=${encodeURIComponent(returnPath)}`} />}

      <section className="border-t border-[#e7e6e3] py-8 sm:py-10" aria-labelledby="account-heading">
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-[#dce6f7] bg-[#f7faff] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 id="account-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">{isDestinationExplorer ? `Create an account to personalise ${country}` : "Create an account to save this overview"}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5f5d57]">{isDestinationExplorer ? "Save this destination, tell us what matters to you, and build a more specific study plan." : "Keep this destination snapshot and follow the opportunities that matter to you."}</p>
          </div>
          <Link href={`/login?next=${encodeURIComponent(returnPath)}`} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">Create a free account <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </div>
  )
}

function OverviewDashboard({ data, country, countryCode, category, isExploring, isDestinationExplorer, loginHref }: { data: HomeOverviewData; country: string; countryCode: string; category: string; isExploring: boolean; isDestinationExplorer: boolean; loginHref: string }) {
  if (isDestinationExplorer && data.countryExplorer) return <CountryExplorerOverview country={country} countryCode={countryCode} explorer={data.countryExplorer} metrics={data.countryMetrics} loginHref={loginHref} />

  return <>
    <section className="py-6 sm:py-8" aria-labelledby="opportunity-heading">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700"><BriefcaseBusiness className="size-4" />Occupation outlook</p>
      <h2 id="opportunity-heading" className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#1b1b1b]">{isExploring ? "Occupation outlook" : `${category} in focus`}</h2>
      {isExploring ? <ExplorePrompt /> : <OccupationOverview data={data} />}
    </section>

    <section className="grid grid-cols-2 gap-3 border-t border-[#e7e6e3] py-6 sm:gap-4 sm:py-8" aria-label="Country finances">
      <RangeMetricCard eyebrow="Earnings" title="Annual earnings" range={data.countryMetrics.salaryRange} emptyText="Earnings data pending." />
      <RangeMetricCard eyebrow="Student budget" title="Monthly living cost" range={data.countryMetrics.livingCostRange} emptyText="Living-cost data pending." />
    </section>
  </>
}

function CountryExplorerOverview({ country, countryCode, explorer, metrics, loginHref }: { country: string; countryCode: string; explorer: CountryExplorerData; metrics: CountryMetrics; loginHref: string }) {
  const [selection, setSelection] = useState<ExplorerSelection | null>(null)
  const leadOpportunity = explorer.opportunities[0]
  const supportingOpportunities = explorer.opportunities.slice(1)
  const maximumCityCost = Math.max(...explorer.cities.map((city) => city.monthlyLivingCost?.high ?? 0), 1)

  if (!leadOpportunity) return <CountryDataExplorer country={country} countryCode={countryCode} explorer={explorer} metrics={metrics} loginHref={loginHref} />

  return <>
    <section className="py-5 sm:py-8" aria-labelledby="fields-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700 sm:text-xs"><BriefcaseBusiness className="size-4" />Opportunity field notes</p><h2 id="fields-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1b1b1b] sm:text-2xl">Where {country} is pulling ahead</h2></div><p className="hidden max-w-44 text-right text-xs leading-5 text-[#6f6d68] sm:block">Signals combine verified demand and occupation evidence.</p></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)] sm:gap-4"><button type="button" onClick={() => setSelection({ key: `field-${leadOpportunity.categoryId}`, label: leadOpportunity.categoryLabel, type: "field", exploreHref: `/occupation?country=${countryCode}&category=${encodeURIComponent(leadOpportunity.categoryId)}` })} aria-pressed={selection?.key === `field-${leadOpportunity.categoryId}`} className={`relative overflow-hidden rounded-[1.5rem] bg-blue-600 p-5 text-left text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:p-7 ${selection?.key === `field-${leadOpportunity.categoryId}` ? "scale-[1.01] shadow-xl shadow-blue-900/25" : ""}`}><span className="absolute -right-4 -top-8 text-[9rem] font-semibold leading-none tracking-[-0.1em] text-white/10" aria-hidden="true">{leadOpportunity.opportunityScore}</span><span className="relative block"><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-100">Strongest current signal</span><span className="mt-3 block max-w-64 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{leadOpportunity.categoryLabel}</span><span className="mt-1 block text-sm text-blue-100">Led by {leadOpportunity.topOccupationTitle}</span><span className="mt-8 flex items-end justify-between gap-4"><span><span className="block text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{leadOpportunity.opportunityScore}</span><span className="mt-1 block text-xs text-blue-100">opportunity signal</span></span><span className="rounded-2xl bg-white/15 px-3 py-2.5 text-right backdrop-blur"><span className="block text-lg font-semibold">{formatCompactNumber(leadOpportunity.vacanciesThreeMonthAvg)}</span><span className="block text-[10px] text-blue-100">average open roles</span></span></span></span></button><div className="grid grid-cols-2 gap-3 sm:grid-cols-1">{supportingOpportunities.map((opportunity, index) => <button key={opportunity.categoryId} type="button" onClick={() => setSelection({ key: `field-${opportunity.categoryId}`, label: opportunity.categoryLabel, type: "field", exploreHref: `/occupation?country=${countryCode}&category=${encodeURIComponent(opportunity.categoryId)}` })} aria-pressed={selection?.key === `field-${opportunity.categoryId}`} className={`rounded-[1.25rem] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:p-5 ${index === 0 ? "bg-[#fff6e8] text-[#604316]" : "bg-[#eef8f4] text-[#164f3c]"} ${selection?.key === `field-${opportunity.categoryId}` ? "scale-[1.02] shadow-lg" : ""}`}><span className="flex items-start justify-between gap-2"><span className="text-sm font-semibold leading-5 sm:text-base">{opportunity.categoryLabel}</span><span className="text-xl font-semibold tracking-[-0.04em]">{opportunity.opportunityScore}</span></span><span className="mt-5 block text-xs opacity-70">Top role</span><span className="mt-0.5 block text-sm font-semibold leading-5">{opportunity.topOccupationTitle}</span><span className="mt-3 block text-[11px] opacity-75">{formatCompactNumber(opportunity.vacanciesThreeMonthAvg)} average open roles</span></button>)}</div></div>
    </section>

    <section className="border-t border-[#e7e6e3] py-7 sm:py-9" aria-labelledby="cities-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700 sm:text-xs"><MapPinned className="size-4" />Study-city lens</p><h2 id="cities-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1b1b1b] sm:text-2xl">Three places to start comparing</h2></div><p className="hidden text-xs text-[#6f6d68] sm:block">Cost range · institutions · campuses</p></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">{explorer.cities.map((city) => <ExplorerCityCard key={city.name} city={city} maximumCost={maximumCityCost} isSelected={selection?.key === `city-${city.name}`} onSelect={() => setSelection({ key: `city-${city.name}`, label: city.name, type: "city", exploreHref: cityExploreHref(countryCode, city.name) })} />)}</div>
    </section>
    {selection && <ExplorerLoginSheet selection={selection} loginHref={loginHref} onDismiss={() => setSelection(null)} />}
  </>
}

function CountryDataExplorer({ country, countryCode, explorer, metrics, loginHref }: { country: string; countryCode: string; explorer: CountryExplorerData; metrics: CountryMetrics; loginHref: string }) {
  const [selection, setSelection] = useState<ExplorerSelection | null>(null)
  const maximumCityCost = Math.max(...explorer.cities.map((city) => city.monthlyLivingCost?.high ?? 0), 1)

  return <>
    <DestinationEssentials country={country} metrics={metrics} />
    {explorer.cities.length > 0 ? <section className="border-t border-[#e7e6e3] py-7 sm:py-9" aria-labelledby="cities-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700 sm:text-xs"><MapPinned className="size-4" />Study-city lens</p><h2 id="cities-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1b1b1b] sm:text-2xl">Places to start comparing in {country}</h2></div><p className="hidden max-w-48 text-right text-xs leading-5 text-[#6f6d68] sm:block">Institutions and campuses, with living costs where verified.</p></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">{explorer.cities.map((city) => <ExplorerCityCard key={city.name} city={city} maximumCost={maximumCityCost} isSelected={selection?.key === `city-${city.name}`} onSelect={() => setSelection({ key: `city-${city.name}`, label: city.name, type: "city", exploreHref: cityExploreHref(countryCode, city.name) })} />)}</div>
    </section> : null}
    {selection && <ExplorerLoginSheet selection={selection} loginHref={loginHref} onDismiss={() => setSelection(null)} />}
  </>
}

function DestinationEssentials({ country, metrics }: { country: string; metrics: CountryMetrics }) {
  return <section className="py-5 sm:py-8" aria-labelledby="essentials-heading">
    <div className="max-w-2xl"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700 sm:text-xs"><Globe2 className="size-4" />Destination essentials</p><h2 id="essentials-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1b1b1b] sm:text-2xl">Start with verified {country} basics</h2><p className="mt-2 text-sm leading-6 text-[#6f6d68]">Career scores appear when they have been reviewed. Until then, use these country-level signals to compare your next step.</p></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4"><RangeMetricCard eyebrow="Student budget" title="Monthly living cost" range={metrics.livingCostRange} emptyText="Living-cost data is being verified." /><RangeMetricCard eyebrow="Earnings" title="Annual earnings" range={metrics.salaryRange} emptyText="Earnings data is being verified." /><MinimumWageMetric value={metrics.minimumHourlyWage} /></div>
  </section>
}

function MinimumWageMetric({ value }: { value?: CountryMoneyPoint }) {
  return <article className="min-h-52 rounded-2xl border border-[#e7e6e3] bg-white p-3.5 sm:min-h-60 sm:p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-700 sm:text-xs">Work baseline</p><h3 className="mt-1.5 text-sm font-semibold leading-5 text-[#1b1b1b] sm:mt-2 sm:text-lg">Minimum hourly wage</h3>{value ? <><p className="mt-5 text-xl font-semibold tracking-[-0.04em] text-[#1b1b1b] sm:text-2xl">{formatAmount(value.currency, value.amount)}</p><p className="mt-1 text-[10px] text-[#8a8882] sm:text-xs">{value.unit || "Verified hourly amount"}</p><div className="mt-5 h-3 rounded-full bg-[#eaf0fa]"><span className="block h-full w-2/3 rounded-full bg-blue-600" /></div><p className="mt-3 text-[10px] leading-4 text-[#6f6d68] sm:mt-4 sm:text-xs sm:leading-5">Verified national baseline</p></> : <div className="mt-6 rounded-xl border border-dashed border-[#d7d5d0] bg-[#fafaf9] p-3 text-xs leading-5 text-[#6f6d68]">Minimum-wage data is being verified.</div>}</article>
}

const CITY_INSTITUTION_EXPLORER_COUNTRIES = new Set(["AU", "CA", "NZ", "UK"])

function cityExploreHref(countryCode: string, cityName: string) {
  return CITY_INSTITUTION_EXPLORER_COUNTRIES.has(countryCode)
    ? `/institutions/${countryCode.toLowerCase()}?city=${encodeURIComponent(cityName)}`
    : undefined
}

function ExplorerCityCard({ city, maximumCost, isSelected, onSelect }: { city: CountryExplorerData["cities"][number]; maximumCost: number; isSelected: boolean; onSelect: () => void }) {
  const costHigh = city.monthlyLivingCost ? (city.monthlyLivingCost.high / maximumCost) * 100 : 0
  const costLow = city.monthlyLivingCost ? (city.monthlyLivingCost.low / maximumCost) * 100 : 0
  return <button type="button" onClick={onSelect} aria-pressed={isSelected} className={`rounded-[1.4rem] border border-[#e7e6e3] bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:p-5 ${isSelected ? "scale-[1.02] shadow-lg" : ""}`}><span className="flex items-start justify-between gap-3"><span><span className="block text-lg font-semibold tracking-[-0.03em] text-[#1b1b1b]">{city.name}</span><span className="mt-0.5 block text-xs text-[#6f6d68]">{city.region} · {city.linkedInstitutionCount} institutions</span></span><span className="shrink-0 text-right"><span className="block text-sm font-semibold leading-4 text-[#1b1b1b]">{city.linkedCampusCount}</span><span className="block text-[9px] font-medium uppercase tracking-[0.08em] text-[#6f6d68]">campuses</span></span></span><span className="mt-6 block"><span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7c786f]">Student living / month</span><span className="mt-1 block text-base font-semibold tracking-[-0.025em] text-[#1b1b1b]">{city.monthlyLivingCost ? formatCityLivingCost(city.monthlyLivingCost) : "Cost data pending"}</span><span className="relative mt-4 block h-2 rounded-full bg-[#edf1f7]">{city.monthlyLivingCost && <span className="absolute inset-y-0 rounded-full bg-[#3165d4]" style={{ left: `${costLow}%`, width: `${Math.max(7, costHigh - costLow)}%` }} />}</span></span></button>
}

function ExplorerLoginSheet({ selection, loginHref, onDismiss }: { selection: ExplorerSelection; loginHref: string; onDismiss: () => void }) {
  const detail = selection.type === "field" ? `See the occupations, employers and study options behind ${selection.label}.` : `See the institutions, field signals and study setup that fit ${selection.label}.`
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/20 p-4"><aside className="w-full max-w-sm rounded-2xl border border-[#cfe0fb] bg-white p-5 text-center shadow-2xl shadow-slate-900/20" aria-label="Unlock selected destination details"><div className="relative"><button type="button" onClick={onDismiss} className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-full text-xl leading-none text-[#6f6d68] transition hover:bg-[#f2f5fa] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35" aria-label="Dismiss sign-up prompt">×</button><p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">{selection.type === "field" ? "Field selected" : "City selected"}</p><h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1b1b1b]">Unlock your {selection.label} plan</h3><p className="mt-2 text-sm leading-5 text-[#5f5d57]">{detail}</p></div><Link href={loginHref} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">Create free account <ArrowRight className="size-4" /></Link>{selection.exploreHref ? <Link href={selection.exploreHref} className="mt-3 inline-flex min-h-10 w-full items-center justify-center text-sm font-semibold text-blue-700 transition hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">Continue exploring {selection.label} <ArrowRight className="ml-1 size-4" /></Link> : null}</aside></div>
}

function RangeMetricCard({ eyebrow, title, range, emptyText }: { eyebrow: string; title: string; range?: CountryMoneyRange; emptyText: string }) {
  return <article className="min-h-52 rounded-2xl border border-[#e7e6e3] bg-white p-3.5 sm:min-h-60 sm:p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-700 sm:text-xs">{eyebrow}</p><h2 className="mt-1.5 text-sm font-semibold leading-5 text-[#1b1b1b] sm:mt-2 sm:text-lg">{title}</h2>{range ? <><p className="mt-5 text-xl font-semibold tracking-[-0.04em] text-[#1b1b1b] sm:text-2xl">{formatRange(range)}</p><p className="mt-1 text-[10px] text-[#8a8882] sm:text-xs">{range.unit || "Verified range"}</p><RangeBand range={range} /><p className="mt-3 text-[10px] leading-4 text-[#6f6d68] sm:mt-4 sm:text-xs sm:leading-5">{humanizeMetricQualifier(range.scenario ?? range.basis)}</p></> : <div className="mt-6 rounded-xl border border-dashed border-[#d7d5d0] bg-[#fafaf9] p-3 text-xs leading-5 text-[#6f6d68]">{emptyText}</div>}</article>
}

function RangeBand({ range }: { range: CountryMoneyRange }) {
  const span = Math.max(range.high - range.low, range.high * 0.08, 1)
  const start = Math.max(4, Math.min(72, 100 - ((range.high / (range.high + span)) * 100)))
  const width = Math.max(20, 100 - start - 4)
  return <div className="mt-5"><div className="relative h-3 rounded-full bg-[#eaf0fa]"><span className="absolute inset-y-0 rounded-full bg-blue-600" style={{ left: `${start}%`, width: `${width}%` }} /><span className="absolute -top-1 size-5 rounded-full border-4 border-white bg-blue-700 shadow-sm" style={{ left: `calc(${start}% - 0.625rem)` }} /><span className="absolute -top-1 size-5 rounded-full border-4 border-white bg-blue-700 shadow-sm" style={{ left: `calc(${start + width}% - 0.625rem)` }} /></div><div className="mt-2 flex justify-between text-xs font-medium text-[#6f6d68]"><span>{formatAmount(range.currency, range.low)}</span><span>{formatAmount(range.currency, range.high)}</span></div></div>
}

function OccupationOverview({ data }: { data: HomeOverviewData }) {
  const ranked = useMemo(() => data.occupations.filter((item) => item.opportunityScore != null).sort((first, second) => (second.opportunityScore ?? 0) - (first.opportunityScore ?? 0)), [data.occupations])
  const topThree = ranked.slice(0, 3)
  const otherRoles = ranked.slice(3)
  const growthRoles = [...ranked].filter((item) => item.employmentGrowthFiveYearPct != null).sort((first, second) => (second.employmentGrowthFiveYearPct ?? 0) - (first.employmentGrowthFiveYearPct ?? 0)).slice(0, 3)
  if (!ranked.length) return <div className="mt-5 rounded-2xl border border-dashed border-[#d7d5d0] bg-[#fafaf9] p-5 text-sm leading-6 text-[#5f5d57]">This destination does not yet have verified occupation metrics for this category.</div>
  return <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] xl:gap-5"><div className="rounded-2xl border border-[#e7e6e3] bg-white p-4 sm:p-5"><p className="text-sm font-semibold text-[#1b1b1b]">Top opportunity roles</p><ol className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">{topThree.map((occupation, index) => <RankedOpportunity key={occupation.careerId} occupation={occupation} rank={index + 1} />)}</ol>{otherRoles.length > 0 && <div className="mt-4 border-t border-[#eceae6] pt-3 sm:mt-5 sm:pt-4"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8882] sm:text-xs">Other profiled roles</p><p className="mt-1.5 text-xs leading-5 text-[#5f5d57] sm:mt-2 sm:text-sm sm:leading-6">{otherRoles.map((occupation) => occupation.title).join(" · ")}</p></div>}</div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 xl:gap-5"><EmployerHighlights focus={data.employerFocus} /><GrowthChart roles={growthRoles} /></div></div>
}

function RankedOpportunity({ occupation, rank }: { occupation: OverviewOccupationMetric; rank: number }) {
  const score = occupation.opportunityScore ?? 0
  return <li className="grid grid-cols-[2.1rem_minmax(0,1fr)_auto] items-center gap-2.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:gap-3"><span className="grid size-8 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 sm:size-10 sm:text-sm">{rank}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#1b1b1b] sm:text-[15px]">{occupation.title}</p><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf1f7] sm:mt-2"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(3, Math.min(100, score))}%` }} /></div></div><p className="text-lg font-semibold tracking-[-0.02em] text-[#1b1b1b] sm:text-xl">{score}</p></li>
}

function EmployerHighlights({ focus }: { focus: HomeOverviewData["employerFocus"] }) {
  if (!focus) return <div className="rounded-2xl border border-dashed border-[#d7d5d0] bg-[#fafaf9] p-5 text-sm leading-6 text-[#5f5d57]">Representative employer coverage is being added for the highest-ranked role.</div>
  return <article className="rounded-2xl border border-[#dce6f7] bg-[#f7faff] p-4 sm:p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-700 sm:text-xs">Who hires</p><h3 className="mt-1.5 text-base font-semibold text-[#1b1b1b] sm:mt-2 sm:text-lg">Employers for {focus.occupationTitle}</h3><ul className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2">{focus.employers.map((employer) => <li key={employer.label}>{employer.url ? <a href={employer.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-[#dce6f7] bg-white px-3 py-2 text-sm font-medium leading-5 text-[#3a3935] transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><span>{employerLabel(employer.label)}</span><ExternalLink className="size-3.5 shrink-0" aria-hidden="true" /></a> : <div className="rounded-xl border border-[#dce6f7] bg-white px-3 py-2 text-sm font-medium leading-5 text-[#3a3935]">{employerLabel(employer.label)}</div>}</li>)}</ul><div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-[#dce6f7] pt-3 sm:mt-4 sm:gap-2 sm:pt-4"><EmployerMarketMetric value={formatCompactNumber(focus.market.vacanciesThreeMonthAvg)} label="Open roles avg." /><EmployerMarketMetric value={formatCompactNumber(focus.market.employmentTotal)} label="People employed" /><EmployerMarketMetric value={formatGrowth(focus.market.employmentGrowthFiveYearPct)} label="5-year growth" /></div></article>
}

function EmployerMarketMetric({ value, label }: { value: string; label: string }) {
  return <div className="min-w-0 rounded-lg bg-white px-2 py-2.5 text-center sm:px-3"><p className="truncate text-sm font-semibold tracking-[-0.02em] text-[#1b1b1b] sm:text-base">{value}</p><p className="mt-0.5 text-[9px] leading-3 text-[#6f6d68] sm:text-[10px]">{label}</p></div>
}

function GrowthChart({ roles }: { roles: OverviewOccupationMetric[] }) {
  const maximum = Math.max(...roles.map((role) => role.employmentGrowthFiveYearPct ?? 0), 1)
  return <article className="rounded-2xl border border-[#e7e6e3] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">Growth trend</p><h3 className="mt-2 text-lg font-semibold text-[#1b1b1b]">5-year employment growth</h3>{roles.length ? <div className="mt-5 space-y-3">{roles.map((role) => <div key={role.careerId}><div className="flex items-center justify-between gap-3 text-sm"><span className="truncate font-medium text-[#3a3935]">{role.title}</span><span className="shrink-0 font-semibold text-[#1b1b1b]">+{role.employmentGrowthFiveYearPct?.toFixed(1)}%</span></div><div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#edf1f7]"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(5, ((role.employmentGrowthFiveYearPct ?? 0) / maximum) * 100)}%` }} /></div></div>)}</div> : <p className="mt-4 text-sm leading-6 text-[#6f6d68]">Verified growth data is not available yet.</p>}</article>
}

function ExplorePrompt() {
  return <div className="mt-5 rounded-2xl border border-dashed border-[#d7d5d0] bg-[#fafaf9] p-5 sm:p-6"><p className="text-lg font-semibold text-[#1b1b1b]">Select an occupation category to see its opportunity outlook.</p></div>
}

function OverviewHeader({ citizenship, country, category, isDestinationExplorer }: { citizenship: string; country: string; category: string; isDestinationExplorer: boolean }) {
  if (isDestinationExplorer) return <div className="flex items-center gap-2 text-sm font-medium text-[#5f5d57]"><Globe2 className="size-4 text-blue-700" aria-hidden="true" /><span>{country}</span><span aria-hidden="true">·</span><span>Destination overview</span></div>
  return <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-[#5f5d57]"><Globe2 className="size-4 text-blue-700" aria-hidden="true" /><span>{citizenship}</span><span aria-hidden="true">→</span><span>{country}</span><span aria-hidden="true">·</span><span>{category}</span></div>
}

function OverviewLoading() {
  return <div className="grid gap-4 py-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading overview data">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-60 animate-pulse rounded-2xl border border-[#e7e6e3] bg-[#fafaf9]" />)}</div>
}

function OverviewUnavailable() {
  return <section className="my-6 rounded-2xl border border-amber-200 bg-amber-50 p-5" aria-label="Overview data unavailable"><p className="flex items-center gap-2 font-semibold text-amber-900"><CircleAlert className="size-4" />Data is temporarily unavailable</p><p className="mt-2 text-sm leading-6 text-amber-800">The destination summary remains visible, but chart data could not be loaded. Please try the search again shortly.</p></section>
}

function employerLabel(label: string) {
  return label.split(" — ")[0]
}

function humanizeMetricQualifier(value: string | null) {
  if (value === "middle_50_percent_full_time_persons") return "Middle 50% of full-time earnings"
  if (value === "one_student_sharehouse") return "One student in a sharehouse"
  return value?.replaceAll("_", " ") ?? "Verified country-level range"
}

function formatAmount(currency: string, amount: number) {
  return new Intl.NumberFormat("en", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(amount)
}

function formatRange(range: CountryMoneyRange) {
  return `${formatAmount(range.currency, range.low)}–${formatAmount(range.currency, range.high)}`
}

function formatCompactNumber(value: number | null) {
  return value == null ? "—" : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}

function formatGrowth(value: number | null) {
  return value == null ? "—" : `+${value.toFixed(1)}%`
}

function formatCityLivingCost(range: NonNullable<CountryExplorerData["cities"][number]["monthlyLivingCost"]>) {
  return `${formatAmount(range.currency, range.low)}–${formatAmount(range.currency, range.high)}`
}
