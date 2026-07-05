"use client"

import Link from "next/link"
import { ArrowRight, BadgeCheck, Globe, Landmark, ShieldCheck, TrendingUp } from "lucide-react"

import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const SHORTAGE_LABEL: Record<number, string> = { 1: "Surplus", 2: "Moderate Surplus", 3: "Balanced", 4: "Moderate Shortage", 5: "Strong Shortage" }
const SHORTAGE_VARIANT: Record<number, "outline" | "secondary" | "default" | "destructive"> = { 1: "outline", 2: "secondary", 3: "outline", 4: "default", 5: "default" }

function SnapshotCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <div className="text-lg font-semibold tracking-tight">{value}</div>
        {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
      </CardContent>
    </Card>
  )
}

export default function CAOccupationDetailPage({
  occ,
  provinceRows,
}: {
  occ: {
    occupation_en: string
    noc_code: string
    median_salary_cad: number | null
    low_wage_cad: number | null
    high_wage_cad: number | null
    shortage_rating: number | null
    on_teer_eligible: boolean | null
    related_broad_field: string | null
    confidence: string | null
    data_source: string | null
    last_verified: string | null
    cops_future_outlook: string | null
    cops_recent_outlook: string | null
    projected_job_openings: number | null
    projected_job_seekers: number | null
    employment_growth: number | null
  }
  provinceRows: Array<{
    province: string
    median_wage_cad: number | null
    low_wage_cad: number | null
    high_wage_cad: number | null
    shortage_rating: number | null
  }>
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/ca/jobs"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            All Canadian Jobs
          </Link>

          <header className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Globe className="size-3" />
                CA
              </Badge>
              <Badge variant="secondary">NOC {occ.noc_code}</Badge>
              {occ.shortage_rating != null && (
                <Badge variant={SHORTAGE_VARIANT[occ.shortage_rating]}>
                  {SHORTAGE_LABEL[occ.shortage_rating]}
                </Badge>
              )}
              {occ.on_teer_eligible && (
                <Badge variant="outline" className="gap-1">
                  <BadgeCheck className="size-3" />
                  TEER
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{occ.occupation_en}</h1>
            <p className="text-sm text-muted-foreground">
              {occ.last_verified ? `Updated ${occ.last_verified}` : ""}
              {occ.data_source ? ` · Source: ${occ.data_source}` : ""}
            </p>
          </header>

          {occ.shortage_rating != null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  National Skills Shortage
                </CardTitle>
                <CardDescription>
                  Based on COPS (Canadian Occupational Projection System) 2024–2033
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{SHORTAGE_LABEL[occ.shortage_rating]}</span>
                  <span className="tabular-nums text-muted-foreground">{occ.shortage_rating}/5</span>
                </div>
                <Progress value={(occ.shortage_rating / 5) * 100} />
                {occ.cops_future_outlook && (
                  <p className="text-xs text-muted-foreground">COPS Outlook: {occ.cops_future_outlook}</p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SnapshotCard
              icon={<Landmark className="size-4" />}
              label="Median Salary"
              value={occ.median_salary_cad != null ? `C$${occ.median_salary_cad.toLocaleString()}` : "—"}
              hint={occ.low_wage_cad != null || occ.high_wage_cad != null
                ? `Low C$${occ.low_wage_cad?.toLocaleString() ?? "—"} · High C$${occ.high_wage_cad?.toLocaleString() ?? "—"}`
                : undefined}
            />
            <SnapshotCard
              icon={<ShieldCheck className="size-4" />}
              label="Work Visa"
              value="PGWP / Express Entry"
              hint={occ.on_teer_eligible ? "TEER eligible occupation" : undefined}
            />
            <SnapshotCard
              icon={<TrendingUp className="size-4" />}
              label="Job Openings (Projected)"
              value={occ.projected_job_openings != null ? occ.projected_job_openings.toLocaleString() : "—"}
              hint={occ.employment_growth != null ? `Employment growth: ${occ.employment_growth.toLocaleString()}` : undefined}
            />
            <SnapshotCard
              icon={<TrendingUp className="size-4" />}
              label="Job Seekers (Projected)"
              value={occ.projected_job_seekers != null ? occ.projected_job_seekers.toLocaleString() : "—"}
            />
          </div>

          <Separator className="my-8" />

          {provinceRows.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Globe className="size-4" />
                Salary &amp; Shortage by Province
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Province</th>
                      <th className="pb-2 font-medium">Median Wage</th>
                      <th className="pb-2 font-medium">Low-High</th>
                      <th className="pb-2 font-medium">Shortage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinceRows.map((pr) => (
                      <tr key={pr.province} className="border-b last:border-0">
                        <td className="py-2 font-medium">{pr.province}</td>
                        <td className="py-2 tabular-nums">
                          {pr.median_wage_cad != null ? `C$${pr.median_wage_cad.toLocaleString()}` : "—"}
                        </td>
                        <td className="py-2 tabular-nums text-muted-foreground">
                          {pr.low_wage_cad != null || pr.high_wage_cad != null
                            ? `C$${pr.low_wage_cad?.toLocaleString() ?? "—"} – C$${pr.high_wage_cad?.toLocaleString() ?? "—"}`
                            : "—"}
                        </td>
                        <td className="py-2">
                          {pr.shortage_rating != null ? (
                            <Badge variant={SHORTAGE_VARIANT[pr.shortage_rating]} className="text-[10px]">
                              {pr.shortage_rating}/5
                            </Badge>
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {occ.related_broad_field && (
            <>
              <Separator className="my-8" />
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-muted-foreground">Related Field</h2>
                <Badge variant="secondary" className="w-fit">{occ.related_broad_field}</Badge>
              </section>
            </>
          )}

          <Separator className="my-8" />

          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="size-4 text-primary" />
                Canada Work &amp; Immigration Pathways
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  PGWP (Post-Graduation Work Permit) — up to 3 years
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  Express Entry category-based draws (STEM, Healthcare, Trades)
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  Provincial Nominee Program (PNP) — varies by province
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="tactile">
                  <Link href="/roi-explorer">
                    Explore ROI
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/roi-explorer">Compare by Major</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-xs text-muted-foreground">
            Source: Statistics Canada · ESDC Job Bank · COPS 2024–2033 · IRCC
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
