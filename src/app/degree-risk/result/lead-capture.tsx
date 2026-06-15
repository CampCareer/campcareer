"use client"

import { useState } from "react"
import { Loader2, Mail } from "lucide-react"
import { saveLead } from "../actions"

export function LeadCapture({ assessmentId }: { assessmentId: string | null }) {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "submitting") return
    setStatus("submitting")
    setError(null)
    try {
      const res = await saveLead({ email, consentMarketing: consent, assessmentId })
      if (res.ok) {
        setStatus("done")
      } else {
        setError(res.error ?? "Something went wrong — please try again.")
        setStatus("idle")
      }
    } catch {
      setError("Something went wrong — please try again.")
      setStatus("idle")
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center">
        <p className="text-sm font-medium text-emerald-700">
          Done — your full breakdown is on its way to {email}.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Mail className="w-4 h-4 text-blue-300" />
        <h2 className="text-base font-semibold text-white">
          Get the full breakdown + alternatives report by email
        </h2>
      </div>
      <p className="text-xs text-slate-400 mb-5">
        The complete five-layer analysis for your major, plus the same scores for every
        alternative — free.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          {status === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
          Send my report
        </button>
      </form>

      <label className="mt-4 flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 rounded border-slate-600 bg-slate-800 accent-blue-500"
        />
        <span>
          I also want occasional study-abroad insights and major comparisons by email.
          Optional — the report arrives either way.
        </span>
      </label>

      {error && (
        <p className="mt-3 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
