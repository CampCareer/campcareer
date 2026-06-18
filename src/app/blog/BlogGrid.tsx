"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, ChevronDown } from "lucide-react"
import type { PostMeta } from "@/lib/blog"

const CATEGORIES = [
  { label: "All",        value: "all",           emoji: ""    },
  { label: "Ireland",    value: "Ireland",        emoji: "🇮🇪" },
  { label: "Australia",  value: "Australia",      emoji: "🇦🇺" },
  { label: "UK",         value: "United Kingdom", emoji: "🇬🇧" },
  { label: "Canada",     value: "Canada",         emoji: "🇨🇦" },
  { label: "USA",        value: "USA",            emoji: "🇺🇸" },
  { label: "Comparison", value: "Comparison",     emoji: "⚖️"  },
]

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler()
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [ref, handler])
}

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
]

interface BlogGridProps {
  posts: PostMeta[]
  labels: {
    readTime: string
    readMore: string
  }
}

const PAGE_SIZE = 12

export function BlogGrid({ posts, labels }: BlogGridProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
  const [sortOrder, setSortOrder] = useState("newest")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)
  useClickOutside(catRef, () => setCatOpen(false))

  const filtered = useMemo(() => {
    const showAll = selectedCategories.length === 0 || selectedCategories.includes("all")
    const list = showAll
      ? posts
      : posts.filter(p => selectedCategories.includes(p.tag))
    return [...list].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sortOrder === "newest" ? diff : -diff
    })
  }, [selectedCategories, posts, sortOrder])

  const handleCategoryToggle = useCallback((value: string) => {
    setSelectedCategories(prev => {
      if (value === "all") return ["all"]
      const next = prev.filter(c => c !== "all")
      if (next.includes(value)) {
        const filtered = next.filter(c => c !== value)
        return filtered.length === 0 ? ["all"] : filtered
      }
      return [...next, value]
    })
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleSortChange = useCallback((value: string) => {
    setSortOrder(value)
    setVisibleCount(PAGE_SIZE)
  }, [])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const counts = useMemo(() =>
    CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
      acc[cat.value] = cat.value === "all"
        ? posts.length
        : posts.filter(p => p.tag === cat.value).length
      return acc
    }, {}),
  [posts])

  const catLabel = selectedCategories.includes("all")
    ? "All Categories"
    : `${selectedCategories.length} selected`

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <aside className="w-full md:w-64 shrink-0">
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Sort By</h3>
          <select
            value={sortOrder}
            onChange={e => handleSortChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-8 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 outline-none"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Category</h3>
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen(o => !o)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-slate-400 transition-colors text-left"
            >
              <span className="flex-1 truncate">{catLabel}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                {CATEGORIES.map(cat => {
                  const count = counts[cat.value] ?? 0
                  if (count === 0 && cat.value !== "all") return null
                  const checked = selectedCategories.includes(cat.value)
                  const isAll = cat.value === "all"
                  return (
                    <label
                      key={cat.value}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={isAll ? selectedCategories.includes("all") : checked}
                        onChange={() => handleCategoryToggle(cat.value)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-blue-300"
                      />
                      {cat.emoji && <span aria-hidden="true">{cat.emoji}</span>}
                      <span className="flex-1">{cat.label}</span>
                      <span className="text-xs text-slate-400 tabular-nums">{count}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all"
              >
                {post.heroImage && (
                  <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 mb-4 -mx-0" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={post.heroImage}
                      alt={post.heroImageAlt ?? post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 380px"
                    />
                  </div>
                )}
                <div className="mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.tagColor}`}>{post.tag}</span>
                </div>
                <h2 className="font-display text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug line-clamp-3 flex-1">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">{post.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime} {labels.readTime}</span>
                    <span className="mx-1">·</span>
                    <time>{post.date}</time>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 group-hover:gap-2 transition-all whitespace-nowrap">
                    {labels.readMore} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-all"
                >
                  View More
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg font-medium">No articles yet in this category.</p>
            <p className="text-slate-300 text-sm mt-1">Check back soon.</p>
            <button onClick={() => { setSelectedCategories(["all"]); setVisibleCount(PAGE_SIZE); }} className="mt-5 text-sm font-medium text-blue-600 hover:underline">
              ← View all articles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
