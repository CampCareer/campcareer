'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, ExternalLink, Trash2, ArrowRight, GitCompare } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { useTranslations } from "@/lib/i18n/locale-provider"
import type { User } from "@supabase/supabase-js"

type SavedCourse = {
  id: string
  country: string
  course_id: string
  college_name: string
  field_name: string | null
  tuition: number | null
  created_at: string
}

const COUNTRY_FLAG: Record<string, string> = {
  US: "🇺🇸", AU: "🇦🇺", CA: "🇨🇦", UK: "🇬🇧", IE: "🇮🇪",
}

const CURRENCY_SYMBOL: Record<string, string> = {
  US: "$", AU: "A$", CA: "C$", UK: "£", IE: "€",
}

const COUNTRY_OPTIONS = ["ALL", "US", "AU", "CA", "UK", "IE"] as const

export default function SavedPage() {
  const supabase = createClient()
  const t = useTranslations()
  const ts = t.saved
  const [user, setUser] = useState<User | null>(null)
  const [saved, setSaved] = useState<SavedCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("ALL")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase
      .from("saved_courses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSaved(data ?? [])
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleRemove(id: string) {
    await supabase.from("saved_courses").delete().eq("id", id)
    setSaved((prev) => prev.filter((s) => s.id !== id))
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next })
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const filtered = filter === "ALL" ? saved : saved.filter((s) => s.country === filter)
  const selectedCourses = saved.filter((s) => selected.has(s.id))

  // 비교 URL 생성 (/compare 페이지로 국가 파라미터 전달)
  const compareCountries = Array.from(new Set(selectedCourses.map((s) => s.country.toLowerCase())))
  const compareHref = compareCountries.length > 0
    ? `/compare?countries=${compareCountries.join(",")}`
    : "/compare"

  if (!user && !loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900 mb-2">{ts.signInTitle}</h1>
        <p className="text-sm text-slate-500 mb-6">{ts.signInDesc}</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          {ts.signInButton} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-blue-500" />
            {ts.pageTitle}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {saved.length} {ts.courseCount}
          </p>
        </div>

        {/* 비교 버튼 */}
        {selected.size >= 2 && (
          <Link
            href={compareHref}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shrink-0"
          >
            <GitCompare className="w-4 h-4" />
            {ts.compareButton} ({selected.size})
          </Link>
        )}
      </div>

      {/* 국가 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        {COUNTRY_OPTIONS.map((c) => {
          const count = c === "ALL" ? saved.length : saved.filter((s) => s.country === c).length
          if (c !== "ALL" && count === 0) return null
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === c
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {c === "ALL" ? ts.filterAll : `${COUNTRY_FLAG[c]} ${c}`}
              <span className={`ml-1.5 ${filter === c ? "text-blue-200" : "text-slate-400"}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 선택 안내 */}
      {saved.length > 0 && selected.size < 2 && (
        <p className="text-xs text-slate-400">
          {ts.selectHint}
        </p>
      )}

      {/* 로딩 */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && filtered.length === 0 && (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 mb-1">{ts.emptyTitle}</p>
          <Link
            href="/roi-explorer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
          >
            {ts.emptyLink} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* 코스 그리드 */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => {
            const isSelected = selected.has(course.id)
            return (
              <div
                key={course.id}
                onClick={() => toggleSelect(course.id)}
                className={`bg-white border-2 rounded-2xl p-5 flex flex-col gap-3 shadow-sm cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 shadow-blue-100 shadow-md"
                    : "border-slate-200 hover:border-blue-200"
                }`}
              >
                {/* 상단 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{COUNTRY_FLAG[course.country] ?? "🌍"}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {course.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">✓</span>
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(course.id) }}
                      className="p-1 text-slate-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 대학/전공 */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                    {course.college_name}
                  </p>
                  {course.field_name && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{course.field_name}</p>
                  )}
                </div>

                {/* 하단 */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {course.tuition ? (
                    <span className="text-xs font-medium text-slate-600">
                      {CURRENCY_SYMBOL[course.country] ?? "$"}
                      {Math.round(course.tuition).toLocaleString()}/yr
                    </span>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={`/roi-explorer/${course.country.toLowerCase()}/${course.course_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {ts.viewButton} <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
