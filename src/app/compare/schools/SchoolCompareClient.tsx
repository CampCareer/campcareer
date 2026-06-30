"use client"

import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"

type SchoolOption = {
  college_id: string
  college_name: string
  college_state: string
}

type SchoolDetail = {
  college_id: string
  college_name: string
  college_state: string
  city_name: string
  school_type: string
  tuition: number
  median_earnings: number
  net_salary: number
  roi_score: number
  payback_years: number
  graduation_rate: number | null
}

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "ie", label: "Ireland" },
]

type CurrencyCode = "USD" | "EUR" | "GBP" | "AUD" | "CAD"

const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
]

const EXCHANGE_RATES: Record<CurrencyCode, Record<string, number>> = {
  USD: { usd: 1, eur: 0.93, gbp: 0.79, aud: 1.5, cad: 1.36 },
  EUR: { usd: 1.08, eur: 1, gbp: 0.85, aud: 1.62, cad: 1.47 },
  GBP: { usd: 1.27, eur: 1.18, gbp: 1, aud: 1.91, cad: 1.73 },
  AUD: { usd: 0.67, eur: 0.62, gbp: 0.52, aud: 1, cad: 0.91 },
  CAD: { usd: 0.73, eur: 0.68, gbp: 0.58, aud: 1.1, cad: 1 },
}

function toCurrency(value: number, fromCountry: string, targetCurrency: CurrencyCode): number {
  const fromCurrency: CurrencyCode =
    fromCountry === "us" ? "USD"
    : fromCountry === "au" ? "AUD"
    : fromCountry === "ca" ? "CAD"
    : fromCountry === "uk" ? "GBP"
    : "EUR"
  const rate = EXCHANGE_RATES[targetCurrency]?.[fromCurrency.toLowerCase()]
  if (!rate || rate === 1) return value
  return Math.round(value / rate)
}

function formatValue(value: number, fromCountry: string, targetCurrency: CurrencyCode, symbol: string): string {
  const converted = toCurrency(value, fromCountry, targetCurrency)
  return `${symbol}${converted.toLocaleString()}`
}

function formatPercent(value: number | null): string {
  if (value == null || value <= 0) return "—"
  return `${(value * 100).toFixed(0)}%`
}

const ROWS: {
  key: string
  label: string
  render: (d: SchoolDetail, ccy: CurrencyCode, sym: string) => string | React.ReactNode
}[] = [
  {
    key: "school_type",
    label: "School Type",
    render: (d) => {
      const labels: Record<string, string> = {
        public: "Public",
        private_nonprofit: "Private Nonprofit",
        private_forprofit: "For-Profit",
      }
      return labels[d.school_type] ?? d.school_type
    },
  },
  {
    key: "location",
    label: "Location",
    render: (d) => `${d.city_name}, ${d.college_state}`,
  },
  {
    key: "tuition",
    label: "Tuition / yr",
    render: (d, ccy, sym) => formatValue(d.tuition, inferCountry(d), ccy, sym),
  },
  {
    key: "median_earnings",
    label: "Median Earnings",
    render: (d, ccy, sym) => formatValue(d.median_earnings, inferCountry(d), ccy, sym),
  },
  {
    key: "roi_score",
    label: "ROI Score",
    render: (d) => d.roi_score.toFixed(1),
  },
  {
    key: "payback_years",
    label: "Payback",
    render: (d) => `${d.payback_years} yr`,
  },
  {
    key: "graduation_rate",
    label: "Graduation Rate",
    render: (d) => formatPercent(d.graduation_rate),
  },
]

function inferCountry(d: SchoolDetail): string {
  if (d.tuition > 50000) return "us"
  if (d.school_type === "public" && d.college_state === "NSW") return "au"
  return "us"
}

