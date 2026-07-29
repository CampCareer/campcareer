"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Check, ClipboardCheck, DollarSign, GraduationCap, Search, Target, TrendingUp, Briefcase, Star, Trash2, ArrowRight, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { fieldNameToConceptId, shortageLevel, shortageLabel, shortageColor } from "@/lib/au-major-signals"

export type CompareSchool = {
  id: string
  college_name: string
  college_state: string
  college_city?: string | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  score?: number | null
  roi_score?: number | null
  payback_years?: number | null
}

export type CompareGoalOption = {
  id: string
  position: number
  source_type: "saved_university" | "saved_course"
  source_reference: string
  title: string
  provider_name: string
  field_name: string
}

export type ComparePathwayDecision = {
  leading_option_id: string | null
  rationale: string
}

type CompareTab = "majors" | "schools" | "pathway"
const EMPTY_GOAL_OPTIONS: CompareGoalOption[] = []

type MajorResult = {
  field_name: string
  score: number | null
  roi_score: number | null
  median_earnings: number | null
  payback_years: number | null
  tuition: number | null
  employment_rate?: number | null
  college_name?: string | null
  college_state?: string | null
}

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

export function CompareSpace({
  schools,
  isKo,
  onRemove,
  goalTitle,
  studyTitle,
  goalOptions,
  decision,
  evidenceCount,
  onSaveDecision,
}: {
  schools: CompareSchool[]
  isKo: boolean
  onRemove: (id: string) => void
  goalTitle?: string
  studyTitle?: string
  goalOptions?: CompareGoalOption[]
  decision?: ComparePathwayDecision
  evidenceCount?: number
  onSaveDecision?: (next: ComparePathwayDecision) => Promise<boolean>
}) {
  const [tab, setTab] = useState<CompareTab>("majors")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [leadingId, setLeadingId] = useState(decision?.leading_option_id ?? "")
  const [rationale, setRationale] = useState(decision?.rationale ?? "")
  const [saving, setSaving] = useState(false)
  const [optionSchools, setOptionSchools] = useState<CompareSchool[]>([])
  const [hiddenSchoolIds, setHiddenSchoolIds] = useState<string[]>([])

  const options = goalOptions ?? EMPTY_GOAL_OPTIONS
  const hasPathway = options.length > 0 || Boolean(goalTitle || studyTitle)
  const optionUniversities = useMemo(
    () => options.filter((option) => option.source_type === "saved_university" && option.source_reference),
    [options],
  )

  useEffect(() => {
    let cancelled = false
    async function loadOptionSchools() {
      const resolved = await Promise.all(optionUniversities.map(async (option) => {
        const fallback: CompareSchool = {
          id: option.id,
          college_name: option.provider_name || option.title,
          college_state: "",
          college_city: null,
        }
        try {
          const params = new URLSearchParams({
            country: "au",
            college_id: option.source_reference,
            field: option.field_name,
            limit: "100",
            sort: "score",
          })
          const response = await fetch(`/api/roi?${params}`)
          const json = await response.json()
          const rows = (json.data ?? []) as Array<CompareSchool & { field_name?: string | null }>
          const matchingRows = option.field_name
            ? rows.filter((row) => row.field_name?.toLowerCase().includes(option.field_name.toLowerCase()))
            : rows
          const school = matchingRows[0] ?? rows[0]
          return school ? { ...school, id: option.id } : fallback
        } catch {
          return fallback
        }
      }))
      if (!cancelled) setOptionSchools(resolved)
    }
    void loadOptionSchools()
    return () => { cancelled = true }
  }, [optionUniversities])

  const comparisonSchools = [...schools, ...optionSchools]
    .filter((school, index, all) => all.findIndex((item) => item.college_name === school.college_name) === index)
    .filter((school) => !hiddenSchoolIds.includes(school.id))

  useEffect(() => {
    setLeadingId(decision?.leading_option_id ?? options[0]?.id ?? "")
    setRationale(decision?.rationale ?? "")
  }, [decision, options])

  async function saveRationale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!onSaveDecision) return
    setSaving(true)
    await onSaveDecision({ leading_option_id: leadingId || null, rationale: rationale.trim() })
    setSaving(false)
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-7 sm:px-10 sm:pt-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
          {isKo ? "비교" : "COMPARE"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {isKo ? "비교" : "Compare"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isKo
            ? "전공, 학교, 경로를 비교하고 최적의 선택을 찾으세요."
            : "Compare majors, universities, and routes to find your best path."}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <TabButton active={tab === "majors"} onClick={() => setTab("majors")} label={isKo ? "전공 비교" : "Majors"} />
        <TabButton active={tab === "schools"} onClick={() => setTab("schools")} label={isKo ? "학교 비교" : "Schools"} count={comparisonSchools.length} />
        <TabButton active={tab === "pathway"} onClick={() => setTab("pathway")} label={isKo ? "경로 비교" : "Route"} />
      </div>

      {/* Majors comparison */}
      {tab === "majors" && <MajorsTab isKo={isKo} />}

      {/* School comparison */}
      {tab === "schools" && (
          comparisonSchools.length > 0 ? (
          <SchoolsTab schools={comparisonSchools} isKo={isKo} onRemove={(id) => {
            setHiddenSchoolIds((current) => [...current, id])
            onRemove(id)
          }} selectedId={selectedId} onSelect={setSelectedId} />
        ) : (
          <EmptyState
            isKo={isKo}
            message={isKo ? "아직 비교할 학교가 없습니다." : "No schools to compare yet."}
            hint={isKo ? "학교 탐색에서 학교를 저장하면 여기에서 비교할 수 있어요." : "Save schools from the study explorer to compare them here."}
          />
        )
      )}

      {/* Pathway comparison */}
      {tab === "pathway" && (
        hasPathway ? (
          <PathwayTab
            isKo={isKo}
            goalTitle={goalTitle}
            studyTitle={studyTitle}
            options={options}
            leadingId={leadingId}
            onSetLeadingId={setLeadingId}
            rationale={rationale}
            onSetRationale={setRationale}
            saving={saving}
            onSaveRationale={saveRationale}
            evidenceCount={evidenceCount}
          />
        ) : (
          <EmptyState
            isKo={isKo}
            message={isKo ? "저장한 후보가 없습니다." : "No saved options yet."}
            hint={isKo ? "위자드에서 학교나 과정을 저장하면 비교할 수 있어요." : "Save options during wizard setup to compare them here."}
          />
        )
      )}
    </section>
  )
}

