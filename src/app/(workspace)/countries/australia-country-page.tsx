import Link from "next/link"
import {
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarDays,
  GraduationCap,
  MapPin,
  ScrollText,
  Sparkles,
  Stamp,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { AUSTRALIA_OCCUPATION_COUNTRY_PROFILE } from "@/data/australia-occupation-country-profile"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import type {
  AustraliaCountryMetric,
  AustraliaCountryMetrics,
} from "@/lib/workspace/australia-country-metrics"
import { getCountryExplorer } from "@/lib/workspace/country-explorer"
import { getCountryProfile } from "@/lib/workspace/country-profile"
import { VISA_CATALOG } from "@/lib/workspace/visa-catalog"
import { cn } from "@/lib/utils"
import { ActiveCountrySync } from "./active-country-sync"

const KIND_STYLES: Record<string, string> = {
  Study: "bg-[#eef4ff] text-[#2563eb]",
  Work: "bg-[#fbf0e7] text-[#c2691e]",
  Skilled: "bg-[#f3f0fa] text-[#6d4fc4]",
  "Working holiday": "bg-[#edf5ea] text-[#3e7a2e]",
  Family: "bg-[#f5f3f0] text-[#6f6d68]",
  Temporary: "bg-[#f5f3f0] text-[#6f6d68]",
}

const number = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 })

function metricMoney(metric: AustraliaCountryMetric | undefined, suffix: string) {
  if (!metric) return "—"
  return `${metric.currency} ${number.format(metric.amount)} ${suffix}`
}

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2563eb] hover:underline"
    >
      {label}
      <ArrowUpRight className="size-3" />
    </a>
  )
}

function MetricCard({
  icon,
  label,
  value,
  source,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  source?: AustraliaCountryMetric
  accent: string
}) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg", accent)}>{icon}</span>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-[23px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{value}</p>
      {source && (
        <div className="mt-2">
          <SourceLink label={source.sourceName} url={source.sourceUrl} />
        </div>
      )}
    </article>
  )
}

