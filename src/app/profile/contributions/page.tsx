"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, Award, BadgeCheck, BookOpenText, CheckCircle2, CircleDashed, ExternalLink, Lightbulb, Loader2, MessageSquareQuote, Send, ShieldCheck, Wrench } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

type ContributionKind = "review" | "correction" | "source"
type ContributionStatus = "pending" | "approved" | "rejected"

type Contribution = {
  id: string
  kind: ContributionKind
  target_path: string
  target_label: string
  description: string
  source_url: string | null
  status: ContributionStatus
  reviewer_note: string | null
  created_at: string
  reviewed_at: string | null
}

type ReputationEvent = {
  id: string
  points: number
  created_at: string
}

const contributionOptions: Array<{ value: ContributionKind; label: string; description: string; icon: typeof MessageSquareQuote }> = [
  { value: "review", label: "Share an experience", description: "A specific study, provider or pathway experience that could help another person decide.", icon: MessageSquareQuote },
  { value: "correction", label: "Report a correction", description: "Tell us what is inaccurate, outdated or unclear on a CampCareer page.", icon: Wrench },
  { value: "source", label: "Suggest an official source", description: "Add a government, regulator or provider page that strengthens a data point.", icon: BookOpenText },
]

const statusStyle: Record<ContributionStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-slate-100 text-slate-600",
}

