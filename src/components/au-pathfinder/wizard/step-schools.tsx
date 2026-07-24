"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, MapPin, TrendingUp, DollarSign, Briefcase, SlidersHorizontal, X } from "lucide-react"
import { getStudyConcept } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { cn } from "@/lib/utils"
import type { AuPathfinderProfile } from "@/lib/au-pathfinder"

type RoiSchool = {
  college_id: string
  college_name: string
  college_state: string
  college_city?: string | null
  field_name?: string | null
  aqf_level?: number | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  roi_score?: number | null
  payback_years?: number | null
}

const AU_STATES = [
  { value: "ALL", labelEn: "All states", labelKo: "전체" },
  { value: "NSW", labelEn: "NSW", labelKo: "뉴사우스웨일즈" },
  { value: "VIC", labelEn: "VIC", labelKo: "빅토리아" },
  { value: "QLD", labelEn: "QLD", labelKo: "퀸즈랜드" },
  { value: "SA", labelEn: "SA", labelKo: "사우스오스트레일리아" },
  { value: "WA", labelEn: "WA", labelKo: "웨스턴오스트레일리아" },
  { value: "TAS", labelEn: "TAS", labelKo: "태즈메이니아" },
  { value: "ACT", labelEn: "ACT", labelKo: "堪培拉" },
]

type SortKey = "roi" | "tuition_low" | "earnings_high" | "employment_high"

const SORT_OPTIONS: { key: SortKey; labelEn: string; labelKo: string }[] = [
  { key: "roi", labelEn: "ROI", labelKo: "ROI 순" },
  { key: "tuition_low", labelEn: "Low tuition", labelKo: "학비 낮은 순" },
  { key: "earnings_high", labelEn: "High earnings", labelKo: "임금 높은 순" },
  { key: "employment_high", labelEn: "Employment", labelKo: "취업률 높은 순" },
]

const TUITION_RANGES = [
  { key: "all", labelEn: "All", labelKo: "전체" },
  { key: "low", labelEn: "Under A$25K", labelKo: "25K 이하" },
  { key: "mid", labelEn: "A$25K–35K", labelKo: "25K–35K" },
  { key: "high", labelEn: "A$35K+", labelKo: "35K 이상" },
]

function money(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? `A$${Math.round(value).toLocaleString()}`
    : "—"
}

