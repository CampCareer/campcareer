"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { STUDY_CONCEPTS } from "@/data/study-concepts"
import { LANDING_GOALS, type LandingGoalId } from "@/lib/discovery/landing-discovery"
import { localizePath } from "@/lib/i18n/config"
import { recordDiscoveryEvent } from "@/lib/analytics"

type Locale = "en" | "ko-KR"

const COPY = {
  en: {
    eyebrow: "Study decisions, made practical",
    title: "Compare study paths - from campus to career.",
    subtitle: "Start with your career and budget. We’ll show the destinations that have enough evidence to earn a place on your shortlist.",
    country: "Where do you want to study?",
    major: "What do you want to study?",
    goal: "What matters most?",
    countryPlaceholder: "Everywhere",
    majorPlaceholder: "Anything",
    goalPlaceholder: "Choose your goal",
    submit: "See country rankings",
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
    country: "어느 나라에서 공부하고 싶나요?",
    major: "무엇을 공부하고 싶나요?",
    goal: "가장 중요한 목표",
    countryPlaceholder: "어디든지",
    majorPlaceholder: "아직 모르겠어요",
    goalPlaceholder: "목표를 선택하세요",
    submit: "국가 순위 보기",
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
  const ready = Boolean(goal)
  const searchHref = ready
    ? `${localizePath("/countries/search", localePrefix)}?${new URLSearchParams({ country, major, goal })}`
    : "#"

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative border-b border-slate-200 bg-[radial-gradient(circle_at_84%_12%,rgba(37,99,235,.12),transparent_24rem),linear-gradient(180deg,#f8fbff_0%,#fff_72%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"><ShieldCheck className="h-3.5 w-3.5" />{t.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-slate-950 sm:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{t.subtitle}</p>
          </div>

          <form action={searchHref} onSubmit={(event) => { event.preventDefault(); const submitted = new FormData(event.currentTarget); const submittedCountry = String(submitted.get("country") ?? "everywhere"); const submittedMajor = String(submitted.get("major") ?? "anything"); const submittedGoal = String(submitted.get("goal") ?? "") as LandingGoalId; if (!submittedGoal) return; const href = `${localizePath("/countries/search", localePrefix)}?${new URLSearchParams({ country: submittedCountry, major: submittedMajor, goal: submittedGoal })}`; recordDiscoveryEvent("recommendation_start", { surface: "landing", country: submittedCountry, major: submittedMajor, goal: submittedGoal }); router.push(href) }} className="mt-9 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]">
            <div className="grid gap-2 lg:grid-cols-[1fr_1.15fr_1.2fr_auto]">
              <Field label={t.country}>
                <select name="country" aria-label={t.country} value={country} onChange={(event) => setCountry(event.target.value)} className="finder-select">
                  <option value="everywhere">{t.countryPlaceholder}</option>
                  {LAUNCH_COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
                </select>
              </Field>
              <Field label={t.major}>
                <select name="major" aria-label={t.major} value={major} onChange={(event) => setMajor(event.target.value)} className="finder-select">
                  <option value="anything">{t.majorPlaceholder}</option>
                  {STUDY_CONCEPTS.map((item) => <option key={item.id} value={item.id}>{isKo ? item.labelKo : item.label}</option>)}
                </select>
              </Field>
              <Field label={t.goal}>
                <select name="goal" aria-label={t.goal} value={goal} onChange={(event) => setGoal(event.target.value as LandingGoalId)} className="finder-select">
                  <option value="">{t.goalPlaceholder}</option>
                  {LANDING_GOALS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <button type="submit" disabled={!ready} className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"><span>{t.submit}</span><ArrowRight className="h-4 w-4" /></button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {[t.trustOne, t.trustTwo, t.trustThree].map((item) => <span key={item} className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />{item}</span>)}
          </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block rounded-xl px-2 pt-2.5"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">{label}</span>{children}</label>
}
