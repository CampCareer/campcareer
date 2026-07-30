import type { RouteLocale } from "@/data/route-guides"
import type { RouteGoal } from "@/lib/route-search"
import { RouteRequestForm } from "./route-request-form"
import { RouteSearchRail } from "./route-guide-page"

export function RouteSearchUnavailable({ locale, query, goal }: { locale: RouteLocale; query: string; goal: RouteGoal }) {
  const isKo = locale === "ko"

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-white text-[#1b1b1b]">
      <RouteSearchRail locale={locale} initialQuery={query} initialGoal={goal} />
      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[.13em] text-slate-500">Australia · {goal === "work" ? (isKo ? "취업" : "Work") : goal === "study" ? (isKo ? "학업" : "Study") : (isKo ? "학업 후 취업" : "Study to work")}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-slate-950 sm:text-4xl">{isKo ? "아직 검증된 결과가 없습니다" : "There is no verified result yet"}</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">{isKo ? "가짜 답변을 만들지 않습니다. 이 검색은 다음 공개 경로를 조사할 우선순위로 사용합니다." : "We do not invent answers. This search helps us prioritise the next route to verify."}</p>
        <RouteRequestForm locale={locale} citizenship="KR" destination="AU" field={query} goal={goal} />
      </section>
    </main>
  )
}