function percent(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${Math.round(value * 100)}%`
    : "—"
}

export function StepSchools({
  profile,
  isKo,
  selectedConcept,
  onSelectSchool,
  onBack,
}: {
  profile: AuPathfinderProfile
  isKo: boolean
  selectedConcept: string | null
  onSelectSchool: (school: string) => void
  onBack: () => void
}) {
  const [rawSchools, setRawSchools] = useState<RoiSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [selectedState, setSelectedState] = useState("ALL")
  const [tuitionRange, setTuitionRange] = useState("all")
  const [sortBy, setSortBy] = useState<SortKey>("roi")

  const concept = selectedConcept ? getStudyConcept(selectedConcept) : null
  const conceptVisual = concept ? getStudyCategoryVisual(concept.category) : null
  const conceptLabel = concept ? (isKo ? concept.labelKo : concept.label) : ""

  useEffect(() => {
    if (!concept) return
    setLoading(true)
    setError(null)

    const params = new URLSearchParams({
      country: "au",
      field: concept.roiSearchTerm,
      sort: "roi_score",
      limit: "50",
    })

    fetch(`/api/roi?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setRawSchools([])
        } else {
          // Deduplicate to best ROI per university
          const byUni = new Map<string, RoiSchool>()
          for (const row of (data.data ?? []) as RoiSchool[]) {
            const current = byUni.get(row.college_id)
            if (!current || (row.roi_score ?? 0) > (current.roi_score ?? 0)) {
              byUni.set(row.college_id, row)
            }
          }
          setRawSchools([...byUni.values()])
        }
      })
      .catch(() => setError("Failed to load schools"))
      .finally(() => setLoading(false))
  }, [concept])

  const filtered = useMemo(() => {
    let result = [...rawSchools]

    // State filter
    if (selectedState !== "ALL") {
      result = result.filter((s) => s.college_state === selectedState)
    }

    // Tuition filter
    if (tuitionRange === "low") {
      result = result.filter((s) => (s.tuition ?? Infinity) < 25000)
    } else if (tuitionRange === "mid") {
      result = result.filter((s) => (s.tuition ?? 0) >= 25000 && (s.tuition ?? 0) <= 35000)
    } else if (tuitionRange === "high") {
      result = result.filter((s) => (s.tuition ?? 0) > 35000)
    }

    // Sort
    if (sortBy === "roi") {
      result.sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))
    } else if (sortBy === "tuition_low") {
      result.sort((a, b) => (a.tuition ?? Infinity) - (b.tuition ?? Infinity))
    } else if (sortBy === "earnings_high") {
      result.sort((a, b) => (b.median_earnings ?? 0) - (a.median_earnings ?? 0))
    } else if (sortBy === "employment_high") {
      result.sort((a, b) => (b.employment_rate ?? 0) - (a.employment_rate ?? 0))
    }

    return result.slice(0, 15)
  }, [rawSchools, selectedState, tuitionRange, sortBy])

  const activeFilterCount = [
    selectedState !== "ALL",
    tuitionRange !== "all",
    sortBy !== "roi",
  ].filter(Boolean).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          {isKo ? "이전" : "Back"}
        </button>

        {/* Concept summary */}
        {concept && conceptVisual && (
          <div className="mb-6 flex items-center gap-3">
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", conceptVisual.tone)}>
              <conceptVisual.Icon className="size-5" strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
                {isKo ? "선택한 전공" : "Selected major"}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{conceptLabel}</p>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {isKo ? "추천 학교" : "Recommended universities"}
          </h1>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
              showFilters || activeFilterCount > 0
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            {isKo ? "필터" : "Filters"}
            {activeFilterCount > 0 && (
              <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Filter panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5"
        >
          {/* State filter */}
          <div className="mb-5">
            <p className="mb-2.5 text-xs font-semibold text-slate-500">
              {isKo ? "지역 (주)" : "State"}
            </p>
            <div className="flex flex-wrap gap-2">
              {AU_STATES.map((state) => (
                <button
                  key={state.value}
                  type="button"
                  onClick={() => setSelectedState(state.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    selectedState === state.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {isKo ? state.labelKo : state.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Tuition filter */}
          <div className="mb-5">
            <p className="mb-2.5 text-xs font-semibold text-slate-500">
              {isKo ? "연간 학비" : "Annual tuition"}
            </p>
            <div className="flex flex-wrap gap-2">
              {TUITION_RANGES.map((range) => (
                <button
                  key={range.key}
                  type="button"
                  onClick={() => setTuitionRange(range.key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    tuitionRange === range.key
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {isKo ? range.labelKo : range.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Sort by */}
          <div>
            <p className="mb-2.5 text-xs font-semibold text-slate-500">
              {isKo ? "정렬 기준" : "Sort by"}
            </p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortBy(opt.key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    sortBy === opt.key
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {isKo ? opt.labelKo : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            {isKo ? "학교 불러오는 중..." : "Loading universities..."}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {isKo ? "학교 데이터를 불러올 수 없습니다." : "Could not load university data."}
        </div>
      )}

      {/* Result count */}
      {!loading && !error && rawSchools.length > 0 && (
        <p className="mt-5 text-xs text-slate-400">
          {isKo
            ? `${filtered.length}개 학교 표시 중`
            : `Showing ${filtered.length} ${filtered.length === 1 ? "university" : "universities"}`}
        </p>
      )}

      {/* School list */}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-4 space-y-3">
          {filtered.map((school, i) => (
            <SchoolCard
              key={school.college_id}
              school={school}
              rank={i + 1}
              isKo={isKo}
              isTop={i === 0}
              onSelect={() => onSelectSchool(school.college_name)}
            />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && !error && filtered.length === 0 && rawSchools.length > 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-slate-950">
            {isKo ? "조건에 맞는 학교가 없습니다" : "No universities match your filters"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {isKo
              ? "필터를 변경해보세요."
              : "Try adjusting your filters."}
          </p>
        </div>
      )}

      {!loading && !error && rawSchools.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-slate-950">
            {isKo ? "해당 전공의 학교 데이터가 없습니다" : "No university data for this major"}
          </p>
        </div>
      )}
    </div>
  )
}

function SchoolCard({
  school,
  rank,
  isKo,
  isTop,
  onSelect,
}: {
  school: RoiSchool
  rank: number
  isKo: boolean
  isTop: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-start gap-4 rounded-xl border bg-white px-5 py-4 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
        isTop
          ? "border-blue-300 shadow-sm ring-1 ring-blue-100"
          : "border-slate-200"
      )}
    >
      {/* Rank */}
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
          isTop ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
        )}
      >
        {rank}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">{school.college_name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3" />
              {school.college_city || school.college_state || "Australia"}
              {school.college_state ? `, ${school.college_state}` : ""}
            </p>
          </div>

          {/* ROI score */}
          <div className="shrink-0 rounded-lg bg-slate-950 px-2.5 py-1.5 text-right text-white">
            <p className="text-sm font-semibold leading-none">
              {school.roi_score?.toFixed(1) ?? "—"}
            </p>
            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
              ROI
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-3 flex flex-wrap gap-3">
          <MetricPill
            icon={<DollarSign className="size-3" />}
            label={isKo ? "학비" : "Tuition"}
            value={money(school.tuition)}
          />
          <MetricPill
            icon={<TrendingUp className="size-3" />}
            label={isKo ? "졸업 임금" : "Grad earnings"}
            value={money(school.median_earnings)}
          />
          <MetricPill
            icon={<Briefcase className="size-3" />}
            label={isKo ? "취업률" : "Employment"}
            value={percent(school.employment_rate)}
          />
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight className="mt-2 size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </button>
  )
}

function MetricPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </span>
  )
}