export default function ContributionsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [ledger, setLedger] = useState<ReputationEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [kind, setKind] = useState<ContributionKind>("review")
  const [targetPath, setTargetPath] = useState("/")
  const [targetLabel, setTargetLabel] = useState("")
  const [description, setDescription] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    let active = true
    async function loadContributions(userId: string) {
      const [contributionResult, ledgerResult] = await Promise.all([
        supabase.from("contribution_submissions").select("id, kind, target_path, target_label, description, source_url, status, reviewer_note, created_at, reviewed_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
        supabase.from("reputation_ledger").select("id, points, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      ])
      if (!active) return
      setContributions((contributionResult.data as Contribution[] | null) ?? [])
      setLedger((ledgerResult.data as ReputationEvent[] | null) ?? [])
      setLoading(false)
    }
    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      if (currentUser) await loadContributions(currentUser.id)
      else setLoading(false)
    }
    void initialise()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) { setLoading(true); void loadContributions(currentUser.id) }
      else { setContributions([]); setLedger([]); setLoading(false) }
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [supabase])

  const reputation = ledger.reduce((sum, event) => sum + event.points, 0)
  const approvedCount = contributions.filter((contribution) => contribution.status === "approved").length
  const pendingCount = contributions.filter((contribution) => contribution.status === "pending").length

  async function submitContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitState === "submitting") return
    setSubmitState("submitting")
    setSubmitError("")
    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, targetPath: targetPath.trim(), targetLabel: targetLabel.trim(), description: description.trim(), sourceUrl: sourceUrl.trim() || null }),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) throw new Error(body?.error || "We could not save your contribution.")
      const contribution = body?.contribution as Contribution | undefined
      if (contribution) setContributions((current) => [contribution, ...current])
      setDescription("")
      setSourceUrl("")
      setTargetLabel("")
      setSubmitState("success")
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not save your contribution.")
      setSubmitState("error")
    }
  }

  if (loading) return <ContributionsSkeleton />
  if (!user) return <GuestContributions />

  const tier = getTier(reputation)

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_42%),linear-gradient(180deg,_#ffffff,_#f7f9fc)]">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Profile</Link>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-blue-700">Community contributions</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Make research better for the next person.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Reputation is earned only after a helpful contribution is reviewed and approved. It never changes search rankings, recommendations or admission outcomes.</p></div><div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Private reputation</p><p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{reputation}<span className="ml-2 text-sm font-medium text-blue-700">{tier}</span></p></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.52fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Submit a contribution</h2></div><p className="mt-2 text-sm leading-6 text-slate-600">Do not include passport, visa, contact or other sensitive personal information. Your identity and contribution are not published by this first release.</p>
            <form onSubmit={submitContribution} className="mt-6 space-y-5">
              <fieldset><legend className="text-sm font-semibold text-slate-700">What would you like to contribute?</legend><div className="mt-3 grid gap-2">{contributionOptions.map((option) => { const Icon = option.icon; const selected = kind === option.value; return <label key={option.value} className={cn("flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition", selected ? "border-blue-300 bg-blue-50/70" : "border-slate-200 hover:border-slate-300")}><input className="sr-only" type="radio" name="kind" value={option.value} checked={selected} onChange={() => { setKind(option.value); setSubmitState("idle") }} /><Icon className={cn("mt-0.5 h-4 w-4 shrink-0", selected ? "text-blue-700" : "text-slate-500")} /><span><span className="block text-sm font-semibold text-slate-900">{option.label}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{option.description}</span></span></label> })}</div></fieldset>
              <div className="grid gap-4 sm:grid-cols-[1fr_.9fr]"><Field label="CampCareer page path" hint="Example: /au/jobs/electrician-general"><input required value={targetPath} onChange={(event) => { setTargetPath(event.target.value); setSubmitState("idle") }} maxLength={500} className={inputClass} /></Field><Field label="Page or topic name" hint="Optional"><input value={targetLabel} onChange={(event) => { setTargetLabel(event.target.value); setSubmitState("idle") }} maxLength={180} className={inputClass} /></Field></div>
              <Field label="Your contribution" hint="30–3,000 characters"><textarea required minLength={30} maxLength={3000} value={description} onChange={(event) => { setDescription(event.target.value); setSubmitState("idle") }} rows={6} placeholder={kind === "review" ? "Share a specific detail that could help someone evaluate this option…" : kind === "correction" ? "Explain what is outdated or inaccurate, and what should change…" : "Explain what the official source confirms and why it is relevant…"} className={cn(inputClass, "resize-y")} /></Field>
              <Field label={kind === "source" ? "Official source URL" : "Supporting source URL"} hint={kind === "source" ? "Required" : "Optional"}><input required={kind === "source"} type="url" value={sourceUrl} onChange={(event) => { setSourceUrl(event.target.value); setSubmitState("idle") }} placeholder="https://…" maxLength={500} className={inputClass} /></Field>
              <div className="flex flex-wrap items-center gap-3"><button disabled={submitState === "submitting" || description.trim().length < 30} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{submitState === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{submitState === "submitting" ? "Submitting" : "Submit for review"}</button>{submitState === "success" && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />Submitted for review</span>}</div>{submitError && <p className="text-sm leading-6 text-red-600">{submitError}</p>}
            </form>
          </section>

          <aside className="space-y-6"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><Award className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Your contribution record</h2></div><dl className="mt-5 grid grid-cols-3 gap-3"><Stat label="Approved" value={approvedCount} /><Stat label="In review" value={pendingCount} /><Stat label="Points" value={reputation} /></dl><div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><p className="font-semibold text-slate-800">Reputation tiers</p><p className="mt-1">0–9 Explorer · 10–24 Scout · 25–74 Contributor · 75+ Trusted guide</p></div></section><section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-700" /><h2 className="text-lg font-semibold text-emerald-950">What earns reputation</h2></div><ul className="mt-4 space-y-2.5 text-sm leading-6 text-emerald-900"><li>Helpful experience review: 25 points</li><li>Confirmed correction: 10 points</li><li>Useful official source: 15 points</li></ul><p className="mt-4 text-xs leading-5 text-emerald-800">Points are added only after review approval and can be removed if an approved item is later withdrawn.</p></section></aside>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Your submissions</h2></div>{contributions.length === 0 ? <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-500">You have not submitted a contribution yet. Useful, specific evidence is more valuable than volume.</div> : <ul className="mt-5 divide-y divide-slate-100">{contributions.map((contribution) => <li key={contribution.id} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className="font-semibold text-slate-900">{kindLabel(contribution.kind)}{contribution.target_label ? ` · ${contribution.target_label}` : ""}</p><p className="mt-1 truncate text-xs text-slate-500">{contribution.target_path}</p></div><span className={cn("w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusStyle[contribution.status])}>{contribution.status === "pending" ? "In review" : contribution.status}</span></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{contribution.description}</p>{contribution.source_url && <a href={contribution.source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">View source <ExternalLink className="h-3.5 w-3.5" /></a>}{contribution.reviewer_note && <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600"><span className="font-semibold text-slate-700">Review note: </span>{contribution.reviewer_note}</p>}</li>)}</ul>}</section>
      </section>
    </main>
  )
}

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

function Field({ label, hint, children }: { label: string; hint: string; children: ReactNode }) { return <label className="block text-sm font-semibold text-slate-700"><span className="flex items-center justify-between gap-3"><span>{label}</span><span className="text-xs font-normal text-slate-400">{hint}</span></span>{children}</label> }
function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-lg font-semibold text-slate-950">{value}</dd></div> }
function getTier(points: number) { if (points >= 75) return "Trusted guide"; if (points >= 25) return "Contributor"; if (points >= 10) return "Scout"; return "Explorer" }
function kindLabel(kind: ContributionKind) { return contributionOptions.find((option) => option.value === kind)?.label ?? "Contribution" }
function GuestContributions() { return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5 py-12"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-9"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Lightbulb className="h-6 w-6" /></div><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Help make planning clearer.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Sign in to submit a review, correction or official source for moderation.</p><Link href="/login?next=/profile/contributions" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Sign in</Link></section></main> }
function ContributionsSkeleton() { return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-5xl px-5 py-12 sm:px-6"><div className="h-36 animate-pulse rounded-3xl bg-slate-200" /><div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.52fr)]"><div className="h-[720px] animate-pulse rounded-3xl bg-slate-200" /><div className="h-72 animate-pulse rounded-3xl bg-slate-200" /></div></div></main> }
