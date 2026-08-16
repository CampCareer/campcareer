"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, FileDown, Mail, ShieldCheck } from "lucide-react"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export function FifoReportSuccessPage() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const reportHref = localizePath("/fifo/report", locale)
  const fifoHref = localizePath("/fifo", locale)

  const copy = isKo
    ? {
        eyebrow: "PAYMENT COMPLETE",
        title: "결제가 완료되었습니다.",
        intro: "구매 시 입력한 이메일에서 안전한 가이드 다운로드 링크를 확인하세요.",
        emailTitle: "이메일로 전달됩니다",
        emailText: "결제는 서버에서 확인되며, 확인된 주문에만 비공개 PDF 다운로드 링크가 전송됩니다.",
        secureTitle: "다운로드 링크는 비공개입니다",
        secureText: "CampCareer는 공개 PDF 주소를 노출하지 않고, 구매 주문에 연결된 만료형 링크를 사용합니다.",
        deliveryTitle: "이메일이 아직 보이지 않나요?",
        deliveryText: "받은편지함과 스팸함을 확인해 주세요. 결제 확인과 이메일 전달은 이 성공 화면과 별도로 서버에서 처리됩니다.",
        backReport: "가이드 페이지로 돌아가기",
        explore: "FIFO 직업 살펴보기",
        note: "이 화면 자체는 결제 증명이나 PDF 접근 권한으로 사용되지 않습니다.",
      }
    : {
        eyebrow: "PAYMENT COMPLETE",
        title: "Your payment is complete.",
        intro: "Check the email used at checkout for your secure guide download link.",
        emailTitle: "Delivered by email",
        emailText: "Payment is verified server-side, and the private PDF link is sent only for a verified paid order.",
        secureTitle: "Your download link stays private",
        secureText: "CampCareer does not expose the master PDF publicly. Delivery uses an expiring link tied to the paid order.",
        deliveryTitle: "Email not visible yet?",
        deliveryText: "Check your inbox and spam folder. Payment verification and email delivery run server-side, separately from this return page.",
        backReport: "Back to guide page",
        explore: "Explore FIFO jobs",
        note: "This return page is not itself proof of payment and does not grant PDF access.",
      }

  return (
    <main className="min-h-[72vh] bg-[linear-gradient(180deg,#f6f9ff_0%,#ffffff_72%)] px-5 py-14 text-[hsl(var(--cc-ink))] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[760px]">
        <div className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_24px_80px_rgba(24,76,146,0.12)] sm:p-10">
          <div className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </div>

          <p className="mt-7 text-xs font-semibold tracking-[0.12em] text-brand">{copy.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-[hsl(var(--cc-ink-secondary))]">{copy.intro}</p>

          <div className="mt-8 grid gap-3">
            <SuccessItem icon={<Mail className="size-5" aria-hidden="true" />} title={copy.emailTitle} text={copy.emailText} />
            <SuccessItem icon={<ShieldCheck className="size-5" aria-hidden="true" />} title={copy.secureTitle} text={copy.secureText} />
            <SuccessItem icon={<FileDown className="size-5" aria-hidden="true" />} title={copy.deliveryTitle} text={copy.deliveryText} />
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
