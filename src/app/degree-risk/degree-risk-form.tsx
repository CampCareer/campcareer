"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { QUESTIONS, type Answers, type AnswerKey } from "@/lib/degree-risk"
import { submitAssessment } from "./actions"

export function DegreeRiskForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const question = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1
  const selected = answers[question.key]

  async function submit(complete: Answers) {
    setSubmitting(true)
    setError(null)
    try {
      const res = await submitAssessment(complete)
      if (!res.ok) {
        setError(res.error ?? "Something went wrong — please try again.")
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
      setError("Something went wrong — please try again.")
      setSubmitting(false)
    }
  }

  function choose(key: AnswerKey, value: string) {
    if (submitting) return
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (isLast) {
      submit(next as Answers)
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
          <span>
            Question {step + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round((step / QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((step + (selected ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-4">{question.title}</h2>

      <ul className="space-y-2.5">
        {question.options.map((option) => {
          const isSelected = selected === option.value
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => choose(question.key, option.value)}
                disabled={submitting}
                className={cn(
                  "w-full flex items-center justify-between text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors",
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50",
                  submitting && "opacity-60"
                )}
              >
                {option.label}
                {isSelected && <Check className="w-4 h-4 shrink-0 text-indigo-600" />}
              </button>
            </li>
          )
        })}
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
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <span />
        )}
        {submitting && (
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Scoring your degree…
          </span>
        )}
      </div>
    </div>
  )
}
