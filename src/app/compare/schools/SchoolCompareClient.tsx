"use client"

import { useEffect, useState } from "react"
import { Building2, GraduationCap, MapPin } from "lucide-react"

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

function countryToCcy(country: string): CurrencyCode {
  return country === "us" ? "USD"
    : country === "au" ? "AUD"
    : country === "ca" ? "CAD"
    : country === "uk" ? "GBP"
    : "EUR"
}

function convertCurrency(value: number, fromCountry: string, target: CurrencyCode): number {
  const from = countryToCcy(fromCountry).toLowerCase()
  const rate = EXCHANGE_RATES[target]?.[from]
  if (!rate || rate === 1) return value
  return Math.round(value / rate)
}

function fmtMoney(value: number, country: string, target: CurrencyCode, symbol: string): string {
  return `${symbol}${convertCurrency(value, country, target).toLocaleString()}`
}

function fmtPct(value: number | null): string {
  return value != null && value > 0 ? `${(value * 100).toFixed(0)}%` : "—"
}

function SchoolTypeBadge({ type }: { type: string }) {
  if (!type) return null
  const labels: Record<string, string> = { public: "Public", private_nonprofit: "Private Nonprofit", private_forprofit: "For-Profit" }
  const color = type === "public" ? "bg-green-50 text-green-700" : type === "private_nonprofit" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{labels[type] ?? type}</span>
}

function MetricLine({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-blue-700" : "text-slate-900"}`}>{value}</span>
    </div>
  )
}

function Panel({
  country,
  schoolId,
  schools,
  loading,
  detail,
  onCountryChange,
  onSchoolChange,
}: {
  country: string
  schoolId: string
  schools: SchoolOption[]
  loading: boolean
  detail: SchoolDetail | null
  onCountryChange: (v: string) => void
  onSchoolChange: (v: string) => void
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Country</label>
          <select
            value={country}
            onChange={e => onCountryChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COUNTRIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
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
      {detail && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">{detail.college_name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SchoolTypeBadge type={detail.school_type} />
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {detail.city_name}, {detail.college_state}
            </span>
          </div>
        </div>
      )}
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

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? "$"

  useEffect(() => {
    setLoadingA(true); setSchoolIdA(""); setDetailA(null)
    fetch(`/api/compare/schools?country=${countryA}`)
      .then(r => r.json()).then(j => setSchoolsA(j.data ?? [])).finally(() => setLoadingA(false))
  }, [countryA])

  useEffect(() => {
    setLoadingB(true); setSchoolIdB(""); setDetailB(null)
    fetch(`/api/compare/schools?country=${countryB}`)
      .then(r => r.json()).then(j => setSchoolsB(j.data ?? [])).finally(() => setLoadingB(false))
  }, [countryB])

  useEffect(() => {
    if (!schoolIdA) { setDetailA(null); return }
    fetch(`/api/compare/schools?country=${countryA}&collegeId=${schoolIdA}`)
      .then(r => r.json()).then(j => { const rows = j.data ?? []; setDetailA(rows[0] ?? null) })
  }, [schoolIdA, countryA])

  useEffect(() => {
    if (!schoolIdB) { setDetailB(null); return }
    fetch(`/api/compare/schools?country=${countryB}&collegeId=${schoolIdB}`)
      .then(r => r.json()).then(j => { const rows = j.data ?? []; setDetailB(rows[0] ?? null) })
  }, [schoolIdB, countryB])

  type RowDef = { key: string; label: string; valA: string; valB: string; isMoney: boolean }

  const rows: RowDef[] = detailA && detailB ? [
    { key: "school_type", label: "School Type",
      valA: ({ public: "Public", private_nonprofit: "Private Nonprofit", private_forprofit: "For-Profit" })[detailA.school_type] ?? detailA.school_type,
      valB: ({ public: "Public", private_nonprofit: "Private Nonprofit", private_forprofit: "For-Profit" })[detailB.school_type] ?? detailB.school_type,
      isMoney: false },
    { key: "location", label: "Location",
      valA: `${detailA.city_name}, ${detailA.college_state}`,
      valB: `${detailB.city_name}, ${detailB.college_state}`,
      isMoney: false },
    { key: "tuition", label: "Tuition / yr",
      valA: fmtMoney(detailA.tuition, countryA, currency, sym),
      valB: fmtMoney(detailB.tuition, countryB, currency, sym),
      isMoney: true },
    { key: "median_earnings", label: "Median Earnings",
      valA: fmtMoney(detailA.median_earnings, countryA, currency, sym),
      valB: fmtMoney(detailB.median_earnings, countryB, currency, sym),
      isMoney: true },
    { key: "roi_score", label: "ROI Score",
      valA: detailA.roi_score.toFixed(1),
      valB: detailB.roi_score.toFixed(1),
      isMoney: false },
    { key: "payback_years", label: "Payback",
      valA: `${detailA.payback_years} yr`,
      valB: `${detailB.payback_years} yr`,
      isMoney: false },
    { key: "graduation_rate", label: "Graduation Rate",
      valA: fmtPct(detailA.graduation_rate),
      valB: fmtPct(detailB.graduation_rate),
      isMoney: false },
  ] : []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
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
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-[260px] shrink-0">
          <Panel
            country={countryA}
            schoolId={schoolIdA}
            schools={schoolsA}
            loading={loadingA}
            detail={detailA}
            onCountryChange={setCountryA}
            onSchoolChange={setSchoolIdA}
          />
        </div>

        <div className="flex-1 min-w-0 w-full">
          {detailA && detailB ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        Metric
                      </div>
                    </th>
                    <th className="text-center px-4 py-3.5 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {detailA.college_name}
                    </th>
                    <th className="text-center px-4 py-3.5 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {detailB.college_name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.key} className={i < rows.length - 1 ? "border-b border-slate-100" : ""}>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{row.label}</td>
                      <td className={`px-4 py-3.5 text-center ${row.isMoney ? "font-semibold text-slate-900" : "text-slate-700"}`}>{row.valA}</td>
                      <td className={`px-4 py-3.5 text-center ${row.isMoney ? "font-semibold text-slate-900" : "text-slate-700"}`}>{row.valB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">
                {!detailA && !detailB
                  ? "Select a school on both sides to see the comparison."
                  : "Select the other school to complete the comparison."}
              </p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[260px] shrink-0">
          <Panel
            country={countryB}
            schoolId={schoolIdB}
            schools={schoolsB}
            loading={loadingB}
            detail={detailB}
            onCountryChange={setCountryB}
            onSchoolChange={setSchoolIdB}
          />
        </div>
      </div>
    </div>
  )
}
