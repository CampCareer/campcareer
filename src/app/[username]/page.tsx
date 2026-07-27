import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { UserRound } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"

type UserPrefs = {
  id: string
  username: string
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

export const runtime = "nodejs"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const profile = await loadPublicProfile(username)
  if (!profile) return { title: "Profile not found" }

  return {
    title: `${profile.displayName} — CampCareer`,
    description: `CampCareer profile of ${profile.displayName}.`,
    openGraph: {
      title: `${profile.displayName} — CampCareer`,
      description: `CampCareer profile of ${profile.displayName}.`,
      ...(profile.avatarUrl ? { images: [{ url: profile.avatarUrl }] } : {}),
    },
  }
}

export default async function UsernamePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await loadPublicProfile(username)
  if (!profile) notFound()

  const direction = profile.completedAt
    ? [profile.field, profile.goalLabel].filter(Boolean).join(" · ")
    : null

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_42%),linear-gradient(180deg,_#ffffff,_#f7f9fc)]">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 pb-9 pt-10 sm:flex-row sm:items-end sm:px-6 sm:pb-11 sm:pt-14">
          <div className="flex items-center gap-4">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-16 w-16 rounded-2xl border border-slate-200 object-cover shadow-sm" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm">
                <UserRound className="h-7 w-7" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">CampCareer</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{profile.displayName}</h1>
              <p className="mt-1 text-sm text-slate-500">@{profile.username}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-5 sm:grid-cols-3">
          <PublicStat label="Path level" value={`${profile.pathLevel} / 4`} />
          <PublicStat label="Saved careers" value={`${profile.savedCareers}`} />
          <PublicStat label="Saved providers" value={`${profile.savedProviders}`} />
        </div>

        {direction && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">Planning direction</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{direction}</p>
          </section>
        )}

        {profile.achievements.length > 0 && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">Achievements</p>
            <ul className="mt-3 space-y-2">
              {profile.achievements.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  )
}

function PublicStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-3 truncate text-xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  )
}

/* ── Data loading (server, admin client bypasses RLS) ── */

async function loadPublicProfile(username: string) {
  const { data: prefs, error: prefsError } = await supabaseAdmin
    .from("user_preferences")
    .select("id, username, field, goal, recommended_country, completed_at")
    .eq("username", username)
    .maybeSingle()

  if (prefsError || !prefs) return null

  const typed = prefs as UserPrefs

  // Fetch display name + avatar from auth admin
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(typed.id)
  const authUser = userData?.user
  const displayName =
    (authUser?.user_metadata?.full_name as string | undefined) ||
    (authUser?.user_metadata?.name as string | undefined) ||
    typed.username
  const avatarUrl = authUser?.user_metadata?.avatar_url as string | undefined

  // Count saved items for path level
  const [careersResult, providersResult, evidenceResult] = await Promise.all([
    supabaseAdmin.from("saved_occupations").select("id", { count: "exact", head: true }).eq("user_id", typed.id),
    supabaseAdmin.from("saved_universities").select("id", { count: "exact", head: true }).eq("user_id", typed.id),
    supabaseAdmin.from("programme_evidence").select("id", { count: "exact", head: true }).eq("user_id", typed.id),
  ])

  const savedCareers = careersResult.count ?? 0
  const savedProviders = providersResult.count ?? 0
  const evidenceCount = evidenceResult.count ?? 0
  const programmeComplete = false // not checked for public profile

  const pathLevel =
    evidenceCount >= 3 ? 4
    : programmeComplete ? 3
    : savedCareers > 0 && savedProviders > 0 ? 2
    : typed.completed_at ? 1
    : 0

  const achievements = [
    typed.completed_at ? "Planning direction set" : null,
    programmeComplete ? "Research Foundation completed" : null,
    evidenceCount >= 3 ? "Official evidence pack saved" : null,
  ].filter(Boolean) as string[]

  return {
    username: typed.username,
    displayName,
    avatarUrl,
    field: typed.field,
    goalLabel: typed.goal ? goalLabels[typed.goal] ?? typed.goal : null,
    completedAt: typed.completed_at,
    savedCareers,
    savedProviders,
    pathLevel,
    achievements,
  }
}
