"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Compass, Route, Settings, Sparkles } from "lucide-react"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { getLaunchCountry } from "@/data/launch-countries"
import { countryDisplayName, localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { createClient } from "@/lib/supabase-client"

type Preferences = {
  target_country: string | null
  target_occupation: string | null
  career_personalisation_completed_at: string | null
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
          .select("target_country,target_occupation,career_personalisation_completed_at")
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
  const countryLabel = preferences?.target_country
    ? countryDisplayName(locale, preferences.target_country, country?.name ?? preferences.target_country)
    : null
  const careerLabel = career ? (isKo ? career.labelKo : career.label) : preferences?.target_occupation ?? null
  const hasDirection = Boolean(preferences?.career_personalisation_completed_at && (countryLabel || careerLabel))
  const homeHref = localizePath("/home", locale)
  const onboardingHref = localizePath("/onboarding", locale)

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-[#e7e7e3] bg-[#f7f7f6]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 py-10 sm:flex-row sm:items-end sm:px-8 sm:py-12">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="size-14 rounded-2xl border border-slate-200 bg-white object-cover shadow-sm" />
            ) : (
              <div className="grid size-14 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-lg font-semibold text-blue-700 shadow-sm" aria-hidden="true">{initial}</div>
            )}
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-blue-700">{isKo ? "프로필" : "PROFILE"}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{displayName}</h1>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <Link href={localizePath("/settings", locale)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">
            <Settings className="size-4" />
            {isKo ? "계정 관리" : "Manage account"}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="border-b border-slate-200 pb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-blue-700">{isKo ? "현재 방향" : "CURRENT DIRECTION"}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{hasDirection ? (isKo ? "지금 탐색 중인 해외 커리어" : "Your global career direction") : (isKo ? "먼저 탐색할 방향을 정해보세요" : "Choose a direction to start exploring")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{hasDirection ? (isKo ? "내 조건에 맞는 취업시장, 비자, 교육 경로를 이 방향에서 이어서 확인할 수 있어요." : "Continue from this direction to compare job markets, visas and study routes that fit your profile.") : (isKo ? "국가와 하고 싶은 일을 선택하면 개인화된 해외 커리어 탐색을 시작할 수 있어요." : "Choose a country and the work you want to do to start a personalised global-career search.")}</p>
            </div>
            <Link href={hasDirection ? homeHref : onboardingHref} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              {hasDirection ? (isKo ? "워크스페이스 열기" : "Open workspace") : (isKo ? "방향 설정하기" : "Set my direction")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {hasDirection && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DirectionTile icon={Compass} label={isKo ? "희망 국가" : "Destination"} value={countryLabel ?? (isKo ? "아직 정하지 않음" : "Not decided yet")} />
              <DirectionTile icon={BriefcaseBusiness} label={isKo ? "희망 직업" : "Career"} value={careerLabel ?? (isKo ? "아직 정하지 않음" : "Not decided yet")} />
            </div>
          )}
        </section>

        <section className="pt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-blue-700">{isKo ? "저장한 탐색" : "SAVED RESEARCH"}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{isKo ? "나중에 비교할 항목" : "Items to compare later"}</h2>
            </div>
            <Link href={homeHref} className="hidden items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800 sm:inline-flex">{isKo ? "새 탐색 시작" : "Explore more"}<ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ResearchCount icon={BriefcaseBusiness} label={isKo ? "저장한 직업" : "Saved jobs"} value={savedResearch.careers} />
            <ResearchCount icon={Building2} label={isKo ? "저장한 기관" : "Saved institutions"} value={savedResearch.institutions} />
            <ResearchCount icon={Route} label={isKo ? "저장한 경로" : "Saved routes"} value={savedResearch.routes} />
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-[#fafbfc] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3"><Bookmark className="mt-0.5 size-5 shrink-0 text-blue-600" /><p className="text-sm leading-6 text-slate-600">{isKo ? "저장한 항목은 아직 확정이 아니에요. 홈에서 국가, 비자, 직업, 프로그램, 기관을 다시 비교하며 다음 결정을 이어가세요." : "Saved items are not commitments. Use Home to compare countries, visas, jobs, programs and institutions before your next decision."}</p></div>
            <Link href={homeHref} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800">{isKo ? "홈으로 가기" : "Go to Home"}<ArrowRight className="size-4" /></Link>
          </div>
        </section>

        <section className="mt-8 border-t border-slate-200 pt-8">
          <div className="flex items-start justify-between gap-5 rounded-2xl bg-[#f7f7f6] p-5 sm:p-6">
            <div><p className="text-sm font-semibold text-slate-950">{isKo ? "계정 설정" : "Account settings"}</p><p className="mt-1 text-sm leading-6 text-slate-600">{isKo ? "표시 이름, 개인정보와 이 브라우저의 로그인 상태를 관리할 수 있어요." : "Manage your display name, privacy preferences and this browser session."}</p></div>
            <Link href={localizePath("/settings", locale)} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800">{isKo ? "관리" : "Manage"}<ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </section>
    </main>
  )
}

function DirectionTile({ icon: Icon, label, value }: { icon: typeof Compass; label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-slate-500"><Icon className="size-4 text-blue-600" /><span className="text-xs font-semibold tracking-[0.12em]">{label}</span></div><p className="mt-3 text-lg font-semibold text-slate-950">{value}</p></div>
}

function ResearchCount({ icon: Icon, label, value }: { icon: typeof BriefcaseBusiness; label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="size-5 text-blue-600" /><p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-sm font-medium text-slate-600">{label}</p></div>
}

function GuestProfile({ locale }: { locale: "en" | "ko" }) {
  const isKo = locale === "ko"
  const profilePath = localizePath("/profile", locale)
  return <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 py-12"><section className="max-w-md rounded-2xl border border-slate-200 bg-[#fafbfc] p-7 text-center sm:p-9"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Sparkles className="size-5" /></div><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{isKo ? "나의 해외 커리어 탐색을 한곳에" : "Keep your global-career research together."}</h1><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "로그인하면 내 방향과 저장한 탐색을 이어서 볼 수 있어요." : "Sign in to return to your direction and saved research."}</p><Link href={`${localizePath("/login", locale)}?next=${encodeURIComponent(profilePath)}`} className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "로그인" : "Log in"}</Link></section></main>
}

function ProfileSkeleton() {
  return <main className="min-h-screen bg-white"><div className="mx-auto max-w-6xl space-y-7 px-5 py-12 sm:px-8"><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /><div className="h-48 animate-pulse rounded-2xl bg-slate-100" /><div className="grid gap-3 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-slate-100" />)}</div></div></main>
}
