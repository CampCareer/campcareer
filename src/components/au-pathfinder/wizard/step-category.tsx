"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Search } from "lucide-react"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { cn } from "@/lib/utils"
import type { AuPathfinderCategory } from "@/lib/au-pathfinder"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export function StepCategory({
  isKo,
  onSelect,
  onSelectConcept,
}: {
  isKo: boolean
  onSelect: (category: AuPathfinderCategory) => void
  onSelectConcept: (conceptId: string, category: AuPathfinderCategory) => void
}) {
  const [query, setQuery] = useState("")

  const categories = useMemo(
    () =>
      STUDY_CATEGORIES.map((cat) => ({
        ...cat,
        visual: getStudyCategoryVisual(cat.id),
      })),
    []
  )

  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return STUDY_CONCEPTS.filter((concept) => {
      const searchable = [
        concept.label,
        concept.labelKo,
        ...concept.aliases,
        ...concept.aliasesKo,
        concept.description,
      ]
        .join(" ")
        .toLowerCase()
      return searchable.includes(q)
    }).slice(0, 6)
  }, [query])

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {isKo
            ? "어떤 분야에 관심이 있으신가요?"
            : "What field interests you?"}
        </h1>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-8"
      >
        <div className="relative mx-auto max-w-lg">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isKo
                ? "전공 검색 (예: 컴퓨터과학, 간호, 요리...)"
                : "Search majors (e.g. computer science, nursing, cookery...)"
            }
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-3 max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
          >
            <p className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {isKo ? "검색 결과" : "Search results"}
            </p>
            {searchResults.map((concept) => {
              const visual = getStudyCategoryVisual(concept.category)
              const cat = STUDY_CATEGORIES.find((c) => c.id === concept.category)
              return (
                <button
                  key={concept.id}
                  type="button"
                  onClick={() => onSelectConcept(concept.id, concept.category as AuPathfinderCategory)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-lg",
                      visual.tone
                    )}
                  >
                    <visual.Icon className="size-4" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {isKo ? concept.labelKo : concept.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {isKo ? cat?.labelKo : cat?.label}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-slate-300" />
                </button>
              )
            })}
          </motion.div>
        )}

        {/* No results */}
        {query.trim() && searchResults.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-500"
          >
            {isKo
              ? `"${query}"에 맞는 전공이 없습니다. 아래 카테고리를 살펴보세요.`
              : `No major matches "${query}". Browse categories below.`}
          </motion.p>
        )}
      </motion.div>

      {/* Category grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        {categories.map((category) => {
          const { Icon, tone } = category.visual
          return (
            <motion.button
              key={category.id}
              variants={item}
              type="button"
              onClick={() => onSelect(category.id as AuPathfinderCategory)}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_14px_32px_rgba(37,99,235,.12)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                "sm:p-6"
              )}
            >
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110 sm:size-14",
                  tone
                )}
              >
                <Icon className="size-6 sm:size-7" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                  {isKo ? category.labelKo : category.label}
                </h2>
              </div>
              <ArrowRight
                className="absolute bottom-4 right-4 size-4 text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-600 group-hover:opacity-100"
                strokeWidth={2.5}
              />
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
