"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import type { PostMeta } from "@/lib/blog"

const CATEGORY_FILTERS = [
  { label: "All",        value: "all",           emoji: ""    },
  { label: "Ireland",    value: "Ireland",        emoji: "🇮🇪" },
  { label: "Australia",  value: "Australia",      emoji: "🇦🇺" },
  { label: "UK",         value: "United Kingdom", emoji: "🇬🇧" },
  { label: "Canada",     value: "Canada",         emoji: "🇨🇦" },
  { label: "USA",        value: "USA",            emoji: "🇺🇸" },
  { label: "Comparison", value: "Comparison",     emoji: "⚖️"  },
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

  const filtered = useMemo(
    () => active === "all" ? posts : posts.filter(p => p.tag === active),
    [active, posts]
  )

  const counts = useMemo(() =>
    CATEGORY_FILTERS.reduce<Record<string, number>>((acc, cat) => {
      acc[cat.value] = cat.value === "all"
        ? posts.length
        : posts.filter(p => p.tag === cat.value).length
      return acc
    }, {}),
  [posts])

  const featured = active === "all" ? filtered.find(p => p.featured) : undefined
  const grid = active === "all" ? filtered.filter(p => !p.featured) : filtered

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORY_FILTERS.map(cat => {
          const count = counts[cat.value] ?? 0
          if (count === 0 && cat.value !== "all") return null
          const isActive = active === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {cat.emoji && <span aria-hidden="true">{cat.emoji}</span>}
              {cat.label}
              <span className={`text-xs font-normal tabular-nums ${isActive ? "opacity-60" : "text-slate-400"}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all mb-8"
        >
          {featured.heroImage && (
            <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 mb-6" style={{ aspectRatio: "16/9" }}>
              <Image
                src={featured.heroImage}
                alt={featured.heroImageAlt ?? featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Featured</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${featured.tagColor}`}>{featured.tag}</span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {featured.readTime} {labels.readTime}
            </div>
            <time className="text-xs text-slate-400">{featured.date}</time>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-semibold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight max-w-4xl">
            {featured.title}
          </h2>
          <p className="text-slate-500 leading-relaxed mb-6 max-w-3xl">{featured.description}</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
            {labels.readMore} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      )}

      {grid.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {grid.map(post => (
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
    </>
  )
}
