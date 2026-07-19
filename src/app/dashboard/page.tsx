"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleCheck,
  Compass,
  FileCheck2,
  GraduationCap,
  LineChart,
  LockKeyhole,
  MapPin,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { majorLabel, resolveView } from "@/lib/degree-risk"
import { cn } from "@/lib/utils"

type Preferences = {
  field: string | null
  goal: string | null
  budget: string | null
  english: string | null
  environment: string | null
  recommended_country: string | null
  completed_at: string | null
}

type SavedOccupation = {
  id: number
  occ_code: string
  occ_title: string
  country: string
}

type SavedUniversity = {
  id: number
  univ_slug: string
  univ_name: string
}

type ProgrammeEvidence = { programme_key: string; evidence_type: string }
type DegreeRiskAssessment = {
  id: string
  major_pref: string
  country_pref: string
  primary_goal: string
  created_at: string
}

type JourneyStep = {
  title: string
  description: string
  complete: boolean
}

type NextAction = {
  eyebrow: string
  title: string
  description: string
  completeWhen: string[]
  href: string
  label: string
  icon: typeof Compass
}

const goalLabel: Record<string, string> = {
  study: "Study quality",
  visa: "Post-study work",
  pr: "Long-term pathway",
}

const countryLabel: Record<string, string> = {
  AU: "Australia",
  CA: "Canada",
  IE: "Ireland",
  UK: "United Kingdom",
  US: "United States",
}

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [occupations, setOccupations] = useState<SavedOccupation[]>([])
  const [universities, setUniversities] = useState<SavedUniversity[]>([])
  const [courseCount, setCourseCount] = useState(0)
  const [foundationComplete, setFoundationComplete] = useState(false)
  const [evidence, setEvidence] = useState<ProgrammeEvidence[]>([])
  const [riskAssessment, setRiskAssessment] = useState<DegreeRiskAssessment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadDashboard(userId: string) {
      const [preferenceResult, occupationResult, universityResult, courseResult, completionResult, evidenceResult, assessmentResult] = await Promise.all([
        supabase
          .from("user_preferences")
          .select("field, goal, budget, english, environment, recommended_country, completed_at")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("saved_occupations")
          .select("id, occ_code, occ_title, country")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("saved_universities")
          .select("id, univ_slug, univ_name")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase.from("saved_courses").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("program_completions").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("program_id", "research-foundation-v1"),
        supabase.from("programme_evidence").select("programme_key, evidence_type").eq("user_id", userId),
        supabase.from("assessments").select("id, major_pref, country_pref, primary_goal, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ])

      if (!active) return
      setPreferences((preferenceResult.data as Preferences | null) ?? null)
      setOccupations((occupationResult.data as SavedOccupation[] | null) ?? [])
      setUniversities((universityResult.data as SavedUniversity[] | null) ?? [])
      setCourseCount(courseResult.count ?? 0)
      setFoundationComplete((completionResult.count ?? 0) > 0)
      setEvidence((evidenceResult.data as ProgrammeEvidence[] | null) ?? [])
      setRiskAssessment((assessmentResult.data as DegreeRiskAssessment | null) ?? null)
      setLoading(false)
    }

    async function claimDeferredAssessment() {
      try {
        const assessmentId = window.localStorage.getItem("cc_last_aid")
        if (!assessmentId) return
        const response = await fetch("/api/degree-risk/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentId }),
        })
        if (response.ok) window.localStorage.removeItem("cc_last_aid")
      } catch {
        // Keep the local id for a later signed-in dashboard visit.
      }
    }

    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await claimDeferredAssessment()
        await loadDashboard(currentUser.id)
      }
      else setLoading(false)
    }

    void initialise()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        setLoading(true)
        void (async () => {
          await claimDeferredAssessment()
          await loadDashboard(currentUser.id)
        })()
      } else {
        setPreferences(null)
        setOccupations([])
        setUniversities([])
        setCourseCount(0)
        setFoundationComplete(false)
        setEvidence([])
        setRiskAssessment(null)
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) return <DashboardSkeleton />
  if (!user) return <GuestDashboard />

  const hasDirection = Boolean(preferences?.completed_at)
  const hasCareer = occupations.length > 0
  const hasProvider = universities.length > 0
  const hasCourseComparison = courseCount >= 2
  const evidenceByProgramme = evidence.reduce<Record<string, Set<string>>>((result, item) => { (result[item.programme_key] ??= new Set()).add(item.evidence_type); return result }, {})
  const hasEvidencePack = Object.values(evidenceByProgramme).some((types) => types.size >= 3)
  const stages = { explore: hasDirection, shortlist: hasCareer && hasProvider && hasCourseComparison, verify: hasEvidencePack, plan: foundationComplete && hasEvidencePack, apply: false, career: hasCareer }
  const completedCount = Object.values(stages).filter(Boolean).length
  const progress = Math.round((completedCount / 6) * 100)
  const nextAction = getNextAction({ hasDirection, hasCareer, hasProvider, hasCourseComparison, foundationComplete, hasEvidencePack })
  const steps: JourneyStep[] = [
    { title: "Explore", description: "Country, goal and field direction.", complete: stages.explore },
    { title: "Shortlist", description: "Career, provider and course options saved.", complete: stages.shortlist },
    { title: "Verify", description: "Official source links saved for one programme.", complete: stages.verify },
    { title: "Plan", description: "Research Foundation completion recorded.", complete: stages.plan },
    { title: "Apply", description: "Application evidence will be added when ready.", complete: stages.apply },
    { title: "Career", description: "Career signal connected to the plan.", complete: stages.career },
  ]
  const displayName = (user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "there"
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const NextIcon = nextAction.icon
  const riskResultHref = riskAssessment
    ? `/degree-risk/result?${new URLSearchParams({ major: riskAssessment.major_pref, view: resolveView(riskAssessment.country_pref), goal: riskAssessment.primary_goal, aid: riskAssessment.id })}`
    : "/degree-risk"

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_42%),linear-gradient(180deg,_#ffffff,_#f7f9fc)]">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-700">CampCareer Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your next step, {displayName}.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Turn country research into a study and career plan. Your progress is based on useful decisions—not daily logins.</p>
            </div>
            <div className="flex flex-wrap gap-2"><Link href="/degree-risk" className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:self-auto">Get policy alerts <ArrowRight className="h-4 w-4" /></Link><Link href="/profile" className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:self-auto">{avatarUrl ? <img src={avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" /> : <UserRound className="h-4 w-4" />}View profile<ChevronRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
          <article className="overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-[0_16px_42px_rgba(15,23,42,.08)]">
            <div className="border-b border-blue-100 bg-blue-50/70 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700"><Sparkles className="h-4 w-4" />{nextAction.eyebrow}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{nextAction.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{nextAction.description}</p>
            </div>
            <div className="p-6 sm:p-7">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"><NextIcon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">Move on when you have:</p>
                  <ul className="mt-3 space-y-2.5">
                    {nextAction.completeWhen.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-slate-600"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300"><Check className="h-2.5 w-2.5 text-slate-400" /></span>{item}</li>)}
                  </ul>
                </div>
              </div>
              <Link href={nextAction.href} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                {nextAction.label}<ArrowRight className="h-4 w-4" />
              </Link>
              <details className="mt-4 text-sm text-slate-600">
                <summary className="w-fit cursor-pointer font-semibold text-blue-700 hover:text-blue-800">Why this matters?</summary>
                <p className="mt-2 max-w-2xl leading-6">Each step creates a decision you can revisit: a direction, a real shortlist, official sources, and then a private plan. It is deliberately not a score for browsing or logging in.</p>
              </details>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-slate-950">Path progress</p><p className="mt-1 text-sm text-slate-500">Explore → Shortlist → Verify → Plan → Apply → Career</p></div><span className="text-2xl font-semibold tracking-tight text-slate-950">{progress}%</span></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} /></div>
            <ol className="mt-6 space-y-4">
              {steps.map((step, index) => <li key={step.title} className="flex gap-3"><span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold", step.complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>{step.complete ? <CircleCheck className="h-4 w-4" /> : index + 1}</span><div><p className={cn("text-sm font-semibold", step.complete ? "text-slate-950" : "text-slate-700")}>{step.title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{step.description}</p></div></li>)}
            </ol>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-2"><Target className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Your current direction</h2></div>
            {hasDirection ? (
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Detail label="Goal" value={goalLabel[preferences?.goal ?? ""] ?? "Personal plan"} />
                <Detail label="Field" value={preferences?.field || "Still exploring"} />
                <Detail label="Country" value={countryLabel[preferences?.recommended_country ?? ""] ?? "Comparing options"} />
              </dl>
            ) : (
              <EmptyState icon={Compass} text="Complete the short planning check-in to create a starting direction." href="/onboarding" label="Start planning" />
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-2"><LineChart className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Your shortlist</h2></div>
            {hasCareer || hasProvider ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <SavedList icon={MapPin} title="Careers" items={occupations.map((occupation) => occupation.occ_title || occupation.occ_code)} empty="No saved careers yet" href="/au/jobs" />
                <SavedList icon={GraduationCap} title="Providers" items={universities.map((university) => university.univ_name || university.univ_slug)} empty="No saved providers yet" href="/au/study" />
              </div>
            ) : (
              <EmptyState icon={Target} text="Save a career or provider to turn research into a comparable shortlist." href="/au/majors" label="Explore majors" />
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Your degree-risk check</h2></div>
            {riskAssessment ? (
              <div className="mt-5 rounded-2xl bg-blue-50 p-4">
                <p className="text-sm font-semibold text-slate-950">{majorLabel(riskAssessment.major_pref)} · {riskAssessment.country_pref}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Saved {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(riskAssessment.created_at))}. This is your private decision check, not an admissions or visa outcome.</p>
                <Link href={riskResultHref} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">Open saved result <ArrowRight className="h-4 w-4" /></Link>
              </div>
            ) : (
              <EmptyState icon={FileCheck2} text="Score one major against work, visa, market, AI and ROI signals, then keep the result in your private plan." href="/degree-risk" label="Check degree risk" />
            )}
          </section>
        </div>

        <aside className="mt-6 rounded-3xl border border-amber-200 bg-amber-50/70 p-5 text-sm leading-6 text-amber-950 sm:px-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><p className="font-semibold">Evidence, not XP</p><p className="mt-1 text-amber-900">Path level is based on saved planning evidence. Official links improve your own Verify pack; they are not represented as CampCareer or regulator approval.</p></div>
            <Link href="/profile/achievements" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-amber-900 hover:text-amber-950">View milestones <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </aside>
      </section>
    </main>
  )
}

function getNextAction({ hasDirection, hasCareer, hasProvider, hasCourseComparison, foundationComplete, hasEvidencePack }: { hasDirection: boolean; hasCareer: boolean; hasProvider: boolean; hasCourseComparison: boolean; foundationComplete: boolean; hasEvidencePack: boolean }): NextAction {
  if (!hasDirection) return {
    eyebrow: "Start your plan",
    title: "Choose your study direction",
    description: "A five-question check-in gives your dashboard a goal, budget and starting country to work from.",
    completeWhen: ["Choose your main goal", "Set a realistic budget range", "Receive a starting country direction"],
    href: "/onboarding",
    label: "Start the check-in",
    icon: Compass,
  }
  if (!hasCareer) return {
    eyebrow: "Step 2 of 3",
    title: "Save one career you would genuinely consider",
    description: "A field becomes useful when you can connect it to a role, its work conditions and its demand signals.",
    completeWhen: ["Explore a relevant major category", "Open a career or occupation you would consider", "Save it to your shortlist"],
    href: "/au/jobs",
    label: "Explore Australian careers",
    icon: Target,
  }
  if (!hasProvider) return {
    eyebrow: "Step 3 of 3",
    title: "Add a provider to your shortlist",
    description: "Compare a real provider before you treat a course title, tuition estimate or ranking as a decision.",
    completeWhen: ["Search a field or state", "Review tuition and graduate-outcome context", "Save one provider to compare later"],
    href: "/au/study",
    label: "Browse Australian providers",
    icon: GraduationCap,
  }
  if (!hasCourseComparison) return {
    eyebrow: "Shortlist step",
    title: "Compare two real course options",
    description: "A provider name is not enough. Save two course options so fees, requirements and career outcomes can be compared.",
    completeWhen: ["Save a first course option", "Save a second course option", "Review the trade-off you would make"],
    href: "/roi-explorer",
    label: "Compare courses",
    icon: LineChart,
  }
  if (!hasEvidencePack) return {
    eyebrow: "Verify step",
    title: "Save official evidence for one programme",
    description: "Your shortlist still needs the official course, registration and fee sources behind a real decision.",
    completeWhen: ["Official course page", "CRICOS, registration or regulator source", "Tuition or entry-requirement source"],
    href: "/profile/evidence",
    label: "Verify programmes",
    icon: FileCheck2,
  }
  if (!foundationComplete) return {
    eyebrow: "Plan step",
    title: "Confirm your research foundation",
    description: "Your direction, shortlist and official sources are ready. Confirm a server-checked completion record before you create a portfolio.",
    completeWhen: ["One planning direction", "A career and provider shortlist", "Official evidence saved for one programme"],
    href: "/profile/programs",
    label: "Confirm programme",
    icon: Target,
  }
  return {
    eyebrow: "Evidence-ready plan",
    title: "Use your private portfolio to plan the application",
    description: "You now have a documented research base. Keep the next application decisions private and evidence-led.",
    completeWhen: ["Review the programme evidence pack", "Print or save your portfolio", "Set the first application deadline"],
    href: "/profile/portfolio",
    label: "Open portfolio",
    icon: FileCheck2,
  }
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 px-3.5 py-3"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 truncate text-sm font-semibold text-slate-900" title={value}>{value}</dd></div>
}

function SavedList({ icon: Icon, title, items, empty, href }: { icon: typeof MapPin; title: string; items: string[]; empty: string; href: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Icon className="h-4 w-4 text-blue-600" />{title}</div>{items.length ? <ul className="mt-3 space-y-2">{items.slice(0, 2).map((item) => <li key={item} className="truncate text-sm text-slate-600" title={item}>{item}</li>)}</ul> : <p className="mt-3 text-sm text-slate-500">{empty}</p>}<Link href={href} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">Manage shortlist <ArrowRight className="h-3.5 w-3.5" /></Link></div>
}

function EmptyState({ icon: Icon, text, href, label }: { icon: typeof Compass; text: string; href: string; label: string }) {
  return <div className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="flex gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" /><div><p className="text-sm leading-6 text-slate-600">{text}</p><Link href={href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">{label}<ArrowRight className="h-4 w-4" /></Link></div></div></div>
}

function GuestDashboard() {
  return <main className="min-h-screen bg-[#f7f9fc]"><section className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><LockKeyhole className="h-6 w-6" /></div><p className="mt-6 text-sm font-semibold text-blue-700">CampCareer Dashboard</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Make your next move clearer.</h1><p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">Save your direction, careers and providers in one private workspace. Your next step is based on what you have already decided—not a generic checklist.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Sign in to start <ArrowRight className="h-4 w-4" /></Link><Link href="/au/majors" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">Explore majors</Link></div></section></main>
}

function DashboardSkeleton() {
  return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-6xl px-5 py-14 sm:px-6"><div className="h-5 w-36 animate-pulse rounded bg-slate-200" /><div className="mt-3 h-10 w-80 max-w-full animate-pulse rounded bg-slate-200" /><div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]"><div className="h-80 animate-pulse rounded-3xl bg-slate-200" /><div className="h-80 animate-pulse rounded-3xl bg-slate-200" /></div></div></main>
}
