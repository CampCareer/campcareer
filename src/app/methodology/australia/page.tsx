import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Australia Sources & Methodology",
  description:
    "Official sources and calculation methods used for CampCareer's Australia salary, student living-cost, study-calendar, workforce-demand, institution and occupation information.",
  path: "/methodology/australia",
})

type CountrySource = {
  title: string
  publisher: string
  source: string
  url: string
  secondaryUrl?: string
  secondaryLabel?: string
  method: string
  coverage: string
  dataDate: string
}

type OccupationSource = {
  title: string
  publisher: string
  source: string
  url: string
  use: string
}

type OccupationSourceSection = {
  id: string
  title: string
  description: string
  snapshot: string
  sources: readonly OccupationSource[]
}

const sources: readonly CountrySource[] = [
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
    secondaryLabel: "Group of Eight members",
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
]

const sharedLabourSources = {
  vacancies: {
    title: "Vacancies and state demand",
    publisher: "Jobs and Skills Australia",
    source: "Internet Vacancy Index",
    url: "https://www.jobsandskills.gov.au/data/internet-vacancy-index",
    use:
      "Supplies the dated national and state or territory online-vacancy series. When a workbook row cannot be directly machine-ingested, CampCareer either leaves the value unavailable or records the indexed extraction provenance in the dated snapshot.",
  },
  projections: {
    title: "Employment outlook",
    publisher: "Jobs and Skills Australia",
    source: "Employment projections",
    url: "https://www.jobsandskills.gov.au/data/employment-projections",
    use:
      "Supplies the five-year and ten-year employment-growth inputs used in the Career Opportunity Score. Extraction provenance is retained when the official workbook cannot be directly machine-read.",
  },
  shortage: {
    title: "Shortage status",
    publisher: "Jobs and Skills Australia",
    source: "Occupation Shortage List",
    url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
    use:
      "Provides the official national and jurisdiction-level shortage evidence used in the shortage component of the score.",
  },
  visa: {
    title: "Skilled visa pathways",
    publisher: "Australian Department of Home Affairs",
    source: "Skilled occupation list",
    url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
    use:
      "Checks current skilled-work pathway coverage. Occupation-list inclusion does not determine an individual's eligibility.",
  },
} satisfies Record<string, OccupationSource>

