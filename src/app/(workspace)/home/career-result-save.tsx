"use client"

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { recordCareerFunnelEvent } from "@/lib/analytics"
import { localizePath } from "@/lib/i18n/config"
import type { SavedCareerResultInput } from "@/lib/workspace/saved-career-result"
import {
  getSavedCareerResultState,
  saveCareerResult,
} from "./career-result-save-actions"

type Locale = "en" | "ko"
type SaveState = "idle" | "saving" | "saved" | "error"

type CareerResultSaveProps = {
  input: SavedCareerResultInput
  authenticated: boolean | null
  locale: Locale
  resumePath: string
  className?: string
}

const copy = {
  ko: {
    save: "이 결과 저장",
    saved: "저장됨",
    saving: "저장 중…",
    signIn: "로그인하고 결과 저장",
    error: "저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
  },
  en: {
    save: "Save this result",
    saved: "Saved",
    saving: "Saving…",
    signIn: "Sign in to save",
    error: "We could not save this result. Please try again.",
  },
} as const

export function CareerResultSave({ input, authenticated, locale, resumePath, className }: CareerResultSaveProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { countryCode, occupationId, personalised, evidenceCheckedAt, nextAction } = input
  const [state, setState] = useState<SaveState>("idle")
  const [message, setMessage] = useState("")
  const autoSaveAttempted = useRef<string | null>(null)
  const saveKey = `${countryCode}:${occupationId}`
  const savedResult = useMemo(() => ({
    countryCode,
    occupationId,
    personalised,
    evidenceCheckedAt,
    nextAction,
  }), [countryCode, occupationId, personalised, evidenceCheckedAt, nextAction])
  const t = copy[locale]
  const loginPath = `${localizePath("/login", locale)}?next=${encodeURIComponent(`${resumePath}${resumePath.includes("?") ? "&" : "?"}save=1`)}`

  useEffect(() => {
    let active = true
    setState("idle")
    setMessage("")
    if (authenticated !== true) return () => { active = false }

    void getSavedCareerResultState(savedResult).then((result) => {
      if (!active) return
      if (result.state === "ready" && result.saved) setState("saved")
      if (result.state === "error") {
        setState("error")
        setMessage(t.error)
      }
    })
    return () => { active = false }
  }, [authenticated, savedResult, t.error])

  const save = useCallback(async (auto = false) => {
    if (authenticated === false) {
      router.push(loginPath)
      return
    }
    if (authenticated !== true) return

    setState("saving")
    setMessage("")
    const result = await saveCareerResult(savedResult)
    if (result.state === "saved") {
      setState("saved")
      recordCareerFunnelEvent("career_result_saved", {
        surface: "career_result",
        locale,
        country: savedResult.countryCode,
        career: savedResult.occupationId,
      })
      if (auto) router.replace(resumePath, { scroll: false })
      return
    }
    if (result.state === "unauthenticated") {
      router.push(loginPath)
      return
    }
    setState("error")
    setMessage(t.error)
  }, [authenticated, locale, loginPath, resumePath, router, savedResult, t.error])

  useEffect(() => {
    if (searchParams.get("save") !== "1" || autoSaveAttempted.current === saveKey || authenticated == null) return
    autoSaveAttempted.current = saveKey
    void save(true)
  }, [authenticated, save, saveKey, searchParams])

  const saved = state === "saved"
  const saving = state === "saving"
  const label = saving ? t.saving : saved ? t.saved : authenticated === false ? t.signIn : t.save

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving || saved || authenticated == null}
        aria-pressed={saved}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#cfd8e9] bg-white px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-default disabled:border-blue-100 disabled:bg-blue-50 disabled:text-blue-700"
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        {label}
      </button>
      {message && <p role="status" aria-live="polite" className="mt-2 text-xs text-red-700">{message}</p>}
    </div>
  )
}
