"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CA_PROVINCE_CODES,
  CA_PROVINCE_NAMES,
  DE_BUNDESLAND_CODES,
  DE_BUNDESLAND_NAMES,
  IE_COUNTY_CODES,
  IE_COUNTY_NAMES,
  NL_PROVINCE_CODES,
  NL_PROVINCE_NAMES,
  STATE_CODES,
  STATE_NAMES,
  UK_REGION_CODES,
  UK_REGION_NAMES,
  US_STATE_CODES,
  US_STATE_NAMES,
} from "@/app/map/states"
import {
  BUDGET_OPTIONS,
  COUNTRY_ROI_DATA_META,
  COUNTRY_ROI_INSIGHTS,
  FIELD_OPTIONS,
  GOAL_OPTIONS,
  type BudgetKey,
  type CountryRoiInsight,
  type DataConfidence,
  type FieldKey,
  type GoalKey,
} from "@/data/country-roi-mvp"
import { track } from "@/lib/analytics"

const COUNTRIES = [
  { value: "au", name: "Australia", enabled: true },
  { value: "us", name: "United States", enabled: true },
  { value: "ca", name: "Canada", enabled: true },
  { value: "uk", name: "United Kingdom", enabled: true },
  { value: "ie", name: "Ireland", enabled: true },
  { value: "de", name: "Germany", enabled: true },
  { value: "nl", name: "Netherlands", enabled: true },
] as const

const segmentTrigger =
  "h-9 w-full justify-between border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm data-[size=default]:h-9"

