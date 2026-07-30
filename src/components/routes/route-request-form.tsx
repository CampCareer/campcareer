"use client"

import { useState } from "react"
import { LoaderCircle, Send } from "lucide-react"
import type { RouteLocale } from "@/data/route-guides"
import type { RouteGoal } from "@/lib/route-search"
import { recordRouteEvent } from "@/lib/analytics"

type Props = {
  locale: RouteLocale
  citizenship: string
  destination: string
  field: string
  goal: RouteGoal
  requestKind?: "route_research" | "guide_interest"
  routeId?: string
  compact?: boolean
}

export function RouteRequestForm({
  locale,
  citizenship,
  destination,
  field,
  goal,
  requestKind = "route_research",
  routeId,
  compact = false,
}: Props) {
  const isKo = locale === "ko"
  const requiresNotification = requestKind === "guide_interest"
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [company, setCompany] = useState("")
  const [state, setState] = useState<"idle" | "submitting" | "submitted">("idle")

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (requiresNotification && (!consent || !email.trim())) return
    setState("submitting")
    try {
      const response = await fetch("/api/route-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenship,
          destination,
          field,
          goal,
          locale,
          requestKind,
          email: email.trim() || undefined,
          notificationConsent: consent,
          company,
        }),
      })
      if (response.status === 202) {
        setState("submitted")
        recordRouteEvent(requestKind === "guide_interest" ? "guide_interest_submitted" : "route_request_submitted", {
          locale,
          ...(requestKind === "guide_interest" && routeId ? { route_id: routeId } : {}),
          surface: requestKind === "guide_interest" ? "route_result" : "landing",
        })
      } else {
        setState("idle")
      }
    } catch {
      setState("idle")
    }
  }

  if (state === "submitted") {
    return (
      <div className={`${compact ? "mt-4" : "mt-6"} rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950`} role="status">
        <p className="font-semibold">{isKo ? "요청을 받았습니다." : "Your request is in."}</p>
        <p className="mt-1">{requiresNotification ? (isKo ? "가이드 공개 여부를 알릴 수 있도록 동의를 기록했습니다." : "We recorded your notification consent.") : (isKo ? "이 조합의 공개 우선순위를 정하는 익명 수요 신호로 사용합니다." : "This anonymous signal helps us prioritise the next route to verify.")}</p>
      </div>
    )
  }

  return (
    <section className={`${compact ? "mt-4" : "mt-6"} rounded-2xl border border-[#e7e7e3] bg-[#f6f6f4] p-5 sm:p-6`} aria-labelledby={`route-request-${requestKind}`}>
      <h2 id={`route-request-${requestKind}`} className="text-lg font-semibold text-slate-950">
        {requiresNotification
          ? (isKo ? "심화 가이드 공개 알림" : "Get notified if a deeper guide is released")
          : (isKo ? "아직 검증된 공개 경로가 없습니다" : "There is no verified public route for this combination yet")}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {requiresNotification
          ? (isKo ? "무료 결과는 계속 열어 둡니다. 판매 전, 이 경로의 심화 가이드 수요만 확인합니다." : "The free result stays open. Before selling anything, we are only measuring demand for a deeper guide.")
          : (isKo ? "가짜 답변 대신 이 조합을 조사 요청으로 받습니다. 이메일 없이도 요청할 수 있습니다." : "Instead of inventing an answer, you can request research for this combination. Email is optional.")}
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="sr-only" aria-hidden="true">
          Company
          <input tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-700">{isKo ? "공개되면 알림받을 이메일 (선택)" : "Email for a release notification (optional)"}</span>
          <input type="email" value={email} required={requiresNotification} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" placeholder="name@example.com" />
        </label>
        <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
          <span>{isKo ? "이메일을 입력한 경우에만, 해당 경로 또는 심화 가이드가 공개될 때 연락받는 데 동의합니다. 상담·제휴 리드로 공유하지 않습니다." : "Only if I provide an email, I consent to a notification when this route or a deeper guide is released. This is not shared as a partner or consultation lead."}</span>
        </label>
        <button type="submit" disabled={state === "submitting" || (requiresNotification && (!consent || !email.trim()))} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1b1b1b] px-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-400">
          {state === "submitting" ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
          {requiresNotification ? (isKo ? "알림 신청" : "Request notification") : (isKo ? "조사 요청 보내기" : "Send research request")}
        </button>
      </form>
    </section>
  )
}
