import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  Globe,
  CheckSquare,
  CalendarDays,
  Map,
  FolderOpen,
} from "lucide-react"
import { getTranslations } from "@/lib/i18n/server"
import { LanguageToggle } from "@/components/language-toggle"
import { LogoMark } from "@/components/logo-mark"
import { HeroSearch } from "@/components/hero-search"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "CampCareer | Study Abroad & Immigration Decision Engine",
  description: "Compare study-abroad options by tuition, salary, ROI, payback period, visa pathways, PR potential, and career outcomes across the US, UK, Ireland, Canada, and Australia.",
  path: "/",
})

// ── 목업 샘플 데이터 (정적, 번역 제외) ────────────────────────────────────────

const MOCK_ROWS = [
  {
    flag: "🇺🇸",
    college: "Stanford University",
    field: "Computer Science",
    roi: 38.0,
    salary: "$89,527",
    payback: "2.4 yrs",
    roiClass: "text-emerald-700 bg-emerald-50",
  },
  {
    flag: "🇮🇪",
    college: "Trinity College Dublin",
    field: "Computer Science",
    roi: 12.3,
    salary: "€32,450",
    payback: "4.1 yrs",
    roiClass: "text-amber-700 bg-amber-50",
  },
  {
    flag: "🇦🇺",
    college: "Univ. of Melbourne",
    field: "Computer Science",
    roi: 9.8,
    salary: "AU$68,200",
    payback: "5.2 yrs",
    roiClass: "text-orange-700 bg-orange-50",
  },
]

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const t = getTranslations()
  const tl = t.landing

  const STATS = [
    { value: "5",       label: tl.stats.countries,     sub: "US · AU · CA · UK · IE",           desc: tl.stats.countriesDesc },
    { value: "11,000+", label: tl.stats.coursesTracked, sub: "",                                desc: tl.stats.coursesTrackedDesc },
    { value: "Real",    label: tl.stats.salaryData,     sub: "HEA · Scorecard · CRICOS · HESA", desc: tl.stats.salaryDataDesc },
    { value: "Gov't",   label: tl.stats.officialData,   sub: tl.stats.officialDataSub,           desc: tl.stats.officialDataDesc },
  ]

  const FEATURES = [
    { icon: TrendingUp,   title: tl.features.roiTitle,        desc: tl.features.roiDesc,        why: tl.features.roiWhy,        href: "/roi-explorer" },
    { icon: Map,          title: tl.features.careerMapTitle,  desc: tl.features.careerMapDesc,  why: tl.features.careerMapWhy,  href: "/career-path" },
    { icon: Globe,        title: tl.features.compareTitle,    desc: tl.features.compareDesc,    why: tl.features.compareWhy,    href: "/compare" },
    { icon: CheckSquare,  title: tl.features.checklistTitle,  desc: tl.features.checklistDesc,  why: tl.features.checklistWhy,  href: "/checklist" },
    { icon: CalendarDays, title: tl.features.timelineTitle,   desc: tl.features.timelineDesc,   why: tl.features.timelineWhy,   href: "/timeline" },
    { icon: FolderOpen,   title: tl.features.documentsTitle,  desc: tl.features.documentsDesc,  why: tl.features.documentsWhy,  href: "/documents" },
  ]

  return (
    <div className="bg-white text-slate-900">

      {/* ── 네비게이션 ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <LogoMark size={32} />
            <span className="font-semibold text-white text-base tracking-tight">
              CampCareer
            </span>
          </Link>

          {/* 중앙 메뉴 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/roi-explorer" className="text-sm text-slate-400 hover:text-white transition-colors">
              {tl.nav.explore}
            </Link>
            <Link href="/compare" className="text-sm text-slate-400 hover:text-white transition-colors">
              {tl.nav.compare}
            </Link>
            <Link href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              {tl.nav.howItWorks}
            </Link>
          </nav>

          {/* 우측 버튼 */}
          <div className="flex items-center gap-3">
            <LanguageToggle className="text-slate-400 hover:text-white hover:bg-slate-800" />
            <Link
              href="/login"
              className="hidden sm:block text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {tl.nav.signIn}
            </Link>
            <Link
              href="/onboarding"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {tl.nav.getStarted}
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
            🎓&nbsp; {tl.hero.badge}
          </div>

          {/* 메인 헤드라인 */}
          <h1 className="text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.08] tracking-tight mb-4">
            {tl.hero.headlineLine1}
            <br className="hidden sm:block" />
            {" "}{tl.hero.headlineLine2}
          </h1>

          {/* 서브 헤드라인 (두 줄) */}
          <p className="text-xl lg:text-2xl font-semibold text-indigo-300 mb-8 leading-snug">
            {tl.hero.subheadlineLine1}
            <br />
            {tl.hero.subheadlineLine2}
          </p>

          {/* 인라인 검색 위젯 */}
          <HeroSearch />
          <div className="flex items-center gap-4 mt-4 mb-8">
            <Link
              href="/roi-explorer"
              className="text-sm text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              {tl.hero.ctaPrimary}
            </Link>
            <span className="text-slate-700">·</span>
            <Link
              href="/compare"
              className="text-sm text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              {tl.hero.ctaCompare}
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
                <span className="text-xs font-medium text-slate-600">{tl.hero.mockBadge}</span>
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
                          {row.roi.toFixed(1)}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-bold text-slate-900">{s.value}</p>
                <p className="mt-2 text-base font-medium text-slate-700">{s.label}</p>
                {s.sub && <p className="mt-1 text-sm text-slate-400">{s.sub}</p>}
                {s.desc && <p className="mt-2 text-xs text-slate-500 leading-relaxed">{s.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (3 steps) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">
              {tl.howItWorks.sectionTitle}
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center px-6 py-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl">🔍</div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{tl.howItWorks.step1Title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tl.howItWorks.step1Desc}</p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block text-2xl text-slate-300 shrink-0">→</div>
            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center px-6 py-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl">📊</div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{tl.howItWorks.step2Title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tl.howItWorks.step2Desc}</p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block text-2xl text-slate-300 shrink-0">→</div>
            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center px-6 py-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl">🎯</div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{tl.howItWorks.step3Title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tl.howItWorks.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 기능 소개 ── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">
              {tl.features.sectionTitle}
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              {tl.features.sectionSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                {f.why && <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-3">{f.why}</p>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            {tl.cta.title}
          </h2>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-600 font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            {tl.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <span>{tl.footer.copyright}</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <span>{tl.footer.dataSources}</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
