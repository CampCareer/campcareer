"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  CircleDollarSign,
  ExternalLink,
  GraduationCap,
  Loader2,
  Mail,
  Map,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { ORIGIN_PROFILES, type OriginProfileCode } from "@/lib/study-product/recommendation"
import type {
  CountryRecommendation,
  FitBand,
  RecommendationPriority,
  RecommendationResultV2,
  StudyLocale,
  TaxonomySearchResult,
} from "@/lib/study-product/types"
import { track } from "@/lib/analytics"
import { createClient } from "@/lib/supabase-client"
import { subscribeVisaAlerts } from "@/app/degree-risk/actions"

const EN_COPY = {
  eyebrow: "Study decisions backed by evidence",
  title: "Compare study paths—from qualification to career.",
  subtitle: "Search degrees, diplomas and trade qualifications, then compare total cost, career outcomes and post-study options across countries.",
  origin: "Where are you applying from?",
  study: "What do you want to study?",
  studyPlaceholder: "Nursing, Data Analytics, Carpentry…",
  budget: "Maximum first-year budget",
  priority: "What matters most?",
  compare: "Compare my study options",
  career: "Career outcome",
  cost: "Lower total cost",
  postStudy: "Post-study options",
  categories: "Browse by field",
  verified: "Verified sources",
  freeResults: "Results before sign-in",
  scope: "Degrees, diplomas and trades",
  ranked: "Your comparable destinations",
  rankedBody: "Only countries with a complete, reviewed pathway for this study option are ranked.",
  explore: "Explore available data",
  exploreBody: "These destinations have useful official data but are not ranked until the full pathway passes review.",
  showAll: "View all countries",
  showLess: "Show fewer countries",
  shortlist: "View verified courses",
  evidence: "Open evidence",
  save: "Save this plan",
  methodology: "How recommendations work",
  disclaimer: "Information and planning only—not legal, immigration, admissions or eligibility advice.",
  noRanked: "This option is searchable, but it does not yet have two fully reviewed destination pathways. Explore the official occupation and course data below instead.",
  officialProfile: "Open official profile",
  searchHint: "Search by a course, qualification or skill—not only a university major.",
}

type Copy = { [K in keyof typeof EN_COPY]: string }

const KO_COPY: Copy = {
  eyebrow: "검증된 근거로 비교하는 유학 선택",
  title: "과정부터 취업까지, 유학의 결과를 비교하세요.",
  subtitle: "대학 전공부터 기술 자격까지 검색하고, 국가별 총비용·취업 전망·졸업 후 경로를 검증된 자료로 비교해보세요.",
  origin: "어디에서 출발하나요?",
  study: "무엇을 배우고 싶나요?",
  studyPlaceholder: "간호, 데이터 분석, 목공…",
  budget: "첫해 최대 예산",
  priority: "가장 중요한 기준",
  compare: "내 유학 선택지 비교하기",
  career: "취업 결과",
  cost: "총비용 절감",
  postStudy: "졸업 후 선택지",
  categories: "분야별 찾아보기",
  verified: "검증된 출처",
  freeResults: "로그인 전 무료 결과",
  scope: "학위·디플로마·기술자격",
  ranked: "비교 가능한 목적국",
  rankedBody: "선택한 과정의 비용·취업·자격·졸업 후 경로가 모두 검수된 국가만 순위를 제공합니다.",
  explore: "확인 가능한 국가 자료",
  exploreBody: "공식 자료는 있지만 전체 경로 검수가 끝나지 않은 국가는 순위 없이 보여드립니다.",
  showAll: "전체 국가 보기",
  showLess: "접어두기",
  shortlist: "검증된 과정 보기",
  evidence: "근거 확인",
  save: "이 플랜 저장하기",
  methodology: "추천 방식 보기",
  disclaimer: "정보 제공 및 계획 도구이며 법률·이민·입학 또는 적격성 자문이 아닙니다.",
  noRanked: "검색 가능한 과정이지만 아직 두 개 이상의 목적국이 전체 검수 기준을 통과하지 않았습니다. 아래 공식 직업·과정 자료를 먼저 확인해보세요.",
  officialProfile: "공식 직업 자료 열기",
  searchHint: "대학 전공뿐 아니라 과정·자격·기술 이름으로 검색할 수 있습니다.",
}

