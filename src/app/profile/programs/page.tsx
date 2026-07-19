"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, ArrowRight, BookOpenCheck, BriefcaseBusiness, CheckCircle2, CircleDashed, Compass, GraduationCap, Loader2, LockKeyhole, Sparkles } from "lucide-react"
import { RESEARCH_FOUNDATION_PROGRAM_ID, RESEARCH_FOUNDATION_PROGRAM_NAME } from "@/lib/programs/research-foundation"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

type Completion = { id: string; completed_at: string; evidence: Record<string, unknown> }
type Requirement = { label: string; complete: boolean; href: string; detail: string; icon: typeof Compass }

export default function ProgramsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [direction, setDirection] = useState(false)
  const [careers, setCareers] = useState(0)
  const [providers, setProviders] = useState(0)
  const [courses, setCourses] = useState(0)
  const [completion, setCompletion] = useState<Completion | null>(null)
  const [loading, setLoading] = useState(true)
  const [completeState, setCompleteState] = useState<"idle" | "submitting" | "error">("idle")
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    async function load(userId: string) {
      const [preferences, occupationResult, providerResult, courseResult, completionResult] = await Promise.all([
        supabase.from("user_preferences").select("completed_at").eq("id", userId).maybeSingle(),
        supabase.from("saved_occupations").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("saved_universities").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("saved_courses").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("program_completions").select("id, completed_at, evidence").eq("user_id", userId).eq("program_id", RESEARCH_FOUNDATION_PROGRAM_ID).maybeSingle(),
      ])
      if (!active) return
      setDirection(Boolean(preferences.data?.completed_at))
      setCareers(occupationResult.count ?? 0)
      setProviders(providerResult.count ?? 0)
      setCourses(courseResult.count ?? 0)
      setCompletion((completionResult.data as Completion | null) ?? null)
      setLoading(false)
    }
    async function initialise() { const { data } = await supabase.auth.getUser(); if (!active) return; const current = data.user ?? null; setUser(current); if (current) await load(current.id); else setLoading(false) }
    void initialise()
    return () => { active = false }
  }, [supabase])

  const requirements: Requirement[] = [
    { label: "Planning direction", complete: direction, href: "/onboarding", detail: "Completed planning check-in", icon: Compass },
    { label: "Career shortlist", complete: careers >= 1, href: "/au/jobs", detail: `${careers} saved career${careers === 1 ? "" : "s"}`, icon: BriefcaseBusiness },
    { label: "Provider shortlist", complete: providers >= 1, href: "/au/study", detail: `${providers} saved provider${providers === 1 ? "" : "s"}`, icon: GraduationCap },
    { label: "Course comparison", complete: courses >= 2, href: "/roi-explorer", detail: `${courses} saved course${courses === 1 ? "" : "s"} · two needed`, icon: BookOpenCheck },
  ]
  const eligible = requirements.every((requirement) => requirement.complete)

  async function confirmCompletion() {
    if (!eligible || completeState === "submitting") return
    setCompleteState("submitting"); setError("")
    try {
      const response = await fetch("/api/programs/research-foundation/complete", { method: "POST" })
      const body = await response.json().catch(() => null)
      if (!response.ok) throw new Error(body?.error || "We could not confirm the programme.")
      setCompletion(body.completion as Completion)
      setCompleteState("idle")
    } catch (reason) { setError(reason instanceof Error ? reason.message : "We could not confirm the programme."); setCompleteState("error") }
  }

  if (loading) return <Skeleton />
  if (!user) return <Guest />

  return <main className="min-h-screen bg-[#f7f9fc]">
    <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_42%),linear-gradient(180deg,_#ffffff,_#f7f9fc)]"><div className="mx-auto max-w-5xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14"><Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Profile</Link><p className="mt-8 text-sm font-semibold text-blue-700">CampCareer programmes</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Complete a plan you can stand behind.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Programme completion is based on verified planning records. It is private, not an academic credential, and does not influence admissions or visa decisions.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10"><article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-blue-100 bg-blue-50/70 p-6 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"><Sparkles className="h-6 w-6" /></div><div><p className="text-sm font-semibold text-blue-700">Foundation programme</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{RESEARCH_FOUNDATION_PROGRAM_NAME}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Turn exploration into a minimum viable study and career shortlist: direction, career, provider and two real course options.</p></div></div>{completion && <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" />Completed</span>}</div></div>
      <div className="p-6 sm:p-7"><ol className="grid gap-3 sm:grid-cols-2">{requirements.map((requirement, index) => { const Icon = requirement.icon; return <li key={requirement.label} className={cn("rounded-2xl border p-4", requirement.complete ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-white")}><div className="flex gap-3"><div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", requirement.complete ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500")}>{requirement.complete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</div><div><p className="text-sm font-semibold text-slate-950">{requirement.label}</p><p className="mt-1 text-xs leading-5 text-slate-500"><Icon className="mr-1 inline h-3.5 w-3.5" />{requirement.detail}</p>{!requirement.complete && <Link href={requirement.href} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">Complete this step <ArrowRight className="h-3.5 w-3.5" /></Link>}</div></div></li> })}</ol>
        {completion ? <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-emerald-950">Completion recorded {formatDate(completion.completed_at)}</p><p className="mt-1 text-sm leading-6 text-emerald-900">Your private portfolio is now available to print or save as a PDF.</p></div><Link href="/profile/portfolio" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Open portfolio <ArrowRight className="h-4 w-4" /></Link></div> : eligible ? <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5"><p className="font-semibold text-blue-950">Your research foundation is ready to confirm.</p><p className="mt-1 text-sm leading-6 text-blue-900">We will recheck the four records on the server, save a private evidence snapshot and unlock your portfolio.</p><button onClick={confirmCompletion} disabled={completeState === "submitting"} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{completeState === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{completeState === "submitting" ? "Verifying" : "Confirm programme completion"}</button>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}</div> : <div className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" /><p className="text-sm leading-6 text-slate-600">Complete the remaining planning requirements to unlock a private, printable portfolio. No partner, scholarship or admissions benefits are implied at this stage.</p></div>}</div>
    </article></section>
  </main>
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) }
function Guest() { return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><Sparkles className="mx-auto h-7 w-7 text-blue-600" /><h1 className="mt-4 text-2xl font-semibold text-slate-950">Build a research foundation.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Sign in to turn a completed plan into a private portfolio.</p><Link href="/login?next=/profile/programs" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Sign in</Link></section></main> }
function Skeleton() { return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-5xl px-5 py-12"><div className="h-40 animate-pulse rounded-3xl bg-slate-200" /><div className="mt-8 h-[500px] animate-pulse rounded-3xl bg-slate-200" /></div></main> }
