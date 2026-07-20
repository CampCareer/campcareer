"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, Calculator, DollarSign, Clock, ShieldCheck, BriefcaseBusiness, TrendingUp, Info } from "lucide-react"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { signalForConcept, type AuPathfinderVisa } from "@/lib/au-pathfinder"
import costsSnapshot from "@/data/au-major-costs.json"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { IconPicker, type PickerOption } from "@/components/ui/icon-picker"

type CostProfile = {
  universities?: Array<{ name: string; qsRank?: number; bachelorFeeAud?: number; feeAud?: number; duration?: number }>
  diplomaOptions?: Array<{ name: string; feeAud?: number; duration?: number }>
  notes?: string
}

const COSTS = costsSnapshot as Record<string, CostProfile>

const LIVING_COSTS = {
  rent: 1400,
  food: 500,
  transport: 200,
  healthInsurance: 650,
  phone: 60,
  misc: 300,
} as const

const LIVING_TOTAL_MONTHLY = Object.values(LIVING_COSTS).reduce((a, b) => a + b, 0)

const VISA_INFO: Record<AuPathfinderVisa, { koLabel: string; enLabel: string; koDesc: string; enDesc: string; icon: string; maxStudyMonths: number | null; workHoursPerFortnight: number | null; ovhcAnnual: number }> = {
  whv: { koLabel: "워킹홀리데이", enLabel: "Working Holiday", koDesc: "최대 12개월, 학업 4개월 제한", enDesc: "Up to 12 months, study max 4 months", icon: "🎒", maxStudyMonths: 4, workHoursPerFortnight: null, ovhcAnnual: 7800 },
  student: { koLabel: "학생 비자", enLabel: "Student Visa", koDesc: "정규 학업, 48시간/2주 취업 가능", enDesc: "Full-time study, 48h/fortnight work", icon: "📚", maxStudyMonths: null, workHoursPerFortnight: 48, ovhcAnnual: 6500 },
  skilled: { koLabel: "스킬 이민", enLabel: "Skilled Migration", koDesc: "포인트 기반, 영주권 경로", enDesc: "Points-based, PR pathway", icon: "💼", maxStudyMonths: null, workHoursPerFortnight: null, ovhcAnnual: 0 },
}

