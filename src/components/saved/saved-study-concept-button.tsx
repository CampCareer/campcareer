"use client"

import { useEffect, useMemo, useState } from "react"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

type SavedStudyConceptButtonProps = {
  concept: {
    slug: string
    label: string
    labelKo: string
    category: string
  }
  compact?: boolean
  className?: string
}

/** Save a broad field before the user has chosen an exact university or course. */
export function SavedStudyConceptButton({ concept, compact = false, className }: SavedStudyConceptButtonProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

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
      setSaved(false)
      return () => { active = false }
    }

    supabase
      .from("saved_study_concepts")
      .select("concept_slug")
      .eq("user_id", user.id)
      .eq("concept_slug", concept.slug)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setSaved(Boolean(data))
      })

    return () => { active = false }
  }, [concept.slug, supabase, user])

  async function toggleSaved() {
    if (!user) {
      const next = `${window.location.pathname}${window.location.search}`
      window.location.assign(`/login?next=${encodeURIComponent(next)}`)
      return
    }

    setSaving(true)
    try {
      const result = saved
        ? await supabase
            .from("saved_study_concepts")
            .delete()
            .eq("user_id", user.id)
            .eq("concept_slug", concept.slug)
        : await supabase
            .from("saved_study_concepts")
            .upsert({
              user_id: user.id,
              concept_slug: concept.slug,
              concept_label: concept.label,
              concept_label_ko: concept.labelKo,
              category: concept.category,
              country: "AU",
            }, { onConflict: "user_id,concept_slug" })

      if (!result.error) setSaved((value) => !value)
    } finally {
      setSaving(false)
    }
  }

  const label = saved
    ? (isKo ? "My Plan에 저장됨" : "Saved to My Plan")
    : (isKo ? "My Plan에 저장" : "Save to My Plan")
  const ariaLabel = user
    ? label
    : (isKo ? "로그인하고 My Plan에 저장" : "Sign in to save to My Plan")

  return (
    <button
      type="button"
      onClick={() => void toggleSaved()}
      disabled={saving}
      aria-pressed={saved}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70",
        saved
          ? "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-300 hover:bg-blue-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800",
        compact && "size-9 min-h-0 px-0",
        className,
      )}
    >
      {saving ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
      {!compact && <span>{label}</span>}
    </button>
  )
}
