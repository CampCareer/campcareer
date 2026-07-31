"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Globe2, GraduationCap } from "lucide-react"
import { STUDY_CONCEPTS, STUDY_CATEGORIES } from "@/data/study-concepts"
import { AU_TOP_UNIVERSITY_PROGRAM_SHORTLIST } from "@/data/au-top-university-program-shortlist"
import { CategorySearch } from "@/components/workspace/category-search"
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { cn } from "@/lib/utils"

const KIND_LABEL: Record<string, string> = {
  STUDY_FIELD: "Degree",
  QUALIFICATION: "Qualification",
  TRADE_PATHWAY: "Trade",
}

const AU_STATUS_BY_CONCEPT = new Map(
  AU_TOP_UNIVERSITY_PROGRAM_SHORTLIST.map((item) => [item.conceptId, item.status])
)

const AU_STATUS_BADGE: Record<string, { label: string; tone: "green" | "amber" }> = {
  available: { label: "Available in AU", tone: "green" },
  vocational_available: { label: "Vocational in AU", tone: "green" },
  tafe_phase: { label: "TAFE in progress", tone: "amber" },
  specialist_provider_phase: { label: "Provider review", tone: "amber" },
}

export function CoursesExplorer({ initialQuery }: { initialQuery: string }) {
  const { selectedCountry } = useSelectedCountry()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<string>("all")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = STUDY_CONCEPTS.filter((concept) => {
      if (category !== "all" && concept.category !== category) return false
      if (!q) return true
      return (
        concept.label.toLowerCase().includes(q) ||
        concept.labelKo.toLowerCase().includes(q) ||
        concept.description.toLowerCase().includes(q) ||
        concept.aliases.some((alias) => alias.toLowerCase().includes(q))
      )
    })
    if (selectedCountry?.code === "AU") {
      return [...filtered].sort((a, b) => {
        const aScore = AU_STATUS_BY_CONCEPT.get(a.id) ? 0 : 1
        const bScore = AU_STATUS_BY_CONCEPT.get(b.id) ? 0 : 1
        return aScore - bScore
      })
    }
    return filtered
  }, [query, category, selectedCountry])

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Explore"
        title="Programs"
        description="Degrees, qualifications and trade pathways that lead to real work — matched to verified providers and course codes where available."
      />

      {selectedCountry && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#2563eb]/25 bg-[#eef4ff] px-4 py-2.5 text-[13px] font-medium text-[#1b1b1b]">
          <Globe2 className="size-4 shrink-0 text-[#2563eb]" />
          <span>
            Scoped to <span className="font-semibold">{selectedCountry.name}</span>
            {selectedCountry.code === "AU"
              ? " — AU-available programs are shown first."
              : " — availability currently focuses on Australia."}{" "}
            <Link href="/countries" className="font-semibold text-[#2563eb] hover:underline">
              Change country
            </Link>
          </span>
        </div>
      )}

      <div className="mt-6 max-w-2xl">
        <CategorySearch
          value={query}
          onChange={setQuery}
          placeholder="Search programs, e.g. Nursing or Carpentry…"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
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

      <div className="mt-6 flex items-center justify-between">
        <p className="text-[12.5px] font-medium text-[#a3a19b]">
          {results.length} programs
        </p>
      </div>

      {results.length === 0 ? (
        <div className="mt-4 flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-[#e7e6e3] bg-white/50 text-center">
          <GraduationCap className="size-6 text-[#c4c2bc]" />
          <p className="mt-3 text-[13.5px] font-medium text-[#6f6d68]">No programs match “{query}”.</p>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((concept) => {
            const auStatus = AU_STATUS_BY_CONCEPT.get(concept.id)
            const badge = auStatus ? AU_STATUS_BADGE[auStatus] : undefined
            return (
              <div
                key={concept.id}
                className="flex flex-col rounded-xl border border-[#e7e6e3] bg-white p-4 transition hover:border-[#d8d8d4]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-[#1b1b1b]">
                    {concept.label}
                  </p>
                  <span className="shrink-0 rounded-md bg-[#f6f6f4] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#6f6d68]">
                    {KIND_LABEL[concept.kind] ?? concept.kind}
                  </span>
                </div>
                <p className="mt-0.5 text-[12.5px] text-[#a3a19b]">{concept.labelKo}</p>
                <p className="mt-2 line-clamp-2 text-[12.5px] leading-5 text-[#6f6d68]">
                  {concept.description}
                </p>
                <div className="mt-auto pt-3">
                  {badge && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        badge.tone === "green"
                          ? "border-[#d9e8d2] bg-[#f3f8f0] text-[#4a7a33]"
                          : "border-[#ece3cd] bg-[#faf6ec] text-[#8a6d2a]"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          badge.tone === "green" ? "bg-[#5d9442]" : "bg-[#c2a24f]"
                        )}
                      />
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
