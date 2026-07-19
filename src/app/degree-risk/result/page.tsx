import Link from "next/link"
import { ArrowRight, Info, Search } from "lucide-react"
import { ResultHeader } from "@/components/degree-risk/result-header"
import { createClient } from "@/lib/supabase-server"
import { pageMetadata } from "@/lib/seo"
import {
  type MajorRow,
  type ResultView,
  OTHER_MAJOR,
  goalToLayers,
  isKnownGoal,
  isMajorSlug,
  majorLabel,
  normalizeView,
  viewCountries,
} from "@/lib/degree-risk"
import { ResultCard } from "./result-card"
import { WhereToStudy } from "./where-to-study"
import { VisaAlertForm } from "@/components/visa-alert-form"
import { getTranslations } from "@/lib/i18n/server"
import { fetchPrPathways } from "@/lib/pr-pathways"

export const metadata = {
  ...pageMetadata({
    title: "Your Degree Risk Result",
    description:
      "Your major scored on employment potential, visa pathway, market demand, AI exposure, and study ROI.",
    path: "/degree-risk/result",
  }),
  robots: { index: false, follow: true },
}

type ResultStrings = Awaited<ReturnType<typeof getTranslations>>["degreeRisk"]["result"]

// "Better-fit alternatives" chips. `dense` packs them for the half-width bottom
// column (single view); the default spreads them full-width (compare view).
function AlternativesPanel({
  alternatives,
  hrefFor,
  nameFor,
  rr,
  dense = false,
}: {
  alternatives: string[]
  hrefFor: (slug: string) => string
  nameFor: (slug: string) => string
  rr: ResultStrings
  dense?: boolean
}) {
  return (
    <section className={dense ? "h-full" : "mt-10"}>
      <h2 className="text-base font-semibold text-slate-900 mb-1">{rr.alternativesTitle}</h2>
      <p className="text-xs text-slate-500 mb-4">{rr.alternativesSubtitle}</p>
      <div
        className={
          dense
            ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        }
      >
        {alternatives.map((slug) => (
          <Link
            key={slug}
            href={hrefFor(slug)}
            className="group bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-sm font-medium text-slate-800">{nameFor(slug)}</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default async function DegreeRiskResultPage(
  props: {
    searchParams: Promise<{ major?: string; view?: string; aid?: string; goal?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const major = searchParams.major ?? ""
  const view: ResultView = normalizeView(searchParams.view)
  const assessmentId = searchParams.aid ?? null
  const goal = isKnownGoal(searchParams.goal) ? searchParams.goal! : null
  const priorityLayers = goalToLayers(goal ?? undefined)

  const t = await getTranslations()
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  const rr = t.degreeRisk.result
  const opts = t.degreeRisk.options as Record<string, string>
  const majorName = (slug: string) => opts[slug] ?? majorLabel(slug)
  const goalLabel = goal ? opts[goal] ?? goal : null

  const lookedUpCountries = viewCountries(view)
  const isOther = major === OTHER_MAJOR

  let rows: MajorRow[] = []
  if (isMajorSlug(major)) {
    const supabase = await createClient()
    // select("*") (not MAJOR_COLUMNS) so layer_meta is picked up after its
    // migration, while staying resilient if the column doesn't exist yet.
    const { data, error } = await supabase
      .from("majors")
      .select("*")
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

  // Verified PR pathways (country_pr_pathways) for the timeline PR stage.
  const prMap = rows.length > 0 ? await fetchPrPathways() : {}

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
    <div className="min-h-dvh bg-background">
      <ResultHeader startOverLabel={rr.startOver} />
      <main className="max-w-5xl mx-auto px-6 py-3 md:py-10">
        {isOther ? (
          <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <Search className="w-8 h-8 mx-auto text-blue-500" />
            <p className="mt-4 text-slate-700 text-sm leading-relaxed">
              {rr.otherText}
            </p>
            <Link
              href="/roi-explorer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors"
            >
              {rr.otherCta} <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-xs text-slate-400">
              {rr.otherOr}{" "}
              <Link href="/degree-risk" className="underline underline-offset-2 hover:text-slate-600">
                {rr.otherPick}
              </Link>
              .
            </p>
          </div>
          <div className="mt-6">
            <VisaAlertForm country={view} field={null} />
          </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-600 text-sm">
              {view === "all"
                ? rr.noScoreAll.replace("{major}", majorName(major))
                : rr.noScoreCountry
                    .replace("{major}", majorName(major))
                    .replace("{country}", rr.countries[view])}
            </p>
            <Link
              href="/degree-risk"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {rr.tryAnother} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6">
            <VisaAlertForm country={view} field={major || null} />
          </div>
          </div>
        ) : (
          <>
            <h1 className="font-display text-question text-slate-900">
              {rr.h1.replace("{major}", majorName(major))}
            </h1>

            {view === "all" && (
              <p className="mt-3 inline-flex items-start gap-2 text-xs text-slate-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <Info className="w-3.5 h-3.5 mt-px shrink-0 text-blue-500" />
                {rr.allBanner.replace("{major}", majorName(major)).replace("{n}", String(rows.length))}
              </p>
            )}

            {goal && priorityLayers.length > 0 && goalLabel && (
              <p className="mt-3 text-xs text-slate-500">
                {(() => {
                  const [before, after] = rr.goalNote.split("{goal}")
                  return (
                    <>
                      {before}
                      <span className="font-semibold text-blue-600">{goalLabel}</span>
                      {after}
                    </>
                  )
                })()}
              </p>
            )}

            {assessmentId && (
              <section className="mt-5 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-semibold">{user ? "This result is saved to your private Planner." : "Keep this result in your private Planner."}</p><p className="mt-1 leading-6 text-blue-900">{user ? "Open Planner whenever you want to continue from this decision." : "Sign in and we will attach this completed check to your Planner."}</p></div>
                <Link href={user ? "/planner" : "/login?next=/planner"} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700">{user ? "Open Planner" : "Sign in to save"}<ArrowRight className="h-4 w-4" /></Link>
              </section>
            )}

            {rows.length === 1 ? (
              // Single-country: one wide card (2-col layers), then a bottom row
              // that drives the next step — ROI school preview beside alternatives.
              (<>
                <div className="mt-6">
                  <ResultCard
                    row={rows[0]}
                    pr={prMap[rows[0].country] ?? null}
                    priorityLayers={priorityLayers}
                    layout="grid"
                  />
                </div>
                {alternatives.length > 0 ? (
                  <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <WhereToStudy major={major} view={view} embedded />
                    <AlternativesPanel
                      alternatives={alternatives}
                      hrefFor={altHref}
                      nameFor={majorName}
                      rr={rr}
                      dense
                    />
                  </div>
                ) : (
                  <div className="mt-10">
                    <WhereToStudy major={major} view={view} embedded />
                  </div>
                )}
              </>)
            ) : (
              // Compare ("all") view: grid of country cards, then full-width
              // where-to-study links and alternatives.
              (<>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rows.map((row) => (
                    <ResultCard key={row.country} row={row} pr={prMap[row.country] ?? null} priorityLayers={priorityLayers} />
                  ))}
                </div>
                <WhereToStudy major={major} view={view} />
                {alternatives.length > 0 && (
                  <AlternativesPanel
                    alternatives={alternatives}
                    hrefFor={altHref}
                    nameFor={majorName}
                    rr={rr}
                  />
                )}
              </>)
            )}

            <section className="mt-10">
              <VisaAlertForm country={view} field={major} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