export default function AuBudgetPage() {
  const [selectedConceptId, setSelectedConceptId] = useState<string>("computer-science")
  const [visa, setVisa] = useState<AuPathfinderVisa>("student")
  const [durationOverride, setDurationOverride] = useState<number | "">("")
  const [savings, setSavings] = useState<number | "">("")
  const [monthlySaving, setMonthlySaving] = useState<number | "">("")

  const concept = STUDY_CONCEPTS.find((c) => c.id === selectedConceptId)
  const signal = signalForConcept(selectedConceptId)
  const costs = COSTS[selectedConceptId]
  const visaInfo = VISA_INFO[visa]

  const categoryObj = concept ? STUDY_CATEGORIES.find((c) => c.id === concept.category) : null
  const categoryVisual = concept ? getStudyCategoryVisual(concept.category) : null

  const feeOptions = useMemo<PickerOption[]>(() => {
    if (!costs) return [{ value: "none", label: "데이터 없음", description: "No data", icon: "—" }]
    const options: PickerOption[] = []
    for (const u of costs.universities ?? []) {
      if (u.bachelorFeeAud) options.push({ value: u.name, label: u.name, description: `A$${u.bachelorFeeAud.toLocaleString()}/yr`, icon: "🏫", keywords: u.name.toLowerCase() })
    }
    for (const d of costs.diplomaOptions ?? []) {
      if (d.feeAud) options.push({ value: d.name, label: d.name, description: `A$${d.feeAud.toLocaleString()}/yr`, icon: "📜", keywords: d.name.toLowerCase() })
    }
    return options.length ? options : [{ value: "none", label: "데이터 없음", description: "No provider data", icon: "—" }]
  }, [costs])

  const [selectedProvider, setSelectedProvider] = useState<string>("")

  const annualTuition = useMemo((): number => {
    if (!costs) return 0
    const allProviders = [...(costs.universities ?? []), ...(costs.diplomaOptions ?? [])]
    const match = allProviders.find((p) => p.name === selectedProvider)
    if (match) {
      const fee = (match as { bachelorFeeAud?: number }).bachelorFeeAud ?? (match as { feeAud?: number }).feeAud
      return fee ?? 0
    }
    return (signal?.cost_bachelor_median_aud ?? signal?.cost_diploma_median_aud) ?? 0
  }, [costs, selectedProvider, signal])

  const durationYears = useMemo(() => {
    if (durationOverride !== "" && durationOverride > 0) return durationOverride
    if (visaInfo.maxStudyMonths) return Math.min(visaInfo.maxStudyMonths / 12, signal?.cost_duration_years ?? 0.33)
    return signal?.cost_duration_years ?? 3
  }, [durationOverride, visaInfo, signal])

  const totalTuition = Math.round(annualTuition * durationYears)
  const totalLiving = Math.round(LIVING_TOTAL_MONTHLY * 12 * durationYears)
  const totalOvhc = visa === "skilled" ? 0 : visaInfo.ovhcAnnual * durationYears
  const visaFee = visa === "whv" ? 635 : visa === "student" ? 710 : 4640
  const totalCost = totalTuition + totalLiving + Math.round(totalOvhc) + visaFee

  const salaryMedian = signal?.salary_median_aud ?? 0
  const monthlyAfterTax = salaryMedian > 0 ? Math.round(salaryMedian * 0.72 / 12) : 0
  const monthsToRecoup = monthlyAfterTax > 0 ? Math.ceil(totalCost / monthlyAfterTax) : null

  const currentSavings = typeof savings === "number" ? savings : 0
  const currentMonthlySaving = typeof monthlySaving === "number" ? monthlySaving : 0
  const gapAmount = Math.max(0, totalCost - currentSavings)
  const monthsToSave = currentMonthlySaving > 0 ? Math.ceil(gapAmount / currentMonthlySaving) : null

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-blue-600 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <Link href="/au/majors" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 hover:text-white transition">
            <ArrowLeft className="size-4" /> {visa === "whv" ? "Pathfinder" : "Pathfinder"}
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Australia Budget Planner</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            호주 유학 비용 계산기
          </h1>
          <p className="mt-2 text-sm text-blue-200">
            전공, 비자, 기간에 따른 총 비용과 소요 시간을 계산합니다
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

          {/* Left: Inputs */}
          <div className="space-y-5">

            {/* Step 1: Visa */}
            <InputCard title="비자 유형" icon={ShieldCheck}>
              <div className="grid grid-cols-3 gap-2">
                {(["whv", "student", "skilled"] as AuPathfinderVisa[]).map((v) => (
                  <button key={v} type="button" onClick={() => setVisa(v)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition ${
                      visa === v ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"
                    }`}>
                    <span className="text-2xl">{VISA_INFO[v].icon}</span>
                    <span className="text-xs font-semibold text-slate-900">{VISA_INFO[v].koLabel}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">{visaInfo.koDesc}</p>
            </InputCard>

            {/* Step2: Major */}
            <InputCard title="전공 선택" icon={BriefcaseBusiness}>
              <IconPicker
                name="concept"
                label=""
                value={selectedConceptId}
                options={STUDY_CATEGORIES.flatMap((cat) => {
                  const visual = getStudyCategoryVisual(cat.id)
                  const concepts = STUDY_CONCEPTS.filter((c) => c.category === cat.id)
                  return concepts.map((c) => ({
                    value: c.id,
                    label: c.labelKo,
                    description: `${cat.labelKo} · ${c.label}`,
                    icon: "",
                    iconComponent: visual.Icon,
                    iconTone: visual.tone,
                    keywords: `${c.id} ${c.label} ${c.labelKo} ${cat.labelKo}`,
                  }))
                })}
                onChange={(v) => { setSelectedConceptId(v); setSelectedProvider("") }}
                searchPlaceholder="전공 검색..."
                testId="concept"
              />
            </InputCard>

            {/* Step 3: Provider */}
            {costs && feeOptions.length > 1 && (
              <InputCard title="학교 선택 (선택사항)" icon={DollarSign}>
                <IconPicker
                  name="provider"
                  label=""
                  value={selectedProvider || "auto"}
                  options={[{ value: "auto", label: "중앙값 사용", description: "Median cost estimate", icon: "📊" }, ...feeOptions]}
                  onChange={(v) => setSelectedProvider(v === "auto" ? "" : v)}
                  testId="provider"
                />
              </InputCard>
            )}

            {/* Step4: Duration override */}
            <InputCard title="학업 기간 (선택사항)" icon={Clock}>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0.1}
                  max={6}
                  step={0.5}
                  value={durationOverride}
                  onChange={(e) => setDurationOverride(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder={visaInfo.maxStudyMonths ? `최대 ${(visaInfo.maxStudyMonths / 12).toFixed(1)}년` : "3"}
                  className="w-28 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                />
                <span className="text-sm text-slate-500">년</span>
                {visaInfo.maxStudyMonths && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                    {visaInfo.maxStudyMonths}개월 제한
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {visaInfo.maxStudyMonths
                  ? `${visa === "whv" ? "WHV" : ""} 최대 ${visaInfo.maxStudyMonths}개월`
                  : `일반 학위 기간: ${signal?.cost_duration_years ?? 3}년`}
              </p>
            </InputCard>

            {/* Step 5: Savings */}
            <InputCard title="현재 저축/월 저축액" icon={Calculator}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">현재 저축 (A$)</label>
                  <input
                    type="number"
                    min={0}
                    value={savings}
                    onChange={(e) => setSavings(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">월 저축액 (A$)</label>
                  <input
                    type="number"
                    min={0}
                    value={monthlySaving}
                    onChange={(e) => setMonthlySaving(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </InputCard>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {/* Summary card */}
            <div className="sticky top-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                {categoryVisual && (
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${categoryVisual.tone}`}>
                    <categoryVisual.Icon className="size-5" strokeWidth={2.2} />
                  </span>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{visaInfo.koLabel}</p>
                  <h2 className="text-lg font-semibold text-slate-950">{concept?.labelKo ?? "전공 선택"}</h2>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="mt-5 space-y-3">
                <CostRow label="학비" sub={`${annualTuition > 0 ? `A$${annualTuition.toLocaleString()}/yr × ${durationYears}년` : "—"} `} value={totalTuition > 0 ? `A$${totalTuition.toLocaleString()}` : "—"} />
                <CostRow label="생활비 (월 A$2,510 기준)" sub={`${durationYears}년`} value={totalLiving > 0 ? `A$${totalLiving.toLocaleString()}` : "—"} />
                {visa !== "skilled" && <CostRow label="건강보험 (OVHC)" sub={`A$${visaInfo.ovhcAnnual.toLocaleString()}/yr`} value={`A$${Math.round(totalOvhc).toLocaleString()}`} />}
                <CostRow label="비자 신청비" sub="" value={`A$${visaFee.toLocaleString()}`} />
                <div className="border-t border-slate-200 pt-3">
                  <CostRow label="총 예상 비용" sub="" value={`A$${totalCost.toLocaleString()}`} highlight />
                </div>
              </div>

              {/* Salary projection */}
              {salaryMedian > 0 && (
                <div className="mt-5 rounded-xl bg-emerald-50 p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800">졸업 후 예상 임금</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-emerald-900">A${(salaryMedian / 1000).toFixed(0)}K</p>
                  <p className="mt-1 text-xs text-emerald-700">중간 임금 기준 · 세후 약 A${monthlyAfterTax.toLocaleString()}/월</p>
                </div>
              )}

              {/* Break-even */}
              {monthsToRecoup !== null && monthsToRecoup > 0 && monthsToRecoup < 200 && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800">투자 회수 기간</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-blue-900">{monthsToRecoup}개월</p>
                  <p className="mt-1 text-xs text-blue-700">총 비용 ÷ 세후 월 임금 = 약 {Math.floor(monthsToRecoup / 12)}년 {monthsToRecoup % 12}개월</p>
                </div>
              )}

              {/* Savings plan */}
              {monthsToSave !== null && monthsToSave > 0 && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4">
                  <div className="flex items-center gap-2">
                    <Info className="size-4 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-800">저축 계획</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-amber-900">{monthsToSave}개월</p>
                  <p className="mt-1 text-xs text-amber-700">
                    {gapAmount > 0
                      ? `A$${gapAmount.toLocaleString()} 부족 · 월 A$${currentMonthlySaving.toLocaleString()} 저축 시`
                      : "목표 금액 달성!"}
                  </p>
                </div>
              )}

              {/* WHV tip */}
              {visa === "whv" && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-700">💡 WHV 활용 팁</p>
                  <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                    <li>• 학업 4개월 제한 → Certificate/Diploma 과정 추천</li>
                    <li>• 지역 근무 시 추가 비자延期 가능</li>
                    <li>• 학비 절약을 위해 TAFE/VET 과정 고려</li>
                    <li>• 학생 비자 전환 시 더 긴 학업 가능</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 flex justify-center">
          <Link href="/au/majors" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Pathfinder로 돌아가기 <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}

function InputCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-blue-700" />
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function CostRow({ label, sub, value, highlight }: { label: string; sub: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className={`text-sm ${highlight ? "font-bold text-slate-950" : "font-medium text-slate-700"}`}>{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
      <p className={`shrink-0 text-sm ${highlight ? "text-lg font-bold text-blue-700" : "font-semibold text-slate-900"}`}>{value}</p>
    </div>
  )
}