function SelectorPanel({
  label,
  country,
  schoolId,
  schools,
  loading,
  onCountryChange,
  onSchoolChange,
}: {
  label: string
  country: string
  schoolId: string
  schools: SchoolOption[]
  loading: boolean
  onCountryChange: (v: string) => void
  onSchoolChange: (v: string) => void
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-700">School {label}</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Country</label>
          <select
            value={country}
            onChange={e => onCountryChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COUNTRIES.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">School</label>
          <select
            value={schoolId}
            onChange={e => onSchoolChange(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">{loading ? "Loading..." : "Select a school"}</option>
            {schools.map(s => (
              <option key={s.college_id} value={s.college_id}>
                {s.college_name} ({s.college_state})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function SchoolCompareClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [countryA, setCountryA] = useState("us")
  const [countryB, setCountryB] = useState("au")
  const [schoolIdA, setSchoolIdA] = useState("")
  const [schoolIdB, setSchoolIdB] = useState("")

  const [schoolsA, setSchoolsA] = useState<SchoolOption[]>([])
  const [schoolsB, setSchoolsB] = useState<SchoolOption[]>([])
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)

  const [detailA, setDetailA] = useState<SchoolDetail | null>(null)
  const [detailB, setDetailB] = useState<SchoolDetail | null>(null)

  useEffect(() => {
    setLoadingA(true)
    setSchoolIdA("")
    setDetailA(null)
    fetch(`/api/compare/schools?country=${countryA}`)
      .then(r => r.json())
      .then(json => setSchoolsA(json.data ?? []))
      .finally(() => setLoadingA(false))
  }, [countryA])

  useEffect(() => {
    setLoadingB(true)
    setSchoolIdB("")
    setDetailB(null)
    fetch(`/api/compare/schools?country=${countryB}`)
      .then(r => r.json())
      .then(json => setSchoolsB(json.data ?? []))
      .finally(() => setLoadingB(false))
  }, [countryB])

  useEffect(() => {
    if (!schoolIdA) { setDetailA(null); return }
    fetch(`/api/compare/schools?country=${countryA}&collegeId=${schoolIdA}`)
      .then(r => r.json())
      .then(json => {
        const rows = json.data ?? []
        setDetailA(rows.length > 0 ? rows[0] : null)
      })
  }, [schoolIdA, countryA])

  useEffect(() => {
    if (!schoolIdB) { setDetailB(null); return }
    fetch(`/api/compare/schools?country=${countryB}&collegeId=${schoolIdB}`)
      .then(r => r.json())
      .then(json => {
        const rows = json.data ?? []
        setDetailB(rows.length > 0 ? rows[0] : null)
      })
  }, [schoolIdB, countryB])

  const ccySymbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? "$"

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            School Comparison
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a school on each side to compare tuition, earnings, ROI, and more.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-medium text-slate-500">Currency</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value as CurrencyCode)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <SelectorPanel
          label="A"
          country={countryA}
          schoolId={schoolIdA}
          schools={schoolsA}
          loading={loadingA}
          onCountryChange={setCountryA}
          onSchoolChange={setSchoolIdA}
        />
        <SelectorPanel
          label="B"
          country={countryB}
          schoolId={schoolIdB}
          schools={schoolsB}
          loading={loadingB}
          onCountryChange={setCountryB}
          onSchoolChange={setSchoolIdB}
        />
      </div>

      {detailA && detailB && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[200px]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    Metric
                  </div>
                </th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {detailA.college_name}
                </th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {detailB.college_name}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const valA = row.render(detailA, currency, ccySymbol)
                const valB = row.render(detailB, currency, ccySymbol)
                const isMoney = row.key === "tuition" || row.key === "median_earnings"
                return (
                  <tr key={row.key} className={i < ROWS.length - 1 ? "border-b border-slate-100" : ""}>
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">{row.label}</td>
                    <td className={`px-5 py-4 text-center ${isMoney ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                      {valA}
                    </td>
                    <td className={`px-5 py-4 text-center ${isMoney ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                      {valB}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {!detailA && !detailB && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">
            Select a school on both sides to see the comparison.
          </p>
        </div>
      )}

      {(detailA && !detailB) || (!detailA && detailB) ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
          <p className="text-sm text-slate-500">
            Select the other school to complete the comparison.
          </p>
        </div>
      ) : null}
    </div>
  )
}
