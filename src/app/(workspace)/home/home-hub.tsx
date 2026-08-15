"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, ShieldCheck } from "lucide-react"
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

  const copy = locale === "ko"
    ? {
        eyebrow: "근거로 판단하는 커리어",
        title: "이 커리어가 정말 가치 있는지 먼저 확인하세요.",
        description: "수요, 상대 보수, 진입 난이도를 하나의 CampCareer Score로 확인하고 근거부터 학업, 프로그램, 일자리 경로까지 이어서 보세요.",
        scoreRule: "CampCareer Score / 100",
        demand: "Demand 40%",
        pay: "Pay 30%",
        entry: "Entry 30%",
        evidenceRule: "필수 근거가 부족하면 점수를 만들지 않습니다.",
        examples: "호주 커리어 예시",
        examplesDescription: "점수만 보여주지 않습니다. 각 Career Page에서 Demand, Pay, Entry 근거와 실제 진입 경로를 확인할 수 있습니다.",
      }
    : {
        eyebrow: "CAREER DECISIONS, BACKED BY EVIDENCE",
        title: "Know if a career is worth it before you commit.",
        description: "See Demand, relative Pay and Entry in one CampCareer Score, then follow the evidence into study, programs and jobs.",
        scoreRule: "CampCareer Score / 100",
        demand: "Demand 40%",
        pay: "Pay 30%",
        entry: "Entry 30%",
        evidenceRule: "If the required evidence is not ready, we do not invent a score.",
        examples: "Explore careers in Australia",
        examplesDescription: "Start with the verdict, then inspect the evidence and the path behind it.",
      }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-[hsl(var(--cc-ink))]">
      <section className="px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-brand sm:text-xs">{copy.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-[42px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
              {copy.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-[17px]">
              {copy.description}
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-4xl">
            <HomeSearchForm
              values={values}
              locale={locale}
              onValuesChange={setValues}
              onSubmit={submit}
              integrated
              submitLabel={locale === "ko" ? "검색" : "Search"}
            />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-semibold text-[hsl(var(--cc-muted))] sm:text-xs">
              <span>{copy.scoreRule}</span>
              <span className="hidden text-[hsl(var(--cc-border))] sm:inline">•</span>
              <span>{copy.demand}</span>
              <span className="text-[hsl(var(--cc-border))]">•</span>
              <span>{copy.pay}</span>
              <span className="text-[hsl(var(--cc-border))]">•</span>
              <span>{copy.entry}</span>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] leading-5 text-[hsl(var(--cc-muted))]">
              <ShieldCheck className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
              {copy.evidenceRule}
            </p>
          </div>

          <section className="mt-16 border-t border-[hsl(var(--cc-border))] pt-10 sm:mt-20 sm:pt-12" aria-labelledby="career-previews-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">CampCareer Score</p>
                <h2 id="career-previews-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[hsl(var(--cc-ink))] sm:text-2xl">
                  {copy.examples}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[hsl(var(--cc-muted))] sm:text-right">
                {copy.examplesDescription}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                      <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--cc-muted))]">Score / 100</div>
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

          {result ? <div className="mt-10 h-32 animate-pulse rounded-xl border border-[hsl(var(--cc-border))] bg-white" aria-label="Career Page로 이동 중" /> : null}
        </div>
      </section>
    </div>
  )
}