export function HomeFinder() {
  const router = useRouter()
  const [field, setField] = useState<FieldKey>("software")
  const [budget, setBudget] = useState<BudgetKey>("balanced")
  const [goal, setGoal] = useState<GoalKey>("immigration")
  const [mapCountry, setMapCountry] = useState("au")
  const [state, setState] = useState("NSW")
  const [tab, setTab] = useState<"shortage" | "pay">("shortage")

  const rankedCountries = useMemo(() => {
    return COUNTRY_ROI_INSIGHTS.map((country) => ({
      ...country,
      matchScore: Math.round(
        country.score[field] * 0.45 +
          country.goalFit[goal] * 0.35 +
          country.budgetFit[budget] * 0.2,
      ),
    })).sort((a, b) => b.matchScore - a.matchScore)
  }, [budget, field, goal])

  const activeCountry = rankedCountries[0]
  const mapConfig = getMapConfig(mapCountry)
  const stateItems = useMemo<Record<string, string>>(
    () => Object.fromEntries(mapConfig.codes.map((code) => [code, mapConfig.names[code]])),
    [mapConfig.codes, mapConfig.names],
  )

  useEffect(() => {
    setState(getDefaultState(mapCountry))
  }, [mapCountry])

  function goToPersonalizedResult() {
    track("landing_personalized_country_click", {
      field,
      budget,
      goal,
      top_country: activeCountry.code,
    })
    router.push(`${activeCountry.href}?field=${field}&budget=${budget}&goal=${goal}`)
  }

  function goToMapSearch() {
    track("finder_search", { country: mapCountry, state, tab })
    router.push(`/map?country=${mapCountry}&state=${state}&tab=${tab}`)
  }

  return (
    <div className="bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200">
        <Image
          src="/landing/country-roi-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.88)_38%,rgba(255,255,255,0.42)_74%,rgba(255,255,255,0.22)_100%)]" />

        <div className="relative mx-auto grid min-h-[calc(100svh-9rem)] w-full max-w-7xl items-center gap-8 px-4 pt-10 pb-4 sm:px-6 lg:min-h-[620px] lg:grid-cols-[minmax(0,1fr)_440px] lg:py-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Free country ROI previews
            </div>
            <h1 className="max-w-3xl text-[2.15rem] font-semibold leading-[1.03] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Find the best country for your degree, salary, and immigration goals.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Compare study destinations by major rankings, graduate salary, tax,
              rent, visa policy, and the budget you actually need before you move.
            </p>

            <div className="mt-7 grid max-w-3xl grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-900/10 backdrop-blur sm:grid-cols-[1fr_1fr_1fr_auto]">
              <FilterSegment label="Major">
                <Select
                  items={FIELD_OPTIONS}
                  value={field}
                  onValueChange={(value) => value && setField(value as FieldKey)}
                >
                  <SelectTrigger className={segmentTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FIELD_OPTIONS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSegment>

              <FilterSegment label="Budget">
                <Select
                  items={BUDGET_OPTIONS}
                  value={budget}
                  onValueChange={(value) => value && setBudget(value as BudgetKey)}
                >
                  <SelectTrigger className={segmentTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BUDGET_OPTIONS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSegment>

              <FilterSegment label="Goal">
                <Select
                  items={GOAL_OPTIONS}
                  value={goal}
                  onValueChange={(value) => value && setGoal(value as GoalKey)}
                >
                  <SelectTrigger className={segmentTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GOAL_OPTIONS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSegment>

              <button
                type="button"
                onClick={goToPersonalizedResult}
                className="col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-slate-800 sm:col-span-1 sm:h-[58px] sm:self-end"
              >
                <Search className="h-4 w-4" />
                Match
              </button>
            </div>

            <div className="mt-6 hidden max-w-2xl gap-3 sm:grid sm:grid-cols-3">
              <ProofPoint icon={BarChart3} label="Salary projection" value="0 / 3 / 5 / 10 yrs" />
              <ProofPoint icon={Calculator} label="Living cost" value="Tax, rent, budget" />
              <ProofPoint icon={GraduationCap} label="Study path" value="Major to career ROI" />
            </div>
          </div>

          <div className="relative hidden lg:block lg:self-end">
            <div className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Best match preview
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    {activeCountry.name}
                  </h2>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xl font-bold text-emerald-700">
                  {activeCountry.matchScore}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="First salary" value={activeCountry.salaries.first} />
                <Metric label="5-year salary" value={activeCountry.salaries.year5} />
                <Metric label="Monthly rent" value={activeCountry.rent} />
                <Metric label="Budget needed" value={activeCountry.initialBudget} />
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Strong majors
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeCountry.bestMajors.map((major) => (
                    <span
                      key={major}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      {major}
                    </span>
                  ))}
                </div>
              </div>

              <DataQualityLine
                className="mt-4"
                confidence={activeCountry.sources.policy.confidence}
                sourceName={activeCountry.sources.policy.sourceName}
                lastChecked={activeCountry.sources.policy.lastChecked}
              />

              <Link
                href={activeCountry.href}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-press"
              >
                Open country page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                Country cards
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Compare countries by career ROI, not vague popularity.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                MVP dataset {COUNTRY_ROI_DATA_META.version} · Updated{" "}
                {formatIsoDate(COUNTRY_ROI_DATA_META.lastUpdated)} ·{" "}
                {COUNTRY_ROI_DATA_META.note}
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand-press"
            >
              Compare more paths
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {rankedCountries.map((country, index) => (
              <CountryCard key={country.code} country={country} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              Calculators
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Show the numbers people actually need before applying.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <CalculatorTile
                icon={Calculator}
                title="Minimum budget"
                body="Tuition, visa proof, rent deposit, flights, and first 90 days."
              />
              <CalculatorTile
                icon={BriefcaseBusiness}
                title="Graduate salary"
                body="Expected salary after graduation and at 3, 5, and 10 years."
              />
              <CalculatorTile
                icon={BarChart3}
                title="Take-home pay"
                body="Estimated tax and disposable income by country."
              />
              <CalculatorTile
                icon={SlidersHorizontal}
                title="Personal fit"
                body="Budget, major, English level, policy fit, and risk tolerance."
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <MapPin className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-bold text-slate-950">Explore live job map</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <FilterSegment label="Country">
                <Select
                  items={Object.fromEntries(COUNTRIES.map((country) => [country.value, country.name]))}
                  value={mapCountry}
                  onValueChange={(value) => value && setMapCountry(value)}
                >
                  <SelectTrigger className={segmentTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem
                        key={country.value}
                        value={country.value}
                        disabled={!country.enabled}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSegment>

              <FilterSegment label="Region">
                <Select
                  items={stateItems}
                  value={state}
                  onValueChange={(value) => value && setState(value)}
                >
                  <SelectTrigger className={segmentTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mapConfig.codes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {mapConfig.names[code]} ({code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSegment>

              <FilterSegment label="View">
                <Select
                  items={{ shortage: "Shortage jobs", pay: "High pay" }}
                  value={tab}
                  onValueChange={(value) => value && setTab(value as "shortage" | "pay")}
                >
                  <SelectTrigger className={segmentTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shortage">Shortage jobs</SelectItem>
                    <SelectItem value="pay">High pay</SelectItem>
                  </SelectContent>
                </Select>
              </FilterSegment>
            </div>

            <button
              type="button"
              onClick={goToMapSearch}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
            >
              <Search className="h-4 w-4" />
              Search jobs and pathways
            </button>

            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <TrustLine>Government and public datasets are separated from internal estimates.</TrustLine>
              <TrustLine>Every preview now carries source type, date, and confidence.</TrustLine>
              <TrustLine>Paid reports can add depth later; core comparisons stay useful for free.</TrustLine>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function CountryCard({
  country,
  rank,
}: {
  country: CountryRoiInsight & { matchScore: number }
  rank: number
}) {
  return (
    <Link
      href={country.href}
      className="group flex min-h-[420px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-tint/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            #{rank} match
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950 group-hover:text-brand-press">
            {country.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{country.cities}</p>
        </div>
        <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-white">
          {country.code}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="Match" value={`${country.matchScore}/100`} />
        <Metric label="Tax" value={country.tax} />
      </div>

      <div className="mt-4 space-y-2">
        <SalaryRow label="After grad" value={country.salaries.first} />
        <SalaryRow label="Year 3" value={country.salaries.year3} />
        <SalaryRow label="Year 5" value={country.salaries.year5} />
        <SalaryRow label="Year 10" value={country.salaries.year10} />
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Best majors
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {country.bestMajors.map((major) => (
            <span
              key={major}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
            >
              {major}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <p className="text-xs leading-5 text-slate-500">{country.policy}</p>
        <DataQualityLine
          className="mt-3"
          confidence={country.sources.policy.confidence}
          sourceName={country.sources.policy.sourceName}
          lastChecked={country.sources.policy.lastChecked}
        />
        <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-slate-700">
          <span>{country.initialBudget}</span>
          <span>{country.rent}</span>
        </div>
      </div>
    </Link>
  )
}

function DataQualityLine({
  confidence,
  sourceName,
  lastChecked,
  className,
}: {
  confidence: DataConfidence
  sourceName: string
  lastChecked: string
  className?: string
}) {
  const tone =
    confidence === "official"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : confidence === "market-estimate"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-50 text-slate-600"
  const label =
    confidence === "official"
      ? "Official"
      : confidence === "market-estimate"
        ? "Market estimate"
        : "Estimate"

  return (
    <div className={`flex flex-wrap items-center gap-2 text-[11px] ${className ?? ""}`}>
      <span className={`rounded-md border px-2 py-0.5 font-bold ${tone}`}>{label}</span>
      <span className="text-slate-400">
        {sourceName} · {formatIsoDate(lastChecked)}
      </span>
    </div>
  )
}

function formatIsoDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`)
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date)
}

function FilterSegment({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}

function ProofPoint({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/85 p-3 backdrop-blur">
      <Icon className="h-4 w-4 text-brand" />
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  )
}

function SalaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-950">{value}</span>
    </div>
  )
}

function CalculatorTile({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon
  title: string
  body: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <Icon className="h-5 w-5 text-brand" />
      <h3 className="mt-3 text-base font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  )
}

function TrustLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-white px-3 py-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{children}</span>
    </div>
  )
}

function getDefaultState(country: string) {
  if (country === "us") return "CA"
  if (country === "ca") return "ON"
  if (country === "uk") return "TLI"
  if (country === "ie") return "D"
  if (country === "de") return "BY"
  if (country === "nl") return "NH"
  return "NSW"
}

function getMapConfig(country: string): {
  codes: readonly string[]
  names: Record<string, string>
} {
  if (country === "us") return { codes: US_STATE_CODES, names: US_STATE_NAMES }
  if (country === "ca") return { codes: CA_PROVINCE_CODES, names: CA_PROVINCE_NAMES }
  if (country === "uk") return { codes: UK_REGION_CODES, names: UK_REGION_NAMES }
  if (country === "ie") return { codes: IE_COUNTY_CODES, names: IE_COUNTY_NAMES }
  if (country === "de") return { codes: DE_BUNDESLAND_CODES, names: DE_BUNDESLAND_NAMES }
  if (country === "nl") return { codes: NL_PROVINCE_CODES, names: NL_PROVINCE_NAMES }
  return { codes: STATE_CODES, names: STATE_NAMES }
}
