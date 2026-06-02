'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bookmark, ArrowRight, X, CheckSquare, Compass, CalendarClock } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { calcDdayNumber, currentPhaseTitle } from "@/lib/timeline-schedule"

type RoiRow = {
  college_id: string
  college_name: string
  college_state: string
  field_name: string | null
  roi_score: number
  net_salary: number
  gross_salary: number | null
  payback_years: number
  tuition: number
}

const COUNTRIES = [
  { value: "us", label: "🇺🇸 United States", currency: "$",  placeholder: "e.g. Computer Science, Business..." },
  { value: "au", label: "🇦🇺 Australia",      currency: "A$", placeholder: "e.g. Nursing, Engineering..." },
  { value: "ca", label: "🇨🇦 Canada",         currency: "C$", placeholder: "e.g. Computer Science, Finance..." },
  { value: "uk", label: "🇬🇧 United Kingdom",  currency: "£",  placeholder: "e.g. Law, Medicine, CS..." },
  { value: "ie", label: "🇮🇪 Ireland",         currency: "€",  placeholder: "e.g. Computer Science, Pharmacy..." },
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
  const [fieldInput, setFieldInput] = useState("")
  const [field, setField] = useState("")
  const [fieldOptions, setFieldOptions] = useState<string[]>([])
  const [fieldOpen, setFieldOpen] = useState(false)
  const [data, setData] = useState<RoiRow[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  // "Your next steps" 카드용 상태
  const [recommendedCountry, setRecommendedCountry] = useState<string | null>(null)
  const [checklistProgress, setChecklistProgress] = useState<
    { completed: number; total: number; country?: string; visaType?: string } | null
  >(null)
  const [timelineInfo, setTimelineInfo] = useState<
    { targetDate: string; dday: number; currentPhaseTitle: string | null } | null
  >(null)
  const [stepsLoading, setStepsLoading] = useState(true)

  const currentCountry = COUNTRIES.find(c => c.value === country)!
  const savedCount = savedIds.size

  // 유저 로드 + "Your next steps" 데이터
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setStepsLoading(false); return }
      const uid = data.user.id
      setUserId(uid)

      // 추천 국가 / 저장 코스 / 최근 체크리스트 진행상황 / 타임라인 목표를 병렬 로드
      const [prefsRes, savedRes, progressRes, timelineRes] = await Promise.all([
        supabase
          .from("user_preferences")
          .select("recommended_country")
          .eq("id", uid)
          .maybeSingle(),
        supabase
          .from("saved_courses")
          .select("course_id")
          .eq("user_id", uid),
        supabase
          .from("user_checklist_progress")
          .select("country, visa_type, checked_items")
          .eq("user_id", uid)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("user_timeline")
          .select("target_date")
          .eq("user_id", uid)
          .maybeSingle(),
      ])

      const rec = prefsRes.data?.recommended_country ?? null
      if (rec) {
        setRecommendedCountry(rec)
        setCountry(rec.toLowerCase())
      }

      if (savedRes.data) setSavedIds(new Set(savedRes.data.map((r) => r.course_id)))

      // 타임라인 목표(카드1): target_date 있으면 D-day + 현재 단계 제목
      const targetDate = (timelineRes.data as { target_date: string | null } | null)?.target_date ?? null
      if (targetDate) {
        setTimelineInfo({
          targetDate,
          dday: calcDdayNumber(targetDate),
          currentPhaseTitle: currentPhaseTitle(targetDate),
        })
      }

      const progress = progressRes.data
      if (progress?.checked_items) {
        const completed = (progress.checked_items as string[]).length
        // 전체 항목 수(분모)는 해당 country+visa_type 조합의 캐시 항목 길이
        const { data: cached } = await supabase
          .from("checklist_cache")
          .select("items")
          .eq("country", progress.country)
          .eq("visa_type", progress.visa_type)
          .maybeSingle()
        const total = Array.isArray(cached?.items) ? (cached!.items as unknown[]).length : 0
        setChecklistProgress({
          completed,
          total,
          country: progress.country,
          visaType: progress.visa_type,
        })
      }

      setStepsLoading(false)
    })
  }, [])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) setFieldOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // 자동완성
  useEffect(() => {
    if (!fieldInput.trim()) { setFieldOptions([]); setFieldOpen(false); return }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/roi/fields?q=${encodeURIComponent(fieldInput)}&country=${country}`)
      const json = await res.json()
      setFieldOptions(json.fields ?? [])
      setFieldOpen((json.fields ?? []).length > 0)
    }, 250)
    return () => clearTimeout(timer)
  }, [fieldInput, country])

  async function handleSearch() {
    setLoading(true)
    setSearched(true)
    setFieldOpen(false)
    const params = new URLSearchParams({
      country,
      state: DEFAULT_STATE[country],
      limit: "10",
      sort: "roi_score",
    })
    if (field) params.set("field", field)
    const res = await fetch(`/api/roi?${params}`)
    const json = await res.json()
    setData(json.data ?? [])
    setLoading(false)
  }

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

  function handleClear() {
    setFieldInput("")
    setField("")
    setData([])
    setSearched(false)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">

      {/* 히어로 검색 영역 */}
      <div className={`flex flex-col items-center px-6 transition-all duration-500 ${
        searched ? "justify-center pt-16 pb-8" : "pt-16 pb-12"
      }`}>

        {/* 헤드라인 */}
        {!searched && (
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-3">
              Find your best university abroad.
            </h1>
            <p className="text-lg text-slate-500">
              Real salary data across 5 countries. No guesswork.
            </p>
          </div>
        )}

        {/* 검색 박스 */}
        <div className="w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-0 border-2 border-slate-200 rounded-2xl overflow-visible bg-white focus-within:border-indigo-400 transition-colors shadow-sm">

            {/* 국가 선택 */}
            <div className="relative shrink-0">
              <select
                value={country}
                onChange={e => { setCountry(e.target.value); setField(""); setFieldInput(""); setData([]); setSearched(false) }}
                className="h-16 pl-5 pr-10 bg-transparent text-base font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer w-full sm:w-52 border-b-2 sm:border-b-0 sm:border-r-2 border-slate-100"
              >
                {COUNTRIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
            </div>

            {/* 전공 검색 */}
            <div ref={fieldRef} className="relative flex-1">
              <div className="flex items-center h-16 px-4 gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={fieldInput}
                  onChange={e => {
                    setFieldInput(e.target.value)
                    if (!e.target.value) {
                      setField("")
                    }
                    // 입력이 바뀌면 이전 결과 즉시 비움
                    if (searched) {
                      setData([])
                      setSearched(false)
                    }
                  }}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch() }}
                  placeholder={currentCountry.placeholder}
                  className="flex-1 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
                {fieldInput && (
                  <button onClick={handleClear} className="text-slate-300 hover:text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* 자동완성 드롭다운 */}
              {fieldOpen && fieldOptions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl max-h-56 overflow-y-auto">
                  {fieldOptions.map(f => (
                    <button
                      key={f}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setField(f); setFieldInput(trimDot(f)); setFieldOpen(false) }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors"
                    >
                      {trimDot(f)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 검색 버튼 */}
            <button
              onClick={handleSearch}
              className="h-16 px-9 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition-colors shrink-0 rounded-b-xl sm:rounded-b-none sm:rounded-r-xl"
            >
              Search
            </button>
          </div>

          {/* 힌트 태그 */}
          {!searched && (
            <div className="flex flex-wrap gap-2 mt-5 justify-center">
              {["Computer Science", "Nursing", "Business", "Engineering", "Data Science"].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setFieldInput(tag); setField(tag) }}
                  className="text-sm px-4 py-2 rounded-full border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Your next steps (실제 Supabase 데이터) */}
          {!searched && (() => {
            const recMeta = recommendedCountry
              ? COUNTRIES.find(c => c.value === recommendedCountry.toLowerCase())
              : null
            const recFlag = recMeta ? recMeta.label.split(" ")[0] : ""
            const recName = recMeta ? recMeta.label.split(" ").slice(1).join(" ") : ""
            const cardClass = "group rounded-xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all"
            const ddayLabel = timelineInfo
              ? timelineInfo.dday > 0
                ? `D-${timelineInfo.dday}`
                : timelineInfo.dday === 0
                ? "D-Day"
                : `D+${Math.abs(timelineInfo.dday)}`
              : ""

            return (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-900">Your next steps</h2>
                  <span className="text-sm text-slate-400">Pick up where you left off</span>
                </div>

                {stepsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-[120px] rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* 카드1 — 타임라인 D-day → 추천국가 → 온보딩으로 진화 */}
                    {timelineInfo ? (
                      <Link href="/timeline" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarClock className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Timeline</span>
                        </div>
                        <p className="text-lg font-bold text-indigo-600 mb-0.5 leading-none">{ddayLabel}</p>
                        <p className="text-sm text-slate-500 truncate mt-1">
                          {timelineInfo.currentPhaseTitle ?? "On track"}
                        </p>
                      </Link>
                    ) : recMeta ? (
                      <Link href="/timeline" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{recFlag}</span>
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Recommended</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-0.5">{recName}</p>
                        <p className="text-sm text-slate-500">Set your timeline</p>
                      </Link>
                    ) : (
                      <Link href="/onboarding" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <Compass className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Get started</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-0.5">Take the quiz</p>
                        <p className="text-sm text-slate-500">Find your best-fit country</p>
                      </Link>
                    )}

                    {/* 카드2 — Checklist */}
                    {checklistProgress && checklistProgress.total > 0 ? (
                      <Link href="/checklist" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckSquare className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Checklist</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-2">
                          {checklistProgress.completed} of {checklistProgress.total} completed
                        </p>
                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(checklistProgress.completed / checklistProgress.total) * 100}%` }}
                          />
                        </div>
                      </Link>
                    ) : (
                      <Link href="/checklist" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckSquare className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Checklist</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-0.5">Start your checklist</p>
                        <p className="text-sm text-slate-500">Track every requirement</p>
                      </Link>
                    )}

                    {/* 카드3 — Saved */}
                    {savedCount > 0 ? (
                      <Link href="/saved" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <Bookmark className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Saved</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-0.5">
                          {savedCount} saved course{savedCount > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-slate-500">View all</p>
                      </Link>
                    ) : (
                      <Link href="/roi-explorer" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <Bookmark className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Saved</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-0.5">Nothing saved yet</p>
                        <p className="text-sm text-slate-500">Browse the ROI Explorer</p>
                      </Link>
                    )}

                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>

      {/* 결과 영역 */}
      {searched && (
        <div className="flex-1 px-6 pb-12">
          <div className="max-w-2xl mx-auto">

            {/* 결과 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {currentCountry.label}
                {field ? ` · ${trimDot(field)}` : " · All fields"}
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
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            )}

            {/* 결과 리스트 */}
            {!loading && (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {data.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-sm text-slate-400">No results found.</p>
                    <p className="text-xs text-slate-300 mt-1">Try a different field or country.</p>
                  </div>
                ) : data.map((row, i) => (
                  <div
                    key={`${row.college_id}-${i}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs font-mono text-slate-300 w-4 shrink-0">{i + 1}</span>
                      <div className="min-w-0">
                        <Link
                          href={`/roi-explorer/${row.college_id}?country=${country}`}
                          className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors truncate block"
                        >
                          {row.college_name}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {trimDot(row.field_name)}{row.college_state ? ` · ${row.college_state}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 shrink-0 ml-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">ROI</p>
                        <p className="text-sm font-bold text-indigo-600">{row.roi_score.toFixed(1)}</p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Salary</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {fmt(row.gross_salary ?? row.net_salary, currentCountry.currency)}
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
                        <Bookmark className="w-4 h-4" fill={savedIds.has(row.college_id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
