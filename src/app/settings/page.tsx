"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { AlertTriangle, ArrowLeft, Check, ExternalLink, Globe, Loader2, LogOut, ShieldCheck, Trash2, UserRound, X } from "lucide-react"
import { clearOptionalMeasurementCookies, createOptionalMeasurementSession, getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/lib/analytics-consent"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { createClient } from "@/lib/supabase-client"

export default function SettingsPage() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
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
  const [measurementConsent, setMeasurementConsent] = useState<AnalyticsConsent>(null)

  useEffect(() => {
    let active = true
    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      setDisplayName((currentUser?.user_metadata?.full_name as string | undefined) || (currentUser?.user_metadata?.name as string | undefined) || "")
      setMeasurementConsent(getAnalyticsConsent())
      if (currentUser) {
        const { data: prefs } = await supabase.from("user_preferences").select("username").eq("id", currentUser.id).maybeSingle()
        if (prefs?.username) {
          setUsername(prefs.username)
          setUsernameSaved(prefs.username)
        }
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

  const usernameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function onUsernameChange(value: string) {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30)
    setUsername(clean)
    setUsernameCheck("idle")
    setUsernameMsg("")
    if (usernameRef.current) clearTimeout(usernameRef.current)
    if (clean.length < 3) {
      setUsernameCheck("invalid")
      setUsernameMsg(isKo ? "3자 이상 입력해 주세요." : "Use at least 3 characters.")
      return
    }
    if (!/^[a-z][a-z0-9_]*$/.test(clean)) {
      setUsernameCheck("invalid")
      setUsernameMsg(isKo ? "영문 소문자로 시작하고 영문·숫자·밑줄만 사용할 수 있어요." : "Start with a lowercase letter; use letters, numbers and underscores only.")
      return
    }
    setUsernameCheck("checking")
    usernameRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?username=${encodeURIComponent(clean)}`)
        const data = await res.json()
        if (data.available) {
          setUsernameCheck("available")
          setUsernameMsg(isKo ? "사용할 수 있어요." : "Available")
        } else {
          setUsernameCheck("taken")
          setUsernameMsg(isKo ? "이미 사용 중인 공개 링크예요." : "This public link is already in use.")
        }
      } catch {
        setUsernameCheck("idle")
      }
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
    router.replace(localizePath("/login", locale))
    router.refresh()
  }

  async function updateMeasurementConsent(value: Exclude<AnalyticsConsent, null>) {
    setAnalyticsConsent(value)
    setMeasurementConsent(value)
    if (value === "granted") await createOptionalMeasurementSession()
    else await clearOptionalMeasurementCookies()
  }

  async function deleteAccount() {
    if (deletePhrase !== "DELETE" || deleteState === "deleting") return
    const confirmed = window.confirm(isKo ? "CampCareer 계정과 저장한 커리어 탐색 정보를 영구적으로 삭제할까요? 이 작업은 되돌릴 수 없습니다." : "Permanently delete your CampCareer account and saved career research? This cannot be undone.")
    if (!confirmed) return

    setDeleteState("deleting")
    setDeleteError("")
    try {
      const response = await fetch("/api/account/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: "DELETE" }) })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || (isKo ? "계정을 삭제하지 못했습니다. 지원팀에 문의해 주세요." : "We could not delete your account. Please contact support."))
      await supabase.auth.signOut({ scope: "local" })
      router.replace(localizePath("/", locale))
      router.refresh()
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : (isKo ? "계정을 삭제하지 못했습니다. 지원팀에 문의해 주세요." : "We could not delete your account. Please contact support."))
      setDeleteState("error")
    }
  }

  if (loading) return <SettingsSkeleton />
  if (!user) return <GuestSettings locale={locale} />

  const measurementStatus = measurementConsent === "granted"
    ? (isKo ? "제품 개선 측정 허용됨" : "Product measurement is allowed")
    : measurementConsent === "denied"
      ? (isKo ? "필수 기능만 사용" : "Essential functionality only")
      : (isKo ? "아직 선택하지 않음" : "No preference recorded yet")

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-[#e7e7e3] bg-[#f7f7f6]">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
          <Link href={localizePath("/profile", locale)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-700"><ArrowLeft className="size-4" />{isKo ? "프로필" : "Profile"}</Link>
          <p className="mt-7 text-xs font-semibold tracking-[0.14em] text-blue-700">{isKo ? "계정 관리" : "ACCOUNT"}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{isKo ? "내 커리어 탐색을 내 방식대로 관리하세요." : "Keep your career research under your control."}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{isKo ? "표시 이름, 개인정보 선택 사항, 로그인 상태를 관리할 수 있어요. 저장한 탐색은 기본적으로 비공개예요." : "Manage your display name, privacy choices and sign-in session. Your saved research stays private by default."}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-5 px-5 py-8 sm:px-8 sm:py-10">
        <SettingsSection icon={UserRound} title={isKo ? "계정 정보" : "Account information"} description={isKo ? "이 이름은 CampCareer 안에서만 표시돼요." : "This name is only shown within your CampCareer experience."}>
          <form onSubmit={saveProfile} className="mt-6 max-w-lg space-y-4">
            <div><label htmlFor="display-name" className="text-sm font-semibold text-slate-700">{isKo ? "표시 이름" : "Display name"}</label><input id="display-name" value={displayName} maxLength={80} onChange={(event) => { setDisplayName(event.target.value); setSaveState("idle") }} placeholder={isKo ? "어떻게 불러드릴까요?" : "How should we address you?"} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            <div><p className="text-sm font-semibold text-slate-700">{isKo ? "이메일" : "Email"}</p><p className="mt-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600">{user.email}</p><p className="mt-2 text-xs leading-5 text-slate-500">{isKo ? "이메일 변경은 안전한 인증 절차를 준비한 뒤 지원할 예정이에요." : "Email changes will be available after we complete secure in-product verification."}</p></div>
            <div className="flex flex-wrap items-center gap-3"><button type="submit" disabled={saveState === "saving"} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{saveState === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}{saveState === "saving" ? (isKo ? "저장 중…" : "Saving…") : (isKo ? "변경사항 저장" : "Save changes")}</button>{saveState === "saved" && <span className="text-sm font-medium text-emerald-700">{isKo ? "저장했어요." : "Saved"}</span>}{saveState === "error" && <span className="text-sm font-medium text-red-600">{isKo ? "저장하지 못했어요. 다시 시도해 주세요." : "We could not save this change. Try again."}</span>}</div>
          </form>
        </SettingsSection>

        <SettingsSection icon={Globe} title={isKo ? "공개 프로필 링크" : "Public profile link"} description={isKo ? "필요한 경우에만 사용하는 선택 항목이에요. 저장한 커리어 탐색은 공개되지 않아요." : "Optional. Your saved career research is never shown on this link."} tone="violet">
          <div className="mt-6 max-w-lg space-y-3"><div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">@</span><input id="username" value={username} onChange={(event) => onUsernameChange(event.target.value)} placeholder="yourname" maxLength={30} autoComplete="off" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />{usernameCheck === "available" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"><Check className="size-4" /></span>}{usernameCheck === "taken" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><X className="size-4" /></span>}{usernameCheck === "checking" && <span className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="size-4 animate-spin text-slate-400" /></span>}</div>{usernameMsg && <p className={`text-xs ${usernameCheck === "available" ? "text-emerald-600" : "text-red-600"}`}>{usernameMsg}</p>}{usernameCheck === "available" && username !== usernameSaved && <button type="button" onClick={saveUsername} disabled={usernameSaving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{usernameSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}{usernameSaving ? (isKo ? "저장 중…" : "Saving…") : (isKo ? "공개 링크 저장" : "Save public link")}</button>}{usernameSaved && username === usernameSaved && usernameCheck !== "available" && <div className="flex flex-wrap items-center gap-3"><Link href={`/${usernameSaved}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">{isKo ? "공개 프로필 보기" : "View public profile"}<ExternalLink className="size-4" /></Link><span className="text-xs text-slate-500">campcareer.com/{usernameSaved}</span></div>}</div>
        </SettingsSection>

        <SettingsSection icon={ShieldCheck} title={isKo ? "개인정보와 제품 개선" : "Privacy and product improvement"} description={isKo ? "선택적 제품 사용 분석 여부를 정할 수 있어요. 이메일이나 자유 입력 답변은 포함하지 않아요." : "Choose whether to share optional product measurement. It never includes your email or free-text answers."} tone="green">
          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#fafbfc] p-4"><p className="text-sm font-semibold text-slate-900">{measurementStatus}</p><p className="mt-1 text-xs leading-5 text-slate-500">{measurementConsent === "granted" ? (isKo ? "이 브라우저에서 제품과 성능 개선을 위한 측정을 허용했어요." : "Product and performance measurement can run in this browser.") : (isKo ? "선택적 분석 없이도 검색, 비교, 계획과 계정 기능은 동일하게 사용할 수 있어요." : "Search, comparison, planning and account features work without optional measurement.")}</p><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => void updateMeasurementConsent("denied")} aria-pressed={measurementConsent === "denied"} className={`min-h-10 rounded-xl border px-3 text-sm font-semibold transition ${measurementConsent === "denied" ? "border-slate-700 bg-slate-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"}`}>{isKo ? "필수 기능만 사용" : "Use essential only"}</button><button type="button" onClick={() => void updateMeasurementConsent("granted")} aria-pressed={measurementConsent === "granted"} className={`min-h-10 rounded-xl border px-3 text-sm font-semibold transition ${measurementConsent === "granted" ? "border-blue-600 bg-blue-600 text-white" : "border-blue-300 bg-white text-blue-700 hover:border-blue-500 hover:bg-blue-50"}`}>{isKo ? "제품 개선 측정 허용" : "Allow measurement"}</button></div></div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs leading-5 text-slate-500"><Link href={localizePath("/profile", locale)} className="font-medium text-blue-700 hover:underline">{isKo ? "프로필 검토" : "Review profile"}</Link><Link href={localizePath("/privacy", locale)} className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline">{isKo ? "개인정보 처리방침" : "Privacy policy"}<ExternalLink className="size-3" /></Link></div>
        </SettingsSection>

        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="text-lg font-semibold text-slate-950">{isKo ? "로그인 상태" : "Session"}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "이 브라우저에서만 로그아웃합니다. 언제든 다시 로그인할 수 있어요." : "Sign out from this browser only. You can return whenever you are ready."}</p></div><button type="button" onClick={signOut} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><LogOut className="size-4" />{isKo ? "로그아웃" : "Log out"}</button></section>

        <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-6"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-700"><AlertTriangle className="size-5" /></div><div><h2 className="text-lg font-semibold text-red-950">{isKo ? "계정 삭제" : "Delete account"}</h2><p className="mt-1 text-sm leading-6 text-red-800">{isKo ? "계정과 저장한 커리어 탐색 정보를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없어요." : "This permanently removes your account and saved career research. It cannot be undone."}</p></div></div><div className="mt-6 max-w-lg"><label htmlFor="delete-confirmation" className="text-sm font-semibold text-red-950">{isKo ? <><code className="rounded bg-red-100 px-1.5 py-0.5">DELETE</code>를 입력해 계속하기</> : <>Type <code className="rounded bg-red-100 px-1.5 py-0.5">DELETE</code> to continue</>}</label><input id="delete-confirmation" value={deletePhrase} onChange={(event) => { setDeletePhrase(event.target.value); setDeleteState("idle"); setDeleteError("") }} autoComplete="off" className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100" /><button type="button" disabled={deletePhrase !== "DELETE" || deleteState === "deleting"} onClick={deleteAccount} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{deleteState === "deleting" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}{deleteState === "deleting" ? (isKo ? "계정 삭제 중…" : "Deleting account…") : (isKo ? "계정 영구 삭제" : "Permanently delete account")}</button>{deleteError && <p className="mt-3 text-sm leading-6 text-red-700">{deleteError} {isKo ? "계속되면 지원팀에 문의해 주세요." : "If this continues, contact support."}</p>}</div></section>
      </section>
    </main>
  )
}

function SettingsSection({ icon: Icon, title, description, tone = "blue", children }: { icon: typeof UserRound; title: string; description: string; tone?: "blue" | "violet" | "green"; children: React.ReactNode }) {
  const toneClass = tone === "violet" ? "bg-violet-50 text-violet-700" : tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-start gap-3"><div className={`grid size-10 shrink-0 place-items-center rounded-xl ${toneClass}`}><Icon className="size-5" /></div><div><h2 className="text-lg font-semibold text-slate-950">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p></div></div>{children}</section>
}

function GuestSettings({ locale }: { locale: "en" | "ko" }) {
  const isKo = locale === "ko"
  const settingsPath = localizePath("/settings", locale)
  return <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 py-12"><section className="max-w-md rounded-2xl border border-slate-200 bg-[#fafbfc] p-7 text-center sm:p-9"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><ShieldCheck className="size-5" /></div><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{isKo ? "계정 관리는 로그인 후 사용할 수 있어요." : "Sign in to manage your account."}</h1><p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "내 해외 커리어 탐색 정보는 본인만 관리할 수 있어요." : "Only you can manage your global-career research."}</p><Link href={`${localizePath("/login", locale)}?next=${encodeURIComponent(settingsPath)}`} className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "로그인" : "Log in"}</Link></section></main>
}

function SettingsSkeleton() {
  return <main className="min-h-screen bg-white"><div className="mx-auto max-w-4xl space-y-5 px-5 py-12 sm:px-8"><div className="h-28 animate-pulse rounded-2xl bg-slate-100" />{[1, 2, 3].map((item) => <div key={item} className="h-44 animate-pulse rounded-2xl bg-slate-100" />)}</div></main>
}
