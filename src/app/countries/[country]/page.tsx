import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import {
  COUNTRY_ROI_DATA_META,
  COUNTRY_ROI_INSIGHTS,
  type CountryRoiInsight,
  type DataConfidence,
  type DataSource,
} from "@/data/country-roi-mvp"
import {
  getRecommendationLabels,
  parseRecommendationInput,
  recommendCountries,
} from "@/lib/country-recommendation"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

type PageProps = {
  params: Promise<{ country: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const confidenceLabel: Record<DataConfidence, string> = {
  official: "Official",
  "market-estimate": "Market estimate",
  "internal-estimate": "CampCareer estimate",
}

const confidenceClass: Record<DataConfidence, string> = {
  official: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "market-estimate": "border-blue-200 bg-blue-50 text-blue-800",
  "internal-estimate": "border-slate-200 bg-slate-50 text-slate-700",
}

const sourceRows: { key: keyof CountryRoiInsight["sources"]; label: string }[] = [
  { key: "salary", label: "Salary projection" },
  { key: "tax", label: "Tax preview" },
  { key: "rent", label: "Rent preview" },
  { key: "budget", label: "Initial budget" },
  { key: "policy", label: "Visa and policy" },
]

function getCountry(slug: string) {
  return COUNTRY_ROI_INSIGHTS.find((country) => country.slug === slug)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value))
}

function sourceHref(source: DataSource) {
  return source.sourceUrl ?? "/methodology"
}

