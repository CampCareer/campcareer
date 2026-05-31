import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  Globe,
  CheckSquare,
  CalendarDays,
} from "lucide-react"

// ── 목업 샘플 데이터 (정적) ────────────────────────────────────────────────────

const MOCK_ROWS = [
  {
    flag: "🇺🇸",
    college: "Stanford University",
    field: "Computer Science",
    roi: 158.9,
    salary: "$95k",
    payback: "1.0yr",
    roiClass: "text-emerald-700 bg-emerald-50",
  },
  {
    flag: "🇮🇪",
    college: "Trinity College Dublin",
    field: "Computer Science",
    roi: 68.4,
    salary: "€25.5k",
    payback: "2.3yr",
    roiClass: "text-amber-700 bg-amber-50",
  },
  {
    flag: "🇨🇦",
    college: "University of Toronto",
    field: "Computer Science",
    roi: 52.1,
    salary: "CA$38k",
    payback: "3.0yr",
    roiClass: "text-orange-700 bg-orange-50",
  },
]

// ── 상수 ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "5",      label: "Countries",       sub: "US · AU · CA · UK · IE" },
  { value: "2,860+", label: "Courses tracked", sub: "" },
  { value: "Real",   label: "Salary Data",     sub: "HEA · College Scorecard" },
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

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900">

      {/* ── 네비게이션 ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CC</span>
            </div>
            <span className="font-semibold text-white text-base tracking-tight">
              CampCareer
            </span>
          </Link>

          {/* 중앙 메뉴 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/roi-explorer" className="text-sm text-slate-400 hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/compare" className="text-sm text-slate-400 hover:text-white transition-colors">
              Compare
            </Link>
            <Link href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              How it works
            </Link>
          </nav>

          {/* 우측 버튼 */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
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

      {/* ── 히어로 (정확히 100vh) ── */}
      <section className="relative h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 flex flex-col overflow-hidden pt-16">

        {/* 텍스트 블록 */}
        <div className="flex flex-col items-center text-center px-6 pt-10 shrink-0">

          {/* 상단 배지 */}
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs px-3.5 py-1.5 rounded-full mb-6">
            🎓&nbsp; 5 countries · 2,860+ courses · Real salary data
          </div>

          {/* 메인 헤드라인 */}
          <h1 className="text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.08] tracking-tight mb-4">
            Find Your Best Country
            <br className="hidden sm:block" />
            {" "}to Study Abroad.
          </h1>

          {/* 서브 헤드라인 */}
          <p className="text-xl lg:text-2xl font-semibold text-indigo-300 mb-4">
            With Data, Not Guesswork.
          </p>

          {/* 설명 텍스트 */}
          <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-8">
            Compare graduate salaries, tuition, and ROI across
            <br className="hidden sm:block" />
            {" "}USA, Ireland, UK, Canada &amp; Australia.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              href="/roi-explorer"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Explore ROI <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center border border-slate-600 hover:border-slate-500 hover:bg-slate-800/60 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Compare Countries
            </Link>
          </div>
        </div>

        {/* ── 제품 목업 (남은 공간 채우고 하단 자연스럽게 잘림) ── */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 min-h-0">
          <div className="bg-white rounded-t-2xl shadow-[0_-4px_48px_rgba(99,102,241,0.22)] overflow-hidden border border-white/10">

            {/* 브라우저 크롬 바 */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-amber-400/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
              <div className="flex items-center gap-1.5 ml-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-600">Live ROI Explorer</span>
              </div>
              <span className="ml-auto text-xs text-slate-400 hidden sm:block">
                campcareer.com/roi-explorer
              </span>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 whitespace-nowrap">
                      College
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 whitespace-nowrap hidden sm:table-cell">
                      Field
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400 whitespace-nowrap">
                      ROI Score ↓
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400 whitespace-nowrap">
                      Net Salary
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400 whitespace-nowrap hidden md:table-cell">
                      Payback
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_ROWS.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{row.flag}</span>
                          <span className="font-medium text-slate-800 whitespace-nowrap">
                            {row.college}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden sm:table-cell whitespace-nowrap">
                        {row.field}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${row.roiClass}`}>
                          {row.roi}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                        {row.salary}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell whitespace-nowrap">
                        {row.payback}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* 하단 페이드 오버레이 */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-indigo-950 via-indigo-950/70 to-transparent pointer-events-none" />
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
