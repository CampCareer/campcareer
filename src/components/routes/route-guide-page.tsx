"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, ExternalLink, Search } from "lucide-react"
import type { RouteJobs } from "@/data/au-route-jobs-contract"
import type { RouteOverview, RouteOverviewLabourProfile } from "@/data/au-route-overview-contract"
import { type AuStateCode, type RouteStudyOption, type RouteStudyOptions } from "@/data/au-route-study-contract"
import { type LocalizedText, type RouteGuide, type RouteLink, type RouteLinkType, type RouteLocale, type RouteSource } from "@/data/route-guides"
import { findAustraliaRouteCandidates, type AustraliaRouteCandidate } from "@/data/route-taxonomy"
import { findPublishedRoute, getPublishedAustraliaRouteCandidates, routeResultsHref, type RouteGoal } from "@/lib/route-search"
import { routeMapHref } from "@/lib/route-map-link"
import { localizePath } from "@/lib/i18n/config"
import { recordRouteEvent } from "@/lib/analytics"
import { RouteExternalLink, RouteMapLink, RouteResultAnalytics } from "./route-result-interactions"

type ResultTab = "overview" | "study" | "jobs" | "map"

export function RouteGuidePage({ guide, locale, initialQuery, goal, initialState, initialOverview }: { guide: RouteGuide; locale: RouteLocale; initialQuery?: string; goal?: RouteGoal; initialState?: AuStateCode | null; initialOverview?: RouteOverview | null }) {
  const isKo = locale === "ko"
  const text = (value: LocalizedText) => value[locale]
  const selectedGoal = goal && guide.goals.includes(goal) ? goal : guide.goals[0]
  const [activeTab, setActiveTab] = useState<ResultTab>("overview")
  const [selectedState, setSelectedState] = useState<AuStateCode | null>(initialState ?? null)

  useEffect(() => {
    setSelectedState(initialState ?? null)
  }, [guide.id, initialState])

  function chooseState(state: AuStateCode | null) {
    setSelectedState(state)
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    if (state) url.searchParams.set("state", state)
    else url.searchParams.delete("state")
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }

  const tabLabels: Array<{ id: ResultTab; label: string }> = [
    { id: "overview", label: isKo ? "개요" : "Overview" },
    { id: "study", label: isKo ? "학업" : "Study" },
    { id: "jobs", label: isKo ? "일자리" : "Jobs" },
    { id: "map", label: isKo ? "지도" : "Map" },
  ]

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-white text-[#1b1b1b]">
      <RouteResultAnalytics guideId={guide.id} locale={locale} />
      <RouteSearchRail guide={guide} locale={locale} initialQuery={initialQuery} initialGoal={selectedGoal} />

      <section className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 pb-6 pt-9 sm:px-6 sm:pt-11">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">{text(guide.destination.name)} · {goalLabel(selectedGoal, locale)}</p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.05em] text-[#202124] sm:text-5xl">{text(guide.target)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{isKo ? "검증된 학업·취업·지역 링크를 한 결과에서 확인하세요." : "Verified study, work, and regional links — in one result."}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 sm:inline-flex">
          <CheckCircle2 className="size-3.5" />
          {isKo ? `출처 확인 ${guide.lastVerified}` : `Sources checked ${guide.lastVerified}`}
        </div>
      </section>

      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto border-y border-slate-200 px-5 sm:gap-6 sm:px-6" aria-label={isKo ? "결과 보기" : "Result views"}>
        {tabLabels.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center border-b-2 px-2 py-3 text-sm font-semibold transition sm:min-w-0 sm:px-0 sm:py-4 ${activeTab === tab.id ? "border-slate-950 text-slate-950" : "border-transparent text-slate-500 hover:text-slate-950"}`}>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={`mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:py-10 ${activeTab === "study" || activeTab === "jobs" ? "grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(330px,.82fr)] lg:gap-12" : ""}`}>
        <section aria-live="polite">
          {activeTab === "overview" && <Overview guide={guide} locale={locale} initialOverview={initialOverview} selectedState={selectedState} onSelectState={chooseState} />}
          {activeTab === "study" && <Study guide={guide} locale={locale} />}
          {activeTab === "jobs" && <Jobs guide={guide} locale={locale} selectedState={selectedState} onSelectState={chooseState} />}
          {activeTab === "map" && <MapEvidence guide={guide} locale={locale} selectedState={selectedState} onSelectState={chooseState} />}
          <NextStep guide={guide} locale={locale} activeTab={activeTab} />
        </section>

        {(activeTab === "study" || activeTab === "jobs") && <aside className="self-start rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-[8.5rem]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{activeTab === "study" ? (isKo ? "지역별 학업" : "Study by region") : (isKo ? "지역별 일자리" : "Jobs by region")}</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#202124]">{activeTab === "study" ? (isKo ? "어디서 배울까" : "Where to study") : (isKo ? "어디서 일할까" : "Where to work")}</h2>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-[#f7f8f8] p-4">
            <h3 className="text-base font-semibold">{text(guide.map.signals[0]?.region ?? guide.destination.name)}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{activeTab === "study" ? (isKo ? "과정의 지역·입학 조건은 기관의 최신 페이지에서 비교하세요." : "Compare the provider's location and current entry conditions directly.") : activeTab === "jobs" ? (isKo ? "실제 공고에서 근무지와 지원 자격을 확인하세요." : "Use live listings to confirm the location and eligibility.") : text(guide.map.signals[0]?.detail ?? guide.map.signals[0].detail)}</p>
            <RouteExternalLink href={guide.map.signals[0]?.source.url ?? guide.map.source.url} linkType="map" guideId={guide.id} locale={locale} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline">
              {guide.map.signals[0]?.source.operator ?? guide.map.source.operator}<ExternalLink className="size-3" />
            </RouteExternalLink>
          </div>
          <button type="button" onClick={() => setActiveTab("map")} className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
            <span>{isKo ? "지도에서 지역 신호 보기" : "View regional signals on the map"}</span><ArrowRight className="size-4" />
          </button>
          <p className="mt-4 text-xs leading-5 text-slate-500">{isKo ? "지역 신호는 조사 출발점이며, 채용 수나 취업을 보장하지 않습니다." : "Regional signals are research starting points, not vacancy counts or job guarantees."}</p>
        </aside>}
      </div>
    </main>
  )
}

export function RouteSearchRail({ guide, locale, initialQuery, initialGoal }: { guide?: RouteGuide; locale: RouteLocale; initialQuery?: string; initialGoal?: RouteGoal }) {
  const router = useRouter()
  const isKo = locale === "ko"
  const [field, setField] = useState(initialQuery || guide?.target[locale] || "")
  const [goal, setGoal] = useState<RouteGoal>(initialGoal ?? guide?.goals[0] ?? "work")
  const [isEditing, setIsEditing] = useState(false)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const started = useRef(false)
  const suggestions = useMemo(() => field.trim() ? findAustraliaRouteCandidates(field) : getPublishedAustraliaRouteCandidates(), [field])
  const searchSummary = `${isKo ? "호주" : "Australia"} · ${guide?.target[locale] ?? field} · ${goalLabel(goal, locale)}`

  function trackStart() {
    if (started.current) return
    started.current = true
    recordRouteEvent("route_search_started", { locale, surface: "route_result" })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    trackStart()
    recordRouteEvent("route_search_submitted", { locale, surface: "route_result" })
    setOpen(false)
    const found = findPublishedRoute({ citizenship: "KR", destination: "AU", field, goal })
    if (found) {
      router.push(localizePath(routeResultsHref(field, goal), locale))
      return
    }
    setMessage(isKo ? "아직 이 조합은 검증 중입니다. 랜딩에서 조사 요청을 남길 수 있어요." : "This combination is still being researched. You can request it from the search page.")
  }

  function choose(candidate: AustraliaRouteCandidate) {
    setField(candidate.label[locale])
    setOpen(false)
    setMessage("")
  }

  return (
    <section className="sticky top-14 z-30 border-y border-slate-200 bg-white/95 px-4 py-2 backdrop-blur-md sm:top-16 sm:px-6 sm:py-3">
      <div className={`${isEditing ? "hidden" : "flex"} mx-auto max-w-6xl items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.04)] md:hidden`}>
        <p className="min-w-0 truncate text-sm font-semibold text-slate-950">{searchSummary}</p>
        <button type="button" onClick={() => setIsEditing(true)} aria-expanded={isEditing} aria-controls="result-search-form" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"><Search className="size-3.5" />{isKo ? "검색 수정" : "Edit search"}</button>
      </div>
      <form id="result-search-form" onSubmit={submit} className={`${isEditing ? "grid" : "hidden"} mx-auto max-w-6xl overflow-visible rounded-2xl border border-slate-300 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.05)] md:grid md:grid-cols-[1fr_1.65fr_.82fr_auto]`}>
        <label className="border-b border-slate-200 px-4 py-3 md:border-b-0 md:border-r">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{isKo ? "목적지" : "Destination"}</span>
          <span className="mt-1 block text-sm font-semibold text-slate-950">🇦🇺 {isKo ? "호주" : "Australia"}</span>
        </label>
        <label className="relative border-b border-slate-200 px-4 py-3 md:border-b-0 md:border-r">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{isKo ? "하고 싶은 일" : "What do you want to do?"}</span>
          <input value={field} onFocus={() => { trackStart(); setOpen(true) }} onChange={(event) => { setField(event.target.value); setOpen(true); setMessage("") }} className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-950 outline-none placeholder:font-normal" aria-label={isKo ? "하고 싶은 일" : "What do you want to do?"} />
          {open && (
            <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl md:absolute md:left-0 md:right-0 md:top-[calc(100%+0.5rem)] md:z-40 md:mt-0">
              <p className="px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{isKo ? "추천 직업" : "Suggested careers"}</p>
              {suggestions.map((candidate) => <CandidateOption key={candidate.id} candidate={candidate} locale={locale} onChoose={choose} />)}
            </div>
          )}
        </label>
        <label className="border-b border-slate-200 px-4 py-3 md:border-b-0 md:border-r">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{isKo ? "목표" : "Goal"}</span>
          <select value={goal} onFocus={trackStart} onChange={(event) => { setGoal(event.target.value as RouteGoal); setMessage("") }} className="mt-1 w-full appearance-none border-0 bg-transparent p-0 text-sm font-semibold text-slate-950 outline-none">
            <option value="work">{isKo ? "취업" : "Work"}</option><option value="study">{isKo ? "학업" : "Study"}</option><option value="study-to-work">{isKo ? "학업 후 취업" : "Study to work"}</option>
          </select>
        </label>
        <button type="submit" className="m-2 flex h-10 self-center items-center justify-center gap-2 rounded-xl bg-[#202124] px-5 text-sm font-semibold text-white transition hover:bg-black"><Search className="size-4" />{isKo ? "검색" : "Search"}</button>
      </form>
      {message && <p className="mx-auto mt-2 max-w-6xl text-xs text-slate-500">{message}</p>}
    </section>
  )
}

function CandidateOption({ candidate, locale, onChoose }: { candidate: AustraliaRouteCandidate; locale: RouteLocale; onChoose: (candidate: AustraliaRouteCandidate) => void }) {
  const secondaryLocale = locale === "ko" ? "en" : "ko"
  return <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onChoose(candidate)} className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-slate-50"><span className="text-sm font-semibold text-slate-950">{candidate.label[locale]}</span><span className="text-xs text-slate-500">{candidate.label[secondaryLocale]}</span></button>
}

function Overview({ guide, locale, initialOverview, selectedState, onSelectState }: { guide: RouteGuide; locale: RouteLocale; initialOverview?: RouteOverview | null; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const seededOverview = initialOverview?.candidateId === guide.candidateId ? initialOverview : null
  const [overview, setOverview] = useState<RouteOverview | null>(seededOverview ?? null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">(seededOverview ? "ready" : "loading")

  useEffect(() => {
    if (!guide.candidateId) {
      setOverview(null)
      setStatus("ready")
      return
    }
    if (initialOverview?.candidateId === guide.candidateId) {
      setOverview(initialOverview)
      setStatus("ready")
      return
    }

    const controller = new AbortController()
    setStatus("loading")
    void fetch(`/api/au/route-overview/${encodeURIComponent(guide.candidateId)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Overview request failed: ${response.status}`)
        return response.json() as Promise<RouteOverview>
      })
      .then((data) => {
        setOverview(data)
        setStatus("ready")
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setOverview(null)
        setStatus("error")
      })

    return () => controller.abort()
  }, [guide.candidateId, initialOverview])

  if (status === "loading") return <OverviewLoading locale={locale} />
  if (!overview) return <OverviewUnavailable guide={guide} locale={locale} />
  return <OverviewSignals overview={overview} guide={guide} locale={locale} selectedState={selectedState} onSelectState={onSelectState} />
}

function OverviewLoading({ locale }: { locale: RouteLocale }) {
  const isKo = locale === "ko"
  return <section aria-busy="true"><SectionHeading eyebrow={isKo ? "호주 직업 시장" : "Australia labour market"} title={isKo ? "공식 시장 데이터 확인 중" : "Checking official market data"} /><div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"><div className="h-3 w-24 rounded bg-slate-200" /><div className="mt-4 h-9 w-28 rounded bg-slate-100" /><div className="mt-3 h-3 w-full rounded bg-slate-100" /></div>)}</div></section>
}

function OverviewSignals({ overview, guide, locale, selectedState, onSelectState }: { overview: RouteOverview; guide: RouteGuide; locale: RouteLocale; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const primaryProfile = overview.labourProfiles[0]

  return <section>
    {primaryProfile ? <>
      <MarketSnapshot overview={overview} profile={primaryProfile} guide={guide} locale={locale} />
      <LabourMarketDetail profile={primaryProfile} overview={overview} guide={guide} locale={locale} selectedState={selectedState} onSelectState={onSelectState} />
      {overview.labourProfiles.length > 1 && <AdditionalProfiles profiles={overview.labourProfiles.slice(1)} guide={guide} locale={locale} />}
    </> : <LabourProfileUnavailable overview={overview} guide={guide} locale={locale} />}
    <EligibilitySummary guide={guide} locale={locale} />
    <Requirements guide={guide} locale={locale} />
  </section>
}

function MarketSnapshot({ overview, profile, guide, locale }: { overview: RouteOverview; profile: RouteOverviewLabourProfile; guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const annualEquivalent = profile.medianWeeklyEarningsAud ? profile.medianWeeklyEarningsAud * 52 : null
  const ratings = overview.shortage?.ratings ?? []
  const shortageStateCount = new Set(ratings.flatMap((rating) => Object.entries(rating.stateRatings).flatMap(([state, status]) => status !== "NS" ? [state] : []))).size
  const shortage = shortageSummary(ratings.map((rating) => rating.nationalRating), locale)
  const sourceDate = profile.dataAsAt ? formatCourseDate(profile.dataAsAt, locale) : null

  return <section>
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{isKo ? "호주 직업 시장" : "Australia labour market"}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#202124]">{isKo ? "숫자로 보는 현재 위치" : "The market, at a glance"}</h2></div>
      <RouteExternalLink href={profile.sourceUrl} linkType="map" guideId={guide.id} locale={locale} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline">JSA {sourceDate ? (isKo ? `기준 ${sourceDate}` : `as at ${sourceDate}`) : ""}<ExternalLink className="size-3" /></RouteExternalLink>
    </header>
    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{isKo ? "소득·고용·근무 형태는 JSA의 과거 ANZSCO 직업군 기준입니다. 부족 신호는 정확한 OSCA 직업 기준으로 별도 표시합니다." : "Earnings, employment, and work patterns use JSA's historical ANZSCO occupation group. Shortage is shown separately for the exact OSCA occupation."}</p>
    <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
      <MarketMetric label={isKo ? "연 환산 중위 소득" : "Annualised median earnings"} value={annualEquivalent ? `A$${annualEquivalent.toLocaleString("en-AU")}` : (isKo ? "공개 안 됨" : "Not published")} detail={profile.medianWeeklyEarningsAud ? (isKo ? `중위 주급 A$${profile.medianWeeklyEarningsAud.toLocaleString("en-AU")}` : `A$${profile.medianWeeklyEarningsAud.toLocaleString("en-AU")} median weekly`) : undefined} />
      <MarketMetric label={isKo ? "고용 규모" : "Employment"} value={profile.employmentTotal ? profile.employmentTotal.toLocaleString("en-AU") : (isKo ? "공개 안 됨" : "Not published")} detail={isKo ? "해당 JSA 직업군" : "In this JSA occupation group"} />
      <MarketMetric label={isKo ? "부족직종 신호" : "Shortage signal"} value={shortageStateCount ? `${shortageStateCount}${isKo ? "개 주·준주" : " states"}` : shortage.title} detail={ratings.length ? (isKo ? "공식 JSA 부족 신호" : "Official JSA shortage signal") : (isKo ? "공식 레코드 없음" : "No official record")} />
      <MarketMetric label={isKo ? "풀타임 비중" : "Full-time share"} value={profile.fullTimeSharePct != null ? `${profile.fullTimeSharePct}%` : (isKo ? "공개 안 됨" : "Not published")} detail={profile.averageFullTimeHours != null ? (isKo ? `평균 ${profile.averageFullTimeHours}시간/주` : `Average ${profile.averageFullTimeHours} hours/week`) : undefined} />
    </dl>
    <p className="mt-3 text-[11px] leading-5 text-slate-500">{isKo ? "연 환산은 중위 주급 × 52의 단순 계산이며 제시 연봉이나 보장 금액이 아닙니다. 부족 신호는 채용공고 수나 개인의 취업 가능성을 뜻하지 않습니다." : "The annual figure is median weekly earnings × 52, not a salary offer or guarantee. A shortage signal is not a count of openings or a decision about individual eligibility."}</p>
  </section>
}

function MarketMetric({ label, value, detail }: { label: string; value: string; detail?: string }) { return <div className="min-w-0 bg-white px-4 py-5 sm:px-5"><dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</dt><dd className="mt-2 break-words text-2xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-3xl">{value}</dd>{detail && <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>}</div> }

function LabourMarketDetail({ profile, overview, guide, locale, selectedState, onSelectState }: { profile: RouteOverviewLabourProfile; overview: RouteOverview; guide: RouteGuide; locale: RouteLocale; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const isKo = locale === "ko"
  return <section className="mt-8 grid gap-4 lg:grid-cols-2">
    <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{isKo ? "지역 분포" : "Regional distribution"}</p><h3 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-slate-950">{isKo ? "사람들이 일하는 주" : "Where people work"}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "주를 선택하면 일자리·학업·지도가 같은 지역으로 이어집니다." : "Choose a state to keep Jobs, Study, and Map focused on the same place."}</p><StateDistribution profile={profile} locale={locale} selectedState={selectedState} onSelectState={onSelectState} /><RouteExternalLink href={profile.sourceUrl} linkType="map" guideId={guide.id} locale={locale} className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline">JSA {isKo ? "직업 프로필 출처" : "occupation profile source"}<ExternalLink className="size-3" /></RouteExternalLink></article>
    <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{isKo ? "근무 프로필" : "Work profile"}</p><h3 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-slate-950">{isKo ? "현재 직업군의 구성" : "How this occupation group looks today"}</h3><WorkProfile profile={profile} skill={overview.skillLevels[0]} locale={locale} /><p className="mt-5 text-[11px] leading-5 text-slate-500">{isKo ? "학력은 현재 종사자 분포이며 입학·면허 요건이 아닙니다. OSCA 기술 수준도 개인 자격 판정이 아닙니다." : "Education is the current workforce distribution, not an admission or licensing requirement. OSCA skill level is not a personal eligibility decision."}</p></article>
  </section>
}

function StateDistribution({ profile, locale, selectedState, onSelectState }: { profile: RouteOverviewLabourProfile; locale: RouteLocale; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const isKo = locale === "ko"
  if (!profile.stateDistribution.length) return <p className="mt-5 text-sm leading-6 text-slate-500">{isKo ? "주별 분포는 현재 공개되지 않았습니다." : "State distribution is not currently published."}</p>
  return <div className="mt-5 space-y-2">{profile.stateDistribution.map((item) => {
    const isStateCode = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].includes(item.name)
    const state = isStateCode ? item.name as AuStateCode : null
    const label = state ? stateLabel(state, locale) : item.name
    return <button key={item.name} type="button" disabled={!state} aria-pressed={selectedState === state} onClick={() => state && onSelectState(state)} className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition ${state ? "hover:bg-slate-50" : "cursor-default"}`}><span className="w-16 shrink-0 text-xs font-semibold text-slate-700">{label}</span><span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${selectedState === state ? "bg-slate-950" : "bg-slate-500"}`} style={{ width: `${Math.min(item.sharePct, 100)}%` }} /></span><span className="w-10 shrink-0 text-right text-xs font-semibold text-slate-700">{item.sharePct}%</span></button>
  })}</div>
}

function WorkProfile({ profile, skill, locale }: { profile: RouteOverviewLabourProfile; skill: RouteOverview["skillLevels"][number] | undefined; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const items = [
    profile.medianAge != null ? { label: isKo ? "중위 연령" : "Median age", value: isKo ? `${profile.medianAge}세` : `${profile.medianAge} years` } : null,
    profile.femaleSharePct != null ? { label: isKo ? "여성 비중" : "Female share", value: `${profile.femaleSharePct}%` } : null,
    profile.partTimeSharePct != null ? { label: isKo ? "파트타임 비중" : "Part-time share", value: `${profile.partTimeSharePct}%` } : null,
    skill ? { label: isKo ? "OSCA 기술 수준" : "OSCA skill level", value: String(skill.level) } : null,
  ].filter((item): item is { label: string; value: string } => item !== null)
  return <><dl className="mt-5 grid grid-cols-2 gap-2">{items.map((item) => <div key={item.label} className="rounded-xl bg-slate-50 p-3"><dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{item.label}</dt><dd className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.value}</dd></div>)}</dl>{profile.educationDistribution.length > 0 && <div className="mt-5 border-t border-slate-100 pt-5"><div className="flex items-baseline justify-between gap-3"><p className="text-sm font-semibold text-slate-900">{isKo ? "현재 종사자의 학력" : "Education of current workers"}</p><p className="text-xs text-slate-500">{isKo ? "비중" : "Share"}</p></div><div className="mt-3 space-y-2.5">{profile.educationDistribution.slice(0, 4).map((item) => <div key={item.name}><div className="flex items-baseline justify-between gap-3 text-xs"><span className="font-medium text-slate-700">{item.name}</span><span className="shrink-0 font-semibold text-slate-900">{item.sharePct}%</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-700" style={{ width: `${Math.min(item.sharePct, 100)}%` }} /></div></div>)}</div></div>}</>
}

function AdditionalProfiles({ profiles, guide, locale }: { profiles: RouteOverviewLabourProfile[]; guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  return <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="text-sm font-semibold text-slate-950">{isKo ? "함께 참고할 JSA 직업군" : "Additional JSA occupation groups"}</p><p className="mt-1 text-sm leading-6 text-slate-600">{isKo ? "이 검색은 하나 이상의 과거 JSA 직업군과 연결됩니다. 아래 수치는 별도 그룹으로 읽으세요." : "This search maps to more than one historical JSA occupation group. Read these figures as separate groups."}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{profiles.map((profile) => <RouteExternalLink key={profile.anzscoV13} href={profile.sourceUrl} linkType="map" guideId={guide.id} locale={locale} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-400"><p className="text-sm font-semibold text-slate-950">{profile.label[locale]}</p><p className="mt-2 text-sm text-slate-600">{profile.employmentTotal ? `${profile.employmentTotal.toLocaleString("en-AU")} ${isKo ? "명 고용" : "employed"}` : (isKo ? "고용 규모 미공개" : "Employment not published")}</p></RouteExternalLink>)}</div></section>
}

function EligibilitySummary({ guide, locale }: { guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const text = (value: LocalizedText) => value[locale]
  const isNursing = guide.candidateId === "registered-nurse"
  return <section className="mt-9 rounded-2xl border border-[#e7e7e3] bg-[#f6f6f4] p-5 sm:p-6"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{isKo ? "지원 전 확인" : "Before you apply"}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{isKo ? "시장 신호와 자격은 별개입니다" : "Market signals and eligibility are separate"}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{text(guide.availability.summary)}</p><div className="mt-5 grid gap-2 sm:grid-cols-3"><EligibilityItem label={isKo ? "직무·등록" : "Role and registration"} value={isNursing ? (isKo ? "호주 간호 등록 확인" : "Check Australian nursing registration") : (isKo ? "직무별 자격 확인" : "Check occupation-specific requirements")} /><EligibilityItem label={isKo ? "근무 권한" : "Work rights"} value={isKo ? "여권과 비자 경로별로 다름" : "Depends on passport and visa route"} /><EligibilityItem label={isKo ? "영어 기준" : "English standard"} value={isNursing ? (isKo ? "등록과 입학 기준을 각각 확인" : "Check registration and admission separately") : (isKo ? "기관·고용주별 현재 기준" : "Current provider and employer requirements")} /></div><SourceLine source={guide.availability.source} locale={locale} linkType="visa" guideId={guide.id} /></section>
}

function EligibilityItem({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-[#e2e2de] bg-white p-3"><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold leading-5 text-slate-900">{value}</p></div> }

function LabourProfileUnavailable({ overview, guide, locale }: { overview: RouteOverview; guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const ratings = overview.shortage?.ratings ?? []
  const shortage = shortageSummary(ratings.map((rating) => rating.nationalRating), locale)
  return <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{isKo ? "호주 직업 시장" : "Australia labour market"}</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-slate-950">{ratings.length ? shortage.title : (isKo ? "직업 시장 수치 준비 중" : "Market figures are being prepared")}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "이 검색 의도를 과거 JSA 소득·고용 통계와 안전하게 연결할 수 있을 때만 수치와 그래프를 표시합니다. 넓은 분야 숫자로 대신하지 않습니다." : "Figures and charts appear only when this search intent can be safely bridged to historical JSA earnings and employment statistics. We do not substitute a broad-field number."}</p><RouteExternalLink href={overview.shortage?.sourceUrl ?? "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations"} linkType="map" guideId={guide.id} locale={locale} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline">{isKo ? "JSA 직업 데이터 열기" : "Open JSA occupation data"}<ExternalLink className="size-3" /></RouteExternalLink></article>
}

function Requirements({ guide, locale }: { guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const text = (value: LocalizedText) => value[locale]
  return <section className="mt-9 border-t border-slate-200 pt-8"><SectionHeading eyebrow={isKo ? "핵심 조건" : "Key checks"} title={isKo ? "비용을 쓰기 전 확인할 것" : "Check these before spending money"} /><div className="mt-5 grid gap-3">{guide.preparation.slice(0, 3).map((step) => <article key={step.title.en} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm font-semibold text-slate-950">{text(step.title)}</p><p className="mt-1 text-sm leading-6 text-slate-600">{text(step.detail)}</p>{step.source && <SourceLine source={step.source} locale={locale} linkType={preparationLinkType(step.source)} guideId={guide.id} />}</article>)}</div></section>
}

function OverviewUnavailable({ guide, locale }: { guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  return <section className="mt-9"><Requirements guide={guide} locale={locale} /><p className="mt-5 text-xs leading-5 text-slate-500">{isKo ? "직업 신호 데이터는 현재 확인할 수 없습니다. 출처가 복구되기 전 숫자를 표시하지 않습니다." : "Occupation signals are temporarily unavailable. No figures are shown until the source-backed data is available."}</p></section>
}

function shortageSummary(ratings: readonly string[], locale: RouteLocale) {
  const isKo = locale === "ko"
  if (!ratings.length) return { title: isKo ? "확인 필요" : "To confirm" }
  if (ratings.every((rating) => rating === "S")) return { title: isKo ? "전국 부족직종" : "National shortage" }
  if (ratings.every((rating) => rating === "R")) return { title: isKo ? "지역 부족직종" : "Regional shortage" }
  if (ratings.every((rating) => rating === "M")) return { title: isKo ? "대도시 부족직종" : "Metropolitan shortage" }
  if (ratings.every((rating) => rating === "NS")) return { title: isKo ? "전국 부족 아님" : "No national shortage" }
  return { title: isKo ? "세부 직업별 혼합" : "Mixed across included roles" }
}

function preparationLinkType(source: RouteSource): RouteLinkType {
  if (source.sourceType === "education-provider" || source.sourceType === "training-register") return "course"
  if (source.sourceType === "employer") return "employer"
  if (source.sourceType === "map-evidence") return "map"
  return "visa"
}

function Study({ guide, locale }: { guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const [studyData, setStudyData] = useState<RouteStudyOptions | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [selectedState, setSelectedState] = useState<AuStateCode | "all">("all")

  useEffect(() => {
    const candidateId = guide.candidateId
    if (!candidateId) {
      setStudyData(null)
      setStatus("ready")
      return
    }

    const controller = new AbortController()
    setStatus("loading")
    setSelectedState("all")
    void fetch(`/api/au/route-study-options/${encodeURIComponent(candidateId)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Study options request failed: ${response.status}`)
        return response.json() as Promise<RouteStudyOptions>
      })
      .then((data) => {
        setStudyData(data)
        setStatus("ready")
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setStudyData(null)
        setStatus("error")
      })
    return () => controller.abort()
  }, [guide.candidateId])

  const availableStates = useMemo(() => {
    const values = new Set<AuStateCode>()
    for (const option of studyData?.options ?? []) for (const campus of option.campuses) values.add(campus.state)
    return [...values].sort()
  }, [studyData])
  const visibleOptions = selectedState === "all"
    ? studyData?.options ?? []
    : (studyData?.options ?? []).filter((option) => option.campuses.some((campus) => campus.state === selectedState))

  if (status === "loading") return <StudyLoading locale={locale} />

  if (studyData?.kind === "training") {
    return <StudyResources
      guide={guide}
      locale={locale}
      eyebrow={isKo ? "현장 훈련" : "Training"}
      title={isKo ? "과정보다 현장 준비를 먼저 확인하세요" : "Start with site readiness, not a broad degree"}
      detail={isKo ? "광산 현장직은 일반 학위 과정으로 묶지 않습니다. 공식 훈련 기준과 실제 공고의 현장 조건을 함께 확인하세요." : "Mining site work is not treated as a generic university degree. Check official training standards alongside real job requirements."}
      researchOnly
    />
  }

  if (status === "error") {
    return <StudyResources
      guide={guide}
      locale={locale}
      eyebrow={isKo ? "공식 과정 조사" : "Official course research"}
      title={isKo ? "과정 데이터를 지금 불러올 수 없습니다" : "Course data is temporarily unavailable"}
      detail={isKo ? "비교 카드를 추정으로 채우지 않습니다. 아래 공식 과정·훈련 자료를 먼저 확인하고 나중에 다시 시도해 주세요." : "We do not fill comparison cards with estimates. Use the official course and training research below, then try again later."}
      researchOnly
    />
  }

  if (!studyData?.options.length) {
    return <StudyResources
      guide={guide}
      locale={locale}
      eyebrow={isKo ? "공식 과정 조사" : "Official course research"}
      title={isKo ? "비교 가능한 과정 카드는 아직 없습니다" : "Comparable course cards are not available yet"}
      detail={isKo ? "학비·기간·영어·실제 캠퍼스가 함께 검증된 과정만 비교 카드로 표시합니다. 아래는 비교표가 아닌, 지원 전에 직접 확인할 공식 과정·훈련 자료입니다." : "Only courses with verified tuition, duration, English requirements, and actual campuses become comparison cards. The links below are official course or training research, not a comparison table."}
      researchOnly
    />
  }

  return <section>
    <SectionHeading eyebrow={isKo ? "학업" : "Study"} title={isKo ? "검증된 실제 과정" : "Verified course options"} />
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{isKo ? "직업명으로 정확히 매칭한 과정만 표시합니다. 주 필터는 학교 본부가 아니라 공식 과정 페이지의 실제 캠퍼스 기준입니다." : "Only courses matched to this career are shown. State filters use the actual delivery campus on the provider's course page, never the provider's head office."}</p>
    <div className="mt-5 flex flex-wrap gap-2" aria-label={isKo ? "과정 캠퍼스 주 필터" : "Course campus state filter"}>
      <StateFilter value="all" selected={selectedState === "all"} onSelect={setSelectedState} locale={locale} />
      {availableStates.map((state) => <StateFilter key={state} value={state} selected={selectedState === state} onSelect={setSelectedState} locale={locale} />)}
    </div>
    <p className="mt-3 text-xs leading-5 text-slate-500">{isKo ? "과정 페이지·캠퍼스·핵심 사실이 확인된 기관 링크입니다. 학비·입학 조건은 지원 전 기관 페이지에서 다시 확인하세요." : "These are provider links with a verified course page, campus, and core facts. Recheck fees and entry conditions with the provider before applying."}</p>
    <div className="mt-5 space-y-4">
      {visibleOptions.map((option) => <VerifiedCourseCard key={option.id} option={option} guideId={guide.id} locale={locale} />)}
    </div>
    <StudyResources guide={guide} locale={locale} eyebrow={isKo ? "추가 공식 자료" : "More official resources"} title={isKo ? "추가로 확인할 기관·과정 자료" : "More provider and course resources"} compact excludeUrls={studyData.options.map((option) => option.officialUrl)} />
  </section>
}

function StudyLoading({ locale }: { locale: RouteLocale }) {
  const isKo = locale === "ko"
  return <section aria-busy="true"><SectionHeading eyebrow={isKo ? "학업" : "Study"} title={isKo ? "검증된 과정 확인 중" : "Checking verified course options"} /><div className="mt-5 space-y-4">{[0, 1].map((item) => <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"><div className="h-4 w-40 rounded bg-slate-200" /><div className="mt-3 h-6 w-3/4 rounded bg-slate-100" /><div className="mt-5 grid gap-2 sm:grid-cols-3"><div className="h-16 rounded-lg bg-slate-100" /><div className="h-16 rounded-lg bg-slate-100" /><div className="h-16 rounded-lg bg-slate-100" /></div></div>)}</div></section>
}

function StudyResources({ guide, locale, eyebrow, title, detail, compact = false, excludeUrls = [], researchOnly = false }: { guide: RouteGuide; locale: RouteLocale; eyebrow: string; title: string; detail?: string; compact?: boolean; excludeUrls?: readonly string[]; researchOnly?: boolean }) {
  const resources = guide.courses.filter((course) => !excludeUrls.includes(course.url))

  if (resources.length === 0) return null

  return <section className={compact ? "mt-9 border-t border-slate-200 pt-8" : ""}><SectionHeading eyebrow={eyebrow} title={title} />{detail && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{detail}</p>}{researchOnly && <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">{locale === "ko" ? "아래 링크에는 아직 비교 가능한 학비·기간·영어·캠퍼스 정보가 함께 검증되지 않았습니다." : "The links below do not yet have tuition, duration, English, and campus facts verified together for comparison."}</p>}<div className="mt-4 space-y-3">{resources.map((course) => <ActionCard key={course.url} item={course} locale={locale} guideId={guide.id} />)}</div></section>
}

function StateFilter({ value, selected, onSelect, locale }: { value: AuStateCode | "all"; selected: boolean; onSelect: (value: AuStateCode | "all") => void; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const label = value === "all" ? (isKo ? "전체 호주" : "All Australia") : `${stateLabel(value, locale)} · ${value}`
  return <button type="button" aria-pressed={selected} onClick={() => onSelect(value)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${selected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}>{label}</button>
}

function VerifiedCourseCard({ option, guideId, locale }: { option: RouteStudyOption; guideId: string; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const tuition = option.tuitionAud ? `A$${option.tuitionAud.toLocaleString("en-AU")}${option.tuitionYear ? ` · ${option.tuitionYear}` : ""}` : (isKo ? "학비 확인 필요" : "Fee to confirm")
  const campuses = option.campuses.map((campus) => `${campus.name}, ${stateLabel(campus.state, locale)}`).join(" · ")
  const checked = option.officialCheckedAt ? formatCourseDate(option.officialCheckedAt, locale) : null
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-semibold text-slate-500">{option.providerName}</p><h3 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-slate-950">{option.title}</h3>{option.qualification && <p className="mt-1 text-sm text-slate-600">{option.qualification}{option.courseCode ? ` · CRICOS ${option.courseCode}` : ""}</p>}</div><span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800"><CheckCircle2 className="size-3" />{isKo ? "기관 링크 검증" : "Provider link verified"}</span></div><dl className="mt-5 grid gap-2 sm:grid-cols-3"><CourseFact label={isKo ? "실제 캠퍼스" : "Actual campus"} value={campuses} /><CourseFact label={isKo ? "연간 학비" : "Annual tuition"} value={tuition} hint={option.tuitionSource === "provider" ? (isKo ? "기관 페이지 기준" : "Provider page") : option.tuitionSource === "registry" ? "CRICOS" : undefined} /><CourseFact label={isKo ? "기간" : "Duration"} value={option.duration?.value ?? (isKo ? "확인 필요" : "To confirm")} /></dl>{option.intakes && <CourseDetail label={isKo ? "입학 시기" : "Intakes"} fact={option.intakes} locale={locale} />}{option.englishRequirement && <CourseDetail label={isKo ? "영어 요건" : "English"} fact={option.englishRequirement} locale={locale} />}{option.entryRequirements && <CourseDetail label={isKo ? "입학 요건" : "Entry"} fact={option.entryRequirements} locale={locale} />}<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><p className="text-[11px] text-slate-500">{checked ? (isKo ? `기관 과정 링크 확인 ${checked}` : `Provider course link checked ${checked}`) : (isKo ? "기관 과정 링크 검증" : "Provider course link verified")}</p><RouteExternalLink href={option.officialUrl} linkType="course" guideId={guideId} locale={locale} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:underline">{isKo ? "공식 과정 페이지" : "Official course page"}<ExternalLink className="size-3.5" /></RouteExternalLink></div></article>
}

function CourseFact({ label, value, hint }: { label: string; value: string; hint?: string }) { return <div className="rounded-xl bg-slate-50 px-3 py-3"><dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold leading-5 text-slate-900">{value}</dd>{hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}</div> }

function CourseDetail({ label, fact, locale }: { label: string; fact: { value: string; sourceUrl: string; reviewedAt: string | null }; locale: RouteLocale }) { return <div className="mt-4 border-t border-slate-100 pt-4"><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p><p className="mt-1 text-sm leading-6 text-slate-700">{fact.value}</p>{fact.reviewedAt && <p className="mt-1 text-[11px] text-slate-400">{locale === "ko" ? `확인 ${formatCourseDate(fact.reviewedAt, locale)}` : `Reviewed ${formatCourseDate(fact.reviewedAt, locale)}`}</p>}</div> }

function stateLabel(state: AuStateCode, locale: RouteLocale) { const names: Record<AuStateCode, { en: string; ko: string }> = { ACT: { en: "Australian Capital Territory", ko: "수도 준주" }, NSW: { en: "New South Wales", ko: "뉴사우스웨일스" }, NT: { en: "Northern Territory", ko: "노던 테리토리" }, QLD: { en: "Queensland", ko: "퀸즐랜드" }, SA: { en: "South Australia", ko: "사우스오스트레일리아" }, TAS: { en: "Tasmania", ko: "태즈메이니아" }, VIC: { en: "Victoria", ko: "빅토리아" }, WA: { en: "Western Australia", ko: "웨스턴오스트레일리아" } }; return names[state][locale] }

function formatCourseDate(value: string, locale: RouteLocale) { const date = new Date(value); if (Number.isNaN(date.getTime())) return value.slice(0, 10); return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-AU", { year: "numeric", month: "short", day: "numeric" }).format(date) }
function formatSignedPercentage(value: number, locale: RouteLocale) { const formatted = new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-AU", { maximumFractionDigits: 2 }).format(value); return `${value > 0 ? "+" : ""}${formatted}%` }

function Jobs({ guide, locale, selectedState, onSelectState }: { guide: RouteGuide; locale: RouteLocale; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const isKo = locale === "ko"
  const [jobs, setJobs] = useState<RouteJobs | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    if (!guide.candidateId) {
      setJobs(null)
      setStatus("ready")
      return
    }

    const controller = new AbortController()
    const params = selectedState ? `?state=${selectedState}` : ""
    setStatus("loading")
    void fetch(`/api/au/route-jobs/${encodeURIComponent(guide.candidateId)}${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Jobs request failed: ${response.status}`)
        return response.json() as Promise<RouteJobs>
      })
      .then((data) => {
        setJobs(data)
        setStatus("ready")
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setJobs(null)
        setStatus("error")
      })

    return () => controller.abort()
  }, [guide.candidateId, selectedState])

  return <section>
    <SectionHeading eyebrow={isKo ? "일자리" : "Work"} title={isKo ? "채용 신호와 실제 공고를 분리해서 보세요" : "Separate hiring signals from live roles"} />
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{isKo ? "위의 수치는 JSA 직업군 데이터이고, 아래 링크는 현재 공고입니다. 수치가 특정 고용주의 오픈 포지션이나 취업 가능성을 보장하지는 않습니다." : "The figures below are JSA occupation-group signals; the links open live roles. Neither is a promise of an opening with a specific employer or of eligibility."}</p>

    {status === "loading" && <JobsLoading locale={locale} />}
    {status === "ready" && jobs && <JobsSignals jobs={jobs} guide={guide} locale={locale} selectedState={selectedState} onSelectState={onSelectState} />}
    {status === "error" && <JobsUnavailable guide={guide} locale={locale} />}
    {status === "ready" && !jobs && <JobsUnavailable guide={guide} locale={locale} />}

    <section className="mt-9 border-t border-slate-200 pt-8">
      <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{isKo ? "실시간 공고와 고용주 페이지" : "Live job listings and employer pages"}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{isKo ? "지원 전에는 반드시 공고의 직무명, 근무지, 등록·면허, 경력, 근무 권한 요건을 읽으세요." : "Before applying, read the live listing for its exact title, location, registration or licence, experience, and work-right requirements."}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{guide.jobs.map((job) => <ActionCard key={job.url} item={job} locale={locale} guideId={guide.id} compact />)}</div>
      {guide.employers.length > 0 && <><h4 className="mt-7 text-sm font-semibold text-slate-500">{isKo ? "고용주 채용 페이지" : "Employer career pages"}</h4><div className="mt-3 flex flex-wrap gap-2">{guide.employers.map((employer) => <RouteExternalLink key={employer.url} href={employer.url} linkType="employer" guideId={guide.id} locale={locale} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"><span>{employer.label[locale]}</span><ExternalLink className="size-3.5" /></RouteExternalLink>)}</div></>}
    </section>
  </section>
}

function JobsLoading({ locale }: { locale: RouteLocale }) {
  const isKo = locale === "ko"
  return <section className="mt-7" aria-busy="true"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{isKo ? "공식 채용 데이터" : "Official hiring data"}</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"><div className="h-3 w-24 rounded bg-slate-200" /><div className="mt-3 h-8 w-28 rounded bg-slate-100" /><div className="mt-3 h-3 w-full rounded bg-slate-100" /></div>)}</div></section>
}

function JobsSignals({ jobs, guide, locale, selectedState, onSelectState }: { jobs: RouteJobs; guide: RouteGuide; locale: RouteLocale; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const isKo = locale === "ko"
  const vacancies = jobs.vacancy?.values ?? []
  const selectedVacancy = selectedState ? vacancies.find((value) => value.state === selectedState) ?? null : null
  const totalVacancies = vacancies.reduce((total, value) => total + value.vacancyCount, 0)
  const includedUnitGroups = selectedVacancy?.includedUnitGroups ?? jobs.historicalUnitGroups.length
  const currentVacancy = selectedVacancy?.vacancyCount ?? totalVacancies
  const region = jobs.regionalEmployment

  return <section className="mt-7">
    {vacancies.length > 1 && <div className="flex flex-wrap gap-2" aria-label={isKo ? "주 또는 준주 선택" : "Choose a state or territory"}>
      <button type="button" onClick={() => onSelectState(null)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedState === null ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}>{isKo ? "호주 전체" : "All Australia"}</button>
      {vacancies.map((value) => <button key={value.state} type="button" onClick={() => onSelectState(value.state)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedState === value.state ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}>{stateLabel(value.state, locale)}</button>)}
    </div>}

    {jobs.vacancy ? <>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{isKo ? "현재 채용 신호" : "Current vacancy signal"}</p><p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{currentVacancy.toLocaleString()}</p><p className="mt-2 text-sm leading-5 text-slate-600">{selectedVacancy ? stateLabel(selectedVacancy.state, locale) : (isKo ? `${vacancies.length}개 주·준주 합산` : `sum across ${vacancies.length} states and territories`)}</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{isKo ? "포함된 직업군" : "Included job groups"}</p><p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{includedUnitGroups}</p><p className="mt-2 text-sm leading-5 text-slate-600">{isKo ? "JSA 과거 ANZSCO 직업군 기준" : "Historical JSA ANZSCO occupation groups"}</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{isKo ? "기준 시점" : "Reference period"}</p><p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">{formatCourseDate(jobs.vacancy.source.dataAsAt ?? vacancies[0]?.period ?? "", locale)}</p><p className="mt-2 text-sm leading-5 text-slate-600">{isKo ? "3개월 평균 · 개별 실시간 공고 수 아님" : "Three-month average · not a live-listing count"}</p></article>
      </div>
      <RouteExternalLink href={jobs.vacancy.source.url} linkType="job" guideId={guide.id} locale={locale} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline">{jobs.vacancy.source.name} · {isKo ? "확인일" : "Checked"} {jobs.vacancy.source.checkedAt ?? guide.lastVerified}<ExternalLink className="size-3" /></RouteExternalLink>
    </> : <article className="mt-4 rounded-2xl border border-slate-200 bg-[#f7f8f8] p-5"><p className="text-sm font-semibold text-slate-950">{isKo ? "JSA 수치 연결 보류" : "JSA figures withheld"}</p><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "이 검색 직업은 현재 데이터에 의사결정에 쓸 만큼 명확한 OSCA→ANZSCO 직업군 연결이 없어, 넓은 분야 수치로 대체하지 않습니다." : "The current data does not provide a decision-safe OSCA-to-ANZSCO group bridge for this search intent, so no broad-field substitute is shown."}</p></article>}

    <section className="mt-7"><h3 className="text-base font-semibold text-slate-950">{isKo ? "공고에서 함께 검색할 직무명" : "Role titles to try in live listings"}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "직업군 이름만으로 지원 자격을 판단하지 말고, 아래 직함을 각각 검색해 현재 공고의 요건을 비교하세요." : "Do not infer eligibility from an occupation label. Search these titles separately and compare the requirements in each live role."}</p><div className="mt-3 flex flex-wrap gap-2">{jobs.titleSearches.map((title) => <span key={title} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">{title}</span>)}</div></section>

    {selectedState && region && <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{isKo ? "지역 고용 기반" : "Regional employment base"}</p><h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">{isKo ? `${stateLabel(selectedState, locale)}에서 먼저 볼 지역` : `Regions to inspect in ${stateLabel(selectedState, locale)}`}</h3></div><RouteMapLink href={buildMapHrefForState(guide, selectedState)} guideId={guide.id} locale={locale} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:underline">{isKo ? "지도 열기" : "Open map"}<ArrowRight className="size-3.5" /></RouteMapLink></div><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "고용 인원 기반이 큰 SA4 지역입니다. 이는 현재 채용 공고 수가 아니므로 실제 직무·고용주 공고로 다시 확인하세요." : "These SA4 regions have the largest employment base, not the largest count of live openings. Recheck the live role and employer listing."}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{region.values.map((item) => <article key={item.sa4Code} className="rounded-xl bg-[#f7f8f8] p-4"><p className="text-sm font-semibold text-slate-950">{item.name}</p><p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">{item.employmentTotal.toLocaleString()}</p><p className="mt-1 text-xs text-slate-500">{isKo ? "해당 직업군 고용 인원" : "people employed in included group(s)"}{item.annualChangePct != null ? ` · ${formatSignedPercentage(item.annualChangePct, locale)} ${isKo ? "전년 대비" : "year on year"}` : item.annualChange != null ? ` · ${item.annualChange >= 0 ? "+" : ""}${item.annualChange.toLocaleString()} ${isKo ? "전년 대비" : "year on year"}` : ""}</p></article>)}</div><RouteExternalLink href={region.source.url} linkType="map" guideId={guide.id} locale={locale} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline">{region.source.name} · {isKo ? "기준" : "As at"} {formatCourseDate(region.source.dataAsAt ?? region.values[0]?.period ?? "", locale)}<ExternalLink className="size-3" /></RouteExternalLink></section>}
  </section>
}

function JobsUnavailable({ guide, locale }: { guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  return <article className="mt-7 rounded-2xl border border-slate-200 bg-[#f7f8f8] p-5"><p className="text-sm font-semibold text-slate-950">{isKo ? "공식 채용 데이터는 잠시 표시할 수 없습니다" : "Official hiring data is temporarily unavailable"}</p><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "아래의 검증된 구직·고용주 링크에서 현재 공고를 먼저 확인하고, 나중에 다시 시도해 주세요." : "Use the verified live job and employer links below, then try the official data again later."}</p><RouteExternalLink href={guide.jobs[0]?.url ?? guide.map.source.url} linkType="job" guideId={guide.id} locale={locale} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:underline">{isKo ? "실시간 공고 열기" : "Open live roles"}<ExternalLink className="size-3.5" /></RouteExternalLink></article>
}

function MapEvidence({ guide, locale, selectedState, onSelectState }: { guide: RouteGuide; locale: RouteLocale; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const isKo = locale === "ko"
  const text = (value: LocalizedText) => value[locale]

  return <section className="rounded-2xl border border-slate-200 bg-[#f7f8f8] p-6">
    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{isKo ? "지도" : "Map"}</p>
    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{isKo ? "지도로 다음 질문을 좁혀보세요." : "Use the map to narrow your next question."}</h2>
    <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">{isKo ? "주(State)를 선택해 지역별 직업·고용·워킹홀리데이 신호를 탐색하세요. 이 결과는 근거의 준비 상태를 보여주며, 빈자리를 숫자로 꾸며내지 않습니다." : "Choose a state to explore regional occupation, employment, and working-holiday signals. The map shows evidence readiness, never invented vacancy counts."}</p>
    <MapStateLauncher guide={guide} locale={locale} selectedState={selectedState} onSelectState={onSelectState} />
    {selectedState && <MapRegionalPreview guide={guide} locale={locale} selectedState={selectedState} />}
    <div className="mt-6 grid gap-2 sm:grid-cols-2">{guide.map.signals.map((signal) => <div key={signal.region.en} className="rounded-xl border border-slate-200 bg-white p-3"><p className="font-semibold text-slate-900">{text(signal.region)}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text(signal.detail)}</p></div>)}</div>
  </section>
}

/**
 * The map needs a state before it can load regional evidence. These are only
 * states where the route's exact historical JSA bridge has an official signal;
 * this is navigation context, not a second rendering of Jobs' vacancy figures.
 */
function MapStateLauncher({ guide, locale, selectedState, onSelectState }: { guide: RouteGuide; locale: RouteLocale; selectedState: AuStateCode | null; onSelectState: (state: AuStateCode | null) => void }) {
  const isKo = locale === "ko"
  const [states, setStates] = useState<AuStateCode[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading")

  useEffect(() => {
    if (!guide.candidateId) {
      setStates([])
      setStatus("unavailable")
      return
    }

    const controller = new AbortController()
    setStatus("loading")
    void fetch(`/api/au/route-jobs/${encodeURIComponent(guide.candidateId)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Map state request failed: ${response.status}`)
        return response.json() as Promise<RouteJobs>
      })
      .then((data) => {
        setStates(data.vacancy?.values.map((value) => value.state) ?? [])
        setStatus("ready")
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setStates([])
        setStatus("unavailable")
      })

    return () => controller.abort()
  }, [guide.candidateId])

  if (status === "loading") {
    return <div className="mt-6 h-10 w-56 animate-pulse rounded-xl bg-slate-200" aria-busy="true" />
  }

  if (states.length === 0) return <p className="mt-6 text-sm leading-6 text-slate-600">{isKo ? "이 직업은 지도에 안전하게 연결할 수 있는 주별 공식 신호가 아직 없습니다. 일자리 탭의 실시간 공고와 공식 출처를 먼저 확인하세요." : "This occupation does not yet have a state-level official signal that can be safely connected to the map. Start with the live roles and official sources in Jobs."}</p>

  return <div className="mt-6">
    <p className="text-sm font-semibold text-slate-900">{isKo ? "먼저 볼 주를 고르세요" : "Choose a state to inspect first"}</p>
    <p className="mt-1 text-xs leading-5 text-slate-500">{isKo ? "표시되는 주는 이 경로에 연결 가능한 공식 JSA 채용 신호가 있는 곳입니다. 선택하면 아래에 지역별 고용 기반을 미리 보여드립니다." : "Shown states have an official JSA hiring signal that can be safely connected to this route. Select one to preview its regional employment base below."}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {states.map((state) => <button key={state} type="button" aria-pressed={selectedState === state} onClick={() => onSelectState(state)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${selectedState === state ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-950 hover:text-slate-950"}`}>{stateLabel(state, locale)}</button>)}
    </div>
  </div>
}

