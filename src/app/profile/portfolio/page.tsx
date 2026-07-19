"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Download, GraduationCap, LockKeyhole, Printer, Target } from "lucide-react"
import { RESEARCH_FOUNDATION_PROGRAM_ID, RESEARCH_FOUNDATION_PROGRAM_NAME } from "@/lib/programs/research-foundation"
import { createClient } from "@/lib/supabase-client"

type Completion = { completed_at: string; evidence: { saved_careers?: number; saved_providers?: number; saved_courses?: number; verified_at?: string } }
type Preferences = { field: string | null; goal: string | null; recommended_country: string | null }
type Career = { id: number; occ_title: string; occ_code: string; country: string }
type Provider = { id: number; univ_name: string; univ_slug: string }
type Course = { id: number; course_name: string; college_name: string; field_name: string }

const goalLabel: Record<string, string> = { study: "Study quality", visa: "Post-study work", pr: "Long-term pathway" }
const countryLabel: Record<string, string> = { AU: "Australia", CA: "Canada", IE: "Ireland", UK: "United Kingdom", US: "United States" }

export default function PortfolioPage() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [completion, setCompletion] = useState<Completion | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [careers, setCareers] = useState<Career[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load(userId: string) {
      const [completionResult, preferenceResult, careerResult, providerResult, courseResult] = await Promise.all([
        supabase.from("program_completions").select("completed_at, evidence").eq("user_id", userId).eq("program_id", RESEARCH_FOUNDATION_PROGRAM_ID).maybeSingle(),
        supabase.from("user_preferences").select("field, goal, recommended_country").eq("id", userId).maybeSingle(),
        supabase.from("saved_occupations").select("id, occ_title, occ_code, country").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
        supabase.from("saved_universities").select("id, univ_name, univ_slug").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
        supabase.from("saved_courses").select("id, course_name, college_name, field_name").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
      ])
      if (!active) return
      setCompletion((completionResult.data as Completion | null) ?? null)
      setPreferences((preferenceResult.data as Preferences | null) ?? null)
      setCareers((careerResult.data as Career[] | null) ?? [])
      setProviders((providerResult.data as Provider[] | null) ?? [])
      setCourses((courseResult.data as Course[] | null) ?? [])
      setLoading(false)
    }
    async function initialise() { const { data } = await supabase.auth.getUser(); if (!active) return; const current = data.user ?? null; setUser(current); if (current) await load(current.id); else setLoading(false) }
    void initialise()
    return () => { active = false }
  }, [supabase])

  if (loading) return <Skeleton />
  if (!user) return <Guest />
  if (!completion) return <Locked />

  const name = (user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "CampCareer member"

  return <main className="min-h-screen bg-[#eef3f8] print:bg-white">
    <div className="print:hidden border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-6"><Link href="/profile/programs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Programmes</Link><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Printer className="h-4 w-4" />Print or save PDF</button></div></div>
    <article className="mx-auto my-0 max-w-4xl bg-white px-6 py-10 shadow-sm print:max-w-none print:shadow-none sm:my-8 sm:rounded-3xl sm:px-10 sm:py-12">
      <header className="border-b border-slate-200 pb-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-sm font-semibold text-blue-700">Private planning portfolio</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{name}&apos;s research foundation</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">A personal record of the study and career options you reviewed in CampCareer. This portfolio is private and does not represent an admission, visa or academic qualification.</p></div><div className="w-fit rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><div className="flex items-center gap-1.5 font-semibold"><CheckCircle2 className="h-4 w-4" />Programme completed</div><p className="mt-1 text-xs">{formatDate(completion.completed_at)}</p></div></div></header>
      <section className="mt-8 grid gap-4 sm:grid-cols-3"><Summary label="Programme" value={RESEARCH_FOUNDATION_PROGRAM_NAME} /><Summary label="Focus" value={preferences?.field || "Exploring options"} /><Summary label="Primary goal" value={goalLabel[preferences?.goal ?? ""] || "Personal plan"} /></section>
      <section className="mt-8 grid gap-6 md:grid-cols-2"><PortfolioList icon={BriefcaseBusiness} title="Career shortlist" description="Roles saved to connect study choices with work outcomes." items={careers.map((career) => ({ title: career.occ_title || career.occ_code, detail: [career.occ_code, career.country].filter(Boolean).join(" · ") }))} empty="No current saved careers. Your completion record remains private." /><PortfolioList icon={GraduationCap} title="Provider shortlist" description="Providers saved for a more concrete comparison." items={providers.map((provider) => ({ title: provider.univ_name || provider.univ_slug, detail: "Saved provider" }))} empty="No current saved providers. Your completion record remains private." /></section>
      <section className="mt-6 rounded-2xl border border-slate-200 p-5 sm:p-6"><div className="flex items-center gap-2"><Target className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Course options compared</h2></div><p className="mt-1 text-sm leading-6 text-slate-600">The foundation programme required two saved course options. The current saved list below may change as your research develops.</p>{courses.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{courses.map((course) => <li key={course.id} className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-sm font-semibold text-slate-900">{course.course_name || course.field_name || "Saved course"}</p><p className="mt-1 text-xs text-slate-500">{course.college_name || "Provider under review"}{course.field_name && course.course_name ? ` · ${course.field_name}` : ""}</p></li>)}</ul> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No current course options saved.</p>}</section>
      <section className="mt-8 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500"><p><strong className="text-slate-700">Verification record.</strong> At completion, CampCareer checked one completed direction, at least {completion.evidence.saved_careers ?? 1} saved career, {completion.evidence.saved_providers ?? 1} saved provider and {completion.evidence.saved_courses ?? 2} saved courses. This is a private planning record, not independently verified external evidence.</p><p className="mt-2">Generated on {formatDate(new Date().toISOString())}. Keep this document private; it may contain your planning preferences.</p></section>
    </article>
  </main>
}

function Summary({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{value}</p></div> }
function PortfolioList({ icon: Icon, title, description, items, empty }: { icon: typeof BriefcaseBusiness; title: string; description: string; items: Array<{ title: string; detail: string }>; empty: string }) { return <section className="rounded-2xl border border-slate-200 p-5 sm:p-6"><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">{title}</h2></div><p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>{items.length ? <ul className="mt-4 space-y-3">{items.map((item) => <li key={`${item.title}-${item.detail}`} className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p></li>)}</ul> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{empty}</p>}</section> }
function formatDate(value: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) }
function Guest() { return <main className="flex min-h-[70vh] items-center justify-center bg-[#eef3f8] px-5"><section className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm"><Download className="mx-auto h-7 w-7 text-blue-600" /><h1 className="mt-4 text-2xl font-semibold text-slate-950">Your portfolio stays private.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Sign in to access a completed programme portfolio.</p><Link href="/login?next=/profile/portfolio" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Sign in</Link></section></main> }
function Locked() { return <main className="flex min-h-[70vh] items-center justify-center bg-[#eef3f8] px-5"><section className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm"><LockKeyhole className="mx-auto h-7 w-7 text-slate-400" /><h1 className="mt-4 text-2xl font-semibold text-slate-950">Portfolio locked</h1><p className="mt-2 text-sm leading-6 text-slate-600">Complete the Research Foundation programme to unlock a private portfolio.</p><Link href="/profile/programs" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">View programme</Link></section></main> }
function Skeleton() { return <main className="min-h-screen bg-[#eef3f8]"><div className="mx-auto max-w-4xl px-6 py-12"><div className="h-[680px] animate-pulse rounded-3xl bg-slate-200" /></div></main> }
