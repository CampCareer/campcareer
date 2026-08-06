import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Germany Sources & Methodology",
  description: "Official sources and calculation methods used for CampCareer's Germany salary, student costs, tuition, study-calendar, workforce-demand and visa information.",
  path: "/methodology/germany",
})

const sources = [
  { title: "Annual earnings", publisher: "Federal Statistical Office", source: "Earnings Survey 2025", url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/04/PD26_113_621.html", method: "The dashboard displays EUR 54,066–64,441, comparing the national full-time median with the arithmetic mean. EUR 54,066 is used as the comparison value and EUR 64,441 is stored separately as the mean benchmark.", coverage: "This is a median-to-mean benchmark, not a quartile range or graduate starting salary. The population covers qualifying full-time employment relationships.", dataDate: "2025 data; released April 2026" },
  { title: "Student living costs and finance", publisher: "Federal Government", source: "Studying in Germany", url: "https://www.make-it-in-germany.com/en/visa-residence/types/studying", secondaryUrl: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/", method: "The lower bound is the 2026 student-visa funding requirement of EUR 11,904 per year, or EUR 992 per month. The upper planning benchmark is EUR 1,200 per month from DAAD guidance.", coverage: "Tuition and semester contributions are excluded. Actual housing costs vary materially by city.", dataDate: "2026 requirement" },
  { title: "Public-university tuition", publisher: "DAAD", source: "Costs of education and living", url: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/", method: "The range stores EUR 0 for standard public-university tuition and EUR 3,000 per year for the Baden-Württemberg non-EU charge.", coverage: "Semester contributions, private universities, continuing-education programmes and programme-specific charges are excluded.", dataDate: "Checked 5 August 2026" },
  { title: "Minimum hourly wage", publisher: "Federal Ministry of Labour", source: "Statutory minimum wage", url: "https://www.bmas.de/EN/Labour/Minimum-Wage/the-minimum-wage-questions-and-answers.html", method: "The dataset stores the EUR 13.90 general statutory hourly minimum from 1 January 2026.", coverage: "Collective agreements, sector rules and limited exceptions can differ.", dataDate: "Effective 1 January 2026" },
  { title: "National visa fee", publisher: "Federal Foreign Office", source: "Visa fees for long-term stays", url: "https://www.auswaertiges-amt.de/en/visa-service/215870-215870", method: "The dataset stores the EUR 75 adult national-visa processing fee for long-term study.", coverage: "Document, translation, insurance and residence-permit costs are excluded.", dataDate: "Checked 5 August 2026" },
  { title: "Student work limit", publisher: "Make it in Germany", source: "Study and work rules for international students", url: "https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work", method: "The dataset stores the 20-hour weekly lecture-period benchmark and records the alternative annual allowance of 140 full or 280 half days.", coverage: "Exact permission depends on residence status, study conditions and the type of work.", dataDate: "Checked 5 August 2026" },
  { title: "Academic year", publisher: "DAAD", source: "Planning your studies", url: "https://www.daad.de/en/studying-in-germany/requirements/", method: "The country page summarises the common October winter-semester and April summer-semester starts.", coverage: "Institutions set their own application deadlines and semester calendars.", dataDate: "Checked August 2026" },
  { title: "Strong fields and institutions", publisher: "Make it in Germany and DAAD", source: "Professions in demand", url: "https://www.make-it-in-germany.com/en/working-in-germany/professions-in-demand", secondaryUrl: "https://www.daad.de/en/studying-in-germany/universities/", method: "Study fields are aligned with broad skilled-worker demand groups, while the institution list represents research and applied-science providers.", coverage: "Demand does not guarantee a vacancy, recognition, visa or employment result. The institution list is not a ranking.", dataDate: "Checked August 2026" }
] as const

export default function GermanyMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Methodology", path: "/methodology" }, { name: "Germany", path: "/methodology/germany" }])} />
      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">Sources &amp; methodology</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Germany sources</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">The official sources and calculation rules behind the Germany country page. Values remain in euros and are removed from display when published evidence cannot be read or is no longer verified.</p>
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
