import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Australia Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's Australia salary, student living-cost, study-calendar, workforce-demand and institution information.",
  path: "/methodology/australia",
})

const sources = [
  {
    title: "Salary range",
    publisher: "Australian Bureau of Statistics",
    source: "Employee Earnings and Hours, Australia, May 2025",
    url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings-and-hours-australia/may-2025",
    method:
      "The country card uses the first quartile, median and third quartile weekly total cash earnings for full-time persons. Each weekly value is multiplied by 52. The displayed range is AUD 74,048–133,120 a year and the ranking value is the median, AUD 98,124.",
    coverage: "Full-time persons nationally. Gross earnings before tax.",
    dataDate: "May 2025",
  },
  {
    title: "Student living costs",
    publisher: "Study Australia and CampCareer",
    source: "Australia five-city shared-housing student scenario",
    url: "https://costofliving.studyaustralia.gov.au/",
    method:
      "CampCareer uses controlled profiles for Adelaide, Brisbane, Melbourne, Perth and Sydney. The scenario is one international student renting one room in shared housing. The country range uses the lowest and highest monthly profiles; the ranking value is the five-city average.",
    coverage:
      "Includes housing, food, transport, utilities, phone and internet, and basic personal costs. Excludes tuition, visa fees, airfare, scholarships and employment income.",
    dataDate: "2025 scenario",
  },
  {
    title: "Academic year",
    publisher: "Study Australia",
    source: "Australia's education system",
    url: "https://www.studyaustralia.gov.au/en/plan-your-studies/australias-education-system",
    method:
      "The country page summarises the common February–March start and selected July intakes. Individual institutions and courses can use different calendars, including trimesters.",
    coverage: "National overview only. Provider course pages remain the final source for intake dates.",
    dataDate: "Checked August 2026",
  },
  {
    title: "Strong fields by workforce demand",
    publisher: "Jobs and Skills Australia",
    source: "2025 Occupation Shortage List",
    url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
    method:
      "Field groups are shown when several related occupations carry persistent national shortage signals. They are discovery categories, not guarantees of employment, sponsorship or permanent residence.",
    coverage: "National occupation-level shortage evidence grouped into broad study and career fields.",
    dataDate: "2025 list",
  },
  {
    title: "Universities and public VET providers",
    publisher: "Study Australia and Group of Eight",
    source: "Australian university and member lists",
    url: "https://www.studyaustralia.gov.au/en/plan-your-studies/list-of-australian-universities",
    secondaryUrl: "https://go8.edu.au/about/the-go8",
    method:
      "The country page shows a concise representative set of major universities and public TAFE or VET providers. It is not a ranking and is not intended to be a complete provider directory.",
    coverage: "Representative national list used for country exploration.",
    dataDate: "Checked August 2026",
  },
  {
    title: "Visa and skilled-work pathways",
    publisher: "Australian Department of Home Affairs",
    source: "Skilled occupation list and visa information",
    url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
    method:
      "CampCareer links users to study, temporary work and skilled pathways, but does not calculate an immigration success probability. Eligibility depends on the current visa rules and the user's individual circumstances.",
    coverage: "Planning and discovery only. Not immigration or legal advice.",
    dataDate: "Checked August 2026",
  },
] as const

export default function AustraliaMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbLd([
          { name: "Methodology", path: "/methodology" },
          { name: "Australia", path: "/methodology/australia" },
        ])}
      />

      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">
        Sources &amp; methodology
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Australia sources
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The official sources and calculation rules behind the Australia country page. Values remain in
        Australian dollars and are removed from display when the published evidence cannot be read or is no
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
                Group of Eight members
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
        Last reviewed 5 August 2026. A national range describes the source population or stated student
        scenario; it does not predict an individual's salary, expenses or visa outcome.
      </p>
    </main>
  )
}
