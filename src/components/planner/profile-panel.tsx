"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  FileCheck2,
  Globe,
  Lightbulb,
  Settings,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath, localeFromPathname } from "@/lib/i18n/config"
import { majorLabel, resolveView } from "@/lib/degree-risk"

type Preferences = {
  field: string | null
  goal: string | null
  recommended_country: string | null
  completed_at: string | null
  username: string | null
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

type ProfilePanelProps = {
  open: boolean
  onClose: () => void
}

export function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const supabase = useMemo(() => createClient(), [])
  const pathname = usePathname()
  const locale = useRouteLocale()
  const pathLocale = localeFromPathname(pathname) ?? locale

  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [savedCareers, setSavedCareers] = useState(0)
  const [savedProviders, setSavedProviders] = useState(0)
  const [programmeComplete, setProgrammeComplete] = useState(false)
  const [evidenceCount, setEvidenceCount] = useState(0)
  const [reputationPoints, setReputationPoints] = useState(0)
  const [riskAssessment, setRiskAssessment] = useState<DegreeRiskAssessment | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let active = true

    async function loadProfile(userId: string) {
      const [
        preferenceResult,
        careerResult,
        providerResult,
        programmeResult,
        evidenceResult,
        reputationResult,
        assessmentResult,
      ] = await Promise.all([
        supabase
          .from("user_preferences")
          .select("field, goal, recommended_country, completed_at, username")
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
        supabase
          .from("program_completions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("program_id", "research-foundation-v1"),
        supabase
          .from("programme_evidence")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("reputation_ledger")
          .select("points")
          .eq("user_id", userId),
        supabase
          .from("assessments")
          .select("id, major_pref, country_pref, primary_goal")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      if (!active) return
      setPreferences((preferenceResult.data as Preferences | null) ?? null)
      setSavedCareers(careerResult.count ?? 0)
      setSavedProviders(providerResult.count ?? 0)
      setProgrammeComplete((programmeResult.count ?? 0) > 0)
      setEvidenceCount(evidenceResult.count ?? 0)
      setReputationPoints(
        (reputationResult.data ?? []).reduce(
          (sum, row) => sum + (Number(row.points) || 0),
          0,
        ),
      )
      setRiskAssessment(
        (assessmentResult.data as DegreeRiskAssessment | null) ?? null,
      )
      setUsername((preferenceResult.data as Preferences | null)?.username ?? null)
    }

    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      if (currentUser) await loadProfile(currentUser.id)
    }

    void initialise()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        void loadProfile(currentUser.id)
      } else {
        setPreferences(null)
        setSavedCareers(0)
        setSavedProviders(0)
        setProgrammeComplete(false)
        setEvidenceCount(0)
        setReputationPoints(0)
        setRiskAssessment(null)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase, open])

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "CampCareer member"
  const direction = preferences?.completed_at
    ? [
        preferences.field,
        preferences.goal
          ? goalLabels[preferences.goal] ?? preferences.goal
          : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "Not set yet"
  const pathLevel =
    evidenceCount >= 3
      ? 4
      : programmeComplete
        ? 3
        : savedCareers > 0 && savedProviders > 0
          ? 2
          : preferences?.completed_at
            ? 1
            : 0
  const achievements = [
    preferences?.completed_at ? "Planning direction set" : null,
    programmeComplete ? "Research Foundation completed" : null,
    evidenceCount >= 3 ? "Official evidence pack saved" : null,
    reputationPoints >= 10 ? "Community contributor" : null,
  ]
    .filter(Boolean)
    .slice(0, 3) as string[]
  const degreeRiskHref = riskAssessment
    ? `/degree-risk/result?${new URLSearchParams({
        major: riskAssessment.major_pref,
        view: resolveView(riskAssessment.country_pref),
        goal: riskAssessment.primary_goal,
        aid: riskAssessment.id,
      })}`
    : "/degree-risk"

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[3000] bg-slate-950/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* Slide-over */}
      <div
        role="dialog"
        aria-label="Profile"
        className="fixed bottom-0 right-0 top-0 z-[3001] w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.12)] transition-transform duration-250 ease-out data-[state=closed]:translate-x-full sm:max-w-xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
          <p className="text-sm font-semibold text-slate-950">Your profile</p>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close profile panel"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-14 w-14 rounded-2xl border border-slate-200 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm">
                <UserRound className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight text-slate-950">
                {displayName}
              </h2>
              <p className="mt-0.5 truncate text-sm text-slate-500">
                {username ? `@${username}` : user?.email ?? "Not signed in"}
              </p>
            </div>
          </div>

          {!username && (
            <Link
              href={localizePath("/settings", pathLocale)}
              onClick={onClose}
              className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm transition hover:border-amber-300"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Globe className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 text-amber-800">
                <span className="font-semibold">Set up a public username</span>{" "}
                to get a shareable profile link.
              </span>
            </Link>
          )}

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat
              icon={Compass}
              label="Direction"
              value={direction}
              href="/onboarding"
              onClose={onClose}
            />
            <MiniStat
              icon={BriefcaseBusiness}
              label="Careers"
              value={`${savedCareers}`}
              href="/au/jobs"
              onClose={onClose}
            />
            <MiniStat
              icon={BookOpen}
              label="Providers"
              value={`${savedProviders}`}
              href="/au/study"
              onClose={onClose}
            />
          </div>

          {/* Path level + achievements */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-blue-700">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                Path level
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {pathLevel}
              <span className="ml-1 text-base text-slate-400">/ 4</span>
            </p>
            {achievements.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {achievements.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Complete your first planning step to begin.
              </p>
            )}
          </div>

          {/* Quick links */}
          <div className="mt-5 space-y-2">
            <PanelLink
              href="/profile/achievements"
              icon={BadgeCheck}
              label="Planning milestones"
              onClose={onClose}
            />
            <PanelLink
              href="/profile/contributions"
              icon={Lightbulb}
              label="Community contributions"
              onClose={onClose}
            />
            <PanelLink
              href="/profile/programs"
              icon={Sparkles}
              label="Research programme"
              onClose={onClose}
            />
            <PanelLink
              href="/profile/portfolio"
              icon={BookOpen}
              label="Private portfolio"
              onClose={onClose}
            />
            <PanelLink
              href="/profile/evidence"
              icon={FileCheck2}
              label="Official evidence pack"
              onClose={onClose}
            />
            <PanelLink
              href={degreeRiskHref}
              icon={FileCheck2}
              label={
                riskAssessment
                  ? `Degree-risk: ${majorLabel(riskAssessment.major_pref)}`
                  : "Degree-risk check"
              }
              onClose={onClose}
            />
          </div>

          {/* Settings + Sign out */}
          <div className="mt-6 flex items-center gap-3">
            <Link
              href={localizePath("/settings", pathLocale)}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Helpers ─────────────────────────────────────────────────── */

function MiniStat({
  icon: Icon,
  label,
  value,
  href,
  onClose,
}: {
  icon: typeof Compass
  label: string
  value: string
  href: string
  onClose: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-center gap-1.5 text-slate-500">
        <Icon className="h-3.5 w-3.5 text-blue-600" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">
          {label}
        </span>
      </div>
      <p className="mt-1.5 truncate text-sm font-semibold text-slate-950 group-hover:text-blue-700">
        {value}
      </p>
    </Link>
  )
}

function PanelLink({
  href,
  icon: Icon,
  label,
  onClose,
}: {
  href: string
  icon: typeof Compass
  label: string
  onClose: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />
        {label}
      </span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}
