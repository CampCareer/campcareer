"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, GraduationCap, Map, Sparkles } from "lucide-react"
import { STUDY_CATEGORIES, getStudyConcept } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { rankAustralianPathways } from "@/lib/au-pathfinder"
import { cn } from "@/lib/utils"
import type { AuPathfinderProfile } from "@/lib/au-pathfinder"

export function StepBranch({
  profile,
  isKo,
  selectedConcept,
  onSchoolPath,
  onDirectPlan,
  onBack,
}: {
  profile: AuPathfinderProfile
  isKo: boolean
  selectedConcept: string | null
  onSchoolPath: () => void
  onDirectPlan: () => void
  onBack: () => void
}) {
  const ranked = useMemo(() => rankAustralianPathways(profile), [profile])

  const matched = selectedConcept
    ? ranked.find((r) => r.concept.id === selectedConcept)
    : ranked[0]
  const top = matched ?? ranked[0]
  const topLabel = top
    ? isKo
      ? top.concept.labelKo
      : top.concept.label
    : isKo
    ? "선택한 전공"
    : "selected major"
  const { Icon, tone } = top ? getStudyCategoryVisual(top.concept.category) : { Icon: null, tone: "" }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
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

        {/* Top match summary */}
        <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
          {Icon && (
            <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", tone)}>
              <Icon className="size-6" strokeWidth={2} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
              {isKo ? "가장 잘 맞는 전공" : "Your best match"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{topLabel}</h2>
            {top && (
              <div className="mt-2 flex flex-wrap gap-2">
                {top.salaryMedianAud != null && (
                  <span className="rounded-md bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {isKo ? "연봉" : "Pay"} A${Math.round(top.salaryMedianAud / 1000)}K
                  </span>
                )}
                {top.shortagePct != null && top.shortagePct > 0 && (
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {isKo ? "인력 부족" : "Shortage"}
                  </span>
                )}
                {top.prScore != null && (
                  <span className="rounded-md bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-700">
                    PR {top.prScore}/100
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question */}
        <h1 className="mt-10 text-center text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {isKo
            ? "이 전공으로 어떤 경로를 원하시나요?"
            : "What path do you want for this major?"}
        </h1>

        {/* Path options */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* School path */}
          <button
            type="button"
            onClick={onSchoolPath}
            className={cn(
              "group flex flex-col items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-8 text-center transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_14px_32px_rgba(37,99,235,.12)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            )}
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-200 group-hover:scale-110">
              <GraduationCap className="size-7" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {isKo ? "학교 추천 받기" : "Get school recommendations"}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
              {isKo ? "학교 보기" : "View schools"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          {/* Direct plan */}
          <button
            type="button"
            onClick={onDirectPlan}
            className={cn(
              "group flex flex-col items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-8 text-center transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-[0_14px_32px_rgba(139,92,246,.12)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            )}
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-violet-50 text-violet-600 transition-transform duration-200 group-hover:scale-110">
              <Sparkles className="size-7" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {isKo ? "플랜 바로 만들기" : "Jump to plan"}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600">
              {isKo ? "플랜 만들기" : "Create plan"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
