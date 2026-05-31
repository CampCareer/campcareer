"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { TrendingUp, X, Bookmark, Copy, CheckCheck } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type RoiRow = {
  college_id: string
  college_name: string
  college_state: string
  city_id: string
  city_name: string
  city_state: string
  field_name: string | null
  roi_score: number
  net_salary: number
  payback_years: number
  tuition: number
  graduation_rate: number
  median_earnings: number
  avg_cao_points: number | null
  min_cao_points: number | null
  max_cao_points: number | null
  roi_score_mid: number | null
  roi_score_senior: number | null
  gross_salary: number | null
  tax_amount: number | null
  net_salary_after_tax: number | null
}

const SORT_OPTIONS = [
  { value: "roi_score",     label: "ROI Score" },
  { value: "net_salary",    label: "Net Salary" },
  { value: "payback_years", label: "Payback Years" },
] as const

const LIMIT_OPTIONS = [20, 50, 100] as const

const US_STATES = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "DC", name: "Washington D.C." },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
] as const

const AU_STATES = [
  { abbr: "NSW", name: "New South Wales" },
  { abbr: "VIC", name: "Victoria" },
  { abbr: "QLD", name: "Queensland" },
  { abbr: "WA",  name: "Western Australia" },
  { abbr: "SA",  name: "South Australia" },
  { abbr: "ACT", name: "Australian Capital Territory" },
  { abbr: "TAS", name: "Tasmania" },
  { abbr: "NT",  name: "Northern Territory" },
] as const

const CA_PROVINCES = [
  { abbr: "ON", name: "Ontario" },
  { abbr: "BC", name: "British Columbia" },
  { abbr: "QC", name: "Quebec" },
  { abbr: "AB", name: "Alberta" },
  { abbr: "MB", name: "Manitoba" },
  { abbr: "NS", name: "Nova Scotia" },
  { abbr: "NB", name: "New Brunswick" },
  { abbr: "SK", name: "Saskatchewan" },
  { abbr: "NL", name: "Newfoundland and Labrador" },
  { abbr: "PE", name: "Prince Edward Island" },
] as const

const UK_REGIONS = [
  { abbr: "London",           name: "London" },
  { abbr: "South East",       name: "South East" },
  { abbr: "Scotland",         name: "Scotland" },
  { abbr: "North West",       name: "North West" },
  { abbr: "Yorkshire",        name: "Yorkshire" },
  { abbr: "West Midlands",    name: "West Midlands" },
  { abbr: "South West",       name: "South West" },
  { abbr: "East Midlands",    name: "East Midlands" },
  { abbr: "North East",       name: "North East" },
  { abbr: "East",             name: "East of England" },
  { abbr: "Wales",            name: "Wales" },
  { abbr: "Northern Ireland", name: "Northern Ireland" },
] as const

const IE_PROVINCES = [
  { abbr: "Leinster", name: "Leinster" },
  { abbr: "Munster",  name: "Munster" },
  { abbr: "Connacht", name: "Connacht" },
  { abbr: "Ulster",   name: "Ulster" },
] as const

const COUNTRY_OPTIONS = [
  { value: "us", label: "🇺🇸 United States" },
  { value: "au", label: "🇦🇺 Australia" },
  { value: "ca", label: "🇨🇦 Canada" },
  { value: "uk", label: "🇬🇧 United Kingdom" },
  { value: "ie", label: "🇮🇪 Ireland" },
] as const

// ── Currency helpers ─────────────────────────────────────────────────────────

const CURRENCY: Record<string, { symbol: string; code: string }> = {
  us: { symbol: '$',  code: 'USD' },
  au: { symbol: 'A$', code: 'AUD' },
  ca: { symbol: 'C$', code: 'CAD' },
  uk: { symbol: '£',  code: 'GBP' },
  ie: { symbol: '€',  code: 'EUR' },
}

function formatCurrency(value: number, country: string): string {
  const { symbol } = CURRENCY[country] ?? CURRENCY.us
  return `${symbol}${Math.round(value).toLocaleString()}`
}

