"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { localizePath, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function SearchModal({
  open,
  onClose,
  locale,
}: {
  open: boolean
  onClose: () => void
  locale: LocaleOption
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const isKo = locale === "ko"

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) setQuery("")
  }, [open])

  const results = useMemo(() => {
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
    }).slice(0, 8)
  }, [query])

  function navigate(slug: string) {
    router.push(localizePath(`/au/majors/${slug}`, locale))
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-[12vh] z-50 mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isKo ? "전공 검색 (예: 간호, IT, 요리...)" : "Search majors (e.g. nursing, IT, cookery...)"}
                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.map((concept) => {
                  const visual = getStudyCategoryVisual(concept.category)
                  const cat = STUDY_CATEGORIES.find((c) => c.id === concept.category)
                  return (
                    <button
                      key={concept.id}
                      type="button"
                      onClick={() => navigate(concept.slug)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
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
              </div>
            )}

            {/* No results */}
            {query.trim() && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                {isKo
                  ? `"${query}"에 맞는 전공이 없습니다.`
                  : `No major matches "${query}".`}
              </div>
            )}

            {/* Hint */}
            {!query.trim() && (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                {isKo
                  ? "전공 이름을 입력하면 바로 검색됩니다"
                  : "Type a major name to search instantly"}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
