import Link from "next/link"
import {
  Banknote,
  Building2,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  MapPin,
  Sparkles,
  Stamp,
  Wallet,
} from "lucide-react"
import {
  AUSTRALIA_OCCUPATION_COUNTRY_PROFILE,
  COUNTRY_INSTITUTION_TYPE_LABELS,
} from "@/data/australia-occupation-country-profile"
import {
  formatMoneyRange,
  formatRankingValue,
  type CountryMetricSource,
  type CountryMetrics,
} from "@/lib/workspace/country-metric-contract"
import { getCountryExplorer } from "@/lib/workspace/country-explorer"
import { getCountryProfile } from "@/lib/workspace/country-profile"
import { VISA_CATALOG } from "@/lib/workspace/visa-catalog"
import { cn } from "@/lib/utils"

function MetricCard({
  icon,
  label,
  value,
  hint,
  accent,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
  accent: string
  href?: string
}) {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg", accent)}>{icon}</span>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-[25px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{hint}</p>
    </>
  )

  const className =
    "rounded-xl border border-[#e7e6e3] bg-white p-4 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]/15"

  if (href) {
    return (
      <Link href={href} className={cn(className, "block hover:border-[#c9d7f5] hover:shadow-sm")}>
        {content}
      </Link>
    )
  }

  return <article className={className}>{content}</article>
}

function dateLabel(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat("en-AU", { month: "short", year: "numeric" }).format(date)
}

type DisplaySource = {
  label: string
  url: string
  organisation?: string
  dataAsOf?: string | null
  verifiedAt?: string | null
}

function metricSource(source: CountryMetricSource): DisplaySource {
  return {
    label: source.sourceName,
    url: source.url,
    organisation: source.organisationName,
    dataAsOf: source.dataAsOf,
    verifiedAt: source.verifiedAt,
  }
}

export function AustraliaCountryDashboard({ metrics }: { metrics: CountryMetrics }) {
  const explorer = getCountryExplorer("AU")
  const countryProfile = getCountryProfile("AU")
  const profile = AUSTRALIA_OCCUPATION_COUNTRY_PROFILE
  const visas = VISA_CATALOG.filter((visa) => visa.countryCode === "AU")

  if (!explorer || !countryProfile) return null

  const cityCount = explorer.regions.reduce((total, region) => total + region.cities.length, 0)
  const salaryHint = metrics.salaryRange
    ? `Middle 50% of full-time earnings · median ${formatRankingValue(metrics.salaryRange)}`
    : "Verified national range coming soon"
  const livingHint = metrics.livingCostRange
    ? "Typical shared-housing student estimate · monthly"
    : "Verified student estimate coming soon"
  const sources: DisplaySource[] = [
    ...metrics.sources.map(metricSource),
    profile.academicYear.source,
    ...profile.sources,
  ]
  const dedupedSources = [...new Map(sources.map((source) => [source.url, source])).values()]

  return (
    <div>
      <p className="mb-4 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">{profile.introduction}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<Stamp className="size-4 text-[#6d4fc4]" />}
          accent="bg-[#f3f0fa]"
          label="Visa options"
          value={String(visas.length)}
          hint="Study, work and skilled pathways"
          href="/visas?country=AU"
        />
        <MetricCard
          icon={<Banknote className="size-4 text-[#2563eb]" />}
          accent="bg-[#eef4ff]"
          label="Salary range"
          value={formatMoneyRange(metrics.salaryRange)}
          hint={salaryHint}
        />
        <MetricCard
          icon={<Wallet className="size-4 text-[#c2691e]" />}
          accent="bg-[#fbf0e7]"
          label="Living costs"
          value={formatMoneyRange(metrics.livingCostRange)}
          hint={livingHint}
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
          <p className="mt-2 text-[12.5px] leading-5 text-[#6f6d68]">{profile.academicYear.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.academicYear.intakes.map((intake) => (
              <span
                key={intake}
                className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-semibold text-[#2563eb]"
              >
                {intake}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <div className="flex items-center gap-2 text-[#3e7a2e]">
            <GraduationCap className="size-4" />
            <h2 className="text-[14.5px] font-semibold">Strong majors by workforce demand</h2>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {profile.strongMajors.map((major) => (
              <div
                key={major.id}
                className="rounded-lg border border-[#dfe8db] bg-[#f7faf5] px-3 py-2.5"
              >
                <p className="text-[12px] font-semibold text-[#2f5f25]">{major.label}</p>
                <p className="mt-1 text-[10.5px] leading-4 text-[#66805f]">{major.reason}</p>
              </div>
            ))}
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
            <div
              key={institution.name}
              className="rounded-lg border border-[#f0efec] bg-[#fafaf8] px-3 py-3"
            >
              <p className="text-[12px] font-semibold leading-4 text-[#1b1b1b]">{institution.name}</p>
              <p className="mt-1 text-[10.5px] text-[#9a978f]">
                {COUNTRY_INSTITUTION_TYPE_LABELS[institution.type]} · {institution.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-[#e7e6e3] bg-white lg:col-span-2">
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
                    <span
                      key={city}
                      className="rounded-md border border-[#e7e6e3] bg-[#fafaf8] px-2.5 py-1 text-[12px] font-medium text-[#4d4c48]"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#e7e6e3] bg-white">
          <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
            <Sparkles className="size-4 text-[#2563eb]" />
            <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Work opportunities</h2>
          </div>
          {countryProfile.workOpportunities && (
            <div className="px-5 py-4">
              <p className="text-[12.5px] font-semibold text-[#1b1b1b]">
                {countryProfile.workOpportunities.headline}
              </p>
              <ul className="mt-3 space-y-2.5">
                {countryProfile.workOpportunities.items.map((item) => (
                  <li key={item.title} className="flex items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                    <span className="text-[12.5px] font-medium text-[#4d4c48]">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-[#e7e6e3] bg-white p-5" aria-labelledby="country-sources-heading">
        <h2 id="country-sources-heading" className="text-[14.5px] font-semibold text-[#1b1b1b]">Sources</h2>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {dedupedSources.map((source) => {
            const dataAsOf = dateLabel(source.dataAsOf ?? null)
            const verifiedAt = dateLabel(source.verifiedAt ?? null)
            return (
              <li key={source.url} className="rounded-lg border border-[#f0efec] bg-[#fafaf8] px-3 py-2.5">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1 text-[11.5px] font-semibold leading-4 text-[#3a3935] transition hover:text-[#2563eb]"
                >
                  {source.label}
                  <ExternalLink className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                </a>
                {(source.organisation || dataAsOf || verifiedAt) && (
                  <p className="mt-1 text-[10px] leading-4 text-[#918e87]">
                    {[source.organisation, dataAsOf ? `Data: ${dataAsOf}` : null, verifiedAt ? `Verified: ${verifiedAt}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
