"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Plane,
  Landmark,
  Cpu,
  TrendingUp,
  Check,
  Sparkles,
  ClipboardList,
  BarChart3,
  MapPin,
} from "lucide-react"
import { useTranslations } from "@/lib/i18n/locale-provider"

// Mirrors EXPLORE_MAJORS (lib/explore.ts — server-only, so the slug list is
// inlined here). Labels resolve from the degree-risk option dictionary, so they
// switch with the locale toggle. Each links to its cross-country ranking.
const MAJOR_SLUGS = [
  "computer-science",
  "data-analytics",
  "software-engineering",
  "nursing",
  "civil-engineering",
  "business-management",
  "accounting",
  "ux-design",
  "psychology",
  "music",
] as const

const COUNTRIES = [
  { code: "us", key: "US", flag: "🇺🇸" },
  { code: "ca", key: "CA", flag: "🇨🇦" },
  { code: "uk", key: "UK", flag: "🇬🇧" },
  { code: "au", key: "AU", flag: "🇦🇺" },
  { code: "ie", key: "IE", flag: "🇮🇪" },
] as const

export type HomeFeaturedPost = {
  slug: string
  title: string
  description: string
  tag: string
  tagColor: string
  readTime: string
  heroImage: string
}

export function HomeLanding({ posts }: { posts: HomeFeaturedPost[] }) {
  const t = useTranslations()
  const hero = t.landing.hero
  const s = t.landing.sections
  const prov = t.landing.provenance
  const opts = t.degreeRisk.options as Record<string, string>
  const countryNames = t.degreeRisk.result.countries as Record<string, string>

  return (
    <div className="bg-background">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/70 via-white to-white">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-14 pb-16 sm:pt-20 lg:grid-cols-2 lg:gap-10 lg:pb-24">
          {/* Left — message + CTA */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {hero.badge}
            </span>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl break-keep">
              {hero.headlineLine1}{" "}
              <span className="text-blue-600">{hero.headlineLine2}</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0 break-keep">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/degree-risk"
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-[17px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-700"
              >
                {hero.ctaRisk}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <span className="text-sm text-slate-500">{hero.ctaRiskSub}</span>
            </div>

            <div className="mt-5">
              <Link
                href="/roi-explorer"
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 underline-offset-2 transition-colors hover:text-slate-900 hover:underline"
              >
                {hero.ctaSecondary}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right — sample scorecard (show, don't tell) */}
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
            <SampleScorecard />
          </div>
        </div>
      </section>

      {/* ──────────────────── How it works ──────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-slate-900">
          {t.landing.howItWorks.sectionTitle}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StepCard
            n={1}
            icon={<ClipboardList className="h-5 w-5" />}
            title={t.landing.howItWorks.step1Title}
            desc={t.landing.howItWorks.step1Desc}
          />
          <StepCard
            n={2}
            icon={<BarChart3 className="h-5 w-5" />}
            title={t.landing.howItWorks.step2Title}
            desc={t.landing.howItWorks.step2Desc}
          />
          <StepCard
            n={3}
            icon={<MapPin className="h-5 w-5" />}
            title={t.landing.howItWorks.step3Title}
            desc={t.landing.howItWorks.step3Desc}
          />
        </div>
      </section>

      {/* ──────────────── Two decisions (narrative) ──────────────── */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
              {t.landing.narrative.sectionTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500 break-keep">
              {t.landing.narrative.sectionSubtitle}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <DecisionCard
              accent="blue"
              icon={<ShieldCheck className="h-5 w-5" />}
              step="01"
              title={t.landing.narrative.card1Title}
              desc={t.landing.narrative.card1Desc}
              cta={t.landing.narrative.card1Cta}
              href="/degree-risk"
            />
            <DecisionCard
              accent="indigo"
              icon={<TrendingUp className="h-5 w-5" />}
              step="02"
              title={t.landing.narrative.card2Title}
              desc={t.landing.narrative.card2Desc}
              cta={t.landing.narrative.card2Cta}
              href="/roi-explorer"
            />
          </div>
        </div>
      </section>

      {/* ──────────────────── Explore (majors + countries) ──────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{s.exploreEyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">
          {t.explore.hubTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-slate-500 break-keep">{t.explore.byMajorDesc}</p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MAJOR_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/explore/major/${slug}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-blue-300 hover:shadow"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                <GraduationCap className="h-[18px] w-[18px]" />
              </span>
              <span className="font-medium text-slate-800 transition-colors group-hover:text-blue-700">
                {opts[slug] ?? slug}
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
            </Link>
          ))}
        </div>

        <h3 className="mt-12 text-lg font-semibold text-slate-900">{t.explore.byCountryTitle}</h3>
        <p className="mb-4 mt-1 text-sm text-slate-500">{t.explore.byCountryDesc}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COUNTRIES.map((c) => (
            <Link
              key={c.code}
              href={`/explore/country/${c.code}`}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-blue-300 hover:shadow"
            >
              <span className="text-lg">{c.flag}</span>
              <span className="font-medium text-slate-800 transition-colors group-hover:text-blue-700">
                {countryNames[c.key] ?? c.key}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ──────────────────── Featured guides ──────────────────── */}
      {posts.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{s.guidesEyebrow}</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">
                  {s.guidesTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-slate-500 break-keep">{s.guidesSubtitle}</p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {s.guidesCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.heroImage}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${p.tagColor}`}>
                      {p.tag}
                    </span>
                    <h3 className="mt-3 font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700 break-keep">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500 break-keep">{p.description}</p>
                    <span className="mt-4 text-xs text-slate-400">{p.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────── Trust / provenance ──────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{s.trustEyebrow}</p>
          <h2 className="mt-2 inline-flex items-center gap-2 font-display text-3xl font-semibold tracking-tight text-slate-900">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            {prov.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500 break-keep">{prov.subtitle}</p>
        </div>

        {/* Scale stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile value="5" label={s.statCountries} />
          <StatTile value="10" label={s.statMajors} />
          <StatTile value="11,000+" label={s.statCourses} />
          <StatTile value="5" label={s.statLayers} />
        </div>

        {/* Per-layer sources */}
        <div className="mx-auto mt-10 max-w-3xl space-y-2">
          {[prov.employment, prov.visa, prov.demand, prov.ai, prov.roi].map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <span>{line}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {prov.methodologyLink}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-slate-400">{prov.disclaimer}</p>
        </div>
      </section>

      {/* ──────────────────── Final CTA band ──────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl break-keep">
            {t.landing.cta.title}
          </h2>
          <Link
            href="/degree-risk"
            className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-white px-8 text-[17px] font-semibold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            {t.landing.cta.button}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

/* ──────────────────────────── Sub-components ──────────────────────────── */

function SampleScorecard() {
  const t = useTranslations()
  const hero = t.landing.hero
  const s = t.landing.sections

  const rows = [
    { icon: <Briefcase className="h-4 w-4" />, label: hero.sampleEmployment, value: s.sampleEmploymentVal, tone: "green" as const },
    { icon: <Plane className="h-4 w-4" />, label: hero.sampleVisa, value: s.sampleVisaVal, tone: "blue" as const, check: true },
    { icon: <Landmark className="h-4 w-4" />, label: hero.samplePr, value: s.samplePrVal, tone: "blue" as const },
    { icon: <Cpu className="h-4 w-4" />, label: hero.sampleAi, value: s.sampleAiVal, tone: "amber" as const },
    { icon: <TrendingUp className="h-4 w-4" />, label: hero.sampleRoi, value: s.sampleRoiVal, tone: "green" as const },
  ]

  const tones: Record<"green" | "blue" | "amber", string> = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{s.sampleTag}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {s.sampleRisk}
        </span>
      </div>

      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-slate-900">{s.sampleMajor}</h3>

      <div className="mt-4 space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
              {r.icon}
            </span>
            <span className="text-sm font-medium text-slate-700">{r.label}</span>
            <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[r.tone]}`}>
              {r.check && <Check className="h-3 w-3" />}
              {r.value}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-[11px] leading-snug text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />
        {s.sampleFootnote}
      </p>
    </div>
  )
}

function StepCard({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{icon}</span>
        <span className="font-display text-2xl font-semibold text-slate-200">{n}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 break-keep">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 break-keep">{desc}</p>
    </div>
  )
}

function DecisionCard({
  accent,
  icon,
  step,
  title,
  desc,
  cta,
  href,
}: {
  accent: "blue" | "indigo"
  icon: React.ReactNode
  step: string
  title: string
  desc: string
  cta: string
  href: string
}) {
  const accents = {
    blue: { bar: "bg-blue-600", chip: "bg-blue-50 text-blue-600" },
    indigo: { bar: "bg-indigo-600", chip: "bg-indigo-50 text-indigo-600" },
  }[accent]

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-1 ${accents.bar}`} />
      <div className="flex items-center justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents.chip}`}>{icon}</span>
        <span className="font-display text-3xl font-semibold text-slate-100">{step}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900 break-keep">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 break-keep">{desc}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center shadow-sm">
      <div className="font-display text-3xl font-semibold tracking-tight text-blue-600">{value}</div>
      <div className="mt-1 text-sm text-slate-500 break-keep">{label}</div>
    </div>
  )
}
