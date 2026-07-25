"use client"

import { useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowRight, DollarSign, MapPin, TrendingUp, Shield, GraduationCap, Briefcase } from "lucide-react"
import { getStudyConcept, STUDY_CATEGORIES } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { rankAustralianPathways } from "@/lib/au-pathfinder"
import { localizePath } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import type { AuPathfinderProfile } from "@/lib/au-pathfinder"
import type { SchoolData } from "../wizard-state"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function StepPlan({
  profile,
  isKo,
  locale,
  wantsSchool,
  selectedConcept,
  selectedSchool,
  selectedSchoolData,
}: {
  profile: AuPathfinderProfile
  isKo: boolean
  locale: "en" | "ko"
  wantsSchool: boolean
  selectedConcept: string | null
  selectedSchool: string | null
  selectedSchoolData?: SchoolData | null
}) {
  const router = useRouter()
  const ranked = useMemo(() => rankAustralianPathways(profile), [profile])
  const matched = selectedConcept
    ? ranked.find((r) => r.concept.id === selectedConcept)
    : ranked[0]
  const top = matched ?? ranked[0]
  const topLabel = top
    ? isKo ? top.concept.labelKo : top.concept.label
    : isKo ? "선택한 전공" : "Selected major"
  const { Icon, tone } = top ? getStudyCategoryVisual(top.concept.category) : { Icon: null, tone: "" }

  const saveAndNavigateToMyPlan = useCallback(() => {
    const concept = selectedConcept ? getStudyConcept(selectedConcept) : null
    const wizardData: Record<string, unknown> = {
      conceptSlug: concept?.slug ?? null,
      conceptLabel: concept?.label ?? null,
      conceptLabelKo: concept?.labelKo ?? null,
      category: concept?.category ?? null,
      school: selectedSchool ?? null,
      goal: profile.goal,
      studyStage: profile.studyStage,
    }
    if (selectedSchoolData) {
      wizardData.schoolData = selectedSchoolData
    }
    try { localStorage.setItem("cc_wizard_data", JSON.stringify(wizardData)) } catch {}
    router.push(localizePath("/home", locale))
  }, [selectedConcept, selectedSchool, selectedSchoolData, profile, locale, router])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          {Icon && (
            <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", tone)}>
              <Icon className="size-6" strokeWidth={2} />
            </span>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
              {isKo ? "나의 플랜" : "My plan"}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {topLabel}
            </h1>
          </div>
        </div>

        {/* Selected school badge */}
        {wantsSchool && selectedSchool && (
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {isKo ? "선택한 학교" : "Selected school"}
            </span>
            <span className="text-sm font-medium text-slate-700">{selectedSchool}</span>
          </div>
        )}

        {/* Career outlook cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <PlanCard
            icon={<DollarSign className="size-5" />}
            label={isKo ? "예상 연봉" : "Expected salary"}
            value={top?.salaryMedianAud != null ? `A$${Math.round(top.salaryMedianAud / 1000)}K` : "—"}
            sublabel={isKo ? "호주 중위 임금 기준" : "Australia median pay"}
            tone="bg-emerald-50 text-emerald-700"
          />
          <PlanCard
            icon={<TrendingUp className="size-5" />}
            label={isKo ? "2035 전망" : "2035 outlook"}
            value={top?.outlook2035Pct != null ? `${top.outlook2035Pct > 0 ? "+" : ""}${top.outlook2035Pct.toFixed(0)}%` : "—"}
            sublabel={isKo ? "고용 성장률" : "Employment growth"}
            tone="bg-blue-50 text-blue-700"
          />
          <PlanCard
            icon={<Shield className="size-5" />}
            label={isKo ? "인력 부족" : "Shortage"}
            value={top?.shortagePct != null && top.shortagePct > 0 ? `${top.shortagePct.toFixed(0)}%` : "—"}
            sublabel={isKo ? "부족 직업군 비율" : "Shortage occupation share"}
            tone="bg-amber-50 text-amber-700"
          />
          <PlanCard
            icon={<MapPin className="size-5" />}
            label={isKo ? "위치" : "Location"}
            value="Australia"
            sublabel={isKo ? "호주 전역" : "Nationwide"}
            tone="bg-violet-50 text-violet-700"
          />
          <PlanCard
            icon={<GraduationCap className="size-5" />}
            label={isKo ? "학비" : "Tuition"}
            value={top?.annualTuitionAud != null ? `A$${Math.round(top.annualTuitionAud / 1000)}K/yr` : "—"}
            sublabel={isKo ? "연간 기준" : "Per year"}
            tone="bg-rose-50 text-rose-700"
          />
          <PlanCard
            icon={<Briefcase className="size-5" />}
            label={isKo ? "학업 기간" : "Duration"}
            value={top?.durationYears != null ? `${top.durationYears}${isKo ? "년" : " years"}` : "—"}
            sublabel={isKo ? "일반 소요 시간" : "Typical time"}
            tone="bg-cyan-50 text-cyan-700"
          />
        </div>

        {/* Next steps CTA */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">
            {isKo ? "다음 단계" : "Next steps"}
          </h2>
          <button
            type="button"
            onClick={saveAndNavigateToMyPlan}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            <ArrowRight className="size-4" />
            {isKo ? "플랜 열기" : "Open Planner"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function PlanCard({
  icon,
  label,
  value,
  sublabel,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sublabel: string
  tone: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <span className={cn("mb-3 inline-flex size-9 items-center justify-center rounded-lg", tone)}>
        {icon}
      </span>
      <p className="mt-2 text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{sublabel}</p>
    </div>
  )
}