/* ── Majors Tab ── */

function MajorsTab({ isKo }: { isKo: boolean }) {
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [majorData, setMajorData] = useState<Record<string, MajorResult[]>>({})
  const [occupationData, setOccupationData] = useState<Record<string, { shortagePct: number | null; medianSalary: number | null; onCsol: boolean; csolCount: number; occupationCount: number }>>({})
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setSuggestions([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/roi/fields?q=${encodeURIComponent(q)}&country=au`)
      const data = await res.json()
      setSuggestions((data.fields ?? []).filter((f: string) => !selectedMajors.includes(f)).slice(0, 8))
    } catch { setSuggestions([]) }
    setSearching(false)
  }, [selectedMajors])

  function onQueryChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => void fetchSuggestions(value), 250)
  }

  async function addMajor(fieldName: string) {
    if (selectedMajors.includes(fieldName) || selectedMajors.length >= 4) return
    setSelectedMajors((prev) => [...prev, fieldName])
    setQuery("")
    setSuggestions([])

    if (!majorData[fieldName]) {
      try {
        const res = await fetch(`/api/roi?field=${encodeURIComponent(fieldName)}&country=au&state=ALL_STATES&limit=100`)
        const json = await res.json()
        const rows = json.data ?? []
        setMajorData((prev) => ({ ...prev, [fieldName]: rows }))
      } catch { /* ignore */ }
    }

    // Fetch occupation data for this field
    const conceptId = fieldNameToConceptId(fieldName)
    if (conceptId && !occupationData[fieldName]) {
      try {
        const res = await fetch("/api/au/concept-occupation-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concepts: [conceptId] }),
        })
        const json = await res.json()
        const item = json.concepts?.[conceptId]
        if (item) {
          setOccupationData((prev) => ({
            ...prev,
            [fieldName]: {
              shortagePct: item.nationalShortagePct,
              medianSalary: item.medianSalaryMedian,
              onCsol: item.csolCount > 0,
              csolCount: item.csolCount,
              occupationCount: item.totalOccupations,
            },
          }))
        }
      } catch { /* ignore */ }
    }
  }

  function removeMajor(fieldName: string) {
    setSelectedMajors((prev) => prev.filter((m) => m !== fieldName))
  }

  const aggregated = selectedMajors.map((field) => {
    const rows = majorData[field] ?? []
    if (rows.length === 0) return { field, count: 0, avgScore: null, avgEarnings: null, avgTuition: null, avgPayback: null }
    const validScores = rows.filter((r) => r.score != null)
    const validEarn = rows.filter((r) => r.median_earnings != null)
    const validTui = rows.filter((r) => r.tuition != null)
    const validPay = rows.filter((r) => r.payback_years != null)
    return {
      field,
      count: rows.length,
      avgScore: validScores.length ? validScores.reduce((s, r) => s + r.score!, 0) / validScores.length : null,
      avgEarnings: validEarn.length ? validEarn.reduce((s, r) => s + r.median_earnings!, 0) / validEarn.length : null,
      avgTuition: validTui.length ? validTui.reduce((s, r) => s + r.tuition!, 0) / validTui.length : null,
      avgPayback: validPay.length ? validPay.reduce((s, r) => s + r.payback_years!, 0) / validPay.length : null,
    }
  })

  return (
    <div className="mt-8 space-y-6">
      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">
          {isKo ? "전공 검색" : "Search for a major"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isKo
            ? "비교할 전공을 검색하세요. 최대 4개까지 비교 가능합니다."
            : "Search for majors to compare. You can compare up to 4."}
        </p>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={isKo ? "예: Nursing, Computer Science, Engineering..." : "e.g. Nursing, Computer Science, Engineering..."}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20"
          />
          {searching && <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400" />}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-lg">
            {suggestions.map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => void addMajor(field)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <GraduationCap className="size-4 shrink-0 text-slate-400" />
                {field}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected majors */}
      {selectedMajors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMajors.map((field) => (
            <span
              key={field}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
            >
              <GraduationCap className="size-3.5" />
              {field}
              <button
                type="button"
                onClick={() => removeMajor(field)}
                className="ml-1 text-blue-400 transition hover:text-blue-700"
                aria-label={`${field} ${isKo ? "제거" : "remove"}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Comparison table */}
      {aggregated.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {isKo ? "항목" : "Metric"}
                </th>
                {aggregated.map((item) => (
                  <th key={item.field} className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-950">{item.field}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.count > 0
                        ? isKo ? `${item.count}개 학교 데이터` : `${item.count} schools`
                        : isKo ? "데이터 로딩 중..." : "Loading..."}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <MajorRow
                icon={<DollarSign className="size-4" />}
                label={isKo ? "평균 학비" : "Avg tuition"}
                items={aggregated}
                render={(item) => money(item.avgTuition)}
              />
              <MajorRow
                icon={<TrendingUp className="size-4" />}
                label={isKo ? "평균 졸업 임금" : "Avg graduate earnings"}
                items={aggregated}
                render={(item) => money(item.avgEarnings)}
              />
              <MajorRow
                icon={<Star className="size-4" />}
                label={isKo ? "평균 Score" : "Avg Score"}
                items={aggregated}
                render={(item) => item.avgScore != null ? item.avgScore.toFixed(1) : "—"}
              />
              <MajorRow
                icon={<ArrowRight className="size-4" />}
                label={isKo ? "평균 투자 회수" : "Avg payback"}
                items={aggregated}
                render={(item) => item.avgPayback != null ? `${item.avgPayback.toFixed(1)}${isKo ? "년" : " yrs"}` : "—"}
              />

              {/* ── Occupation signal rows ── */}
              <MajorRow
                icon={<DollarSign className="size-4 text-emerald-600" />}
                label={isKo ? "직업 중위임금" : "Median occupation salary"}
                items={aggregated}
                render={(item) => {
                  const occ = occupationData[item.field]
                  return occ?.medianSalary != null ? money(occ.medianSalary) : "—"
                }}
              />
              <MajorRow
                icon={<AlertTriangle className="size-4 text-amber-600" />}
                label={isKo ? "인력 부족률" : "Shortage rate"}
                items={aggregated}
                render={(item) => {
                  const occ = occupationData[item.field]
                  if (!occ) return "—"
                  const level = shortageLevel(occ.shortagePct)
                  return (
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", shortageColor(level))}>
                      {occ.shortagePct != null ? `${occ.shortagePct}%` : "—"}
                      <span className="hidden sm:inline">· {shortageLabel(level, isKo)}</span>
                    </span>
                  )
                }}
              />
              <MajorRow
                icon={<Briefcase className="size-4 text-blue-600" />}
                label={isKo ? "CSOL 포함 직업" : "Occupations on CSOL"}
                items={aggregated}
                render={(item) => {
                  const occ = occupationData[item.field]
                  if (!occ) return "—"
                  return occ.onCsol
                    ? <span className="text-emerald-700 font-medium">{isKo ? `${occ.csolCount}개 직업 포함` : `${occ.csolCount} occupation${occ.csolCount > 1 ? "s" : ""}`}</span>
                    : <span className="text-slate-400">{isKo ? "CSOL 미포함" : "Not on CSOL"}</span>
                }}
              />
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {selectedMajors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <GraduationCap className="mx-auto size-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            {isKo
              ? "검색해서 전공을 추가하면 Score, 학비, 임금을 나란히 비교할 수 있어요."
              : "Search to add majors and compare Score, tuition, and earnings side by side."}
          </p>
        </div>
      )}
    </div>
  )
}

function MajorRow({ icon, label, items, render }: { icon: React.ReactNode; label: string; items: Array<{ field: string; count: number; avgScore: number | null; avgEarnings: number | null; avgTuition: number | null; avgPayback: number | null }>; render: (item: { field: string; count: number; avgScore: number | null; avgEarnings: number | null; avgTuition: number | null; avgPayback: number | null }) => React.ReactNode }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-500">
        <span className="text-blue-600">{icon}</span>
        {label}
      </td>
      {items.map((item) => (
        <td key={item.field} className="px-5 py-3.5 text-sm font-semibold text-slate-950">
          {render(item)}
        </td>
      ))}
    </tr>
  )
}

