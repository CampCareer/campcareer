"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Building2, Search, ShieldCheck, WalletCards } from "lucide-react"
import { CANONICAL_CAREERS, careersForCategory } from "@/data/career-comparison-catalog"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import { BUDGET_BANDS, SEARCH_GOALS, type BudgetBandId, type SearchGoalId } from "@/lib/discovery/search-contract"
import { localizePath } from "@/lib/i18n/config"
import { track } from "@/lib/analytics"

type Locale = "en" | "ko-KR"

const COPY = {
  en: {
    eyebrow: "Study decisions, made practical",
    title: "Choose what to study, where to go, and what you’ll have left after graduation.",
    subtitle: "Start with your career and budget. We’ll show the destinations that have enough evidence to earn a place on your shortlist.",
    category: "Career category",
    career: "Career",
    budget: "First-year budget (USD)",
    goal: "What matters most?",
    categoryPlaceholder: "Choose a category",
    careerPlaceholder: "Choose a career",
    budgetPlaceholder: "Choose your budget",
    goalPlaceholder: "Choose your goal",
    submit: "See country rankings",
    trustOne: "20 destinations to explore",
    trustTwo: "Evidence before rankings",
    trustThree: "No immigration success claims",
    popular: "Popular decision paths",
    popularBody: "Start with a common question, then refine the result around your own budget and priorities.",
    software: "Computer science & software",
    nursing: "Nursing pathways",
    budgetRoutes: "Lower-budget study routes",
    universitySearch: "Find universities by budget",
    explore: "Explore",
    howItWorks: "What happens next",
    stepOne: "Choose a career",
    stepTwo: "See evidence-backed country rankings",
    stepThree: "Open Maps or Compare only when you need more detail",
  },
  ko: {
    eyebrow: "현실적인 유학 의사결정",
    title: "무엇을 공부할지, 어느 나라로 갈지, 졸업 후 얼마가 남는지 선택하세요.",
    subtitle: "직업과 예산부터 시작하세요. 충분한 근거가 있는 목적지만 우선순위에 올립니다.",
    category: "직종",
    career: "직업",
    budget: "첫해 예산 (USD)",
    goal: "가장 중요한 목표",
    categoryPlaceholder: "직종을 선택하세요",
    careerPlaceholder: "직업을 선택하세요",
    budgetPlaceholder: "예산을 선택하세요",
    goalPlaceholder: "목표를 선택하세요",
    submit: "국가 순위 보기",
    trustOne: "20개국 탐색",
    trustTwo: "근거가 있을 때만 순위 공개",
    trustThree: "이민 성공 확률은 만들지 않음",
    popular: "많이 찾는 시작점",
    popularBody: "자주 묻는 질문에서 시작한 뒤, 예산과 우선순위로 결과를 좁혀보세요.",
    software: "컴퓨터공학·소프트웨어",
    nursing: "간호 유학 경로",
    budgetRoutes: "예산 친화 유학 경로",
    universitySearch: "예산으로 대학 찾기",
    explore: "탐색하기",
    howItWorks: "다음 단계",
    stepOne: "직업을 선택하세요",
    stepTwo: "근거 기반 국가 순위를 확인하세요",
    stepThree: "더 자세히 볼 때만 Maps 또는 Compare를 여세요",
  },
} as const

