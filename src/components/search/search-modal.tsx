"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, MapPinned, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"
import { localizePath, type LocaleOption } from "@/lib/i18n/config"

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
    return ROUTE_GUIDES.filter((guide) => {
      const searchable = [
        guide.origin.name.en,
        guide.origin.name.ko,
        guide.destination.name.en,
        guide.destination.name.ko,
        guide.target.en,
        guide.target.ko,
        guide.title.en,
        guide.title.ko,
      ]
        .join(" ")
        .toLowerCase()
      return searchable.includes(q)
    }).slice(0, 8)
  }, [query])

  function navigate(guide: typeof ROUTE_GUIDES[number]) {
    router.push(localizePath(routeGuideHref(guide), locale))
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
                placeholder={isKo ? "경로 검색 (예: 한국, 호주, 광업...)" : "Search routes (e.g. Korea, Australia, mining...)"}
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
                {results.map((guide) => {
                  return (
                    <button
                      key={routeGuideHref(guide)}
                      type="button"
                      onClick={() => navigate(guide)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
                        <MapPinned className="size-4" strokeWidth={2.2} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {guide.title[isKo ? "ko" : "en"]}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {guide.origin.name[isKo ? "ko" : "en"]} <span aria-hidden="true">-&gt;</span> {guide.destination.name[isKo ? "ko" : "en"]} <span aria-hidden="true">-&gt;</span> {guide.target[isKo ? "ko" : "en"]}
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
                  ? `"${query}"에 맞는 검증 경로가 없습니다.`
                  : `No verified route matches "${query}".`}
              </div>
            )}

            {/* Hint */}
            {!query.trim() && (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                {isKo
                  ? "시민권, 목적지, 직종을 입력하면 검증된 경로를 검색합니다"
                  : "Search by citizenship, destination, or occupation"}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
