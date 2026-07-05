"use client"

import Link from "next/link"
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  GraduationCap,
  Landmark,
  Map as MapIcon,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ---------------------------------------------------------------------------
// Data contract. These types are the source of truth for the page payload and
// are imported by the server-side data builder (src/lib/occupation-detail.ts)
// and the route (page.tsx). Keep them in sync with getOccupationPageData().
// ---------------------------------------------------------------------------

export type ShortageLevel = "Low" | "Medium" | "High" | "Strong"

export type RegionShortage = {
  region: string
  level: ShortageLevel
  score: number
}

export type Skill = {
  name: string
  importance?: number
  category?: string
}

export type Credential = {
  id: string
  name: string
  type: "License" | "Qualification" | "Certification"
  notes?: string
}

export type JobAd = {
  id: string
  title: string
  employer: string
  location: string
  postedAtISO: string
  salaryText?: string
  url?: string
}

export type OccupationPageData = {
  countryCode: string
  occupationName: string
  occupationSlug: string
  anzscoCode: string
  updatedAtISO: string
  sources: string[]
  shortage: {
    nationalLevel: ShortageLevel
    nationalScore: number
    byRegion: RegionShortage[]
  }
  snapshot: {
    medianSalaryText: string
    salaryRangeText: string
    jobAdsTrend90dText: string
    timeToHireText: string
    visaPathwaysText: string
  }
  plainEnglish: {
    bullets: string[]
    officialUrl?: string
  }
  skills: Skill[]
  credentials: Credential[]
  jobAds: JobAd[]
  outlook: {
    why: string
    index: { period: string; value: number }[]
  }
  b2bCta: {
    headline: string
    bullets: string[]
    primaryCta: string
    secondaryCta: string
  }
}

// ---------------------------------------------------------------------------

const SHORTAGE_VARIANT: Record<
  ShortageLevel,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Low: "outline",
  Medium: "secondary",
  High: "default",
  Strong: "default",
}

function SnapshotCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <div className="text-lg font-semibold tracking-tight">{value}</div>
        {hint ? (
          <div className="text-xs text-muted-foreground">{hint}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

const DOTS: Record<ShortageLevel, number> = { Low: 0, Medium: 1, High: 2, Strong: 3 }
const DOT_LABEL: Record<ShortageLevel, string> = {
  Low: "No shortage",
  Medium: "Regional shortage",
  High: "Shortage",
  Strong: "Strong shortage",
}

function ShortageDotsDisplay({ level }: { level: ShortageLevel }) {
  const filled = DOTS[level]
  return (
    <span className="flex items-center gap-1.5" title={DOT_LABEL[level]}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={
            i < filled
              ? "inline-block h-2.5 w-2.5 rounded-full bg-rose-400"
              : "inline-block h-2.5 w-2.5 rounded-full border border-slate-300"
          }
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{DOT_LABEL[level]}</span>
    </span>
  )
}

export default function OccupationDetailPage({
  data,
}: {
  data: OccupationPageData
}) {
  const {
    occupationName,
    anzscoCode,
    countryCode,
    updatedAtISO,
    sources,
    shortage,
    snapshot,
    plainEnglish,
    skills,
    credentials,
    jobAds,
    outlook,
    b2bCta,
  } = data

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />

      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          {/* Breadcrumb / back */}
          <Link
            href="/au/jobs"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            All Australian Jobs
          </Link>

          {/* Header */}
          <header className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Globe className="size-3" />
                {countryCode}
              </Badge>
              <Badge variant="secondary">ANZSCO {anzscoCode}</Badge>
              <Badge variant={SHORTAGE_VARIANT[shortage.nationalLevel]}>
                Shortage: {shortage.nationalLevel}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {occupationName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Updated {updatedAtISO}
              {sources.length > 0 ? ` · ${sources.length} source${sources.length > 1 ? "s" : ""}` : ""}
            </p>
          </header>

          {/* Shortage gauge */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                National Skills Shortage
              </CardTitle>
              <CardDescription>
                OSCA shortage rating (higher = greater demand)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{shortage.nationalLevel}</span>
                <span className="tabular-nums text-muted-foreground">
                  {shortage.nationalScore}/100
                </span>
              </div>
              <Progress value={shortage.nationalScore} />
            </CardContent>
          </Card>

          {/* Snapshot grid */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SnapshotCard
              icon={<Landmark className="size-4" />}
              label="Median Salary"
              value={snapshot.medianSalaryText}
              hint={snapshot.salaryRangeText}
            />
            <SnapshotCard
              icon={<Briefcase className="size-4" />}
              label="Hiring Trend (90d)"
              value={snapshot.jobAdsTrend90dText}
            />
            <SnapshotCard
              icon={<Clock className="size-4" />}
              label="Avg. Time to Hire"
              value={snapshot.timeToHireText}
            />
            <SnapshotCard
              icon={<ShieldCheck className="size-4" />}
              label="Visa Pathway"
              value="Sponsor / PR"
              hint={snapshot.visaPathwaysText}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="credentials">Courses</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-4 flex flex-col gap-6">
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  What this means
                </h2>
                {plainEnglish.bullets.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {plainEnglish.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState>Summary coming soon.</EmptyState>
                )}
                {plainEnglish.officialUrl ? (
                  <a
                    href={plainEnglish.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Official source
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
              </section>

              <Separator />

              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Outlook
                </h2>
                <p className="text-sm">{outlook.why}</p>
                {outlook.index.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {outlook.index.map((pt, i) => (
                      <Badge key={i} variant="outline">
                        {pt.period}: {pt.value}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </section>

              {shortage.byRegion.length > 0 ? (
                <>
                  <Separator />
                  <section className="flex flex-col gap-3">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <MapIcon className="size-4" />
                      Shortage by State
                    </h2>
                    <ul className="flex flex-col divide-y divide-border">
                      {shortage.byRegion.map((r) => (
                        <li
                          key={r.region}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <span>{r.region}</span>
                          <ShortageDotsDisplay level={r.level} />
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              ) : null}
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="mt-4">
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Badge key={s.name} variant="secondary" className="gap-1">
                      {s.name}
                      {typeof s.importance === "number"
                        ? ` · ${s.importance}`
                        : ""}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyState>Skills data coming soon.</EmptyState>
              )}
            </TabsContent>

            {/* Credentials / courses */}
            <TabsContent value="credentials" className="mt-4">
              {credentials.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {credentials.map((c) => (
                    <Card key={c.id} size="sm">
                      <CardContent className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="flex items-start gap-2 text-sm font-medium">
                            <GraduationCap className="mt-0.5 size-4 shrink-0 text-primary" />
                            {c.name}
                          </span>
                          <Badge variant="outline" className="shrink-0">
                            {c.type}
                          </Badge>
                        </div>
                        {c.notes ? (
                          <p className="text-xs text-muted-foreground">
                            {c.notes}
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState>Courses &amp; credentials coming soon.</EmptyState>
              )}
              {/* Compare courses CTA */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-600">Looking for the best course for this occupation?</span>
                <Button asChild variant="outline" size="sm">
                  <Link href="/compare">
                    Compare Courses
                    <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            {/* Jobs */}
            <TabsContent value="jobs" className="mt-4">
              {jobAds.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {jobAds.map((j) => (
                    <li key={j.id}>
                      <Card size="sm">
                        <CardContent className="flex flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium">
                              {j.title}
                            </span>
                            {j.salaryText ? (
                              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                                {j.salaryText}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {j.employer} · {j.location} · {j.postedAtISO}
                          </div>
                          {j.url ? (
                            <a
                              href={j.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex w-fit items-center gap-1 text-xs text-primary hover:underline"
                            >
                              View listing
                              <ExternalLink className="size-3" />
                            </a>
                          ) : null}
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState>Live job listings coming soon.</EmptyState>
              )}
            </TabsContent>
          </Tabs>

          {/* B2B CTA */}
          <Card className="mt-10 bg-muted/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-4 text-primary" />
                {b2bCta.headline}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {b2bCta.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="tactile">
                  <Link href="/roi-explorer">
                    {b2bCta.primaryCta}
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/roi-explorer">{b2bCta.secondaryCta}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sources */}
          {sources.length > 0 ? (
            <p className="mt-6 text-xs text-muted-foreground">
              출처: {sources.join(" · ")}
            </p>
          ) : null}
        </div>
      </main>

      {/* 모바일 전용 sticky CTA — 하단 고정. 데스크탑에서는 숨김. */}
      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden">
        <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-700">{occupationName}</p>
            <p className="text-[11px] text-slate-400">{snapshot.medianSalaryText} · {shortage.nationalLevel} shortage</p>
          </div>
          <Button asChild variant="tactile" size="sm" className="shrink-0">
            <Link href="/roi-explorer">
              Check Visa Path
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
      {/* sticky CTA 높이 보정 (모바일에서 콘텐츠가 bar에 가려지지 않도록) */}
      <div className="h-16 sm:hidden" aria-hidden />

      <SiteFooter />
    </div>
  )
}
