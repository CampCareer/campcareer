import Link from "next/link"
import {
  ArrowRight,
  Gamepad2,
  GraduationCap,
  Globe2,
  FileCheck2,
  MapPin,
  CalendarDays,
} from "lucide-react"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Games — Learn Study Abroad the Fun Way",
  description: "Interactive games and quizzes about studying abroad: major match, visa knowledge, and city exploration.",
  path: "/games",
})

const previewGames = [
  {
    title: "Major Match Quiz",
    description: "Discover study fields that fit your interests, strengths, and career goals.",
    icon: GraduationCap,
    status: "Coming soon",
  },
  {
    title: "Country Fit Challenge",
    description: "Compare lifestyle, cost, work options, and long-term pathways across study destinations.",
    icon: Globe2,
    status: "Coming soon",
  },
  {
    title: "Visa & Document Sprint",
    description: "Practice the key documents and steps you need before applying abroad.",
    icon: FileCheck2,
    status: "Coming soon",
  },
]

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            <Gamepad2 className="h-4 w-4" />
            CampCareer Games
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Career games are coming soon
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                We&apos;re building quizzes and mini-games to help students explore majors,
                countries, scholarships, visas, and career paths.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">Available now</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Try our first mini-game while we build the full career game library.
                  </p>
                  <Link
                    href="/games/vacant-dublin"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Play Vacant Dublin
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">What we&apos;re building</h2>
              <p className="mt-1 text-sm text-slate-500">
                Interactive tools to make study-abroad planning less confusing.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {previewGames.map((game) => {
              const Icon = game.icon

              return (
                <article
                  key={game.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      {game.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{game.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{game.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Link
            href="/roi-explorer"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="mb-4 rounded-xl bg-indigo-50 p-3 text-indigo-600 w-fit">
              <ArrowRight className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-950">Compare universities first</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use ROI Explorer to compare tuition, salary, ROI score, and payback period.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
              Open ROI Explorer
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/timeline"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="mb-4 rounded-xl bg-indigo-50 p-3 text-indigo-600 w-fit">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-950">Plan your next deadline</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Build a study-abroad timeline around your target intake and destination.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
              Open Timeline Planner
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </section>
      </section>
    </main>
  )
}
