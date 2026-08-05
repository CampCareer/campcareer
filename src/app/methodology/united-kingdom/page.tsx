import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "United Kingdom Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's United Kingdom salary, student costs, tuition, study-calendar, workforce-demand and visa information.",
  path: "/methodology/united-kingdom",
})

const sources = [
  {
    title: "Salary range",
    publisher: "Office for National Statistics and CampCareer",
    source: "Annual Survey of Hours and Earnings, 2025 provisional",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2025",
    method:
      "The country card calculates the first quartile, median and third quartile across 363 occupation-level median annual pay values in the United Kingdom occupation dataset. The displayed range is GBP 27,609–41,869 and the ranking value is GBP 34,250.",
    coverage:
      "A distribution of occupation medians, not a distribution of individual workers. The underlying ASHE estimates are provisional and occupation-level annual pay can reflect occupation-specific working patterns.",
    dataDate: "April 2025 data; occupation dataset verified 5 July 2026",
  },
  {
    title: "National annual earnings benchmark",
    publisher: "Office for National Statistics",
    source: "Employee earnings in the UK: 2025",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2025",
    method:
      "The calculation dataset stores GBP 39,039 as the national median gross annual earnings for full-time employees who had been in their jobs for at least one year.",
    coverage:
      "This is a national employee benchmark, not graduate starting pay or a mean salary. Self-employed workers are outside the ASHE employee sample.",
    dataDate: "April 2025 data; released 23 October 2025",
  },
  {
    title: "Student living-cost requirement",
    publisher: "UK Visas and Immigration",
    source: "Student visa financial requirement",
    url: "https://www.gov.uk/student-visa/money",
    method:
      "The monthly range uses the current Student visa maintenance requirements: GBP 1,171 outside London and GBP 1,529 in London. The midpoint is used only for country comparison.",
    coverage:
      "One student for up to nine months. Course fees are excluded. These are immigration financial-evidence thresholds, not market-price averages or a guarantee that the amount will cover every student’s actual costs.",
    dataDate: "Current requirement checked 5 August 2026",
  },
  {
    title: "International undergraduate tuition",
    publisher: "British Council — Study UK",
    source: "Cost of studying in the UK",
    url: "https://study-uk.britishcouncil.org/moving-uk/cost-studying",
    method:
      "The calculation dataset stores the published international undergraduate tuition range of GBP 11,400–38,000 per year.",
    coverage:
      "A broad national planning range. Medicine, laboratory-intensive courses and individual institutions may charge outside the typical range, and the provider’s current course page remains the final source.",
    dataDate: "Checked 5 August 2026",
  },
  {
    title: "Minimum hourly wage",
    publisher: "UK Government and Low Pay Commission",
    source: "National Minimum Wage and National Living Wage rates",
    url: "https://www.gov.uk/national-minimum-wage-rates",
    method:
      "The calculation dataset stores GBP 12.71 per hour, the National Living Wage rate for workers aged 21 and over from 1 April 2026.",
    coverage:
      "Younger workers and eligible apprentices have separate statutory rates. A student’s actual wage can be higher and depends on the role and employer.",
    dataDate: "Effective 1 April 2026",
  },
  {
    title: "Academic year",
    publisher: "British Council — Study UK",
    source: "How modules and courses work",
    url: "https://study-uk.britishcouncil.org/plan-studies/choosing-course/modules-courses",
    method:
      "The country page summarises the standard September or October to June or July academic year and notes that selected courses offer January or other flexible starts.",
    coverage: "National overview only. Institution and course pages remain the final source for exact term and intake dates.",
    dataDate: "Checked 5 August 2026",
  },
  {
    title: "Strong fields and work opportunities",
    publisher: "Skills England",
    source: "Occupations in demand: 2025",
    url: "https://www.gov.uk/government/publications/occupations-in-demand-2025",
    secondaryUrl:
      "https://www.gov.uk/government/publications/skills-england-annual-skills-report-and-sectoral-skills-needs-assessments-2026/skills-england-annual-skills-report-2026",
    method:
      "Broad study fields are shown where related occupations carry critical or elevated demand signals, or appear in priority sectors with substantial projected workforce growth.",
    coverage:
      "Demand classifications measure recruitment demand, not guaranteed shortages, salaries, visa eligibility or individual employment outcomes.",
    dataDate: "2025 demand release and 2026 annual skills report",
  },
  {
    title: "Student visa fee and work limit",
    publisher: "UK Home Office",
    source: "Student visa overview and Immigration Rules Appendix Student",
    url: "https://www.gov.uk/student-visa",
    secondaryUrl: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-student",
    method:
      "The calculation dataset stores a GBP 558 Student visa application fee and a 20-hour weekly term-time work limit for eligible full-time degree-level students at qualifying providers.",
    coverage:
      "Work permission depends on course level, sponsor type and visa conditions. Below-degree study can have a lower limit, and some students have no work permission.",
    dataDate: "Fee effective 8 April 2026; rules checked 5 August 2026",
  },
  {
    title: "Universities and colleges",
    publisher: "Universities UK and Association of Colleges",
    source: "Member institution and college directories",
    url: "https://www.universitiesuk.ac.uk/about-us/our-members",
    secondaryUrl: "https://www.aoc.co.uk/about/college-directory",
    method:
      "The country page shows a concise representative set across England, Scotland, Wales and Northern Ireland. It is not a ranking or a complete provider directory.",
    coverage: "Representative national list used for country exploration.",
    dataDate: "Checked 5 August 2026",
  },
] as const

export default function UnitedKingdomMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbLd([
          { name: "Methodology", path: "/methodology" },
          { name: "United Kingdom", path: "/methodology/united-kingdom" },
        ])}
      />

      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">
        Sources &amp; methodology
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        United Kingdom sources
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The official sources and calculation rules behind the United Kingdom country page. Values
        remain in pounds sterling and are removed from display when published evidence cannot be read
        or is no longer verified.
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
