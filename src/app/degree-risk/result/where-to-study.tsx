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

function CountryColleges({
  country,
  field,
  colleges,
}: {
  country: CountryCode
  field: string
  colleges: College[]
}) {
  const meta = COUNTRY_META[country]
  if (colleges.length === 0) return null

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-slate-900">
          {meta.flag} {meta.name}
        </h3>
        <Link
          href={explorerHref(country, field)}
          className="text-xs text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 shrink-0"
        >
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
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
                  <span className="text-slate-400 hidden sm:inline">{c.payback_years} yr payback</span>
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
    </div>
  )
}

export async function WhereToStudy({ major, view }: { major: string; view: ResultView }) {
  const field = MAJOR_ROI_FIELD[major]
  if (!field) return null

  // For a single-country view, show its top universities. For the "all" view,
  // querying 5 countries × ROI would be heavy and noisy — show a link card.
  if (view === "all") {
    return (
      <section className="mt-10">
        <h2 className="text-base font-semibold text-slate-900 mb-1">
          Where to study {majorLabel(major)}
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Compare universities by salary, tuition, and ROI in each country.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {viewCountries(view).map((c) => (
            <Link
              key={c}
              href={explorerHref(c, field)}
              className="group bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center justify-between hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-medium text-slate-800">
                {COUNTRY_META[c].flag} {c}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    )
  }

  const countries = viewCountries(view)
  const results = await Promise.all(countries.map((c) => topColleges(c, field)))
  const blocks = countries
    .map((c, i) => ({ country: c, colleges: results[i] }))
    .filter((b) => b.colleges.length > 0)

  if (blocks.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-indigo-500" />
        Where to study {majorLabel(major)}
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Top universities for this major by ROI — real salary and tuition data.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {blocks.map((b) => (
          <CountryColleges key={b.country} country={b.country} field={field} colleges={b.colleges} />
        ))}
      </div>
    </section>
  )
}