const occupationSourceSections: readonly OccupationSourceSection[] = [
  {
    id: "registered-nurse",
    title: "Registered Nurse",
    description:
      "Evidence supporting the Australia Registered Nurse occupation dashboard and its Career Opportunity Score.",
    snapshot: "1 May 2026",
    sources: [
      {
        title: "Official occupation scope",
        publisher: "Australian Bureau of Statistics",
        source: "OSCA 2654 Registered Nurses",
        url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/2/26/265/2654",
        use: "Defines the registered nurse occupations included in the CampCareer rollup.",
      },
      {
        title: "Employment and earnings",
        publisher: "Jobs and Skills Australia",
        source: "Registered Nurses occupation profile",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2544-registered-nurses",
        use: "Supplies the employment, earnings, demographic and working-hours snapshot on the published legacy ANZSCO series.",
      },
      sharedLabourSources.vacancies,
      sharedLabourSources.projections,
      {
        title: "Registration requirements",
        publisher: "Nursing and Midwifery Board of Australia",
        source: "Registration standards",
        url: "https://www.nursingmidwiferyboard.gov.au/Registration-Standards.aspx",
        use: "Defines the professional registration standards that applicants and practising registered nurses must meet.",
      },
      sharedLabourSources.visa,
    ],
  },
  {
    id: "electrician",
    title: "Electrician",
    description:
      "Evidence supporting the Australia Electrician occupation dashboard, licensing pathway and Career Opportunity Score.",
    snapshot: "1 May 2026",
    sources: [
      {
        title: "Official occupation scope",
        publisher: "Australian Bureau of Statistics",
        source: "OSCA 3812 Electricians",
        url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/38/381/3812",
        use: "Defines Electrician (General), Electrical Fitter and Industrial Electrician as the occupations included in the CampCareer electrician rollup.",
      },
      {
        title: "Employment and earnings",
        publisher: "Jobs and Skills Australia",
        source: "Electricians occupation profile",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3411-electricians",
        use: "Supplies the employment, earnings, demographic and working-hours snapshot on the published legacy ANZSCO series.",
      },
      sharedLabourSources.vacancies,
      sharedLabourSources.projections,
      {
        title: "Training pathway",
        publisher: "Australian Government National Training Register",
        source: "UEE30820 Certificate III in Electrotechnology Electrician",
        url: "https://training.gov.au/Training/Details/UEE30820",
        use: "Defines the principal trade qualification connected to the paid electrical apprenticeship pathway.",
      },
      {
        title: "Electrical licensing",
        publisher: "Electrical Regulatory Authorities Council",
        source: "Electrical licensing",
        url: "https://www.erac.gov.au/licensing/electrical-licensing/",
        use: "Explains that electrical licensing is administered by state and territory regulators.",
      },
      sharedLabourSources.visa,
    ],
  },
  {
    id: "carpenter",
    title: "Carpenter",
    description:
      "Evidence supporting the Australia Carpenter occupation dashboard, apprenticeship pathway and Career Opportunity Score.",
    snapshot: "1 May 2026",
    sources: [
      {
        title: "Official occupation scope",
        publisher: "Australian Bureau of Statistics",
        source: "OSCA 3721 Carpenters and Joiners",
        url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/37/372/3721",
        use: "Defines Carpenter and Joiner, Carpenter, and Joiner as the three occupations included in the CampCareer carpenter rollup.",
      },
      {
        title: "Employment and earnings",
        publisher: "Jobs and Skills Australia",
        source: "Carpenters and Joiners occupation profile",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3312-carpenters-and-joiners",
        use: "Supplies employment, earnings, demographic and working-hours data on the published legacy ANZSCO series.",
      },
      sharedLabourSources.vacancies,
      sharedLabourSources.projections,
      sharedLabourSources.shortage,
      {
        title: "Training pathway",
        publisher: "Australian Government National Training Register",
        source: "CPC30220 Certificate III in Carpentry",
        url: "https://training.gov.au/Training/Details/CPC30220",
        use: "Defines the principal trade qualification connected to the Australian carpentry apprenticeship pathway.",
      },
      {
        title: "Construction induction",
        publisher: "Safe Work Australia",
        source: "Working on a construction site",
        url: "https://www.safeworkaustralia.gov.au/safety-topic/industry-and-business/construction/working-construction-site",
        use: "Explains the general construction induction training and White Card requirement for construction-site work.",
      },
      sharedLabourSources.visa,
    ],
  },
  {
    id: "plumber",
    title: "Plumber",
    description:
      "Evidence supporting the Australia Plumber occupation dashboard, apprenticeship and licensing pathway, and provisional Career Opportunity Score.",
    snapshot: "1 May 2026",
    sources: [
      {
        title: "Official occupation scope",
        publisher: "Australian Bureau of Statistics",
        source: "OSCA Minor Group 363 Plumbers",
        url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/36/363",
        use: "Defines the six plumbing occupations included in the CampCareer rollup and their current OSCA codes.",
      },
      {
        title: "Employment and earnings",
        publisher: "Jobs and Skills Australia",
        source: "Plumbers occupation profile",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3341-plumbers",
        use: "Supplies employment, earnings, demographic and working-hours data on the published legacy ANZSCO series.",
      },
      sharedLabourSources.vacancies,
      sharedLabourSources.projections,
      sharedLabourSources.shortage,
      {
        title: "Training pathway",
        publisher: "Australian Government National Training Register",
        source: "CPC32420 Certificate III in Plumbing",
        url: "https://training.gov.au/Training/Details/CPC32420",
        use: "Defines the principal trade qualification connected to the Australian plumbing apprenticeship pathway.",
      },
      {
        title: "Plumbing licensing",
        publisher: "Australian Building Codes Board",
        source: "State and territory building and plumbing administrations",
        url: "https://www.abcb.gov.au/support/state-and-territory-building-and-plumbing-administrations",
        use: "Identifies the jurisdictional administrations responsible for plumbing registration, licensing and technical requirements.",
      },
      sharedLabourSources.visa,
    ],
  },
  {
    id: "wall-floor-tiler",
    title: "Wall and Floor Tiler",
    description:
      "Evidence supporting the Australia Wall and Floor Tiler occupation dashboard, apprenticeship and jurisdiction-specific licensing pathway, and provisional Career Opportunity Score. JSA publishes occupation earnings as N/A; May 2026 vacancy and May 2025–2035 projection figures are tied to the official JSA releases with indexed extraction provenance retained in the Supabase snapshot until direct workbook ingestion is available.",
    snapshot: "1 May 2026",
    sources: [
      {
        title: "Official occupation scope",
        publisher: "Australian Bureau of Statistics",
        source: "OSCA 362431 Wall and Floor Tiler",
        url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/36/362/3624/362431",
        use: "Defines the current occupation, skill level, specialisations and tasks. It also notes that registration or licensing may be required.",
      },
      {
        title: "Employment and earnings",
        publisher: "Jobs and Skills Australia",
        source: "Wall and Floor Tilers occupation profile",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3334-wall-and-floor-tilers",
        use: "Supplies employment, part-time share, female share, median age and full-time hours on the published legacy ANZSCO series. Median weekly and hourly earnings are officially N/A because of a high standard error and are not estimated by CampCareer.",
      },
      sharedLabourSources.vacancies,
      sharedLabourSources.projections,
      sharedLabourSources.shortage,
      {
        title: "Training pathway",
        publisher: "Australian Government National Training Register",
        source: "CPC31320 Certificate III in Wall and Floor Tiling",
        url: "https://training.gov.au/Training/Details/CPC31320",
        use: "Defines the current trade qualification, identifies it as suitable for an Australian apprenticeship pathway and notes jurisdiction-specific regulatory requirements and construction induction.",
      },
      {
        title: "Trade licensing example",
        publisher: "NSW Government",
        source: "Wall and floor tiling work",
        url: "https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/wall-and-floor-tiling-work",
        use: "Shows a current jurisdiction-specific licensing rule: NSW requires the relevant contractor licence or certificate for regulated residential wall and floor tiling work, including work above the published value threshold.",
      },
      {
        title: "Construction induction",
        publisher: "Safe Work Australia",
        source: "Working on a construction site",
        url: "https://www.safeworkaustralia.gov.au/safety-topic/industry-and-business/construction/working-construction-site",
        use: "Supports the general construction induction and White Card requirement for construction-site work.",
      },
      {
        title: "Skills assessment",
        publisher: "Trades Recognition Australia",
        source: "Occupations assessed by Trades Recognition Australia",
        url: "https://www.tradesrecognitionaustralia.gov.au/occupations-assessed-trades-recognition-australia",
        use: "Confirms Wall and Floor Tiler is within the trade occupations assessed by TRA for relevant skills-assessment programs.",
      },
      sharedLabourSources.visa,
    ],
  },
  {
    id: "welder",
    title: "Welder",
    description:
      "Evidence supporting the Australia Welder occupation dashboard, fabrication apprenticeship pathway and provisional Career Opportunity Score. CampCareer rolls the canonical career to OSCA 3311 so the three mapped welding and fabrication occupations align with the JSA ANZSCO 3223 labour-market series. May 2026 vacancy and May 2025–2035 projection figures retain indexed extraction provenance until the official workbook rows can be directly machine-ingested.",
    snapshot: "1 May 2026",
    sources: [
      {
        title: "Official occupation scope",
        publisher: "Australian Bureau of Statistics",
        source: "OSCA 3311 Structural Steel and Welding Trades Workers",
        url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/33/331/3311",
        use: "Defines Metal Fabricator, Pressure Welder and Welder (First Class) as the three current occupations included in the CampCareer welder rollup.",
      },
      {
        title: "Employment and earnings",
        publisher: "Jobs and Skills Australia",
        source: "Structural Steel and Welding Trades Workers occupation profile",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/3223-structural-steel-and-welding-trades-workers",
        use: "Supplies employment, earnings, part-time share, female share, median age and full-time hours on the published legacy ANZSCO 3223 series used for the rollup.",
      },
      sharedLabourSources.vacancies,
      sharedLabourSources.projections,
      sharedLabourSources.shortage,
      {
        title: "Training pathway",
        publisher: "Australian Government National Training Register",
        source: "MEM31925 Certificate III in Engineering – Fabrication Trade",
        url: "https://training.gov.au/Training/Details/MEM31925",
        use: "Defines the current fabrication trade qualification, which is specifically developed for apprentices and undertaken through a Training Contract or formal trade-recognition assessment process.",
      },
      {
        title: "Construction induction",
        publisher: "Safe Work Australia",
        source: "Working on a construction site",
        url: "https://www.safeworkaustralia.gov.au/safety-topic/industry-and-business/construction/working-construction-site",
        use: "Supports the general construction induction and White Card requirement where welding or fabrication work is performed on a construction site.",
      },
      {
        title: "Skills assessment",
        publisher: "Trades Recognition Australia",
        source: "OSAP nominated occupations, countries and SARs",
        url: "https://www.tradesrecognitionaustralia.gov.au/osap-nominated-occupations-countries-and-sars",
        use: "Lists Metal Fabricator, Pressure Welder and Welder (First Class) among trade occupations assessed through relevant TRA programs and distinguishes skills assessment from domestic occupational licensing.",
      },
      sharedLabourSources.visa,
    ],
  },
  {
    id: "bricklayer",
    title: "Bricklayer",
    description:
      "Evidence supporting the Australia Bricklayer occupation dashboard, apprenticeship and jurisdiction-specific licensing pathway, and provisional Career Opportunity Score. CampCareer rolls the canonical career to OSCA 3711 so Bricklayer and Stonemason align with the JSA ANZSCO 3311 labour-market series. Current IVI values remain unavailable until the official ANZSCO4 workbook row can be directly machine-ingested.",
    snapshot: "1 May 2026",
    sources: [
      {
        title: "Official occupation scope",
        publisher: "Australian Bureau of Statistics",
        source: "OSCA 3711 Bricklayers and Stonemasons",
        url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/37/371/3711",
        use: "Defines Bricklayer and Stonemason as the two current occupations included in the CampCareer bricklayer rollup; OSCA 371131 Bricklayer notes that registration or licensing may be required.",
      },
      {
        title: "Employment and earnings",
        publisher: "Jobs and Skills Australia",
        source: "Bricklayers and Stonemasons occupation profile",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3311-bricklayers-and-stonemasons",
        use: "Supplies employment, median weekly and hourly earnings, part-time share, female share, median age and full-time hours on the published legacy ANZSCO 3311 series used for the rollup.",
      },
      sharedLabourSources.vacancies,
      sharedLabourSources.projections,
      sharedLabourSources.shortage,
      {
        title: "Training pathway",
        publisher: "Australian Government National Training Register",
        source: "CPC33020 Certificate III in Bricklaying and Blocklaying",
        url: "https://training.gov.au/Training/Details/CPC33020",
        use: "Defines the current Bricklayer trade qualification. The qualification is used in apprenticeship pathways and is also listed by NSW as a current qualification for bricklaying licensing.",
      },
      {
        title: "Trade licensing example",
        publisher: "NSW Government",
        source: "Bricklaying work",
        url: "https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/bricklaying-work",
        use: "Shows a current jurisdiction-specific rule: NSW requires the relevant contractor licence or certificate for regulated residential bricklaying work above AUD 5,000 and lists CPC33020 among the accepted qualifications.",
      },
      {
        title: "Construction induction",
        publisher: "Safe Work Australia",
        source: "Working on a construction site",
        url: "https://www.safeworkaustralia.gov.au/safety-topic/industry-and-business/construction/working-construction-site",
        use: "Supports the general construction induction and White Card requirement for construction-site work.",
      },
      {
        title: "Skills assessment",
        publisher: "Trades Recognition Australia",
        source: "Occupations assessed by Trades Recognition Australia",
        url: "https://www.tradesrecognitionaustralia.gov.au/occupations-assessed-trades-recognition-australia",
        use: "Confirms Bricklayer is within the trade occupations assessed by TRA for relevant migration skills-assessment programs; skills assessment is separate from domestic licensing.",
      },
      sharedLabourSources.visa,
    ],
  },
]

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
        The official sources and calculation rules behind Australia country and occupation pages. Values remain
        in Australian dollars and are removed from display when the published evidence cannot be read or is no
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
            {item.secondaryUrl ? (
              <a
                href={item.secondaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
              >
                {item.secondaryLabel}
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

      <div className="mt-12 space-y-6">
        {occupationSourceSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-20 rounded-3xl border border-blue-100 bg-blue-50/50 p-5 sm:p-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Occupation sources</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{section.description}</p>
              </div>
              <span className="shrink-0 text-xs font-medium text-slate-500">
                Snapshot: {section.snapshot}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {section.sources.map((item) => (
                <article key={`${section.id}-${item.url}`} className="rounded-2xl border border-blue-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.title}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.publisher}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {item.source}
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{item.use}</p>
                </article>
              ))}
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Source links checked 7 August 2026. Numeric values are stored as dated Supabase snapshots so the
              Occupation and Compare pages can reuse the same record without copying figures into UI code.
            </p>
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs leading-5 text-slate-500">
        Last reviewed 7 August 2026. A national range or occupation snapshot describes the stated source
        population; it does not predict an individual&apos;s salary, expenses, registration or visa outcome.
      </p>
    </main>
  )
}
