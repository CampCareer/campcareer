"use client"

import { useEffect, useState, type FormEvent } from "react"
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react"
import {
  FIFO_REPORT_CHECKOUT_SESSION_KEY,
  parseFifoReportCheckoutIdentity,
} from "@/lib/fifo/report-checkout-email"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE, formatAud } from "@/lib/report-catalog"

export function FifoReportEmailCapture() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const price = formatAud(FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents)
  const [email, setEmail] = useState("")
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(FIFO_REPORT_CHECKOUT_SESSION_KEY)
      if (!raw) return
      const parsed = parseFifoReportCheckoutIdentity(JSON.parse(raw))
      if (!parsed.ok) return
      setEmail(parsed.value.email)
      setMarketingConsent(parsed.value.marketingConsent)
      setSaved(true)
    } catch {
      // Session storage is a convenience only. Checkout must never depend on it.
    }
  }, [])

  const copy = isKo
    ? {
        eyebrow: "PURCHASE EMAIL",
        title: "리포트를 받을 이메일을 먼저 입력하세요.",
        text: "이 이메일은 결제 영수증과 구매 후 보안 다운로드 링크 전달에 사용됩니다. 마케팅 수신 동의와는 별개입니다.",
        label: "리포트 전달 이메일",
        placeholder: "you@example.com",
        marketing: "구매 후 CampCareer의 FIFO 업데이트도 가끔 이메일로 받기",
        marketingNote: "선택 사항입니다. 체크하지 않아도 구매와 리포트 전달에는 영향이 없습니다.",
        save: "결제용 이메일 저장",
        saved: "이 브라우저 세션에 저장했습니다. 아직 결제되거나 이메일이 발송된 것은 아닙니다.",
        invalid: "올바른 이메일 주소를 입력해 주세요.",
        privacy: "이 단계에서는 서버에 이메일을 저장하지 않습니다. 결제가 연결되면 구매 처리에 필요한 시점에만 전달됩니다.",
        checkout: `Secure checkout · ${price}`,
        checkoutNote: "결제 연결 전까지 구매 버튼은 잠겨 있습니다.",
      }
    : {
        eyebrow: "PURCHASE EMAIL",
        title: "Enter the email that should receive the guide.",
        text: "This email is for the payment receipt and the secure guide-delivery link after purchase. It is separate from marketing consent.",
        label: "Guide delivery email",
        placeholder: "you@example.com",
        marketing: "After purchase, also send me occasional CampCareer FIFO updates",
        marketingNote: "Optional. Leaving this unchecked does not affect checkout or guide delivery.",
        save: "Save email for checkout",
        saved: "Saved for this browser session. Nothing has been charged or emailed yet.",
        invalid: "Enter a valid email address.",
        privacy: "At this step the email stays in this browser session. It will only be sent to the server when the purchase flow requires it.",
        checkout: `Secure checkout · ${price}`,
        checkoutNote: "The purchase button stays locked until payment wiring is enabled.",
      }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = parseFifoReportCheckoutIdentity({ email, marketingConsent })
    if (!parsed.ok) {
      setError(copy.invalid)
      setSaved(false)
      return
    }

    try {
      window.sessionStorage.setItem(FIFO_REPORT_CHECKOUT_SESSION_KEY, JSON.stringify(parsed.value))
    } catch {
      // The form can still continue later even if storage is unavailable.
    }

    setEmail(parsed.value.email)
    setMarketingConsent(parsed.value.marketingConsent)
    setError(null)
    setSaved(true)
  }

  return (
    <section
      id="report-checkout-email"
      data-testid="fifo-report-email-capture"
      aria-labelledby="fifo-report-email-capture-heading"
      className="border-t border-[hsl(var(--cc-border))] bg-white px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto grid max-w-[980px] gap-8 rounded-[26px] border border-blue-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_60%,#f3f8ff_100%)] p-6 shadow-[0_18px_50px_rgba(24,76,146,0.07)] sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand">
            <Mail className="size-4" aria-hidden="true" />
            {copy.eyebrow}
          </div>
          <h2 id="fifo-report-email-capture-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[hsl(var(--cc-ink-secondary))]">{copy.text}</p>
          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 text-xs leading-5 text-[hsl(var(--cc-muted))]">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <span>{copy.privacy}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-[20px] border border-[hsl(var(--cc-border))] bg-white p-5 sm:p-6">
          <label htmlFor="fifo-report-delivery-email" className="text-sm font-semibold text-[hsl(var(--cc-ink))]">
            {copy.label}
          </label>
          <input
            id="fifo-report-delivery-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={320}
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError(null)
              setSaved(false)
            }}
            placeholder={copy.placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby="fifo-report-email-help"
            className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
          <div id="fifo-report-email-help" className="mt-2 min-h-5 text-xs leading-5">
            {error ? <span className="font-medium text-red-700">{error}</span> : null}
            {saved ? (
              <span role="status" className="inline-flex items-start gap-1.5 font-medium text-emerald-700">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                {copy.saved}
              </span>
            ) : null}
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={marketingConsent}
              onChange={(event) => {
                setMarketingConsent(event.target.checked)
                setSaved(false)
              }}
              className="mt-0.5 size-4 rounded border-slate-300"
            />
            <span>
              <span className="block text-xs font-semibold leading-5 text-[hsl(var(--cc-ink))]">{copy.marketing}</span>
              <span className="mt-0.5 block text-[11px] leading-4 text-[hsl(var(--cc-muted))]">{copy.marketingNote}</span>
            </span>
          </label>

          <button
            type="submit"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
          >
            {copy.save}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>

          <div className="mt-4 border-t border-[hsl(var(--cc-border))] pt-4 text-center">
            <p className="text-sm font-semibold text-[hsl(var(--cc-ink))]">{copy.checkout}</p>
            <p className="mt-1 text-[11px] leading-4 text-[hsl(var(--cc-muted))]">{copy.checkoutNote}</p>
          </div>
        </form>
      </div>
    </section>
  )
}