function MapRegionalPreview({ guide, locale, selectedState }: { guide: RouteGuide; locale: RouteLocale; selectedState: AuStateCode }) {
  const isKo = locale === "ko"
  const [jobs, setJobs] = useState<RouteJobs | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading")

  useEffect(() => {
    if (!guide.candidateId) {
      setJobs(null)
      setStatus("unavailable")
      return
    }
    const controller = new AbortController()
    setStatus("loading")
    void fetch(`/api/au/route-jobs/${encodeURIComponent(guide.candidateId)}?state=${selectedState}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Map preview request failed: ${response.status}`)
        return response.json() as Promise<RouteJobs>
      })
      .then((data) => {
        setJobs(data)
        setStatus("ready")
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setJobs(null)
        setStatus("unavailable")
      })
    return () => controller.abort()
  }, [guide.candidateId, selectedState])

  if (status === "loading") return <div className="mt-6 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"><div className="h-3 w-28 rounded bg-slate-200" /><div className="mt-3 h-7 w-48 rounded bg-slate-100" /><div className="mt-5 h-32 rounded-xl bg-slate-100" /></div>
  if (status !== "ready" || !jobs) return <p className="mt-6 text-sm leading-6 text-slate-600">{isKo ? "이 주의 공식 지역 데이터를 지금은 불러올 수 없습니다. 전체 지도와 실시간 공고에서 다시 확인하세요." : "Official regional data for this state is unavailable right now. Check the full map and live roles instead."}</p>

  const vacancy = jobs.vacancy?.values.find((value) => value.state === selectedState) ?? null
  const regional = jobs.regionalEmployment
  if (!vacancy && !regional) return <p className="mt-6 text-sm leading-6 text-slate-600">{isKo ? "이 주의 직업별 지역 신호는 아직 준비되지 않았습니다. 전체 지도에서 다른 근거를 탐색하세요." : "A regional signal for this occupation and state is not ready yet. Use the full map to explore other evidence."}</p>

  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{isKo ? "JSA 지역 고용 미리보기" : "JSA regional employment preview"}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">{isKo ? `${stateLabel(selectedState, locale)}에서 먼저 볼 지역` : `Where to look first in ${stateLabel(selectedState, locale)}`}</h3>
      </div>
      {vacancy && <div className="rounded-xl bg-[#f7f8f8] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{isKo ? "현재 채용 신호" : "Current vacancy signal"}</p><p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-slate-950">{vacancy.vacancyCount.toLocaleString()}</p><p className="mt-1 text-[11px] text-slate-500">{formatCourseDate(vacancy.period, locale)} · {isKo ? "3개월 평균" : "3-month average"}</p></div>}
    </div>
    {regional ? <>
      <p className="mt-3 text-sm leading-6 text-slate-600">{isKo ? "아래는 이 직업군의 고용 기반이 큰 SA4 지역입니다. 실시간 공고 수가 아니므로, 지도에서 고용주·직무 신호를 이어서 확인하세요." : "These SA4 areas have the largest employment base for the included occupation group(s). They are not a count of live openings; continue on the map for employer and role signals."}</p>
      <ol className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">{regional.values.map((item, index) => <li key={item.sa4Code} className="flex items-center gap-3 px-4 py-3"><span className="w-5 text-sm font-semibold text-slate-400">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-950">{item.name}</p><p className="mt-0.5 text-xs text-slate-500">{isKo ? "추정 고용 인원" : "Estimated employed"}</p></div><div className="text-right"><p className="text-sm font-semibold text-slate-950">{item.employmentTotal.toLocaleString()}</p>{item.annualChangePct != null && <p className={`mt-0.5 text-xs font-medium ${item.annualChangePct >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{formatSignedPercentage(item.annualChangePct, locale)}</p>}</div></li>)}</ol>
      <RouteExternalLink href={regional.source.url} linkType="map" guideId={guide.id} locale={locale} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline">{regional.source.name} · {isKo ? "기준" : "As at"} {formatCourseDate(regional.source.dataAsAt ?? regional.values[0]?.period ?? "", locale)}<ExternalLink className="size-3" /></RouteExternalLink>
    </> : <p className="mt-3 text-sm leading-6 text-slate-600">{isKo ? "이 주의 세부 지역 고용 기반은 아직 준비되지 않았습니다." : "A detailed regional employment base is not ready for this state yet."}</p>}
    <RouteMapLink href={buildMapHrefForState(guide, selectedState)} guideId={guide.id} locale={locale} className="mt-5 flex items-center justify-between rounded-xl bg-[#202124] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"><span>{isKo ? `${stateLabel(selectedState, locale)} 전체 지도 열기` : `Open the full ${stateLabel(selectedState, locale)} map`}</span><ArrowRight className="size-4" /></RouteMapLink>
    <p className="mt-3 text-xs leading-5 text-slate-500">{isKo ? "지역 신호는 조사 출발점이며, 채용 수나 취업을 보장하지 않습니다." : "Regional signals are research starting points, not vacancy counts or job guarantees."}</p>
  </section>
}

function NextStep({ guide, locale, activeTab }: { guide: RouteGuide; locale: RouteLocale; activeTab: ResultTab }) {
  const isKo = locale === "ko"; const text = (value: LocalizedText) => value[locale]
  const step = guide.preparation[activeTab === "study" ? 1 : activeTab === "jobs" ? 2 : 0] ?? guide.preparation[0]
  return <article className="mt-8 flex flex-wrap items-center gap-4 rounded-xl bg-[#202124] px-5 py-4 text-white"><span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-300">{isKo ? "다음" : "Next"}</span><p className="min-w-0 flex-1 text-sm leading-6">{text(step.detail)}</p>{step.source && <RouteExternalLink href={step.source.url} linkType="visa" guideId={guide.id} locale={locale} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-white hover:underline">{isKo ? "출처 열기" : "Open source"}<ExternalLink className="size-3.5" /></RouteExternalLink>}</article>
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) { return <header><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{eyebrow}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#202124]">{title}</h2></header> }

function ActionCard({ item, locale, guideId, compact = false }: { item: RouteLink; locale: RouteLocale; guideId: string; compact?: boolean }) { const text = (value: LocalizedText) => value[locale]; return <RouteExternalLink href={item.url} linkType={item.linkType} guideId={guideId} locale={locale} className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"><span className="flex items-start justify-between gap-4"><span><span className="block text-sm font-semibold text-slate-950">{text(item.label)}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{text(item.detail)}</span>{!compact && <span className="mt-3 block text-xs font-medium text-slate-500">{text(item.relevance)}</span>}<span className="mt-3 block text-[11px] text-slate-400">{item.source.operator} · {locale === "ko" ? "확인일" : "Checked"} {item.source.checkedAt}</span></span><ExternalLink className="mt-0.5 size-4 shrink-0 text-slate-400" /></span></RouteExternalLink> }

function SourceLine({ source, locale, linkType, guideId }: { source: RouteSource; locale: RouteLocale; linkType: RouteLinkType; guideId: string }) { return <RouteExternalLink href={source.url} linkType={linkType} guideId={guideId} locale={locale} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:underline">{source.operator} · {locale === "ko" ? "확인일" : "Checked"} {source.checkedAt}<ExternalLink className="size-3" /></RouteExternalLink> }

function goalLabel(goal: RouteGoal, locale: RouteLocale) { return goal === "work" ? (locale === "ko" ? "취업" : "Work") : goal === "study" ? (locale === "ko" ? "학업" : "Study") : (locale === "ko" ? "학업 후 취업" : "Study to work") }

function buildMapHrefForState(guide: RouteGuide, state?: AuStateCode) { return routeMapHref(guide, state) }
