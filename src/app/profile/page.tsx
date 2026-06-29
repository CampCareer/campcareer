"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { Button } from "@/components/ui/button"
import { Trash2, MapPin, UserIcon, LogOut, ChevronRight } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { SA4_BY_STATE } from "@/data/sa4-regions"

type SavedOccupation = {
  id: number
  occ_code: string
  occ_title: string
  country: string
  created_at: string
}

export default function ProfilePage() {
  const t = useTranslations()
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [occupations, setOccupations] = useState<SavedOccupation[]>([])
  const [loading, setLoading] = useState(true)

  const sa4ToState = useMemo(() => {
    const map: Record<string, string> = {}
    for (const [state, regions] of Object.entries(SA4_BY_STATE)) {
      for (const r of regions) map[r.code] = state
    }
    return map
  }, [])

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
      else { setOccupations([]); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadSavedData(userId: string) {
    setLoading(true)
    const { data } = await supabase
      .from("saved_occupations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (data) setOccupations(data)
    setLoading(false)
  }

  async function removeOccupation(id: number) {
    const { error } = await supabase.from("saved_occupations").delete().eq("id", id)
    if (!error) setOccupations((prev) => prev.filter((o) => o.id !== id))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  function navUrl(occ: SavedOccupation): string {
    if (occ.country === "US") return `/map/us?occ=${occ.occ_code}`
    const state = sa4ToState[occ.occ_code]
    if (state) return `/map/au/whv/${state.toLowerCase()}/${occ.occ_code}`
    if (occ.occ_code.length === 4) return `/map/au?nero=${occ.occ_code}&tab=employment`
    return `/map/au?occ=${occ.occ_code}`
  }

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const userName = (user.user_metadata?.full_name as string) || user.user_metadata?.name as string || ""

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-10">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="w-14 h-14 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border border-slate-200">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <div>
          {userName && (
            <h1 className="text-xl font-semibold text-slate-900">{userName}</h1>
          )}
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

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

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : occupations.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">{t.profile.noSavedOccupations}</p>
            <Button variant="outline" asChild>
              <Link href="/map">{t.profile.browseMap}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {occupations.map((occ) => (
              <Link
                key={occ.id}
                href={navUrl(occ)}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 hover:bg-blue-50/40 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate group-hover:text-blue-700">
                    {occ.occ_title || occ.occ_code}
                  </p>
                  <p className="text-sm text-slate-500">
                    {occ.occ_code}
                    {occ.country ? ` · ${occ.country}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); removeOccupation(occ.id) }}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Sign Out */}
      <div className="mt-10 pt-6 border-t border-slate-200">
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t.common.signOut}
        </Button>
      </div>
    </div>
  )
}
