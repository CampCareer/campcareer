"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { ArrowRight, CheckCircle2, CircleAlert, Compass, ExternalLink, Map, Route, ShieldCheck } from "lucide-react"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { OCCUPATION_DETAILS, type OccupationDetail } from "@/lib/workspace/occupation-detail"
import { cn } from "@/lib/utils"
import { HomeSearchForm } from "./home-search-form"
import {
  getOverviewSearchQuery,
  readOverviewSearchValues,
  toOverviewSearchQuery,
  type OverviewSearchValues,
} from "./home-overview-config"

type Locale = "en" | "ko"

const statusForRating = (rating: string | undefined, locale: Locale) => {
  if (rating === "Shortage" || rating === "Strong" || rating === "HighDemand") {
    return { label: locale === "ko" ? "추천" : "Recommended", note: locale === "ko" ? "현재 수요 신호가 확인됐어요." : "A current demand signal is available.", tone: "good" as const }
  }
  if (rating) {
    return { label: locale === "ko" ? "조건부 가능" : "Conditionally possible", note: locale === "ko" ? "지역과 자격 조건을 함께 확인해야 해요." : "Check regional and qualification conditions together.", tone: "caution" as const }
  }
  return { label: locale === "ko" ? "검토 필요" : "Needs review", note: locale === "ko" ? "직접 연결된 수요 근거를 더 확인해야 해요." : "More directly matched demand evidence is needed.", tone: "neutral" as const }
}

function occupationDetail(id: string) {
  return OCCUPATION_DETAILS.find((detail) => detail.id === id)
}

function occupationLabel(id: string, locale: Locale) {
  const career = CANONICAL_CAREER_BY_ID.get(id)
  if (!career) return locale === "ko" ? "선택한 직업" : "Selected occupation"
  return locale === "ko" ? career.labelKo : career.label
}

function countryLabel(code: string) {
  return LAUNCH_COUNTRIES.find((country) => country.code === code)?.name ?? code
}

function occupationHref(country: string, occupation: string) {
  return `/occupation?country=${encodeURIComponent(country)}&occupation=${encodeURIComponent(occupation)}`
}

