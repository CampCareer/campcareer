"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import {
  ArrowUpDown,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
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
type PageItem = number | "ellipsis-left" | "ellipsis-right"

const PAGE_SIZE = 20

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
  const [page, setPage] = useState(1)
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedOccupations = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageItems = useMemo<PageItem[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis-right", totalPages]
    if (currentPage >= totalPages - 3) return [1, "ellipsis-left", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, "ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right", totalPages]
  }, [currentPage, totalPages])

  useEffect(() => {
    setPage(1)
  }, [query, sort, categoryFilter])

  function goToPage(nextPage: number) {
    const targetPage = Math.min(Math.max(nextPage, 1), totalPages)
    setPage(targetPage)
    document.getElementById("occupation-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

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
      <p id="occupation-results" className="mb-4 scroll-mt-5 text-xs text-slate-400">
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
          {paginatedOccupations.map((occ) => {
            const Icon = CATEGORY_ICONS[occ.categoryIcon as keyof typeof CATEGORY_ICONS]
            const isSaved = savedCodes.has(occ.anzsco_code)
            const isSaving = savingCode === occ.anzsco_code

            return (
            <article
              key={occ.anzsco_code}
              className="group relative min-h-[164px] rounded-xl border border-slate-200 transition-colors hover:border-brand/40 hover:bg-brand-tint"
            >
              <Link
                href={getAuOccupationPath(occ, occupations)}
                className="block h-full p-5 pr-4"
              >
                <div className="flex items-start gap-3">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${CATEGORY_TONES[occ.categoryId]}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1 pr-8">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      {occ.categoryName}
                    </div>
                    <div className="mt-1 text-lg font-semibold leading-snug text-foreground group-hover:text-brand-press">
                      {occ.occupation_en}
                    </div>
                    {occ.median_salary_aud && (
                      <div className="mt-2 text-base font-bold tabular-nums text-slate-800">
                        A${occ.median_salary_aud.toLocaleString()}
                        <span className="ml-1.5 text-[11px] font-medium text-slate-400">median annual salary</span>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
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
                    </div>
                  </div>
                </div>
                <span className="absolute bottom-4 right-5 text-xs text-slate-400">{occ.anzsco_code}</span>
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

      {filtered.length > PAGE_SIZE && (
        <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Occupation pagination">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          {pageItems.map((item, index) => item === "ellipsis-left" || item === "ellipsis-right" ? (
            <span key={`${item}-${index}`} className="grid size-9 place-items-center text-sm text-slate-400">…</span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              aria-current={item === currentPage ? "page" : undefined}
              className={`grid size-9 place-items-center rounded-lg border text-sm font-semibold transition ${
                item === currentPage
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand"
              }`}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </>
  )
}
