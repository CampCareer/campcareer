import { supabase } from "@/lib/supabase"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Globe,
  CheckSquare,
  CalendarDays,
} from "lucide-react"

// ── 타입 ─────────────────────────────────────────────────────────────────────

type RoiRow = {
  college_name: string
  roi_score: number
  net_salary: number
  payback_years: number
}

type NumericRoiKey = "roi_score" | "net_salary" | "payback_years"

type CountryCard = {
  flag: string
  name: string
  currency: string
  country: string
  rows: RoiRow[]
  avgRoi: number | null
  avgSalary: number | null
  avgPayback: number | null
}

// ── 유틸 ─────────────────────────────────────────────────────────────────────

function mean(rows: RoiRow[], key: NumericRoiKey): number | null {
  if (!rows.length) return null
  const vals = rows.map((r) => r[key]).filter((v) => v != null) as number[]
  if (!vals.length) return null
  return vals.reduce((s, v) => s + v, 0) / vals.length
}

function fmtRoi(v: number | null) {
  return v == null ? "—" : v.toFixed(1)
}
function fmtSalary(v: number | null, prefix: string) {
  return v == null ? "—" : `${prefix}${Math.round(v / 1000)}k`
}
function fmtPayback(v: number | null) {
  return v == null ? "—" : `${v.toFixed(1)}yr`
}

// ── 데이터 fetch ──────────────────────────────────────────────────────────────

async function getCountryCards(): Promise<CountryCard[]> {
  const base = (table: string) =>
    supabase
      .from(table)
      .select("college_name,roi_score,net_salary,payback_years")
      .gt("roi_score", 0)
      .order("roi_score", { ascending: false, nullsFirst: false })
      .limit(3)

  const [us, ie, uk] = await Promise.all([
    base("roi_explorer_us").eq("college_state", "CA"),
    base("roi_explorer_ie").eq("college_state", "Leinster").eq("nfq_level", 8),
    base("roi_explorer_uk").eq("college_state", "London"),
  ])

  const build = (
    flag: string,
    name: string,
    currency: string,
    country: string,
    raw: RoiRow[] | null,
  ): CountryCard => {
    const rows = raw ?? []
    return {
      flag, name, currency, country, rows,
      avgRoi:     mean(rows, "roi_score"),
      avgSalary:  mean(rows, "net_salary"),
      avgPayback: mean(rows, "payback_years"),
    }
  }

  return [
    build("🇺🇸", "USA",     "$", "us", us.data as RoiRow[] | null),
    build("🇮🇪", "Ireland", "€", "ie", ie.data as RoiRow[] | null),
    build("🇬🇧", "UK",      "£", "uk", uk.data as RoiRow[] | null),
  ]
}

// ── 상수 ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "5",      label: "Countries",      sub: "US · AU · CA · UK · IE" },
  { value: "2,860+", label: "Courses tracked", sub: "" },
  { value: "Real",   label: "Salary Data",    sub: "HEA · College Scorecard" },
]

const FEATURES = [
  {
    icon: TrendingUp,
    title: "ROI Explorer",
    desc: "Compare universities by real return on investment",
    href: "/roi-explorer",
  },
  {
    icon: Globe,
    title: "Country Compare",
    desc: "Side-by-side 5-country analysis",
    href: "/compare",
  },
  {
    icon: CheckSquare,
    title: "Application Checklist",
    desc: "Never miss a deadline",
    href: "/checklist",
  },
  {
    icon: CalendarDays,
    title: "Timeline",
    desc: "Plan your entire journey",
    href: "/timeline",
  },
]

const TRUST = [
  "Official government data sources",
  "2,860+ courses tracked",
  "Updated 2024-2025",
]

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const countryCards = await getCountryCards()

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── 네비게이션 ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CC</span>
            </div>
            <span className="font-semibold text-slate-900 text-base tracking-tight">
              CampCareer
            </span>
          </Link>

          {/* 중앙 메뉴 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/roi-explorer"
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/compare"
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Compare
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
            >
              How it works
            </Link>
          </nav>

          {/* 우측 버튼 */}
          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/roi-explorer"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── 히어로 ── */}
      <section className="min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24 lg:py-32">

            {/* 왼쪽: 카피 */}
            <div className="space-y-8">
              {/* 배지 */}
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-100">
                <span className="text-base">🎓</span>
                Data-driven study abroad decisions
              </div>

              {/* H1 */}
              <h1 className="text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.1] tracking-tight">
                Choose Your Study Abroad Path Based on Career Outcomes,{" "}
                <span className="text-indigo-600">Not Guesswork</span>
              </h1>

              {/* 서브텍스트 */}
              <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                Compare countries, universities, and degrees by real salary data,
                employment rates, and ROI — across 5 countries.
              </p>

              {/* CTA 버튼 */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/roi-explorer"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Compare Career ROI
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Explore Countries
                </Link>
              </div>

              {/* 신뢰 지표 */}
              <div className="flex flex-col gap-2.5 pt-2">
                {TRUST.map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 라이브 국가 카드 */}
            <div className="flex flex-col gap-4">
              {countryCards.map((card) => (
                <div
                  key={card.name}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  {/* 카드 헤더 */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl leading-none">{card.flag}</span>
                      <span className="font-semibold text-slate-900">{card.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">
                      Top 3 universities
                    </span>
                  </div>

                  {/* 대학 리스트 */}
                  <div className="divide-y divide-slate-100">
                    {card.rows.map((row, idx) => (
                      <div key={idx} className="flex items-start gap-3 px-5 py-2.5">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {row.college_name ?? "—"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ROI {fmtRoi(row.roi_score)}
                            {" · "}
                            {fmtSalary(row.net_salary, card.currency)} net
                            {" · "}
                            {fmtPayback(row.payback_years)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Avg 요약 row */}
                  <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium shrink-0">Avg</span>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                      <span>ROI {fmtRoi(card.avgRoi)}</span>
                      <span className="text-slate-300">·</span>
                      <span>Net {fmtSalary(card.avgSalary, card.currency)}</span>
                      <span className="text-slate-300">·</span>
                      <span>{fmtPayback(card.avgPayback)}</span>
                    </div>
                  </div>

                  {/* 링크 */}
                  <div className="px-5 py-3 border-t border-slate-100">
                    <Link
                      href={`/roi-explorer?country=${card.country}`}
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                      View all {card.name} universities <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-bold text-slate-900">{s.value}</p>
                <p className="mt-2 text-base font-medium text-slate-700">{s.label}</p>
                {s.sub && <p className="mt-1 text-sm text-slate-400">{s.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 기능 소개 ── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">
              Powerful tools for every step
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Everything you need to choose your study abroad path with confidence
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to make a data-driven decision?
          </h2>
          <Link
            href="/roi-explorer"
            className="inline-flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-600 font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <span>© 2025 CampCareer</span>
          <span>Data sources: HEA · College Scorecard · HESA</span>
        </div>
      </footer>

    </div>
  )
}
