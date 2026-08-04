import { ExternalLink } from "lucide-react"

const sourceGroups = [
  {
    title: "Average salary",
    value: "AUD 106,657 per year",
    method:
      "Calculated from the Australian Bureau of Statistics full-time adult ordinary-time weekly earnings benchmark of AUD 2,051.10 multiplied by 52 weeks.",
    status: "Calculated from official observed data",
    period: "November 2025",
    links: [
      {
        label: "Australian Bureau of Statistics — Average Weekly Earnings, Australia",
        url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia/nov-2025",
      },
      {
        label: "ABS methodology — Average Weekly Earnings",
        url: "https://www.abs.gov.au/methodologies/average-weekly-earnings-australia-methodology/nov-2025",
      },
    ],
  },
  {
    title: "Minimum wage",
    value: "AUD 26.44 per hour",
    method:
      "Uses the National Minimum Wage for adult employees not covered by an award or enterprise agreement. The displayed casual benchmark applies the standard 25% casual loading.",
    status: "Observed official rate",
    period: "Effective 1 July 2026",
    links: [
      {
        label: "Fair Work Ombudsman — Minimum wages",
        url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
      },
      {
        label: "Fair Work Ombudsman — Annual Wage Review 2026",
        url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026",
      },
    ],
  },
  {
    title: "Shared living cost",
    value: "AUD 1,817 per month",
    method:
      "CampCareer calculates a five-city student baseline from Sydney, Melbourne, Brisbane, Perth and Adelaide. The same sharehouse profile is applied in every city and combines one room in shared housing, basic food, public transport and mobile service. Tuition, visa fees, health insurance and discretionary spending are excluded.",
    status: "Calculated estimate",
    period: "Underlying city evidence: January 2025",
    links: [
      {
        label: "Study Australia — Cost of Living Calculator",
        url: "https://costofliving.studyaustralia.gov.au/",
      },
    ],
  },
  {
    title: "Academic year",
    value: "Two main university semesters",
    method:
      "The country card summarises the common higher-education pattern rather than imposing one calendar on every provider. February–March is shown as the main start period, with July available for selected courses.",
    status: "Official sector guidance",
    period: "Reviewed August 2026",
    links: [
      {
        label: "Study Australia — Australia’s education system",
        url: "https://www.studyaustralia.gov.au/en/plan-your-studies/australias-education-system",
      },
    ],
  },
  {
    title: "Strong majors",
    value: "Workforce-demand study clusters",
    method:
      "CampCareer groups related study fields when current occupation-shortage evidence points to persistent demand. These labels are directional study signals, not guarantees of employment, migration eligibility or individual outcomes.",
    status: "Editorial grouping from official shortage evidence",
    period: "2025 Occupation Shortage List",
    links: [
      {
        label: "Jobs and Skills Australia — Occupation Shortage List",
        url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
      },
    ],
  },
  {
    title: "Major institutions",
    value: "Curated universities and public VET providers",
    method:
      "The display is a compact orientation list, not a ranking and not a complete provider directory. Research universities and selected state public VET systems are shown separately.",
    status: "Curated reference list",
    period: "Reviewed August 2026",
    links: [
      {
        label: "Study Australia — List of Australian universities",
        url: "https://www.studyaustralia.gov.au/en/plan-your-studies/list-of-australian-universities",
      },
      {
        label: "Group of Eight — Member universities",
        url: "https://go8.edu.au/about/the-go8",
      },
      {
        label: "TAFE NSW",
        url: "https://www.tafensw.edu.au/",
      },
      {
        label: "TAFE Queensland",
        url: "https://tafeqld.edu.au/home",
      },
    ],
  },
] as const

export function AustraliaCountrySources() {
  return (
    <section
      id="australia-country-data"
      className="mx-auto max-w-3xl px-6 pb-16 pt-2 text-sm leading-relaxed text-slate-600"
    >
      <div className="border-t border-slate-200 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
          Country data
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900">
          Australia sources &amp; methodology
        </h2>
        <p className="mt-3 text-slate-500">
          Country cards show the result only. Definitions, calculation choices, evidence type and
          original publishers are collected here so the dashboard stays compact without hiding how
          each value was produced.
        </p>

        <div className="mt-7 space-y-4">
          {sourceGroups.map((group) => (
            <article key={group.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    {group.title}
                  </h3>
                  <p className="mt-1 font-medium text-slate-700">{group.value}</p>
                </div>
                <span className="mt-1 shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 sm:mt-0">
                  {group.status}
                </span>
              </div>

              <p className="mt-3 text-slate-600">{group.method}</p>
              <p className="mt-2 text-xs text-slate-400">{group.period}</p>

              <div className="mt-4 flex flex-col items-start gap-2">
                {group.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                  >
                    {link.label}
                    <ExternalLink className="size-3.5" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          Values are national or scenario baselines, not personal forecasts. City, institution,
          programme, visa and occupation details may differ and should override these summaries when
          more specific verified evidence is available.
        </div>
      </div>
    </section>
  )
}
