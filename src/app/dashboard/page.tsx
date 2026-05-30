import Link from "next/link"
import { ArrowRight } from "lucide-react"

// ── 시간대별 인사 (서버 사이드) ────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getUTCHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

// ── 상수 ─────────────────────────────────────────────────────────────────────

const QUICK_STATS = [
  { emoji: "🌍", label: "Countries Available", value: "5" },
  { emoji: "📚", label: "Courses Tracked",     value: "2,860+" },
  { emoji: "📊", label: "Last Updated",        value: "May 2026" },
]

const FEATURE_CARDS = [
  {
    emoji: "📈",
    title: "ROI Explorer",
    desc: "Find best ROI by country",
    href: "/roi-explorer",
    accent: "bg-indigo-50 border-indigo-100 hover:border-indigo-300",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
  },
  {
    emoji: "🌐",
    title: "Country Compare",
    desc: "Side-by-side comparison",
    href: "/compare",
    accent: "bg-sky-50 border-sky-100 hover:border-sky-300",
    iconBg: "bg-sky-100",
    iconText: "text-sky-600",
  },
  {
    emoji: "✅",
    title: "Checklist",
    desc: "Track your application",
    href: "/checklist",
    accent: "bg-emerald-50 border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
  {
    emoji: "📅",
    title: "Timeline",
    desc: "Plan your journey",
    href: "/timeline",
    accent: "bg-amber-50 border-amber-100 hover:border-amber-300",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
]

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const greeting = getGreeting()

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

      {/* ── 헤더 ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting} 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Here&apos;s your study abroad overview
        </p>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
          >
            <span className="text-2xl leading-none">{s.emoji}</span>
            <div>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Jump back in ── */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Jump back in
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group flex flex-col gap-3 border rounded-2xl p-5 transition-all duration-200 hover:scale-105 hover:shadow-md ${card.accent}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${card.iconBg}`}>
                {card.emoji}
              </div>
              <div>
                <p className={`text-sm font-semibold text-slate-800 mb-0.5`}>
                  {card.title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Featured Insight ── */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <p className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
          💡 Did you know?
        </p>
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          Irish CS graduates earn €45k on average.
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          Regional universities offer 2× better ROI than Dublin universities
          — backed by HEA graduate outcome data.
        </p>
        <Link
          href="/roi-explorer?country=ie"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Explore Ireland ROI
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  )
}
