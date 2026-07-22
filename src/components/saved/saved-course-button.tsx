"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

type Course = { id: string; name: string; providerName: string; fieldName: string; tuition: number | null }
type SavedCoursesContextValue = {
  savedIds: Set<string>
  savingId: string | null
  toggle: (course: Course) => Promise<void>
}

const SavedCoursesContext = createContext<SavedCoursesContextValue | null>(null)

export function SavedCoursesProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [supabase])

  useEffect(() => {
    let active = true
    if (!user) {
      setSavedIds(new Set())
      return () => { active = false }
    }
    supabase.from("saved_courses").select("course_id").eq("user_id", user.id).eq("country", "AU").then(({ data }) => {
      if (active) setSavedIds(new Set((data ?? []).map((row) => row.course_id)))
    })
    return () => { active = false }
  }, [supabase, user])

  const toggle = useCallback(async (course: Course) => {
    if (!user) {
      const next = `${window.location.pathname}${window.location.search}`
      window.location.assign(`/login?next=${encodeURIComponent(next)}`)
      return
    }
    const isSaved = savedIds.has(course.id)
    setSavingId(course.id)
    try {
      const result = isSaved
        ? await supabase.from("saved_courses").delete().eq("user_id", user.id).eq("country", "AU").eq("course_id", course.id)
        : await supabase.from("saved_courses").upsert({ user_id: user.id, country: "AU", course_id: course.id, course_name: course.name, college_name: course.providerName, field_name: course.fieldName, tuition: course.tuition })
      if (!result.error) setSavedIds((current) => {
        const next = new Set(current)
        if (isSaved) next.delete(course.id)
        else next.add(course.id)
        return next
      })
    } finally {
      setSavingId(null)
    }
  }, [savedIds, supabase, user])

  return <SavedCoursesContext.Provider value={{ savedIds, savingId, toggle }}>{children}</SavedCoursesContext.Provider>
}

export function SaveCourseButton({ course, compact = false, className }: { course: Course; compact?: boolean; className?: string }) {
  const context = useContext(SavedCoursesContext)
  if (context) return <SaveCourseButtonContent context={context} course={course} compact={compact} className={className} />
  return <SavedCoursesProvider><SaveCourseButtonContent course={course} compact={compact} className={className} /></SavedCoursesProvider>
}

function SaveCourseButtonContent({ context, course, compact, className }: { context?: SavedCoursesContextValue; course: Course; compact: boolean; className?: string }) {
  const providedContext = useContext(SavedCoursesContext)
  const activeContext = context ?? providedContext
  const locale = useRouteLocale()
  const saved = activeContext?.savedIds.has(course.id) ?? false
  const saving = activeContext?.savingId === course.id
  const label = saved ? (locale === "ko" ? "My Plan에 저장됨" : "Saved to My Plan") : (locale === "ko" ? "My Plan에 저장" : "Save to My Plan")
  return <button type="button" onClick={() => void activeContext?.toggle(course)} disabled={!activeContext || saving} aria-pressed={saved} aria-label={label} title={label} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70", saved ? "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-300 hover:bg-blue-100" : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:text-blue-700", compact && "size-9 min-h-0 rounded-lg px-0 text-xs", className)}>{saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}{!compact && <span>{label}</span>}</button>
}
