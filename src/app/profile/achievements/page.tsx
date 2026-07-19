"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpenCheck, BriefcaseBusiness, CheckCircle2, CircleDashed, Compass, FileCheck2, GraduationCap, Lightbulb, LockKeyhole, ShieldCheck, Sparkles, Target } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

type Preferences = {
  completed_at: string | null
}

type DegreeRiskAssessment = { id: string }

type Milestone = {
  id: string
  title: string
  description: string
  verification: string
  complete: boolean
  href: string
  actionLabel: string
  icon: typeof Compass
}

export default function AchievementsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [savedCareers, setSavedCareers] = useState(0)
  const [savedProviders, setSavedProviders] = useState(0)
  const [savedCourses, setSavedCourses] = useState(0)
  const [programmeComplete, setProgrammeComplete] = useState(false)
  const [reputationPoints, setReputationPoints] = useState(0)
  const [riskAssessment, setRiskAssessment] = useState<DegreeRiskAssessment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadMilestones(userId: string) {
      const [preferenceResult, careerResult, providerResult, courseResult, programmeResult, reputationResult, assessmentResult] = await Promise.all([
        supabase.from("user_preferences").select("completed_at").eq("id", userId).maybeSingle(),
        supabase.from("saved_occupations").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("saved_universities").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("saved_courses").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("program_completions").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("program_id", "research-foundation-v1"),
        supabase.from("reputation_ledger").select("points").eq("user_id", userId),
        supabase.from("assessments").select("id").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ])

      if (!active) return
      setPreferences((preferenceResult.data as Preferences | null) ?? null)
      setSavedCareers(careerResult.count ?? 0)
      setSavedProviders(providerResult.count ?? 0)
      setSavedCourses(courseResult.count ?? 0)
      setProgrammeComplete((programmeResult.count ?? 0) > 0)
      setReputationPoints((reputationResult.data ?? []).reduce((sum, row) => sum + (Number(row.points) || 0), 0))
      setRiskAssessment((assessmentResult.data as DegreeRiskAssessment | null) ?? null)
      setLoading(false)
    }

    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      if (currentUser) await loadMilestones(currentUser.id)
      else setLoading(false)
    }

    void initialise()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        setLoading(true)
        void loadMilestones(currentUser.id)
      } else {
        setPreferences(null)
        setSavedCareers(0)
        setSavedProviders(0)
        setSavedCourses(0)
        setProgrammeComplete(false)
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

  if (loading) return <AchievementsSkeleton />
  if (!user) return <GuestAchievements />

  const milestones: Milestone[] = [
    {
      id: "direction",
      title: "Planning foundation",
      description: "Set a study goal, budget range and initial country direction.",
      verification: "Verified from your completed planning check-in.",
      complete: Boolean(preferences?.completed_at),
      href: "/onboarding",
      actionLabel: "Set direction",
      icon: Compass,
    },
    {
      id: "degree-risk",
      title: "Degree-risk decision check",
      description: "Complete a saved comparison of one major across work, visa, market, AI and ROI signals.",
      verification: riskAssessment ? "Verified from your latest saved Degree Risk assessment." : "Complete the check while signed in, or sign in afterwards to keep it in your Dashboard.",
      complete: Boolean(riskAssessment),
      href: "/degree-risk",
      actionLabel: "Check degree risk",
      icon: FileCheck2,
    },
    {
      id: "career",
      title: "Career signal",
      description: "Save at least one occupation you would genuinely consider.",
      verification: `Verified from ${savedCareers} saved career${savedCareers === 1 ? "" : "s"}.`,
      complete: savedCareers > 0,
      href: "/au/jobs",
      actionLabel: "Explore careers",
      icon: BriefcaseBusiness,
    },
    {
      id: "provider",
      title: "Provider shortlist",
      description: "Save a university or study provider to make your options concrete.",
      verification: `Verified from ${savedProviders} saved provider${savedProviders === 1 ? "" : "s"}.`,
      complete: savedProviders > 0,
      href: "/au/study",
      actionLabel: "Explore study options",
      icon: GraduationCap,
    },
    {
      id: "comparison",
      title: "Course comparison",
      description: "Save two or more real course options before deciding on a provider.",
      verification: `Verified from ${savedCourses} saved course${savedCourses === 1 ? "" : "s"}; two are needed.`,
      complete: savedCourses >= 2,
      href: "/roi-explorer",
      actionLabel: "Compare courses",
      icon: BookOpenCheck,
    },
    {
      id: "foundation",
      title: "Research Foundation",
      description: "A private programme completion based on your direction, shortlist and two course options.",
      verification: programmeComplete ? "Verified from a server-recorded programme completion." : "Unlocks after the four foundation requirements are complete.",
      complete: programmeComplete,
      href: "/profile/programs",
      actionLabel: "Open programme",
      icon: Sparkles,
    },
    {
      id: "contributor",
      title: "Community Contributor",
      description: "Earn this through helpful reviews, corrections or official sources that pass review.",
      verification: reputationPoints >= 10 ? `Verified from ${reputationPoints} approved reputation points.` : "Requires approved contributions; submitting alone is not enough.",
      complete: reputationPoints >= 10,
      href: "/profile/contributions",
      actionLabel: "Contribute evidence",
      icon: Lightbulb,
    },
  ]

  const completed = milestones.filter((milestone) => milestone.complete).length
  const nextMilestone = milestones.find((milestone) => !milestone.complete)

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_42%),linear-gradient(180deg,_#ffffff,_#f7f9fc)]">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Profile</Link>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Planning milestones</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Progress you can explain.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">CampCareer recognises decisions backed by saved planning data—not clicks, streaks or time spent online.</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Verified now</p><p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{completed}<span className="text-lg text-slate-400"> / {milestones.length}</span></p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        {nextMilestone ? (
          <section className="rounded-3xl border border-blue-200 bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,.08)] sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"><Target className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-blue-700">Next verified milestone</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{nextMilestone.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{nextMilestone.description}</p></div></div><Link href={nextMilestone.href} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{nextMilestone.actionLabel}<ArrowRight className="h-4 w-4" /></Link></div>
          </section>
        ) : (
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-sm sm:p-7"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white"><Sparkles className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-emerald-800">Planning base complete</p><h2 className="mt-1 text-xl font-semibold tracking-tight">You have a decision-ready shortlist.</h2><p className="mt-1 text-sm leading-6 text-emerald-900">Next, validate official entry requirements and record the trade-offs you are willing to make.</p></div></div></section>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.46fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Current milestones</h2></div>
            <ol className="mt-6 space-y-4">
              {milestones.map((milestone, index) => <MilestoneRow key={milestone.id} milestone={milestone} number={index + 1} />)}
            </ol>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold text-slate-950">How verification works</h2></div><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />A milestone is calculated from a current CampCareer record you saved or completed.</li><li className="flex gap-2.5"><CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />Removing the underlying saved item also removes its current verified status.</li><li className="flex gap-2.5"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />We do not award milestones for self-reported claims or engagement activity.</li></ul></section>
            <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 shadow-sm"><div className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-amber-700" /><h2 className="text-lg font-semibold text-amber-950">What this is not</h2></div><p className="mt-3 text-sm leading-6 text-amber-900">These are private planning milestones, not qualifications, admissions evidence or a resume credential. Official-document verification and programme benefits will be introduced as separate, clearly labelled features.</p><Link href="/profile/contributions" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900 hover:text-amber-950"><Lightbulb className="h-4 w-4" />Help improve the data <ArrowRight className="h-4 w-4" /></Link></section>
          </aside>
        </div>
      </section>
    </main>
  )
}