export function generateStaticParams() {
  return COUNTRY_ROI_INSIGHTS.map((country) => ({ country: country.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: slug } = await params
  const country = getCountry(slug)

  if (!country) {
    return pageMetadata({
      title: "Country ROI Guide | CampCareer",
      description: "Compare study destinations by salary, cost, tax, visa policy, and ROI.",
      path: "/",
    })
  }

  return pageMetadata({
    title: `Study & Work in ${country.name} — Salary, Budget & Visa ROI | CampCareer`,
    description: `Compare ${country.name} by graduate salary, 3/5/10-year pay, rent, tax, visa policy, best majors, and initial budget.`,
    path: country.href,
  })
}

export default async function CountryDetailPage({ params, searchParams }: PageProps) {
  const { country: slug } = await params
  const query = await searchParams
  const country = getCountry(slug)

  if (!country) notFound()

  const hasPersonalQuery = Boolean(
    query?.field ?? query?.budget ?? query?.goal ?? query?.risk ?? query?.language,
  )
  const recommendationInput = parseRecommendationInput({
    field: getQueryValue(query?.field),
    budget: getQueryValue(query?.budget),
    goal: getQueryValue(query?.goal),
    risk: getQueryValue(query?.risk),
    language: getQueryValue(query?.language),
  })
  const recommendation = hasPersonalQuery
    ? recommendCountries(recommendationInput).find((item) => item.code === country.code)
    : null
  const recommendationLabels = getRecommendationLabels(recommendationInput)

  const salaryRows = [
    { label: "After graduation", value: country.salaries.first },
    { label: "After 3 years", value: country.salaries.year3 },
    { label: "After 5 years", value: country.salaries.year5 },
    { label: "After 10 years", value: country.salaries.year10 },
  ]

  const metricRows = [
    { label: "First salary", value: country.salaries.first, note: "Market entry estimate" },
    { label: "5-year salary", value: country.salaries.year5, note: "Mid-career preview" },
    { label: "Monthly rent", value: country.rent, note: country.cities },
    { label: "Initial budget", value: country.initialBudget, note: "Minimum to comfortable runway" },
    { label: "Tax preview", value: country.tax, note: "Simplified effective rate" },
    { label: "Policy route", value: country.policy, note: "Verify before applying" },
  ]
  const primaryCta = country.code === "BE"
    ? { href: "/map?country=be", label: "Compare regions and schools" }
    : { href: `/roi-explorer?country=${country.code.toLowerCase()}`, label: "Compare schools and ROI" }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <JsonLd data={breadcrumbLd([{ name: country.name, path: country.href }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `Study and work in ${country.name}`,
          description: country.verdict,
          mainEntityOfPage: `https://www.campcareer.com${country.href}`,
          dateModified: COUNTRY_ROI_DATA_META.lastUpdated,
          publisher: { "@type": "Organization", name: "CampCareer" },
        }}
      />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-14">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
              >
                Country ROI
              </Link>
              <Link
                href={country.hubHref}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
              >
                {country.code} hub
              </Link>
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                Updated {formatDate(COUNTRY_ROI_DATA_META.lastUpdated)}
              </span>
            </div>

            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              {country.cities}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
              Study and work in {country.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {country.verdict}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-slate-800"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={country.detail.nextSteps[0]?.href ?? country.hubHref}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-100"
              >
                Browse occupations
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Quick ROI preview
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniMetric label="First salary" value={country.salaries.first} />
              <MiniMetric label="5-year salary" value={country.salaries.year5} />
              <MiniMetric label="Rent" value={country.rent} />
              <MiniMetric label="Budget" value={country.initialBudget} />
            </div>
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Strong majors
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {country.bestMajors.map((major) => (
                  <span
                    key={major}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metricRows.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-500">{metric.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Panel title="Who this country is best for">
            <BulletList items={country.detail.bestFor} />
          </Panel>

          <Panel title="Salary projection">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Career point</th>
                    <th className="px-4 py-3 font-semibold">Expected salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {salaryRows.map((row) => (
                    <tr key={row.label}>
                      <td className="px-4 py-3 font-medium text-slate-700">{row.label}</td>
                      <td className="px-4 py-3 text-slate-950">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Budget and take-home preview">
            <div className="grid gap-3 sm:grid-cols-3">
              {country.detail.budgetBreakdown.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Visa and policy signals">
            <BulletList items={country.detail.policyHighlights} />
            <SourceLink className="mt-5" source={country.sources.policy} />
          </Panel>

          <Panel title="Data confidence">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Data</th>
                    <th className="px-4 py-3 font-semibold">Confidence</th>
                    <th className="px-4 py-3 font-semibold">Source</th>
                    <th className="px-4 py-3 font-semibold">Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sourceRows.map(({ key, label }) => {
                    const source = country.sources[key]
                    return (
                      <tr key={key}>
                        <td className="px-4 py-3 font-medium text-slate-700">{label}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${confidenceClass[source.confidence]}`}
                          >
                            {confidenceLabel[source.confidence]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={sourceHref(source)}
                            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                            {...(sourceHref(source).startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {source.sourceName}
                          </a>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{source.note}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(source.lastChecked)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          {recommendation ? (
            <Panel title="Your match profile">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {recommendation.fitLabel}
                </p>
                <p className="mt-1 text-3xl font-semibold text-emerald-950">
                  {recommendation.matchScore}/100
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <ProfilePill label="Major" value={recommendationLabels.field} />
                <ProfilePill label="Budget" value={recommendationLabels.budget} />
                <ProfilePill label="Goal" value={recommendationLabels.goal} />
                <ProfilePill label="Risk" value={recommendationLabels.risk} />
                <ProfilePill label="Language" value={recommendationLabels.language} className="col-span-2" />
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Why it matched
                </p>
                <BulletList items={recommendation.reasons} />
              </div>
            </Panel>
          ) : null}

          <Panel title="Risks to check first">
            <BulletList items={recommendation?.cautions ?? country.detail.watchouts} />
          </Panel>

          <Panel title="Next steps">
            <div className="space-y-3">
              {country.detail.nextSteps.map((step) => (
                <Link
                  key={step.label}
                  href={step.href}
                  className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <p className="font-semibold text-slate-950">{step.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.note}</p>
                </Link>
              ))}
              <Link
                href={country.hubHref}
                className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-950">Open {country.name} hub</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Continue into the existing country hub and job pages.
                </p>
              </Link>
            </div>
          </Panel>

          <Panel title="MVP note">
            <p className="text-sm leading-7 text-slate-600">{COUNTRY_ROI_DATA_META.note}</p>
          </Panel>
        </aside>
      </section>
    </main>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function ProfilePill({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={`rounded-md bg-slate-50 px-3 py-2 ${className ?? ""}`}>
      <p className="font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SourceLink({ source, className }: { source: DataSource; className?: string }) {
  const href = sourceHref(source)

  return (
    <a
      href={href}
      className={`inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50 ${className ?? ""}`}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      Official source: {source.sourceName}
    </a>
  )
}
