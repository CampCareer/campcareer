"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type Step = {
  key: string
  labelKo: string
  labelEn: string
}

const CORE_STEPS: Step[] = [
  { key: "category", labelKo: "전공", labelEn: "Major" },
  { key: "goals", labelKo: "조건", labelEn: "Conditions" },
  { key: "branch", labelKo: "경로", labelEn: "Path" },
]

export function WizardStepIndicator({
  currentStep,
  isKo,
}: {
  currentStep: string
  isKo: boolean
}) {
  // "schools" is an extension of "branch" — all 3 core steps are complete
  const currentIdx = currentStep === "schools"
    ? CORE_STEPS.length
    : CORE_STEPS.findIndex((s) => s.key === currentStep)

  return (
    <nav aria-label={isKo ? "진행 단계" : "Progress steps"} className="flex items-center gap-2">
      {CORE_STEPS.map((step, i) => {
        const isCompleted = currentIdx > i
        const isCurrent = currentIdx === i

        return (
          <div key={step.key} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-6 transition-colors sm:w-10",
                  isCompleted ? "bg-white/80" : "bg-white/30"
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isCompleted && "bg-white text-blue-600",
                  isCurrent && "bg-white text-blue-600 ring-4 ring-white/30",
                  !isCompleted && !isCurrent && "bg-white/20 text-white/70"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isCurrent ? "text-white" : "text-white/60"
                )}
              >
                {isKo ? step.labelKo : step.labelEn}
              </span>
            </div>
          </div>
        )
      })}
    </nav>
  )
}
