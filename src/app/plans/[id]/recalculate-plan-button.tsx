"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, RefreshCw } from "lucide-react"

export function RecalculatePlanButton({ planId, label }: { planId: string; label: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function recalculate() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/v1/decision-plans/${planId}/recalculate`, { method: "POST" })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? "Recalculation failed")
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Recalculation failed")
    } finally {
      setLoading(false)
    }
  }

  return <div><button type="button" onClick={recalculate} disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}{label}</button>{error && <p className="mt-2 text-xs text-red-600">{error}</p>}</div>
}
