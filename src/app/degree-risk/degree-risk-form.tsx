"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { QUESTIONS, type Answers, type AnswerKey } from "@/lib/degree-risk"
import { ChoiceCard } from "@/components/ui/choice-card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { submitAssessment } from "./actions"

// Flags for the "where are you studying?" question (icon slot).
const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸",
  "Canada": "🇨🇦",
  "UK": "🇬🇧",
  "Australia": "🇦🇺",
  "Ireland": "🇮🇪",
  "Not sure": "🌍",
}

export function DegreeRiskForm() {
  const router = useRouter()
  const t = useTranslations()
  const dr = t.degreeRisk
  const optionLabel = (value: string) =>
    (dr.options as Record<string, string>)[value] ?? value
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [submitting, setSubmitting] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const question = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1
  const selected = answers[question.key]
  const isCountry = question.key === "country_pref"

  async function submit(complete: Answers) {
    setSubmitting(true)
    setError(null)
    try {
      const res = await submitAssessment(complete)
      if (!res.ok) {
        setError(dr.errorGeneric)
        setSubmitting(false)
        return
      }
      const params = new URLSearchParams({
        major: complete.major_pref,
        view: res.view,
        goal: complete.primary_goal,
      })
      if (res.assessmentId) params.set("aid", res.assessmentId)
      router.push(`/degree-risk/result?${params.toString()}`)
    } catch {
      setError(dr.errorGeneric)
      setSubmitting(false)
    }
  }

  function choose(key: AnswerKey, value: string) {
    if (submitting || advancing) return
    const next = { ...answers, [key]: value }
    setAnswers(next)
    // Single-select: show the selected state briefly, then advance.
    setAdvancing(true)
    setTimeout(() => {
      if (isLast) {
        submit(next as Answers)
      } else {
        setStep((s) => s + 1)
      }
      setAdvancing(false)
    }, 250)
  }

  const progressPct = Math.round(((step + (selected ? 1 : 0)) / QUESTIONS.length) * 100)

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-sm font-medium text-slate-400">
          <span>
            {dr.progress
              .replace("{step}", String(step + 1))
              .replace("{total}", String(QUESTIONS.length))}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <h2 className="font-display text-question text-slate-900 mb-6">
        {dr.questions[question.key] ?? question.title}
      </h2>

      <ul className="space-y-3">
        {question.options.map((option) => (
          <li key={option.value}>
            <ChoiceCard
              label={optionLabel(option.value)}
              icon={isCountry ? COUNTRY_FLAGS[option.value] : undefined}
              selected={selected === option.value}
              disabled={submitting || advancing}
              onSelect={() => choose(question.key, option.value)}
            />
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between min-h-[2.25rem]">
        {step > 0 && !submitting ? (
          <button
            type="button"
            onClick={() => !advancing && setStep((s) => s - 1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {dr.back}
          </button>
        ) : (
          <span />
        )}
      </div>

      {/* Submit / loading affordance — sticky on mobile, safe-area aware */}
      {submitting && (
        <div className="sticky bottom-0 left-0 right-0 mt-2 pb-[env(safe-area-inset-bottom)] bg-gradient-to-t from-white via-white to-transparent pt-4">
          <Button variant="tactile" size="tactile" disabled className="w-full">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {dr.scoring}
          </Button>
        </div>
      )}
    </div>
  )
}
