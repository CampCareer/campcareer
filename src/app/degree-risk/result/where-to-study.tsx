import Link from "next/link"
import { ArrowRight, GraduationCap } from "lucide-react"
import { fetchRoiData } from "@/lib/roi-query"
import {
  type CountryCode,
  type ResultView,
  COUNTRY_META,
  MAJOR_ROI_FIELD,
  majorLabel,
  toRoiCountry,
  viewCountries,
} from "@/lib/degree-risk"
import { getTranslations } from "@/lib/i18n/server"

type ResultStrings = Awaited<ReturnType<typeof getTranslations>>["degreeRisk"]["result"]

type College = {
  college_id: string | null
  college_name: string
  roi_score: number | null
  net_salary: number | null
  payback_years: number | null
}

async function topColleges(country: CountryCode, field: string): Promise<College[]> {
  try {
    const res = await fetchRoiData({
      country: toRoiCountry(country),
      field,
      state: "ALL_STATES",
      sort: "roi_score",
      limit: 5,
    })
    return (res.data ?? []).slice(0, 5).map((r) => ({
      college_id: r.college_id ?? null,
      college_name: r.college_name ?? "—",
      roi_score: r.roi_score ?? null,
      net_salary: r.net_salary ?? null,
      payback_years: r.payback_years ?? null,
    }))
  } catch (err) {
    // A matview hiccup must never break the risk result.
    console.error("[where-to-study] fetch failed:", err)
    return []
  }
}

function explorerHref(country: CountryCode, field: string): string {
  const params = new URLSearchParams({
    country: toRoiCountry(country),
    field,
    state: "ALL_STATES",
  })
  return `/roi-explorer?${params.toString()}`
}

// Graceful fallback for combinations with no ROI-ranked schools yet: keep the
// "what's next" CTA visible instead of rendering nothing.
function ComingSoon({ rr, href }: { rr: ResultStrings; href: string }) {
  return (
    <div className="flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-sm font-semibold text-slate-700">{rr.whereEmptyTitle}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{rr.whereEmptyText}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        {rr.whereExploreAllCta} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export async function WhereToStudy({
  major,
  view,
  embedded = false,
}: {
  major: string
  view: ResultView
  embedded?: boolean
}) {
  const t = await getTranslations()
  const rr = t.degreeRisk.result
  const opts = t.degreeRisk.options as Record<string, string>
  const majorName = opts[major] ?? majorLabel(major)

  const field = MAJOR_ROI_FIELD[major]

  // ── Compare ("all") view: querying 5 countries × ROI would be heavy and
  // noisy — show a per-country link card. (Never embedded.)
  if (view === "all") {
    if (!field) return null
    return (
      <section className="mt-10">
        <h2 className="text-base font-semibold text-slate-900 mb-1">
          {rr.whereTitle.replace("{major}", majorName)}
        </h2>
        <p className="text-xs text-slate-500 mb-4">{rr.whereAllSubtitle}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {viewCountries(view).map((c) => (
            <Link
              key={c}
              href={explorerHref(c, field)}
              className="group bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-medium text-slate-800">
                {COUNTRY_META[c].flag} {rr.countries[c]}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    )
  }

  // ── Single-country view: ROI preview that nudges to the ROI Explorer.
  const country = viewCountries(view)[0]
  const wrapCls = embedded ? "flex h-full flex-col" : "mt-10"

  const heading = (
    <>
      <h2 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-blue-500" />
        {rr.whereTitle.replace("{major}", majorName)}
      </h2>
      <p className="text-xs text-slate-500 mb-4">{rr.whereSubtitle}</p>
    </>
  )

  if (!field) {
    if (!embedded) return null
    return (
      <section className={wrapCls}>
        {heading}
        <ComingSoon rr={rr} href="/roi-explorer" />
      </section>
    )
  }

  const colleges = await topColleges(country, field)

  if (colleges.length === 0) {
    if (!embedded) return null
    return (
      <section className={wrapCls}>
        {heading}
        <ComingSoon rr={rr} href={explorerHref(country, field)} />
      </section>
    )
  }

  return (
    <section className={wrapCls}>
      {heading}
      <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-5">
        <ul className="divide-y divide-slate-100">
          {colleges.map((c, i) => {
            const inner = (
              <div className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-sm text-slate-700 truncate">{c.college_name}</span>
                <span className="flex items-center gap-3 shrink-0 text-xs">
                  {c.roi_score != null && (
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold text-emerald-700 bg-emerald-50">
                      ROI {c.roi_score.toFixed(1)}
                    </span>
                  )}
                  {c.payback_years != null && (
                    <span className="text-slate-400 hidden sm:inline">
                      {rr.paybackYr.replace("{n}", String(c.payback_years))}
                    </span>
                  )}
                </span>
              </div>
            )
            return (
              <li key={c.college_id ?? `${c.college_name}-${i}`}>
                {c.college_id ? (
                  <Link
                    href={`/roi-explorer/${toRoiCountry(country)}/${c.college_id}`}
                    className="block hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            )
          })}
        </ul>
        <Link
          href={explorerHref(country, field)}
          className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          {rr.whereExploreAllCta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
