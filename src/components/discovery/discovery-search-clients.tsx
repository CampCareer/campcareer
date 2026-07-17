"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Building2, CircleAlert, ExternalLink, MapPinned, Search, SlidersHorizontal } from "lucide-react"
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
import { IconPicker, type PickerOption, countryFlag } from "@/components/ui/icon-picker"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"

function usePathLocale() {
  return useLocale() === "ko" ? "ko" : "en"
}

function productHref(path: string, locale: "en" | "ko", params: Record<string, string>) {
  return `${localizePath(path, locale)}?${new URLSearchParams(params)}`
}

function SearchNotice({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><div className="flex gap-3"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><div><h2 className="font-semibold text-blue-950">{title}</h2><p className="mt-1 text-sm leading-6 text-blue-900">{body}</p></div></div></div>
}

export function CountrySearchClient({ initial, basePath = "/countries/search" }: { initial: { country?: string; category?: string; major?: string; goal?: string }; basePath?: string }) {
  const locale = usePathLocale()
  const isKo = locale === "ko"
  const router = useRouter()
  const [country, setCountry] = useState(initial.country ?? "everywhere")
  const [major, setMajor] = useState(initial.major ?? "anything")
  const [category, setCategory] = useState(initial.category ?? STUDY_CONCEPTS.find((concept) => concept.id === initial.major)?.category ?? "")
  const [goal, setGoal] = useState<LandingGoalId | "">(initial.goal as LandingGoalId ?? "")
  const [result, setResult] = useState<LandingDiscoveryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [goalFilterOpen, setGoalFilterOpen] = useState(false)
  const goalFilterRef = useRef<HTMLDivElement>(null)
  const lastTrackedResult = useRef("")
  const hasGoal = Boolean(goal)
  const selectedCountry = country === "everywhere" ? null : getLaunchCountry(country)
  const effectiveBasePath = basePath === "/au/majors" && country !== "AU" ? "/countries/search" : basePath

  const countryOptions = useMemo<PickerOption[]>(() => [
    { value: "everywhere", label: isKo ? "어디든지" : "Everywhere", description: isKo ? "20개국을 함께 비교" : "Compare all 20 destinations", icon: "🌍", keywords: "all global" },
    ...LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name, description: isKo ? `${item.name} 유학·취업 신호 보기` : `Explore study and career signals`, icon: countryFlag(item.code), keywords: `${item.code} ${item.slug}` })),
  ], [isKo])
  const majorOptions = useMemo<PickerOption[]>(() => [
    { value: "", label: isKo ? "카테고리 선택" : "Choose a category", description: isKo ? "10개 전공 카테고리에서 선택" : "Choose from 10 study categories", icon: "✨", keywords: "any undecided" },
    ...STUDY_CATEGORIES.map((item) => {
      const visual = getStudyCategoryVisual(item.id)
      return { value: item.id, label: isKo ? item.labelKo : item.label, description: isKo ? `${item.labelKo} 전공 탐색` : `Explore ${item.label} study paths`, icon: "", iconComponent: visual.Icon, iconTone: visual.tone, keywords: `${item.id} ${item.label} ${item.labelKo}` }
    }),
  ], [isKo])
  const goalOptions = useMemo<PickerOption[]>(() =>
    LANDING_GOALS.map((item) => {
      const isHighIncome = item.id === "high-income"
      const isLowCost = item.id === "low-cost"
      return {
        value: item.id,
        label: isKo ? (isHighIncome ? "높은 졸업 후 연봉" : isLowCost ? "낮은 유학비용" : "졸업 후 취업·체류") : item.label,
        description: isKo ? (isHighIncome ? "소득 신호가 강한 국가부터 확인" : isLowCost ? "비용 부담이 낮은 국가부터 확인" : "졸업 후 경로가 강한 국가부터 확인") : (isHighIncome ? "Prioritise stronger graduate earning signals" : isLowCost ? "Prioritise lower study-cost signals" : "Prioritise post-study work options"),
        icon: isHighIncome ? "💰" : isLowCost ? "🌱" : "🧭",
      }
    }),
  [isKo])

  useEffect(() => {
    if (!hasGoal || selectedCountry) return
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
  }, [country, goal, hasGoal, major, selectedCountry])

  useEffect(() => {
    const key = `${country}:${category}:${major}:${goal}`
    if ((result || selectedCountry || !hasGoal) && lastTrackedResult.current !== key) {
      lastTrackedResult.current = key
      recordDiscoveryEvent("recommendation_result_view", { surface: "country_results", country, major, goal })
    }
  }, [category, country, goal, hasGoal, major, result, selectedCountry])

  useEffect(() => {
    if (!goalFilterOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (goalFilterRef.current && !goalFilterRef.current.contains(event.target as Node)) setGoalFilterOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [goalFilterOpen])

  const href = productHref(effectiveBasePath, locale, { ...(effectiveBasePath === "/au/majors" ? {} : { country }), ...(category ? { category } : {}), ...(major !== "anything" ? { major } : {}), ...(goal ? { goal } : {}) })

  const countryLabel = country === "everywhere" ? (isKo ? "어디든지" : "Everywhere") : getLaunchCountry(country)?.name ?? country
  const majorLabel = category ? (isKo ? STUDY_CATEGORIES.find((item) => item.id === category)?.labelKo : STUDY_CATEGORIES.find((item) => item.id === category)?.label) ?? category : (isKo ? "카테고리 선택" : "Choose a category")
  const goalLabel = goal ? (isKo ? (goal === "high-income" ? "높은 졸업 후 연봉" : goal === "low-cost" ? "낮은 유학비용" : "졸업 후 취업·체류") : LANDING_GOALS.find((g) => g.id === goal)?.label ?? goal) : ""

  const goalLabelShort = goal ? (isKo ? (goal === "high-income" ? "고소득" : goal === "low-cost" ? "저비용" : "취업·체류") : goal === "high-income" ? "High income" : goal === "low-cost" ? "Low cost" : "Immigration") : ""

  const searchBar = <>
    <div className="relative z-50 mx-auto max-w-4xl">
      <button type="button" onClick={() => setExpanded(true)} className={`relative flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-center shadow-sm transition hover:border-blue-300 hover:shadow-md ${expanded ? "pointer-events-none invisible" : ""}`}>
        <Search className="absolute left-5 h-4 w-4 shrink-0 text-slate-400" />
        <span className="text-sm font-medium text-slate-700">{countryLabel}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="text-sm font-medium text-slate-700">{majorLabel}</span>
        {goalLabel && <><span className="h-1 w-1 rounded-full bg-slate-300" /><span className="text-sm font-medium text-slate-700">{goalLabel}</span></>}
      </button>
      {expanded && <form action={href} onSubmit={(event) => { event.preventDefault(); recordDiscoveryEvent("recommendation_start", { surface: "country_results", country, major: major !== "anything" ? major : category || "anything", goal }); router.push(href) }} className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1"><IconPicker name="country" label={isKo ? "나라" : "Where"} value={country} options={countryOptions} onChange={setCountry} searchPlaceholder={isKo ? "국가 검색" : "Search countries"} testId="country" /></div>
          <div className="flex-1"><IconPicker name="category" label={isKo ? "전공" : "Major"} value={category} options={majorOptions} onChange={(value) => { setCategory(value); setMajor("anything") }} searchPlaceholder={isKo ? "전공 카테고리 검색" : "Search categories"} testId="major" /></div>
          <div className="flex relative" ref={goalFilterRef}>
            <button type="button" onClick={() => setGoalFilterOpen((o) => !o)} className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-slate-50">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
              <span>{goalLabelShort || (isKo ? "목표" : "Goal")}</span>
            </button>
            {goalFilterOpen && <div className="absolute right-0 top-full z-[60] mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,.16)]">
              {goalOptions.map((option) => <button key={option.value} type="button" onClick={() => { setGoal(option.value as LandingGoalId); setGoalFilterOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 ${option.value === goal ? "bg-blue-50" : ""}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-base">{option.icon}</span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{option.label}</span><span className="block text-xs text-slate-500">{option.description}</span></span>
                {option.value === goal && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
              </button>)}
            </div>}
          </div>
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "검색" : "Search"}</button>
        </div>
      </form>}
    </div>
  </>

  const resultContent = selectedCountry && (!hasGoal || major === "anything")
    ? <CountryStudyPreview country={selectedCountry} locale={locale} isKo={isKo} category={category} major={major} basePath={effectiveBasePath} />
    : !hasGoal
      ? <Recommendations locale={locale} isKo={isKo} onGoalChange={setGoal} basePath={effectiveBasePath} />
      : selectedCountry
        ? <RegionSelection country={selectedCountry} major={major} goal={goal} locale={locale} />
        : loading
          ? <LoadingCards />
          : result
            ? <LandingDiscoveryResults result={result} locale={locale} />
            : <SearchNotice title="Discovery results are unavailable" body="Try again in a moment, or open a country profile from the landing page." />

  if (selectedCountry) return <div className="bg-slate-50"><main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">{searchBar}{resultContent}</main></div>

  return <div>
    <section className="relative z-40 border-b border-slate-200/90 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {searchBar}
      </div>
    </section>
    {expanded && <div className="fixed inset-0 top-[88px] z-30 bg-black/40" onClick={() => { setGoalFilterOpen(false); setExpanded(false) }} />}
    <div className="bg-slate-50"><main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">{resultContent}</main></div>
  </div>
}

function Recommendations({ locale, isKo, onGoalChange, basePath = "/countries/search" }: { locale: "en" | "ko"; isKo: boolean; onGoalChange: (goal: LandingGoalId) => void; basePath?: string }) {
  const recommendations = [
    { country: "US", major: "computer-science", goal: "high-income" as LandingGoalId, emoji: "🇺🇸", majorEmoji: "💻" },
    { country: "AU", major: "nursing", goal: "immigration" as LandingGoalId, emoji: "🇦🇺", majorEmoji: "🩺" },
    { country: "UK", major: "business-analytics", goal: "high-income" as LandingGoalId, emoji: "🇬🇧", majorEmoji: "📈" },
    { country: "DE", major: "engineering", goal: "low-cost" as LandingGoalId, emoji: "🇩🇪", majorEmoji: "⚙️" },
    { country: "CA", major: "data-analytics", goal: "immigration" as LandingGoalId, emoji: "🇨🇦", majorEmoji: "💻" },
    { country: "JP", major: "hospitality-management", goal: "low-cost" as LandingGoalId, emoji: "🇯🇵", majorEmoji: "🍽️" },
  ]

  const countryName = (code: string) => getLaunchCountry(code)?.name ?? code
  const majorName = (id: string) => { const c = STUDY_CONCEPTS.find((s) => s.id === id); return c ? (isKo ? c.labelKo : c.label) : id }
  const goalName = (id: LandingGoalId) => isKo ? (id === "high-income" ? "고소득" : id === "low-cost" ? "저비용" : "취업·체류") : id === "high-income" ? "High income" : id === "low-cost" ? "Low cost" : "Immigration"

  return <section>
    <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">{isKo ? "추천 탐색" : "Recommended searches"}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{isKo ? "어디로 갈지 모르겠나요?" : "Not sure where to go?"}</h2><p className="mt-2 max-w-2xl text-slate-600">{isKo ? "국가·전공·목표 조합을 클릭하면 바로 비교 결과를 볼 수 있습니다." : "Click a country–major–goal combination to see results instantly."}</p></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((rec) => {
        const href = productHref(basePath, locale, { country: rec.country, major: rec.major, goal: rec.goal })
        return <Link key={`${rec.country}-${rec.major}-${rec.goal}`} href={href} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md">
          <span className="text-3xl">{rec.emoji}</span>
          <div className="min-w-0 flex-1"><p className="font-semibold text-slate-950">{countryName(rec.country)}</p><p className="mt-0.5 text-sm text-slate-600">{rec.majorEmoji} {majorName(rec.major)}</p></div>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700">{goalName(rec.goal)}</span>
        </Link>
      })}
    </div>
  </section>
}

