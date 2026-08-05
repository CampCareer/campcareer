import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Canada Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's Canada salary, student living-cost, study-calendar, workforce-demand and institution information.",
  path: "/methodology/canada",
})

const sources = [
  {
    title: "Salary range",
    publisher: "CampCareer, using the Canada occupation dataset",
    source: "Canada NOC median salary distribution",
    url: "https://www.campcareer.com/methodology/canada",
    method:
      "The country card calculates the first quartile, median and third quartile across 514 occupation-level median annual salary values. The displayed range is CAD 49,025–83,200 a year and the ranking value is CAD 63,000.",
    coverage:
      "A distribution of occupation medians, not a distribution of individual workers. Source series include the Labour Force Survey, Employment Insurance survey data, the 2021 Census and selected administrative sources.",
    dataDate: "Dataset verified 3 July 2026",
  },
  {
    title: "Student living costs",
    publisher: "Immigration, Refugees and Citizenship Canada and EduCanada",
    source: "Financial support requirement and student budget guidance",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html",
    secondaryUrl: "https://www.educanada.ca/study-plan-etudes/budget-budget.aspx?lang=eng",
    method:
      "The lower bound converts the federal annual living-expense requirement of CAD 22,895 into a monthly amount. The upper bound combines the published high end of bounded EduCanada student budget items with the stated minimum amounts for utilities, phone and entertainment. The midpoint is used only for country comparison.",
    coverage:
      "One student outside Quebec. Excludes tuition and transportation to and from Canada. It is a planning range, not a market-price average; Quebec applies separate financial requirements.",
    dataDate: "Requirement effective 1 September 2025; checked August 2026",
  },
  {
    title: "Academic year",
    publisher: "Government of Canada",
    source: "Post-secondary education in Canada",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/education/school-types/post-secondary.html",
    method:
      "The country page summarises the common September–December and January–April terms and notes that some institutions offer a May–August term.",
    coverage: "National overview only. Institution and programme pages remain the final source for intake dates.",
    dataDate: "Checked August 2026",
  },
  {
    title: "Strong fields by workforce demand",
    publisher: "Employment and Social Development Canada",
    source: "Canadian Occupational Projection System",
    url: "https://occupations.esdc.gc.ca/sppc-cops/",
    method:
      "Broad study fields are shown where related occupations carry shortage, replacement-demand or projected-opening signals. They are discovery categories, not employment or immigration guarantees.",
    coverage: "National occupation projections interpreted alongside province-specific labour markets.",
    dataDate: "Checked August 2026",
  },
  {
    title: "Universities and public colleges",
    publisher: "Universities Canada and Colleges and Institutes Canada",
    source: "Member institution directories",
    url: "https://univcan.ca/about-universities-canada/our-members/",
    secondaryUrl: "https://www.collegesinstitutes.ca/colleges-and-institutes-in-your-community/our-members/",
    method:
      "The country page shows a concise representative set of major universities and public colleges or polytechnics. It is not a ranking or a complete provider directory.",
    coverage: "Representative national list used for country exploration.",
    dataDate: "Checked August 2026",
  },
  {
    title: "Visa and work pathways",
    publisher: "Immigration, Refugees and Citizenship Canada",
    source: "Study permits and working while studying",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work.html",
    method:
      "CampCareer links users to study, work and economic pathways but does not calculate an immigration success probability. Current eligibility depends on the programme, institution, province and individual circumstances.",
    coverage: "Planning and discovery only. Not immigration or legal advice.",
    dataDate: "Checked August 2026",
  },
] as const

export default function CanadaMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbLd([
          { name: "Methodology", path: "/methodology" },
          { name: "Canada", path: "/methodology/canada" },
        ])}
      />

      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">
        Sources &amp; methodology
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Canada sources
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The official sources and calculation rules behind the Canada country page. Values remain in
        Canadian dollars and are removed from display when published evidence cannot be read or is no
        longer verified.
      </p>

      <div className="mt-10 space-y-5">
        {sources.map((item) => (
          <section key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{item.publisher}</p>
              </div>
              <span className="shrink-0 text-xs font-medium text-slate-400">Data: {item.dataDate}</span>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
            >
              {item.source}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
            {"secondaryUrl" in item && item.secondaryUrl ? (
              <a
                href={item.secondaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
              >
                Secondary official source
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            ) : null}

            <dl className="mt-5 grid gap-4 text-sm leading-6 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-800">Method</dt>
                <dd className="mt-1 text-slate-600">{item.method}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">Coverage and limits</dt>
                <dd className="mt-1 text-slate-600">{item.coverage}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs leading-5 text-slate-500">
        Last reviewed 5 August 2026. A national range describes its source population or stated
        planning scenario; it does not predict an individual&apos;s salary, expenses or visa outcome.
      </p>
    </main>
  )
}
