"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { STUDY_CONCEPTS } from "@/data/study-concepts"
import { LANDING_GOALS, type LandingGoalId } from "@/lib/discovery/landing-discovery"
import { localizePath } from "@/lib/i18n/config"
import { recordDiscoveryEvent } from "@/lib/analytics"
import { IconPicker, type PickerOption, countryFlag, majorEmoji } from "@/components/ui/icon-picker"

type Locale = "en" | "ko-KR"

const COPY = {
  en: {
    eyebrow: "Study decisions, made practical",
    title: "Compare study paths - from campus to career.",
    subtitle: "Start with your career and budget. We’ll show the destinations that have enough evidence to earn a place on your shortlist.",
    country: "Where",
    major: "Major",
    goal: "Goal",
    countryPlaceholder: "Everywhere",
    majorPlaceholder: "Anything",
    goalPlaceholder: "Choose your goal",
    submit: "Search",
    trustOne: "20 destinations to explore",
    trustTwo: "Evidence before rankings",
    trustThree: "No immigration success claims",
    exploreCountries: "Explore 20 countries",
    exploreCountriesBody: "Open a destination directly, or use the search above to compare the countries that fit your goal.",
    explore: "Explore country",
  },
  ko: {
    eyebrow: "현실적인 유학 의사결정",
    title: "무엇을 공부할지, 어느 나라로 갈지, 졸업 후 얼마가 남는지 선택하세요.",
    subtitle: "직업과 예산부터 시작하세요. 충분한 근거가 있는 목적지만 우선순위에 올립니다.",
    country: "나라",
    major: "전공",
    goal: "목표",
    countryPlaceholder: "어디든지",
    majorPlaceholder: "아직 모르겠어요",
    goalPlaceholder: "목표를 선택하세요",
    submit: "검색",
    trustOne: "20개국 탐색",
    trustTwo: "근거가 있을 때만 순위 공개",
    trustThree: "이민 성공 확률은 만들지 않음",
    exploreCountries: "20개국 빠르게 둘러보기",
    exploreCountriesBody: "국가를 바로 열어보거나, 위 검색으로 목표에 맞는 국가를 비교하세요.",
    explore: "국가 탐색",
  },
} as const

