"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
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

export function BlogGrid({ posts, labels }: BlogGridProps) {
  const [active, setActive] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const filtered = useMemo(() => {
    const list = active === "all" ? posts : posts.filter(p => p.tag === active)
    return [...list].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sortOrder === "newest" ? diff : -diff
    })
  }, [active, posts, sortOrder])

  const counts = useMemo(() =>
    CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
      acc[cat.value] = cat.value === "all"
        ? posts.length
        : posts.filter(p => p.tag === cat.value).length
      return acc
    }, {}),
  [posts])

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <aside className="w-full md:w-64 shrink-0">
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Sort By</h3>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-8 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 outline-none"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Category</h3>
          <ul className="space-y-1">
            {CATEGORIES.map(cat => {
              const count = counts[cat.value] ?? 0
              if (count === 0 && cat.value !== "all") return null
              const isActive = active === cat.value
              return (
                <li key={cat.value}>
                  <button
                    onClick={() => setActive(cat.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white font-medium"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {cat.emoji && <span aria-hidden="true">{cat.emoji}</span>}
                    <span className="flex-1">{cat.label}</span>
                    <span className={`text-xs tabular-nums ${isActive ? "opacity-60" : "text-slate-400"}`}>
                      {count}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
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
        ) : (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg font-medium">No articles yet in this category.</p>
            <p className="text-slate-300 text-sm mt-1">Check back soon.</p>
            <button onClick={() => setActive("all")} className="mt-5 text-sm font-medium text-blue-600 hover:underline">
              ← View all articles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
