import { COUNTRY_ROI_INSIGHTS, type DataConfidence, type DataSource } from "@/data/country-roi-mvp"

const confidenceLabel: Record<DataConfidence, string> = {
  official: "Official",
  "market-estimate": "Market estimate",
  "internal-estimate": "CampCareer estimate",
}

const confidenceClass: Record<DataConfidence, string> = {
  official: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "market-estimate": "border-blue-200 bg-blue-50 text-blue-800",
  "internal-estimate": "border-slate-200 bg-slate-50 text-slate-700",
}

const sourceRows = [
  { key: "salary", label: "Salary projection" },
  { key: "tax", label: "Tax preview" },
  { key: "rent", label: "Rent preview" },
  { key: "budget", label: "Initial budget" },
  { key: "policy", label: "Visa and policy" },
] as const

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value))
}

function sourceHref(source: DataSource) {
  return source.sourceUrl ?? "/methodology"
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function CountryQuickRoiPreview({ countryCode }: { countryCode: string }) {
  const country = COUNTRY_ROI_INSIGHTS.find((item) => item.code === countryCode)
  if (!country) return null

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Quick ROI preview</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniMetric label="First salary" value={country.salaries.first} />
        <MiniMetric label="5-year salary" value={country.salaries.year5} />
        <MiniMetric label="Rent" value={country.rent} />
        <MiniMetric label="Budget" value={country.initialBudget} />
      </div>
      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strong majors</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {country.bestMajors.map((major) => (
            <span key={major} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">{major}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}

export function CountryDecisionOverview({ countryCode }: { countryCode: string }) {
  const country = COUNTRY_ROI_INSIGHTS.find((item) => item.code === countryCode)
  if (!country) return null

  const salaryRows = [
    { label: "After graduation", value: country.salaries.first },
    { label: "After 3 years", value: country.salaries.year3 },
    { label: "After 5 years", value: country.salaries.year5 },
    { label: "After 10 years", value: country.salaries.year10 },
  ]
  const metricRows = [
    { label: "First salary", value: country.salaries.first, note: "Market entry estimate" },
    { label: "5-year salary", value: country.salaries.year5, note: "Mid-career preview" },
    { label: "Monthly rent", value: country.rent, note: country.cities },
    { label: "Initial budget", value: country.initialBudget, note: "Minimum to comfortable runway" },
    { label: "Tax preview", value: country.tax, note: "Simplified effective rate" },
    { label: "Policy route", value: country.policy, note: "Verify before applying" },
  ]

  return (
    <section className="mb-12 space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metricRows.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{metric.value}</p>
            <p className="mt-1 text-sm text-slate-500">{metric.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Panel title={`Who ${country.name} is best for`}><BulletList items={country.detail.bestFor} /></Panel>

          <Panel title="Salary projection">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3 font-semibold">Career point</th><th className="px-4 py-3 font-semibold">Expected salary</th></tr></thead>
                <tbody className="divide-y divide-slate-200">
                  {salaryRows.map((row) => <tr key={row.label}><td className="px-4 py-3 font-medium text-slate-700">{row.label}</td><td className="px-4 py-3 text-slate-950">{row.value}</td></tr>)}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Budget and take-home preview">
            <div className="grid gap-3 sm:grid-cols-3">
              {country.detail.budgetBreakdown.map((item) => <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p><p className="mt-2 text-xl font-semibold text-slate-950">{item.value}</p><p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p></div>)}
            </div>
          </Panel>

          <Panel title="Visa and policy signals">
            <BulletList items={country.detail.policyHighlights} />
            <a href={sourceHref(country.sources.policy)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50">Official source: {country.sources.policy.sourceName}</a>
          </Panel>

          <Panel title="Data confidence">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3 font-semibold">Data</th><th className="px-4 py-3 font-semibold">Confidence</th><th className="px-4 py-3 font-semibold">Source</th><th className="px-4 py-3 font-semibold">Checked</th></tr></thead>
                <tbody className="divide-y divide-slate-200">
                  {sourceRows.map(({ key, label }) => {
                    const source = country.sources[key]
                    const href = sourceHref(source)
                    return <tr key={key}><td className="px-4 py-3 font-medium text-slate-700">{label}</td><td className="px-4 py-3"><span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${confidenceClass[source.confidence]}`}>{confidenceLabel[source.confidence]}</span></td><td className="px-4 py-3"><a href={href} className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{source.sourceName}</a><p className="mt-1 text-xs leading-5 text-slate-500">{source.note}</p></td><td className="px-4 py-3 text-slate-600">{formatDate(source.lastChecked)}</td></tr>
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <Panel title="Risks to check first"><BulletList items={country.detail.watchouts} /></Panel>
        </aside>
      </div>
    </section>
  )
}

export function AustraliaQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="AU" />
}

export function AustraliaDecisionOverview() {
  return <CountryDecisionOverview countryCode="AU" />
}

export function UnitedStatesQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="US" />
}

export function UnitedStatesDecisionOverview() {
  return <CountryDecisionOverview countryCode="US" />
}

export function CanadaQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="CA" />
}

export function CanadaDecisionOverview() {
  return <CountryDecisionOverview countryCode="CA" />
}

export function IrelandQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="IE" />
}

export function IrelandDecisionOverview() {
  return <CountryDecisionOverview countryCode="IE" />
}

export function UnitedKingdomQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="UK" />
}

export function UnitedKingdomDecisionOverview() {
  return <CountryDecisionOverview countryCode="UK" />
}

export function GermanyQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="DE" />
}

export function GermanyDecisionOverview() {
  return <CountryDecisionOverview countryCode="DE" />
}

export function NetherlandsQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="NL" />
}

export function NetherlandsDecisionOverview() {
  return <CountryDecisionOverview countryCode="NL" />
}

export function BelgiumQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="BE" />
}

export function BelgiumDecisionOverview() {
  return <CountryDecisionOverview countryCode="BE" />
}

export function FranceQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="FR" />
}

export function FranceDecisionOverview() {
  return <CountryDecisionOverview countryCode="FR" />
}

export function SpainQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="ES" />
}

export function SpainDecisionOverview() {
  return <CountryDecisionOverview countryCode="ES" />
}

export function SingaporeQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="SG" />
}

export function SingaporeDecisionOverview() {
  return <CountryDecisionOverview countryCode="SG" />
}

export function SouthKoreaQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="KR" />
}

export function SouthKoreaDecisionOverview() {
  return <CountryDecisionOverview countryCode="KR" />
}

export function JapanQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="JP" />
}

export function JapanDecisionOverview() {
  return <CountryDecisionOverview countryCode="JP" />
}

export function NewZealandQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="NZ" />
}

export function NewZealandDecisionOverview() {
  return <CountryDecisionOverview countryCode="NZ" />
}

export function UnitedArabEmiratesQuickRoiPreview() {
  return <CountryQuickRoiPreview countryCode="AE" />
}

export function UnitedArabEmiratesDecisionOverview() {
  return <CountryDecisionOverview countryCode="AE" />
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-slate-950">{value}</p></div>
}