export function AustraliaCountryPage({ metrics }: { metrics: AustraliaCountryMetrics }) {
  const country = LAUNCH_COUNTRIES.find((item) => item.code === "AU")
  const explorer = getCountryExplorer("AU")
  const countryProfile = getCountryProfile("AU")
  const profile = AUSTRALIA_OCCUPATION_COUNTRY_PROFILE
  const visas = VISA_CATALOG.filter((visa) => visa.countryCode === "AU")

  if (!country || !explorer || !countryProfile) return null

  const cityCount = explorer.regions.reduce((total, region) => total + region.cities.length, 0)
  const annualSalary = metrics.average_full_time_annual_earnings
  const livingCost = metrics.student_living_cost_shared_monthly_average
  const minimumWage = metrics.national_minimum_hourly_wage

  return (
    <div>
      <ActiveCountrySync code={country.code} name={country.name} currency={country.currency} />

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${country.image.replace(/\?.*$/, "?w=1600&h=700&fit=crop&auto=format")})`,
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-16 sm:px-8 sm:pt-20 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Countries</p>
          <h1 className="mt-2 text-[38px] font-semibold leading-tight tracking-[-0.025em] text-white sm:text-[48px]">
            Australia
          </h1>
          <p className="mt-2 text-[14px] font-medium text-white/85">
            AU · {explorer.regions.length} regions · {cityCount} cities · AUD
          </p>
          <Link
            href="/countries"
            className="mt-5 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Change country
          </Link>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Stamp className="size-4 text-[#6d4fc4]" />}
            accent="bg-[#f3f0fa]"
            label="Visa options"
            value={String(visas.length)}
          />
          <MetricCard
            icon={<Banknote className="size-4 text-[#2563eb]" />}
            accent="bg-[#eef4ff]"
            label="Average salary"
            value={metricMoney(annualSalary, "/ year")}
            source={annualSalary}
          />
          <MetricCard
            icon={<Wallet className="size-4 text-[#c2691e]" />}
            accent="bg-[#fbf0e7]"
            label="Shared living cost"
            value={metricMoney(livingCost, "/ month")}
            source={livingCost}
          />
          <MetricCard
            icon={<TrendingUp className="size-4 text-[#3e7a2e]" />}
            accent="bg-[#edf5ea]"
            label="Minimum wage"
            value={metricMoney(minimumWage, "/ hour")}
            source={minimumWage}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center gap-2 text-[#2563eb]">
              <CalendarDays className="size-4" />
              <h2 className="text-[14.5px] font-semibold">Academic year</h2>
            </div>
            <p className="mt-3 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
              {profile.academicYear.headline}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.academicYear.intakes.map((intake) => (
                <span key={intake} className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-semibold text-[#2563eb]">
                  {intake}
                </span>
              ))}
            </div>
            <div className="mt-3">
              <SourceLink label={profile.academicYear.source.label} url={profile.academicYear.source.url} />
            </div>
          </section>

          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center gap-2 text-[#3e7a2e]">
              <GraduationCap className="size-4" />
              <h2 className="text-[14.5px] font-semibold">Strong majors by workforce demand</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.strongMajors.map((major) => (
                <span key={major.id} className="rounded-lg border border-[#dfe8db] bg-[#f7faf5] px-3 py-2 text-[12px] font-semibold text-[#2f5f25]">
                  {major.label}
                </span>
              ))}
            </div>
            <div className="mt-3">
              <SourceLink label={profile.sources[0].label} url={profile.sources[0].url} />
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-xl border border-[#e7e6e3] bg-white p-5">
          <div className="flex items-center gap-2 text-[#6d4fc4]">
            <Building2 className="size-4" />
            <h2 className="text-[14.5px] font-semibold">Major universities and public VET providers</h2>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {profile.majorInstitutions.map((institution) => (
              <div key={institution.name} className="rounded-lg border border-[#f0efec] bg-[#fafaf8] px-3 py-3">
                <p className="text-[12px] font-semibold leading-4 text-[#1b1b1b]">{institution.name}</p>
                <p className="mt-1 text-[10.5px] text-[#9a978f]">
                  {institution.type === "public_vet" ? "Public VET" : "Research university"} · {institution.location}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {profile.sources.slice(1).map((source) => (
              <SourceLink key={source.url} label={source.label} url={source.url} />
            ))}
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <section className="min-w-0 rounded-xl border border-[#e7e6e3] bg-white lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#f0efec] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ScrollText className="size-4 text-[#6d4fc4]" />
                <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Visa options</h2>
              </div>
              <span className="text-[11.5px] font-medium text-[#a3a19b]">{visas.length} pathways</span>
            </div>
            <ul className="divide-y divide-[#f0efec]">
              {visas.map((visa) => (
                <li key={visa.name} className="flex items-start gap-3 px-5 py-3.5">
                  <span className={cn("mt-0.5 inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide", KIND_STYLES[visa.kind] ?? KIND_STYLES.Temporary)}>
                    {visa.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <a
                      href={visa.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 text-[13.5px] font-semibold text-[#1b1b1b] transition hover:text-[#2563eb]"
                    >
                      {visa.name}
                      <ArrowUpRight className="size-3.5 text-[#c4c2bc] transition group-hover:text-[#2563eb]" />
                    </a>
                    <span className="mt-0.5 block text-[12.5px] leading-5 text-[#6f6d68]">{visa.note}</span>
                  </span>
                  <span className="shrink-0 pt-0.5 text-[11px] font-medium text-[#c4c2bc]">{visa.authority}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-[#e7e6e3] bg-white">
            <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
              <Sparkles className="size-4 text-[#2563eb]" />
              <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Work opportunities</h2>
            </div>
            {countryProfile.workOpportunities && (
              <div className="px-5 py-4">
                <p className="text-[12.5px] font-semibold text-[#1b1b1b]">{countryProfile.workOpportunities.headline}</p>
                <ul className="mt-3 space-y-2.5">
                  {countryProfile.workOpportunities.items.map((item) => (
                    <li key={item.title} className="flex items-center gap-2">
                      <span className="size-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                      <span className="text-[12.5px] font-medium text-[#4d4c48]">{item.title}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <SourceLink label={countryProfile.workOpportunities.source} url={countryProfile.workOpportunities.url} />
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="mt-4 rounded-xl border border-[#e7e6e3] bg-white">
          <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
            <MapPin className="size-4 text-[#3e7a2e]" />
            <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Regions &amp; cities</h2>
            <span className="ml-auto text-[11.5px] font-medium text-[#a3a19b]">{cityCount} cities</span>
          </div>
          <div className="grid gap-x-8 gap-y-5 px-5 py-5 sm:grid-cols-2">
            {explorer.regions.map((region) => (
              <div key={region.name}>
                <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1b1b1b]">
                  <MapPin className="size-3.5 text-[#9c9a94]" />
                  {region.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {region.cities.map((city) => (
                    <span key={city} className="rounded-md border border-[#e7e6e3] bg-[#fafaf8] px-2.5 py-1 text-[12px] font-medium text-[#4d4c48]">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
