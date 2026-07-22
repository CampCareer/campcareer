"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

type University = { slug: string; name: string }
type SavedUniversitiesContextValue = {
  savedSlugs: Set<string>
  savingSlug: string | null
  toggle: (university: University) => Promise<void>
}

const SavedUniversitiesContext = createContext<SavedUniversitiesContextValue | null>(null)

export function SavedUniversitiesProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set())
  const [savingSlug, setSavingSlug] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    let active = true
    if (!user) {
      setSavedSlugs(new Set())
      return () => { active = false }
    }
    supabase
      .from("saved_universities")
      .select("univ_slug")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (active) setSavedSlugs(new Set((data ?? []).map((row) => row.univ_slug)))
      })
    return () => { active = false }
  }, [supabase, user])

  const toggle = useCallback(async (university: University) => {
    if (!user) {
      const next = `${window.location.pathname}${window.location.search}`
      window.location.assign(`/login?next=${encodeURIComponent(next)}`)
      return
    }

    const isSaved = savedSlugs.has(university.slug)
    setSavingSlug(university.slug)
    try {
      const result = isSaved
        ? await supabase.from("saved_universities").delete().eq("user_id", user.id).eq("univ_slug", university.slug)
        : await supabase.from("saved_universities").upsert({ user_id: user.id, univ_slug: university.slug, univ_name: university.name }, { onConflict: "user_id,univ_slug" })
      if (!result.error) {
        setSavedSlugs((current) => {
          const next = new Set(current)
          if (isSaved) next.delete(university.slug)
          else next.add(university.slug)
          return next
        })
      }
    } finally {
      setSavingSlug(null)
    }
  }, [savedSlugs, supabase, user])

  return <SavedUniversitiesContext.Provider value={{ savedSlugs, savingSlug, toggle }}>{children}</SavedUniversitiesContext.Provider>
}

export function SaveUniversityButton({ university, compact = false, className }: { university: University; compact?: boolean; className?: string }) {
  const context = useContext(SavedUniversitiesContext)
  if (context) return <SaveUniversityButtonContent context={context} university={university} compact={compact} className={className} />
  return <SavedUniversitiesProvider><SaveUniversityButtonContent university={university} compact={compact} className={className} /></SavedUniversitiesProvider>
}

function SaveUniversityButtonContent({ context, university, compact, className }: { context?: SavedUniversitiesContextValue; university: University; compact: boolean; className?: string }) {
  const providedContext = useContext(SavedUniversitiesContext)
  const activeContext = context ?? providedContext
  const locale = useRouteLocale()
  const saved = activeContext?.savedSlugs.has(university.slug) ?? false
  const saving = activeContext?.savingSlug === university.slug
  const label = saved ? (locale === "ko" ? "My Plan에 저장됨" : "Saved to My Plan") : (locale === "ko" ? "My Plan에 저장" : "Save to My Plan")

  return <button type="button" onClick={() => void activeContext?.toggle(university)} disabled={!activeContext || saving} aria-pressed={saved} aria-label={label} title={label} className={cn("inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70", saved ? "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-300 hover:bg-blue-100" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800", compact && "size-9 min-h-0 px-0", className)}>{saving ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}{!compact && <span>{label}</span>}</button>
}
