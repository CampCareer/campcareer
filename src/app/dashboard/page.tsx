'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bookmark, ArrowRight, X, CheckSquare, Compass, CalendarClock, Globe, ShieldCheck, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { COUNTRY_META, RISK_BADGE, type CountryCode, type RiskLevel } from "@/lib/degree-risk"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { calcDdayNumber, currentPhaseTitle } from "@/lib/timeline-schedule"
import { RoiInfo } from "@/components/roi-info"

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

const DEFAULT_STATE: Record<string, string> = {
  us: "CA", au: "NSW", ca: "ON", uk: "ALL_STATES", ie: "Leinster",
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
  const t = useTranslations()
  const td = t.dashboard

  const COUNTRIES = [
    { value: "us", label: "🇺🇸 United States", currency: "$",  placeholder: td.searchPlaceholder.us },
    { value: "au", label: "🇦🇺 Australia",      currency: "A$", placeholder: td.searchPlaceholder.au },
    { value: "ca", label: "🇨🇦 Canada",         currency: "C$", placeholder: td.searchPlaceholder.ca },
    { value: "uk", label: "🇬🇧 United Kingdom",  currency: "£",  placeholder: td.searchPlaceholder.uk },
    { value: "ie", label: "🇮🇪 Ireland",         currency: "€",  placeholder: td.searchPlaceholder.ie },
  ]

  const [country, setCountry] = useState("ie")
  const [fieldInput, setFieldInput] = useState("")
  const [field, setField] = useState("")
  const [fieldOptions, setFieldOptions] = useState<string[]>([])
  const [fieldOpen, setFieldOpen] = useState(false)
  const [data, setData] = useState<RoiRow[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [fieldFallback, setFieldFallback] = useState<{ requested: string } | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [topPicks, setTopPicks] = useState<RoiRow[]>([])
  const [topLoading, setTopLoading] = useState(true)
  const fieldRef = useRef<HTMLDivElement>(null)
  // Hero-search auto-run: set once on mount when ?source=hero, then cleared
  const [autoSearchParams, setAutoSearchParams] = useState<{ country: string; field: string } | null>(null)
  // Prevents auth effect from overriding a country set via URL param
  const urlCountrySetRef = useRef(false)

  // "Your next steps" 카드용 상태
  const [recommendedCountry, setRecommendedCountry] = useState<string | null>(null)
  const [checklistProgress, setChecklistProgress] = useState<
    { completed: number; total: number; country?: string; visaType?: string } | null
  >(null)
  const [timelineInfo, setTimelineInfo] = useState<
    { targetDate: string; dday: number; currentPhaseTitle: string | null } | null
  >(null)
  const [stepsLoading, setStepsLoading] = useState(true)

  // Recent degree-risk checks linked to this account (Phase N)
  type RecentCheck = { id: string; major: string; view: string; risk: RiskLevel | null }
  const [recentChecks, setRecentChecks] = useState<RecentCheck[]>([])

  const currentCountry = COUNTRIES.find(c => c.value === country)!
  const savedCount = savedIds.size
  // Derived from recommendedCountry state — recalculated on each render, used in header + next-steps cards
  const recMeta = recommendedCountry
    ? COUNTRIES.find(c => c.value === recommendedCountry.toLowerCase())
    : null
  const recFlag = recMeta ? recMeta.label.split(" ")[0] : ""
  const recName = recMeta ? recMeta.label.split(" ").slice(1).join(" ") : ""

  // Read URL query params on first mount (hero search handoff)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const srcCountry = params.get('country')?.toLowerCase()
    const srcField   = params.get('field')?.trim()
    const src        = params.get('source')

    const validCountries = ['us', 'au', 'ca', 'uk', 'ie']
    const resolvedCountry = srcCountry && validCountries.includes(srcCountry) ? srcCountry : null

    if (resolvedCountry) {
      setCountry(resolvedCountry)
      urlCountrySetRef.current = true
    }
    if (srcField) {
      setField(srcField)
      setFieldInput(srcField)
    }
    // Trigger auto-search when coming from the hero search widget
    if (src === 'hero' && srcField) {
      setAutoSearchParams({ country: resolvedCountry ?? 'ie', field: srcField })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Execute auto-search triggered by URL params (source=hero)
  useEffect(() => {
    if (!autoSearchParams) return
    const { country: c, field: f } = autoSearchParams
    setAutoSearchParams(null) // clear immediately to prevent re-run
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams({
      country: c,
      state: DEFAULT_STATE[c] ?? 'CA',
      limit: '10',
      sort: 'roi_score',
    })
    params.set('field', f)
    fetch(`/api/roi?${params}`)
      .then(res => res.json())
      .then(json => {
        setData(json.data ?? [])
        setFieldFallback(json.fieldQuery?.fallbackApplied ? { requested: json.fieldQuery.requested } : null)
        setLoading(false)
      })
      .catch(() => { setData([]); setFieldFallback(null); setLoading(false) })
  }, [autoSearchParams])

  // 유저 로드 + "Your next steps" 데이터
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setStepsLoading(false); return }
      const uid = data.user.id
      setUserId(uid)

      // Claim a pre-login anonymous assessment onto this account (best effort),
      // so the quiz the visitor did before signing in shows up below.
      try {
        const lastAid = localStorage.getItem("cc_last_aid")
        if (lastAid) {
          await supabase.from("assessments").update({ user_id: uid }).eq("id", lastAid).is("user_id", null)
          localStorage.removeItem("cc_last_aid")
        }
      } catch { /* claim is best-effort; never block the dashboard */ }

      // 추천 국가 / 저장 코스 / 최근 체크리스트 진행상황 / 타임라인 목표 / 최근 전공 체크를 병렬 로드
      const [prefsRes, savedRes, progressRes, timelineRes, checksRes] = await Promise.all([
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
        supabase
          .from("assessments")
          .select("id, major_pref, result_snapshot, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(4),
      ])

      // Recent degree-risk checks (now SELECT-able via the user_id link).
      type Snapshot = { view?: string; majors?: { country: string; overall_risk: RiskLevel }[] }
      const checks: RecentCheck[] = (checksRes.data ?? []).map((a) => {
        const snap = (a.result_snapshot ?? null) as Snapshot | null
        const view = snap?.view ?? "all"
        const majors = snap?.majors ?? []
        const risk = (majors.find((m) => m.country === view) ?? majors[0])?.overall_risk ?? null
        return { id: a.id as string, major: a.major_pref as string, view, risk }
      })
      setRecentChecks(checks)

      const rec = prefsRes.data?.recommended_country ?? null
      if (rec) {
        setRecommendedCountry(rec)
        // Don't override a country that was explicitly set via URL param (hero search handoff)
        if (!urlCountrySetRef.current) {
          setCountry(rec.toLowerCase())
        }
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

  // Top ROI 미리보기: 검색 전(searched=false)일 때 국가별 상위 5개 로드
  useEffect(() => {
    if (searched) return
    setTopLoading(true)
    const params = new URLSearchParams({
      country,
      state: DEFAULT_STATE[country],
      limit: "20",
      sort: "roi_score",
    })
    fetch(`/api/roi?${params}`)
      .then(res => res.json())
      .then(json => {
        // college_id 기준 중복 제거 — 같은 학교는 ROI 최고(첫 번째)만 유지
        const rows: RoiRow[] = json.data ?? []
        const seen = new Set<string>()
        const deduped = rows.filter(r => {
          const key = r.college_id || r.college_name
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        setTopPicks(deduped.slice(0, 5))
        setTopLoading(false)
      })
      .catch(() => { setTopPicks([]); setTopLoading(false) })
  }, [country, searched])

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
    setFieldFallback(json.fieldQuery?.fallbackApplied ? { requested: json.fieldQuery.requested } : null)
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

  // 결과 행 마크업 (검색 결과 + Top ROI picks 양쪽에서 재사용)
  function renderRoiRow(row: RoiRow, i: number) {
    return (
      <div
        key={`${row.college_id}-${i}`}
        className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-xs font-mono text-slate-300 w-4 shrink-0">{i + 1}</span>
          <div className="min-w-0">
            <Link
              href={`/roi-explorer/${country}/${row.college_id}`}
              className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors truncate block"
            >
              {row.college_name}
            </Link>
            <p className="text-xs text-slate-400 mt-0.5">
              {trimDot(row.field_name)}{row.college_state ? ` · ${row.college_state}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 shrink-0 ml-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{td.topPicks.roi}</p>
            <p className="text-sm font-bold text-blue-600">{row.roi_score.toFixed(1)}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{td.topPicks.salary}</p>
            <p className="text-sm font-semibold text-slate-700">
              {fmt(row.gross_salary ?? row.net_salary, currentCountry.currency)}
            </p>
          </div>
          <button
            onClick={() => toggleSave(row)}
            className={`p-1.5 rounded-lg transition-colors ${
              savedIds.has(row.college_id)
                ? "text-blue-600 bg-blue-50"
                : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Bookmark className="w-4 h-4" fill={savedIds.has(row.college_id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">

      {/* 히어로 검색 영역 — 슬림한 좌측 정렬 헤더 + 위젯 대시보드 */}
      <div className="flex flex-col px-6 sm:px-8 pt-8 pb-8">
        <div className="w-full max-w-5xl mx-auto">

          {/* Decision dashboard compact header */}
          <div className="mb-7">
            <h1 className="text-xl font-bold text-slate-900">{td.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{td.subtitle}</p>
            <div className="mt-3 h-7 flex items-center">
              {stepsLoading ? (
                <div className="h-6 w-64 rounded-full bg-slate-100 animate-pulse" />
              ) : recMeta ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5">
                  <span>{recFlag}</span>
                  <span>{td.recommendedStartingPoint}: {recName}</span>
                </span>
              ) : (
                <Link
                  href="/degree-risk"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {td.startDecisionQuiz}
                </Link>
              )}
            </div>
          </div>

          {/* 국가 선택 칩 */}
          <p className="text-xs font-medium text-slate-400 mb-3">{td.whereToStudy}</p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => { setCountry(c.value); setField(""); setFieldInput(""); setData([]); setSearched(false) }}
                className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors focus:outline-none ${
                  c.value === country
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* 검색 박스 (풀폭) */}
          <div className="flex flex-col sm:flex-row gap-0 border-2 border-slate-200 rounded-2xl overflow-visible bg-white focus-within:border-blue-400 transition-colors shadow-sm mt-4">

            {/* 전공 검색 */}
            <div ref={fieldRef} className="relative flex-1">
              <div className="flex items-center h-14 px-4 gap-3">
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
                  <button type="button" onClick={handleClear} aria-label="Clear search" className="text-slate-300 hover:text-slate-500">
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
                      className="w-full px-4 py-3 text-left text-sm hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors"
                    >
                      {trimDot(f)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 검색 버튼 */}
            <button
              type="button"
              onClick={handleSearch}
              className="h-14 px-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-colors shrink-0 rounded-b-xl sm:rounded-b-none sm:rounded-r-xl"
            >
              {td.searchButton}
            </button>
          </div>

          {/* 힌트 태그 (좌측 정렬) */}
          {!searched && (
            <div className="flex flex-wrap gap-2 mt-4">
              {["Computer Science", "Nursing", "Business", "Engineering", "Data Science"].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setFieldInput(tag); setField(tag) }}
                  className="text-sm px-4 py-2 rounded-full border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors bg-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Your degree-risk checks — the re-entry hub (no quiz auto-restart) */}
          {!searched && !stepsLoading && (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">{td.recentChecks.title}</h2>
                {recentChecks.length > 0 && (
                  <Link
                    href="/degree-risk"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-3.5 w-3.5" /> {td.recentChecks.startNew}
                  </Link>
                )}
              </div>

              {recentChecks.length === 0 ? (
                <Link
                  href="/degree-risk"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-sm font-medium text-blue-600 transition-colors hover:border-blue-300"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-slate-500">{td.recentChecks.empty}</span>
                  {td.recentChecks.emptyCta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recentChecks.map((c) => {
                    const opts = t.degreeRisk.options as Record<string, string>
                    const majorName = opts[c.major] ?? c.major
                    const isAll = c.view === "all"
                    const flag = isAll ? "🌐" : COUNTRY_META[c.view as CountryCode].flag
                    const viewLabel = isAll
                      ? td.recentChecks.allCountries
                      : t.degreeRisk.result.countries[c.view as CountryCode]
                    return (
                      <Link
                        key={c.id}
                        href={`/degree-risk/result?major=${c.major}&view=${c.view}&aid=${c.id}`}
                        className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">{flag} {viewLabel}</p>
                            <p className="truncate text-sm font-semibold text-slate-900">{majorName}</p>
                          </div>
                          {c.risk && (
                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${RISK_BADGE[c.risk].className}`}>
                              {t.degreeRisk.result.risk[c.risk]}
                            </span>
                          )}
                        </div>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                          {td.recentChecks.viewResult}
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Your next steps — 4-card decision flow: Decide · Compare · Plan · Track */}
          {!searched && (() => {
            const cardClass = "group rounded-xl border border-slate-200 bg-slate-50 p-5 min-h-[140px] hover:bg-white hover:shadow-md hover:border-slate-300 transition-all"
            const focalCardClass = "group rounded-xl border border-blue-100 bg-blue-50 p-5 min-h-[140px] hover:shadow-md transition-all"
            const ddayLabel = timelineInfo
              ? timelineInfo.dday > 0
                ? `D-${timelineInfo.dday}`
                : timelineInfo.dday === 0
                ? "D-Day"
                : `D+${Math.abs(timelineInfo.dday)}`
              : ""

            return (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-900">{td.nextSteps.title}</h2>
                  <span className="text-sm text-slate-400">{td.nextSteps.subtitle}</span>
                </div>

                {stepsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-[140px] rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                    {/* Card 1: DECIDE — recommended country or onboarding */}
                    {recMeta ? (
                      <Link href="/degree-risk" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{recFlag}</span>
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{td.nextSteps.decideLabel}</span>
                        </div>
                        <p className="text-xl font-bold text-slate-900 mb-0.5">{recName}</p>
                        <p className="text-sm text-slate-500">{td.nextSteps.recommendedLabel}</p>
                      </Link>
                    ) : (
                      <Link href="/degree-risk" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <Compass className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{td.nextSteps.decideLabel}</span>
                        </div>
                        <p className="text-xl font-bold text-slate-900 mb-0.5">{td.nextSteps.takeQuiz}</p>
                        <p className="text-sm text-slate-500">{td.nextSteps.findCountry}</p>
                      </Link>
                    )}

                    {/* Card 2: COMPARE — Country Compare */}
                    <Link href="/compare" className={cardClass}>
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{td.nextSteps.compareLabel}</span>
                      </div>
                      <p className="text-xl font-bold text-slate-900 mb-0.5">{td.nextSteps.compareCard}</p>
                      <p className="text-sm text-slate-500">{td.nextSteps.compareCardSub}</p>
                    </Link>

                    {/* Card 3: PLAN — Timeline D-day → checklist progress → build timeline */}
                    {timelineInfo ? (
                      <Link href="/timeline" className={focalCardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarClock className="w-5 h-5 text-blue-400" />
                          <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">{td.nextSteps.planLabel}</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 mb-0.5 leading-none">{ddayLabel}</p>
                        <p className="text-sm text-slate-500 truncate mt-2">
                          {timelineInfo.currentPhaseTitle ?? td.nextSteps.onTrack}
                        </p>
                      </Link>
                    ) : checklistProgress && checklistProgress.total > 0 ? (
                      <Link href="/checklist" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckSquare className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{td.nextSteps.planLabel}</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-2 leading-none">
                          {checklistProgress.completed}
                          <span className="text-base font-medium text-slate-400"> / {checklistProgress.total} {td.nextSteps.checklistCompleted}</span>
                        </p>
                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(checklistProgress.completed / checklistProgress.total) * 100}%` }}
                          />
                        </div>
                      </Link>
                    ) : (
                      <Link href="/timeline" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarClock className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{td.nextSteps.planLabel}</span>
                        </div>
                        <p className="text-xl font-bold text-slate-900 mb-0.5">{td.nextSteps.buildTimeline}</p>
                        <p className="text-sm text-slate-500">{td.nextSteps.planCardSub}</p>
                      </Link>
                    )}

                    {/* Card 4: TRACK — saved courses */}
                    {savedCount > 0 ? (
                      <Link href="/saved" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <Bookmark className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{td.nextSteps.trackLabel}</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-0.5 leading-none">
                          {savedCount}
                          <span className="text-base font-medium text-slate-400"> {savedCount === 1 ? td.nextSteps.savedCourse : td.nextSteps.savedCourses}</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-2">{td.nextSteps.viewAll}</p>
                      </Link>
                    ) : (
                      <Link href="/saved" className={cardClass}>
                        <div className="flex items-center gap-2 mb-2">
                          <Bookmark className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{td.nextSteps.trackLabel}</span>
                        </div>
                        <p className="text-xl font-bold text-slate-900 mb-0.5">{td.nextSteps.nothingSaved}</p>
                        <p className="text-sm text-slate-500">{td.nextSteps.browseRoi}</p>
                      </Link>
                    )}

                  </div>
                )}
              </div>
            )
          })()}

          {/* Top ROI picks (검색 전 미리보기) */}
          {!searched && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  {td.topPicks.titlePrefix} {currentCountry.label}
                  <RoiInfo />
                </h2>
                <Link
                  href={`/roi-explorer?country=${country}`}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                >
                  {td.topPicks.viewAll} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {topLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : topPicks.length === 0 ? (
                <Link
                  href="/roi-explorer"
                  className="flex items-center justify-center gap-1 py-10 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-blue-600 hover:text-blue-700 hover:border-blue-300 transition-colors"
                >
                  {td.topPicks.browse} <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {topPicks.map((row, i) => renderRoiRow(row, i))}
                </div>
              )}
            </div>
          )}
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
                {field ? ` · ${trimDot(field)}` : ` · ${td.results.allFields}`}
              </p>
              <Link
                href={`/roi-explorer?country=${country}${field ? `&field=${encodeURIComponent(field)}` : ""}`}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                {td.results.viewAll} <ArrowRight className="w-3 h-3" />
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

            {/* 필드 폴백 알림 */}
            {!loading && fieldFallback && data.length > 0 && (
              <p className="text-xs text-blue-500 mb-2 px-1">
                {td.results.fallbackNote.replace('{field}', fieldFallback.requested)}
              </p>
            )}

            {/* 결과 리스트 */}
            {!loading && (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {data.length === 0 ? (
                  <div className="py-16 text-center space-y-2 px-6">
                    <p className="text-sm text-slate-400">{td.results.noResults}</p>
                    <p className="text-xs text-slate-300">{td.results.tryAnother}</p>
                    {country === 'uk' && (
                      <a
                        href="/roi-explorer?country=uk&state=ALL_STATES"
                        className="inline-block mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
                      >
                        {td.results.viewAllUk}
                      </a>
                    )}
                  </div>
                ) : data.map((row, i) => renderRoiRow(row, i))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