export function HomeFinder({ locale = "en" }: { locale?: Locale }) {
  const isKo = locale === "ko-KR"
  const t = isKo ? COPY.ko : COPY.en
  const localePrefix = isKo ? "ko" : "en"
  const [category, setCategory] = useState("")
  const [career, setCareer] = useState("")
  const [budget, setBudget] = useState<BudgetBandId | "">("")
  const [goal, setGoal] = useState<SearchGoalId | "">("")
  const router = useRouter()
  const careers = useMemo(() => category ? careersForCategory(category as typeof CANONICAL_CAREERS[number]["categoryId"]) : [], [category])
  const ready = Boolean(category && career && budget && goal)
  const searchHref = ready
    ? `${localizePath("/countries/search", localePrefix)}?${new URLSearchParams({ career, budget, goal, currency: "USD" })}`
    : "#"

  const collectionLinks = [
    { icon: Search, title: t.software, href: `${localizePath("/countries/search", localePrefix)}?career=software-developer&budget=50000-75000&goal=career-outcomes&currency=USD`, accent: "blue" },
    { icon: ShieldCheck, title: t.nursing, href: `${localizePath("/countries/search", localePrefix)}?career=registered-nurse&budget=50000-75000&goal=work-and-immigration&currency=USD`, accent: "emerald" },
    { icon: WalletCards, title: t.budgetRoutes, href: `${localizePath("/countries/search", localePrefix)}?career=software-developer&budget=30000-50000&goal=lower-first-year-cost&currency=USD`, accent: "amber" },
    { icon: Building2, title: t.universitySearch, href: localizePath("/universities", localePrefix), accent: "rose" },
  ]

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative border-b border-slate-200 bg-[radial-gradient(circle_at_84%_12%,rgba(37,99,235,.12),transparent_24rem),linear-gradient(180deg,#f8fbff_0%,#fff_72%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"><ShieldCheck className="h-3.5 w-3.5" />{t.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-slate-950 sm:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{t.subtitle}</p>
          </div>

          <form action={searchHref} onSubmit={(event) => { event.preventDefault(); if (!ready) return; track("decision_start", { career, budget, goal }); router.push(searchHref) }} className="mt-9 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]">
            <div className="grid gap-2 lg:grid-cols-[1fr_1.15fr_1fr_1.2fr_auto]">
              <Field label={t.category}>
                <select aria-label={t.category} value={category} onChange={(event) => { setCategory(event.target.value); setCareer("") }} className="finder-select">
                  <option value="">{t.categoryPlaceholder}</option>
                  {STUDY_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{isKo ? item.labelKo : item.label}</option>)}
                </select>
              </Field>
              <Field label={t.career}>
                <select aria-label={t.career} value={career} disabled={!category} onChange={(event) => setCareer(event.target.value)} className="finder-select disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400">
                  <option value="">{t.careerPlaceholder}</option>
                  {careers.map((item) => <option key={item.id} value={item.id}>{isKo ? item.labelKo : item.label}</option>)}
                </select>
              </Field>
              <Field label={t.budget}>
                <select aria-label={t.budget} value={budget} onChange={(event) => setBudget(event.target.value as BudgetBandId)} className="finder-select">
                  <option value="">{t.budgetPlaceholder}</option>
                  {BUDGET_BANDS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label={t.goal}>
                <select aria-label={t.goal} value={goal} onChange={(event) => setGoal(event.target.value as SearchGoalId)} className="finder-select">
                  <option value="">{t.goalPlaceholder}</option>
                  {SEARCH_GOALS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
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
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Explore</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{t.popular}</h2><p className="mt-2 max-w-2xl text-slate-600">{t.popularBody}</p></div><Link href={localizePath("/countries", localePrefix)} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-700">{t.explore}<ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collectionLinks.map((item) => { const Icon = item.icon; return <Link key={item.title} href={item.href} onClick={() => track("finder_search", { collection: item.title })} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"><span className={`inline-flex rounded-xl p-2.5 ${item.accent === "blue" ? "bg-blue-50 text-blue-700" : item.accent === "emerald" ? "bg-emerald-50 text-emerald-700" : item.accent === "amber" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}><Icon className="h-5 w-5" /></span><h3 className="mt-6 text-lg font-semibold text-slate-950">{item.title}</h3><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-700">{t.explore}<ArrowRight className="h-4 w-4" /></span></Link> })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{t.howItWorks}</p><div className="mt-5 grid gap-4 md:grid-cols-3">{[t.stepOne, t.stepTwo, t.stepThree].map((step, index) => <div key={step} className="flex items-start gap-3 rounded-xl bg-white p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span><p className="pt-1 text-sm font-medium text-slate-700">{step}</p></div>)}</div></div></section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block rounded-xl px-2 pt-2.5"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">{label}</span>{children}</label>
}
