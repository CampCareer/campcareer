"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, Briefcase, Star, Trash2, Plus, ArrowRight, LockKeyhole } from "lucide-react"
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
}: {
  schools: CompareSchool[]
  isKo: boolean
  onRemove: (id: string) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (schools.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-6 pt-7 sm:px-10 sm:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
          {isKo ? "비교" : "COMPARE"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {isKo ? "대학 비교" : "Compare universities"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isKo
            ? "플래너에 저장한 학교를 여기에서 비교할 수 있습니다."
            : "Schools saved in your plan can be compared here side by side."}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            {isKo
              ? "먼저 wizard에서 학교를 선택하거나, 경로 페이지에서 학교를 추가하세요."
              : "Select a school in the wizard, or add one from the pathway page."}
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
            {isKo ? "대학 비교" : "Compare universities"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isKo
              ? `${schools.length}개 학교 비교 중`
              : `Comparing ${schools.length} ${schools.length === 1 ? "university" : "universities"}`}
          </p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
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
              isKo={isKo}
            />
            <CompareRow
              icon={<TrendingUp className="size-4" />}
              label={isKo ? "졸업 임금" : "Graduate earnings"}
              schools={schools}
              render={(s) => money(s.median_earnings)}
              isKo={isKo}
            />
            <CompareRow
              icon={<Briefcase className="size-4" />}
              label={isKo ? "취업률" : "Employment rate"}
              schools={schools}
              render={(s) => percent(s.employment_rate)}
              isKo={isKo}
            />
            <CompareRow
              icon={<Star className="size-4" />}
              label="ROI"
              schools={schools}
              render={(s) => s.roi_score != null ? s.roi_score.toFixed(1) : "—"}
              isKo={isKo}
            />
            <CompareRow
              icon={<ArrowRight className="size-4" />}
              label={isKo ? "투자 회수 기간" : "Payback period"}
              schools={schools}
              render={(s) => s.payback_years != null ? `${s.payback_years.toFixed(1)}${isKo ? "년" : " yrs"}` : "—"}
              isKo={isKo}
            />
          </tbody>
        </table>
      </div>

      {/* 1순위 선택 */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
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
    </section>
  )
}

function CompareRow({
  icon,
  label,
  schools,
  render,
  isKo,
}: {
  icon: React.ReactNode
  label: string
  schools: CompareSchool[]
  render: (school: CompareSchool) => string
  isKo: boolean
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
