import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Belgium Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's Belgium salary, student costs, tuition, study-calendar, workforce-demand and visa information.",
  path: "/methodology/belgium",
})

const sources = [
  {
    title: "Full-time salary distribution",
    publisher: "Statbel",
    source: "An overview of Belgian wages and salaries",
    url: "https://statbel.fgov.be/en/themes/work-training/wages-and-labourcost/overview-belgian-wages-and-salaries",
    method:
      "The dashboard annualises Statbel's gross monthly wage distribution for full-time employees. The lower bound is the 10th percentile, EUR 2,443 per month, and the upper bound is the 90th percentile, EUR 6,305 per month. Multiplying by twelve gives EUR 29,316–75,660 per year; the annualised median is EUR 44,736.",
    coverage:
      "This is a P10–P90 gross employee-wage distribution, not graduate starting pay. The source excludes irregular annual payments such as holiday pay and a thirteenth month, and the latest detailed official distribution currently available is for 2022.",
    dataDate: "2022 reference year; released 25 September 2024",
  },
  {
    title: "National average annual salary",
    publisher: "Statbel",
    source: "An overview of Belgian wages and salaries",
    url: "https://statbel.fgov.be/en/themes/work-training/wages-and-labourcost/overview-belgian-wages-and-salaries",
    method:
      "The calculation dataset stores EUR 48,912, equal to the official average gross monthly salary of EUR 4,076 multiplied by twelve.",
    coverage:
      "A gross mean for full-time employees. It is not net take-home pay, a median or a prediction of an individual's salary.",
    dataDate: "2022 reference year",
  },
  {
    title: "Student living costs and financial requirement",
    publisher: "Study in Flanders, Wallonie-Bruxelles Campus and Belgian Immigration Office",
    source: "Official regional student budgets and sufficient means of subsistence",
    url: "https://www.studyinflanders.be/practical-information/cost-of-living",
    secondaryUrl: "https://www.studyinbelgium.be/fr/quel-est-le-cout-de-la-vie-et-des-etudes-en-belgique-francophone",
    method:
      "The displayed EUR 800–1,300 monthly range combines the official Flanders and Brussels estimate of EUR 800–1,000 with the French-speaking Belgium estimate of EUR 1,000–1,300. The 2026–2027 immigration financial requirement of EUR 1,062 per month is stored as the comparison value.",
    coverage:
      "One student's planning budget with tuition excluded. Housing and city choice materially affect actual spending. The immigration threshold is a proof-of-funds rule, not a guarantee that the amount covers every student.",
    dataDate: "2026–2027 guidance checked 6 August 2026",
  },
  {
    title: "Non-EU tuition",
    publisher: "Study in Flanders and Wallonie-Bruxelles Campus",
    source: "Tuition fees for 2026–2027",
    url: "https://www.studyinflanders.be/practical-information/tuition-fees",
    secondaryUrl: "https://www.studyinbelgium.be/fr/etudier-en-belgique-francophone-les-frais-dinscription",
    method:
      "The national planning range uses the published Flemish non-EU guideline of EUR 2,300–9,500 for a full-time 60-ECTS degree. The standard 2026–2027 French-speaking Belgium total of EUR 5,369 sits within this range.",
    coverage:
      "Institutions set programme-specific fees and exceptions apply. Specialist, executive and privately funded programmes can differ, so the programme page remains the final source.",
    dataDate: "Academic year 2026–2027",
  },
  {
    title: "Minimum hourly remuneration benchmark",
    publisher: "Belgian Federal Public Service Employment",
    source: "Student employment contract and guaranteed average minimum monthly income",
    url: "https://employment.belgium.be/en/node/4096",
    method:
      "The dataset stores EUR 13.5644 per hour, the official 38-hour-week equivalent of the EUR 2,233.61 guaranteed average minimum monthly income for workers aged 21 and older from 1 July 2026.",
    coverage:
      "Belgium relies primarily on sectoral collective agreements rather than one universal statutory hourly wage. Sector minimums can be higher, and younger student-worker reference amounts are lower.",
    dataDate: "Effective 1 July 2026",
  },
  {
    title: "Academic year",
    publisher: "Study in Flanders and Wallonie-Bruxelles Campus",
    source: "Higher-education academic calendars",
    url: "https://www.studyinflanders.be/higher-education-in-flanders",
    secondaryUrl: "https://www.studyinbelgium.be/en/academic-calendar-studies-french-speaking-belgium",
    method:
      "The country page summarises a mid-September start, January and June examination periods and August or September resits. A February intake is marked as very limited.",
    coverage: "Institution and programme calendars remain authoritative for exact teaching, examination and holiday dates.",
    dataDate: "Checked 6 August 2026",
  },
  {
    title: "Strong fields and work opportunities",
    publisher: "VDAB and Le Forem",
    source: "Regional shortage-occupation lists",
    url: "https://www.vdab.be/trends-en-cijfers/knelpuntberoepenlijst",
    secondaryUrl: "https://www.leforem.be/a-propos/communiques-presse/metiers-en-penurie-2025.html",
    method:
      "Broad study fields are shown where related occupations repeatedly appear in official regional shortage lists, including nursing, industrial electromechanics, construction, accounting, ICT and education.",
    coverage:
      "Shortage status is regional and occupation-specific. It does not guarantee employment, salary, professional recognition or immigration eligibility.",
    dataDate: "VDAB 2026 and Le Forem 2025 lists",
  },
  {
    title: "Student visa fees and work limit",
    publisher: "Belgian Immigration Office and Student At Work",
    source: "Visa fees, contribution fee and foreign-student work rules",
    url: "https://dofi.ibz.be/en/themes/faq/visa-fees",
    secondaryUrl: "https://www.studentatwork.be/en/for-foreign-students.html",
    method:
      "The calculation dataset stores the EUR 250 Visa D fee effective from 1 July 2026. It also records the separate EUR 251 contribution fee normally applicable to a non-exempt student at a public higher-education institution. A residence permit marked labour market limited allows up to 20 hours per week during the school year and unlimited work during school holidays.",
    coverage:
      "Exemptions and private-institution applications differ. The residence card wording controls work rights, and study must remain the principal activity.",
    dataDate: "Fees effective in 2026; rules checked 6 August 2026",
  },
  {
    title: "Universities and colleges",
    publisher: "Study in Flanders and Wallonie-Bruxelles Campus",
    source: "Official programme and institution directories",
    url: "https://www.studyinflanders.be/programmes",
    secondaryUrl: "https://www.studyinbelgium.be/en/study-in-french-speaking-belgium",
    method:
      "The country page presents a representative bilingual set of research universities and a university of applied sciences. It is not a ranking or complete directory.",
    coverage: "Representative national list used for country exploration.",
    dataDate: "Directories checked 6 August 2026",
  },
] as const

export default function BelgiumMethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbLd([
          { name: "Methodology", path: "/methodology" },
          { name: "Belgium", path: "/methodology/belgium" },
        ])}
      />

      <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">
        Sources &amp; methodology
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Belgium sources
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The official sources and calculation rules behind the Belgium country page. Values remain in
        euros and are removed from display when published evidence cannot be read or is no longer verified.
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
        Last reviewed 6 August 2026. National and regional ranges describe their source populations or
        planning scenarios; they do not predict an individual&apos;s salary, expenses or visa outcome.
      </p>
    </main>
  )
}
