"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"
import { TrendingUp, X, ArrowRight, BarChart2, Search, HelpCircle, ChevronDown } from "lucide-react"
import { useTranslations, useLocale } from "@/lib/i18n/locale-provider"
import { Card, CardContent } from "@/components/ui/card"
import {
  getExchangeRates,
  convertToBase,
  type SupportedCurrency,
  type ExchangeRates,
} from "@/app/lib/currency"
import type { ChartEntry } from "./bar-chart"

const CompareBarChart = dynamic(() => import("./bar-chart"), {
  ssr: false,
  loading: () => <div className="h-60 bg-slate-100 animate-pulse rounded-xl" />,
})

// ── Types ────────────────────────────────────────────────────────────────────

type Top3Item = { college_id: string; college_name: string; roi_score: number }

type CountryStats = {
  avg_roi: number
  avg_salary: number
  avg_payback: number
  top3: Top3Item[]
  count: number
  field_data_available: boolean
}

const COUNTRIES = ["us", "au", "ca", "uk", "ie"] as const
type Country = (typeof COUNTRIES)[number]

type CompareData = Record<Country, CountryStats>

// ── Popular fields ────────────────────────────────────────────────────────────

const DEFAULT_FIELD = "Computer Science"

const POPULAR_FIELDS = [
  { en: "Computer Science", kr: "컴퓨터공학" },
  { en: "Business",         kr: "경영학" },
  { en: "Engineering",      kr: "공학" },
  { en: "Medicine",         kr: "의학" },
  { en: "Law",              kr: "법학" },
  { en: "Data Science",     kr: "데이터사이언스" },
]

// ── Constants ─────────────────────────────────────────────────────────────────

const COUNTRY_CONFIG: Record<
  Country,
  { flag: string; name: string; color: string; currency: SupportedCurrency }
> = {
  us: { flag: "🇺🇸", name: "United States",  color: "#6366f1", currency: "USD" },
  au: { flag: "🇦🇺", name: "Australia",      color: "#10b981", currency: "AUD" },
  ca: { flag: "🇨🇦", name: "Canada",         color: "#f43f5e", currency: "CAD" },
  uk: { flag: "🇬🇧", name: "United Kingdom", color: "#3b82f6", currency: "GBP" },
  ie: { flag: "🇮🇪", name: "Ireland",        color: "#f59e0b", currency: "EUR" },
}

const BASE_CURRENCIES: { code: SupportedCurrency; symbol: string; flag: string }[] = [
  { code: "USD", symbol: "$",  flag: "🇺🇸" },
  { code: "EUR", symbol: "€",  flag: "🇪🇺" },
  { code: "GBP", symbol: "£",  flag: "🇬🇧" },
]

const CURRENCY_SYMBOL: Record<SupportedCurrency, string> = {
  USD: "$", AUD: "A$", CAD: "C$", GBP: "£", EUR: "€",
}

function fmtSalary(amount: number, symbol: string) {
  return `${symbol}${Math.round(amount).toLocaleString()}`
}

function trimDot(s: string | null) {
  if (!s) return ""
  return s.endsWith(".") ? s.slice(0, -1) : s
}

// ── FieldCombobox ─────────────────────────────────────────────────────────────

const MIN_CHARS = 3

function FieldCombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const t = useTranslations()
  const tc = t.compare
  const [input, setInput]     = useState(value ? trimDot(value) : "")
  const [options, setOptions] = useState<string[]>([])
  const [open, setOpen]       = useState(false)
  const containerRef          = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (!value) setInput("")
  }, [value])

  useEffect(() => {
    const trimmed = input.trim()
    if (trimmed.length < MIN_CHARS) { setOptions([]); setOpen(false); return }
    const t = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/roi/fields?q=${encodeURIComponent(trimmed)}`)
        const json = await res.json()
        const fields: string[] = json.fields ?? []
        setOptions(fields)
        setOpen(fields.length > 0)
      } catch { /* ignore */ }
    }, 300)
    return () => clearTimeout(t)
  }, [input])

  function commit(f: string) {
    const clean = f.trim()
    if (!clean) return
    onChangeRef.current(clean)
  }

  function handleSelect(f: string) {
    setInput(trimDot(f))
    setOpen(false)
    commit(f)
  }

  function handleClear() {
    setInput("")
    setOptions([])
    setOpen(false)
    onChangeRef.current("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      if (open && options.length > 0) handleSelect(options[0])
      else if (input.trim().length >= MIN_CHARS) { setOpen(false); commit(input) }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  const canSearch = input.trim().length >= MIN_CHARS

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto">
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => options.length > 0 && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={tc.searchPlaceholder}
            className="w-full h-11 rounded-xl border border-slate-200 px-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-white shadow-sm"
          />
          {input && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => { if (canSearch) { setOpen(false); commit(input) } }}
          disabled={!canSearch}
          className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl text-sm font-medium transition-colors
            bg-indigo-600 text-white hover:bg-indigo-700
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          <Search className="w-3.5 h-3.5" />
          {tc.compareButton}
        </button>
      </div>

      {open && options.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full sm:w-72 rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
          {options.map((f) => (
            <button
              key={f}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(f)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors"
            >
              {trimDot(f)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Currency Selector ─────────────────────────────────────────────────────────

function CurrencySelector({
  value,
  onChange,
}: {
  value: SupportedCurrency
  onChange: (c: SupportedCurrency) => void
}) {
  return (
    <div className="max-w-full overflow-x-auto">
    <div className="inline-flex items-center gap-1 bg-slate-100 rounded-xl p-1">
      {BASE_CURRENCIES.map(({ code, symbol, flag }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            value === code
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>{flag}</span>
          {symbol} {code}
        </button>
      ))}
    </div>
    </div>
  )
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3 animate-pulse">
      <div className="h-5 bg-slate-100 rounded w-3/4" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-slate-100 rounded" />)}
      </div>
      <div className="h-px bg-slate-100" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-slate-100 rounded" />)}
      </div>
      <div className="h-4 bg-slate-100 rounded w-1/3 ml-auto" />
    </div>
  )
}

// ── InfoPopover ───────────────────────────────────────────────────────────────

function InfoPopover({ body }: { body: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ml-0.5 text-slate-300 hover:text-slate-500 transition-colors"
        aria-label="More information"
        aria-expanded={open}
      >
        <HelpCircle className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-800 text-white text-[11px] rounded-lg px-3 py-2.5 shadow-xl z-50 leading-relaxed">
          {body}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </span>
  )
}

// ── DataSourcesAccordion ──────────────────────────────────────────────────────

function DataSourcesAccordion({ ratesDate }: { ratesDate: string | null }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const tc = t.compare

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <span>{tc.dataSources}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 grid sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <p className="font-semibold text-slate-700 mb-2">{tc.dataSourcesHeader}</p>
            <ul className="space-y-1 text-slate-500">
              <li>🇺🇸 {tc.dataSourcesUS}</li>
              <li>🇦🇺 {tc.dataSourcesAU}</li>
              <li>🇨🇦 {tc.dataSourcesCA}</li>
              <li>🇬🇧 {tc.dataSourcesUK}</li>
              <li>🇮🇪 {tc.dataSourcesIE}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-2">{tc.limitationsTitle}</p>
            <ul className="space-y-1 text-slate-500 list-disc list-inside">
              <li>{tc.limitationsAvg}</li>
              <li>{tc.limitationsLiving}</li>
              {ratesDate && (
                <li>{tc.limitationsRates.replace("{date}", ratesDate)}</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Country Card ──────────────────────────────────────────────────────────────

function CountryCard({
  country,
  stats,
  field,
  baseCurrency,
  rates,
}: {
  country: Country
  stats: CountryStats
  field: string
  baseCurrency: SupportedCurrency
  rates: ExchangeRates["rates"] | null
}) {
  const t = useTranslations()
  const tc = t.compare
  const cfg    = COUNTRY_CONFIG[country]
  const hasData = stats.count > 0

  const convertedSalary = rates
    ? convertToBase(stats.avg_salary, cfg.currency, rates, baseCurrency)
    : stats.avg_salary
  const salarySymbol = rates ? CURRENCY_SYMBOL[baseCurrency] : CURRENCY_SYMBOL[cfg.currency]

  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Country header */}
      <div
        className="px-4 pt-4 pb-3 flex items-center gap-2 border-b border-slate-100"
        style={{ borderTopColor: cfg.color, borderTopWidth: 3 }}
      >
        <span className="text-xl leading-none">{cfg.flag}</span>
        <span className="font-semibold text-slate-800 text-sm truncate">{cfg.name}</span>
        {hasData && (
          <span className="ml-auto text-xs text-slate-400 whitespace-nowrap">
            {stats.count} {tc.results}
          </span>
        )}
      </div>

      <CardContent className="flex-1 pt-3 pb-4 space-y-3">
        {!hasData ? (
          <p className="text-sm text-slate-400 py-4 text-center">{tc.noData}</p>
        ) : (
          <>
            {/* Top 3 colleges */}
            <ul className="space-y-1.5">
              {stats.top3.map((college, i) => (
                <li key={college.college_id} className="flex items-start gap-2">
                  <span
                    className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/roi-explorer/${college.college_id}?country=${country}`}
                      className="text-xs text-slate-700 hover:text-indigo-600 hover:underline leading-snug block truncate"
                      title={college.college_name}
                    >
                      {college.college_name}
                    </Link>
                    <span className="text-[11px] font-semibold" style={{ color: cfg.color }}>
                      {college.roi_score.toFixed(1)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Averages */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide flex items-center justify-center">
                  {tc.avgRoi}<InfoPopover body={tc.roiScoreTooltipBody} />
                </p>
                <p className="text-base font-bold" style={{ color: cfg.color }}>
                  {stats.avg_roi.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                  {tc.avgSalary}
                </p>
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {fmtSalary(convertedSalary, salarySymbol)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide flex items-center justify-center">
                  {tc.payback}<InfoPopover body={tc.paybackTooltipBody} />
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {stats.avg_payback.toFixed(1)} {tc.paybackUnit}
                </p>
              </div>
            </div>

            {/* View all link */}
            <div className="text-right pt-0.5">
              <Link
                href={`/roi-explorer?country=${country}&field=${encodeURIComponent(field)}`}
                className="inline-flex items-center gap-1 text-xs font-medium hover:underline transition-colors"
                style={{ color: cfg.color }}
              >
                {tc.viewAll}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Field data notice for non-US countries */}
            {!stats.field_data_available && (
              <p className="text-[10px] text-slate-400 text-center pt-0.5 leading-tight">
                {tc.fieldNotAvailable}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function CompareContent() {
  const t = useTranslations()
  const tc = t.compare
  const locale = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [field, setField]             = useState(searchParams.get("field") ?? DEFAULT_FIELD)
  const [data, setData]               = useState<CompareData | null>(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [baseCurrency, setBaseCurrency] = useState<SupportedCurrency>("USD")
  const [rates, setRates]             = useState<ExchangeRates["rates"] | null>(null)
  const [ratesDate, setRatesDate]     = useState<string | null>(null)
  const [careerStage, setCareerStage] = useState<1 | 3 | 5 | null>(null)

  // Fetch exchange rates once on mount
  useEffect(() => {
    getExchangeRates()
      .then((r) => { setRates(r.rates); setRatesDate(r.date) })
      .catch(() => { /* gracefully degrade to local currencies */ })
  }, [])

  function handleFieldChange(v: string) {
    setField(v)
    const url = new URL(window.location.href)
    if (v) url.searchParams.set("field", v)
    else url.searchParams.delete("field")
    router.replace(url.pathname + (url.search || ""), { scroll: false })
  }

  useEffect(() => {
    if (!field.trim()) { setData(null); return }

    const ctrl = new AbortController()
    setLoading(true)
    setError(null)

    const url = `/api/compare?field=${encodeURIComponent(field)}${careerStage ? `&career_stage=${careerStage}` : ''}`
    fetch(url, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((json) => {
        if (json.error) throw new Error(json.error)
        setData(json)
      })
      .catch((err: Error) => { if (err.name !== "AbortError") setError(err.message) })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [field, careerStage])

  // Chart: converted avg_salary per country (falls back to avg_roi if rates not ready)
  const chartData: ChartEntry[] = data
    ? COUNTRIES.map((c) => {
        const cfg = COUNTRY_CONFIG[c]
        const value = rates
          ? convertToBase(data[c].avg_salary, cfg.currency, rates, baseCurrency)
          : data[c].avg_roi
        return { country: cfg.flag + " " + c.toUpperCase(), value, color: cfg.color }
      })
    : []

  const hasAnyData = data && COUNTRIES.some((c) => data[c].count > 0)

  const chartLabel = rates
    ? `${tc.avgSalary} (${baseCurrency})`
    : tc.avgRoi

  const chartFormatValue = rates
    ? (v: number) => `${CURRENCY_SYMBOL[baseCurrency]}${Math.round(v).toLocaleString()}`
    : (v: number) => v.toFixed(1)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
            <TrendingUp className="w-3 h-3" />
            {tc.badge}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {tc.pageTitle}
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            {tc.pageSubtitle}
          </p>
        </div>

        {/* Currency selector */}
        <div className="pt-1">
          <p className="text-[11px] text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
            {tc.displayCurrency}
          </p>
          <CurrencySelector value={baseCurrency} onChange={setBaseCurrency} />
        </div>
      </div>

      {/* Popular field tags */}
      <div className="flex flex-wrap gap-2">
        {POPULAR_FIELDS.map((f) => {
          const label = locale === "ko" ? f.kr : f.en
          const isActive = field.toLowerCase() === f.en.toLowerCase()
          return (
            <button
              key={f.en}
              onClick={() => handleFieldChange(f.en)}
              className={`border rounded-full px-3 py-1 text-sm transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <FieldCombobox value={field} onChange={handleFieldChange} />
        {field && !loading && (
          <span className="text-xs text-slate-400">
            {tc.showingResults} <span className="font-medium text-slate-600">{trimDot(field)}</span>
          </span>
        )}
      </div>

      {/* Career Stage Selector */}
      {field && data && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {tc.careerStageLabel}
          </span>
          <div className="inline-flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setCareerStage(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                careerStage === null
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tc.careerStageDefault}
            </button>
            {([1, 3, 5] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setCareerStage(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  careerStage === stage
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {stage === 1 ? tc.careerStage1yr : stage === 3 ? tc.careerStage3yr : tc.careerStage5yr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {tc.loadError} {error}
        </div>
      )}

      {/* Empty state */}
      {!field && !loading && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <BarChart2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">{tc.emptyTitle}</p>
          <p className="text-slate-400 text-xs mt-1">
            {tc.emptySubtitle}
          </p>
        </div>
      )}

      {/* Country Cards */}
      {(loading || (field && data)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {loading
            ? COUNTRIES.map((c) => <SkeletonCard key={c} />)
            : COUNTRIES.map((c) => (
                <CountryCard
                  key={c}
                  country={c}
                  stats={data![c]}
                  field={field}
                  baseCurrency={baseCurrency}
                  rates={rates}
                />
              ))}
        </div>
      )}

      {/* Bar Chart */}
      {!loading && hasAnyData && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            {rates
              ? `${tc.avgSalaryByCountry} (${baseCurrency})`
              : tc.avgRoiByCountry}
            {careerStage && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                {tc.careerStageChartTitle.replace('{stage}', careerStage === 1 ? tc.careerStage1yr : careerStage === 3 ? tc.careerStage3yr : tc.careerStage5yr)}
              </span>
            )}
          </h2>
          <Card>
            <CardContent className="pt-5 pb-4">
              <CompareBarChart
                data={chartData}
                valueLabel={chartLabel}
                formatValue={chartFormatValue}
              />
            </CardContent>
          </Card>

          {/* Exchange rate attribution */}
          {rates && ratesDate && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span>📅</span>
              {tc.exchangeRatesAs}{" "}
              <span className="font-medium text-slate-700">{ratesDate}</span>
              {" · "}{tc.exchangeSource}:{" "}
              <a
                href="https://www.frankfurter.app" // TODO: verify
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline font-medium"
              >
                frankfurter.app
              </a>
            </p>
          )}

          {/* Data sources accordion */}
          <div className="mt-3">
            <DataSourcesAccordion ratesDate={ratesDate} />
          </div>
        </div>
      )}

    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  )
}
