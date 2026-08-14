"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.1em] text-brand">CAMPCAREER</p>
            <h1 className="mt-4 text-[42px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
              {locale === "ko" ? (
                <>이 커리어가 가치 있는지 알고,<br />정확히 어떻게 가는지 보세요.</>
              ) : (
                <>Know if a career is worth it.<br />See exactly how to get there.</>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[hsl(var(--cc-muted))] sm:text-lg">
              {locale === "ko"
                ? "직업과 국가를 선택하면 CampCareer Score, 판단 근거, 그리고 실제 진입 경로를 바로 보여드립니다. 로그인은 필요하지 않습니다."
                : "Choose a career and country to see the CampCareer Score, the evidence behind it, and the path to enter. No account required."}
            </p>
          </div>

          <div className="mt-10 rounded-xl border border-[hsl(var(--cc-border))] bg-white p-5 sm:p-7">
            <div className="mb-5">
              <p className="text-base font-semibold tracking-[-0.02em] text-[hsl(var(--cc-ink))]">
                {locale === "ko" ? "어떤 커리어를 평가할까요?" : "Which career should we evaluate?"}
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--cc-muted))]">
                {locale === "ko" ? "직업과 국가를 고르면 바로 Career Page로 이동합니다." : "Choose a career and country to go straight to the Career Page."}
              </p>
            </div>
            <HomeSearchForm values={values} locale={locale} onValuesChange={setValues} onSubmit={submit} />
          </div>

          <div className="mt-12 grid border-t border-[hsl(var(--cc-border))] pt-8 sm:grid-cols-3 sm:gap-8">
            <HomePrinciple
              index="01"
              title="Score"
              body={locale === "ko" ? "먼저 커리어의 시장 매력도를 판단합니다." : "Start with a clear judgment of career attractiveness."}
            />
            <HomePrinciple
              index="02"
              title="Evidence"
              body={locale === "ko" ? "Demand, Pay, Entry의 근거를 투명하게 보여줍니다." : "See the evidence behind Demand, Pay and Entry."}
            />
            <HomePrinciple
              index="03"
              title="Path"
              body={locale === "ko" ? "Study, Programs, Jobs로 이어지는 실제 다음 단계를 봅니다." : "Move into the real next steps through Study, Programs and Jobs."}
            />
          </div>

          {result ? <div className="mt-10 h-32 animate-pulse rounded-xl bg-white" aria-label="Career Page로 이동 중" /> : null}
        </div>
      </section>
    </div>
  )
}

function HomePrinciple({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="border-b border-[hsl(var(--cc-border))] py-5 last:border-b-0 sm:border-b-0 sm:py-0">
      <p className="text-xs font-semibold text-[hsl(var(--cc-muted))]">{index}</p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.025em] text-[hsl(var(--cc-ink))]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{body}</p>
    </div>
  )
}
