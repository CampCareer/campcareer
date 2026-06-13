import Link from "next/link"
import { ArrowRight, Info, Search } from "lucide-react"
import { LogoMark } from "@/components/logo-mark"
import { createClient } from "@/lib/supabase-server"
import { pageMetadata } from "@/lib/seo"
import {
  type MajorRow,
  type ResultView,
  COUNTRY_META,
  MAJOR_COLUMNS,
  OTHER_MAJOR,
  goalToLayers,
  isKnownGoal,
  isMajorSlug,
  majorLabel,
  normalizeView,
  viewCountries,
} from "@/lib/degree-risk"
import { ResultCard } from "./result-card"
import { LeadCapture } from "./lead-capture"
import { WhereToStudy } from "./where-to-study"

export const metadata = {
  ...pageMetadata({
    title: "Your Degree Risk Result",
    description:
      "Your major scored on employment potential, visa pathway, market demand, AI exposure, and study ROI.",
    path: "/degree-risk/result",
  }),
  robots: { index: false, follow: true },
}

export default async function DegreeRiskResultPage({
  searchParams,
}: {
  searchParams: { major?: string; view?: string; aid?: string; goal?: string }
}) {
  const major = searchParams.major ?? ""
  const view: ResultView = normalizeView(searchParams.view)
  const assessmentId = searchParams.aid ?? null
  const goal = isKnownGoal(searchParams.goal) ? searchParams.goal! : null
  const priorityLayers = goalToLayers(goal ?? undefined)

  const lookedUpCountries = viewCountries(view)
  const isOther = major === OTHER_MAJOR

  let rows: MajorRow[] = []
  if (isMajorSlug(major)) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("majors")
      .select(MAJOR_COLUMNS)
      .eq("slug", major)
      .in("country", lookedUpCountries)
    if (error) console.error("[degree-risk] majors query failed:", error.message)
    rows = (data ?? []) as unknown as MajorRow[]
    // Keep the canonical display order (US, CA, UK, AU, IE)
    rows.sort(
      (a, b) => lookedUpCountries.indexOf(a.country) - lookedUpCountries.indexOf(b.country)
    )
    if (rows.length === 0) {
      console.warn(`[degree-risk] No majors row found for slug="${major}" countries="${lookedUpCountries.join(",")}"`)
    }
  }

  // Alternatives: union across the shown rows, excluding the current major.
  const alternatives = Array.from(
    new Set(rows.flatMap((r) => r.alternatives ?? []))
  ).filter((slug) => slug !== major && isMajorSlug(slug))

  const altHref = (slug: string) => {
    const params = new URLSearchParams({ major: slug, view })
    if (assessmentId) params.set("aid", assessmentId)
    if (goal) params.set("goal", goal)
    return `/degree-risk/result?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="font-semibold text-slate-900 text-sm tracking-tight">CampCareer</span>
          </Link>
          <Link href="/degree-risk" className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors">
            Start over
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {isOther ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <Search className="w-8 h-8 mx-auto text-indigo-500" />
            <p className="mt-4 text-slate-700 text-sm leading-relaxed">
              We don&apos;t have a risk score for your major yet — but you can still compare
              real salary, tuition, and payback data for it across 11,000+ courses.
            </p>
            <Link
              href="/roi-explorer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl transition-colors"
            >
              Search your field in the ROI Explorer <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-xs text-slate-400">
              Or{" "}
              <Link href="/degree-risk" className="underline underline-offset-2 hover:text-slate-600">
                pick a nearby major we do score
              </Link>
              .
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-600 text-sm">
              We could not find a score for{" "}
              <span className="font-semibold">{major ? majorLabel(major) : "this major"}</span>
              {view === "all"
                ? " in the countries we score yet."
                : ` in ${COUNTRY_META[view].name} yet.`}
            </p>
            <Link
              href="/degree-risk"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Try another major <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {majorLabel(major)} — your degree risk
            </h1>

            {view === "all" && (
              <p className="mt-3 inline-flex items-start gap-2 text-xs text-slate-600 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                <Info className="w-3.5 h-3.5 mt-px shrink-0 text-indigo-500" />
                Here is {majorLabel(major)} across all {rows.length} countries we score, side
                by side.
              </p>
            )}

            {goal && priorityLayers.length > 0 && (
              <p className="mt-3 text-xs text-slate-500">
                Because you chose <span className="font-semibold text-indigo-600">{goal}</span>,
                the layers that matter most to you are highlighted.
              </p>
            )}

            <div
              className={
                rows.length > 2
                  ? "mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : rows.length > 1
                    ? "mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "mt-6 max-w-2xl"
              }
            >
              {rows.map((row) => (
                <ResultCard key={row.country} row={row} priorityLayers={priorityLayers} />
              ))}
            </div>

            <WhereToStudy major={major} view={view} />

            {alternatives.length > 0 && (
              <section className="mt-10">
                <h2 className="text-base font-semibold text-slate-900 mb-1">
                  Better-fit alternatives
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Nearby paths that tend to score better on the same five layers — tap one to
                  swap the result.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {alternatives.map((slug) => (
                    <Link
                      key={slug}
                      href={altHref(slug)}
                      className="group bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center justify-between hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {majorLabel(slug)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-10">
              <LeadCapture assessmentId={assessmentId} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
