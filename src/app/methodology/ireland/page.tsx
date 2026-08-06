import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Ireland Sources & Methodology",
  description: "Official sources and calculation methods used for CampCareer's Ireland salary, student costs, tuition, study-calendar, workforce-demand and visa information.",
  path: "/methodology/ireland",
})

const sources = [
  { title: "Annual earnings and sector range", publisher: "Central Statistics Office", source: "Earnings and Labour Costs Q1 2026 preliminary estimates", url: "https://www.cso.ie/en/releasesandpublications/ep/p-elcq/earningsandlabourcostsq42025finalq12026preliminaryestimates/", method: "The national average annual salary is the Q1 2026 average weekly earnings of EUR 1,075.58 multiplied by 52. The displayed EUR 44,130–66,381 range is the interquartile range across 13 annualised sector-average weekly earnings, with EUR 53,427 as the comparison value.", coverage: "The range describes variation across sector averages, not the pay distribution of individual employees or graduate starting salaries. Q1 2026 values are preliminary.", dataDate: "Q1 2026 preliminary" },
  { title: "Student living costs", publisher: "Immigration Service Delivery and HEA", source: "Information on Student Finances", url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-fee-paying-private-primary-or-secondary-school/information-on-student-finances/", secondaryUrl: "https://hea.ie/", method: "The lower bound annualises the immigration finance requirement of EUR 10,000 per year to EUR 833 per month. The upper and comparison value use the Eurostudent 8 observed monthly expenditure average of EUR 1,340.", coverage: "This deliberately combines a legal financial-evidence minimum with an observed survey average. Tuition is excluded and housing costs vary strongly by city.", dataDate: "Requirement checked 2026; Eurostudent 8 published 2023" },
  { title: "International undergraduate tuition", publisher: "Education in Ireland", source: "Undergraduate tuition fees 2025/26", url: "https://www.educationinireland.com/en/plan-your-study-abroad/undergraduate-tuition-fees", method: "The dataset stores EUR 10,300–29,000 as the mainstream non-EU undergraduate planning range.", coverage: "Medicine and health programmes can reach approximately EUR 62,500 and are excluded from the general range. Institution and course pages remain the final fee source.", dataDate: "2025/26" },
  { title: "Minimum hourly wage", publisher: "Government of Ireland", source: "National Minimum Wage increase on 1 January 2026", url: "https://www.gov.ie/en/publication/1786c-national-minimum-wage-increase-1-january/", method: "The dataset stores the EUR 14.15 statutory hourly rate for workers aged 20 and over.", coverage: "Younger workers have lower statutory rates, and actual pay depends on the role and employment contract.", dataDate: "Effective 1 January 2026" },
  { title: "Student visa fee and work limit", publisher: "Immigration Service Delivery", source: "Preclearance and entry visa fees", url: "https://www.irishimmigration.ie/preclearance-and-entry-visas-fees/", secondaryUrl: "https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/", method: "The dataset stores a EUR 60 single-entry study-visa fee and the Stamp 2 limit of 20 hours per week during term, rising to 40 hours in designated holiday periods.", coverage: "A separate EUR 300 immigration registration fee generally applies after arrival and is not included in the visa fee. Permission depends on the course and stamp conditions.", dataDate: "Checked 5 August 2026" },
  { title: "Academic year", publisher: "Education in Ireland", source: "Plan your study abroad", url: "https://www.educationinireland.com/en/plan-your-study-abroad/", method: "The country page summarises the common September-to-May academic year and notes selected January starts.", coverage: "Institution and programme calendars remain the final source for exact term dates.", dataDate: "Checked August 2026" },
  { title: "Strong fields and work opportunities", publisher: "Department of Enterprise", source: "Critical Skills Occupations List", url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/", method: "Broad study fields are linked to occupations appearing on the Critical Skills list.", coverage: "The list supports employment-permit eligibility analysis; it does not guarantee a job, salary or permit outcome.", dataDate: "Checked August 2026" },
  { title: "Universities and technological universities", publisher: "Education in Ireland", source: "Where can I study?", url: "https://www.educationinireland.com/en/where-can-i-study-/", method: "The country page shows a representative national selection of universities and technological universities.", coverage: "This is not a ranking or complete provider directory.", dataDate: "Checked August 2026" }
] as const

export default function IrelandMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Methodology", path: "/methodology" }, { name: "Ireland", path: "/methodology/ireland" }])} />
      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">Sources &amp; methodology</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Ireland sources</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">The official sources and calculation rules behind the Ireland country page. Values remain in euros and are removed from display when published evidence cannot be read or is no longer verified.</p>
      <div className="mt-10 space-y-5">
        {sources.map((item) => (
          <section key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"><div><h2 className="font-display text-lg font-semibold text-slate-900">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.publisher}</p></div><span className="shrink-0 text-xs font-medium text-slate-400">Data: {item.dataDate}</span></div>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">{item.source}<ExternalLink className="size-3.5" aria-hidden="true" /></a>
            {"secondaryUrl" in item && item.secondaryUrl ? <a href={item.secondaryUrl} target="_blank" rel="noopener noreferrer" className="ml-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">Secondary official source<ExternalLink className="size-3.5" aria-hidden="true" /></a> : null}
            <dl className="mt-5 grid gap-4 text-sm leading-6 sm:grid-cols-2"><div><dt className="font-semibold text-slate-800">Method</dt><dd className="mt-1 text-slate-600">{item.method}</dd></div><div><dt className="font-semibold text-slate-800">Coverage and limits</dt><dd className="mt-1 text-slate-600">{item.coverage}</dd></div></dl>
          </section>
        ))}
      </div>
      <p className="mt-8 text-xs leading-5 text-slate-500">Last reviewed 6 August 2026. A national range describes its source population or stated planning scenario; it does not predict an individual&apos;s salary, expenses, visa outcome or employment result.</p>
    </main>
  )
}
