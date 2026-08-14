"use client"

import Link from "next/link"
import { ArrowRight, BookmarkCheck } from "lucide-react"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { getCareerRoute } from "@/lib/workspace/occupation-routes"

export type SavedCareerResultSummary = {
  country_code: string
  career_id: string
  created_at: string
}

export function SavedCareerResultsSection({ rows }: { rows: SavedCareerResultSummary[] }) {
  const locale = useRouteLocale()
  if (rows.length === 0) return null

  return (
    <section className="mx-auto mt-4 w-full max-w-6xl rounded-2xl border border-[#dce5f3] bg-white px-5 py-5 sm:px-6" aria-labelledby="saved-career-results-heading">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
          <BookmarkCheck className="size-[18px]" />
        </span>
        <div>
          <p className="text-[10px] font-bold tracking-[0.1em] text-emerald-700">
            {locale === "ko" ? "저장한 경로" : "SAVED PATHS"}
          </p>
          <h2 id="saved-career-results-heading" className="mt-0.5 text-lg font-semibold tracking-[-0.035em] text-slate-950">
            {locale === "ko" ? "다시 확인할 커리어 경로" : "Career paths to revisit"}
          </h2>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => {
          const country = LAUNCH_COUNTRIES.find((item) => item.code === row.country_code.toUpperCase())
          const career = CANONICAL_CAREER_BY_ID.get(row.career_id)
          const route = getCareerRoute(row.country_code, row.career_id)
          const countryName = country
            ? locale === "ko"
              ? new Intl.DisplayNames("ko-KR", { type: "region" }).of(country.code === "UK" ? "GB" : country.code) ?? country.name
              : country.name
            : row.country_code
          const careerName = career ? (locale === "ko" ? career.labelKo : career.label) : row.career_id
          const href = route
            ? `${localizePath(route.path, locale)}?personalised=1`
            : localizePath("/", locale)

          return (
            <Link key={`${row.country_code}:${row.career_id}`} href={href} className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-[#e1e7ef] bg-[#fbfcff] px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{careerName}</p>
                <p className="mt-0.5 text-xs text-slate-500">{countryName}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
