"use client"

import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { ArrowRight, LoaderCircle, Mail, ShieldCheck } from "lucide-react"
import { recordFifoCommerceEvent } from "@/lib/analytics"
import {
  FIFO_REPORT_CHECKOUT_ATTEMPT_SESSION_KEY,
  FIFO_REPORT_CHECKOUT_SESSION_KEY,
  parseFifoReportCheckoutAttemptId,
  parseFifoReportCheckoutIdentity,
} from "@/lib/fifo/report-checkout-email"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE, formatAud } from "@/lib/report-catalog"

type CheckoutResponse = {
  ok?: boolean
  checkoutUrl?: string
  error?: string
}

export function FifoReportEmailCapture() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const price = formatAud(FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents)
  const termsHref = localizePath("/terms", locale)
  const privacyHref = localizePath("/privacy", locale)
  const [email, setEmail] = useState("")
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [digitalDeliveryConsent, setDigitalDeliveryConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [consentError, setConsentError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutCancelled, setCheckoutCancelled] = useState(false)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(FIFO_REPORT_CHECKOUT_SESSION_KEY)
      if (raw) {
        const parsed = parseFifoReportCheckoutIdentity(JSON.parse(raw))
        if (parsed.ok) {
          setEmail(parsed.value.email)
          setMarketingConsent(parsed.value.marketingConsent)
        }
      }
    } catch {
      // Session storage is a convenience only. Checkout must never depend on it.
    }

    const cancelled = new URLSearchParams(window.location.search).get("checkout") === "cancelled"
    setCheckoutCancelled(cancelled)
    recordFifoCommerceEvent("fifo_report_view", { surface: "fifo_report", locale })
    if (cancelled) {
      recordFifoCommerceEvent("fifo_checkout_cancelled", { surface: "fifo_report", locale })
    }
  }, [locale])

  const copy = isKo
    ? {
        eyebrow: "SECURE CHECKOUT",
        title: "리포트를 받을 이메일을 입력하고 결제로 이동하세요.",
        text: "이 이메일은 결제 처리와 구매 후 보안 다운로드 링크 전달에 사용됩니다. 마케팅 수신 동의와는 별개입니다.",
        label: "리포트 전달 이메일",
        placeholder: "you@example.com",
        marketing: "구매 후 CampCareer의 FIFO 업데이트도 가끔 이메일로 받기",
        marketingNote: "선택 사항입니다. 체크하지 않아도 구매와 리포트 전달에는 영향이 없습니다.",
        invalid: "올바른 이메일 주소를 입력해 주세요.",
        consentRequired: "결제로 이동하려면 즉시 디지털 전달 요청과 관련 고지를 확인해 주세요.",
        privacy: "계속하면 구매 이메일, 필수 디지털 전달 확인, 선택한 마케팅 선호도가 CampCareer 서버로 전송됩니다. 카드 정보는 Stripe Checkout에서 처리됩니다.",
        checkout: `Secure checkout · ${price}`,
        opening: "Stripe Checkout 여는 중…",
        unavailable: "지금 결제를 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.",
        cancelled: "이전 Checkout이 완료되지 않고 종료되었습니다. 결제 완료 주문으로 처리되지 않았으며, 아래에서 다시 시작할 수 있습니다.",
        checkoutNote: "Stripe hosted checkout · A$29 AUD 일회성 결제",
      }
    : {
        eyebrow: "SECURE CHECKOUT",
        title: "Enter the email that should receive the guide, then continue to payment.",
        text: "This email is used for the purchase flow and the secure guide-delivery link after payment. It is separate from marketing consent.",
        label: "Guide delivery email",
        placeholder: "you@example.com",
        marketing: "After purchase, also send me occasional CampCareer FIFO updates",
        marketingNote: "Optional. Leaving this unchecked does not affect checkout or guide delivery.",
        invalid: "Enter a valid email address.",
        consentRequired: "Confirm the immediate digital-delivery request and notice before continuing to payment.",
        privacy: "When you continue, your purchase email, required digital-delivery confirmation, and optional marketing preference are sent to CampCareer. Card details are handled on Stripe-hosted Checkout.",
        checkout: `Secure checkout · ${price}`,
        opening: "Opening Stripe Checkout…",
        unavailable: "Checkout could not be started right now. Please try again shortly.",
        cancelled: "Your previous Checkout ended before completion. It was not released as a paid order, and you can start again below.",
        checkoutNote: "Stripe-hosted checkout · A$29 AUD one-time payment",
      }

  function resetCheckoutAttempt() {
    try {
      window.sessionStorage.removeItem(FIFO_REPORT_CHECKOUT_ATTEMPT_SESSION_KEY)
    } catch {
      // A fresh UUID can still be generated when storage is unavailable.
    }
  }

  function checkoutAttemptId(): string {
    try {
      const existing = parseFifoReportCheckoutAttemptId(
        window.sessionStorage.getItem(FIFO_REPORT_CHECKOUT_ATTEMPT_SESSION_KEY),
      )
      if (existing) return existing

      const next = window.crypto.randomUUID()
      window.sessionStorage.setItem(FIFO_REPORT_CHECKOUT_ATTEMPT_SESSION_KEY, next)
      return next
    } catch {
      return window.crypto.randomUUID()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const parsed = parseFifoReportCheckoutIdentity({ email, marketingConsent })
    if (!parsed.ok) {
      setError(copy.invalid)
      return
    }
    if (!digitalDeliveryConsent) {
      setConsentError(copy.consentRequired)
      return
    }

    try {
      window.sessionStorage.setItem(FIFO_REPORT_CHECKOUT_SESSION_KEY, JSON.stringify(parsed.value))
    } catch {
      // Checkout can proceed even when storage is unavailable.
    }

    setEmail(parsed.value.email)
    setMarketingConsent(parsed.value.marketingConsent)
    setError(null)
    setConsentError(null)
    setCheckoutCancelled(false)
    setIsSubmitting(true)
    recordFifoCommerceEvent("fifo_checkout_started", { surface: "fifo_report", locale })

    try {
      const response = await fetch("/api/fifo/report/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          checkoutAttemptId: checkoutAttemptId(),
          email: parsed.value.email,
          marketingConsent: parsed.value.marketingConsent,
          digitalDeliveryConsent: true,
        }),
      })

      const data = (await response.json().catch(() => null)) as CheckoutResponse | null
      if (!response.ok || !data?.checkoutUrl) {
        recordFifoCommerceEvent("fifo_checkout_failed", {
          surface: "fifo_report",
          locale,
          reason: "checkout_response",
        })
        setError(copy.unavailable)
        return
      }

      recordFifoCommerceEvent("fifo_checkout_redirected", { surface: "fifo_report", locale })
      window.location.assign(data.checkoutUrl)
    } catch {
      recordFifoCommerceEvent("fifo_checkout_failed", {
        surface: "fifo_report",
        locale,
        reason: "checkout_network",
      })
      setError(copy.unavailable)
    } finally {
      setIsSubmitting(false)
    }
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
          {checkoutCancelled ? (
            <div role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
              {copy.cancelled}
            </div>
          ) : null}

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
              resetCheckoutAttempt()
            }}
            placeholder={copy.placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby="fifo-report-email-help"
            className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
          <div id="fifo-report-email-help" className="mt-2 min-h-5 text-xs leading-5">
            {error ? <span role="alert" className="font-medium text-red-700">{error}</span> : null}
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5">
            <input
              type="checkbox"
              name="digitalDeliveryConsent"
              required
              checked={digitalDeliveryConsent}
              onChange={(event) => {
                setDigitalDeliveryConsent(event.target.checked)
                setConsentError(null)
                resetCheckoutAttempt()
              }}
              aria-invalid={Boolean(consentError)}
              aria-describedby="fifo-report-digital-consent-help"
              className="mt-0.5 size-4 rounded border-slate-300"
            />
            <span className="text-[11px] leading-5 text-[hsl(var(--cc-ink-secondary))]">
              {isKo ? (
                <>
                  결제가 확인되면 디지털 가이드를 즉시 제공해 달라고 요청합니다. {" "}
                  <Link href={termsHref} className="font-semibold text-brand underline underline-offset-2">이용약관</Link>과 {" "}
                  <Link href={privacyHref} className="font-semibold text-brand underline underline-offset-2">개인정보 처리방침</Link>을 읽었으며,
                  적용 법률이 허용하는 경우 디지털 콘텐츠 제공이 시작된 후 단순 변심에 따른 철회권이 종료될 수 있음을 이해합니다.
                  미제공·하자·계약 불일치 등에 관한 법정 권리는 제한되지 않습니다.
                </>
              ) : (
                <>
                  I request immediate delivery of the digital guide after verified payment. I have read the {" "}
                  <Link href={termsHref} className="font-semibold text-brand underline underline-offset-2">Terms of Service</Link> and {" "}
                  <Link href={privacyHref} className="font-semibold text-brand underline underline-offset-2">Privacy Policy</Link>. I understand that,
                  where applicable law allows, my change-of-mind withdrawal right may end once the digital content is supplied.
                  This does not limit statutory rights for non-delivery, faults, or other non-conformity.
                </>
              )}
            </span>
          </label>
          <div id="fifo-report-digital-consent-help" className="mt-1.5 min-h-5 text-xs leading-5">
            {consentError ? <span role="alert" className="font-medium text-red-700">{consentError}</span> : null}
          </div>

          <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={marketingConsent}
              onChange={(event) => {
                setMarketingConsent(event.target.checked)
                setError(null)
                resetCheckoutAttempt()
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
            disabled={isSubmitting}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                {copy.opening}
              </>
            ) : (
              <>
                {copy.checkout}
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </button>

          <p className="mt-3 text-center text-[11px] leading-4 text-[hsl(var(--cc-muted))]">{copy.checkoutNote}</p>
        </form>
      </div>
    </section>
  )
}