export function HomeHub() {
  const router = useRouter()
  const locale = useRouteLocale()
  const searchParams = useSearchParams()
  const [values, setValues] = useState<OverviewSearchValues>(() => readOverviewSearchValues(searchParams))
  const result = getOverviewSearchQuery(searchParams)

  useEffect(() => setValues(readOverviewSearchValues(searchParams)), [searchParams])

  const submit = (nextValues: OverviewSearchValues) => {
    router.push(`/?${toOverviewSearchQuery(nextValues).toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#fbfbfa] text-[#171717]">
      <section className="mx-auto w-full max-w-5xl px-5 pb-12 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.12em] text-blue-700">CampCareer</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[#18181b] sm:text-5xl">
            {locale === "ko" ? <>내 해외 커리어의<br />현실적인 경로를 찾으세요.</> : <>Find a realistic path<br />to your international career.</>}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#5f5f62]">
            {locale === "ko" ? "복잡한 정보 대신, 원하는 나라와 직업이 지금 나에게 현실적인지부터 알려드려요." : "Start with one answer: whether the country and career you want are realistic for you."}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#e4e4e1] bg-white p-4 shadow-[0_20px_70px_-45px_rgba(24,24,27,0.35)] sm:p-6">
          <p className="mb-5 text-lg font-semibold tracking-[-0.025em] text-[#27272a]">
            {locale === "ko" ? "어디에서 어떤 일을 하고 싶나요?" : "Where and what kind of work do you want to do?"}
          </p>
          <HomeSearchForm values={values} locale={locale} onValuesChange={setValues} onSubmit={submit} />
        </div>

        {!result && <ExploreLink locale={locale} className="mt-6" />}
        {result && <CareerAnswer query={result} locale={locale} />}
      </section>
    </div>
  )
}

function CareerAnswer({ query, locale }: { query: OverviewSearchValues; locale: Locale }) {
  if (query.country === "not-sure" && query.occupation === "not-sure") return <OpenExploration locale={locale} />
  if (query.country === "not-sure") return <CountryRecommendations occupation={query.occupation} locale={locale} />
  if (query.occupation === "not-sure") return <OccupationRecommendations country={query.country} locale={locale} />
  return <SpecificCareerAnswer country={query.country} occupation={query.occupation} locale={locale} />
}

function SpecificCareerAnswer({ country, occupation, locale }: { country: string; occupation: string; locale: Locale }) {
  const detail = occupationDetail(occupation)
  const demand = detail?.demand.find((item) => item.countryCode === country)
  const status = statusForRating(demand?.rating, locale)
  const countryName = countryLabel(country)
  const occupationName = occupationLabel(occupation, locale)
  const route = routeFor(country, occupation, detail, locale)

  return (
    <section className="mx-auto mt-12 max-w-4xl" aria-live="polite">
      <div className="rounded-3xl border border-[#e1e7f5] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-[#ececea] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#5b64b6]">{locale === "ko" ? "해외 커리어 가능성" : "International career fit"}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#18181b] sm:text-3xl">
              {locale === "ko" ? `${countryName}에서 ${occupationName}로 일하기` : `Working as a ${occupationName} in ${countryName}`}
            </h2>
          </div>
          <div className={cn("inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold", status.tone === "good" ? "bg-emerald-50 text-emerald-800" : status.tone === "caution" ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-700")}>
            {status.tone === "good" ? <CheckCircle2 className="size-4" /> : <CircleAlert className="size-4" />}
            {status.label}
          </div>
        </div>

        <p className="mt-5 text-[15px] leading-6 text-[#5b5b60]">{demand?.note ?? status.note}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <AnswerBlock icon={<ShieldCheck className="size-5" />} eyebrow={locale === "ko" ? "당신에게 필요한 것" : "What you need"} title={locale === "ko" ? "핵심 조건" : "Key conditions"}>
            {requirementsFor(detail, locale).map((item) => <li key={item}>{item}</li>)}
          </AnswerBlock>
          <AnswerBlock icon={<Route className="size-5" />} eyebrow={locale === "ko" ? "가장 현실적인 경로" : "Most realistic route"} title={locale === "ko" ? "한 단계씩 확인하세요" : "Check it step by step"}>
            {route.map((item) => <li key={item}>{item}</li>)}
          </AnswerBlock>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#ececea] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#77777b]">
            {locale === "ko" ? "판정은 현재 확인된 수요 신호를 바탕으로 하며, 비자·면허·채용 요건은 지원 전 공식 기관에서 다시 확인해야 해요." : "This fit is based on the demand signals currently available. Verify visa, licensing and hiring requirements with official bodies before you apply."}
          </p>
          <Link href={occupationHref(country, occupation)} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] px-4 text-sm font-semibold text-white transition hover:bg-[#1e40af]">
            {locale === "ko" ? "내 경로 자세히 보기" : "See my full path"} <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      {demand && <a href={demand.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280] hover:text-blue-700">{locale === "ko" ? "근거" : "Source"}: {demand.sourceLabel} <ExternalLink className="size-3" /></a>}
      <ExploreLink locale={locale} className="mt-8" />
    </section>
  )
}

function AnswerBlock({ icon, eyebrow, title, children }: { icon: ReactNode; eyebrow: string; title: string; children: ReactNode }) {
  return <div className="rounded-2xl bg-[#f7f8fb] p-5"><div className="flex items-center gap-2 text-blue-700">{icon}<p className="text-xs font-semibold tracking-[0.08em]">{eyebrow}</p></div><h3 className="mt-3 font-semibold text-[#27272a]">{title}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-[#5a5a5e] [&>li]:flex [&>li]:gap-2 [&>li]:before:mt-2 [&>li]:before:size-1.5 [&>li]:before:shrink-0 [&>li]:before:rounded-full [&>li]:before:bg-[#5b64b6]">{children}</ul></div>
}

function requirementsFor(detail: OccupationDetail | undefined, locale: Locale) {
  if (locale === "en") return [
    detail?.registration ? "Whether your existing qualifications and experience can be recognised" : "A résumé and portfolio that demonstrate your skills and experience",
    "The English and work-right conditions required by the role and employer",
    detail?.registration ? "Local registration, licensing or bridging-study requirements" : "The technical and experience requirements in live local job listings",
  ]
  return [
    detail?.registration ? "기존 자격과 경력의 인정 가능 여부" : "경력·기술을 보여줄 수 있는 이력과 포트폴리오",
    "직무와 고용주가 요구하는 영어·근무 권한 조건",
    detail?.registration ? "현지 등록·면허 또는 보완 교육 요건" : "현지 채용 공고의 구체적인 기술·경력 요건",
  ]
}

function routeFor(country: string, occupation: string, detail: OccupationDetail | undefined, locale: Locale) {
  if (country === "AU" && occupation === "electrician") return locale === "ko"
    ? ["현재 경력·자격 정리", "기술 인정 또는 TAFE 교육 경로 확인", "주별 전기 면허와 현지 채용 조건 확인"]
    : ["Document your current experience and qualifications", "Check skills recognition or a TAFE training route", "Confirm state electrical licensing and local hiring conditions"]
  return locale === "ko"
    ? ["현재 경력과 자격 정리", detail?.registration ? "자격 인정·현지 등록 가능성 확인" : "현지 직무 기준과 경력의 연결 확인", "필요한 교육·면허를 보완한 뒤 현지 채용 조건 확인"]
    : ["Document your current experience and qualifications", detail?.registration ? "Check qualification recognition and local registration" : "Match your experience to local role requirements", "Fill any training or licensing gaps, then confirm live hiring conditions"]
}

function CountryRecommendations({ occupation, locale }: { occupation: string; locale: Locale }) {
  const detail = occupationDetail(occupation)
  const choices = detail?.demand ?? []
  const occupationName = occupationLabel(occupation, locale)

  return <section className="mx-auto mt-12 max-w-4xl"><ResultHeading eyebrow={locale === "ko" ? "나라를 아직 고르지 못했나요?" : "Not sure about a country yet?"} title={locale === "ko" ? `${occupationName}로 현실적인 곳부터 볼게요.` : `Start with places where ${occupationName} looks realistic.`} description={locale === "ko" ? "현재 확인된 직업 수요 신호가 있는 나라예요. 개인의 비자·경력·면허 조건은 다음 단계에서 확인합니다." : "These countries have a current demand signal for this occupation. Check personal visa, experience and licensing conditions in the next step."} />
    <div className="mt-6 grid gap-3 sm:grid-cols-3">{choices.length ? choices.map((choice) => { const status = statusForRating(choice.rating, locale); return <Link key={choice.countryCode} href={`/?country=${choice.countryCode}&occupation=${occupation}`} className="rounded-2xl border border-[#e2e2df] bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"><p className="text-sm font-semibold text-[#202024]">{choice.countryLabel}</p><p className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">{status.label}</p><p className="mt-4 text-xs leading-5 text-[#6b6b70]">{choice.note}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">{locale === "ko" ? "이 나라의 경로 보기" : "See this country’s path"} <ArrowRight className="size-3.5" /></span></Link> }) : <DataPending occupation={occupationName} locale={locale} />}</div>
    <ExploreLink locale={locale} className="mt-8" />
  </section>
}

function OccupationRecommendations({ country, locale }: { country: string; locale: Locale }) {
  const choices = OCCUPATION_DETAILS.filter((detail) => detail.demand.some((item) => item.countryCode === country)).slice(0, 4)
  const countryName = countryLabel(country)
  return <section className="mx-auto mt-12 max-w-4xl"><ResultHeading eyebrow={locale === "ko" ? "직업을 아직 고르지 못했나요?" : "Not sure about an occupation yet?"} title={locale === "ko" ? `${countryName}에서 먼저 살펴볼 직업이에요.` : `Occupations to start with in ${countryName}.`} description={locale === "ko" ? "수요 근거가 확인된 직업부터 보여드려요. 원하는 직업을 선택하면 개인 경로를 바로 확인할 수 있어요." : "Start with occupations that have reviewed demand evidence. Choose one to see your personal route."} />
    <div className="mt-6 grid gap-3 sm:grid-cols-2">{choices.length ? choices.map((detail) => <Link key={detail.id} href={`/?country=${country}&occupation=${detail.id}`} className="rounded-2xl border border-[#e2e2df] bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"><p className="font-semibold text-[#202024]">{occupationLabel(detail.id, locale)}</p><p className="mt-2 text-sm text-[#6b6b70]">{locale === "ko" ? detail.label : detail.labelKo}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">{locale === "ko" ? "가능성 확인" : "Check my fit"} <ArrowRight className="size-3.5" /></span></Link>) : <DataPending occupation={locale === "ko" ? "이 나라의 직업" : "Occupations in this country"} locale={locale} />}</div>
    <ExploreLink locale={locale} className="mt-8" />
  </section>
}

function OpenExploration({ locale }: { locale: Locale }) {
  return <section className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#e4e4e1] bg-white p-8 text-center"><Compass className="mx-auto size-7 text-blue-700" /><h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{locale === "ko" ? "아직 방향을 정하는 중이군요." : "You’re still exploring your direction."}</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#626267]">{locale === "ko" ? "세계 탐색에서 나라와 직업의 수요 신호를 둘러본 뒤, 여기로 돌아와 한 가지 경로를 확인하세요." : "Explore countries and occupation signals, then come back to check one specific path."}</p><Link href="/maps" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-[#d9d9d6] px-4 text-sm font-semibold text-[#27272a] transition hover:bg-[#f6f6f4]"><Map className="size-4" />{locale === "ko" ? "세계를 탐색해보기" : "Explore the world"}</Link></section>
}

function ResultHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-sm font-semibold text-[#5b64b6]">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#18181b] sm:text-3xl">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#65656a]">{description}</p></div>
}

function DataPending({ occupation, locale }: { occupation: string; locale: Locale }) {
  return <div className="rounded-2xl border border-dashed border-[#d7d7d3] bg-white p-5 sm:col-span-2"><p className="font-semibold text-[#27272a]">{locale === "ko" ? `${occupation}의 직접 비교 근거를 더 확인 중이에요.` : `We are still reviewing directly comparable evidence for ${occupation}.`}</p><p className="mt-2 text-sm leading-6 text-[#6b6b70]">{locale === "ko" ? "탐색 화면에서 지역과 직업 데이터를 먼저 살펴볼 수 있어요." : "You can explore country and occupation data first."}</p></div>
}

function ExploreLink({ locale, className }: { locale: Locale; className?: string }) {
  return <Link href="/maps" className={cn("mx-auto flex w-fit items-center gap-1.5 text-sm font-medium text-[#73737a] transition hover:text-blue-700", className)}><Compass className="size-4" />{locale === "ko" ? "아직 정하지 못했나요? 세계를 탐색해보세요." : "Not decided yet? Explore the world."}</Link>
}
