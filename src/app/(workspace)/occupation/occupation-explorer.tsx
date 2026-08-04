"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BriefcaseBusiness, Globe2, MousePointerClick } from "lucide-react"
import { CANONICAL_CAREERS, type CanonicalCareer } from "@/data/career-comparison-catalog"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import type { AustraliaCountryMetrics } from "@/lib/workspace/australia-country-metrics"
import { getOccupationDetail } from "@/lib/workspace/occupation-detail"
import { CategorySearch } from "@/components/workspace/category-search"
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { AustraliaCountryOverview } from "./australia-country-overview"
import { OccupationDetailPanel } from "./occupation-detail-view"
import { cn } from "@/lib/utils"

const CATEGORY_LABELS = new Map<string, string>(STUDY_CATEGORIES.map((c) => [c.id, c.label]))
const CATEGORY_ACCENT = new Map<string, string>([
  ["trades", "#c2691e"],
  ["health", "#2563eb"],
  ["technology", "#6d4fc4"],
  ["engineering", "#3e7a2e"],
  ["business", "#2563eb"],
  ["education", "#6d4fc4"],
  ["environment", "#3e7a2e"],
  ["design", "#c2691e"],
  ["hospitality", "#c2691e"],
  ["transport", "#6d4fc4"],
])

function matchCareer(career: CanonicalCareer, q: string) {
  const query = q.trim().toLowerCase()
  if (!query) return true
  return (
    career.label.toLowerCase().includes(query) ||
    career.labelKo.toLowerCase().includes(query) ||
    career.aliases.some((alias) => alias.toLowerCase().includes(query)) ||
    career.aliasesKo.some((alias) => alias.toLowerCase().includes(query))
  )
}

function initialSelection(
  initialOccupation: string,
  query: string,
  matches: CanonicalCareer[]
): string | undefined {
  if (initialOccupation && matches.some((c) => c.id === initialOccupation)) return initialOccupation
  if (!query.trim()) return undefined
  const exact = matches.find((c) => c.label.toLowerCase() === query.trim().toLowerCase())
  return exact?.id ?? matches[0]?.id
}

export function OccupationExplorer({
  initialQuery,
  initialOccupation,
  australiaCountryMetrics,
}: {
  initialQuery: string
  initialOccupation: string
  australiaCountryMetrics: AustraliaCountryMetrics
}) {
  const router = useRouter()
  const { selectedCountry } = useSelectedCountry()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<string>("all")

  const filtered = useMemo(() => {
    return CANONICAL_CAREERS.filter((career) => {
      if (category !== "all" && career.categoryId !== category) return false
      return matchCareer(career, query)
    })
  }, [query, category])

  const [selectedId, setSelectedId] = useState<string | undefined>(() =>
    initialSelection(initialOccupation, initialQuery, filtered)
  )

  const selected = selectedId
    ? CANONICAL_CAREERS.find((c) => c.id === selectedId)
    : undefined
  const selectedDetail = selected ? getOccupationDetail(selected.id) : undefined

  const grouped = useMemo(() => {
    const map = new Map<string, CanonicalCareer[]>()
    for (const career of filtered) {
      const list = map.get(career.categoryId) ?? []
      list.push(career)
      map.set(career.categoryId, list)
    }
    return [...map.entries()]
  }, [filtered])

  function select(career: CanonicalCareer) {
    setSelectedId(career.id)
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    params.set("occupation", career.id)
    router.replace(`/occupation?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Explore"
        title="Occupation"
        description="Browse the global career catalogue — trades, health, tech, engineering and more. Every entry is cross-checked before it appears here."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
        {selectedCountry && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#2563eb]/25 bg-[#eef4ff] px-4 py-2.5 text-[13px] font-medium text-[#1b1b1b] lg:col-span-2">
            <Globe2 className="size-4 shrink-0 text-[#2563eb]" />
            <span>
              Scoped to <span className="font-semibold">{selectedCountry.name}</span> — matching
              occupation data is highlighted.{" "}
              <Link href="/countries" className="font-semibold text-[#2563eb] hover:underline">
                Change country
              </Link>
            </span>
          </div>
        )}

        {selectedCountry?.code === "AU" && (
          <AustraliaCountryOverview metrics={australiaCountryMetrics} />
        )}

        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto lg:pb-2">
          <CategorySearch
            value={query}
            onChange={setQuery}
            placeholder="Search occupations, e.g. Nurse or Electrician…"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition",
                category === "all"
                  ? "border-[#1b1b1b] bg-[#1b1b1b] text-white"
                  : "border-[#e0dfdb] bg-white text-[#6f6d68] hover:border-[#d0cfcb] hover:text-[#1b1b1b]"
              )}
            >
              All
            </button>
            {STUDY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition",
                  category === c.id
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-[#e0dfdb] bg-white text-[#6f6d68] hover:border-[#2563eb]/50 hover:text-[#2563eb]"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-[12.5px] font-medium text-[#a3a19b]">
            {filtered.length} occupations
          </p>

          {filtered.length === 0 ? (
            <div className="mt-3 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#e7e6e3] bg-white/50 text-center">
              <BriefcaseBusiness className="size-6 text-[#c4c2bc]" />
              <p className="mt-3 text-[13.5px] font-medium text-[#6f6d68]">
                No occupations match “{query}”.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              {grouped.map(([categoryId, careers]) => (
                <div key={categoryId}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a3a19b]">
                      {CATEGORY_LABELS.get(categoryId)}
                    </h3>
                    <span className="text-[10.5px] font-medium text-[#c4c2bc]">{careers.length}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {careers.map((career) => {
                      const detail = getOccupationDetail(career.id)
                      const accent = CATEGORY_ACCENT.get(career.categoryId) ?? "#2563eb"
                      const isSelected = career.id === selectedId
                      return (
                        <button
                          key={career.id}
                          type="button"
                          onClick={() => select(career)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition",
                            isSelected
                              ? "border-[#2563eb]/40 bg-[#eef4ff]"
                              : "border-transparent hover:bg-[#fafaf8]"
                          )}
                        >
                          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                          <span className="min-w-0 flex-1">
                            <span className={cn("block truncate text-[13.5px] font-medium", isSelected ? "text-[#2563eb]" : "text-[#1b1b1b]")}>
                              {career.label}
                            </span>
                            <span className="block truncate text-[11.5px] text-[#a3a19b]">
                              {career.labelKo}
                            </span>
                          </span>
                          {detail?.demand[0] && (
                            <span className="shrink-0 rounded-full bg-[#edf5ea] px-2 py-0.5 text-[10px] font-bold text-[#3e7a2e]">
                              {detail.demand[0].rating.toUpperCase()}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        <section>
          {selected ? (
            <OccupationDetailPanel
              career={selected}
              detail={selectedDetail}
              countryCode={selectedCountry?.code}
              countryName={selectedCountry?.name}
            />
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e7e6e3] bg-white/50 p-10 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#2563eb]">
                <MousePointerClick className="size-6" />
              </span>
              <h2 className="mt-5 text-[18px] font-semibold tracking-[-0.01em] text-[#1b1b1b]">
                Pick an occupation to open its dashboard
              </h2>
              <p className="mt-2 max-w-sm text-[13.5px] leading-6 text-[#6f6d68]">
                Search or browse the list on the left. Demand ratings, salary ranges and
                tasks update instantly here — no page reload needed.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
