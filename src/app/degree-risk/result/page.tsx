import Link from "next/link"
import { ArrowRight, Info } from "lucide-react"
import { LogoMark } from "@/components/logo-mark"
import { createClient } from "@/lib/supabase-server"
import { pageMetadata } from "@/lib/seo"
import {
  type MajorRow,
  type ResultView,
  MAJOR_COLUMNS,
  isMajorSlug,
  isResultView,
  majorLabel,
  viewCountries,
} from "@/lib/degree-risk"
import { ResultCard } from "./result-card"
import { LeadCapture } from "./lead-capture"

export const metadata = pageMetadata({
  title: "Your Degree Risk Result",
  description:
    "Your major scored on employment potential, visa pathway, market demand, AI exposure, and study ROI.",
  path: "/degree-risk/result",
})

export default async function DegreeRiskResultPage({
  searchParams,
}: {
  searchParams: { major?: string; view?: string; aid?: string }
}) {
  const major = searchParams.major ?? ""
  const view: ResultView = isResultView(searchParams.view) ? searchParams.view : "both"
  const assessmentId = searchParams.aid ?? null

  const lookedUpCountries = viewCountries(view)

  let rows: MajorRow[] = []
  if (isMajorSlug(major)) {
    const supabase = createClient()
    const { data } = await supabase
      .from("majors")
      .select(MAJOR_COLUMNS)
      .eq("slug", major)
      .in("country", lookedUpCountries)
      .order("country", { ascending: true }) // AU before IE
    rows = (data ?? []) as unknown as MajorRow[]
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
        {rows.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-600 text-sm">
              We could not find a score for{" "}
              <span className="font-semibold">{major ? majorLabel(major) : "this major"}</span>
              {view === "both"
                ? " in Australia or Ireland yet."
                : ` in ${view === "AU" ? "Australia" : "Ireland"} yet.`}
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

            {view === "both" && (
              <p className="mt-3 inline-flex items-start gap-2 text-xs text-slate-600 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                <Info className="w-3.5 h-3.5 mt-px shrink-0 text-indigo-500" />
                We currently score Australia and Ireland — here is {majorLabel(major)} in
                both, side by side.
              </p>
            )}

            <div
              className={
                rows.length > 1
                  ? "mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "mt-6 max-w-2xl"
              }
            >
              {rows.map((row) => (
                <ResultCard key={row.country} row={row} />
              ))}
            </div>

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
