"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { ArrowRight, BadgeCheck, Building2, CheckCircle2, CircleAlert, ExternalLink, GraduationCap, LoaderCircle, ShieldCheck, TrendingUp } from "lucide-react"
import { AUSTRALIA_NURSING_PROGRAMS } from "@/data/programs/australia-nursing"
import { CITIZENSHIP_OPTIONS } from "@/data/citizenship-countries"
import { createClient } from "@/lib/supabase-client"
import { localizePath } from "@/lib/i18n/config"
import type { CareerMarketInsight } from "@/lib/workspace/career-market-contract"
import { cn } from "@/lib/utils"
import type { OverviewSearchValues } from "./home-overview-config"

type Locale = "en" | "ko"

type Personalisation = {
  citizenship_country: string | null
  target_country: string | null
  target_occupation: string | null
  relevant_experience_years: number | null
  degree_level: string | null
  english_level: string | null
  study_path_available: boolean | null
}

const tr = (locale: Locale, ko: string, en: string) => locale === "ko" ? ko : en

const compactNumber = (value: number | null | undefined, locale: Locale) => {
  if (value == null) return tr(locale, "확인 중", "Checking")
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", { maximumFractionDigits: 0 }).format(value)
}

const percentage = (value: number | null | undefined, locale: Locale) => value == null ? tr(locale, "확인 중", "Checking") : `${value > 0 ? "+" : ""}${value.toFixed(1)}%`

const englishSafeText = (locale: Locale, value: string | null | undefined, fallback: string) => {
  if (!value) return fallback
  return locale === "en" && /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(value) ? fallback : value
}

function onboardingPath(query: OverviewSearchValues, locale: Locale) {
  const params = new URLSearchParams({ country: query.country, occupation: query.occupation })
  return `${localizePath("/onboarding", locale)}?${params.toString()}`
}

function personalisationHref(query: OverviewSearchValues, authenticated: boolean | null, locale: Locale) {
  const next = onboardingPath(query, locale)
  return authenticated ? next : `${localizePath("/login", locale)}?next=${encodeURIComponent(next)}`
}