export function HomeFinder({ locale = "en" }: { locale?: Locale }) {
  const isKo = locale === "ko-KR"
  const t = isKo ? COPY.ko : COPY.en
  const localePrefix = isKo ? "ko" : "en"
  const [country, setCountry] = useState("everywhere")
  const [major, setMajor] = useState("anything")
  const [goal, setGoal] = useState<LandingGoalId | "">("")
  const router = useRouter()
  const searchHref = `${localizePath("/countries/search", localePrefix)}?${new URLSearchParams({ country, major, ...(goal ? { goal } : {}) })}`
  const singaporeWorkspaceHref = `${localizePath("/regional-workspace", localePrefix)}?${new URLSearchParams({ country: "SG", state: "SG", city: "Singapore", major, ...(goal ? { goal } : {}) })}`
  const countryOptions = useMemo<PickerOption[]>(() => [
    { value: "everywhere", label: t.countryPlaceholder, description: isKo ? "20개국을 함께 비교" : "Compare all 20 destinations", icon: "🌍", keywords: "all global" },
    ...LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name, description: isKo ? `${item.name} 유학·취업 신호 보기` : `Explore study and career signals`, icon: countryFlag(item.code), keywords: `${item.code} ${item.slug}` })),
  ], [isKo, t.countryPlaceholder])
  const majorOptions = useMemo<PickerOption[]>(() => [
    { value: "anything", label: t.majorPlaceholder, description: isKo ? "국가별 유망 전공부터 확인" : "See promising fields by country", icon: "✨", keywords: "any undecided" },
    ...STUDY_CONCEPTS.map((item) => ({ value: item.id, label: isKo ? item.labelKo : item.label, description: isKo ? item.description : item.description, icon: majorEmoji(item.category), keywords: `${item.category} ${item.aliases.join(" ")} ${item.aliasesKo.join(" ")}` })),
  ], [isKo, t.majorPlaceholder])
  const goalOptions = useMemo<PickerOption[]>(() => [
    ...LANDING_GOALS.map((item) => ({ value: item.id, label: isKo ? goalCopy(item.id).label : item.label, description: isKo ? goalCopy(item.id).description : goalCopy(item.id).descriptionEn, icon: goalCopy(item.id).icon })),
  ], [isKo])

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative border-b border-slate-200 bg-[radial-gradient(circle_at_84%_12%,rgba(37,99,235,.12),transparent_24rem),linear-gradient(180deg,#f8fbff_0%,#fff_72%)]">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-20">
          <div className="max-w-4xl">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-slate-950 sm:text-6xl">{t.title}</h1>
          </div>

          <form action={searchHref} onSubmit={(event) => { event.preventDefault(); const submitted = new FormData(event.currentTarget); const submittedCountry = String(submitted.get("country") ?? "everywhere"); const submittedMajor = String(submitted.get("major") ?? "anything"); const submittedGoal = String(submitted.get("goal") ?? ""); const href = `${localizePath("/countries/search", localePrefix)}?${new URLSearchParams({ country: submittedCountry, major: submittedMajor, ...(submittedGoal ? { goal: submittedGoal } : {}) })}`; recordDiscoveryEvent("recommendation_start", { surface: "landing", country: submittedCountry, major: submittedMajor, goal: submittedGoal }); if (submittedCountry === "SG" && submittedGoal) { window.open(singaporeWorkspaceHref, "_blank", "noopener,noreferrer"); return } router.push(href) }} className="mt-9 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1"><IconPicker name="country" label={t.country} value={country} options={countryOptions} onChange={setCountry} searchPlaceholder={isKo ? "국가 검색" : "Search countries"} testId="country" /></div>
              <div className="flex-1"><IconPicker name="major" label={t.major} value={major} options={majorOptions} onChange={setMajor} searchPlaceholder={isKo ? "전공 검색" : "Search majors"} testId="major" /></div>
              <div className="flex-1"><IconPicker name="goal" label={t.goal} value={goal} options={goalOptions} onChange={(value) => setGoal(value as LandingGoalId)} testId="goal" /></div>
              <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"><span>{t.submit}</span><ArrowRight className="h-4 w-4" /></button>
            </div>
          </form>


        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Explore</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{t.exploreCountries}</h2><p className="mt-2 max-w-2xl text-slate-600">{t.exploreCountriesBody}</p></div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LAUNCH_COUNTRIES.map((country) => <Link key={country.code} href={localizePath(`/countries/${country.slug}`, localePrefix)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-blue-300 hover:shadow-md"><div className="relative h-40 overflow-hidden"><Image src={country.image} alt={country.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /></div><div className="p-4"><p className="text-xs font-semibold tracking-[.15em] text-blue-700">{country.code}</p><h3 className="mt-1 font-semibold text-slate-950">{country.name}</h3><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-700">{t.explore}<ArrowRight className="h-4 w-4" /></span></div></Link>)}
        </div>
      </section>
    </div>
  )
}

function goalCopy(goal: LandingGoalId) {
  if (goal === "high-income") return { label: "높은 졸업 후 연봉", description: "소득 신호가 강한 국가부터 확인", descriptionEn: "Prioritise stronger graduate earning signals", icon: "💰" }
  if (goal === "low-cost") return { label: "낮은 유학비용", description: "비용 부담이 낮은 국가부터 확인", descriptionEn: "Prioritise lower study-cost signals", icon: "🌱" }
  return { label: "졸업 후 취업·체류", description: "졸업 후 경로가 강한 국가부터 확인", descriptionEn: "Prioritise post-study work options", icon: "🧭" }
}
