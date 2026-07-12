"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { BadgeCheck, Loader2 } from "lucide-react"
import { track } from "@/lib/analytics"

const HELP = [
  ["COURSE_SELECTION", "Course selection", "과정 선택"],
  ["APPLICATION", "Application preparation", "지원 준비"],
  ["ADMISSIONS", "Admission requirements", "입학 조건"],
  ["VISA_INFORMATION", "Official visa information", "공식 비자 정보"],
] as const

export function LeadRequestForm({ conceptId, conceptLabel, country, locale }: { conceptId: string; conceptLabel: string; country: string; locale: "en" | "ko-KR" }) {
  const isKo = locale === "ko-KR"
  const [name, setName] = useState("")
  const [intake, setIntake] = useState("")
  const [budget, setBudget] = useState("")
  const [help, setHelp] = useState<string[]>(["COURSE_SELECTION"])
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/v1/lead-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId, destinationCountry: country, contactName: name, intendedIntake: intake || undefined, budget: budget ? Number(budget) : undefined, helpNeeded: help, consent }),
      })
      const payload = await response.json() as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? "Unable to submit request")
      setSubmitted(true)
      track("lead_request_submitted", { concept_id: conceptId, destination: country })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to submit request")
    } finally {
      setLoading(false)
    }
  }

  return <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6"><section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{submitted ? <div className="text-center"><BadgeCheck className="mx-auto h-10 w-10 text-emerald-600" /><h1 className="mt-4 text-3xl font-semibold text-slate-950">{isKo ? "요청을 받았습니다" : "Your request is received"}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{isKo ? "검증된 파트너가 배정되기 전에는 개인정보를 공유하지 않습니다. 파트너 수락과 연락 상태는 이 계정에 기록됩니다." : "Your details are not shared until a verified partner is assigned. Partner acceptance and contact status are recorded for this account."}</p><Link href="/profile" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white">{isKo ? "내 플랜 보기" : "View my plans"}</Link></div> : <><p className="text-sm font-bold text-blue-600">{country} · {conceptLabel}</p><h1 className="mt-2 text-3xl font-semibold text-slate-950">{isKo ? "지원 준비 도움 요청" : "Request application support"}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{isKo ? "상담 또는 지원 도움을 받을 준비가 된 경우에만 요청하세요. 순위와 과정 결과는 파트너 비용의 영향을 받지 않습니다." : "Request help only when you are ready to discuss an application. Partner fees never affect comparison or course ranking."}</p><form onSubmit={submit} className="mt-7 space-y-5"><label className="block text-sm font-bold text-slate-700">{isKo ? "이름" : "Your name"}<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-3.5" /></label><label className="block text-sm font-bold text-slate-700">{isKo ? "희망 입학 시기 (선택)" : "Preferred intake (optional)"}<input value={intake} onChange={(event) => setIntake(event.target.value)} placeholder="September 2027" className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-3.5" /></label><label className="block text-sm font-bold text-slate-700">{isKo ? "첫해 예산 USD (선택)" : "First-year budget in USD (optional)"}<input type="number" min="1" value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-3.5" /></label><fieldset><legend className="text-sm font-bold text-slate-700">{isKo ? "필요한 도움" : "What do you need help with?"}</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{HELP.map(([value, en, ko]) => <label key={value} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700"><input type="checkbox" checked={help.includes(value)} onChange={(event) => setHelp((items) => event.target.checked ? [...items, value] : items.filter((item) => item !== value))} />{isKo ? ko : en}</label>)}</div></fieldset><label className="flex items-start gap-2.5 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5" /><span>{isKo ? "검증된 학교 또는 에이전트에 이 요청의 정보가 전달될 수 있음에 동의합니다. 파트너 배정 전에는 공유되지 않습니다." : "I agree that this request may be shared with a verified school or agent. It will not be shared before a partner is assigned."}</span></label><button disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{isKo ? "동의하고 요청 보내기" : "Consent and submit request"}</button>{error && <p className="text-sm text-red-600">{error}</p>}</form></>}</section></main>
}