// ─────────────────────────────────────────────────────────────────────────────

function trimDot(s: string | null) {
  if (!s) return '—'
  return s.endsWith('.') ? s.slice(0, -1) : s
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-100 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

function FieldCombobox({
  value,
  onChange,
  country = "us",
}: {
  value: string
  onChange: (v: string) => void
  country?: string
}) {
  const [input, setInput] = useState(value ? trimDot(value) : "")
  const [options, setOptions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Keep input in sync when value is cleared externally
  useEffect(() => {
    if (!value) setInput("")
  }, [value])

  // Debounced autocomplete fetch
  useEffect(() => {
    if (!input.trim()) {
      setOptions([])
      setOpen(false)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/roi/fields?q=${encodeURIComponent(input)}&country=${country}`)
        const json = await res.json()
        setOptions(json.fields ?? [])
        setOpen(true)
      } catch {
        // ignore
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [input, country])

  function handleSelect(f: string) {
    setInput(trimDot(f))
    onChange(f)
    setOpen(false)
  }

  function handleClear() {
    setInput("")
    onChange("")
    setOptions([])
    setOpen(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
    if (!e.target.value) onChange("")
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onFocus={() => options.length > 0 && setOpen(true)}
          placeholder="Search field of study…"
          className="w-64 h-10 rounded-xl border border-slate-200 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-white"
        />
        {input && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && options.length > 0 && (
        <div className="absolute z-50 mt-1 w-full min-w-[280px] rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
          {options.map((f) => (
            <button
              key={f}
              onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
              onClick={() => handleSelect(f)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors"
            >
              {trimDot(f)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const VALID_COUNTRIES = ['us', 'au', 'ca', 'uk', 'ie'] as const
type Country = typeof VALID_COUNTRIES[number]

const DEFAULT_STATE: Record<Country, string> = {
  us: 'CA', au: 'NSW', ca: 'ON', uk: 'London', ie: 'Leinster',
}

function ROIExplorerContent() {
  const searchParams = useSearchParams()
  const paramCountry = searchParams.get('country') as Country | null
  const initialCountry: Country = paramCountry && VALID_COUNTRIES.includes(paramCountry)
    ? paramCountry
    : 'us'

  const [country, setCountry] = useState<Country>(initialCountry)
  const [state, setState] = useState(DEFAULT_STATE[initialCountry])
  const [field, setField] = useState("")
  const [sort, setSort]   = useState("roi_score")
  const [limit, setLimit] = useState(50)
  const [careerStage, setCareerStage] = useState<'early' | 'mid' | 'senior'>('early')
  const [data, setData]   = useState<RoiRow[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const supabase = createClient()
  const [showAfterTax, setShowAfterTax] = useState(false)
  const [graphField, setGraphField] = useState("")
  const [copied, setCopied] = useState(false)
  const [graphData, setGraphData] = useState<{ year: string; salary: number }[]>([])
  const [graphLoading, setGraphLoading] = useState(false)

  const stateList = country === "au" ? AU_STATES
    : country === "ca" ? CA_PROVINCES
    : country === "uk" ? UK_REGIONS
    : country === "ie" ? IE_PROVINCES
    : US_STATES
  const stateName = stateList.find((s) => s.abbr === state)?.name ?? state
  const stateLabel = country === "ca" ? "Province"
    : country === "uk" ? "Region"
    : country === "ie" ? "Province"
    : "State"

  function handleCountryChange(v: string) {
    const c = v as "us" | "au" | "ca" | "uk" | "ie"
    setCountry(c)
    setState(c === "au" ? "NSW" : c === "ca" ? "ON" : c === "uk" ? "London" : c === "ie" ? "Leinster" : "CA")
    setField("")
    setCareerStage("early")
  }

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    const params = new URLSearchParams({ country, state, limit: String(limit), sort })
    if (field) params.set("field", field)
    if (country === "us" && careerStage !== "early") params.set("career_stage", careerStage)

    fetch(`/api/roi?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return          // discard if superseded
        if (json.error) throw new Error(json.error)
        setData(json.data ?? [])
        setCount(json.count ?? 0)
      })
      .catch((err: Error) => {
        if (cancelled) return
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [country, state, field, sort, limit, careerStage])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user) { setSavedIds(new Set()); return }
    supabase
      .from("saved_courses")
      .select("course_id")
      .eq("user_id", user.id)
      .eq("country", country.toUpperCase())
      .then(({ data }) => {
        if (data) setSavedIds(new Set(data.map((r) => r.course_id)))
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, country])

  async function toggleSave(row: RoiRow) {
    if (!user) { window.location.href = "/login"; return }
    const courseId = row.college_id
    const isSaved = savedIds.has(courseId)
    if (isSaved) {
      await supabase
        .from("saved_courses")
        .delete()
        .eq("user_id", user.id)
        .eq("country", country.toUpperCase())
        .eq("course_id", courseId)
      setSavedIds((prev) => { const next = new Set(prev); next.delete(courseId); return next })
    } else {
      await supabase.from("saved_courses").upsert({
        user_id: user.id,
        country: country.toUpperCase(),
        course_id: courseId,
        course_name: row.field_name ?? "",
        college_name: row.college_name,
        field_name: row.field_name ?? "",
        tuition: row.tuition,
      })
      setSavedIds((prev) => new Set(prev).add(courseId))
    }
  }

  function handleShare() {
    const url = new URL(window.location.href)
    url.searchParams.set('country', country)
    url.searchParams.set('state', state)
    if (field) url.searchParams.set('field', field)
    const shareUrl = url.toString()

    const text = `🎓 Study abroad ROI data for ${COUNTRY_OPTIONS.find(c => c.value === country)?.label ?? country}${field ? ` — ${trimDot(field)}` : ''}\n\nCheck real salary & ROI data → ${shareUrl}`

    if (navigator.share) {
      navigator.share({ title: 'CampCareer ROI Explorer', text, url: shareUrl })
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  function handleTwitterShare() {
    if (!field) {
      const url = new URL(window.location.href)
      url.searchParams.set('country', country)
      url.searchParams.set('state', state)
      const shareUrl = url.toString()
      const countryLabel = COUNTRY_OPTIONS.find(c => c.value === country)?.label ?? country
      const text = `📊 Study abroad ROI data for ${countryLabel} — compare universities by salary & ROI\n\n${shareUrl}`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
    } else {
      const url = new URL(window.location.href)
      url.searchParams.set('country', country)
      url.searchParams.set('state', state)
      url.searchParams.set('field', field)
      const shareUrl = url.toString()
      const countryLabel = COUNTRY_OPTIONS.find(c => c.value === country)?.label ?? country
      const text = `📊 ${trimDot(field)} ROI in ${countryLabel} — real salary & tuition data\n\n${shareUrl}`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  async function loadGraph(selectedField: string) {
    if (!selectedField) return
    setGraphLoading(true)
    setGraphField(selectedField)

    const params = new URLSearchParams({ country, state, limit: "100", sort: "roi_score" })
    params.set("field", selectedField)
    if (country === "us") {
      // US: early/mid/senior 실제 데이터
      const res = await fetch(`/api/roi?${params}`)
      const json = await res.json()
      const rows: RoiRow[] = json.data ?? []
      if (rows.length === 0) { setGraphData([]); setGraphLoading(false); return }
      const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
      const early = avg(rows.map((r) => r.net_salary))
      const mid   = avg(rows.filter((r) => r.roi_score_mid).map((r) => r.net_salary * 1.35))
      const senior= avg(rows.filter((r) => r.roi_score_senior).map((r) => r.net_salary * 1.75))
      setGraphData([
        { year: "Early (1yr)",   salary: early },
        { year: "Mid (4yr)",     salary: mid },
        { year: "Senior (10yr)", salary: senior },
      ])
    } else {
      // AU/CA/UK/IE: 단일 연봉 기반 추정 성장
      const res = await fetch(`/api/roi?${params}`)
      const json = await res.json()
      const rows: RoiRow[] = json.data ?? []
      if (rows.length === 0) { setGraphData([]); setGraphLoading(false); return }
      const avg = Math.round(rows.reduce((a, r) => a + r.net_salary, 0) / rows.length)
      setGraphData([
        { year: "Entry (1yr)",   salary: Math.round(avg * 0.85) },
        { year: "Mid (4yr)",     salary: avg },
        { year: "Senior (10yr)", salary: Math.round(avg * 1.55) },
      ])
    }
    setGraphLoading(false)
  }

  const currencyCode = CURRENCY[country]?.code ?? 'USD'

  const TABLE_COLS = [
    ["College",                        "text-left"],
    ["Field",                          "text-left"],
    ["City",                           "text-left"],
    [country === "us" ? `ROI Score (${careerStage === "early" ? "Early Career" : careerStage === "mid" ? "Mid Career" : "Senior"})` : "ROI Score", "text-right"],
    [showAfterTax ? `After-Tax Salary (${currencyCode})` : `Gross Salary (${currencyCode})`, "text-right"],
    ["Payback",                        "text-right"],
    [`Tuition (${currencyCode})`,      "text-right"],
    ["Grad Rate",                      "text-right"],
    ...(country === "ie" ? [["Admission", "text-right"] as const] : []),
    ["", "text-right"],
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
          <TrendingUp className="w-3 h-3" />
          Live data · {stateName} {country === "us" ? "colleges" : "universities"}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ROI Explorer</h1>
            {country === "us" && (
              <div className="flex items-center gap-1">
                {(["early", "mid", "senior"] as const).map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setCareerStage(stage)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      careerStage === stage
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {stage === "early" ? "Early (1yr)" : stage === "mid" ? "Mid (4yr)" : "Senior (10yr)"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* 공유 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTwitterShare}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors bg-white"
            >
              <span className="font-black text-xs">𝕏</span>
              Share
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors bg-white"
            >
              {copied
                ? <><CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
                : <><Copy className="w-3.5 h-3.5" /> Copy link</>
              }
            </button>
          </div>
        </div>
        <p className="mt-2 text-slate-500 text-sm leading-relaxed">
          Compare return on investment across {stateName} {country === "us" ? "colleges" : "universities"} and cities.
        </p>

        {/* 세전/세후 토글 */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-slate-500">Gross</span>
          <button
            onClick={() => setShowAfterTax((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              showAfterTax ? "bg-indigo-600" : "bg-slate-200"
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              showAfterTax ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
          <span className="text-xs text-slate-500">After Tax</span>
          {showAfterTax && (
            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
              Estimated · {country.toUpperCase()} tax rules applied
            </span>
          )}
        </div>

        {country === "ie" && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg mt-3 max-w-2xl">
            <span className="mt-0.5">📊</span>
            <span>
              Field earnings based on{" "}
              <a
                href="https://hea.ie/statistics/graduate-outcomes/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-amber-900"
              >
                HEA Graduate Outcomes Survey 2023
              </a>
              {" "}— national averages by field of study.
              College-specific earnings data is not publicly available in Ireland.
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-sm overflow-visible">
        <CardContent className="pt-4 pb-5">
          <div className="flex flex-wrap items-end gap-4">

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Country</label>
              <Select value={country} onValueChange={(v) => v && handleCountryChange(v)}>
                <SelectTrigger className="w-44 h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue>
                    {COUNTRY_OPTIONS.find((c) => c.value === country)?.label ?? country}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">{stateLabel}</label>
              <Select value={state} onValueChange={(v) => v && setState(v)}>
                <SelectTrigger className="w-52 h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stateList.map((s) => (
                    <SelectItem key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Field of Study</label>
              {country === "us" || country === "ie" || country === "au" || country === "ca" || country === "uk" ? (
                <FieldCombobox
                  value={field}
                  onChange={(v) => { setField(v); if (v) loadGraph(v); else setGraphData([]) }}
                  country={country}
                />
              ) : (
                <div title="Field-level data not available for this country">
                  <input
                    disabled
                    placeholder="Not available for this country"
                    className="w-64 h-10 rounded-xl border border-slate-200 px-3 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Sort by</label>
              <Select value={sort} onValueChange={(v) => v && setSort(v)}>
                <SelectTrigger className="w-44 h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                  {country === "ie" && (
                    <SelectItem value="avg_cao_points">Admission (CAO pts)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Results</label>
              <Select value={String(limit)} onValueChange={(v) => v && setLimit(Number(v))}>
                <SelectTrigger className="w-28 h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIMIT_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} rows</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!loading && !error && (
              <p className="text-xs text-slate-400 pb-2.5">
                {data.length.toLocaleString()} of {count.toLocaleString()} results
              </p>
            )}

          </div>
        </CardContent>
      </Card>

      {/* 연봉 성장 그래프 */}
      {(graphData.length > 0 || graphLoading) && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Salary Growth — {trimDot(graphField)}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {country.toUpperCase()} · {stateName} · Average across universities
              </p>
            </div>
          </div>

          {graphLoading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={graphData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => {
                    const sym = { us: "$", au: "A$", ca: "C$", uk: "£", ie: "€" }[country] ?? "$"
                    return `${sym}${(v / 1000).toFixed(0)}k`
                  }}
                  width={52}
                />
                <Tooltip
                  formatter={(value) => {
                    const sym = { us: "$", au: "A$", ca: "C$", uk: "£", ie: "€" }[country] ?? "$"
                    const num = typeof value === "number" ? value : 0
                    return [`${sym}${Math.round(num).toLocaleString()}`, "Avg Net Salary"]
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="salary"
                  name="Avg Net Salary"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load data: {error}
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {TABLE_COLS.map(([label, align]) => (
                    <th
                      key={label}
                      className={`px-4 py-3 ${align} text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonRow key={i} cols={TABLE_COLS.length} />
                    ))
                  : data.map((row, i) => (
                    <tr key={`${i}-${row.college_id}-${row.city_id ?? ''}-${row.field_name ?? ''}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate">
                        <Link
                          href={`/roi-explorer/${row.college_id}?country=${country}`}
                          className="hover:text-indigo-600 hover:underline transition-colors"
                        >
                          {row.college_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">
                        {trimDot(row.field_name)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {row.city_name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-indigo-600">
                          {country === "us" && careerStage === "mid"
                            ? (row.roi_score_mid ?? row.roi_score).toFixed(1)
                            : country === "us" && careerStage === "senior"
                            ? (row.roi_score_senior ?? row.roi_score).toFixed(1)
                            : row.roi_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          {showAfterTax ? (
                            <>
                              <span>{formatCurrency(row.net_salary_after_tax ?? row.net_salary, country)}</span>
                              {row.tax_amount && (
                                <span className="text-xs text-red-400">
                                  -{formatCurrency(row.tax_amount, country)} tax
                                </span>
                              )}
                            </>
                          ) : (
                            <span>{formatCurrency(row.gross_salary ?? row.net_salary, country)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {row.payback_years}년
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {formatCurrency(row.tuition, country)}<span className="text-slate-400 text-xs">/yr</span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {(row.graduation_rate * 100).toFixed(1)}%
                      </td>
                      {country === "ie" && (
                        <td className="px-4 py-3 text-right">
                          {row.avg_cao_points ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.avg_cao_points >= 560
                                ? "bg-red-100 text-red-700"
                                : row.avg_cao_points >= 450
                                ? "bg-amber-100 text-amber-700"
                                : row.avg_cao_points >= 350
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {row.avg_cao_points}pts
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleSave(row)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            savedIds.has(row.college_id)
                              ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                              : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                          }`}
                          title={savedIds.has(row.college_id) ? "Remove from saved" : "Save"}
                        >
                          <Bookmark className="w-4 h-4" fill={savedIds.has(row.college_id) ? "currentColor" : "none"} />
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}

export default function ROIExplorerPage() {
  return (
    <Suspense>
      <ROIExplorerContent />
    </Suspense>
  )
}