const ORIGIN_OPTIONS: Array<{ code: OriginProfileCode; label: string; labelKo: string }> = [
  { code: "GLOBAL", label: "Global / Other", labelKo: "글로벌 / 기타" },
  { code: "IN", label: "India", labelKo: "인도" },
  { code: "PH", label: "Philippines", labelKo: "필리핀" },
  { code: "KR", label: "South Korea", labelKo: "대한민국" },
]

const DEFAULT_BUDGET: Record<OriginProfileCode, number> = {
  GLOBAL: 60_000,
  IN: 5_000_000,
  PH: 3_000_000,
  KR: 80_000_000,
  NG: 60_000,
  NP: 60_000,
  PK: 60_000,
  BD: 60_000,
  LK: 60_000,
}

export function HomeFinder({ locale = "en" }: { locale?: StudyLocale }) {
  const isKo = locale === "ko-KR"
  const copy = isKo ? KO_COPY : EN_COPY
  const [origin, setOrigin] = useState<OriginProfileCode>(isKo ? "KR" : "GLOBAL")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<TaxonomySearchResult | null>(null)
  const [results, setResults] = useState<TaxonomySearchResult[]>(() => conceptSearchResults(isKo))
  const [searchOpen, setSearchOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [budget, setBudget] = useState(DEFAULT_BUDGET[isKo ? "KR" : "GLOBAL"])
  const [priority, setPriority] = useState<RecommendationPriority>("CAREER_OUTCOME")
  const [recommendation, setRecommendation] = useState<RecommendationResultV2 | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const searchSequence = useRef(0)

  const currency = ORIGIN_PROFILES[origin].currency
  const budgetStep = currency === "KRW" ? 1_000_000 : currency === "INR" || currency === "PHP" ? 50_000 : 1_000
  const budgetFormatter = useMemo(
    () => new Intl.NumberFormat(isKo ? "ko-KR" : "en", { style: "currency", currency, maximumFractionDigits: 0 }),
    [currency, isKo],
  )

  useEffect(() => {
    setBudget(DEFAULT_BUDGET[origin])
  }, [origin])

  useEffect(() => {
    if (selected && query === selected.label) return
    if (!query.trim()) {
      setSearching(false)
      return
    }
    const timeout = window.setTimeout(async () => {
      const sequence = ++searchSequence.current
      setSearching(true)
      try {
        const response = await fetch(`/api/v1/taxonomy/search?q=${encodeURIComponent(query)}&locale=${locale}`)
        const payload = await response.json() as { results?: TaxonomySearchResult[] }
        if (sequence === searchSequence.current) setResults(payload.results ?? [])
      } catch {
        if (sequence === searchSequence.current) setResults([])
      } finally {
        if (sequence === searchSequence.current) setSearching(false)
      }
    }, query ? 180 : 0)
    return () => window.clearTimeout(timeout)
  }, [locale, query, selected])

  function chooseConcept(item: TaxonomySearchResult) {
    setSelected(item)
    setQuery(item.label)
    setSearchOpen(false)
    setRecommendation(null)
    setError(null)
  }

  function browseCategory(categoryId: string) {
    const categoryConcepts = STUDY_CONCEPTS
      .filter((concept) => concept.category === categoryId)
      .map<TaxonomySearchResult>((concept) => ({
        conceptId: concept.id,
        slug: concept.slug,
        kind: concept.kind,
        label: isKo ? concept.labelKo : concept.label,
        secondaryLabel: concept.description,
        officialCodes: concept.officialCodes ?? [],
        coverageByCountry: concept.coverageByCountry,
        recommendable: Boolean(concept.legacyField),
      }))
    setResults(categoryConcepts)
    setQuery("")
    setSelected(null)
    setSearchOpen(true)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (!selected) {
      setSearchOpen(true)
      setError(isKo ? "과정이나 전공을 먼저 선택해주세요." : "Choose a study option first.")
      return
    }
    if (!selected.recommendable) {
      if (selected.exploreHref) window.location.assign(selected.exploreHref)
      return
    }

    setSubmitting(true)
    setShowAll(false)
    track("recommendation_start", {
      origin,
      concept_id: selected.conceptId,
      priority,
    })
    try {
      const response = await fetch("/api/v2/recommendations/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          originCountry: origin,
          targetConceptId: selected.conceptId,
          firstYearBudget: { amount: budget, currency },
          priority,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? "Recommendation failed")
      setRecommendation(payload as RecommendationResultV2)
      track("recommendation_result_view", {
        origin,
        concept_id: selected.conceptId,
        ranked_count: (payload as RecommendationResultV2).rankedCountries.length,
      })
      window.setTimeout(() => document.getElementById("recommendation-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to compare options")
    } finally {
      setSubmitting(false)
    }
  }

  const visibleRanked = recommendation
    ? showAll ? recommendation.rankedCountries : recommendation.rankedCountries.slice(0, 5)
    : []

  return (
    <div className="bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.12),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)]">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,.88fr)] lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {copy.eyebrow}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[4rem]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {copy.subtitle}
            </p>

            <form onSubmit={submit} className="mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-5">
              <div className="grid gap-4 md:grid-cols-[.72fr_1.28fr]">
                <Field label={copy.origin}>
                  <select
                    value={origin}
                    onChange={(event) => setOrigin(event.target.value as OriginProfileCode)}
                    className={controlClass}
                  >
                    {ORIGIN_OPTIONS.map((option) => (
                      <option key={option.code} value={option.code}>{isKo ? option.labelKo : option.label}</option>
                    ))}
                  </select>
                </Field>

                <div className="relative">
                  <Field label={copy.study}>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                      <input
                        value={query}
                        onFocus={() => setSearchOpen(true)}
                        onChange={(event) => {
                          setQuery(event.target.value)
                          setSelected(null)
                          setSearchOpen(true)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") setSearchOpen(false)
                        }}
                        placeholder={copy.studyPlaceholder}
                        role="combobox"
                        aria-expanded={searchOpen}
                        aria-controls="study-search-results"
                        aria-autocomplete="list"
                        className={`${controlClass} pl-11 pr-10`}
                      />
                      {searching ? <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600" /> : <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
                    </div>
                  </Field>
                  {searchOpen && (
                    <SearchMenu
                      id="study-search-results"
                      items={results}
                      isKo={isKo}
                      onChoose={chooseConcept}
                      onClose={() => setSearchOpen(false)}
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[.72fr_1.28fr]">
                <Field label={copy.budget}>
                  <div className="relative">
                    <input
                      type="number"
                      min={budgetStep}
                      step={budgetStep}
                      value={budget}
                      onChange={(event) => setBudget(Math.max(1, Number(event.target.value)))}
                      className={`${controlClass} pr-16`}
                    />
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{currency}</span>
                  </div>
                  <span className="mt-1.5 block text-xs text-slate-500">{budgetFormatter.format(budget)}</span>
                </Field>

                <Field label={copy.priority}>
                  <div className="grid grid-cols-3 gap-2">
                    <PriorityButton active={priority === "CAREER_OUTCOME"} onClick={() => setPriority("CAREER_OUTCOME")}>{copy.career}</PriorityButton>
                    <PriorityButton active={priority === "LOWER_COST"} onClick={() => setPriority("LOWER_COST")}>{copy.cost}</PriorityButton>
                    <PriorityButton active={priority === "POST_STUDY_OPTIONS"} onClick={() => setPriority("POST_STUDY_OPTIONS")}>{copy.postStudy}</PriorityButton>
                  </div>
                </Field>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {copy.compare}
                </button>
                <Link href="/maps" prefetch={false} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Map className="h-4 w-4" />
                  {isKo ? "직업·연봉 지도" : "Career & salary map"}
                </Link>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">{copy.searchHint}</p>
              {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
            </form>
          </div>

          <ResultPreview copy={copy} isKo={isKo} recommendation={recommendation} />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{copy.categories}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {STUDY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => browseCategory(category.id)}
                className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {isKo ? category.labelKo : category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {recommendation && (
        <section id="recommendation-results" className="scroll-mt-24 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold text-blue-600">{recommendation.concept.label}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{copy.ranked}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{copy.rankedBody}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SavePlanButton result={recommendation} copy={copy} locale={locale} />
                <Link href="/methodology" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
                  <BookOpen className="h-4 w-4" />{copy.methodology}
                </Link>
              </div>
            </div>

            {visibleRanked.length > 0 ? (
              <>
                <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {visibleRanked.map((country, index) => (
                    <CountryResultCard key={country.countryCode} country={country} rank={index + 1} copy={copy} locale={locale} />
                  ))}
                </div>
                {recommendation.rankedCountries.length > 5 && (
                  <button type="button" onClick={() => setShowAll((value) => !value)} className="mt-6 min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    {showAll ? copy.showLess : copy.showAll}
                  </button>
                )}
              </>
            ) : (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">{copy.noRanked}</div>
            )}

            {recommendation.unrankedCountries.length > 0 && (
              <div className="mt-14">
                <h3 className="text-2xl font-semibold text-slate-950">{copy.explore}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{copy.exploreBody}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {recommendation.unrankedCountries.map((country) => (
                    <Link key={country.countryCode} href={country.exploreHref} prefetch={false} className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-slate-900">{country.countryName}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">{coverageLabel(country.coverage)}</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-500">{country.availableEvidence.join(" · ") || (isKo ? "공식 분류 자료" : "Official classification data")}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700">{copy.officialProfile}<ArrowRight className="h-3.5 w-3.5" /></span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">{recommendation.disclaimer}</div>
          </div>
        </section>
      )}

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:py-20">
          <TrustBlock icon={BadgeCheck} title={copy.verified} body={isKo ? "수치마다 출처·기준일·검수상태를 분리해서 표시합니다." : "Every metric carries its source, period and review status."} />
          <TrustBlock icon={GraduationCap} title={copy.scope} body={isKo ? "대학 학위와 직업교육·기술자격을 같은 검색 체계에서 연결합니다." : "University degrees and vocational qualifications share one search system."} />
          <TrustBlock icon={ShieldCheck} title={copy.freeResults} body={isKo ? "국가 비교와 근거를 먼저 보고 저장할 때만 인증합니다." : "See the comparison and evidence first; authenticate only when saving."} />
        </div>
      </section>
    </div>
  )
}

const controlClass = "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-slate-700">{label}</span>{children}</label>
}

function conceptSearchResults(isKo: boolean): TaxonomySearchResult[] {
  return STUDY_CONCEPTS.map((concept) => ({
    conceptId: concept.id,
    slug: concept.slug,
    kind: concept.kind,
    label: isKo ? concept.labelKo : concept.label,
    secondaryLabel: concept.description,
    officialCodes: concept.officialCodes ?? [],
    coverageByCountry: concept.coverageByCountry,
    recommendable: Boolean(concept.legacyField),
  }))
}

function PriorityButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-12 rounded-xl border px-2 text-xs font-bold leading-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
      {children}
    </button>
  )
}

function SearchMenu({ id, items, isKo, onChoose, onClose }: { id: string; items: TaxonomySearchResult[]; isKo: boolean; onChoose: (item: TaxonomySearchResult) => void; onClose: () => void }) {
  return (
    <div id={id} role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15">
      {items.length === 0 ? (
        <div className="px-3 py-8 text-center text-sm text-slate-500">{isKo ? "검색 결과가 없습니다. 다른 과정이나 기술명을 입력해보세요." : "No matching option yet. Try another course or skill name."}</div>
      ) : items.map((item) => (
        <button key={item.conceptId} type="button" role="option" aria-selected="false" onClick={() => onChoose(item)} className="flex w-full items-start justify-between gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <span>
            <span className="block text-sm font-bold text-slate-900">{item.label}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{item.secondaryLabel}</span>
            {item.matchedAlias && <span className="mt-1 block text-[11px] text-blue-600">{isKo ? "일치" : "Matched"}: {item.matchedAlias}</span>}
          </span>
          <span className={`mt-0.5 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${item.recommendable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {item.recommendable ? (isKo ? "비교 가능" : "Comparable") : (isKo ? "자료 보기" : "Explore")}
          </span>
        </button>
      ))}
      <button type="button" onClick={onClose} className="sr-only">Close results</button>
    </div>
  )
}

function ResultPreview({ copy, isKo, recommendation }: { copy: Copy; isKo: boolean; recommendation: RecommendationResultV2 | null }) {
  const country = recommendation?.rankedCountries[0]
  return (
    <aside className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-7" aria-live="polite">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">{country ? (isKo ? "현재 최상위 결과" : "Current leading result") : (isKo ? "결과 미리보기" : "Result preview")}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{country?.countryName ?? "Australia"}</h2>
        </div>
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><BriefcaseBusiness className="h-6 w-6" /></div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <PreviewMetric icon={CircleDollarSign} label={isKo ? "첫해 예산" : "First-year budget"} value={country?.metrics.find((metric) => metric.key === "FIRST_YEAR_COST")?.value.split(" · ")[0] ?? "US$43k–68k"} />
        <PreviewMetric icon={BriefcaseBusiness} label={isKo ? "경력 3년 연봉" : "Year-three salary"} value={country?.metrics.find((metric) => metric.key === "SALARY")?.value ?? "US$68k"} />
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-bold text-slate-500">{isKo ? "졸업 후 선택지" : "Post-study option"}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{country?.policy ?? "Post-study work route + occupation-specific pathways"}</p>
      </div>
      <div className="mt-4 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-600" />{copy.verified}</div>
        <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-600" />{country ? country.qualification : (isKo ? "학위·디플로마·기술자격" : "Degrees, diplomas and trade qualifications")}</div>
      </div>
      <p className="mt-6 border-t border-slate-200 pt-4 text-[11px] leading-5 text-slate-400">{copy.disclaimer}</p>
    </aside>
  )
}

function PreviewMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><Icon className="h-4 w-4 text-blue-600" /><p className="mt-3 text-[11px] font-bold text-slate-500">{label}</p><p className="mt-1 text-sm font-bold text-slate-950">{value}</p></div>
}

function CountryResultCard({ country, rank, copy, locale }: { country: CountryRecommendation; rank: number; copy: Copy; locale: StudyLocale }) {
  const isKo = locale === "ko-KR"
  const fit = fitBandCopy(country.fitBand, isKo)
  return (
    <article className="flex min-h-[520px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-400">#{rank}</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-950">{country.countryName}</h3>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${fit.className}`}>{fit.label}</span>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">{country.why}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {Object.entries(country.factorBreakdown).map(([key, value]) => (
          <div key={key} className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{factorLabel(key, isKo)}</p>
            <p className={`mt-1 text-xs font-bold ${value === "STRONG" ? "text-emerald-700" : value === "WEAK" ? "text-amber-700" : "text-slate-700"}`}>{value === "STRONG" ? (isKo ? "강함" : "Strong") : value === "WEAK" ? (isKo ? "주의" : "Weak") : (isKo ? "혼합" : "Mixed")}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {country.metrics.map((metric) => (
          <div key={metric.key} className="rounded-xl border border-slate-200 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{metric.label}</p>
            <p className="mt-1.5 text-sm font-bold leading-5 text-slate-900">{metric.value}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
              <span className={`rounded-full px-2 py-0.5 font-bold ${metric.sourceType === "OFFICIAL" ? "bg-emerald-50 text-emerald-700" : metric.sourceType === "MARKET" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{metric.sourceType}</span>
              {metric.sourceUrl ? <a href={metric.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-blue-700">{metric.sourceName}<ExternalLink className="h-3 w-3" /></a> : <span>{metric.sourceName}</span>}
              <span>· {metric.lastVerifiedAt}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900"><strong>{isKo ? "주의:" : "Watch:"}</strong> {country.caution}</div>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <Link href={`${country.shortlistHref}?locale=${locale}`} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700">{copy.shortlist}<ArrowRight className="h-3.5 w-3.5" /></Link>
        <Link href={country.detailHref} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50">{copy.evidence}<BookOpen className="h-3.5 w-3.5" /></Link>
      </div>
    </article>
  )
}

function TrustBlock({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return <div><div className="inline-flex rounded-xl bg-white/10 p-3"><Icon className="h-6 w-6 text-blue-300" /></div><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{body}</p></div>
}

function fitBandCopy(band: FitBand, isKo: boolean) {
  if (band === "STRONG_MATCH") return { label: isKo ? "강한 적합" : "Strong match", className: "bg-emerald-50 text-emerald-700" }
  if (band === "WORTH_CONSIDERING") return { label: isKo ? "검토 가치" : "Worth considering", className: "bg-blue-50 text-blue-700" }
  if (band === "IMPORTANT_TRADE_OFFS") return { label: isKo ? "조건 확인" : "Important trade-offs", className: "bg-amber-50 text-amber-700" }
  return { label: isKo ? "자료 확인 필요" : "Insufficient data", className: "bg-slate-100 text-slate-600" }
}

function factorLabel(key: string, isKo: boolean) {
  const labels: Record<string, [string, string]> = {
    careerOutcome: ["Career", "취업 결과"],
    affordability: ["Cost", "비용"],
    postStudyOptions: ["Post-study", "졸업 후"],
    pathwayFeasibility: ["Pathway", "과정·자격"],
  }
  return labels[key]?.[isKo ? 1 : 0] ?? key
}

function coverageLabel(value: string) {
  return value === "PATHWAY_READY" ? "Pathway" : value === "PROFILE_READY" ? "Profile" : "Catalog"
}

function SavePlanButton({ result, copy, locale }: { result: RecommendationResultV2; copy: Copy; locale: StudyLocale }) {
  const isKo = locale === "ko-KR"
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [alerts, setAlerts] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createIntent() {
    const response = await fetch("/api/v1/decision-plans/save-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.input),
    })
    const payload = await response.json() as { intentId?: string; claimToken?: string; error?: string }
    if (!response.ok || !payload.intentId || !payload.claimToken) throw new Error(payload.error ?? "Unable to prepare plan save")
    return payload as { intentId: string; claimToken: string }
  }

  async function startSave() {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setOpen(true)
        return
      }
      const intent = await createIntent()
      track("plan_save_requested", { concept_id: result.concept.id, signed_in: true })
      window.location.assign(`/plans/claim?intent=${encodeURIComponent(intent.intentId)}&claim=${encodeURIComponent(intent.claimToken)}`)
    } catch (reason) {
      setOpen(true)
      setError(reason instanceof Error ? reason.message : "Unable to save plan")
    } finally {
      setLoading(false)
    }
  }

  async function emailSave(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const intent = await createIntent()
      if (alerts) {
        await subscribeVisaAlerts({
          email,
          country: null,
          field: result.concept.id,
          locale,
          sourcePath: location.pathname,
          consent: true,
        })
      }
      const next = `/plans/claim?intent=${encodeURIComponent(intent.intentId)}&claim=${encodeURIComponent(intent.claimToken)}`
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (authError) throw authError
      track("plan_save_requested", { concept_id: result.concept.id, signed_in: false })
      setSent(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to send save link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" onClick={startSave} disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
        {loading && !open ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}{copy.save}
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false) }}>
          <div role="dialog" aria-modal="true" aria-labelledby="save-plan-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{result.concept.label}</p>
                <h3 id="save-plan-title" className="mt-2 text-2xl font-semibold text-slate-950">{isKo ? "이 비교 결과 저장하기" : "Save this comparison"}</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            {sent ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                <div className="flex items-center gap-2 font-bold"><Mail className="h-5 w-5" />{isKo ? "이메일을 확인해주세요" : "Check your email"}</div>
                <p className="mt-2">{isKo ? "일회용 로그인 링크를 열면 플랜이 계정에 저장됩니다." : "Open the one-time sign-in link to attach this plan to your account."}</p>
              </div>
            ) : (
              <form onSubmit={emailSave} className="mt-6">
                <label className="block text-xs font-bold text-slate-700" htmlFor="plan-save-email">Email</label>
                <input id="plan-save-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={`${controlClass} mt-2`} />
                <p className="mt-2 text-xs leading-5 text-slate-500">{isKo ? "이메일은 Supabase Auth의 로그인과 플랜 소유권 확인에만 사용됩니다." : "Your email is handled by Supabase Auth for sign-in and plan ownership."}</p>
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-600">
                  <input type="checkbox" checked={alerts} onChange={(event) => setAlerts(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-blue-600" />
                  <span>{isKo ? "선택: 이 과정과 관련된 정책 변경 알림도 신청합니다. 별도 확인 이메일이 발송됩니다." : "Optional: also subscribe to policy updates for this study option. A separate confirmation email will be sent."}</span>
                </label>
                <button type="submit" disabled={loading} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}{isKo ? "로그인 링크 보내기" : "Email me a sign-in link"}</button>
                {error && <p className="mt-3 text-xs text-red-600" role="alert">{error}</p>}
                <p className="mt-4 text-[11px] leading-5 text-slate-400">{isKo ? "플랜 저장은 필수 서비스 처리이며, 정책 알림 동의와 분리됩니다." : "Plan saving is a required service action and is separate from optional policy-alert consent."} <Link href="/privacy" className="underline">{isKo ? "개인정보 처리방침" : "Privacy policy"}</Link></p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