/* ── Schools Tab ── */

function SchoolsTab({ schools, isKo, onRemove, selectedId, onSelect }: { schools: CompareSchool[]; isKo: boolean; onRemove: (id: string) => void; selectedId: string | null; onSelect: (id: string | null) => void }) {
  return (
    <div className="mt-8 space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isKo ? "항목" : "Metric"}
              </th>
              {schools.map((school) => (
                <th key={school.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{school.college_name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {school.college_city || school.college_state || "Australia"}
                        {school.college_state ? `, ${school.college_state}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(school.id)}
                      className="ml-2 text-slate-600 transition hover:text-red-400"
                      aria-label={isKo ? "비교에서 제거" : "Remove from comparison"}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow
              icon={<DollarSign className="size-4" />}
              label={isKo ? "연간 학비" : "Annual tuition"}
              schools={schools}
              render={(s) => money(s.tuition)}
            />
            <CompareRow
              icon={<TrendingUp className="size-4" />}
              label={isKo ? "졸업 임금" : "Graduate earnings"}
              schools={schools}
              render={(s) => money(s.median_earnings)}
            />
            <CompareRow
              icon={<Briefcase className="size-4" />}
              label={isKo ? "취업률" : "Employment rate"}
              schools={schools}
              render={(s) => percent(s.employment_rate)}
            />
            <CompareRow
              icon={<Star className="size-4" />}
              label="Score"
              schools={schools}
              render={(s) => s.score != null ? s.score.toFixed(1) : "—"}
            />
            <CompareRow
              icon={<ArrowRight className="size-4" />}
              label={isKo ? "투자 회수 기간" : "Payback period"}
              schools={schools}
              render={(s) => s.payback_years != null ? `${s.payback_years.toFixed(1)}${isKo ? "년" : " yrs"}` : "—"}
            />
          </tbody>
        </table>
      </div>

      {/* First choice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">
          {isKo ? "1순위 선택" : "First choice"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {isKo ? "가장 관심 있는 학교를 선택하세요." : "Select the university you are most interested in."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {schools.map((school) => (
            <button
              key={school.id}
              type="button"
              onClick={() => onSelect(school.id === selectedId ? null : school.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                selectedId === school.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              {school.college_name}
            </button>
          ))}
        </div>
        {selectedId && (
          <p className="mt-3 text-xs text-blue-600">
            {isKo ? "1순위가 설정되었습니다." : "First choice set."}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Pathway Tab ── */

function PathwayTab({ isKo, goalTitle, studyTitle, options, leadingId, onSetLeadingId, rationale, onSetRationale, saving, onSaveRationale, evidenceCount }: {
  isKo: boolean; goalTitle?: string; studyTitle?: string; options: CompareGoalOption[]; leadingId: string; onSetLeadingId: (id: string) => void; rationale: string; onSetRationale: (v: string) => void; saving: boolean; onSaveRationale: (e: FormEvent<HTMLFormElement>) => void; evidenceCount?: number
}) {
  const [occSignal, setOccSignal] = useState<{ shortagePct: number | null; medianSalary: number | null; onCsol: boolean; csolCount: number; occupationCount: number; representativeOccupations: Array<{ label: string; labelKo: string }> } | null>(null)
  const [occLoading, setOccLoading] = useState(false)

  useEffect(() => {
    if (!studyTitle) return
    const conceptId = fieldNameToConceptId(studyTitle)
    if (!conceptId) return
    let cancelled = false
    setOccLoading(true)
    fetch("/api/au/concept-occupation-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concepts: [conceptId] }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        const item = json.concepts?.[conceptId]
        if (item) {
          setOccSignal({
            shortagePct: item.nationalShortagePct,
            medianSalary: item.medianSalaryMedian,
            onCsol: item.csolCount > 0,
            csolCount: item.csolCount,
            occupationCount: item.totalOccupations,
            representativeOccupations: item.representativeOccupations ?? [],
          })
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setOccLoading(false) })
    return () => { cancelled = true }
  }, [studyTitle])

  return (
    <div className="mt-8 space-y-6">
      {/* Current direction */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-blue-600" />
          <h2 className="text-base font-semibold text-slate-950">
            {isKo ? "현재 목표" : "Current direction"}
          </h2>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Tag icon={GraduationCap} label={studyTitle || (isKo ? "전공 방향 미정" : "Study direction to confirm")} />
          <Tag icon={Target} label={goalTitle || (isKo ? "직업 목표 미정" : "Career direction to confirm")} />
          <Tag icon={ClipboardCheck} label={isKo ? `공식 근거 ${evidenceCount ?? 0}개` : `${evidenceCount ?? 0} evidence links`} />
        </div>
      </div>

      {/* Occupation signal for selected major */}
      {studyTitle && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-950">
              {isKo ? "직업 시장 시그널" : "Labour market signal"}
            </h2>
          </div>
          {occLoading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" /> {isKo ? "불러오는 중..." : "Loading..."}
            </div>
          ) : occSignal ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <OccStat label={isKo ? "중위임금" : "Median salary"} value={occSignal.medianSalary != null ? money(occSignal.medianSalary) : "—"} />
              <OccStat label={isKo ? "인력 부족률" : "Shortage"} value={occSignal.shortagePct != null ? `${occSignal.shortagePct}%` : "—"} highlight={occSignal.shortagePct != null && occSignal.shortagePct >= 50} />
              <OccStat label="CSOL" value={occSignal.onCsol ? `${occSignal.csolCount} ${isKo ? "개 직업" : "occupations"}` : (isKo ? "미포함" : "Not listed")} highlight={occSignal.onCsol} />
              <OccStat label={isKo ? "대표 직업" : "Key occupations"} value={occSignal.representativeOccupations.length > 0 ? occSignal.representativeOccupations.slice(0, 2).map((o) => isKo ? o.labelKo : o.label).join(", ") : "—"} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">{isKo ? "전공을 선택하면 직업 시장 데이터를 보여드려요." : "Select a study focus to see labour market data."}</p>
          )}
        </div>
      )}

      {/* Route comparison table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">
          {isKo ? "경로 비교" : "Route comparison"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isKo
            ? "저장한 후보를 같은 기준에서 비교하고 1순위를 정하세요."
            : "Compare your saved options on the same terms and pick a first choice."}
        </p>
        {options.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-[.1em] text-slate-500">
                  <th className="px-3 py-3">{isKo ? "후보" : "Route"}</th>
                  <th className="px-3 py-3">{isKo ? "교육기관" : "Provider"}</th>
                  <th className="px-3 py-3">{isKo ? "학업 방향" : "Study focus"}</th>
                  <th className="px-3 py-3">{isKo ? "판단" : "Decision"}</th>
                </tr>
              </thead>
              <tbody>
                {options.map((option, index) => (
                  <tr key={option.id} className="border-b border-slate-200 last:border-0">
                    <td className="px-3 py-4 font-semibold text-slate-700">{option.title}</td>
                    <td className="px-3 py-4 text-slate-500">{option.provider_name || "—"}</td>
                    <td className="px-3 py-4 text-slate-500">{option.field_name || "—"}</td>
                    <td className="px-3 py-4">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input
                          type="radio"
                          name="leading-pathway"
                          checked={leadingId === option.id}
                          onChange={() => onSetLeadingId(option.id)}
                          className="size-4 accent-blue-600"
                        />
                        {leadingId === option.id
                          ? (isKo ? "1순위" : "First choice")
                          : `${isKo ? "후보" : "Option"} ${index + 1}`}
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-500">
              {isKo
                ? "저장한 대학 또는 과정을 목표 설정에서 후보로 가져오세요."
                : "Bring saved universities or courses into your shortlist during goal setup."}
            </p>
          </div>
        )}
      </div>

      {/* Rationale */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">
          {isKo ? "왜 이 경로가 1순위인가요?" : "Why is this the current first choice?"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isKo
            ? "비용, 취업 가능성, 입학 조건 등 지금의 판단 근거를 남기세요."
            : "Write the reasons that matter now: cost, employment outlook, or entry requirements."}
        </p>
        <form onSubmit={onSaveRationale} className="mt-4">
          <textarea
            value={rationale}
            onChange={(event) => onSetRationale(event.target.value.slice(0, 1200))}
            rows={4}
            placeholder={isKo
              ? "예: Option B는 총 비용이 더 낮고, 목표 직업과의 연결이 가장 명확하다."
              : "Example: Option B has a lower total cost and the clearest connection to my target career."}
            className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">{rationale.length}/1200</p>
            <button
              disabled={saving || !leadingId}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              <Check className="size-4" />
              {isKo ? "1순위 판단 저장" : "Save first-choice rationale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Shared sub-components ── */

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
        active ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
      )}
    >
      {label}
      {count != null && count > 0 && (
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
          {count}
        </span>
      )}
    </button>
  )
}

function EmptyState({ isKo, message, hint }: { isKo: boolean; message: string; hint: string }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-10 text-center">
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  )
}

function CompareRow({ icon, label, schools, render }: { icon: React.ReactNode; label: string; schools: CompareSchool[]; render: (school: CompareSchool) => string }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-500">
        <span className="text-blue-600">{icon}</span>
        {label}
      </td>
      {schools.map((school) => (
        <td key={school.id} className="px-5 py-3.5 text-sm font-semibold text-slate-950">
          {render(school)}
        </td>
      ))}
    </tr>
  )
}

function OccStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-3", highlight ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50")}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold", highlight ? "text-emerald-700" : "text-slate-950")}>{value}</p>
    </div>
  )
}

function Tag({ icon: Icon, label }: { icon: typeof Target; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
      <Icon className="size-4 text-blue-600" />
      {label}
    </span>
  )
}
