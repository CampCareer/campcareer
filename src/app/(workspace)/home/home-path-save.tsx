"use client"

import Link from "next/link"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSavedPathwayState, savePathway } from "./home-pathway-actions"
import { getPathwayLoginPath, type SavedPathwayInput } from "./home-pathway-save"

type SaveState = "idle" | "saving" | "saved" | "error"
type HomePathSaveContextValue = { state: SaveState; message: string; save: () => Promise<void> }
const HomePathSaveContext = createContext<HomePathSaveContextValue | null>(null)

export function HomePathSaveProvider({ values, children }: { values: SavedPathwayInput; children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<SaveState>("idle")
  const [message, setMessage] = useState("")
  const autoSaveAttempted = useRef<string | null>(null)
  const pathwayKey = `${values.origin ?? ""}:${values.country}:${values.field}:${values.status}`
  const shouldAutoSave = searchParams.get("save") === "1"

  useEffect(() => {
    let active = true
    setState("idle")
    setMessage("")
    void getSavedPathwayState(values).then((result) => {
      if (!active || result.state !== "ready" || !result.saved) return
      setState("saved")
      setMessage("Saved to your Home dashboard.")
    })
    return () => { active = false }
  }, [pathwayKey, values])

  const clearSaveRequest = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("save")
    router.replace(`/home?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const save = useCallback(async () => {
    setState("saving")
    setMessage("")
    const result = await savePathway(values)
    if (result.state === "saved") {
      setState("saved")
      setMessage("Saved to your Home dashboard.")
      return
    }
    if (result.state === "unauthenticated") {
      router.push(getPathwayLoginPath(values))
      return
    }
    setState("error")
    setMessage(result.state === "invalid" ? "This pathway is no longer valid. Update your search and try again." : "We couldn’t save this pathway. Please try again.")
  }, [router, values])

  useEffect(() => {
    if (!shouldAutoSave || autoSaveAttempted.current === pathwayKey) return
    autoSaveAttempted.current = pathwayKey
    void (async () => {
      setState("saving")
      setMessage("")
      const result = await savePathway(values)
      if (result.state === "saved") {
        setState("saved")
        setMessage("Saved to your Home dashboard.")
        clearSaveRequest()
        return
      }
      if (result.state === "unauthenticated") {
        setState("idle")
        setMessage("Sign in to save this pathway.")
        return
      }
      setState("error")
      setMessage(result.state === "invalid" ? "This pathway is no longer valid. Update your search and try again." : "We couldn’t save this pathway. Please try again.")
    })()
  }, [clearSaveRequest, pathwayKey, shouldAutoSave, values])

  const value = useMemo(() => ({ state, message, save }), [message, save, state])
  return <HomePathSaveContext.Provider value={value}>{children}</HomePathSaveContext.Provider>
}

function useHomePathSave() {
  const context = useContext(HomePathSaveContext)
  if (!context) throw new Error("HomePathSaveButton must be used inside HomePathSaveProvider")
  return context
}

export function HomePathSaveButton({ compact = false, prominent = false }: { compact?: boolean; prominent?: boolean }) {
  const { state, save } = useHomePathSave()
  const saved = state === "saved"
  const saving = state === "saving"
  const label = saved ? "Saved" : compact ? "Save pathway" : "Save this pathway"
  const className = compact
    ? "inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#d5d3ce] bg-white px-3 text-xs font-semibold text-[#3a3935] transition hover:border-[#aaa8a1] hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 disabled:cursor-default disabled:border-blue-200 disabled:bg-blue-50 disabled:text-blue-800"
    : prominent
      ? "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 disabled:cursor-default disabled:bg-blue-100 disabled:text-blue-800"
      : "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d5d3ce] px-4 text-sm font-semibold text-[#1b1b1b] transition hover:border-[#aaa8a1] hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 disabled:cursor-default disabled:border-blue-200 disabled:bg-blue-50 disabled:text-blue-800"

  return <button type="button" onClick={() => void save()} disabled={saving || saved} aria-pressed={saved} className={className}>{saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}{label}</button>
}

export function HomePathSaveFooter({ headingId = "save-path-heading" }: { headingId?: string }) {
  const { message, state } = useHomePathSave()
  return <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby={headingId}><div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#dce6f7] bg-[#f7faff] p-4 sm:flex-row sm:items-center sm:p-5"><div><h2 id={headingId} className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Save this pathway</h2><p className="mt-1 text-sm leading-6 text-[#5f5d57]">Keep this route and continue from your Home dashboard.</p></div><HomePathSaveButton prominent /></div>{message && <p role="status" aria-live="polite" className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-sm text-[#6f6d68]"><span>{message}</span>{state === "saved" && <Link href="/home" className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">View dashboard</Link>}</p>}</section>
}
