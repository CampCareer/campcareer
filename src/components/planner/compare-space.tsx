"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Check, ClipboardCheck, DollarSign, GraduationCap, Target, TrendingUp, Briefcase, Star, Trash2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CompareSchool = {
  id: string
  college_name: string
  college_state: string
  college_city?: string | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  roi_score?: number | null
  payback_years?: number | null
}

export type CompareGoalOption = {
  id: string
  position: number
  source_type: "saved_university" | "saved_course"
  title: string
  provider_name: string
  field_name: string
}

export type ComparePathwayDecision = {
  leading_option_id: string | null
  rationale: string
}

type CompareTab = "schools" | "pathway"

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
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tab, setTab] = useState<CompareTab>("schools")
  const [leadingId, setLeadingId] = useState(decision?.leading_option_id ?? "")
  const [rationale, setRationale] = useState(decision?.rationale ?? "")
  const [saving, setSaving] = useState(false)

  const options = goalOptions ?? []
  const hasPathway = options.length > 0 || (goalTitle || studyTitle)

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

  if (schools.length === 0 && !hasPathway) {
    return (
      <section className="mx-auto max-w-4xl px-6 pt-7 sm:px-10 sm:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
          {isKo ? "비교" : "COMPARE"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {isKo ? "비교" : "Compare"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isKo
            ? "학교를 비교하고, 경로의 1순위를 정하세요."
            : "Compare universities and choose your first-choice route."}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            {isKo
              ? "먼저 wizard에서 학교를 선택하세요."
              : "Select a school in the wizard to start comparing."}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-7 sm:px-10 sm:pt-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
            {isKo ? "비교" : "COMPARE"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {isKo ? "비교" : "Compare"}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      {hasPathway && schools.length > 0 && (
        <div className="mt-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setTab("schools")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
              tab === "schools" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {isKo ? "학교 비교" : "School comparison"}
          </button>
          <button
            type="button"
            onClick={() => setTab("pathway")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
              tab === "pathway" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {isKo ? "경로 비교" : "Route comparison"}
          </button>
        </div>
      )}

      {/* School comparison tab */}
      {(tab === "schools" || !hasPathway) && schools.length > 0 && (
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
                  label="ROI"
                  schools={schools}
                  render={(s) => s.roi_score != null ? s.roi_score.toFixed(1) : "—"}
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
              {isKo
                ? "가장 관심 있는 학교를 선택하세요."
                : "Select the university you are most interested in."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {schools.map((school) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => setSelectedId(school.id === selectedId ? null : school.id)}
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
      )}

      {/* Pathway comparison tab */}
      {tab === "pathway" && hasPathway && (
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
                              onChange={() => setLeadingId(option.id)}
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
            <form onSubmit={saveRationale} className="mt-4">
              <textarea
                value={rationale}
                onChange={(event) => setRationale(event.target.value.slice(0, 1200))}
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
      )}
    </section>
  )
}

function CompareRow({
  icon,
  label,
  schools,
  render,
}: {
  icon: React.ReactNode
  label: string
  schools: CompareSchool[]
  render: (school: CompareSchool) => string
}) {
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

function Tag({ icon: Icon, label }: { icon: typeof Target; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
      <Icon className="size-4 text-blue-600" />
      {label}
    </span>
  )
}
