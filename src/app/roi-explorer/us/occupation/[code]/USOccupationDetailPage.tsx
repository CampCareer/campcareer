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
            href="/us/jobs"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            All US Jobs
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
                  <span className="text-xs font-medium">Median Salary</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  ${occ.median_wage.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">All experience levels</div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-3.5" />
                  <span className="text-xs font-medium">Total Employment</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  {occ.tot_emp.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">National employment</div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="size-3.5" />
                  <span className="text-xs font-medium">Growth Rate</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  {occ.pct_change > 0 ? "+" : ""}{occ.pct_change}%
                </div>
                <div className="text-xs text-muted-foreground">Projected job growth</div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="size-3.5" />
                  <span className="text-xs font-medium">Annual Openings</span>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  {occ.annual_openings.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">New openings per year</div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-5">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Shortage Index</span>
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
                    ? "High shortage — demand significantly exceeds supply in this occupation."
                    : occ.shortage_score >= 50
                    ? "Moderate shortage — shortages reported in some regions."
                    : "Low shortage — supply and demand relatively balanced."}
                </p>
              </CardContent>
            </Card>

            {occ.shortageStates.length > 0 && (
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <ShieldCheck className="size-4" />
                    States Reporting Shortage
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
                    States Reporting High Pay
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
                <p className="text-sm font-medium text-slate-700 mb-2">Official Sources</p>
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
            Source: U.S. Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics (OEWS).
            Shortage score is an estimate calculated by CampCareer based on BLS data.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
