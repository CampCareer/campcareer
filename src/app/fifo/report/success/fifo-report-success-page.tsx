"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, FileDown, Mail, ShieldCheck } from "lucide-react"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export type FifoReportReturnStatus = "delivered" | "paid" | "processing" | "problem" | "unverified"

export function FifoReportSuccessPage({ status }: { status: FifoReportReturnStatus }) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const reportHref = localizePath("/fifo/report", locale)
  const fifoHref = localizePath("/fifo", locale)
  const isConfirmed = status === "delivered" || status === "paid"

  const copy = isKo
    ? getKoreanCopy(status)
    : getEnglishCopy(status)

  return (
    <main className="min-h-[72vh] bg-[linear-gradient(180deg,#f6f9ff_0%,#ffffff_72%)] px-5 py-14 text-[hsl(var(--cc-ink))] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[760px]">
        <div className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_24px_80px_rgba(24,76,146,0.12)] sm:p-10">
          <div className={`grid size-14 place-items-center rounded-2xl ${isConfirmed ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-brand"}`}>
            {isConfirmed ? <CheckCircle2 className="size-8" aria-hidden="true" /> : <ShieldCheck className="size-8" aria-hidden="true" />}
          </div>

          <p className="mt-7 text-xs font-semibold tracking-[0.12em] text-brand">{copy.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-[hsl(var(--cc-ink-secondary))]">{copy.intro}</p>

          <div className="mt-8 grid gap-3">
            <SuccessItem icon={<Mail className="size-5" aria-hidden="true" />} title={copy.primaryTitle} text={copy.primaryText} />
            <SuccessItem icon={<ShieldCheck className="size-5" aria-hidden="true" />} title={copy.secureTitle} text={copy.secureText} />
            <SuccessItem icon={<FileDown className="size-5" aria-hidden="true" />} title={copy.helpTitle} text={copy.helpText} />
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[hsl(var(--cc-border))] pt-6 sm:flex-row">
            <Link
              href={reportHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {copy.backReport}
            </Link>
            <Link
              href={fifoHref}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[hsl(var(--cc-border))] bg-white px-5 py-3 text-sm font-semibold text-[hsl(var(--cc-ink))] transition hover:bg-slate-50"
            >
              {copy.explore}
            </Link>
          </div>

          <p className="mt-5 text-xs leading-5 text-[hsl(var(--cc-muted))]">{copy.note}</p>
        </div>
      </div>
    </main>
  )
}

function getEnglishCopy(status: FifoReportReturnStatus) {
  const shared = {
    secureTitle: "Your guide stays private",
    secureText: "CampCareer does not expose the master PDF publicly. Verified purchases receive an expiring private download link.",
    backReport: "Back to guide page",
    explore: "Explore FIFO jobs",
  }

  if (status === "delivered") {
    return {
      ...shared,
      eyebrow: "PURCHASE VERIFIED",
      title: "Your guide has been delivered.",
      intro: "Payment is confirmed and the secure download email has been sent to the address used at checkout.",
      primaryTitle: "Delivered by email",
      primaryText: "The verified paid order has completed delivery through CampCareer's transactional email flow.",
      helpTitle: "Email not visible?",
      helpText: "Check your inbox and spam folder. The private download link expires, so open the most recent CampCareer delivery email.",
      note: "This page reflects the server-side order state. The email link, not this page, grants temporary PDF access.",
    }
  }

  if (status === "paid") {
    return {
      ...shared,
      eyebrow: "PAYMENT VERIFIED",
      title: "Your payment is confirmed.",
      intro: "The order is paid and the secure guide-delivery email is being prepared.",
      primaryTitle: "Payment verified server-side",
      primaryText: "CampCareer has confirmed the paid order before beginning private PDF delivery.",
      helpTitle: "Delivery may take a moment",
      helpText: "Check your inbox shortly. If the email is not visible yet, also check spam before returning to the guide page.",
      note: "This page does not expose the master PDF or create a second delivery request.",
    }
  }

  if (status === "processing") {
    return {
      ...shared,
      eyebrow: "VERIFYING PAYMENT",
      title: "We are confirming your purchase.",
      intro: "The checkout return was recognized, but the server-side payment state is still being finalized.",
      primaryTitle: "Verification is still processing",
      primaryText: "The paid state comes from Stripe's verified server event, not from the browser return page.",
      helpTitle: "What happens next",
      helpText: "Once payment is confirmed, the secure guide email is sent automatically. Check your inbox again shortly.",
      note: "Refreshing this page does not charge you again and does not bypass payment verification.",
    }
  }

  if (status === "problem") {
    return {
      ...shared,
      eyebrow: "CHECKOUT NOT CONFIRMED",
      title: "This checkout is not in a completed payment state.",
      intro: "CampCareer found the checkout, but the order is not currently marked as paid.",
      primaryTitle: "No paid delivery was released",
      primaryText: "The private guide is only sent after the server confirms a successful payment.",
      helpTitle: "Try again from the guide page",
      helpText: "Return to the report page and start checkout again if you still want to purchase the guide.",
      note: "If you believe you were charged, keep your Stripe receipt and contact CampCareer before retrying multiple times.",
    }
  }

  return {
    ...shared,
    eyebrow: "RETURN LINK NOT VERIFIED",
    title: "We could not verify this checkout return link.",
    intro: "Open the confirmation page through the normal Stripe checkout return instead of entering this address directly.",
    primaryTitle: "No verified order was found",
    primaryText: "CampCareer does not treat a success-page URL by itself as proof of payment.",
    helpTitle: "Return to the guide page",
    helpText: "If you have not purchased yet, start again from the report page. If you already paid, use the original checkout return or your delivery email.",
    note: "No PDF access is granted from an unverified return link.",
  }
}

