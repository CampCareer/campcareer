"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

const STORAGE_KEY = "campcareer:career-onboarding-return"
const MAX_AGE_MS = 30 * 60 * 1000

type StoredReturn = {
  returnTo: string
  capturedAt: number
}

function isSafeCareerReturnPath(value: string) {
  return value.startsWith("/career?") || value.startsWith("/ko/career?")
}

export function CareerOnboardingReturnCapture({ returnTo }: { returnTo: string | null }) {
  useEffect(() => {
    if (!returnTo || !isSafeCareerReturnPath(returnTo)) return
    const payload: StoredReturn = { returnTo, capturedAt: Date.now() }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [returnTo])

  return null
}

export function CareerOnboardingReturnBridge() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let active = true

    void (async () => {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return

      let stored: StoredReturn | null = null
      try {
        stored = JSON.parse(raw) as StoredReturn
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY)
        return
      }

      if (
        !stored
        || typeof stored.returnTo !== "string"
        || typeof stored.capturedAt !== "number"
        || !isSafeCareerReturnPath(stored.returnTo)
        || Date.now() - stored.capturedAt > MAX_AGE_MS
      ) {
        window.sessionStorage.removeItem(STORAGE_KEY)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!active || !user) return

      const { data } = await supabase
        .from("user_preferences")
        .select("career_personalisation_completed_at")
        .eq("id", user.id)
        .maybeSingle()

      if (!active) return

      const completedAt = data?.career_personalisation_completed_at
        ? Date.parse(data.career_personalisation_completed_at)
        : Number.NaN

      if (!Number.isFinite(completedAt) || completedAt < stored.capturedAt) {
        window.sessionStorage.removeItem(STORAGE_KEY)
        return
      }

      window.sessionStorage.removeItem(STORAGE_KEY)
      router.replace(stored.returnTo)
    })()

    return () => { active = false }
  }, [router, supabase])

  return null
}
