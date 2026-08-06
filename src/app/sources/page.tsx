import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Sources — Official Country Evidence",
  description:
    "Official country-by-country sources used for CampCareer salary, study-cost, education, workforce and visa information.",
  path: "/sources",
})

const countrySources = [
  {
    name: "Australia",
    href: "/methodology/australia",
    coverage: "Salary, student costs, academic calendar, workforce demand, institutions and visa pathways.",
    additional: [
      {
        label: "QILT Graduate Outcomes Survey",
        href: "https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)",
      },
    ],
  },
  {
    name: "Canada",
    href: "/methodology/canada",
    coverage: "Salary, student costs, academic calendar, workforce projections, institutions and study-to-work pathways.",
    additional: [
      { label: "Statistics Canada", href: "https://www.statcan.gc.ca/" },
      { label: "Job Bank trend analysis", href: "https://www.jobbank.gc.ca/trend-analysis" },
      {
        label: "Post-Graduation Work Permit",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html",
      },
    ],
  },
  {
    name: "United States",
    href: "/methodology/united-states",
    coverage: "Salary, living costs, tuition, minimum wage, academic calendar, institutions and student-work rules.",
    additional: [
      { label: "BLS Occupational Outlook Handbook", href: "https://www.bls.gov/ooh/" },
      {
        label: "USCIS STEM OPT",
        href: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
      },
    ],
  },
  {
    name: "United Kingdom",
    href: "/methodology/united-kingdom",
    coverage: "Salary, student maintenance, tuition, minimum wage, academic calendar, demand, institutions and visas.",
    additional: [
      {
        label: "HESA Graduate Outcomes",
        href: "https://www.hesa.ac.uk/data-and-analysis/graduates",
      },
      { label: "Graduate visa", href: "https://www.gov.uk/graduate-visa" },
    ],
  },
  {
    name: "Ireland",
    href: "/methodology/ireland",
    coverage: "Earnings, student costs, tuition, minimum wage, academic calendar, institutions and work pathways.",
    additional: [
      {
        label: "HEA Graduate Outcomes",
        href: "https://hea.ie/statistics/graduate-outcomes-data-and-reports/",
      },
    ],
  },
  {
    name: "Germany",
    href: "/methodology/germany",
    coverage: "Country evidence for salary, study costs, education, workforce demand, institutions and visa pathways.",
    additional: [],
  },
  {
    name: "Netherlands",
    href: "/methodology/netherlands",
    coverage: "Country evidence for salary, study costs, education, workforce demand, institutions and visa pathways.",
    additional: [],
  },
  {
    name: "Belgium",
    href: "/methodology/belgium",
    coverage: "Country evidence for salary, study costs, education, workforce demand, institutions and visa pathways.",
    additional: [],
  },
  {
    name: "France",
    href: "/methodology/france",
    coverage: "Country evidence for salary, study costs, education, workforce demand, institutions and visa pathways.",
    additional: [],
  },
] as const

export default function SourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Sources", path: "/sources" }])} />

      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-blue-600">Evidence library</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Sources
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
          Official publications are organised by country so each source appears in one clear place.
          Country pages show the original publisher, source date, how CampCareer uses the evidence,
          and the limits of the resulting comparison.
        </p>
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {countrySources.map((country) => (
          <article key={country.name} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">{country.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{country.coverage}</p>

            {country.additional.length > 0 ? (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Additional model references
                </p>
                <ul className="mt-3 space-y-2">
                  {country.additional.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                      >
                        {source.label}
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href={country.href}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-blue-600"
            >
              View {country.name} sources
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-slate-900">Cross-country source</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Currency conversion on comparison pages uses Frankfurter&apos;s European Central Bank
          reference-rate feed. Local-currency values remain the source of record.
        </p>
        <a
          href="https://www.frankfurter.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
        >
          Frankfurter exchange-rate API
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </section>

      <p className="mt-8 text-xs leading-5 text-slate-500">
        Source links are consolidated here rather than repeated on the Methodology page. When a
        country source changes, CampCareer reviews the affected values before continuing to publish them.
      </p>
    </main>
  )
}
