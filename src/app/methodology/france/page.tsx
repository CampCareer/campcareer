import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "France Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's France salary, student costs, tuition, study-calendar, workforce-demand and visa information.",
  path: "/methodology/france",
})

const sources = [
  {
    title: "Salary distribution",
    publisher: "INSEE",
    source: "Private-sector salaries in 2024",
    url: "https://www.insee.fr/fr/statistiques/8657156",
    method:
      "The dashboard annualises the official monthly net full-time-equivalent first and ninth deciles: EUR 1,492 and EUR 4,334. The displayed range is EUR 17,904–52,008 and the comparison value is the annualised median of EUR 26,280.",
    coverage:
      "Net salary in full-time equivalent jobs in the private sector, not gross pay, graduate starting salary or the distribution of every worker. The 2024 publication expanded coverage to Mayotte and paid apprentices and trainees.",
    dataDate: "2024 earnings; released 23 October 2025",
  },
  {
    title: "National annual salary benchmark",
    publisher: "INSEE",
    source: "Private-sector salaries in 2024",
    url: "https://www.insee.fr/fr/statistiques/8657156",
    method:
      "The official average net salary of EUR 2,733 per month in full-time equivalent terms is multiplied by twelve, producing EUR 32,796 per year.",
    coverage:
      "A private-sector net mean. It is not gross compensation, disposable income after income tax, public-sector pay or a forecast of graduate earnings.",
    dataDate: "2024 earnings",
  },
  {
    title: "Student living-cost range",
    publisher: "France-Visas and Campus France",
    source: "2026 student resource requirement and budget guidance",
    url: "https://france-visas.gouv.fr/fr/web/france-visas",
    secondaryUrl: "https://www.campusfrance.org/fr/preparer-budget-etudiant-France",
    method:
      "The lower bound is the EUR 877.50 monthly resource requirement applying to long-stay study-visa applications submitted from 1 August 2026. The EUR 1,000 upper planning value reflects Campus France guidance for Paris, where living costs are generally higher.",
    coverage:
      "One student, excluding tuition. The visa threshold is a financial-evidence floor rather than a spending forecast, while actual housing costs vary substantially by city and accommodation type.",
    dataDate: "Resource threshold effective 1 August 2026",
  },
  {
    title: "International public-university tuition",
    publisher: "Campus France",
    source: "Cost of higher education in France",
    url: "https://www.campusfrance.org/en/tuition-fees-France",
    method:
      "The calculation layer stores the 2026–2027 differentiated public-institution fees for non-EU students: EUR 2,902 for Licence and EUR 3,950 for Master study.",
    coverage:
      "Public institutions under the relevant ministry. Exemptions are common, doctoral fees differ, and private schools or specialised programmes can charge more than EUR 10,000 per year.",
    dataDate: "Academic year 2026–2027",
  },
  {
    title: "Minimum hourly wage",
    publisher: "French Ministry of Labour",
    source: "Annual SMIC adjustment for 1 January 2026",
    url: "https://travail-emploi.gouv.fr/revalorisation-annuelle-du-smic-au-1er-janvier-2026",
    method:
      "The calculation layer stores the metropolitan gross SMIC of EUR 12.02 per hour from 1 January 2026.",
    coverage:
      "Gross statutory floor before employee deductions. Mayotte has a separate rate, and collective agreements or employers may set higher pay.",
    dataDate: "Effective 1 January 2026",
  },
  {
    title: "Academic year",
    publisher: "Campus France",
    source: "French higher education system",
    url: "https://www.campusfrance.org/en/French-higher-education",
    method:
      "The country page summarises the common September or October start and May or June end of second-semester teaching and examinations.",
    coverage:
      "National overview only. Exact term, examination, internship and delayed-intake dates are controlled by each institution and programme.",
    dataDate: "Checked 6 August 2026",
  },
  {
    title: "Strong fields and work opportunities",
    publisher: "France Travail",
    source: "Besoins en Main-d'Œuvre 2026",
    url: "https://statistiques.francetravail.org/bmo/bmopub?year=2026",
    method:
      "Study fields are selected where related occupations show high planned hiring volumes or a large number of difficult non-seasonal recruitment projects, especially health, IT and telecom, construction and industrial maintenance.",
    coverage:
      "Employer recruitment intentions, not guaranteed vacancies, visa eligibility, salaries or long-term employment outcomes. Hospitality has high volume but also substantial seasonality.",
    dataDate: "2026 employer survey",
  },
  {
    title: "Student visa fee and work permission",
    publisher: "France-Visas",
    source: "Student visa guidance",
    url: "https://www.france-visas.gouv.fr/web/france-visas/etudiant",
    method:
      "The calculation layer stores the standard EUR 99 long-stay student visa fee and the annual work allowance of 964 hours. A reduced EUR 50 visa fee applies to countries and territories using the Études en France procedure.",
    coverage:
      "Fees are indicative and service-provider charges can be additional. Algerian nationals have a separate 50% work-time rule, and work remains supplementary income rather than a complete funding plan.",
    dataDate: "Checked 6 August 2026",
  },
  {
    title: "Universities and specialist institutions",
    publisher: "France Universités and Campus France",
    source: "Member and institution directories",
    url: "https://franceuniversites.fr/les-etablissements-membres/",
    secondaryUrl: "https://www.campusfrance.org/en/French-higher-education",
    method:
      "The country page provides a representative geographic and institutional mix of public universities and specialist engineering institutions.",
    coverage: "Representative exploration list, not a ranking or complete directory.",
    dataDate: "Checked 6 August 2026",
  },
] as const

export default function FranceMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbLd([
          { name: "Methodology", path: "/methodology" },
          { name: "France", path: "/methodology/france" },
        ])}
      />

      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">
        Sources &amp; methodology
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        France sources
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The official sources and calculation rules behind the France country page. Values remain in
        euros and are removed from display when published evidence cannot be read or is no longer
        verified.
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
