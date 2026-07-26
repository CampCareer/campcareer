"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowRight, Check, CheckCircle2, FileCheck2, Loader2, LockKeyhole, MailCheck, ShieldCheck, Sparkles } from "lucide-react"
import { REPORT_PRODUCTS, formatAud, type ReportProductId } from "@/lib/report-catalog"
import { localizePath, localeFromPathname } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { recordReportEvent, track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

type FormStatus = "idle" | "submitting" | "success" | "waiting" | "duplicate" | "error"

const launchProducts = REPORT_PRODUCTS

export function AustraliaReportLaunch() {
  const pathname = usePathname()
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const pathLocale = localeFromPathname(pathname) ?? locale
  const [email, setEmail] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<ReportProductId[]>(["australia-study-roi-index-2026"])
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")
  const [error, setError] = useState("")
  const [started, setStarted] = useState(false)

  const copy = isKo ? {
    eyebrow: "호주 리포트 출시 준비",
    title: "유학 결정을 위한 숫자를, 내 조건에 맞게 읽으세요.",
    description: "CampCareer는 호주의 전공·도시·대학을 학비, 생활비, 취업 성과, 연봉, 직업 수요 관점에서 한 흐름으로 비교합니다. 현재는 근거와 전달 절차를 검증 중입니다.",
    noSale: "아직 결제를 받지 않습니다",
    noSaleDetail: "출시 알림을 신청해도 구매·예약·카드 결제가 발생하지 않습니다.",
    reportHeading: "출시 준비 중인 리포트",
    topic: "분야·도시·대학 중 한 주제를 깊게 보는 리포트",
    index: "호주 전체의 전공·대학·도시 ROI를 빠르게 읽는 리포트",
    personal: "내 조건과 Option A/B/C를 비교해 실행계획까지 정리하는 리포트",
    expert: "전문가가 의사결정 맥락을 검토하고 실행을 돕는 서비스",
    upgrade: "ROI Index 구매자는 A$30 업그레이드 예정",
    pages: "{min}–{max}페이지 · 목표 {target}페이지",
    whatNow: "지금 무료로 할 수 있는 일",
    freeSteps: [
      ["1", "검색", "목표·예산·기간으로 호주 분야를 좁힙니다."],
      ["2", "대학·도시 비교", "학비와 교육기관 성과를 같은 기준으로 확인합니다."],
      ["3", "후보 저장", "개인화 리포트에 쓸 선택지를 최대 세 곳까지 정리합니다."],
    ],
    gateHeading: "판매 전 반드시 통과할 기준",
    gates: ["각 핵심 수치의 출처·기준일·신뢰도 검토", "도시별 생활비·주거 가정과 투자회수 산식 검증", "결제·환불·전달 정책 공개", "전문가 검토의 자격·일정·정산 운영 확정"],
    formEyebrow: "출시 알림",
    formHeading: "준비가 끝난 리포트만 알려드릴게요.",
    formBody: "관심 있는 리포트를 선택하고 이메일을 확인해 주세요. 리포트가 실제로 결제 가능한 상태가 될 때만 안내합니다.",
    email: "이메일", placeholder: "name@example.com", interests: "관심 리포트", consent: "선택한 호주 리포트의 출시 알림을 이메일로 받는 데 동의합니다.",
    consentHelp: "이메일 확인 전에는 알림이 활성화되지 않습니다. 언제든 수신 거부할 수 있습니다.",
    submit: "출시 알림 신청", submitting: "신청 중…", success: "확인 메일을 보냈습니다. 받은 편지함에서 이메일을 확인해 주세요.",
    duplicate: "이 이메일은 이미 출시 알림을 확인했습니다. 선택한 관심 리포트는 업데이트되었습니다.", waiting: "확인 메일이 이미 발송되었습니다. 최대 15분 정도 기다린 뒤 받은 편지함과 스팸함을 확인해 주세요.",
    errorInvalid: "올바른 이메일 주소를 입력해 주세요.", errorProduct: "관심 있는 리포트를 하나 이상 선택해 주세요.", errorConsent: "출시 알림 수신 동의가 필요합니다.", errorGeneric: "지금은 신청을 완료할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    workspace: "내 선택지로 리포트 준비", workspaceDetail: "로그인 후 조건과 후보를 저장할 수 있습니다.",
    pathfinder: "검색", privacy: "개인정보 처리방침", terms: "이용약관", disclaimer: "CampCareer의 데이터와 리포트는 의사결정 보조 자료이며 비자, 입학, 취업, 수입을 보장하지 않습니다.",
  } : {
    eyebrow: "Australia report launch preparation",
    title: "Read the numbers behind your Australia decision in the context of your life.",
    description: "CampCareer compares Australian fields, cities, and universities through tuition, living costs, graduate outcomes, pay, and occupation demand. We are still verifying the evidence and delivery process.",
    noSale: "We are not taking payment yet",
    noSaleDetail: "A launch-update request does not create a purchase, booking, or card charge.",
    reportHeading: "Reports in preparation",
    topic: "A focused look at one field, city, or university.",
    index: "A fast way to read the relative ROI of Australian fields, providers, and cities.",
    personal: "A decision and action plan that compares your circumstances with Options A, B, and C.",
    expert: "An expert reviews your decision context and helps turn it into practical next steps.",
    upgrade: "ROI Index customers will be eligible for a planned A$30 upgrade.",
    pages: "{min}–{max} pages · {target}-page target",
    whatNow: "What you can do free today",
    freeSteps: [
      ["1", "Search", "Narrow Australia study fields around your goal, budget, and timeline."],
      ["2", "Compare providers and cities", "Read tuition and provider outcomes on the same basis."],
      ["3", "Save a shortlist", "Prepare up to three options for a future personalised report."],
    ],
    gateHeading: "What must be complete before we sell",
    gates: ["Source, as-of date, and confidence review for every material number", "City cost, housing assumptions, and payback-method verification", "Published payment, refund, and delivery policies", "Confirmed expert eligibility, scheduling, and settlement operations"],
    formEyebrow: "Launch update",
    formHeading: "We will only email you about reports that are genuinely ready.",
    formBody: "Choose the reports you care about and confirm your email. We will contact you only when a report can actually be purchased.",
    email: "Email", placeholder: "name@example.com", interests: "Reports you are interested in", consent: "I agree to receive email updates when my selected Australia reports launch.",
    consentHelp: "Nothing becomes active until you confirm your email. You can unsubscribe at any time.",
    submit: "Request launch update", submitting: "Requesting…", success: "We sent a confirmation email. Please check your inbox to activate the update.",
    duplicate: "This email has already confirmed a launch update. We updated your report interests.", waiting: "A confirmation email was already sent. Please allow up to 15 minutes, then check your inbox and spam folder.",
    errorInvalid: "Enter a valid email address.", errorProduct: "Choose at least one report.", errorConsent: "Please agree to receive the launch update.", errorGeneric: "We could not complete the request right now. Please try again shortly.",
    workspace: "Prepare a report with my shortlist", workspaceDetail: "Sign in to save your conditions and options.",
    pathfinder: "Search", privacy: "Privacy Policy", terms: "Terms of Service", disclaimer: "CampCareer data and reports are decision aids. They do not guarantee visa, admission, employment, income, or investment outcomes.",
  }

  useEffect(() => {
    recordReportEvent("report_launch_view", { surface: "report_launch", country: "AU", locale })
  }, [locale])

  const productCards = useMemo(() => launchProducts.map((product) => ({
    product,
    description: product.id === "australia-topic-deep-dive" ? copy.topic
      : product.id === "australia-study-roi-index-2026" ? copy.index
        : product.id === "my-australia-roi-decision-report" ? copy.personal : copy.expert,
  })), [copy.expert, copy.index, copy.personal, copy.topic])

  function toggleProduct(productId: ReportProductId) {
    setSelectedProducts((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId])
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "submitting") return
    setError("")
    if (selectedProducts.length === 0) { setError(copy.errorProduct); return }
    if (!consent) { setError(copy.errorConsent); return }

    setStatus("submitting")
    try {
      const response = await fetch("/api/reports/launch-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productIds: selectedProducts, locale, sourcePath: pathname, consent, website }),
      })
      const data = await response.json().catch(() => null) as { ok?: boolean; alreadyConfirmed?: boolean; confirmationEmailSent?: boolean; error?: string } | null
      if (!response.ok || !data?.ok) {
        setStatus("error")
        setError(data?.error === "invalid_email" ? copy.errorInvalid : data?.error === "missing_product" ? copy.errorProduct : data?.error === "consent_required" ? copy.errorConsent : copy.errorGeneric)
        return
      }
      track("report_launch_interest_submitted", { country: "AU", report_products: selectedProducts.join(",") })
      setStatus(data.alreadyConfirmed ? "duplicate" : data.confirmationEmailSent ? "success" : "waiting")
    } catch {
      setStatus("error")
      setError(copy.errorGeneric)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_42%)]">
      <section className="border-b border-blue-100 bg-[linear-gradient(130deg,#eff6ff_0%,#ffffff_65%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
          <div className="max-w-3xl"><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-blue-700">{copy.eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{copy.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{copy.description}</p><div className="mt-6 inline-flex max-w-xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"><LockKeyhole className="mt-0.5 size-4 shrink-0" /><span><strong>{copy.noSale}</strong><span className="mt-0.5 block text-xs leading-5 text-amber-800">{copy.noSaleDetail}</span></span></div><div className="mt-7 flex flex-wrap gap-3"><Link href={localizePath("/au/study", pathLocale)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800">{copy.pathfinder}<ArrowRight className="size-4" /></Link><Link href={localizePath("/report", pathLocale)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700"><FileCheck2 className="size-4" />{copy.workspace}</Link></div></div>
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(30,64,175,.09)]"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">{copy.gateHeading}</p><ul className="mt-4 space-y-3">{copy.gates.map((gate) => <li key={gate} className="flex gap-2.5 text-sm leading-5 text-slate-700"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />{gate}</li>)}</ul></aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-blue-700">Australia only · 2026</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{copy.reportHeading}</h2></div><p className="max-w-md text-sm leading-5 text-slate-600">{copy.workspaceDetail}</p></div><div className="mt-6 grid gap-4 md:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[.12em] text-blue-700">{copy.whatNow}</p><div className="mt-4 space-y-4">{copy.freeSteps.map(([number, title, description]) => <div key={number} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{number}</span><p className="text-sm leading-5 text-slate-700"><strong className="block text-slate-950">{title}</strong>{description}</p></div>)}</div></article>{productCards.map(({ product, description }) => <article key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div><p className="text-xl font-semibold tracking-tight text-slate-950">{isKo ? product.titleKo : product.title}</p><p className="mt-2 text-sm leading-5 text-slate-600">{description}</p></div><span className="shrink-0 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">{formatAud(product.amountAudCents)}</span></div>{product.pageCount && <p className="mt-4 text-xs text-slate-500">{copy.pages.replace("{min}", String(product.pageCount.min)).replace("{max}", String(product.pageCount.max)).replace("{target}", String(product.pageCount.target))}</p>}{product.id === "my-australia-roi-decision-report" && <p className="mt-3 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800">{copy.upgrade}</p>}</article>)}</div></section>

      <section className="border-y border-slate-200 bg-slate-50"><div className="mx-auto grid max-w-6xl gap-7 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_25rem]"><div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-blue-700">{copy.formEyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{copy.formHeading}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{copy.formBody}</p><p className="mt-7 max-w-xl text-xs leading-5 text-slate-500">{copy.disclaimer}</p></div><form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,.08)]"><label className="block text-sm font-semibold text-slate-800">{copy.email}<input type="email" required value={email} onFocus={() => { if (!started) { setStarted(true); track("report_launch_interest_started", { country: "AU" }) } }} onChange={(event) => setEmail(event.target.value)} placeholder={copy.placeholder} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label><input aria-hidden tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" /><fieldset className="mt-5"><legend className="text-sm font-semibold text-slate-800">{copy.interests}</legend><div className="mt-2 space-y-2">{launchProducts.map((product) => <label key={product.id} className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/40"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => toggleProduct(product.id)} className="mt-0.5 size-4 accent-blue-600" /><span className="min-w-0 flex-1"><span className="font-medium text-slate-900">{isKo ? product.titleKo : product.title}</span><span className="ml-1.5 text-xs text-slate-500">{formatAud(product.amountAudCents)}</span></span></label>)}</div></fieldset><label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-600"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-blue-600" /><span>{copy.consent}<span className="mt-1 block text-slate-500">{copy.consentHelp}</span></span></label><button type="submit" disabled={status === "submitting"} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70">{status === "submitting" ? <Loader2 className="size-4 animate-spin" /> : <MailCheck className="size-4" />}{status === "submitting" ? copy.submitting : copy.submit}</button>{(status === "success" || status === "waiting" || status === "duplicate") && <p role="status" className="mt-4 flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />{status === "success" ? copy.success : status === "waiting" ? copy.waiting : copy.duplicate}</p>}{error && <p role="alert" className="mt-4 text-xs font-medium text-rose-700">{error}</p>}<p className="mt-4 text-center text-[11px] text-slate-500"><Link href={localizePath("/privacy", pathLocale)} className="underline underline-offset-2 hover:text-slate-700">{copy.privacy}</Link><span className="mx-2">·</span><Link href={localizePath("/terms", pathLocale)} className="underline underline-offset-2 hover:text-slate-700">{copy.terms}</Link></p></form></div></section>
    </main>
  )
}
