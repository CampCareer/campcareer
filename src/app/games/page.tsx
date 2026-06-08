import Link from "next/link"
import {
  Brain,
  Globe2,
  FileCheck2,
  Gamepad2,
  TrendingUp,
  CalendarDays,
  Lock,
  ArrowRight,
} from "lucide-react"

const PREVIEW_GAMES = [
  {
    icon: Brain,
    title: "Major Match Quiz",
    desc: "Answer a few questions about your interests and strengths — we'll suggest the best-fit fields of study across 5 countries.",
    badge: "Coming soon",
    color: "indigo",
  },
  {
    icon: Globe2,
    title: "Country Fit Challenge",
    desc: "Swipe through scenarios about lifestyle, salary, visa difficulty, and cost of living to find your ideal study destination.",
    badge: "Coming soon",
    color: "violet",
  },
  {
    icon: FileCheck2,
    title: "Visa & Document Sprint",
    desc: "Race against the clock to gather the right documents for your visa application. A timed quiz to test your knowledge.",
    badge: "Coming soon",
    color: "sky",
  },
]

const COLOR_CLASSES: Record<string, { bg: string; icon: string; border: string; badge: string }> = {
  indigo: {
    bg: "bg-indigo-50 group-hover:bg-indigo-100",
    icon: "text-indigo-600",
    border: "hover:border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
  },
  violet: {
    bg: "bg-violet-50 group-hover:bg-violet-100",
    icon: "text-violet-600",
    border: "hover:border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
  sky: {
    bg: "bg-sky-50 group-hover:bg-sky-100",
    icon: "text-sky-600",
    border: "hover:border-sky-200",
    badge: "bg-sky-100 text-sky-700",
  },
}

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs px-3.5 py-1.5 rounded-full mb-6">
          <Gamepad2 className="w-3.5 h-3.5" />
          Career Games
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Career games are coming soon
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          We&apos;re building quizzes and mini-games to help students explore majors, countries,
          scholarships, visas, and career paths.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-14">

        {/* Preview cards */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">What&apos;s being built</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PREVIEW_GAMES.map((game) => {
              const c = COLOR_CLASSES[game.color]
              return (
                <div
                  key={game.title}
                  className={`group bg-white border border-slate-200 ${c.border} rounded-2xl p-6 transition-all hover:shadow-md`}
                >
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4 transition-colors`}>
                    <game.icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{game.title}</h3>
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{game.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                    <Lock className="w-3 h-3" />
                    In development
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Play now — Vacant Dublin */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Available now</h2>
          <Link
            href="/games/vacant-dublin"
            className="group flex items-center justify-between bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-2xl transition-colors shrink-0">
                🏙️
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-lg">Vacant Dublin</p>
                <p className="text-sm text-slate-500 leading-relaxed mt-0.5">
                  An interactive city-exploration experience. Find hidden opportunities and career
                  stories across Dublin.
                </p>
                <span className="inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Play now
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 shrink-0 ml-4 transition-colors" />
          </Link>
        </section>

        {/* CTAs */}
        <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            While you wait, explore the full toolkit
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Plan your study-abroad path with ROI data, a visa checklist, and a timeline planner.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/roi-explorer"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              ROI Explorer
            </Link>
            <Link
              href="/timeline"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <CalendarDays className="w-4 h-4" />
              Timeline Planner
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