function MilestoneRow({ milestone, number }: { milestone: Milestone; number: number }) {
  const Icon = milestone.icon
  return (
    <li className={cn("rounded-2xl border p-4 sm:p-5", milestone.complete ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-white")}>
      <div className="flex gap-3.5"><div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", milestone.complete ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500")}>{milestone.complete ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-semibold">{number}</span>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-semibold text-slate-950">{milestone.title}</h3>{milestone.complete && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">Verified</span>}</div><p className="mt-1 text-sm leading-6 text-slate-600">{milestone.description}</p><p className={cn("mt-2 text-xs leading-5", milestone.complete ? "text-emerald-800" : "text-slate-500")}><Icon className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />{milestone.verification}</p>{!milestone.complete && <Link href={milestone.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">{milestone.actionLabel}<ArrowRight className="h-3.5 w-3.5" /></Link>}</div></div>
    </li>
  )
}

function GuestAchievements() {
  return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5 py-12"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-9"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><BadgeCheck className="h-6 w-6" /></div><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Make progress you can explain.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Sign in to see private milestones based on the decisions you save.</p><Link href="/login?next=/profile/achievements" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Sign in</Link></section></main>
}

function AchievementsSkeleton() {
  return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-5xl px-5 py-12 sm:px-6"><div className="h-36 animate-pulse rounded-3xl bg-slate-200" /><div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.46fr)]"><div className="h-[520px] animate-pulse rounded-3xl bg-slate-200" /><div className="h-80 animate-pulse rounded-3xl bg-slate-200" /></div></div></main>
}
