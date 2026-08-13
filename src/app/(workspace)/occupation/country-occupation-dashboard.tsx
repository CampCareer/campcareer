"use client"

import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import type { CanonicalCareer } from "@/data/career-comparison-catalog"
import { AU_VOCATIONAL_PROGRAM_SHORTLIST } from "@/data/au-vocational-program-shortlist"
import { getLaunchCountry } from "@/data/launch-countries"
import { getOccupationEditorial } from "@/data/occupation-editorial"
import { AUSTRALIA_NURSING_PROGRAMS } from "@/data/programs/australia-nursing"
import { countryDisplayName, type Locale } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import {
  OPPORTUNITY_SCORE_MAXIMA,
  type CountryOccupationProfile,
  type OpportunityScoreBreakdown,
} from "@/lib/workspace/country-occupation-contract"

const SCORE_LABELS: Array<{ key: keyof OpportunityScoreBreakdown; en: string; ko: string }> = [
  { key: "shortage", en: "Official shortage", ko: "공식 인력 부족" },
  { key: "vacancyIntensity", en: "Vacancy intensity", ko: "채용 공고 강도" },
  { key: "employerDiversity", en: "Employer diversity", ko: "고용주 다양성" },
  { key: "vacancyTrend", en: "Vacancy trend", ko: "채용 추세" },
  { key: "entryLevel", en: "Entry-level access", ko: "초기 진입 가능성" },
  { key: "salary", en: "Relative salary", ko: "상대 연봉" },
  { key: "growth", en: "Employment growth", ko: "고용 성장" },
  { key: "visa", en: "Visa pathways", ko: "비자 경로" },
  { key: "entryBurden", en: "Entry burden", ko: "진입 부담" },
]

function compact(value: number | null, locale: Locale) {
  return value == null ? "—" : new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}
function number(value: number | null, locale: Locale) {
  return value == null ? "—" : new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", { maximumFractionDigits: 0 }).format(value)
}
function percent(value: number | null, locale: Locale) {
  return value == null ? "—" : `${new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", { maximumFractionDigits: 1 }).format(value)}%`
}
function money(currency: string, value: number | null, locale: Locale) {
  return value == null ? "—" : new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-AU", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)
}
function scoreTone(score: number, locale: Locale) {
  if (score >= 85) return locale === "ko" ? "매우 높음" : "Excellent"
  if (score >= 70) return locale === "ko" ? "높음" : "Strong"
  if (score >= 55) return locale === "ko" ? "보통" : "Moderate"
  return locale === "ko" ? "제한적" : "Limited"
}

function MetricCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return <article className="rounded-xl border border-[#e7e6e3] bg-white p-4"><div className="flex items-center gap-2 text-[#2563eb]">{icon}<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">{label}</p></div><p className="mt-3 text-[23px] font-semibold tracking-[-0.025em] text-[#1b1b1b]">{value}</p><p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{hint}</p></article>
}

type ProgramCard = { id: string; title: string; provider: string; url: string; meta: string; note?: string }

function getProgramCards(profile: CountryOccupationProfile, locale: Locale): ProgramCard[] {
  if (profile.countryCode !== "AU") return []
  const ko = locale === "ko"
  const programRefs = new Set(profile.programLinks.map((link) => link.programRef))
  const canonicalCards: ProgramCard[] = profile.programLinks.flatMap((link) => {
    const program = link.program
    if (!program?.url) return []
    const duration = program.durationYears == null ? (ko ? "기간 확인 필요" : "Duration —") : ko ? `${program.durationYears}년` : `${program.durationYears} ${program.durationYears === 1 ? "year" : "years"}`
    const relationNote = link.relationType === "graduate_entry" ? (ko ? "대졸자 진입 경로" : "Graduate-entry pathway") : link.relationType === "progression" ? (ko ? "상위 과정 진학 경로" : "Progression pathway") : link.relationType === "related" ? (ko ? "관련 학업 선택지" : "Related study option") : (ko ? "직업 진입 직접 연계 과정" : "Direct entry-to-practice pathway")
    return [{ id: link.programRef, title: program.title, provider: program.provider, url: program.url, meta: `${duration} · ${money("AUD", program.tuitionFeeAud, locale)}${ko ? " 연간 학비" : " annual tuition"}`, note: relationNote }]
  })
  const nursingCards: ProgramCard[] = AUSTRALIA_NURSING_PROGRAMS.filter((program) => programRefs.has(program.id)).map((program) => ({ id: program.id, title: program.programName, provider: program.institutionName, url: program.source.url, meta: `${program.durationLabel} · ${program.tuitionLabel}`, note: ko ? "등록 결과는 공식 과정 페이지에서 확인하세요." : program.registrationOutcome }))
  const vocationalCards: ProgramCard[] = AU_VOCATIONAL_PROGRAM_SHORTLIST.filter((program) => programRefs.has(program.id)).map((program) => {
    const fee = program.tuitionAmount && program.tuitionCurrency ? money(program.tuitionCurrency, program.tuitionAmount, locale) : program.internationalEligible ? (ko ? "현재 학비 확인" : "Check current fee") : (ko ? "도제·현지인 경로" : "Apprenticeship / domestic pathway")
    const duration = program.durationMonths ? (ko ? `${program.durationMonths}개월` : `${program.durationMonths} months`) : program.qualificationLevel
    return { id: program.id, title: program.title, provider: program.providerName, url: program.officialUrl, meta: `${duration} · ${fee}`, note: ko ? "지원 자격은 공식 과정 페이지에서 확인하세요." : program.eligibilityNote }
  })
  return [...canonicalCards, ...nursingCards, ...vocationalCards]
}

