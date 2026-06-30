"use client"

import { useEffect, useState } from "react"
import { GraduationCap, MapPin } from "lucide-react"

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

function formatCurrency(value: number, country: string): string {
  const symbol =
    country === "us" ? "$" : country === "au" ? "A$" : country === "ca" ? "C$" : country === "uk" ? "£" : "€"
  return `${symbol}${value.toLocaleString()}`
}

function SchoolTypeLabel({ type }: { type: string }) {
  if (!type) return null
  const labels: Record<string, string> = {
    public: "Public",
    private_nonprofit: "Private Nonprofit",
    private_forprofit: "For-Profit",
  }
  const color =
    type === "public"
      ? "bg-green-50 text-green-700"
      : type === "private_nonprofit"
        ? "bg-blue-50 text-blue-700"
        : "bg-amber-50 text-amber-700"
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {labels[type] ?? type}
    </span>
  )
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? "border-blue-200 bg-blue-50/50" : "border-slate-200 bg-white"}`}
    >
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? "text-blue-700" : "text-slate-900"}`}>{value}</p>
    </div>
  )
}

function SchoolPanel({
  side,
  country,
  schoolId,
  schoolDetail,
  schools,
  loadingSchools,
  onCountryChange,
  onSchoolChange,
}: {
  side: "A" | "B"
  country: string
  schoolId: string
  schoolDetail: SchoolDetail | null
  schools: SchoolOption[]
  loadingSchools: boolean
  onCountryChange: (country: string) => void
  onSchoolChange: (schoolId: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {side}
        </span>
        <span className="text-sm font-semibold text-slate-500">{side === "A" ? "School A" : "School B"}</span>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1.5 block">Country</label>
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
        <label className="text-xs font-medium text-slate-500 mb-1.5 block">School</label>
        <select
          value={schoolId}
          onChange={e => onSchoolChange(e.target.value)}
          disabled={loadingSchools}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">{loadingSchools ? "Loading..." : "Select a school"}</option>
          {schools.map(s => (
            <option key={s.college_id} value={s.college_id}>
              {s.college_name} ({s.college_state})
            </option>
          ))}
        </select>
      </div>

      {schoolDetail && (
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">{schoolDetail.college_name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SchoolTypeLabel type={schoolDetail.school_type} />
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {schoolDetail.city_name}, {schoolDetail.college_state}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Tuition / yr"
              value={formatCurrency(schoolDetail.tuition, country)}
            />
            <MetricCard
              label="Median Earnings"
              value={formatCurrency(schoolDetail.median_earnings, country)}
              highlight
            />
            <MetricCard
              label="ROI Score"
              value={schoolDetail.roi_score.toFixed(1)}
            />
            <MetricCard
              label="Payback"
              value={`${schoolDetail.payback_years} yr`}
            />
          </div>

          {schoolDetail.graduation_rate != null && schoolDetail.graduation_rate > 0 && (
            <MetricCard
              label="Graduation Rate"
              value={`${(schoolDetail.graduation_rate * 100).toFixed(0)}%`}
            />
          )}
        </div>
      )}

      {!schoolDetail && schoolId && (
        <p className="text-sm text-amber-600">No ROI data available for this school.</p>
      )}
    </div>
  )
}

export default function SchoolCompareClient() {
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
    if (!schoolIdA) {
      setDetailA(null)
      return
    }
    fetch(`/api/compare/schools?country=${countryA}&collegeId=${schoolIdA}`)
      .then(r => r.json())
      .then(json => {
        const rows = json.data ?? []
        setDetailA(rows.length > 0 ? rows[0] : null)
      })
  }, [schoolIdA, countryA])

  useEffect(() => {
    if (!schoolIdB) {
      setDetailB(null)
      return
    }
    fetch(`/api/compare/schools?country=${countryB}&collegeId=${schoolIdB}`)
      .then(r => r.json())
      .then(json => {
        const rows = json.data ?? []
        setDetailB(rows.length > 0 ? rows[0] : null)
      })
  }, [schoolIdB, countryB])

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          School Comparison
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
          Select a country and school on each side to compare tuition, earnings, ROI, and more side by side.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <SchoolPanel
          side="A"
          country={countryA}
          schoolId={schoolIdA}
          schoolDetail={detailA}
          schools={schoolsA}
          loadingSchools={loadingA}
          onCountryChange={setCountryA}
          onSchoolChange={setSchoolIdA}
        />

        <div className="hidden lg:block w-px bg-slate-200" />

        <SchoolPanel
          side="B"
          country={countryB}
          schoolId={schoolIdB}
          schoolDetail={detailB}
          schools={schoolsB}
          loadingSchools={loadingB}
          onCountryChange={setCountryB}
          onSchoolChange={setSchoolIdB}
        />
      </div>
    </div>
  )
}