function CountryStudyPreview({ country, locale, isKo, category, major, basePath = "/countries/search" }: { country: NonNullable<ReturnType<typeof getLaunchCountry>>; locale: "en" | "ko"; isKo: boolean; category: string; major: string; basePath?: string }) {
  if (country.code === "AU" && !category) return <AustralianMajorCategoryGrid locale={locale} isKo={isKo} basePath={basePath} />

  const conceptIds = STUDY_CONCEPTS
    .filter((concept) => country.code === "AU" || (concept.coverageByCountry[country.code] ?? "CATALOG") !== "CATALOG")
    .map((concept) => concept.id)
  const concepts = conceptIds.map((id) => STUDY_CONCEPTS.find((concept) => concept.id === id)).filter((concept): concept is typeof STUDY_CONCEPTS[number] => Boolean(concept)).filter((concept) => !category || concept.category === category)
  const categoryLabel = isKo ? STUDY_CATEGORIES.find((item) => item.id === category)?.labelKo : STUDY_CATEGORIES.find((item) => item.id === category)?.label
  const title = isKo
    ? `${country.name}에서 살펴볼 ${categoryLabel ?? "대표"} 전공`
    : categoryLabel ? `Explore ${categoryLabel} study paths in ${country.name}` : country.code === "AU" ? "Featured study paths in Australia" : `Explore study paths in ${country.name}`
  const intro = isKo
    ? "전공을 먼저 고른 뒤, 원하는 목표를 선택해 지역·직업 경로를 비교해보세요."
    : "Choose a field first, then add the outcome you care about to compare regional career paths."

  return <section>
    <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">{country.name}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2><p className="mt-2 max-w-2xl text-slate-600">{intro}</p></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{concepts.map((concept) => {
      const selected = major === concept.id
      const href = productHref(basePath, locale, { ...(basePath === "/au/majors" ? {} : { country: country.code }), category: concept.category, major: concept.id })
      const { Icon, tone } = getStudyCategoryVisual(concept.category)
      return <Link key={concept.id} href={href} className={`group rounded-2xl border bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md ${selected ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
        <div className="flex items-start justify-between gap-3"><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span>{selected && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{isKo ? "선택됨" : "Selected"}</span>}</div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[.12em] text-blue-700">{concept.kind.replaceAll("_", " ")}</p><h3 className="mt-1 text-lg font-semibold text-slate-950">{isKo ? concept.labelKo : concept.label}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{concept.description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-blue-700">{isKo ? "이 전공 선택" : "Choose this field"}<ArrowRight className="h-4 w-4" /></span>
      </Link>
    })}</div>
  </section>
}

function AustralianMajorCategoryGrid({ locale, isKo, basePath }: { locale: "en" | "ko"; isKo: boolean; basePath: string }) {
  return <section>
    <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Australia</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{isKo ? "10개 전공 카테고리 탐색" : "Explore all 10 major categories"}</h2><p className="mt-2 max-w-2xl text-slate-600">{isKo ? "관심 분야를 먼저 고르면 관련 전공과 호주 내 직업 경로를 살펴볼 수 있어요." : "Start with an area of interest, then explore its study paths and Australian career outcomes."}</p></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{STUDY_CATEGORIES.map((item) => {
      const { Icon, tone } = getStudyCategoryVisual(item.id)
      const href = productHref(basePath, locale, { ...(basePath === "/au/majors" ? {} : { country: "AU" }), category: item.id })
      return <Link key={item.id} href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md">
        <span className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span>
        <h3 className="mt-5 text-base font-semibold leading-6 text-slate-950">{isKo ? item.labelKo : item.label}</h3>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-700">{isKo ? "전공 보기" : "Explore majors"}<ArrowRight className="h-4 w-4" /></span>
      </Link>
    })}</div>
  </section>
}

function LandingDiscoveryResults({ result, locale }: { result: LandingDiscoveryResult; locale: "en" | "ko" }) {
  const majorLabel = result.major?.label ?? "any field"
  const selected = result.selectedCountry
  const results = selected ? [selected, ...result.similar] : result.ranked

  return <section>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Destination signals</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{result.goal.label} for {majorLabel}</h2></div></div>
    {selected && <p className="mt-5 text-sm font-medium text-slate-700"><span className="font-semibold text-blue-700">{selected.name}</span> is your chosen country. These destinations have similarly strong signals for this search.</p>}
    <div className="mt-5 grid gap-4 sm:grid-cols-2">{results.map((country) => <LandingCountryCard key={country.code} country={country} locale={locale} />)}</div>
    {result.input.major === "anything" && <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="font-semibold text-blue-950">Not sure what to study yet?</h2><p className="mt-1 text-sm leading-6 text-blue-900">The country cards show the fields with the strongest country-level signals. Open a country’s map to explore occupations and regions before you choose a major.</p></div>}
  </section>
}

function LandingCountryCard({ country, locale }: { country: LandingDiscoveryResult["ranked"][number]; locale: "en" | "ko" }) {
  const launchCountry = LAUNCH_COUNTRIES.find((item) => item.code === country.code)
  return <Link href={localizePath(`/countries/${country.slug}`, locale)} className={`group block overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md ${country.selected ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
    {launchCountry && <div className="relative h-40 overflow-hidden"><Image src={launchCountry.image} alt={country.name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /></div>}
    <div className="p-5"><div className="flex items-center justify-between gap-3"><span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-blue-600 px-2 text-sm font-bold text-white">{country.rank}</span>{country.selected && <span className="text-xs font-semibold text-blue-700">Your choice</span>}</div><h3 className="mt-4 text-2xl font-semibold text-slate-950">{country.name}</h3><dl className="mt-5 space-y-2 text-sm"><Row label="Graduate salary signal" value={country.firstSalary} /><Row label="First-year cost signal" value={country.initialBudget} /><Row label="Post-study route" value={country.policy} /></dl><p className="mt-4 text-xs leading-5 text-slate-500">Promising fields: {country.bestMajors.join(", ")}</p></div>
  </Link>
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
      <label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">State or region (optional)</span><input value={state} onChange={(event) => setState(event.target.value)} placeholder="e.g. NSW" className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" /></label>
      <Select label="Priority" value={goal} onChange={(value) => setGoal(value as SearchGoalId)} options={[{ value: "", label: "Choose a goal" }, ...SEARCH_GOALS.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="Budget (optional)" value={budget} onChange={(value) => setBudget(value as BudgetBandId)} options={[{ value: "", label: "Any budget" }, ...BUDGET_BANDS.map((item) => ({ value: item.id, label: item.label }))]} />
      <button disabled={!ready} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Find paths <ArrowRight className="h-4 w-4" /></button>
    </form>
    {!ready ? <SearchNotice title="Choose a country and priority" body="You can add a state or region when you know where you want to live." /> : <MajorResult result={result} country={country} goal={goal} locale={locale} />}
  </DiscoveryLayout>
}

export function UniversitySearchClient({ initial }: { initial: { country?: string; category?: string; city?: string; career?: string; budget?: string } }) {
  const locale = usePathLocale()
  const router = useRouter()
  const [country, setCountry] = useState(initial.country ?? "")
  const [category, setCategory] = useState(() => initial.category ?? CANONICAL_CAREERS.find((item) => item.id === initial.career)?.categoryId ?? "")
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
  return <DiscoveryLayout eyebrow="Universities" title="Find the right university to study">
    <form action={href} onSubmit={(event) => { event.preventDefault(); if (ready) router.push(href) }} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr_1.1fr_1fr_auto]">
      <Select label="Destination country" value={country} onChange={setCountry} options={[{ value: "", label: "Choose a country" }, ...LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name }))]} />
      <Select label="Career category" value={category} onChange={(value) => { setCategory(value); setCareer("") }} options={[{ value: "", label: "Choose a category" }, ...STUDY_CATEGORIES.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="Career" value={career} disabled={!category} onChange={setCareer} options={[{ value: "", label: "Choose a career" }, ...careers.map((item) => ({ value: item.id, label: item.label }))]} />
      <Select label="First-year budget" value={budget} onChange={(value) => setBudget(value as BudgetBandId)} options={[{ value: "", label: "Choose a budget" }, ...BUDGET_BANDS.map((item) => ({ value: item.id, label: item.label }))]} />
      <button disabled={!ready} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Find universities <ArrowRight className="h-4 w-4" /></button>
      <label className="lg:col-span-2 block"><span className="mb-1 block text-xs font-semibold text-slate-600">City (optional)</span><input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Dublin" className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" /></label>
    </form>
    {!ready ? <SearchNotice title="Choose a country, career, and budget" body="City is optional; refine it when location matters to your study plan." /> : <UniversityResult result={result} country={country} locale={locale} />}
  </DiscoveryLayout>
}

function DiscoveryLayout({ eyebrow, title, body, children }: { eyebrow: string; title: string; body?: string; children: React.ReactNode }) {
  return <div className="bg-slate-50"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-11 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">{eyebrow}</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>{body && <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{body}</p>}</div></section><main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">{children}</main></div>
}

function Select({ label, value, onChange, options, disabled = false }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; disabled?: boolean }) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span><select aria-label={label} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function LoadingCards() { return <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div> }

function MajorResult({ result, country, goal, locale }: { result: DiscoveryEnvelope<MajorRecommendationsData> | null; country: string; goal: string; locale: "en" | "ko" }) {
  if (result?.data.recommendations.length) return <div />
  const landingGoal = goal === "lower-first-year-cost" ? "low-cost" : goal === "work-and-immigration" ? "immigration" : "high-income"
  return <section><SearchNotice title="Regional ranking under review" body="CampCareer will not use nationwide averages to rank a state or region. Explore canonical career paths and the country’s Maps data while local occupation evidence is reviewed." /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(result?.data.discoveryCareers ?? []).slice(0, 8).map((career) => <Link key={career.id} href={productHref("/countries/search", locale, { country: "everywhere", major: "anything", goal: landingGoal })} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300"><p className="text-sm font-semibold text-slate-950">{career.label}</p><span className="mt-3 inline-flex text-sm font-semibold text-blue-700">Check country fit <ArrowRight className="ml-1 h-4 w-4" /></span></Link>)}</div><Link href={localizePath(`/maps?country=${country.toLowerCase()}`, locale)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><MapPinned className="h-4 w-4" />Explore regional Maps data</Link></section>
}

function UniversityResult({ result, country, locale }: { result: DiscoveryEnvelope<UniversityMatchesData> | null; country: string; locale: "en" | "ko" }) {
  if (result?.data.matches.length) return <div />
  return <section><SearchNotice title="University matches under review" body={result?.data.reason ?? "We are checking programme, tuition, requirements, and graduate-outcome evidence before ranking universities."} /><Link href={localizePath(`/maps?country=${country.toLowerCase()}`, locale)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Building2 className="h-4 w-4" />Explore verified institutions on Maps <ExternalLink className="h-4 w-4" /></Link></section>
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 border-b border-slate-100 pb-2"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium capitalize text-slate-800">{value}</dd></div> }