type ProfileLink = CountryOccupationProfile["links"][number]
function LinkList({ links, hoverClass = "hover:border-[#cfd8ed]" }: { links: ProfileLink[]; hoverClass?: string }) {
  return <div className="mt-4 space-y-2">{links.map((link) => <a key={`${link.linkType}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className={`flex items-center justify-between rounded-xl border border-[#f0efec] bg-[#fafaf8] px-3.5 py-2.5 text-[12px] font-medium text-[#1b1b1b] transition ${hoverClass}`}><span className="min-w-0 truncate">{link.label}</span><ArrowUpRight className="ml-3 size-3.5 shrink-0 text-[#9c9a94]" /></a>)}</div>
}

export function CountryOccupationDashboard({ career, profile }: { career: CanonicalCareer; profile: CountryOccupationProfile }) {
  const locale = useRouteLocale()
  const ko = locale === "ko"
  const editorial = getOccupationEditorial(career.id)
  const countryEditorial = editorial?.countries[profile.countryCode]
  const metric = profile.metric
  const launchCountry = getLaunchCountry(profile.countryCode)
  const countryName = countryDisplayName(locale, profile.countryCode, launchCountry?.name ?? profile.countryCode)
  const jobLinks = profile.links.filter((link) => link.linkType === "job_search")
  const employers = profile.links.filter((link) => link.linkType === "employer")
  const entryLinks = profile.links.filter((link) => link.linkType === "entry_program" || link.linkType === "graduate_program")
  const programs = getProgramCards(profile, locale)
  const rankedRegions = [...profile.regions].sort((first, second) => (second.vacancyCount ?? -1) - (first.vacancyCount ?? -1))
  const careerLabel = ko ? career.labelKo : profile.officialTitle
  const headline = ko ? `${career.labelKo}의 현지 수요·연봉·진입 조건을 공식 데이터로 비교합니다.` : countryEditorial?.headline ?? editorial?.overview
  const entryCopy = ko ? "이 직업에 필요한 학위·훈련·등록 요건을 공식 기관 기준으로 확인하세요." : countryEditorial?.entryPathway
  const registrationCopy = ko ? "면허·등록이 필요한 직업은 공식 등록기관의 최신 요건을 반드시 확인하세요." : countryEditorial?.registration
  const jobMarketCopy = ko ? "현지 채용 공고와 공식 진입 경로를 함께 확인해 실제 지원 조건을 비교하세요." : countryEditorial?.jobMarketNote

  return <div className="space-y-4">
    <section className="relative overflow-hidden rounded-2xl bg-[#2563eb] p-7 text-white"><span aria-hidden="true" className="absolute -right-12 -top-16 size-48 rounded-full bg-white/10" /><div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">{countryName} · {profile.officialCodeSystem} {profile.officialUnitGroupCode}</span><span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">{ko ? `공식 직업 ${profile.specialisations.length}개` : `${profile.specialisations.length} official occupations`}</span></div><h2 className="mt-4 text-[30px] font-semibold tracking-[-0.025em]">{careerLabel}</h2>{ko && profile.officialTitle !== career.labelKo ? <p className="mt-1 text-[11.5px] font-medium text-white/70">공식 직업명: {profile.officialTitle}</p> : null}<p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-white/85">{headline}</p></div><div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm"><p className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-white/70">{ko ? "커리어 기회 점수" : "Opportunity score"}</p><p className="mt-1 text-[42px] font-semibold leading-none">{metric.opportunityScore}</p><p className="mt-1.5 text-[11px] font-semibold">{scoreTone(metric.opportunityScore, locale)} · 100</p></div></div></section>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={<Banknote className="size-4" />} label={ko ? "중위 소득" : "Median earnings"} value={money(profile.currency, metric.annualisedMedianSalary, locale)} hint={ko ? `${money(profile.currency, metric.medianWeeklyEarnings, locale)} 주급 · 풀타임 비관리직 중위값` : `${money(profile.currency, metric.medianWeeklyEarnings, locale)} weekly · full-time non-managerial median`} />
      <MetricCard icon={<BriefcaseBusiness className="size-4" />} label={ko ? "온라인 채용 공고" : "Online vacancies"} value={number(metric.vacanciesThreeMonthAvg, locale)} hint={ko ? `3개월 평균 · ${metric.vacancyPeriod ?? "최근 기간"} · 전년 대비 ${percent(metric.vacancyYoyPct, locale)}` : `3-month average · ${metric.vacancyPeriod ?? "latest period"} · ${percent(metric.vacancyYoyPct, locale)} year on year`} />
      <MetricCard icon={<Users className="size-4" />} label={ko ? "고용 규모" : "Employment"} value={compact(metric.employmentTotal, locale)} hint={ko ? `파트타임 ${percent(metric.partTimeSharePct, locale)} · 중위 연령 ${metric.medianAge ?? "—"}` : `${percent(metric.partTimeSharePct, locale)} part-time · median age ${metric.medianAge ?? "—"}`} />
      <MetricCard icon={<TrendingUp className="size-4" />} label={ko ? "커리어 전망" : "Career outlook"} value={percent(metric.employmentGrowth10yPct, locale)} hint={ko ? `5년 예상 고용 성장 ${percent(metric.employmentGrowth5yPct, locale)}` : `${percent(metric.employmentGrowth5yPct, locale)} projected growth over five years`} />
    </div>

    <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-[15px] font-semibold text-[#1b1b1b]">{ko ? "커리어 기회 점수" : "Career Opportunity Score"}</h3><p className="mt-1 text-[11.5px] text-[#8f8c85]">{metric.scoreMethodologyVersion} · {metric.scoreStatus}</p></div><span className="rounded-full bg-[#edf5ea] px-3 py-1 text-[11px] font-bold text-[#3e7a2e]">{metric.opportunityScore}/100</span></div><div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">{SCORE_LABELS.map(({ key, en, ko: koLabel }) => { const value = metric.score[key]; const maximum = OPPORTUNITY_SCORE_MAXIMA[key]; const width = maximum ? Math.round((value / maximum) * 100) : 0; return <div key={key}><div className="flex items-center justify-between text-[11.5px]"><span className="font-medium text-[#4d4c48]">{ko ? koLabel : en}</span><span className="font-semibold text-[#2563eb]">{value}/{maximum}</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eef0f4]"><div className="h-full rounded-full bg-[#2563eb]" style={{ width: `${width}%` }} /></div></div> })}</div>{countryEditorial?.scoreCaveat ? <p className="mt-5 rounded-xl bg-[#fff8ee] px-4 py-3 text-[11.5px] leading-5 text-[#795b34]">{ko ? "이 점수는 공개 시장 지표를 종합한 참고 신호이며 개인의 취업·비자 결과를 보장하지 않습니다." : countryEditorial.scoreCaveat}</p> : null}</section>

    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6"><div className="flex items-center gap-2 text-[#6d4fc4]"><GraduationCap className="size-4" /><h3 className="text-[15px] font-semibold">{ko ? "진입 경로" : "Entry pathway"}</h3></div><p className="mt-3 text-[13px] leading-6 text-[#5f5d58]">{entryCopy}</p><div className="mt-4 flex items-start gap-3 rounded-xl border border-[#e7e0f3] bg-[#f8f6fc] p-4"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#6d4fc4]" /><p className="text-[12px] leading-5 text-[#5f5570]">{registrationCopy}</p></div>{programs.length > 0 && <div className="mt-4 space-y-2">{programs.map((program) => <a key={program.id} href={program.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-[#f0efec] bg-[#fafaf8] p-3.5 transition hover:border-[#cfcac2]"><div className="flex items-start justify-between gap-3"><div><p className="text-[12.5px] font-semibold text-[#1b1b1b]">{program.title}</p><p className="mt-0.5 text-[11px] text-[#77746e]">{program.provider}</p></div><ArrowUpRight className="size-3.5 shrink-0 text-[#9c9a94]" /></div><p className="mt-2 text-[10.5px] text-[#8f8c85]">{program.meta}</p>{program.note && <p className="mt-1.5 text-[10.5px] leading-4 text-[#77746e]">{program.note}</p>}</a>)}</div>}</section>

      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6"><div className="flex items-center gap-2 text-[#3e7a2e]"><BadgeCheck className="size-4" /><h3 className="text-[15px] font-semibold">{ko ? "포함된 공식 직업" : "Official occupations included"}</h3></div><div className="mt-4 space-y-2">{profile.specialisations.map((item) => <div key={item.officialCode} className="rounded-xl border border-[#edf0ea] bg-[#fafcf9] px-3.5 py-3"><div className="flex items-center justify-between gap-3"><p className="text-[12.5px] font-semibold text-[#2f4f29]">{item.officialTitle}</p><span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#3e7a2e]">{item.officialCode}</span></div><p className="mt-1 text-[10.5px] text-[#7d8b78]">{item.legacyCodeSystem && item.legacyCode ? `${ko ? "이전 코드" : "Legacy"} ${item.legacyCodeSystem} ${item.legacyCode} · ` : ""}{item.visaEligible ? (ko ? "비자 목록 대상" : "visa-list eligible") : (ko ? "비자 상태 확인 필요" : "verify visa status")}</p></div>)}</div></section>
    </div>

    <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6"><div className="flex items-center gap-2 text-[#c2691e]"><MapPinned className="size-4" /><h3 className="text-[15px] font-semibold">{ko ? "지역별 수요 순위" : "State demand ranking"}</h3></div><p className="mt-1.5 text-[10.5px] leading-4 text-[#8f8c85]">{ko ? "공개된 최근 3개월 채용 공고 기준 순위이며 개인의 취업 결과나 비자 순위가 아닙니다." : "Ranked by published 3-month vacancies — not a personal outcome or visa ranking."}</p><div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">{rankedRegions.map((region, index) => { const rank = index + 1; const rankTone = rank === 1 ? "border-[#ead29a] bg-[#fffaf0]" : rank === 2 ? "border-[#dce1e8] bg-[#f7f9fc]" : rank === 3 ? "border-[#d69a72] bg-[#fff4ed]" : "border-[#f0e5d9] bg-[#fffaf5]"; const rankLabelTone = rank === 1 ? "text-[#9c7a4f]" : rank === 2 ? "text-[#6d7787]" : rank === 3 ? "text-[#b86636]" : "text-[#9c7a4f]"; return <div key={region.regionCode} className={`relative rounded-xl border p-2.5 text-center sm:p-3 ${rankTone}`}><span className={`absolute left-2 top-1.5 text-[9px] font-bold sm:left-2.5 sm:top-2 ${rankLabelTone}`}>#{rank}</span><p className="text-[11px] font-bold text-[#c2691e]">{region.regionCode}</p><p className="mt-1 text-[16px] font-semibold text-[#1b1b1b] sm:text-[18px]">{number(region.vacancyCount, locale)}</p><p className="mt-0.5 text-[9px] leading-3 text-[#8f8c85] sm:text-[10px] sm:leading-normal">{ko ? `3개월 채용 공고 · 부족도 ${region.shortageRating ?? "—"}/3` : `3-mo vacancies · shortage ${region.shortageRating ?? "—"}/3`}</p></div> })}</div></section>

    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6"><div className="flex items-center gap-2 text-[#2563eb]"><BriefcaseBusiness className="size-4" /><h3 className="text-[15px] font-semibold">{ko ? "채용 및 진입 경로" : "Jobs and entry pathways"}</h3></div>{jobMarketCopy && <p className="mt-3 text-[12.5px] leading-5 text-[#6f6d68]">{jobMarketCopy}</p>}<LinkList links={[...jobLinks, ...entryLinks]} /></section>
      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6"><div className="flex items-center gap-2 text-[#3e7a2e]"><Building2 className="size-4" /><h3 className="text-[15px] font-semibold">{ko ? "주요 고용주" : "Major employers"}</h3></div><p className="mt-3 text-[11.5px] leading-5 text-[#77746e]">{ko ? "이 직업과 관련된 공식 채용 페이지를 제공하는 주요 기관과 고용주 네트워크입니다." : "Major organisations and employer networks with official career pages relevant to this occupation."}</p><LinkList links={employers} hoverClass="hover:border-[#cfe0ca]" /></section>
    </div>
  </div>
}
