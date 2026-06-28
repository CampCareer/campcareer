"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { Button } from "@/components/ui/button"
import { Trash2, MapPin, BookOpen } from "lucide-react"
import type { User } from "@supabase/supabase-js"

type SavedOccupation = {
  id: number
  occ_code: string
  occ_title: string
  country: string
  created_at: string
}

type SavedCourse = {
  id: number
  course_id: string
  course_name: string
  college_name: string
  field_name: string
  country: string
  tuition: number | null
  created_at: string
}

export default function ProfilePage() {
  const t = useTranslations()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [occupations, setOccupations] = useState<SavedOccupation[]>([])
  const [courses, setCourses] = useState<SavedCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user ?? null
      setUser(u)
      if (u) loadSavedData(u.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadSavedData(u.id)
      else { setOccupations([]); setCourses([]); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadSavedData(userId: string) {
    setLoading(true)
    const [occRes, courseRes] = await Promise.all([
      supabase
        .from("saved_occupations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("saved_courses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ])
    if (occRes.data) setOccupations(occRes.data)
    if (courseRes.data) setCourses(courseRes.data)
    setLoading(false)
  }

  async function removeOccupation(id: number) {
    const { error } = await supabase.from("saved_occupations").delete().eq("id", id)
    if (!error) setOccupations((prev) => prev.filter((o) => o.id !== id))
  }

  async function removeCourse(id: number) {
    const { error } = await supabase.from("saved_courses").delete().eq("id", id)
    if (!error) setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
        {t.profile.pageTitle}
      </h1>
      <p className="text-slate-500 text-sm mb-8">{user.email}</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Saved Occupations */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-800">
                {t.profile.savedOccupations}
              </h2>
              {occupations.length > 0 && (
                <span className="text-sm text-slate-400">
                  ({occupations.length}{" "}
                  {occupations.length === 1
                    ? t.profile.occupationSingle
                    : t.profile.occupationCount})
                </span>
              )}
            </div>
            {occupations.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <p className="text-slate-500 mb-3">{t.profile.noSavedOccupations}</p>
                <Button variant="outline" asChild>
                  <Link href="/map">{t.profile.browseMap}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {occupations.map((occ) => (
                  <div
                    key={occ.id}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{occ.occ_title || occ.occ_code}</p>
                      <p className="text-sm text-slate-500">
                        {occ.occ_code}
                        {occ.country ? ` · ${occ.country}` : ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOccupation(occ.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Saved Courses */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-slate-800">
                {t.profile.savedCourses}
              </h2>
              {courses.length > 0 && (
                <span className="text-sm text-slate-400">
                  ({courses.length} {t.saved.courseSingle})
                </span>
              )}
            </div>
            {courses.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <p className="text-slate-500 mb-3">{t.profile.noSavedCourses}</p>
                <Button variant="outline" asChild>
                  <Link href="/roi-explorer">{t.profile.browseRoi}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {course.course_name || course.field_name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {course.college_name}
                        {course.country ? ` · ${course.country}` : ""}
                        {course.tuition != null
                          ? ` · $${course.tuition.toLocaleString()}`
                          : ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCourse(course.id)}
                      className="text-slate-400 hover:text-red-500 shrink-0 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
