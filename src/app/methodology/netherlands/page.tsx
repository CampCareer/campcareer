import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Netherlands Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's Netherlands salary, student costs, tuition, study-calendar, workforce-demand and visa information.",
  path: "/methodology/netherlands",
})

const sources = [
  {
    title: "Full-time annual salary range",
    publisher: "Statistics Netherlands (CBS) and CampCareer",
    source: "Employment, wages and working hours, 2025 provisional",
    url: "https://www.cbs.nl/en-gb/figures/detail/81462ENG",
    method:
      "CBS publishes total-job and part-time-job counts and average annual wages including bonuses. CampCareer derives approximate full-time averages for three employer-size groups using (total wage × total jobs − part-time wage × part-time jobs) ÷ full-time jobs. The resulting employer-size range is EUR 62,730–72,950 and the national estimate is EUR 69,290.",
    coverage:
      "Calculated from rounded aggregate table values, so results are approximate. This is a range of employer-size averages, not an individual-worker distribution, graduate starting salary or salary guarantee.",
    dataDate: "2025 provisional data; table updated 21 April 2026",
  },
  {
    title: "National annual salary benchmark",
    publisher: "Statistics Netherlands (CBS) and CampCareer",
    source: "Employment, wages and working hours, 2025 provisional",
    url: "https://www.cbs.nl/en-gb/figures/detail/81462ENG",
    method:
      "The calculation dataset stores EUR 69,290 as the approximate national average annual wage including bonuses for full-time employee jobs, derived from the published total and part-time aggregates.",
    coverage:
      "A mean for employee jobs rather than persons. Bonuses are included, values are provisional and the derivation uses rounded published aggregates.",
    dataDate: "2025 provisional data; table updated 21 April 2026",
  },
  {
    title: "Student living costs",
    publisher: "Study in NL — Nuffic",
    source: "Daily student expenses and cost of living",
    url: "https://www.studyinnl.org/finances/daily-student-expenses-and-cost-of-living-in-the-netherlands",
    secondaryUrl: "https://ind.nl/en/required-amounts-income-requirements",
    method:
      "The country card stores Study in NL's monthly student spending range of EUR 1,000–1,500. The midpoint is used only for country comparison.",
    coverage:
      "A broad planning range that varies by city, housing and lifestyle. Tuition is excluded. The separate IND 2026 study norm for higher education is EUR 1,130.77 per month and is an immigration financial requirement rather than a spending forecast.",
    dataDate: "Current guidance checked 6 August 2026; IND study norm valid throughout 2026",
  },
  {
    title: "International undergraduate tuition",
    publisher: "Study in NL — Nuffic",
    source: "Tuition fees",
    url: "https://www.studyinnl.org/finances/tuition-fees",
    method:
      "The calculation dataset stores the published average non-EU/EEA bachelor tuition range of EUR 9,000–20,000 per year.",
    coverage:
      "A national planning range. Institutional fees vary by programme, institution and field, and individual programme pages remain the final source.",
    dataDate: "Current guidance checked 6 August 2026",
  },
  {
    title: "Minimum hourly wage",
    publisher: "Government of the Netherlands",
    source: "Minimum wage amounts",
    url: "https://www.government.nl/themes/work/minimum-wage/minimum-wage-amounts",
    method:
      "The calculation dataset stores EUR 14.99 per hour, the statutory minimum wage for employees aged 21 and older from 1 July 2026.",
    coverage:
      "Workers under 21 have lower youth rates. Actual pay may be higher under collective agreements or employment contracts.",
    dataDate: "Effective 1 July 2026",
  },
  {
    title: "Academic year",
    publisher: "University of Amsterdam",
    source: "Academic calendar 2026–2027",
    url: "https://student.uva.nl/en/academic-calendar/2026-2027",
    method:
      "The country page summarises the common late-August or September to late-June structure. The representative UvA calendar runs from 31 August 2026 to 25 June 2027.",
    coverage:
      "Dutch tertiary institutions set their own calendars and programme dates. February starts are available only for selected programmes.",
    dataDate: "2026–2027 academic calendar",
  },
  {
    title: "Strong fields and work opportunities",
    publisher: "Employee Insurance Agency (UWV)",
    source: "Promising occupations for higher education graduates",
    url: "https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo",
    method:
      "Broad study fields are shown where UWV identifies related higher-education occupations as offering strong job prospects, including healthcare, ICT, teaching, construction, engineering and financial services.",
    coverage:
      "Promising-occupation status does not guarantee a vacancy, salary, visa, professional recognition or an individual employment outcome.",
    dataDate: "Current UWV guidance checked 6 August 2026",
  },
  {
    title: "Study permit fee and work limit",
    publisher: "Immigration and Naturalisation Service (IND)",
    source: "Study residence permit and application fees",
    url: "https://ind.nl/en/fees-costs-of-an-application",
    secondaryUrl:
      "https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education",
    method:
      "The calculation dataset stores a EUR 254 first study-residence-permit application fee and a 16-hour weekly employee-work limit. Students may instead work full time in June, July and August, and the employer must obtain a TWV work permit.",
    coverage:
      "Rules apply to non-EEA students holding the relevant study residence permit. Self-employment, internships and EU/EEA/Swiss nationals follow different conditions.",
    dataDate: "2026 fee and rules checked 6 August 2026",
  },
  {
    title: "Universities and universities of applied sciences",
    publisher: "Study in NL — Nuffic",
    source: "Institution-type directories",
    url: "https://www.studyinnl.org/dutch-education/research-universities",
    secondaryUrl: "https://www.studyinnl.org/dutch-education/universities-of-applied-sciences",
    method:
      "The country page shows a concise representative set of research universities and universities of applied sciences across major study regions. It is not a ranking or complete provider directory.",
    coverage: "Representative list used for country exploration.",
    dataDate: "Checked 6 August 2026",
  },
] as const

export default function NetherlandsMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbLd([
          { name: "Methodology", path: "/methodology" },
          { name: "Netherlands", path: "/methodology/netherlands" },
        ])}
      />

      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">
        Sources &amp; methodology
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Netherlands sources
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The official sources and calculation rules behind the Netherlands country page. Values remain
        in euros and are removed from display when published evidence cannot be read or is no longer verified.
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
        Last reviewed 6 August 2026. A national range describes its source population or stated
        planning scenario; it does not predict an individual&apos;s salary, expenses or visa outcome.
      </p>
    </main>
  )
}
