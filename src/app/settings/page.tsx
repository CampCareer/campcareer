"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { AlertTriangle, ArrowLeft, Check, ExternalLink, Globe, Loader2, LogOut, ShieldCheck, Trash2, UserRound, X } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState("")
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [deletePhrase, setDeletePhrase] = useState("")
  const [deleteState, setDeleteState] = useState<"idle" | "deleting" | "error">("idle")
  const [deleteError, setDeleteError] = useState("")
  const [username, setUsername] = useState("")
  const [usernameSaved, setUsernameSaved] = useState<string | null>(null)
  const [usernameCheck, setUsernameCheck] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle")
  const [usernameMsg, setUsernameMsg] = useState("")
  const [usernameSaving, setUsernameSaving] = useState(false)

  useEffect(() => {
    let active = true
    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      setDisplayName((currentUser?.user_metadata?.full_name as string | undefined) || (currentUser?.user_metadata?.name as string | undefined) || "")
      if (currentUser) {
        const { data: prefs } = await supabase.from("user_preferences").select("username").eq("id", currentUser.id).maybeSingle()
        if (prefs?.username) { setUsername(prefs.username); setUsernameSaved(prefs.username) }
      }
      setLoading(false)
    }
    void initialise()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) setDisplayName((currentUser.user_metadata?.full_name as string | undefined) || (currentUser.user_metadata?.name as string | undefined) || "")
      setLoading(false)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveState("saving")
    const { error } = await supabase.auth.updateUser({ data: { full_name: displayName.trim() } })
    setSaveState(error ? "error" : "saved")
  }

  // ── Username ──
  const usernameRef = useRef<NodeJS.Timeout | null>(null)

  function onUsernameChange(value: string) {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30)
    setUsername(clean)
    setUsernameCheck("idle")
    setUsernameMsg("")
    if (usernameRef.current) clearTimeout(usernameRef.current)
    if (clean.length < 3) { setUsernameCheck("invalid"); return }
    if (!/^[a-z][a-z0-9_]*$/.test(clean)) { setUsernameCheck("invalid"); setUsernameMsg("Must start with a letter. Only lowercase letters, numbers and underscores."); return }
    setUsernameCheck("checking")
    usernameRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?username=${encodeURIComponent(clean)}`)
        const data = await res.json()
        if (data.available) { setUsernameCheck("available"); setUsernameMsg("") }
        else { setUsernameCheck("taken"); setUsernameMsg(data.reason || "This username is already taken.") }
      } catch { setUsernameCheck("idle") }
    }, 400)
  }

  async function saveUsername() {
    if (!user || usernameCheck !== "available" || username === usernameSaved) return
    setUsernameSaving(true)
    const { error } = await supabase.from("user_preferences").upsert({ id: user.id, username }, { onConflict: "id" })
    if (!error) setUsernameSaved(username)
    setUsernameSaving(false)
  }

  async function signOut() {
    await supabase.auth.signOut({ scope: "local" })
    router.replace("/login")
    router.refresh()
  }

  async function deleteAccount() {
    if (deletePhrase !== "DELETE" || deleteState === "deleting") return
    const confirmed = window.confirm("Permanently delete your CampCareer account and saved planning data? This cannot be undone.")
    if (!confirmed) return

    setDeleteState("deleting")
    setDeleteError("")
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "DELETE" }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || "We could not delete your account. Please contact support.")

      await supabase.auth.signOut({ scope: "local" })
      router.replace("/")
      router.refresh()
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "We could not delete your account. Please contact support.")
      setDeleteState("error")
    }
  }

  if (loading) return <SettingsSkeleton />
  if (!user) return <GuestSettings />

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_42%),linear-gradient(180deg,_#ffffff,_#f7f9fc)]">
        <div className="mx-auto max-w-3xl px-5 pb-9 pt-10 sm:px-6 sm:pb-11 sm:pt-14">
          <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Profile</Link>
          <p className="mt-7 text-sm font-semibold text-blue-700">Account settings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Privacy and account control.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Manage the information shown on your profile, your current session, and your account. Your saved plans are private to your account.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-5 py-8 sm:px-6 sm:py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><UserRound className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold text-slate-950">Profile information</h2><p className="mt-1 text-sm leading-6 text-slate-500">This name is only used in your CampCareer account experience.</p></div></div>
          <form onSubmit={saveProfile} className="mt-6 max-w-lg space-y-4">
            <div><label htmlFor="display-name" className="text-sm font-semibold text-slate-700">Display name</label><input id="display-name" value={displayName} maxLength={80} onChange={(event) => { setDisplayName(event.target.value); setSaveState("idle") }} placeholder="How should we address you?" className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            <div><p className="text-sm font-semibold text-slate-700">Email</p><p className="mt-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600">{user.email}</p><p className="mt-2 text-xs leading-5 text-slate-500">Email changes are handled through account support while we finish secure in-product verification.</p></div>
            <div className="flex flex-wrap items-center gap-3"><button type="submit" disabled={saveState === "saving"} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saveState === "saving" ? "Saving" : "Save changes"}</button>{saveState === "saved" && <span className="text-sm font-medium text-emerald-700">Saved</span>}{saveState === "error" && <span className="text-sm font-medium text-red-600">We could not save this change. Try again.</span>}</div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Globe className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold text-slate-950">Public username</h2><p className="mt-1 text-sm leading-6 text-slate-500">Your public profile URL: campcareer.com/<strong>{username || "yourname"}</strong></p></div></div>
          <div className="mt-6 max-w-lg space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">@</span>
              <input
                id="username"
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="yourname"
                maxLength={30}
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {usernameCheck === "available" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"><Check className="h-4 w-4" /></span>}
              {usernameCheck === "taken" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><X className="h-4 w-4" /></span>}
              {usernameCheck === "checking" && <span className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="h-4 w-4 animate-spin text-slate-400" /></span>}
            </div>
            {usernameMsg && <p className={`text-xs ${usernameCheck === "available" ? "text-emerald-600" : "text-red-600"}`}>{usernameMsg}</p>}
            {usernameCheck === "available" && username !== usernameSaved && (
              <button type="button" onClick={saveUsername} disabled={usernameSaving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {usernameSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {usernameSaving ? "Saving" : "Save username"}
              </button>
            )}
            {usernameSaved && username === usernameSaved && usernameCheck !== "available" && (
              <div className="flex items-center gap-3">
                <Link href={`/${usernameSaved}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
                  View public profile →
                </Link>
                <span className="text-xs text-slate-500">campcareer.com/{usernameSaved}</span>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold text-slate-950">Privacy and saved data</h2><p className="mt-1 text-sm leading-6 text-slate-500">Your public username, display name and avatar are visible on your public profile. Saved careers, providers and planning inputs are private.</p></div></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/profile" className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">Review your profile <span aria-hidden="true">→</span></Link><Link href="/privacy" className="inline-flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">Read privacy policy <ExternalLink className="h-4 w-4" /></Link></div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Data export and granular communication controls are the next privacy controls we will add. For an access or correction request, contact <a className="font-medium text-blue-700 hover:underline" href="mailto:contact@campcareer.com">contact@campcareer.com</a>.</p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><h2 className="text-lg font-semibold text-slate-950">Session</h2><p className="mt-1 text-sm leading-6 text-slate-500">Sign out from this browser. You can sign in again whenever you are ready.</p><button type="button" onClick={signOut} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><LogOut className="h-4 w-4" />Sign out</button></section>

        <section className="rounded-3xl border border-red-200 bg-red-50/50 p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700"><AlertTriangle className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold text-red-950">Delete account</h2><p className="mt-1 text-sm leading-6 text-red-800">This permanently removes your CampCareer account, saved planning data, private evidence and contribution record linked to it. It cannot be undone.</p></div></div>
          <div className="mt-6 max-w-lg"><label htmlFor="delete-confirmation" className="text-sm font-semibold text-red-950">Type <code className="rounded bg-red-100 px-1.5 py-0.5">DELETE</code> to continue</label><input id="delete-confirmation" value={deletePhrase} onChange={(event) => { setDeletePhrase(event.target.value); setDeleteState("idle"); setDeleteError("") }} autoComplete="off" className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100" /><button type="button" disabled={deletePhrase !== "DELETE" || deleteState === "deleting"} onClick={deleteAccount} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{deleteState === "deleting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}{deleteState === "deleting" ? "Deleting account" : "Permanently delete account"}</button>{deleteError && <p className="mt-3 text-sm leading-6 text-red-700">{deleteError} If this continues, contact <a href="mailto:contact@campcareer.com" className="font-semibold underline">contact@campcareer.com</a>.</p>}</div>
        </section>
      </section>
    </main>
  )
}

function GuestSettings() {
  return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5 py-12"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-9"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><ShieldCheck className="h-6 w-6" /></div><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Sign in to manage your account.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Settings are only available to the account owner.</p><Link href="/login?next=/settings" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Sign in</Link></section></main>
}

function SettingsSkeleton() {
  return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-3xl space-y-6 px-5 py-12 sm:px-6"><div className="h-28 animate-pulse rounded-3xl bg-slate-200" />{[1, 2, 3].map((item) => <div key={item} className="h-48 animate-pulse rounded-3xl bg-slate-200" />)}</div></main>
}
