"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Compass, FileCheck2, Lightbulb, Settings, Sparkles, Trophy, UserRound } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { majorLabel, resolveView } from "@/lib/degree-risk"

type Preferences = {
  field: string | null
  goal: string | null
  recommended_country: string | null
  completed_at: string | null
}

const goalLabels: Record<string, string> = {
  study: "Study quality",
  visa: "Post-study work",
  pr: "Long-term pathway",
}

type DegreeRiskAssessment = {
  id: string
  major_pref: string
  country_pref: string
  primary_goal: string
}

export default function ProfilePage() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [savedCareers, setSavedCareers] = useState(0)
  const [savedProviders, setSavedProviders] = useState(0)
  const [programmeComplete, setProgrammeComplete] = useState(false)
  const [evidenceCount, setEvidenceCount] = useState(0)
  const [reputationPoints, setReputationPoints] = useState(0)
  const [riskAssessment, setRiskAssessment] = useState<DegreeRiskAssessment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile(userId: string) {
      const [preferenceResult, careerResult, providerResult, programmeResult, evidenceResult, reputationResult, assessmentResult] = await Promise.all([
        supabase
          .from("user_preferences")
          .select("field, goal, recommended_country, completed_at")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("saved_occupations")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("saved_universities")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase.from("program_completions").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("program_id", "research-foundation-v1"),
        supabase.from("programme_evidence").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("reputation_ledger").select("points").eq("user_id", userId),
        supabase.from("assessments").select("id, major_pref, country_pref, primary_goal").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ])

      if (!active) return
      setPreferences((preferenceResult.data as Preferences | null) ?? null)
      setSavedCareers(careerResult.count ?? 0)
      setSavedProviders(providerResult.count ?? 0)
      setProgrammeComplete((programmeResult.count ?? 0) > 0)
      setEvidenceCount(evidenceResult.count ?? 0)
      setReputationPoints((reputationResult.data ?? []).reduce((sum, row) => sum + (Number(row.points) || 0), 0))
      setRiskAssessment((assessmentResult.data as DegreeRiskAssessment | null) ?? null)
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
        setSavedCareers(0)
        setSavedProviders(0)
        setProgrammeComplete(false)
        setEvidenceCount(0)
        setReputationPoints(0)
        setRiskAssessment(null)
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) return <ProfileSkeleton />
  if (!user) return <GuestProfile />

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const displayName = (user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "CampCareer member"
  const direction = preferences?.completed_at
    ? [preferences.field, preferences.goal ? goalLabels[preferences.goal] ?? preferences.goal : null]
        .filter(Boolean)
        .join(" · ")
    : "Not set yet"
  const pathLevel = evidenceCount >= 3 ? 4 : programmeComplete ? 3 : savedCareers > 0 && savedProviders > 0 ? 2 : preferences?.completed_at ? 1 : 0
  const achievements = [
    preferences?.completed_at ? "Planning direction set" : null,
    programmeComplete ? "Research Foundation completed" : null,
    evidenceCount >= 3 ? "Official evidence pack saved" : null,
    reputationPoints >= 10 ? "Community contributor" : null,
  ].filter(Boolean).slice(0, 3) as string[]
  const degreeRiskHref = riskAssessment
    ? `/degree-risk/result?${new URLSearchParams({ major: riskAssessment.major_pref, view: resolveView(riskAssessment.country_pref), goal: riskAssessment.primary_goal, aid: riskAssessment.id })}`
    : "/degree-risk"

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_42%),linear-gradient(180deg,_#ffffff,_#f7f9fc)]">
        <div className="mx-auto flex max-w-4xl flex-col justify-between gap-6 px-5 pb-9 pt-10 sm:flex-row sm:items-end sm:px-6 sm:pb-11 sm:pt-14">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-16 w-16 rounded-2xl border border-slate-200 object-cover shadow-sm" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm">
                <UserRound className="h-7 w-7" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-blue-700">Your profile</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{displayName}</h1>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <Link href="/settings" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
            <Settings className="h-4 w-4" />
            Account settings
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-5 sm:grid-cols-3">
          <ProfileStat icon={Compass} label="Planning direction" value={direction} href="/onboarding" />
          <ProfileStat icon={BriefcaseBusiness} label="Saved careers" value={`${savedCareers}`} href="/au/jobs" />
          <ProfileStat icon={BookOpen} label="Saved providers" value={`${savedProviders}`} href="/au/study" />
        </div>

        <section className="mt-6 grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[.72fr_1.28fr] sm:p-7">
          <div className="rounded-2xl bg-blue-50 p-5"><div className="flex items-center gap-2 text-blue-700"><Trophy className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.12em]">Current path level</span></div><p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{pathLevel}<span className="ml-1 text-base text-slate-400">/ 4</span></p><p className="mt-2 text-sm leading-6 text-slate-600">Based on saved planning evidence, not clicks or logins.</p></div>
          <div><p className="text-sm font-semibold text-slate-950">Representative achievements</p>{achievements.length ? <ul className="mt-3 space-y-2">{achievements.map((achievement) => <li key={achievement} className="flex items-center gap-2 text-sm text-slate-700"><BadgeCheck className="h-4 w-4 text-emerald-600" />{achievement}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-slate-500">Complete your first planning step to begin a private evidence-based path.</p>}<Link href="/profile/achievements" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">View all achievements <ArrowRight className="h-4 w-4" /></Link></div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-blue-700">Continue your plan</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">See the next useful decision.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Your dashboard turns the decisions you have already saved into one clear next step. Progress is based on planning activity, not time spent in the app.</p>
          <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link href="/profile/achievements" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"><span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-blue-600" />Planning milestones</span><ArrowRight className="h-4 w-4" /></Link>
          <Link href="/profile/contributions" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"><span className="inline-flex items-center gap-2"><Lightbulb className="h-4 w-4 text-blue-600" />Community contributions</span><ArrowRight className="h-4 w-4" /></Link>
          <Link href="/profile/programs" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"><span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-600" />Research programme</span><ArrowRight className="h-4 w-4" /></Link>
          <Link href="/profile/portfolio" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-600" />Private portfolio</span><ArrowRight className="h-4 w-4" /></Link>
          <Link href="/profile/evidence" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"><span className="inline-flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-blue-600" />Official evidence pack</span><ArrowRight className="h-4 w-4" /></Link>
          <Link href={degreeRiskHref} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"><span className="inline-flex min-w-0 items-center gap-2"><FileCheck2 className="h-4 w-4 shrink-0 text-blue-600" />{riskAssessment ? `Degree-risk: ${majorLabel(riskAssessment.major_pref)}` : "Degree-risk check"}</span><ArrowRight className="h-4 w-4 shrink-0" /></Link>
        </div>
      </section>
    </main>
  )
}

function ProfileStat({ icon: Icon, label, value, href }: { icon: typeof Compass; label: string; value: string; href: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-center gap-2 text-slate-500"><Icon className="h-4 w-4 text-blue-600" /><span className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</span></div>
      <p className="mt-3 truncate text-xl font-semibold tracking-tight text-slate-950 group-hover:text-blue-700">{value}</p>
    </Link>
  )
}

function GuestProfile() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5 py-12">
      <section className="max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><UserRound className="h-6 w-6" /></div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Keep your plan in one place.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to save careers and providers, then use your dashboard to decide what to do next.</p>
        <Link href="/login?next=/profile" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Sign in</Link>
      </section>
    </main>
  )
}

function ProfileSkeleton() {
  return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-4xl px-5 py-12 sm:px-6"><div className="h-20 animate-pulse rounded-2xl bg-slate-200" /><div className="mt-10 grid gap-5 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-slate-200" />)}</div></div></main>
}
