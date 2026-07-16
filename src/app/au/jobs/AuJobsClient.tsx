"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import {
  ArrowUpDown,
  ChartNoAxesCombined,
  Code2,
  Cog,
  ConciergeBell,
  GraduationCap,
  Hammer,
  Heart,
  HeartPulse,
  Leaf,
  Palette,
  Plane,
  Search,
} from "lucide-react"
import { getAuOccupationPath } from "@/lib/au-occupation-slug"
import { createClient } from "@/lib/supabase-client"
import { AU_CAREER_CATEGORIES } from "@/data/au-career-categories"

type OccRow = {
  anzsco_code: string
  occupation_en: string
  median_salary_aud: number | null
  shortage_rating: number | null
  on_csol: boolean
  categoryId: number
  categoryName: string
  categoryIcon: string
  subcategoryId: string
}

type SortKey = "alpha" | "salary" | "shortage"
type CategoryFilter = "all" | number

const CATEGORY_ICONS = {
  hammer: Hammer,
  "heart-pulse": HeartPulse,
  code: Code2,
  cog: Cog,
  chart: ChartNoAxesCombined,
  "graduation-cap": GraduationCap,
  leaf: Leaf,
  palette: Palette,
  "concierge-bell": ConciergeBell,
  plane: Plane,
}

const CATEGORY_TONES: Record<number, string> = {
  1: "bg-amber-50 text-amber-700",
  2: "bg-rose-50 text-rose-700",
  3: "bg-sky-50 text-sky-700",
  4: "bg-indigo-50 text-indigo-700",
  5: "bg-violet-50 text-violet-700",
  6: "bg-fuchsia-50 text-fuchsia-700",
  7: "bg-emerald-50 text-emerald-700",
  8: "bg-pink-50 text-pink-700",
  9: "bg-orange-50 text-orange-700",
  10: "bg-cyan-50 text-cyan-700",
}

export function AuJobsClient({ occupations }: { occupations: OccRow[] }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("alpha")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [user, setUser] = useState<User | null>(null)
  const [savedCodes, setSavedCodes] = useState<Set<string>>(new Set())
  const [savingCode, setSavingCode] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let active = true

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (active) setUser(user)
    }

    void loadUser()
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

    async function loadSavedOccupations() {
      if (!user) {
        setSavedCodes(new Set())
        return
      }

      const { data } = await supabase
        .from("saved_occupations")
        .select("occ_code")
        .eq("user_id", user.id)

      if (active) setSavedCodes(new Set((data ?? []).map((item) => item.occ_code)))
    }

    void loadSavedOccupations()
    return () => { active = false }
  }, [supabase, user])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const base = occupations.filter((occupation) => {
      const matchesCategory = categoryFilter === "all" || occupation.categoryId === categoryFilter
      const matchesQuery = !q
        || occupation.occupation_en.toLowerCase().includes(q)
        || occupation.categoryName.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })

    if (sort === "salary") {
      return [...base].sort((a, b) => (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0))
    } else if (sort === "shortage") {
      return [...base].sort((a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0))
    }
    return [...base].sort((a, b) => a.occupation_en.localeCompare(b.occupation_en))
  }, [occupations, query, sort, categoryFilter])

  async function toggleSaveOccupation(occupation: OccRow) {
    if (!user) {
      const next = `${window.location.pathname}${window.location.search}`
      window.location.assign(`/login?next=${encodeURIComponent(next)}`)
      return
    }

    setSavingCode(occupation.anzsco_code)
    const isSaved = savedCodes.has(occupation.anzsco_code)
    const result = isSaved
      ? await supabase
          .from("saved_occupations")
          .delete()
          .eq("user_id", user.id)
          .eq("occ_code", occupation.anzsco_code)
      : await supabase
          .from("saved_occupations")
          .upsert({
            user_id: user.id,
            occ_code: occupation.anzsco_code,
            occ_title: occupation.occupation_en,
            country: "AU",
          }, { onConflict: "user_id,occ_code" })

    if (!result.error) {
      setSavedCodes((current) => {
        const next = new Set(current)
        if (isSaved) next.delete(occupation.anzsco_code)
        else next.add(occupation.anzsco_code)
        return next
      })
    }
    setSavingCode(null)
  }

  return (
    <>
      {/* Search + filter bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search occupations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide shrink-0">Sort</span>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm">
            {(
              [
                { key: "alpha", label: "A–Z" },
                { key: "salary", label: "Salary ↓" },
                { key: "shortage", label: "Shortage ↓" },
              ] as { key: SortKey; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`px-3 py-2 transition-colors ${
                  sort === key
                    ? "bg-brand text-white font-semibold"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Career category filters">
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            categoryFilter === "all"
              ? "border-brand bg-brand text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-brand/40"
          }`}
        >
          All careers
        </button>
        {AU_CAREER_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.icon]
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryFilter(category.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === category.id
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand/40"
              }`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {category.name}
            </button>
          )
        })}
      </div>

      {/* Result count */}
      <p className="mb-4 text-xs text-slate-400">
        {filtered.length === occupations.length
          ? `${occupations.length} occupations`
          : `${filtered.length} of ${occupations.length} occupations`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">
          No occupations match &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((occ) => {
            const Icon = CATEGORY_ICONS[occ.categoryIcon as keyof typeof CATEGORY_ICONS]
            const isSaved = savedCodes.has(occ.anzsco_code)
            const isSaving = savingCode === occ.anzsco_code

            return (
            <article
              key={occ.anzsco_code}
              className="group relative rounded-xl border border-slate-200 transition-colors hover:border-brand/40 hover:bg-brand-tint"
            >
              <Link
                href={getAuOccupationPath(occ, occupations)}
                className="block p-4 pr-12"
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${CATEGORY_TONES[occ.categoryId]}`}>
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      {occ.categoryName}
                    </div>
                    <div className="text-sm font-medium leading-snug text-foreground group-hover:text-brand-press">
                      {occ.occupation_en}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {occ.median_salary_aud && (
                    <span className="font-semibold text-slate-700">
                      A${occ.median_salary_aud.toLocaleString()}
                    </span>
                  )}
                  {occ.shortage_rating != null && occ.shortage_rating >= 3 && (
                    <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600">
                      Shortage
                    </span>
                  )}
                  {occ.on_csol && (
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                      CSOL
                    </span>
                  )}
                  <span className="ml-auto">{occ.anzsco_code}</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => void toggleSaveOccupation(occ)}
                disabled={isSaving}
                aria-label={isSaved ? `Remove ${occ.occupation_en} from saved occupations` : `Save ${occ.occupation_en}`}
                title={!user ? "Sign in to save this occupation" : isSaved ? "Remove from saved occupations" : "Save occupation"}
                className={`absolute right-3 top-3 rounded-full p-1.5 transition-colors disabled:cursor-wait ${
                  isSaved
                    ? "bg-rose-50 text-rose-500"
                    : "text-slate-300 hover:bg-slate-100 hover:text-rose-500"
                }`}
              >
                <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} aria-hidden="true" />
              </button>
            </article>
            )
          })}
        </div>
      )}
    </>
  )
}
