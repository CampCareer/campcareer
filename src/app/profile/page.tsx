"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Route, Settings } from "lucide-react"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { getLaunchCountry } from "@/data/launch-countries"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { createClient } from "@/lib/supabase-client"

type Preferences = {
  target_country: string | null
  target_occupation: string | null
}

type SavedResearch = {
  careers: number
  institutions: number
  routes: number
}

export default function ProfilePage() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [savedResearch, setSavedResearch] = useState<SavedResearch>({ careers: 0, institutions: 0, routes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile(userId: string) {
      const [preferenceResult, careersResult, institutionsResult, routesResult] = await Promise.all([
        supabase
          .from("user_preferences")
          .select("target_country,target_occupation")
          .eq("id", userId)
          .maybeSingle(),
        supabase.from("saved_career_results").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("saved_universities").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("saved_pathways").select("id", { count: "exact", head: true }).eq("user_id", userId),
      ])

      if (!active) return
      setPreferences((preferenceResult.data as Preferences | null) ?? null)
      setSavedResearch({
        careers: careersResult.count ?? 0,
        institutions: institutionsResult.count ?? 0,
        routes: routesResult.count ?? 0,
      })
      setLoading(false)
    }

    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      if (currentUser) await loadProfile(currentUser.id)
      else setLoading(false)
    }

    void initialise()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        setLoading(true)
        void loadProfile(currentUser.id)
      } else {
        setPreferences(null)
        setSavedResearch({ careers: 0, institutions: 0, routes: 0 })
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) return <ProfileSkeleton />
  if (!user) return <GuestProfile locale={locale} />

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    (isKo ? "CampCareer 회원" : "CampCareer member")
  const initial = Array.from(displayName.trim())[0]?.toLocaleUpperCase() || "C"
  const country = preferences?.target_country ? getLaunchCountry(preferences.target_country) : null
  const career = preferences?.target_occupation ? CANONICAL_CAREER_BY_ID.get(preferences.target_occupation) : null
  const countryLabel = country?.name ?? preferences?.target_country ?? null
  const careerLabel = career ? (isKo ? career.labelKo : career.label) : preferences?.target_occupation ?? null
  const careerHref = country && career
    ? localizePath(`/career?country=${encodeURIComponent(country.code)}&occupation=${encodeURIComponent(career.id)}`, locale)
    : null

  return (
    <main className="min-h-screen bg-[hsl(var(--cc-canvas))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-white">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-6 px-5 py-10 sm:flex-row sm:items-end sm:px-8 sm:py-12">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="size-14 rounded-xl border border-[hsl(var(--cc-border))] bg-white object-cover" />
            ) : (
              <div className="grid size-14 place-items-center rounded-xl border border-[hsl(var(--cc-border))] bg-[hsl(var(--brand-tint))] text-lg font-semibold text-brand" aria-hidden="true">{initial}</div>
            )}
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-brand">{isKo ? "계정" : "ACCOUNT"}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-[hsl(var(--cc-ink))]">{displayName}</h1>
              <p className="mt-1 text-sm text-[hsl(var(--cc-muted))]">{user.email}</p>
            </div>
          </div>
          <Link href={localizePath("/settings", locale)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[hsl(var(--cc-border))] bg-white px-4 py-2.5 text-sm font-semibold text-[hsl(var(--cc-ink-secondary))] transition hover:border-brand/30 hover:text-brand">
            <Settings className="size-4" /> {isKo ? "계정 설정" : "Account settings"}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="rounded-xl border border-[hsl(var(--cc-border))] bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-brand">{isKo ? "저장한 커리어" : "SAVED CAREERS"}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[hsl(var(--cc-ink))]">
                {isKo ? `${savedResearch.careers}개의 커리어를 저장했습니다` : `${savedResearch.careers} saved ${savedResearch.careers === 1 ? "career" : "careers"}`}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-muted))]">
                {isKo ? "계정은 CampCareer를 사용하기 위한 전제가 아닙니다. 가치 있는 커리어 판단을 저장하고 나중에 이어보기 위해 사용합니다." : "An account is not required to use CampCareer. It exists to retain useful career decisions and return to them later."}
              </p>
            </div>
            <Link href={localizePath("/", locale)} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              {isKo ? "커리어 탐색" : "Explore careers"} <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ResearchCount icon={BriefcaseBusiness} label={isKo ? "저장한 커리어" : "Saved careers"} value={savedResearch.careers} primary />
            <ResearchCount icon={Building2} label={isKo ? "저장한 교육기관" : "Saved providers"} value={savedResearch.institutions} />
            <ResearchCount icon={Route} label={isKo ? "저장한 경로" : "Saved paths"} value={savedResearch.routes} />
          </div>
        </section>

        {careerHref ? (
          <section className="mt-5 rounded-xl border border-[hsl(var(--cc-border))] bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.12em] text-[hsl(var(--cc-muted))]">{isKo ? "최근 커리어 맥락" : "RECENT CAREER CONTEXT"}</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-[hsl(var(--cc-ink))]">{careerLabel}</p>
                <p className="mt-1 text-sm text-[hsl(var(--cc-muted))]">{countryLabel}</p>
              </div>
              <Link href={careerHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                {isKo ? "Career Page로 돌아가기" : "Return to Career Page"} <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-5 rounded-xl border border-[hsl(var(--cc-border))] bg-white p-5 sm:p-6">
          <div className="flex gap-3">
            <Bookmark className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-semibold text-[hsl(var(--cc-ink))]">{isKo ? "Save는 보조 기능입니다" : "Save is a secondary feature"}</p>
              <p className="mt-1 text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? "먼저 공개 Score, 근거와 Path를 확인하세요. 저장은 그 판단을 유지하고 다시 찾기 위한 기능입니다." : "Review the public Score, evidence and Path first. Saving simply keeps that decision available for later."}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ResearchCount({ icon: Icon, label, value, primary = false }: { icon: typeof BriefcaseBusiness; label: string; value: number; primary?: boolean }) {
  return <div className="rounded-lg border border-[hsl(var(--cc-border))] bg-white p-4"><Icon className={primary ? "size-5 text-brand" : "size-5 text-[hsl(var(--cc-muted))]"} /><p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[hsl(var(--cc-ink))] tabular-nums">{value}</p><p className="mt-1 text-sm font-medium text-[hsl(var(--cc-muted))]">{label}</p></div>
}

function GuestProfile({ locale }: { locale: "en" | "ko" }) {
  const isKo = locale === "ko"
  const profilePath = localizePath("/profile", locale)
  return <main className="flex min-h-[70vh] items-center justify-center bg-[hsl(var(--cc-canvas))] px-5 py-12"><section className="max-w-md rounded-xl border border-[hsl(var(--cc-border))] bg-white p-7 text-center sm:p-9"><Bookmark className="mx-auto size-6 text-brand" /><h1 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[hsl(var(--cc-ink))]">{isKo ? "저장한 커리어를 다시 확인하세요" : "Return to your saved careers"}</h1><p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? "로그인은 Score를 보기 위한 조건이 아니라 저장한 판단을 유지하기 위한 기능입니다." : "Sign-in is for retaining saved decisions, not for accessing CampCareer Score."}</p><Link href={`${localizePath("/login", locale)}?next=${encodeURIComponent(profilePath)}`} className="mt-6 inline-flex rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">{isKo ? "로그인" : "Log in"}</Link></section></main>
}

function ProfileSkeleton() {
  return <main className="min-h-screen bg-[hsl(var(--cc-canvas))]"><div className="mx-auto max-w-5xl space-y-5 px-5 py-12 sm:px-8"><div className="h-24 animate-pulse rounded-xl bg-slate-100" /><div className="h-60 animate-pulse rounded-xl bg-slate-100" /></div></main>
}
