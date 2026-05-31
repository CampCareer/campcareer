'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bookmark, ArrowRight, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

type RoiRow = {
  college_id: string
  college_name: string
  college_state: string
  field_name: string | null
  roi_score: number
  net_salary: number
  gross_salary: number | null
  tax_amount: number | null
  net_salary_after_tax: number | null
  payback_years: number
  tuition: number
  graduation_rate: number
}

const COUNTRIES = [
  { value: "us", label: "🇺🇸 United States", currency: "$" },
  { value: "au", label: "🇦🇺 Australia",     currency: "A$" },
  { value: "ca", label: "🇨🇦 Canada",        currency: "C$" },
  { value: "uk", label: "🇬🇧 United Kingdom", currency: "£" },
  { value: "ie", label: "🇮🇪 Ireland",        currency: "€" },
]

const DEFAULT_STATE: Record<string, string> = {
  us: "CA", au: "NSW", ca: "ON", uk: "London", ie: "Leinster",
}

function fmt(value: number, currency: string): string {
  return `${currency}${Math.round(value).toLocaleString()}`
}

function trimDot(s: string | null) {
  if (!s) return "—"
  return s.endsWith(".") ? s.slice(0, -1) : s
}

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [country, setCountry] = useState("ie")
  const [field, setField] = useState("")
  const [fieldInput, setFieldInput] = useState("")
  const [fieldOptions, setFieldOptions] = useState<string[]>([])
  const [fieldOpen, setFieldOpen] = useState(false)
  const [data, setData] = useState<RoiRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [recommendedCountry, setRecommendedCountry] = useState<string | null>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  const currencySymbol = COUNTRIES.find(c => c.value === country)?.currency ?? "$"

  // 유저 + 추천 나라 로드
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      supabase
        .from("user_preferences")
        .select("recommended_country")
        .eq("id", data.user.id)
        .single()
        .then(({ data: prefs }) => {
          if (prefs?.recommended_country) {
            const c = prefs.recommended_country.toLowerCase()
            setRecommendedCountry(c)
            setCountry(c)
          }
        })
      supabase
        .from("saved_courses")
        .select("course_id")
        .eq("user_id", data.user.id)
        .then(({ data: saved }) => {
          if (saved) setSavedIds(new Set(saved.map((r) => r.course_id)))
        })
    })
  }, [])

  // 필드 자동완성
  useEffect(() => {
    const container = fieldRef.current
    if (!container) return
    function handler(e: MouseEvent) {
      if (!container!.contains(e.target as Node)) setFieldOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (!fieldInput.trim()) { setFieldOptions([]); setFieldOpen(false); return }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/roi/fields?q=${encodeURIComponent(fieldInput)}&country=${country}`)
      const json = await res.json()
      setFieldOptions(json.fields ?? [])
      setFieldOpen(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [fieldInput, country])

  // ROI 데이터 로드
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      country,
      state: DEFAULT_STATE[country] ?? "CA",
      limit: "8",
      sort: "roi_score",
    })
    if (field) params.set("field", field)
    fetch(`/api/roi?${params}`)
      .then(r => r.json())
      .then(json => { setData(json.data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [country, field])

  async function toggleSave(row: RoiRow) {
    if (!userId) { router.push("/login"); return }
    const isSaved = savedIds.has(row.college_id)
    if (isSaved) {
      await supabase.from("saved_courses").delete()
        .eq("user_id", userId).eq("course_id", row.college_id)
      setSavedIds(prev => { const n = new Set(prev); n.delete(row.college_id); return n })
    } else {
      await supabase.from("saved_courses").upsert({
        user_id: userId,
        country: country.toUpperCase(),
        course_id: row.college_id,
        college_name: row.college_name,
        field_name: row.field_name ?? "",
        tuition: row.tuition,
      })
      setSavedIds(prev => new Set(prev).add(row.college_id))
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">

      {/* 헤더 */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          Find your best<br />university.
        </h1>
        <p className="text-slate-400 mt-3 text-base">
          Real salary data across 5 countries. No guesswork.
        </p>
      </div>

      {/* 검색 바 */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* 국가 선택 */}
        <div className="relative">
          <select
            value={country}
            onChange={e => { setCountry(e.target.value); setField(""); setFieldInput("") }}
            className="h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none cursor-pointer w-full sm:w-48"
          >
            {COUNTRIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
        </div>

        {/* 필드 검색 */}
        <div ref={fieldRef} className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={fieldInput}
              onChange={e => { setFieldInput(e.target.value); if (!e.target.value) setField("") }}
              placeholder="Search field of study — Computer Science, Nursing..."
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          {fieldOpen && fieldOptions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
              {fieldOptions.map(f => (
                <button
                  key={f}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setField(f); setFieldInput(trimDot(f)); setFieldOpen(false) }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors"
                >
                  {trimDot(f)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 결과 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Top results · {COUNTRIES.find(c => c.value === country)?.label}
            {field ? ` · ${trimDot(field)}` : ""}
          </p>
          <Link
            href={`/roi-explorer?country=${country}${field ? `&field=${encodeURIComponent(field)}` : ""}`}
            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* 결과 리스트 */}
        {!loading && (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {data.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No results found. Try a different field or country.
              </div>
            ) : data.map((row, i) => (
              <div
                key={`${row.college_id}-${i}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* 순위 */}
                  <span className="text-xs font-mono text-slate-300 w-4 shrink-0">{i + 1}</span>

                  {/* 대학 정보 */}
                  <div className="min-w-0">
                    <Link
                      href={`/roi-explorer/${row.college_id}?country=${country}`}
                      className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors truncate block"
                    >
                      {row.college_name}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {trimDot(row.field_name)}
                      {row.college_state ? ` · ${row.college_state}` : ""}
                    </p>
                  </div>
                </div>

                {/* 오른쪽 메트릭 */}
                <div className="flex items-center gap-6 shrink-0 ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400">ROI</p>
                    <p className="text-sm font-bold text-indigo-600">{row.roi_score.toFixed(1)}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400">Salary</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {fmt(row.gross_salary ?? row.net_salary, currencySymbol)}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400">Tuition</p>
                    <p className="text-sm text-slate-500">
                      {fmt(row.tuition, currencySymbol)}<span className="text-xs text-slate-400">/yr</span>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSave(row)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      savedIds.has(row.college_id)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Bookmark
                      className="w-4 h-4"
                      fill={savedIds.has(row.college_id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 추천 나라 배지 */}
        {recommendedCountry && recommendedCountry === country && (
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <p className="text-xs text-slate-400">
              Showing your recommended country from onboarding.{" "}
              <Link href="/onboarding" className="text-indigo-500 hover:underline">
                Retake quiz
              </Link>
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
