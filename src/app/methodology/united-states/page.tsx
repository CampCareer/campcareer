import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "United States Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's United States salary, student costs, tuition, study-calendar, workforce-demand and visa information.",
  path: "/methodology/united-states",
})

const sources = [
  {
    title: "Salary benchmark",
    publisher: "U.S. Bureau of Labor Statistics",
    source: "Occupational Employment and Wage Statistics, May 2025",
    url: "https://www.bls.gov/news.release/ocwage.t01.htm",
    method:
      "The lower bound annualises the all-occupation median hourly wage of USD 24.51 using 2,080 full-time hours. The upper bound is the published all-occupation mean annual wage of USD 69,770. The annualised median, USD 50,981, is used as the ranking value.",
    coverage:
      "A national median-to-mean wage benchmark for all occupations, not a percentile range or a promise of graduate earnings. Occupation, state, experience and working hours can materially change pay.",
    dataDate: "May 2025 data; released 15 May 2026",
  },
  {
    title: "Student living costs",
    publisher: "College Board",
    source: "Twelve-month living expense budgets",
    url: "https://highered.collegeboard.org/financial-aid/policies-research/budgets/12-month",
    method:
      "The 2025–26 national low budget of USD 24,240 and moderate budget of USD 36,180 are divided by 12. The displayed monthly range is USD 2,020–3,015 and the midpoint is used for country comparison.",
    coverage:
      "Planning guidance for independent, off-campus students. Tuition is excluded. It is not an on-campus boarding price or a city-specific market average.",
    dataDate: "2025–26 budget year; checked August 2026",
  },
  {
    title: "Annual tuition range",
    publisher: "College Board",
    source: "Trends in College Pricing 2025 highlights",
    url: "https://research.collegeboard.org/trends/college-pricing/highlights",
    method:
      "The calculation dataset stores USD 31,880 as the 2025–26 average published tuition and fees for public four-year out-of-state students and USD 45,000 for private nonprofit four-year students.",
    coverage:
      "A national undergraduate planning range before scholarships and institutional aid. Programme, institution and degree-level prices vary widely.",
    dataDate: "2025–26 academic year",
  },
  {
    title: "Minimum wage",
    publisher: "U.S. Department of Labor",
    source: "Federal minimum wage guidance",
    url: "https://www.dol.gov/agencies/whd/minimum-wage/faq",
    method:
      "The calculation dataset stores the federal floor of USD 7.25 per hour. State or local minimum wages may be higher and should replace the federal value in location-specific calculations.",
    coverage:
      "Covered nonexempt employment under the Fair Labor Standards Act. Exceptions and student-specific subminimum-wage certificates may apply in limited cases.",
    dataDate: "Effective 24 July 2009; checked August 2026",
  },
  {
    title: "Academic year",
    publisher: "EducationUSA, U.S. Department of State",
    source: "U.S. educational system FAQ",
    url: "https://educationusa.state.gov/experience-studying-usa/us-educational-system/frequently-asked-questions-faqs",
    method:
      "The country page summarises the common August-to-May academic year and notes semester, quarter and trimester calendars, with selected January and summer entry points.",
    coverage: "National overview only. Each institution and programme remains the final source for intake dates.",
    dataDate: "Checked August 2026",
  },
  {
    title: "Strong fields and work opportunities",
    publisher: "U.S. Bureau of Labor Statistics",
    source: "2024–34 Employment Projections",
    url: "https://www.bls.gov/emp/",
    method:
      "Broad study fields are shown where related occupations have strong projected percentage growth or large projected numbers of new jobs, including nursing, software, data, cybersecurity, renewable energy and health administration.",
    coverage:
      "National projections are discovery signals, not job-placement, salary, licensing or visa guarantees.",
    dataDate: "2024–34 projections; checked August 2026",
  },
  {
    title: "Student visa fee and work limit",
    publisher: "U.S. Department of State and U.S. Department of Homeland Security",
    source: "Student visa and F-1 employment guidance",
    url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
    secondaryUrl: "https://studyinthestates.dhs.gov/students/resources/working",
    method:
      "The calculation dataset stores the USD 185 F student-visa application fee and the general F-1 on-campus limit of 20 hours per week while school is in session.",
    coverage:
      "Visa issuance fees may vary by nationality. Employment eligibility depends on F-1 status, school authorisation, employment type and individual circumstances.",
    dataDate: "Checked August 2026",
  },
  {
    title: "Representative institutions",
    publisher: "U.S. Department of Education",
    source: "College Scorecard",
    url: "https://collegescorecard.ed.gov/",
    method:
      "The country page shows a concise representative set of universities and colleges across several states. It is not a ranking or a complete provider directory.",
    coverage: "Representative national list used for country exploration.",
    dataDate: "Checked August 2026",
  },
] as const

export default function UnitedStatesMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbLd([
          { name: "Methodology", path: "/methodology" },
          { name: "United States", path: "/methodology/united-states" },
        ])}
      />

      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">
        Sources &amp; methodology
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        United States sources
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The official sources and calculation rules behind the United States country page. Values
        remain in U.S. dollars and are removed from display when published evidence cannot be read
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
        Last reviewed 5 August 2026. A national benchmark describes its source population or stated
        planning scenario; it does not predict an individual&apos;s salary, expenses, admission or visa
        outcome.
      </p>
    </main>
  )
}
