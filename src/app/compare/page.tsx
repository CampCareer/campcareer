"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"
import { TrendingUp, X, ArrowRight, BarChart2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
}

const COUNTRIES = ["us", "au", "ca", "uk", "ie"] as const
type Country = (typeof COUNTRIES)[number]

type CompareData = Record<Country, CountryStats>

// ── Constants ─────────────────────────────────────────────────────────────────

const COUNTRY_CONFIG: Record<
  Country,
  { flag: string; name: string; color: string; currency: string }
> = {
  us: { flag: "🇺🇸", name: "United States",  color: "#6366f1", currency: "$"  },
  au: { flag: "🇦🇺", name: "Australia",      color: "#10b981", currency: "A$" },
  ca: { flag: "🇨🇦", name: "Canada",         color: "#f43f5e", currency: "C$" },
  uk: { flag: "🇬🇧", name: "United Kingdom", color: "#3b82f6", currency: "£"  },
  ie: { flag: "🇮🇪", name: "Ireland",        color: "#f59e0b", currency: "€"  },
}

function fmt(value: number, currency: string) {
  return `${currency}${Math.round(value).toLocaleString()}`
}

function trimDot(s: string | null) {
  if (!s) return ""
  return s.endsWith(".") ? s.slice(0, -1) : s
}

// ── FieldCombobox ─────────────────────────────────────────────────────────────

function FieldCombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [input, setInput] = useState(value ? trimDot(value) : "")
  const [options, setOptions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // Keep a stable ref to onChange so the debounce effect doesn't need it as a dep
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
    if (!input.trim()) {
      setOptions([]); setOpen(false)
      onChangeRef.current("")
      return
    }
    const t = setTimeout(async () => {
      // Always propagate the typed value so parent search fires without needing dropdown
      onChangeRef.current(input.trim())
      try {
        const res = await fetch(`/api/roi/fields?q=${encodeURIComponent(input)}`)
        const json = await res.json()
        setOptions(json.fields ?? [])
        if (json.fields?.length > 0) setOpen(true)
      } catch { /* ignore */ }
    }, 400)
    return () => clearTimeout(t)
  }, [input])

  function handleSelect(f: string) {
    setInput(trimDot(f))
    onChangeRef.current(f)
    setOpen(false)
  }

  function handleClear() {
    setInput(""); onChangeRef.current(""); setOptions([]); setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => options.length > 0 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              onChangeRef.current(input.trim())
              setOpen(false)
            }
          }}
          placeholder="e.g. Computer Science, Business…"
          className="w-80 h-11 rounded-xl border border-slate-200 px-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-white shadow-sm"
        />
        {input && (
          <button onClick={handleClear} className="absolute right-3 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {open && options.length > 0 && (
        <div className="absolute z-50 mt-1 w-full min-w-[320px] rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
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

// ── Country Card ──────────────────────────────────────────────────────────────

function CountryCard({
  country,
  stats,
  field,
}: {
  country: Country
  stats: CountryStats
  field: string
}) {
  const cfg = COUNTRY_CONFIG[country]
  const hasData = stats.count > 0

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
            {stats.count} results
          </span>
        )}
      </div>

      <CardContent className="flex-1 pt-3 pb-4 space-y-3">
        {!hasData ? (
          <p className="text-sm text-slate-400 py-4 text-center">No data found</p>
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
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Avg ROI</p>
                <p className="text-base font-bold" style={{ color: cfg.color }}>
                  {stats.avg_roi.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Avg Salary</p>
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {fmt(stats.avg_salary, cfg.currency)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Payback</p>
                <p className="text-sm font-semibold text-slate-700">
                  {stats.avg_payback.toFixed(1)}년
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
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function CompareContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [field, setField] = useState(searchParams.get("field") ?? "")
  const [data, setData] = useState<CompareData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFieldChange(v: string) {
    setField(v)
    // Sync to URL for shareability
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

    fetch(`/api/compare?field=${encodeURIComponent(field)}`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((json) => {
        if (json.error) throw new Error(json.error)
        setData(json)
      })
      .catch((err: Error) => { if (err.name !== "AbortError") setError(err.message) })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [field])

  const chartData: ChartEntry[] = data
    ? COUNTRIES.map((c) => ({
        country: COUNTRY_CONFIG[c].flag + " " + c.toUpperCase(),
        roi: data[c].avg_roi,
        color: COUNTRY_CONFIG[c].color,
      }))
    : []

  const hasAnyData = data && COUNTRIES.some((c) => data[c].count > 0)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
          <TrendingUp className="w-3 h-3" />
          5-country comparison
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Compare by Field of Study
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          Pick a field and see ROI across all 5 countries side by side.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <FieldCombobox value={field} onChange={handleFieldChange} />
        {field && !loading && (
          <span className="text-xs text-slate-400">
            Showing results for <span className="font-medium text-slate-600">{trimDot(field)}</span>
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load: {error}
        </div>
      )}

      {/* Empty state */}
      {!field && !loading && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <BarChart2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Select a field to compare across countries</p>
          <p className="text-slate-400 text-xs mt-1">
            Try &ldquo;Computer Science&rdquo;, &ldquo;Business&rdquo;, or &ldquo;Nursing&rdquo;
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
                />
              ))}
        </div>
      )}

      {/* Bar Chart */}
      {!loading && hasAnyData && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Average ROI Score by Country
          </h2>
          <Card>
            <CardContent className="pt-5 pb-4">
              <CompareBarChart data={chartData} />
            </CardContent>
          </Card>
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
