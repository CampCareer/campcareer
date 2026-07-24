"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { rankAustralianPathways, type RankedAuPathway } from "@/lib/au-pathfinder"
import { cn } from "@/lib/utils"
import type { AuPathfinderGoal, AuPathfinderProfile, AuPathfinderStudyStage } from "@/lib/au-pathfinder"
import { STUDY_CONCEPTS } from "@/data/study-concepts"

const GOALS: { value: AuPathfinderGoal; labelKo: string; labelEn: string; icon: string }[] = [
  { value: "income", labelKo: "높은 소득", labelEn: "Higher income", icon: "💰" },
  { value: "security", labelKo: "취업 안정성", labelEn: "Job security", icon: "🛡️" },
  { value: "residency", labelKo: "장기 경로", labelEn: "Long-term pathway", icon: "🧭" },
  { value: "lower-cost", labelKo: "낮은 학비", labelEn: "Lower tuition", icon: "🌱" },
]

const STAGES: { value: AuPathfinderStudyStage; labelKo: string; labelEn: string; icon: string }[] = [
  { value: "certificate", labelKo: "자격증·디플로마", labelEn: "Certificate & diploma", icon: "📜" },
  { value: "degree", labelKo: "학사·석사", labelEn: "Bachelor & master", icon: "🎓" },
  { value: "related-degree", labelKo: "관련 학위 보유", labelEn: "I have a related degree", icon: "🧩" },
]

export function StepGoals({
  profile,
  isKo,
  locale,
  goal,
  studyStage,
  selectedConcept,
  onSelectGoal,
  onSelectStage,
  onSelectMajor,
  onConfirm,
  onBack,
}: {
  profile: AuPathfinderProfile
  isKo: boolean
  locale: "en" | "ko"
  goal: AuPathfinderGoal
  studyStage: AuPathfinderStudyStage
  selectedConcept: string | null
  onSelectGoal: (goal: AuPathfinderGoal) => void
  onSelectStage: (stage: AuPathfinderStudyStage) => void
  onSelectMajor: (conceptId: string) => void
  onConfirm: () => void
  onBack: () => void
}) {
  const ranked = useMemo(() => rankAustralianPathways(profile), [profile])
  const topFive = ranked.slice(0, 5)

  const conceptInfo = selectedConcept ? STUDY_CONCEPTS.find((c) => c.id === selectedConcept) : null
  const conceptVisual = conceptInfo ? getStudyCategoryVisual(conceptInfo.category) : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          {isKo ? "이전" : "Back"}
        </button>

        {/* Selected concept highlight */}
        {conceptInfo && conceptVisual && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3"
          >
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", conceptVisual.tone)}>
              <conceptVisual.Icon className="size-5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
                {isKo ? "선택한 전공" : "Selected major"}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {isKo ? conceptInfo.labelKo : conceptInfo.label}
              </p>
            </div>
          </motion.div>
        )}

        {/* Goal selection */}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {isKo ? "어떤 목표가 우선인가요?" : "What matters most to you?"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          {isKo
            ? "목표에 따라 추천 순위가 달라집니다."
            : "Your goal changes the ranking order."}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => onSelectGoal(g.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                goal === g.value
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <span className="text-2xl">{g.icon}</span>
              <span className="text-xs font-semibold sm:text-sm">
                {isKo ? g.labelKo : g.labelEn}
              </span>
              {goal === g.value && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex size-5 items-center justify-center rounded-full bg-blue-600"
                >
                  <Check className="size-3 text-white" strokeWidth={3} />
                </motion.span>
              )}
            </button>
          ))}
        </div>

        {/* Stage selection */}
        <h2 className="mt-8 text-lg font-semibold text-slate-950">
          {isKo ? "현재 학력 단계" : "Your current education level"}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onSelectStage(s.value)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                studyStage === s.value
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-sm font-semibold">
                {isKo ? s.labelKo : s.labelEn}
              </span>
              {studyStage === s.value && (
                <Check className="ml-auto size-4 shrink-0 text-blue-600" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Ranked results preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-10"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">
              {isKo ? "맞춤 추천 순위" : "Ranked for you"}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-950">
              {isKo ? "이 조건에 맞는 전공" : "Matches for your conditions"}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {topFive.map((pathway, i) => (
            <RankedRow
              key={pathway.concept.id}
              pathway={pathway}
              rank={i + 1}
              isKo={isKo}
              isTop={i === 0}
              onSelect={() => onSelectMajor(pathway.concept.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-10 flex justify-center"
      >
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition-all",
            "hover:bg-blue-700 hover:shadow-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          )}
        >
          {isKo ? "다음 단계로" : "Continue"}
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </button>
      </motion.div>
    </div>
  )
}

function RankedRow({
  pathway,
  rank,
  isKo,
  isTop,
  onSelect,
}: {
  pathway: RankedAuPathway
  rank: number
  isKo: boolean
  isTop: boolean
  onSelect: () => void
}) {
  const { Icon, tone } = getStudyCategoryVisual(pathway.concept.category)
  const label = isKo ? pathway.concept.labelKo : pathway.concept.label

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-xl border bg-white px-4 py-3 text-left transition-all duration-200 sm:px-5",
        "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
        isTop
          ? "border-blue-300 shadow-sm ring-1 ring-blue-100"
          : "border-slate-200"
      )}
    >
      {/* Rank number */}
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
          isTop ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
        )}
      >
        {rank}
      </span>

      {/* Icon */}
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tone)}>
        <Icon className="size-5" strokeWidth={2.2} />
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {pathway.salaryMedianAud != null && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              A${Math.round(pathway.salaryMedianAud / 1000)}K
            </span>
          )}
          {pathway.shortagePct != null && pathway.shortagePct > 0 && (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              Shortage
            </span>
          )}
          {pathway.durationYears != null && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {pathway.durationYears}{isKo ? "년" : "y"}
            </span>
          )}
        </div>
      </div>

      {/* Score badge */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-right text-white">
          <p className="text-sm font-semibold leading-none">{pathway.score}</p>
          <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
            {isKo ? "적합도" : "fit"}
          </p>
        </div>
      </div>

      {/* Arrow indicator */}
      <ArrowRight className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </button>
  )
}