export function CareerMarketResults({ query, locale, presentation = "inline" }: { query: OverviewSearchValues; locale: Locale; presentation?: "inline" | "page" }) {
  const searchParams = useSearchParams()
  const [insight, setInsight] = useState<CareerMarketInsight | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [personalisation, setPersonalisation] = useState<Personalisation | null>(null)
  const personalised = searchParams.get("personalised") === "1"
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const controller = new AbortController()
    setInsight(null)
    setLoadError(false)
    fetch(`/api/home/career-insight?country=${encodeURIComponent(query.country)}&career=${encodeURIComponent(query.occupation)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Career insight request failed")
        return response.json() as Promise<CareerMarketInsight>
      })
      .then(setInsight)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setLoadError(true)
      })
    return () => controller.abort()
  }, [query.country, query.occupation])

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return
      setAuthenticated(Boolean(user))
      if (!user || !personalised) return
      const { data } = await supabase
        .from("user_preferences")
        .select("citizenship_country,target_country,target_occupation,relevant_experience_years,degree_level,english_level,study_path_available")
        .eq("id", user.id)
        .maybeSingle()
      if (active && data) setPersonalisation(data as Personalisation)
    })
    return () => { active = false }
  }, [personalised, supabase])

  if (loadError) return <ResultUnavailable locale={locale} />
  if (!insight) return <ResultLoading locale={locale} />
  if (!insight.country) {
    return <CountryPriority insight={insight} query={query} locale={locale} authenticated={authenticated} presentation={presentation} />
  }

  return <CountryCareerInsight insight={insight} query={query} locale={locale} authenticated={authenticated} personalisation={personalisation} personalised={personalised} presentation={presentation} />
}

function ResultLoading({ locale }: { locale: Locale }) {
  return <section className="mx-auto mt-12 max-w-5xl" aria-live="polite"><div className="rounded-3xl border border-[#e2e5ec] bg-white p-8"><LoaderCircle className="size-5 animate-spin text-blue-700" /><p className="mt-4 text-sm text-slate-600">{locale === "ko" ? "현지 취업·비자·자격 데이터를 정리하고 있어요." : "Preparing local employment, visa and qualification signals."}</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((key) => <div key={key} className="h-28 animate-pulse rounded-2xl bg-[#f5f5f3]" />)}</div></div></section>
}

function ResultUnavailable({ locale }: { locale: Locale }) {
  return <section className="mx-auto mt-12 max-w-4xl rounded-3xl border border-[#e2e5ec] bg-white p-8"><CircleAlert className="size-6 text-amber-600" /><h2 className="mt-4 text-xl font-semibold text-slate-900">{locale === "ko" ? "지금은 결과를 불러오지 못했어요." : "We could not load the result right now."}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{locale === "ko" ? "잠시 후 다시 시도해 주세요. 선택한 직종은 그대로 유지됩니다." : "Please try again shortly. Your selected occupation is kept."}</p></section>
}

function CountryPriority({ insight, query, locale, authenticated, presentation }: { insight: CareerMarketInsight; query: OverviewSearchValues; locale: Locale; authenticated: boolean | null; presentation: "inline" | "page" }) {
  const t = (ko: string, en: string) => tr(locale, ko, en)
  return <section className={cn("mx-auto max-w-5xl", presentation === "page" ? "mt-5" : "mt-12")} aria-live="polite">
    <div className="rounded-3xl border border-[#e1e5ec] bg-white p-6 sm:p-8">
      <p className="text-xs font-bold tracking-[0.12em] text-blue-700">MARKET-FIRST COUNTRY SHORTLIST</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-3xl">{locale === "ko" ? `${insight.career.labelKo}로 가능성을 볼 나라부터 골라보세요.` : `Start with countries that show signals for ${insight.career.label}.`}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{locale === "ko" ? "아래 순서는 현재 직업 시장 데이터, 채용 신호, 진입 조건을 종합한 우선순위예요. 개인의 비자·경력·자격을 심사한 결과는 아니며, 선택 후 무료로 더 자세한 근거를 볼 수 있어요." : "This order combines available market, hiring and entry signals. It is not a personal visa or qualification assessment; choose a country to see the supporting evidence for free."}</p>
      <div className="mt-7 grid gap-3 md:grid-cols-2">
        {insight.recommendations.map((choice, index) => <Link key={choice.countryCode} href={`${localizePath("/career", locale)}?country=${choice.countryCode}&occupation=${query.occupation}&personalised=1`} className="group rounded-2xl border border-[#e2e5ec] bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_16px_30px_-24px_rgba(30,64,175,.35)]">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-slate-400">0{index + 1} · {englishSafeText(locale, choice.officialTitle, insight.career.label)}</p><h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">{choice.countryName}</h3></div>{choice.opportunityScore != null && <span className="rounded-full bg-[#f4f6fb] px-3 py-1.5 text-xs font-semibold text-[#334155]">{t("취업시장 점수", "Job market score")} {choice.opportunityScore}/100</span>}</div>
          <p className="mt-4 min-h-10 text-sm leading-5 text-slate-600">{locale === "ko" ? (choice.demand?.note ?? (choice.registrationRequired ? "자격 인정 또는 현지 등록 여부가 진입의 핵심 변수예요." : "직업별 수요·채용·비자 정보를 함께 확인해 보세요.")) : (choice.registrationRequired ? "Local registration or recognition is a key entry condition." : "Review role-specific demand, hiring and visa conditions.")}</p>
          <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{choice.registrationRequired ? t("자격·면허 확인 필요", "Registration or licence check") : t("진입 요건 확인", "Entry requirements")}</span><span className="inline-flex items-center gap-1 font-semibold text-blue-700">{t("무료 인사이트 보기", "View free insights")} <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></div>
        </Link>)}
      </div>
      {!insight.recommendations.length && <p className="mt-7 rounded-2xl bg-[#f7f7f5] p-5 text-sm leading-6 text-slate-600">{locale === "ko" ? "이 직종은 나라별 시장 순위를 만들 만큼의 직접 데이터가 아직 충분하지 않아요. 나라를 하나 고르면 현재 확인 가능한 고용·자격 경로부터 보여드릴게요." : "There is not enough directly comparable data yet to rank countries for this occupation. Pick a country to see the verified hiring and qualification route available now."}</p>}
      <PersonaliseCta query={query} authenticated={authenticated} locale={locale} className="mt-8" />
    </div>
  </section>
}

type CountryCareerInsightProps = {
  insight: CareerMarketInsight
  query: OverviewSearchValues
  locale: Locale
  authenticated: boolean | null
  personalisation: Personalisation | null
  personalised: boolean
  presentation: "inline" | "page"
}

function CountryCareerInsight(props: CountryCareerInsightProps) {
  if (props.insight.country?.code === "AU" && props.insight.career.id === "registered-nurse" && props.insight.profile) {
    return <AustraliaNursingStudyToWork {...props} />
  }

  return <GenericCountryCareerInsight {...props} />
}

function GenericCountryCareerInsight({ insight, query, locale, authenticated, personalisation, personalised, presentation }: CountryCareerInsightProps) {
  const profile = insight.profile
  const marketScore = profile?.metric.opportunityScore
  const workLinks = profile?.links.filter((link) => link.linkType === "job_search" || link.linkType === "employer") ?? []
  const learningLinks = profile?.links.filter((link) => link.linkType === "entry_program" || link.linkType === "graduate_program") ?? []
  const programLinks = profile?.programLinks.filter((link) => link.program) ?? []
  const t = (ko: string, en: string) => tr(locale, ko, en)
  const registrationAuthority = englishSafeText(locale, profile?.registrationAuthority, locale === "ko" ? "현지 등록 기관" : "the local regulator")

  return <section className={cn("mx-auto max-w-5xl", presentation === "page" ? "mt-5" : "mt-12")} aria-live="polite">
    <div className="rounded-3xl border border-[#dfe4ee] bg-white p-6 shadow-[0_20px_45px_-38px_rgba(15,23,42,.42)] sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[#eceee9] pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-bold tracking-[0.12em] text-blue-700">FREE CAREER MARKET BRIEF</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-3xl">{locale === "ko" ? `${insight.country?.name}에서 ${insight.career.labelKo}로 일하기` : `Working as ${insight.career.label} in ${insight.country?.name}`}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{locale === "ko" ? (insight.demand?.note ?? insight.career.overview?.ko ?? "현지 직업 시장과 실제 진입 조건을 함께 확인하세요.") : (insight.career.overview?.en ?? "Review the local job market and real entry conditions together.")}</p></div>
        {marketScore != null && <div className="w-fit rounded-2xl bg-[#f4f6fb] px-4 py-3 text-right"><p className="text-[11px] font-semibold tracking-[0.08em] text-slate-500">{t("취업시장 점수", "Job market score")}</p><p className="mt-1 text-2xl font-semibold tracking-[-0.06em] text-slate-950">{marketScore}<span className="text-sm text-slate-400">/100</span></p></div>}
      </div>

      <p className="mt-5 flex gap-2 rounded-xl bg-[#f8f8f6] px-4 py-3 text-xs leading-5 text-slate-600"><CircleAlert className="mt-0.5 size-4 shrink-0 text-slate-500" />{locale === "ko" ? "이 점수는 수요·채용·진입 조건의 시장 신호입니다. 개인의 취업 가능성을 확정하지 않으며, 아래에서 내 조건을 더해 정확히 좁힐 수 있어요." : "This is a market signal based on demand, hiring and entry conditions. It does not confirm personal eligibility; add your profile below to narrow it down."}</p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Metric label={t("최근 채용 수요", "Recent hiring demand")} value={profile?.metric.vacanciesThreeMonthAvg != null ? `${compactNumber(profile.metric.vacanciesThreeMonthAvg, locale)}${t("건", " roles")}` : insight.demand?.rating ?? t("확인 중", "Checking")} detail={profile?.metric.vacancyPeriod ? `${profile.metric.vacancyPeriod} ${t("기준", "snapshot")}` : insight.demand ? t("공식 수요 근거 연결", "Official demand evidence") : t("직업별 데이터 확인", "Role data check")} />
        <Metric label={t("연봉 데이터", "Salary data")} value={profile?.metric.annualisedMedianSalary != null ? `${profile.currency} ${compactNumber(profile.metric.annualisedMedianSalary, locale)}` : t("확인 중", "Checking")} detail={profile?.metric.annualisedMedianSalary != null ? t("연 환산 중위값", "Annualised median") : t("직종·지역에 따라 다름", "Varies by role and region")} />
        <Metric label={t("5년 고용 변화", "Five-year employment change")} value={percentage(profile?.metric.employmentGrowth5yPct, locale)} detail={profile?.metric.asOfDate ? `${profile.metric.asOfDate} ${t("스냅샷", "snapshot")}` : t("고용 성장 데이터 확인", "Employment growth data")} />
      </div>

      {personalised && personalisation && <PersonalisedSummary personalisation={personalisation} profile={profile} locale={locale} />}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <InsightCard icon={<ShieldCheck className="size-5" />} eyebrow="VISA · LICENCE · RECOGNITION" title={t("비자·면허·자격 인정의 막힘 요소", "Visa, licence and recognition blockers")}>
          <p>{profile?.registrationRequired ? locale === "ko" ? `${registrationAuthority}의 등록·면허 또는 자격 인정 여부가 핵심이에요.` : `Registration, licensing or recognition with ${registrationAuthority} is a key condition.` : locale === "ko" ? (insight.career.registration?.ko ?? "직무별 자격, 영어, 근무 권한을 채용 공고와 공식 기관에서 함께 확인해야 해요.") : (insight.career.registration?.en ?? "Check role-specific qualifications, English requirements and work rights with employers and official authorities.")}</p>
          {profile?.registrationUrl && <ExternalResource href={profile.registrationUrl} label={`${registrationAuthority} ${t("공식 요건", "official requirements")}`} />}
          <div className="mt-4 space-y-2">{insight.visas.slice(0, 3).map((visa) => <a key={visa.name} href={visa.sourceUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-[#e7e8e4] px-3 py-2.5 transition hover:border-blue-200 hover:bg-blue-50/40"><span className="text-xs font-semibold text-blue-700">{visa.kind}</span><p className="mt-0.5 text-sm font-semibold text-slate-800">{visa.name}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{visa.note}</p></a>)}</div>
        </InsightCard>
        <InsightCard icon={<TrendingUp className="size-5" />} eyebrow="REALISTIC ENTRY ROUTE" title={t("현실적인 진입 경로", "A realistic entry route")}>
          <ol className="space-y-3 text-sm leading-6 text-slate-600"><RouteStep number="1" text={t("현재 경력·학위·영어 수준을 현지 직무 기준에 맞춰 정리", "Map your experience, education and English level to local role requirements")} /><RouteStep number="2" text={profile?.registrationRequired ? t("자격 인정·현지 등록·보완 교육이 필요한지 공식 기관에서 확인", "Confirm recognition, local registration and any bridging study with the official authority") : t("라이브 채용 공고에서 요구 경력과 기술을 확인", "Check the experience and skills required in live job postings")} /><RouteStep number="3" text={t("지원 가능한 비자·고용주 조건을 확인한 뒤 구직 또는 교육 경로를 선택", "Check visa and employer conditions, then choose a job-search or study route")} /></ol>
          {profile?.regions.length ? <p className="mt-4 rounded-xl bg-[#f7f7f5] px-3 py-2 text-xs leading-5 text-slate-600">{t("지역 신호", "Regional signals")}: {profile.regions.slice(0, 3).map((region) => region.regionCode).join(" · ")}</p> : null}
        </InsightCard>
        <InsightCard icon={<GraduationCap className="size-5" />} eyebrow="EDUCATION · STUDY ROUTE" title={t("관련 교육·유학 경로", "Related education and study routes")}>
          {programLinks.length || learningLinks.length ? <div className="space-y-2">{programLinks.slice(0, 3).map((link) => <a key={link.programRef} href={link.program?.url ?? "#"} target={link.program?.url ? "_blank" : undefined} rel="noreferrer" className="block rounded-xl border border-[#e7e8e4] px-3 py-2.5 transition hover:border-blue-200"><p className="text-sm font-semibold text-slate-800">{englishSafeText(locale, link.program?.title, insight.career.label)}</p><p className="mt-1 text-xs text-slate-500">{englishSafeText(locale, link.program?.provider, locale === "ko" ? "교육기관" : "Education provider")}{link.program?.durationYears ? ` · ${link.program.durationYears} ${t("년", "years")}` : ""}</p></a>)}{learningLinks.slice(0, 3).map((link) => <ExternalResource key={link.url} href={link.url} label={englishSafeText(locale, link.label, locale === "ko" ? "공식 교육 자료" : "Official study resource")} />)}</div> : <p>{t("직접 연결된 교육 과정은 더 확인이 필요합니다. 개인 조건을 입력하면 학업 경로가 현실적인지까지 함께 판단할 수 있어요.", "More verification is needed for directly linked courses. Add your profile to assess whether a study route is realistic for you.")}</p>}
        </InsightCard>
        <InsightCard icon={<Building2 className="size-5" />} eyebrow="EMPLOYERS · LIVE ROLES" title={t("관련 직업·고용주 정보", "Related roles and employers")}>
          {profile?.specialisations.length ? <div className="flex flex-wrap gap-2">{profile.specialisations.slice(0, 6).map((item) => <span key={item.officialCode} className="rounded-full bg-[#f4f6fb] px-3 py-1.5 text-xs font-medium text-slate-700">{englishSafeText(locale, item.officialTitle, insight.career.label)}</span>)}</div> : <p>{t("현지 직무명과 고용주를 실제 공고에서 함께 확인하는 것이 좋아요.", "Check local job titles and employers directly in live postings.")}</p>}
          <div className="mt-4 space-y-2">{workLinks.slice(0, 4).map((link) => <ExternalResource key={link.url} href={link.url} label={englishSafeText(locale, link.label, locale === "ko" ? "공식 채용 자료" : "Official careers resource")} />)}</div>
        </InsightCard>
      </div>

      <PersonaliseCta query={query} authenticated={authenticated} locale={locale} className="mt-8" />

      <div className="mt-6 border-t border-[#eceee9] pt-5"><p className="text-xs leading-5 text-slate-500">{locale === "ko" ? "지원·비자 신청 전에는 반드시 각 공식 기관과 고용주의 최신 요건을 확인하세요." : "Verify the latest requirements with each official authority and employer before applying."}</p>{insight.demand?.sourceUrl && <ExternalResource href={insight.demand.sourceUrl} label={locale === "ko" ? (insight.demand.sourceLabel ?? "직업 수요 근거") : "Employment-demand source"} className="mt-3" />}</div>
    </div>
  </section>
}

const AU_REGION_LABELS: Record<string, { ko: string; en: string }> = {
  NSW: { ko: "뉴사우스웨일스", en: "New South Wales" },
  VIC: { ko: "빅토리아", en: "Victoria" },
  QLD: { ko: "퀸즐랜드", en: "Queensland" },
  SA: { ko: "사우스오스트레일리아", en: "South Australia" },
  WA: { ko: "웨스턴오스트레일리아", en: "Western Australia" },
  TAS: { ko: "태즈메이니아", en: "Tasmania" },
  NT: { ko: "노던테리토리", en: "Northern Territory" },
  ACT: { ko: "오스트레일리아 수도 특별구", en: "Australian Capital Territory" },
}

function AustraliaNursingStudyToWork({ insight, query, locale, authenticated, personalisation, personalised, presentation }: CountryCareerInsightProps) {
  const profile = insight.profile
  if (!profile) return null
  const t = (ko: string, en: string) => tr(locale, ko, en)

  const directProgramRefs = new Set(profile.programLinks.filter((link) => link.relationType === "direct").map((link) => link.programRef))
  const degreePrograms = AUSTRALIA_NURSING_PROGRAMS.filter((program) => directProgramRefs.has(program.id))
  const employers = profile.links.filter((link) => link.linkType === "employer")
  const graduatePrograms = profile.links.filter((link) => link.linkType === "graduate_program")
  const jobSearch = profile.links.find((link) => link.linkType === "job_search")
  const regionalSignals = [...profile.regions]
    .filter((region) => region.vacancyCount != null)
    .sort((left, right) => (right.vacancyCount ?? 0) - (left.vacancyCount ?? 0))
    .slice(0, 3)
  const largestRegionalSignal = Math.max(...regionalSignals.map((region) => region.vacancyCount ?? 0), 1)
  const marketScore = profile.metric.opportunityScore

  return <section className={cn("mx-auto max-w-5xl", presentation === "page" ? "mt-5" : "mt-12")} aria-live="polite">
    <div className="overflow-hidden rounded-3xl border border-[#dfe4ee] bg-white shadow-[0_20px_45px_-38px_rgba(15,23,42,.42)]">
      <header className="border-b border-[#e8ebe8] px-6 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] text-blue-700">AUSTRALIA · REGISTERED NURSE</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-4xl">{locale === "ko" ? "호주 간호사, 학업부터 첫 취업까지" : "Australian nursing: study to first role"}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{locale === "ko" ? "간호 자격이 아직 없다면, 승인 연결 과정을 선택해 현지 등록을 거친 뒤 첫 간호사 직장을 찾는 것이 기본 경로예요. 학업은 목적이 아니라 이 커리어에 진입하기 위한 관문으로 봅니다." : "If you do not yet hold a nursing qualification, the base route is an approved study pathway, local registration, then a first nursing role. Study is the entry gate, not the end goal."}</p>
          </div>
          {marketScore != null && <div className="w-fit rounded-2xl border border-[#dbe5fa] bg-[#f5f8ff] px-4 py-3 text-right"><p className="text-[11px] font-semibold tracking-[0.08em] text-slate-500">{t("취업시장 점수", "Job market score")}</p><p className="mt-1 text-2xl font-semibold tracking-[-0.06em] text-slate-950">{marketScore}<span className="text-sm text-slate-400">/100</span></p></div>}
        </div>
        <p className="mt-6 flex gap-2 rounded-xl border border-[#e7e9e5] bg-[#fafaf8] px-4 py-3 text-xs leading-5 text-slate-600"><CircleAlert className="mt-0.5 size-4 shrink-0 text-slate-500" />{t("이 수치는 현재 호주 간호 시장의 규모·채용·성장 신호입니다. 개인의 입학·등록·취업 가능성을 확정하지 않으며, 로그인 후 내 조건으로 좁힐 수 있어요.", "These figures reflect current Australian nursing market size, hiring and growth signals. They do not confirm personal study, registration or employment eligibility; sign in to narrow the path to your profile.")}</p>
      </header>

      <div className="space-y-10 px-6 py-7 sm:px-8 sm:py-9">
        <section aria-labelledby="nursing-market-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">CAREER MARKET</p><h3 id="nursing-market-heading" className="mt-2 text-xl font-semibold tracking-[-0.045em] text-slate-950">{t("먼저, 호주에서 간호사가 필요한 시장인지 보세요.", "First, see whether Australia needs nurses.")}</h3></div><p className="text-xs text-slate-500">{profile.metric.asOfDate} {t("데이터 스냅샷", "data snapshot")}</p></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <NursingMetric label={t("연봉 중위값", "Median salary")} value={profile.metric.annualisedMedianSalary != null ? `A$${compactNumber(profile.metric.annualisedMedianSalary, locale)}` : t("확인 중", "Checking")} detail={t("연 환산 · 호주달러", "Annualised · Australian dollars")} />
            <NursingMetric label={t("채용 신호", "Hiring signal")} value={profile.metric.vacanciesThreeMonthAvg != null ? compactNumber(profile.metric.vacanciesThreeMonthAvg, locale) : t("확인 중", "Checking")} detail={t("최근 3개월 평균", "Latest three-month average")} />
            <NursingMetric label={t("고용 규모", "Employment")} value={compactNumber(profile.metric.employmentTotal, locale)} detail={t("호주 내 간호사 고용", "Nursing employment in Australia")} />
            <NursingMetric label={t("5년 고용 변화", "Five-year employment change")} value={percentage(profile.metric.employmentGrowth5yPct, locale)} detail={t("중장기 고용 성장", "Medium-term employment growth")} />
          </div>
        </section>

        {personalised && personalisation && <AustraliaNursingPersonalisedPlan personalisation={personalisation} profile={profile} visas={insight.visas} locale={locale} />}

        <section aria-labelledby="nursing-route-heading">
          <div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">STUDY → REGISTRATION → WORK</p><h3 id="nursing-route-heading" className="mt-2 text-xl font-semibold tracking-[-0.045em] text-slate-950">{t("학업은 첫 간호사 직장으로 이어지는 세 단계 중 하나예요.", "Study is one of three stages that lead to a first nursing role.")}</h3></div>
          <ol className="mt-5 grid gap-3 md:grid-cols-3">
            <NursingRouteStep number="01" label={t("간호 학위", "Nursing degree")} title={t("간호학사 과정을 선택", "Choose a nursing bachelor’s degree")} detail={t("입학 전, 해당 과정이 현지 등록으로 연결되는지 확인합니다.", "Before enrolment, confirm that the course leads to local registration.")} />
            <NursingRouteStep number="02" label={t("공식 등록", "Official registration")} title={t("NMBA 일반 등록 준비", "Prepare for NMBA general registration")} detail={t("학위·임상 실습·영어 등 공식 기준을 갖춘 뒤 등록을 신청합니다.", "Apply once you meet the degree, clinical placement, English and other official requirements.")} />
            <NursingRouteStep number="03" label={t("첫 취업", "First role")} title={t("신규 간호사 채용에 지원", "Apply for graduate nursing roles")} detail={t("주별 graduate 프로그램과 병원 채용 공고에서 첫 근무지를 찾습니다.", "Look for your first workplace through state graduate programs and hospital job listings.")} />
          </ol>
          {profile.registrationUrl && <ExternalResource href={profile.registrationUrl} label={`${profile.registrationAuthority ?? "NMBA"} ${t("등록 기준 확인", "registration requirements")}`} className="mt-4" />}
        </section>

        {regionalSignals.length > 0 && <section aria-labelledby="nursing-region-heading" className="rounded-2xl border border-[#e4e7e4] bg-[#fbfbfa] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">WHERE THE SIGNALS ARE</p><h3 id="nursing-region-heading" className="mt-2 text-lg font-semibold tracking-[-0.035em] text-slate-950">{t("처음 일자리를 찾을 때 볼 지역 신호", "Regional signals for your first role")}</h3></div><p className="text-xs text-slate-500">{t("최근 3개월 평균 채용 신호", "Latest three-month average hiring signal")}</p></div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">{regionalSignals.map((region) => <div key={region.regionCode} className="rounded-xl border border-[#e5e8e5] bg-white p-4"><div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold text-slate-900">{AU_REGION_LABELS[region.regionCode]?.[locale] ?? region.regionCode}<span className="ml-1 text-xs font-medium text-slate-400">{region.regionCode}</span></p><p className="text-lg font-semibold tracking-[-0.04em] text-slate-950">{compactNumber(region.vacancyCount, locale)}</p></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf0ed]"><div className="h-full rounded-full bg-[#5d86cf]" style={{ width: `${Math.round(((region.vacancyCount ?? 0) / largestRegionalSignal) * 100)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{t("공개 채용 수요 지표", "Public hiring-demand indicator")}</p></div>)}</div>
          {regionalSignals[0]?.sourceUrl && <ExternalResource href={regionalSignals[0].sourceUrl} label={t("지역별 채용 수요 출처 보기", "View regional hiring-demand source")} className="mt-4" />}
        </section>}

        <section aria-labelledby="nursing-employers-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">WHO HIRES</p><h3 id="nursing-employers-heading" className="mt-2 text-xl font-semibold tracking-[-0.045em] text-slate-950">{t("졸업 후, 실제로 채용 페이지를 볼 고용주", "Employers to check after graduation")}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t("대형 공공 보건망과 민간 병원 그룹의 공식 채용 페이지예요. 직무명·지역·근무 형태를 직접 확인해 보세요.", "These are official hiring pages for large public health systems and private hospital groups. Check role title, location and work arrangement directly.")}</p></div>{jobSearch && <a href={jobSearch.url} target="_blank" rel="noreferrer" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#cfd8e9] bg-white px-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50">{t("현재 공고 보기", "View current roles")} <ExternalLink className="size-3.5" /></a>}</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{employers.slice(0, 4).map((employer) => <EmployerCard key={employer.url} employer={employer} locale={locale} />)}</div>
        </section>

        <section aria-labelledby="nursing-job-checks-heading">
          <div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">READING A JOB POSTING</p><h3 id="nursing-job-checks-heading" className="mt-2 text-xl font-semibold tracking-[-0.045em] text-slate-950">{t("채용 공고를 열면, 이 세 가지부터 확인하세요.", "When you open a job posting, start with these three checks.")}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{t("고용주와 직무마다 다르지만, 신규 간호사 지원 전에 가장 먼저 걸러야 할 조건입니다.", "They vary by employer and role, but these are the first conditions to check before applying as a new nurse.")}</p></div>
          <div className="mt-5 grid gap-3 md:grid-cols-3"><JobCheck title={t("등록 가능 시점", "Registration timing")} detail={t("NMBA 일반 등록이 필요한지, 입사 시점에 어떤 상태여야 하는지 확인합니다.", "Check whether NMBA general registration is required and what status you need at your start date.")} /><JobCheck title={t("근무 분야·지역", "Practice area and location")} detail={t("급성기·노인요양·정신건강 등 관심 분야와 주·도시를 함께 봅니다.", "Review your preferred area—acute care, aged care or mental health—along with the state and city.")} /><JobCheck title={t("근무 권한", "Work rights")} detail={t("비자 상태와 고용주의 지원 가능 여부는 개인 조건에 따라 달라집니다.", "Visa status and employer support depend on your individual circumstances.")} /></div>
        </section>

        <section aria-labelledby="nursing-study-heading" className="border-t border-[#e8ebe8] pt-9">
          <div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">THE STUDY GATE</p><h3 id="nursing-study-heading" className="mt-2 text-xl font-semibold tracking-[-0.045em] text-slate-950">{t("간호사가 되기 위한 대학 과정", "University courses that lead to nursing")}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("아래는 간호 자격이 없는 사람의 기본 진입 경로로 연결된 과정이에요. 과정 이름만으로 판단하지 말고, 입학 전 해당 과정의 등록 연결 여부를 공식 기관에서 다시 확인하세요.", "These courses are linked to a foundational entry route for people without a nursing qualification. Do not rely on a course title alone—confirm its registration outcome with the official authority before enrolling.")}</p></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">{degreePrograms.map((program) => <NursingDegreeCard key={program.id} program={program} locale={locale} />)}</div>
          {degreePrograms.length === 0 && <p className="mt-5 rounded-xl bg-[#f7f7f5] p-4 text-sm leading-6 text-slate-600">{t("현재 직접 연결된 과정 정보를 정리하고 있어요. 로그인 후 학력과 영어 수준을 입력하면 비교할 과정을 더 정확히 좁힐 수 있어요.", "We are still consolidating directly linked course information. Sign in and add your education and English level to narrow the courses you can compare.")}</p>}
        </section>

        {graduatePrograms.length > 0 && <section aria-labelledby="nursing-graduate-heading" className="rounded-2xl bg-[#f6f8fc] p-5 sm:p-6"><div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">FIRST-ROLE PROGRAMS</p><h3 id="nursing-graduate-heading" className="mt-2 text-lg font-semibold tracking-[-0.035em] text-slate-950">{t("등록 뒤, 첫 근무지로 연결되는 신규 간호사 프로그램", "Graduate programs that lead to a first workplace after registration")}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{t("대학 과정이 아니라 졸업·등록 이후에 보게 될 고용주 경로예요.", "These are employer pathways to consider after graduation and registration, not university courses.")}</p></div><div className="mt-4 grid gap-3 md:grid-cols-2">{graduatePrograms.slice(0, 2).map((program) => <a key={program.url} href={program.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-[#dbe2ef] bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_12px_25px_-22px_rgba(37,99,235,.55)]"><p className="text-xs font-semibold text-blue-700">GRADUATE PROGRAM</p><p className="mt-2 text-sm font-semibold text-slate-900">{program.label}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">{t("프로그램 보기", "View program")} <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></a>)}</div></section>}

        {personalised && personalisation ? <Link href={onboardingPath(query, locale)} className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#cfd8e9] bg-white px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50">{t("내 조건 다시 입력하기", "Update my details")} <ArrowRight className="size-4" /></Link> : <PersonaliseCta query={query} authenticated={authenticated} locale={locale} className="mt-2" />}

        <div className="border-t border-[#e8ebe8] pt-5"><p className="text-xs leading-5 text-slate-500">{t(`입학·등록·지원 전에는 대학, ${profile.registrationAuthority ?? "등록 기관"}, 고용주의 최신 조건을 각각 확인하세요.`, `Before you enrol, register or apply, verify the latest conditions with the university, ${profile.registrationAuthority ?? "local regulator"} and employer.`)}</p>{insight.demand?.sourceUrl && <ExternalResource href={insight.demand.sourceUrl} label={locale === "ko" ? (insight.demand.sourceLabel ?? "호주 간호 시장 데이터 출처") : "Australian nursing market data source"} className="mt-3" />}</div>
      </div>
    </div>
  </section>
}

const DEGREE_LABELS: Record<string, Record<Locale, string>> = {
  high_school: { ko: "고등학교 졸업", en: "High school" },
  associate: { ko: "전문학사", en: "Associate degree" },
  bachelor: { ko: "학사", en: "Bachelor’s degree" },
  master: { ko: "석사", en: "Master’s degree" },
  doctorate: { ko: "박사", en: "Doctorate" },
  other: { ko: "기타 학력", en: "Other education" },
}

const ENGLISH_LABELS: Record<string, Record<Locale, string>> = {
  basic: { ko: "기초", en: "Basic" },
  intermediate: { ko: "중급", en: "Intermediate" },
  working: { ko: "업무 가능", en: "Working proficiency" },
  fluent: { ko: "유창", en: "Fluent" },
}

function AustraliaNursingPersonalisedPlan({ personalisation, profile, visas, locale }: { personalisation: Personalisation; profile: NonNullable<CareerMarketInsight["profile"]>; visas: CareerMarketInsight["visas"]; locale: Locale }) {
  const t = (ko: string, en: string) => tr(locale, ko, en)
  const degree = personalisation.degree_level ?? "other"
  const english = personalisation.english_level ?? "basic"
  const hasGraduateEntrySignal = ["bachelor", "master", "doctorate"].includes(degree)
  const needsEnglishPreparation = ["basic", "intermediate"].includes(english)
  const studyRoute = personalisation.study_path_available === true ? "ready" : personalisation.study_path_available === false ? "blocked" : "review"
  const citizenship = locale === "ko"
    ? CITIZENSHIP_OPTIONS.find((option) => option.value === personalisation.citizenship_country)?.label ?? personalisation.citizenship_country ?? t("국적 미입력", "Nationality not provided")
    : personalisation.citizenship_country ?? t("국적 미입력", "Nationality not provided")
  const graduateEntry = AUSTRALIA_NURSING_PROGRAMS.find((program) => program.id === "unisc-graduate-entry-nursing-science")
  const studyVisa = visas.find((visa) => visa.kind === "Study")
  const postStudyVisa = visas.find((visa) => visa.kind === "Work")
  const experience = personalisation.relevant_experience_years ?? 0
  const nextAction = studyRoute === "blocked"
    ? { href: profile.registrationUrl, label: t("공식 등록 기준 보기", "View official registration requirements") }
    : hasGraduateEntrySignal && graduateEntry
      ? { href: graduateEntry.source.url, label: t("Graduate Entry 요건 보기", "View Graduate Entry requirements") }
      : { href: AUSTRALIA_NURSING_PROGRAMS[0].source.url, label: t("기본 과정 요건 보기", "View standard course requirements") }

  const routeTitle = studyRoute === "blocked"
    ? t("학업 경로가 현재 보류 상태예요", "Your study route is currently on hold")
    : hasGraduateEntrySignal
      ? t("기본 학사와 Graduate Entry를 함께 비교하세요", "Compare the standard bachelor’s degree with Graduate Entry")
      : t("간호학사 → NMBA 등록 경로가 기본이에요", "A nursing bachelor’s degree → NMBA registration is the standard route")
  const routeDetail = studyRoute === "blocked"
    ? t("간호 자격이 없는 상태에서는 학업을 건너뛴 RN 취업 경로를 약속할 수 없어요. 학업 가능 시점부터 다시 경로를 계산하는 것이 안전합니다.", "Without a nursing qualification, we cannot promise a route to RN employment that skips study. It is safer to reassess the route once study is possible.")
    : hasGraduateEntrySignal
      ? t("학사 이상이 있다면 일부 대학의 Graduate Entry를 검토할 수 있어요. 다만 이전 학위·선수과목 조건은 대학별로 확인해야 합니다.", "With a bachelor’s degree or above, you may be able to consider Graduate Entry at some universities. Verify prior-degree and prerequisite requirements with each university.")
      : t("현재 입력값에서는 등록으로 이어지는 간호학사 과정을 우선 검토하는 것이 가장 현실적입니다.", "With the details entered, a nursing bachelor’s degree that leads to registration is the most realistic route to review first.")
  const englishTitle = needsEnglishPreparation ? t("공식 영어 점수가 첫 관문이에요", "An official English score is your first gate") : t("공식 영어 점수 요건을 확인하세요", "Check the official English-score requirement")
  const englishDetail = needsEnglishPreparation
    ? t("선택한 대학 과정의 영어 기준을 먼저 맞추는 계획이 필요해요. 현재 수준은 입학 가능 여부를 확정하는 점수가 아닙니다.", "Plan to meet the English requirement for a chosen university course first. Your selected level is not a score that confirms admission eligibility.")
    : t("업무 영어가 가능하더라도 입학·등록용 공식 영어 점수는 별도로 확인해야 합니다.", "Even with working English, verify the official English-score requirements for admission and registration separately.")

  return <section aria-labelledby="personal-nursing-heading" className="rounded-3xl border border-[#cfdcf1] bg-[#f6f9ff] p-5 sm:p-7">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-blue-700"><CheckCircle2 className="size-5" /><p className="text-xs font-bold tracking-[0.1em]">MY NURSING PATH</p></div><h3 id="personal-nursing-heading" className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950">{t("내 조건에서 먼저 확인할 호주 간호 경로", "Australian nursing path to check first for my profile")}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("개인 심사나 합격 보장은 아니에요. 입력한 조건을 기준으로, 지금 가장 앞에 놓인 선택과 확인 순서를 정리했습니다.", "This is not an individual assessment or an admission guarantee. It organises the choices and checks that come first based on the details you entered.")}</p></div><span className="w-fit rounded-full border border-[#d6e2f6] bg-white px-3 py-1.5 text-xs font-semibold text-[#42689f]">{citizenship} · {DEGREE_LABELS[degree]?.[locale] ?? t("학력 미입력", "Education not provided")} · {t("영어", "English")} {ENGLISH_LABELS[english]?.[locale] ?? t("미입력", "not provided")}</span></div>

    <div className="mt-6 grid gap-3 lg:grid-cols-3"><PersonalPathCard label={t("현재 추천 경로", "Recommended route now")} title={routeTitle} detail={routeDetail} tone={studyRoute === "blocked" ? "amber" : "blue"} /><PersonalPathCard label={t("가장 먼저 볼 조건", "First condition to check")} title={englishTitle} detail={englishDetail} tone={needsEnglishPreparation ? "amber" : "blue"} /><PersonalPathCard label={t("관련 경력의 역할", "Role of related experience")} title={experience > 0 ? t(`${experience}년 경력은 지원 준비에 활용 가능`, `${experience} years can support your application preparation`) : t("경력보다 등록 경로가 먼저예요", "Registration route comes before experience")} detail={experience > 0 ? t("관련 경험은 지원서와 첫 고용주 탐색에 도움이 될 수 있지만, 간호 학위와 NMBA 등록을 대체하지는 않습니다.", "Related experience can support applications and finding a first employer, but does not replace a nursing degree or NMBA registration.") : t("간호 자격이 없는 시작 단계에서는 경력 유무보다 등록으로 이어지는 과정 선택이 우선입니다.", "At the starting point without a nursing qualification, choosing a course that leads to registration matters before prior experience.")} tone="neutral" /></div>

    <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-2xl border border-[#dbe4f1] bg-white p-5"><p className="text-xs font-bold tracking-[0.09em] text-blue-700">YOUR COURSE COMPARISON</p><h4 className="mt-2 text-lg font-semibold tracking-[-0.035em] text-slate-950">{t("내 학력 기준으로 비교할 과정", "Courses to compare for my education")}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{hasGraduateEntrySignal ? t("기본 학사와, 자격이 맞을 때만 가능한 Graduate Entry를 비교합니다.", "Compare the standard bachelor’s degree with Graduate Entry, where you meet the conditions.") : t("간호 자격이 없는 시작점에서는 등록으로 이어지는 기본 학사 과정을 비교합니다.", "At the starting point without a nursing qualification, compare standard bachelor’s degrees that lead to registration.")}</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><CourseComparisonCard program={AUSTRALIA_NURSING_PROGRAMS[0]} label={t("기본 경로", "Standard route")} locale={locale} />{hasGraduateEntrySignal && graduateEntry ? <CourseComparisonCard program={graduateEntry} label={t("조건부 단축 경로", "Conditional shorter route")} locale={locale} /> : <CourseComparisonCard program={AUSTRALIA_NURSING_PROGRAMS[1]} label={t("기본 경로 비교", "Standard-route comparison")} locale={locale} />}</div><p className="mt-4 text-xs leading-5 text-slate-500">{t("Graduate Entry는 학사 보유만으로 자동 적용되지 않으며, 대학별 선수과목·학력 기준을 공식 페이지에서 확인해야 합니다.", "Graduate Entry is not automatically available with a bachelor’s degree; confirm each university’s prerequisites and education requirements on its official page.")}</p></div>
      <div className="rounded-2xl border border-[#dbe4f1] bg-white p-5"><p className="text-xs font-bold tracking-[0.09em] text-blue-700">VISA ORDER</p><h4 className="mt-2 text-lg font-semibold tracking-[-0.035em] text-slate-950">{t("내 경로에서 확인할 비자 순서", "Visa sequence to check for my route")}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{t(`${citizenship} 국적만으로 비자 승인 가능 여부가 결정되지는 않아요. 아래는 학업부터 시작하는 기본 순서입니다.`, "Nationality alone does not determine visa approval. This is the standard sequence when starting with study.")}</p><div className="mt-4 space-y-3">{studyVisa && <VisaStep number="1" title={studyVisa.name} detail={t("등록된 교육기관의 풀타임 과정 확인 뒤, 학업 단계에서 검토합니다.", "After confirming a full-time course at a registered institution, review this at the study stage.")} href={studyVisa.sourceUrl} />}{postStudyVisa && <VisaStep number="2" title={postStudyVisa.name} detail={t("호주에서 적격 학업을 마친 뒤의 근무 권한 조건을 확인합니다.", "Check work-rights conditions after completing eligible Australian study.")} href={postStudyVisa.sourceUrl} />}{profile.registrationUrl && <VisaStep number="3" title={t("NMBA 일반 등록", "NMBA general registration")} detail={t("비자와 별개로, 간호사로 일하려면 공식 등록 기준을 확인해야 합니다.", "Separate from visa status, verify official registration requirements to work as a nurse.")} href={profile.registrationUrl} />}</div></div>
    </div>

    <div className="mt-6 rounded-2xl border border-[#dbe4f1] bg-white px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-5"><div><p className="text-sm font-semibold text-slate-900">{t("다음 행동은 하나만 잡으세요.", "Choose one next step.")}</p><p className="mt-1 text-sm leading-6 text-slate-600">{studyRoute === "blocked" ? t("학업 가능 시점과 예산을 먼저 정한 뒤, 그때 과정·비자 순서를 다시 확인하세요.", "Set a realistic study timeframe and budget first, then revisit the course and visa order.") : needsEnglishPreparation ? t("우선 관심 대학 한 곳의 공식 영어 기준을 열어 보고, 목표 점수를 정하세요.", "Open one university’s official English requirement first and set a target score.") : hasGraduateEntrySignal ? t("Graduate Entry의 이전 학위·선수과목 기준을 먼저 확인해 기본 학사와 기간을 비교하세요.", "Check Graduate Entry prior-degree and prerequisite requirements first, then compare its duration with the standard bachelor’s degree.") : t("관심 대학 한 곳의 입학·영어 기준을 먼저 확인한 뒤, 학업 계획을 구체화하세요.", "Check the admission and English requirements for one university first, then make your study plan specific.")}</p></div>{nextAction.href && <a href={nextAction.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900 sm:mt-0">{nextAction.label} <ExternalLink className="size-3.5" /></a>}</div>
  </section>
}

function PersonalPathCard({ label, title, detail, tone }: { label: string; title: string; detail: string; tone: "blue" | "amber" | "neutral" }) {
  const colors = tone === "amber" ? "border-amber-200 bg-amber-50/70" : tone === "blue" ? "border-blue-100 bg-white" : "border-[#e2e7e2] bg-white"
  return <article className={cn("rounded-2xl border p-4", colors)}><p className="text-xs font-semibold tracking-[0.06em] text-slate-500">{label}</p><h4 className="mt-2 text-base font-semibold tracking-[-0.03em] text-slate-950">{title}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p></article>
}

function CourseComparisonCard({ program, label, locale }: { program: (typeof AUSTRALIA_NURSING_PROGRAMS)[number]; label: string; locale: Locale }) {
  return <a href={program.source.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-[#e0e6ee] p-4 transition hover:border-blue-300 hover:bg-blue-50/30"><p className="text-[11px] font-bold tracking-[0.08em] text-blue-700">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{program.institutionName}</p><p className="mt-1 text-xs leading-5 text-slate-600">{program.programName}</p><div className="mt-3 space-y-1 text-xs text-slate-500"><p>{program.durationLabel} · {program.tuitionLabel}</p><p>{program.entryRequirement}</p></div><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">{tr(locale, "공식 요건 확인", "View official requirements")} <ArrowRight className="size-3 transition group-hover:translate-x-0.5" /></span></a>
}

function VisaStep({ number, title, detail, href }: { number: string; title: string; detail: string; href: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="group flex gap-3 rounded-xl border border-[#e0e6ee] p-3 transition hover:border-blue-300 hover:bg-blue-50/30"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#eef3ff] text-xs font-bold text-blue-700">{number}</span><span><span className="block text-sm font-semibold text-slate-900">{title} <ExternalLink className="ml-1 inline size-3 text-slate-400 transition group-hover:text-blue-700" /></span><span className="mt-1 block text-xs leading-5 text-slate-600">{detail}</span></span></a>
}

function NursingMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-[#e3e7e4] bg-white p-4"><p className="text-xs font-semibold tracking-[0.05em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold tracking-[-0.055em] text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
}

function NursingRouteStep({ number, label, title, detail }: { number: string; label: string; title: string; detail: string }) {
  return <li className="relative overflow-hidden rounded-2xl border border-[#e1e6e1] bg-white p-5"><span className="text-xs font-bold tracking-[0.1em] text-blue-700">{number} · {label}</span><h4 className="mt-3 text-base font-semibold tracking-[-0.03em] text-slate-950">{title}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p></li>
}

function EmployerCard({ employer, locale }: { employer: NonNullable<CareerMarketInsight["profile"]>["links"][number]; locale: Locale }) {
  const name = employer.label.split(" — ")[0] ?? employer.label
  const type = employer.providerType === "public_health_system" ? tr(locale, "주정부 공공 보건망", "State public health system") : employer.providerType === "private_hospital_group" ? tr(locale, "민간 병원 그룹", "Private hospital group") : employer.providerType === "hospital_and_aged_care" ? tr(locale, "병원 · 노인요양 고용주", "Hospital and aged-care employer") : tr(locale, "공식 채용 페이지", "Official careers page")
  return <a href={employer.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-[#e1e6e4] bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_16px_30px_-24px_rgba(37,99,235,.45)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.06em] text-blue-700">{type}</p><h4 className="mt-2 text-base font-semibold tracking-[-0.03em] text-slate-950">{name}</h4></div><Building2 className="size-5 shrink-0 text-slate-400 transition group-hover:text-blue-600" /></div><p className="mt-3 text-sm leading-6 text-slate-600">{tr(locale, "지역, 간호 분야, 신규 간호사 모집 여부를 공식 공고에서 확인하세요.", "Check location, nursing specialty and graduate-nurse hiring on the official listing.")}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">{tr(locale, "채용 페이지 열기", "Open careers page")} <ExternalLink className="size-3" /></span></a>
}

function JobCheck({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-2xl border border-[#e3e7e4] p-4"><span className="grid size-6 place-items-center rounded-full bg-[#eef3ff] text-xs font-bold text-blue-700">✓</span><h4 className="mt-3 text-sm font-semibold text-slate-950">{title}</h4><p className="mt-1.5 text-sm leading-6 text-slate-600">{detail}</p></div>
}

function NursingDegreeCard({ program, locale }: { program: (typeof AUSTRALIA_NURSING_PROGRAMS)[number]; locale: Locale }) {
  return <a href={program.source.url} target="_blank" rel="noreferrer" className="group block rounded-2xl border border-[#dfe5e1] bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_16px_30px_-24px_rgba(37,99,235,.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.06em] text-blue-700">{program.programType}</p><h4 className="mt-2 text-lg font-semibold tracking-[-0.035em] text-slate-950">{program.institutionName}</h4><p className="mt-1 text-sm font-medium text-slate-700">{program.programName}</p></div>{program.comparisonNote && <span className="rounded-full bg-[#f1f5ff] px-2.5 py-1 text-[11px] font-semibold text-[#3d67a8]">{program.comparisonNote}</span>}</div><dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-[#eef0ec] py-4 text-sm"><div><dt className="text-xs text-slate-500">{tr(locale, "기간", "Duration")}</dt><dd className="mt-1 font-semibold text-slate-900">{program.durationLabel}</dd></div><div><dt className="text-xs text-slate-500">{tr(locale, "연간 학비", "Annual tuition")}</dt><dd className="mt-1 font-semibold text-slate-900">{program.tuitionLabel}</dd></div><div className="col-span-2"><dt className="text-xs text-slate-500">{tr(locale, "영어 기준", "English requirement")}</dt><dd className="mt-1 leading-5 text-slate-700">{program.entryRequirement}</dd></div><div className="col-span-2"><dt className="text-xs text-slate-500">{tr(locale, "캠퍼스", "Campus")}</dt><dd className="mt-1 leading-5 text-slate-700">{program.location}</dd></div></dl><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">{tr(locale, "과정 정보 보기", "View course details")} <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></a>
}

function PersonalisedSummary({ personalisation, profile, locale }: { personalisation: Personalisation; profile: CareerMarketInsight["profile"]; locale: Locale }) {
  const t = (ko: string, en: string) => tr(locale, ko, en)
  const degree = DEGREE_LABELS[personalisation.degree_level ?? ""]?.[locale] ?? t("학위 미입력", "Education not provided")
  const english = ENGLISH_LABELS[personalisation.english_level ?? ""]?.[locale] ?? t("영어 미입력", "English level not provided")
  const citizenship = personalisation.citizenship_country ? t(`국적 ${personalisation.citizenship_country}`, `Nationality ${personalisation.citizenship_country}`) : t("국적 미입력", "Nationality not provided")
  return <div className="mt-7 rounded-2xl border border-blue-100 bg-[#f7f9ff] p-5"><div className="flex items-start gap-3"><BadgeCheck className="mt-0.5 size-5 text-blue-700" /><div><p className="font-semibold text-slate-900">{t("내 조건으로 좁힌 체크포인트", "Checkpoints narrowed for my profile")}</p><p className="mt-1 text-sm leading-6 text-slate-600">{t("시장 정보에 입력한 조건을 더했어요. 취업 가능성을 확정하는 심사는 아니며, 무엇을 먼저 확인할지 정리합니다.", "We added your details to market information. This is not an assessment that confirms employability; it prioritises what to check first.")}</p></div></div><div className="mt-4 flex flex-wrap gap-2">{[citizenship, t(`${personalisation.relevant_experience_years ?? 0}년 관련 경력`, `${personalisation.relevant_experience_years ?? 0} years of related experience`), degree, english, personalisation.study_path_available ? t("학업 경로 가능", "Study route available") : t("학업 경로 미확정", "Study route undecided")].map((item) => <span key={item} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700">{item}</span>)}</div><ul className="mt-4 space-y-1.5 text-sm leading-6 text-slate-600"><li>• {profile?.registrationRequired ? t("현지 등록·자격 인정 요건부터 확인하세요.", "Check local registration and qualification-recognition requirements first.") : t("현지 공고의 경력·기술 요구와 내 이력을 먼저 비교하세요.", "Compare your experience and skills with local job-listing requirements first.")}</li><li>• {personalisation.study_path_available ? t("교육 경로와 직접 취업 경로를 함께 비교해 볼 수 있어요.", "You can compare study and direct-employment routes together.") : t("학업 경로가 어려우면 직접 취업·자격 인정 가능성을 우선 확인하세요.", "If study is difficult, prioritise the feasibility of direct employment and qualification recognition.")}</li></ul></div>
}

function PersonaliseCta({ query, authenticated, locale, className }: { query: OverviewSearchValues; authenticated: boolean | null; locale: Locale; className?: string }) {
  return <div className={cn("rounded-2xl border border-[#dbe4f4] bg-[#f5f8fe] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6", className)}><div><p className="text-base font-semibold text-slate-950">{tr(locale, "로그인하면, 내 조건에 맞는 경로로 더 좁힐 수 있어요.", "Sign in to narrow this down to a route that fits your profile.")}</p><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{tr(locale, "국적, 영어, 학위와 학업 가능 여부를 더해 비자·등록의 막힘 요소를 먼저 보고, 과정과 첫 취업 경로도 비교할 수 있어요.", "Add your nationality, English level, education and study availability to see visa and registration blockers first, then compare courses and routes to a first role.")}</p></div><Link href={personalisationHref(query, authenticated, locale)} className="mt-4 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2865c7] px-4 text-sm font-semibold text-white transition hover:bg-[#1f55aa] sm:mt-0">{tr(locale, "내 조건으로 정확히 보기", "See my exact path")} <ArrowRight className="size-4" /></Link></div>
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-[#e5e7e3] p-4"><p className="text-xs font-semibold tracking-[0.06em] text-slate-500">{label}</p><p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
}

function InsightCard({ icon, eyebrow, title, children }: { icon: ReactNode; eyebrow: string; title: string; children: ReactNode }) {
  return <article className="rounded-2xl border border-[#e3e6ea] p-5"><div className="flex items-center gap-2 text-blue-700">{icon}<p className="text-[11px] font-bold tracking-[0.09em]">{eyebrow}</p></div><h3 className="mt-3 text-lg font-semibold tracking-[-0.035em] text-slate-950">{title}</h3><div className="mt-3 text-sm leading-6 text-slate-600">{children}</div></article>
}

function RouteStep({ number, text }: { number: string; text: string }) {
  return <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{number}</span><span>{text}</span></li>
}

function ExternalResource({ href, label, className }: { href: string; label: string; className?: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 transition hover:text-blue-900", className)}>{label} <ExternalLink className="size-3" /></a>
}
