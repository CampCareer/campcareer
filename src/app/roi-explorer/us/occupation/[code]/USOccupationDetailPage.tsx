"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink, GraduationCap, TrendingUp, Users, DollarSign, Briefcase, ShieldCheck } from "lucide-react"

import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import JobListings from "@/app/map/JobListings"
import { AffiliateCtas } from "@/components/partners/partner-cta"

export default function USOccupationDetailPage({ occ }: { occ: {
  occ_code: string
  occ_title: string
  median_wage: number
  shortage_score: number
  pct_change: number
  annual_openings: number
  tot_emp: number
  shortageStates: string[]
  highPayStates: string[]
  onetUrl: string
  blsUrl: string
} }) {
  const shortageWidth = Math.max(0, Math.min(100, Math.round(occ.shortage_score)))

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />

      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/roi-explorer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            ROI 탐색으로 돌아가기
          </Link>

          <header className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Briefcase className="size-3" />
                US
              </Badge>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {occ.occ_title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">SOC {occ.occ_code}</Badge>
            </div>
          </header>

          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card size="sm">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="size-3.5" />
                  <span className="text-xs font-medium">평균 연봉</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  ${occ.median_wage.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">전 경력 기준 연봉</div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-3.5" />
                  <span className="text-xs font-medium">고용 규모</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  {occ.tot_emp.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">전국 고용 인원</div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="size-3.5" />
                  <span className="text-xs font-medium">성장률</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  {occ.pct_change > 0 ? "+" : ""}{occ.pct_change}%
                </div>
                <div className="text-xs text-muted-foreground">고용 증가율 (전망)</div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="size-3.5" />
                  <span className="text-xs font-medium">연간 채용</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  {occ.annual_openings.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">연간 신규 일자리</div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-5">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">부족도 지수</span>
                  <span className="font-semibold tabular-nums text-slate-800">
                    {Math.round(occ.shortage_score)}/100
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all"
                    style={{ width: `${shortageWidth}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {occ.shortage_score >= 75
                    ? "높은 부족도 — 해당 직종의 인력 수요가 공급을 크게 초과합니다."
                    : occ.shortage_score >= 50
                    ? "중간 부족도 — 일부 지역에서 인력 부족이 보고되고 있습니다."
                    : "낮은 부족도 — 인력 수급이 비교적 안정적입니다."}
                </p>
              </CardContent>
            </Card>

            {occ.shortageStates.length > 0 && (
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <ShieldCheck className="size-4" />
                    부족 직종으로 보고된 주
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {occ.shortageStates.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {occ.highPayStates.length > 0 && (
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <DollarSign className="size-4" />
                    고소득 직종으로 보고된 주
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {occ.highPayStates.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-5">
                <p className="text-sm font-medium text-slate-700 mb-2">공식 출처</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={occ.onetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    <ExternalLink className="size-3" />
                    O*NET Online
                  </a>
                  <a
                    href={occ.blsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    <ExternalLink className="size-3" />
                    BLS OEWS
                  </a>
                </div>
              </CardContent>
            </Card>

            <JobListings what={occ.occ_title} where="" country="US" />

            <AffiliateCtas />
          </section>

          <p className="mt-6 text-xs text-muted-foreground">
            출처: U.S. Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics (OEWS).
            부족도 지수는 CampCareer가 BLS 데이터를 기반으로 산출한 추정치입니다.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
