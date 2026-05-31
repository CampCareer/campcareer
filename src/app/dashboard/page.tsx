'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bookmark, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const QUICK_STATS = [
  { emoji: "🌍", label: "Countries Available", value: "5" },
  { emoji: "📚", label: "Courses Tracked",     value: "2,860+" },
  { emoji: "📊", label: "Last Updated",        value: "May 2026" },
]

const FEATURE_CARDS = [
  {
    emoji: "📈",
    title: "ROI Explorer",
    desc: "Find best ROI by country",
    href: "/roi-explorer",
    accent: "bg-indigo-50 border-indigo-100 hover:border-indigo-300",
    iconBg: "bg-indigo-100",
  },
  {
    emoji: "🌐",
    title: "Country Compare",
    desc: "Side-by-side comparison",
    href: "/compare",
    accent: "bg-sky-50 border-sky-100 hover:border-sky-300",
    iconBg: "bg-sky-100",
  },
  {
    emoji: "✅",
    title: "Checklist",
    desc: "Track your application",
    href: "/checklist",
    accent: "bg-emerald-50 border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-emerald-100",
  },
  {
    emoji: "📅",
    title: "Timeline",
    desc: "Plan your journey",
    href: "/timeline",
    accent: "bg-amber-50 border-amber-100 hover:border-amber-300",
    iconBg: "bg-amber-100",
  },
]

const COUNTRY_FLAG: Record<string, string> = {
  US: "🇺🇸", AU: "🇦🇺", CA: "🇨🇦", UK: "🇬🇧", IE: "🇮🇪",
}

const CURRENCY_SYMBOL: Record<string, string> = {
  US: "$", AU: "A$", CA: "C$", UK: "£", IE: "€",
}

type SavedCourse = {
  id: string
  country: string
  course_id: string
  college_name: string
  field_name: string | null
  tuition: number | null
  created_at: string
}

export default function Dashboard() {
  const greeting = getGreeting()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [saved, setSaved] = useState<SavedCourse[]>([])
  const [loadingSaved, setLoadingSaved] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user) { setLoadingSaved(false); return }
    supabase
      .from("saved_courses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setSaved(data ?? [])
        setLoadingSaved(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleRemove(id: string) {
    await supabase.from("saved_courses").delete().eq("id", id)
    setSaved((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}{user ? ` 👋` : " 👋"}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {user ? user.email : "Here's your study abroad overview"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
          >
            <span className="text-2xl leading-none">{s.emoji}</span>
            <div>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 저장된 코스 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-500" />
            Saved Courses
          </h2>
          <Link
            href="/roi-explorer"
            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Browse more <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {!user ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-slate-500 mb-3">Sign in to save courses</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : loadingSaved ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center">
            <p className="text-sm text-slate-400">No saved courses yet</p>
            <Link
              href="/roi-explorer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 mt-2"
            >
              Explore ROI <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {saved.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 shadow-sm hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {COUNTRY_FLAG[course.country] ?? "🌍"}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {course.country}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(course.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Bookmark className="w-3.5 h-3.5" fill="currentColor" />
                  </button>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-1">
                    {course.college_name}
                  </p>
                  {course.field_name && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {course.field_name}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  {course.tuition ? (
                    <span className="text-xs text-slate-500">
                      {CURRENCY_SYMBOL[course.country] ?? "$"}
                      {Math.round(course.tuition).toLocaleString()}/yr
                    </span>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={`/roi-explorer/${course.course_id}?country=${course.country.toLowerCase()}`}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Jump back in */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Jump back in
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group flex flex-col gap-3 border rounded-2xl p-5 transition-all duration-200 hover:scale-105 hover:shadow-md ${card.accent}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${card.iconBg}`}>
                {card.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{card.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Insight */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <p className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
          💡 Did you know?
        </p>
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          Irish CS graduates earn €45k on average.
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          Regional universities offer 2× better ROI than Dublin universities
          — backed by HEA graduate outcome data.
        </p>
        <Link
          href="/roi-explorer?country=ie"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Explore Ireland ROI
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  )
}
