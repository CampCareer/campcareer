"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { BadgeCheck, BriefcaseBusiness, Compass, GraduationCap, Route, ShieldCheck, TrendingUp } from "lucide-react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { HomeSearchForm } from "./home-search-form"
import {
  getOverviewSearchQuery,
  readOverviewSearchValues,
  toOverviewSearchQuery,
  type OverviewSearchValues,
} from "./home-overview-config"

type Locale = "en" | "ko"

export function HomeHub() {
  const router = useRouter()
  const locale = useRouteLocale()
  const searchParams = useSearchParams()
  const [values, setValues] = useState<OverviewSearchValues>(() => readOverviewSearchValues(searchParams))
  const result = getOverviewSearchQuery(searchParams)

  useEffect(() => setValues(readOverviewSearchValues(searchParams)), [searchParams])

  useEffect(() => {
    if (!result) return
    router.replace(`${localizePath("/career", locale)}?${toOverviewSearchQuery(result).toString()}`)
  }, [locale, result, router])

  const submit = (nextValues: OverviewSearchValues) => {
    router.push(`${localizePath("/career", locale)}?${toOverviewSearchQuery(nextValues).toString()}`)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-white text-[#171717]">
      <section className="cc-landing-hero relative overflow-hidden border-b border-[#e6e8ef] px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="relative px-1 py-7 text-[#1b1b1b] sm:px-4 sm:py-10 lg:px-8 lg:py-12">
            <div className="relative grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
              <div className="max-w-3xl">
                <h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.065em] text-[#131a2a] sm:text-5xl lg:text-[64px]">
                  {locale === "ko" ? <>유학 정보가 아니라,<br /><span className="cc-landing-highlight">해외에서 일하는 경로</span>를 찾습니다.</> : <>Not study information.<br />Build your <span className="cc-landing-highlight">career abroad.</span></>}
                </h1>
                <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base">
                  {locale === "ko" ? "내 직업과 목표 국가를 고르면, 취업 수요부터 비자·자격 조건, 실제로 밟아야 할 다음 단계까지 한 번에 확인할 수 있어요." : "Choose your occupation and destination to see demand signals, visa and qualification conditions, and the steps toward working there."}
                </p>
              </div>
              <CareerSignalPanel locale={locale} />
            </div>
          </div>

          <div className="relative mx-auto mt-4 max-w-5xl rounded-2xl border border-[#dce4f0] bg-white p-4 shadow-[0_18px_42px_-30px_rgba(41,84,156,.3)] sm:mt-6 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-base font-semibold tracking-[-0.025em] text-[#1f2937]">{locale === "ko" ? "어느 나라에서, 어떤 일로 커리어를 만들고 싶나요?" : "Where do you want to build your career, and in what work?"}</p>
                <p className="mt-1 text-sm text-slate-500">{locale === "ko" ? "선택하면 지금 확인할 수 있는 현실적인 경로를 보여드릴게요." : "We’ll show the most realistic path you can check right now."}</p>
              </div>
              <p className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex"><BadgeCheck className="size-4 text-blue-600" /> {locale === "ko" ? "근거 기반으로 확인" : "Evidence-led guidance"}</p>
            </div>
            <HomeSearchForm values={values} locale={locale} onValuesChange={setValues} onSubmit={submit} />
          </div>

          {!result && <LandingProof locale={locale} />}
          {result && <div className="mt-10 h-40 animate-pulse rounded-3xl bg-[#f5f5f3]" aria-label={locale === "ko" ? "결과 페이지로 이동 중" : "Moving to the results page"} />}
        </div>
      </section>
    </div>
  )
}

function CareerSignalPanel({ locale }: { locale: Locale }) {
  const signals = locale === "ko"
    ? [
        { icon: <TrendingUp className="size-5" />, detail: "미국 소프트웨어 개발자 일자리는 2024–34년 267,700개 늘어날 전망입니다.", source: "U.S. Bureau of Labor Statistics · 2024–34 전망" },
        { icon: <BriefcaseBusiness className="size-5" />, detail: "캐나다 간호사는 공식 분석에서 ‘강한 인력부족 위험’ 직종입니다.", source: "ESDC COPS · 캐나다 직업 전망" },
        { icon: <TrendingUp className="size-5" />, detail: "호주 간호사 고용은 최근 5년간 13.7% 늘었습니다.", source: "Jobs and Skills Australia · 2026년 5월" },
        { icon: <GraduationCap className="size-5" />, detail: "미국 간호사 일자리는 2024–34년 166,100개 늘어날 전망입니다.", source: "U.S. Bureau of Labor Statistics · 2024–34 전망" },
        { icon: <BriefcaseBusiness className="size-5" />, detail: "영국 소프트웨어 개발 전문직은 2025년 ‘수요 상승’ 직종으로 분류됐습니다.", source: "Skills England · Occupations in demand 2025" },
        { icon: <TrendingUp className="size-5" />, detail: "미국 데이터사이언티스트 고용은 2024–34년 33.5% 성장 전망입니다.", source: "U.S. Bureau of Labor Statistics · 2024–34 전망" },
        { icon: <BriefcaseBusiness className="size-5" />, detail: "아일랜드는 소프트웨어 개발자·ICT 전문가를 Critical Skills 직종에 포함합니다.", source: "Department of Enterprise · Critical Skills list" },
      ]
    : [
        { icon: <TrendingUp className="size-5" />, detail: "U.S. Software Developer jobs are projected to grow by 267,700 from 2024–34.", source: "U.S. Bureau of Labor Statistics · 2024–34 projections" },
        { icon: <BriefcaseBusiness className="size-5" />, detail: "Canadian Registered Nurses carry a strong shortage-risk rating in official analysis.", source: "ESDC COPS · Canadian occupational outlook" },
        { icon: <TrendingUp className="size-5" />, detail: "Australian Registered Nurse employment grew 13.7% over the past five years.", source: "Jobs and Skills Australia · May 2026" },
        { icon: <GraduationCap className="size-5" />, detail: "U.S. Registered Nurse jobs are projected to grow by 166,100 from 2024–34.", source: "U.S. Bureau of Labor Statistics · 2024–34 projections" },
        { icon: <BriefcaseBusiness className="size-5" />, detail: "UK software-development professionals are classified as occupations with elevated demand.", source: "Skills England · Occupations in demand 2025" },
        { icon: <TrendingUp className="size-5" />, detail: "U.S. Data Scientist employment is projected to grow 33.5% from 2024–34.", source: "U.S. Bureau of Labor Statistics · 2024–34 projections" },
        { icon: <BriefcaseBusiness className="size-5" />, detail: "Ireland includes software developers and ICT specialists on its Critical Skills list.", source: "Department of Enterprise · Critical Skills list" },
      ]
  const [activeSignal, setActiveSignal] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReducedMotion(media.matches)
    updatePreference()
    media.addEventListener("change", updatePreference)
    return () => media.removeEventListener("change", updatePreference)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(() => setActiveSignal((current) => (current + 1) % signals.length), 4600)
    return () => window.clearInterval(timer)
  }, [reducedMotion, signals.length])

  const signal = signals[activeSignal] ?? signals[0]

  return (
    <div className="cc-signal-panel rounded-2xl border border-white/70 p-4 shadow-[0_24px_52px_-36px_rgba(31,75,145,.62)] sm:p-5">
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.12em] text-[#56657c]">
        <span>{locale === "ko" ? "커리어 시장 신호" : "CAREER SIGNALS"}</span>
        <span className="inline-flex items-center gap-1.5 tracking-[0.08em] text-[#36735a]"><i className="cc-signal-live-dot" aria-hidden />{locale === "ko" ? "실시간" : "LIVE"}</span>
      </div>
      <div className="cc-signal-rotator mt-4">
        <div key={signal.detail} className="cc-signal-slide">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#2c61bc] shadow-[0_8px_18px_-12px_rgba(30,76,148,.56)]">{signal.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-5 tracking-[-0.02em] text-[#1d2c44]">{signal.detail}</p>
            <p className="mt-1 text-xs text-[#6e7e95]">{signal.source}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LandingProof({ locale }: { locale: Locale }) {
  const cards = locale === "ko"
    ? [
        { icon: <BriefcaseBusiness className="size-5" />, title: "취업 가능성부터", description: "학위 이름이 아니라, 현지에서 실제로 필요한 직업인지 먼저 봅니다." },
        { icon: <ShieldCheck className="size-5" />, title: "막히는 조건까지", description: "비자, 자격 인정, 면허처럼 경로를 바꾸는 조건을 놓치지 않습니다." },
        { icon: <Route className="size-5" />, title: "오늘의 다음 행동까지", description: "막연한 비교 대신 내 경력에서 시작하는 실행 순서를 제안합니다." },
      ]
    : [
        { icon: <BriefcaseBusiness className="size-5" />, title: "Start with employability", description: "See whether a job is genuinely needed locally, not just what a degree is called." },
        { icon: <ShieldCheck className="size-5" />, title: "See the real constraints", description: "Keep visa, recognition and licensing conditions that change your route in view." },
        { icon: <Route className="size-5" />, title: "Know your next move", description: "Move beyond comparison to a practical sequence that starts from your experience." },
      ]

  return <div className="mx-auto max-w-5xl pb-2 pt-12 sm:pt-16">
    <div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.12em] text-blue-700">{locale === "ko" ? "학교보다 커리어를 먼저" : "CAREER-FIRST, NOT SCHOOL-FIRST"}</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-[#182033] sm:text-3xl">{locale === "ko" ? "해외 커리어의 시작은\n‘어디서 배울까’보다 ‘어디서 일할까’입니다." : "An overseas career starts with where you can work — not only where you can study."}</h2></div>
    <div className="mt-7 grid gap-3 md:grid-cols-3 sm:gap-4">
      {cards.map((card, index) => <div key={card.title} className="group rounded-2xl border border-[#e2e8f2] bg-white p-5 shadow-[0_12px_28px_-28px_rgba(31,71,130,.6)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_36px_-24px_rgba(30,64,175,.35)]"><span className={cn("grid size-10 place-items-center rounded-xl", index === 0 ? "bg-blue-50 text-blue-700" : index === 1 ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-violet-700")}>{card.icon}</span><p className="mt-5 text-xs font-semibold tracking-[0.1em] text-slate-400">0{index + 1}</p><h3 className="mt-1.5 text-lg font-semibold tracking-[-0.03em] text-[#202938]">{card.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p></div>)}
    </div>
    <ExploreLink locale={locale} className="mt-8" />
  </div>
}

function ExploreLink({ locale, className }: { locale: Locale; className?: string }) {
  return <Link href={localizePath("/maps", locale)} className={cn("mx-auto flex w-fit items-center gap-1.5 text-sm font-medium text-[#73737a] transition hover:text-blue-700", className)}><Compass className="size-4" />{locale === "ko" ? "아직 정하지 못했나요? 세계를 탐색해보세요." : "Not decided yet? Explore the world."}</Link>
}
