"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { HomeSearchForm } from "./home-search-form"
import {
  getOverviewSearchQuery,
  readOverviewSearchValues,
  toOverviewSearchQuery,
  type OverviewSearchValues,
} from "./home-overview-config"

type Locale = "en" | "ko"

type PreviewCareer = {
  id: string
  label: Record<Locale, string>
  score: number
  verdict: string
}

const PREVIEW_CAREERS: readonly PreviewCareer[] = [
  {
    id: "registered-nurse",
    label: { en: "Registered Nurse", ko: "간호사" },
    score: 82,
    verdict: "Excellent",
  },
  {
    id: "electrician",
    label: { en: "Electrician", ko: "전기공" },
    score: 78,
    verdict: "Strong",
  },
  {
    id: "midwife",
    label: { en: "Midwife", ko: "조산사" },
    score: 75,
    verdict: "Strong",
  },
  {
    id: "carpenter",
    label: { en: "Carpenter", ko: "목수" },
    score: 68,
    verdict: "Strong",
  },
]

export function HomeHub() {
  const router = useRouter()
  const locale = useRouteLocale()
  const searchParams = useSearchParams()
  const [values, setValues] = useState<OverviewSearchValues>(() => readOverviewSearchValues(searchParams))
  const result = getOverviewSearchQuery(searchParams)

  useEffect(() => setValues(readOverviewSearchValues(searchParams)), [searchParams])

  useEffect(() => {
    if (!result) return
    router.replace(`${localizePath("/career", locale)}?${toOverviewSearchQuery(result).toString()}`)
  }, [locale, result, router])

  const submit = (nextValues: OverviewSearchValues) => {
    router.push(`${localizePath("/career", locale)}?${toOverviewSearchQuery(nextValues).toString()}`)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--cc-canvas))] text-[hsl(var(--cc-ink))]">
      <section className="px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.1em] text-brand">CAMPCAREER</p>
            <h1 className="mt-4 text-[42px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
              Explore. Compare. Find your future.
            </h1>
          </div>

          <div className="mt-9 max-w-4xl">
            <HomeSearchForm
              values={values}
              locale={locale}
              onValuesChange={setValues}
              onSubmit={submit}
              integrated
              submitLabel={locale === "ko" ? "검색" : "Search"}
            />
          </div>

          <section className="mt-14" aria-labelledby="career-previews-heading">
            <div className="flex items-end justify-between gap-4">
              <h2 id="career-previews-heading" className="text-lg font-semibold tracking-[-0.025em] text-[hsl(var(--cc-ink))] sm:text-xl">
                {locale === "ko" ? "호주 커리어 둘러보기" : "Explore careers in Australia"}
              </h2>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PREVIEW_CAREERS.map((career) => (
                <Link
                  key={career.id}
                  href={localizePath(`/career/australia/${career.id}`, locale)}
                  className="group rounded-2xl border border-[hsl(var(--cc-border))] bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_16px_36px_rgba(24,24,27,0.07)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[hsl(var(--cc-muted))]">Australia</p>
                      <h3 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-[hsl(var(--cc-ink))]">
                        {career.label[locale]}
                      </h3>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-3xl font-semibold leading-none tracking-[-0.05em] text-[hsl(var(--cc-ink))]">
                        {career.score}
                      </div>
                      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[hsl(var(--cc-muted))]">Score</div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[hsl(var(--cc-border))] pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[hsl(var(--brand-tint))] px-2.5 py-1 text-xs font-semibold text-brand">
                        {career.verdict}
                      </span>
                      <ArrowRight className="size-4 text-[hsl(var(--cc-muted))] transition group-hover:translate-x-0.5 group-hover:text-brand" />
                    </div>
                    <p className="mt-4 text-xs font-medium text-[hsl(var(--cc-muted))]">Demand · Pay · Entry</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {result ? <div className="mt-10 h-32 animate-pulse rounded-xl bg-white" aria-label="Career Page로 이동 중" /> : null}
        </div>
      </section>
    </div>
  )
}