function getKoreanCopy(status: FifoReportReturnStatus) {
  const shared = {
    secureTitle: "가이드는 비공개로 유지됩니다",
    secureText: "CampCareer는 원본 PDF 주소를 공개하지 않습니다. 확인된 구매 주문에만 만료형 비공개 다운로드 링크가 발급됩니다.",
    backReport: "가이드 페이지로 돌아가기",
    explore: "FIFO 직업 살펴보기",
  }

  if (status === "delivered") {
    return {
      ...shared,
      eyebrow: "PURCHASE VERIFIED",
      title: "가이드 전달이 완료되었습니다.",
      intro: "결제가 확인되었고, 결제 시 사용한 이메일로 안전한 다운로드 링크를 보냈습니다.",
      primaryTitle: "이메일 전달 완료",
      primaryText: "확인된 유료 주문에 대해 CampCareer의 transactional email 전달이 완료되었습니다.",
      helpTitle: "이메일이 보이지 않나요?",
      helpText: "받은편지함과 스팸함을 확인해 주세요. 다운로드 링크는 만료되므로 가장 최근 CampCareer 전달 이메일을 사용하세요.",
      note: "이 화면은 서버의 주문 상태를 반영합니다. 실제 임시 PDF 접근 권한은 이메일의 비공개 링크가 제공합니다.",
    }
  }

  if (status === "paid") {
    return {
      ...shared,
      eyebrow: "PAYMENT VERIFIED",
      title: "결제가 확인되었습니다.",
      intro: "주문은 결제 완료 상태이며, 안전한 가이드 전달 이메일을 준비하고 있습니다.",
      primaryTitle: "서버에서 결제를 확인했습니다",
      primaryText: "CampCareer는 유료 주문을 확인한 뒤에만 비공개 PDF 전달을 시작합니다.",
      helpTitle: "이메일 전달에 잠시 걸릴 수 있습니다",
      helpText: "잠시 후 받은편지함을 확인해 주세요. 보이지 않으면 스팸함도 확인한 뒤 가이드 페이지로 돌아가세요.",
      note: "이 화면은 원본 PDF를 노출하거나 중복 이메일 발송을 요청하지 않습니다.",
    }
  }

  if (status === "processing") {
    return {
      ...shared,
      eyebrow: "VERIFYING PAYMENT",
      title: "구매를 확인하고 있습니다.",
      intro: "Checkout 반환은 확인했지만 서버의 최종 결제 상태가 아직 처리 중입니다.",
      primaryTitle: "결제 확인 처리 중",
      primaryText: "유료 상태는 브라우저 성공 화면이 아니라 Stripe의 검증된 서버 이벤트를 기준으로 확정됩니다.",
      helpTitle: "다음 단계",
      helpText: "결제가 확인되면 안전한 가이드 이메일이 자동 발송됩니다. 잠시 후 받은편지함을 다시 확인해 주세요.",
      note: "이 페이지를 새로고침해도 다시 결제되지 않으며 결제 검증을 우회하지도 않습니다.",
    }
  }

  if (status === "problem") {
    return {
      ...shared,
      eyebrow: "CHECKOUT NOT CONFIRMED",
      title: "이 Checkout은 결제 완료 상태가 아닙니다.",
      intro: "Checkout 주문은 찾았지만 현재 서버에서 paid 상태로 확인되지 않습니다.",
      primaryTitle: "유료 전달이 실행되지 않았습니다",
      primaryText: "비공개 가이드는 서버에서 결제 성공이 확인된 뒤에만 발송됩니다.",
      helpTitle: "가이드 페이지에서 다시 시도하세요",
      helpText: "아직 구매를 원한다면 리포트 페이지로 돌아가 Checkout을 다시 시작하세요.",
      note: "실제로 결제됐다고 생각되면 여러 번 재시도하기 전에 Stripe 영수증을 보관하고 CampCareer에 문의하세요.",
    }
  }

  return {
    ...shared,
    eyebrow: "RETURN LINK NOT VERIFIED",
    title: "이 결제 반환 링크를 확인할 수 없습니다.",
    intro: "이 주소를 직접 입력하지 말고 정상적인 Stripe Checkout 완료 후 돌아오는 링크를 사용하세요.",
    primaryTitle: "확인된 주문을 찾지 못했습니다",
    primaryText: "CampCareer는 성공 페이지 URL 자체를 결제 증명으로 사용하지 않습니다.",
    helpTitle: "가이드 페이지로 돌아가세요",
    helpText: "아직 구매하지 않았다면 리포트 페이지에서 다시 시작하세요. 이미 결제했다면 원래 Checkout 반환 링크나 전달 이메일을 사용하세요.",
    note: "검증되지 않은 반환 링크에서는 PDF 접근 권한이 제공되지 않습니다.",
  }
}

function SuccessItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[hsl(var(--cc-border))] bg-slate-50/70 p-4 sm:p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span>
      <div>
        <h2 className="text-base font-semibold tracking-[-0.02em]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[hsl(var(--cc-ink-secondary))]">{text}</p>
      </div>
    </div>
  )
}
