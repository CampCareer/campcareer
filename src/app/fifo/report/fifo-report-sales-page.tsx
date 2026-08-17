"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  FileText,
  MapPin,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { FIFO_REPORT_COVER_PREVIEW } from "@/lib/fifo/report-preview-cover"
import {
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE,
  formatAud,
} from "@/lib/report-catalog"

const contentsEn = [
  "FIFO Construction Reality Check",
  "Jobs You Can Actually Target",
  "The FIFO Ticket Map",
  "Fastest Entry Pathways",
  "Salary & Roster Reality",
  "Getting the First FIFO Job",
  "What Employers Are Actually Asking For",
  "Where to Train & What to Self-Fund",
  "From Arrival to Your First FIFO Job",
  "Sources & Data Date",
]

const contentsKo = [
  "FIFO Construction Reality Check",
  "실제로 노릴 수 있는 직업",
  "FIFO Ticket Map",
  "가장 빠른 진입 경로",
  "급여와 로스터 현실",
  "첫 FIFO 직장을 얻는 과정",
  "고용주가 실제로 요구하는 것",
  "어디서 교육받고 무엇을 직접 결제할지",
  "호주 도착부터 첫 FIFO 직장까지",
  "출처와 데이터 기준일",
]

export function FifoReportSalesPage() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const product = FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE
  const price = formatAud(product.amountAudCents)
  const title = isKo ? product.titleKo : product.title
  const fifoHref = localizePath("/fifo", locale)
  const contents = isKo ? contentsKo : contentsEn

  const copy = isKo
    ? {
        eyebrow: "WESTERN AUSTRALIA · EDITION 1.0",
        headline: "FIFO에 들어갈 때 무엇부터 해야 할지 한 번에 판단하세요.",
        intro:
          "직업을 먼저 고르고, 필요한 티켓만 사고, 실제 고용주 요구사항에 맞춰 지원하는 순서로 만든 실전 가이드입니다.",
        complete: "완성된 디지털 가이드",
        pages: "23페이지",
        reviewed: "2026년 8월 16일 데이터 검토",
        region: "Western Australia",
        primary: `가이드 구매 — ${price}`,
        checkoutNote: "이메일을 입력한 뒤 Stripe 보안 결제로 이동합니다.",
        back: "FIFO 직업으로 돌아가기",
        decisionEyebrow: "WHAT THIS GUIDE HELPS YOU DECIDE",
        decisionTitle: "정보를 더 모으는 것보다, 다음 행동을 정하는 데 초점을 맞췄습니다.",
        roleTitle: "어떤 직업을 노릴지",
        roleText: "Trade Assistant, Scaffolder, Rigger / Dogger, Plant Operator와 기존 trade 경로를 진입 장벽 기준으로 비교합니다.",
        ticketTitle: "어떤 티켓에 돈을 쓸지",
        ticketText: "White Card, WAH, Confined Space, Gas Test, EWP, Scaffolding, Dogging, Rigging의 비용과 교육시간을 비교합니다.",
        moneyTitle: "얼마를 쓰고 얼마나 걸릴지",
        moneyText: "최저비용, broad safety stack, scaffolding, dogging + rigging, plant operator 경로의 비용과 기간을 나란히 봅니다.",
        hireTitle: "실제로 무엇이 채용을 막는지",
        hireText: "경력, licence, driver's licence, White Card, medical/D&A, site clearance와 recruiter 단계까지 실제 채용 마찰을 봅니다.",
        previewEyebrow: "ACTUAL GUIDE PREVIEW",
        previewTitle: "완성된 Edition 1.0의 실제 페이지를 확인하세요.",
        previewText: "아래 이미지는 완성된 23페이지 PDF에서 직접 렌더링한 실제 페이지입니다. 유료 콘텐츠 전체를 공개하지 않도록 축소된 미리보기로 제공합니다.",
        actualPage: "실제 페이지",
        insideEyebrow: "INSIDE THE GUIDE",
        insideTitle: "Role → Tickets → Application strategy",
        insideText: "가이드는 처음부터 끝까지 이 순서로 읽도록 구성되어 있습니다.",
        proofEyebrow: "WHY CAMPCAREER BUILT IT THIS WAY",
        proofTitle: "티켓을 많이 모으는 것이 목표가 아닙니다.",
        proofText:
          "가이드의 핵심 원칙은 목표 직업을 먼저 정한 뒤, 그 직업의 법적·상업적 장벽을 실제로 낮추는 최소한의 티켓을 사는 것입니다.",
        proofOneValue: "95%",
        proofOneLabel: "검토한 19개 광고 중 relevant experience를 언급",
        proofTwoValue: "A$100–120",
        proofTwoLabel: "White Card only 최저비용 경로의 현재 Perth 예시",
        proofThreeValue: "~9 days",
        proofThreeLabel: "Dogging + Basic Rigging 경로의 대략적인 교육시간",
        employerNote:
          "Tickets make you eligible. Experience makes you competitive. 가이드는 이 둘을 같은 것으로 취급하지 않습니다.",
        forEyebrow: "WHO IT IS FOR",
        forTitle: "장기간 학업을 최소화하면서 FIFO construction 진입을 현실적으로 검토하는 사람",
        forItems: [
          "Trade qualification 없이 시작하며 어떤 경로가 현실적인지 비교하고 싶은 사람",
          "이미 trade가 있고 recognition, licensing, site readiness를 정리해야 하는 사람",
          "무작정 ticket package를 사기 전에 비용과 활용도를 비교하고 싶은 사람",
          "Perth training, recruiter, first-job application sequence를 한 흐름으로 보고 싶은 사람",
        ],
        scopeNote:
          "급여와 채용 예시는 2026년 8월 검토 시점의 WA 시장 예시이며 보장된 평균임금이나 취업 보장이 아닙니다. 비용과 요구사항은 변할 수 있으므로 실제 결제·지원 전 제공자와 고용주를 다시 확인해야 합니다.",
        finalTitle: "FIFO 진입을 추측으로 시작하지 마세요.",
        finalText:
          "어떤 직업을 노리고, 어떤 티켓을 사고, 어디에 지원할지 하나의 순서로 정리한 Western Australia 가이드입니다.",
        digital: "Digital guide · 23 pages · Edition 1.0",
      }
    : {
        eyebrow: "WESTERN AUSTRALIA · EDITION 1.0",
        headline: "Know what to do first if you want to break into FIFO construction.",
        intro:
          "Choose the role first, buy only the tickets that remove a real barrier, then apply against what employers are actually asking for.",
        complete: "Complete digital guide",
        pages: "23 pages",
        reviewed: "Data reviewed 16 Aug 2026",
        region: "Western Australia",
        primary: `Buy the guide — ${price}`,
        checkoutNote: "Enter your delivery email below, then continue to secure Stripe Checkout.",
        back: "Back to FIFO jobs",
        decisionEyebrow: "WHAT THIS GUIDE HELPS YOU DECIDE",
        decisionTitle: "Built to help you choose the next move, not just collect more information.",
        roleTitle: "Which role to target",
        roleText: "Compare Trade Assistant, Scaffolder, Rigger / Dogger, Plant Operator and existing-trade pathways by the barrier that actually matters.",
        ticketTitle: "Which tickets are worth paying for",
        ticketText: "Compare current costs and training time for White Card, WAH, Confined Space, Gas Test, EWP, Scaffolding, Dogging and Rigging.",
        moneyTitle: "How much to spend and how long it takes",
        moneyText: "See lowest-cost, broad safety, scaffolding, dogging + rigging and plant pathways side by side with their main trade-offs.",
        hireTitle: "What can still block the hire",
        hireText: "Separate tickets from experience, driver's licence, medical/D&A, site clearance, competency verification and recruiter readiness.",
        previewEyebrow: "ACTUAL GUIDE PREVIEW",
        previewTitle: "See real pages from the finished Edition 1.0.",
        previewText: "These images are rendered directly from the completed 23-page PDF. They are reduced previews so the paid guide remains the place to read the full detail.",
        actualPage: "Actual page",
        insideEyebrow: "INSIDE THE GUIDE",
        insideTitle: "Role → Tickets → Application strategy",
        insideText: "The guide is designed to be used in that order from the first page to the first application.",
        proofEyebrow: "WHY CAMPCAREER BUILT IT THIS WAY",
        proofTitle: "The goal is not to collect the longest list of tickets.",
        proofText:
          "The core rule is to choose the job first, then buy the smallest ticket stack that legally and commercially improves your chance of getting that job.",
        proofOneValue: "95%",
        proofOneLabel: "of 19 reviewed ads mentioned relevant experience",
        proofTwoValue: "A$100–120",
        proofTwoLabel: "current Perth example for the White Card-only lowest-cost path",
        proofThreeValue: "~9 days",
        proofThreeLabel: "approximate training time for the Dogging + Basic Rigging path",
        employerNote:
          "Tickets make you eligible. Experience makes you competitive. The guide treats those as two different problems.",
        forEyebrow: "WHO IT IS FOR",
        forTitle: "People assessing a credible FIFO construction path without committing to years of unnecessary study",
        forItems: [
          "Starting without a trade and comparing realistic entry routes",
          "Already trade-qualified and needing to understand recognition, licensing and site readiness",
          "Comparing ticket cost and usefulness before buying a large training package",
          "Wanting Perth training, recruiter and first-job application steps in one sequence",
        ],
        scopeNote:
          "Pay and vacancy examples reflect the WA market reviewed in August 2026. They are market examples, not guaranteed averages or employment outcomes. Training prices and hiring requirements can change, so verify current conditions before paying or applying.",
        finalTitle: "Do not start your FIFO entry plan by guessing.",
        finalText:
          "One Western Australia guide for choosing the role, buying the right tickets and moving into the first application sequence.",
        digital: "Digital guide · 23 pages · Edition 1.0",
      }

  const decisions = [
    { icon: <BriefcaseBusiness className="size-5" aria-hidden="true" />, title: copy.roleTitle, text: copy.roleText },
    { icon: <Ticket className="size-5" aria-hidden="true" />, title: copy.ticketTitle, text: copy.ticketText },
    { icon: <CircleDollarSign className="size-5" aria-hidden="true" />, title: copy.moneyTitle, text: copy.moneyText },
    { icon: <Users className="size-5" aria-hidden="true" />, title: copy.hireTitle, text: copy.hireText },
  ]

  return (
    <main className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 pb-14 pt-8 sm:px-8 sm:pb-18 sm:pt-10 lg:pb-20">
        <div className="mx-auto max-w-[1180px]">
          <Link href={fifoHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--cc-ink-secondary))] transition hover:text-brand">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.back}
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-brand px-3 py-1.5 text-[10px] font-semibold tracking-[0.09em] text-white">{copy.complete}</span>
                <span className="text-xs font-semibold tracking-[0.08em] text-[hsl(var(--cc-muted))]">{copy.eyebrow}</span>
              </div>

              <h1 className="mt-5 max-w-3xl text-[42px] font-semibold leading-[1.01] tracking-[-0.055em] sm:text-[58px] lg:text-[64px]">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 tracking-[-0.025em] text-[hsl(var(--cc-ink))] sm:text-2xl">
                {copy.headline}
              </p>
              <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-[17px]">
                {copy.intro}
              </p>

              <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-[hsl(var(--cc-muted))]">
                <ProofPill icon={<FileText className="size-3.5" />} label={copy.pages} />
                <ProofPill icon={<MapPin className="size-3.5" />} label={copy.region} />
                <ProofPill icon={<CalendarDays className="size-3.5" />} label={copy.reviewed} />
              </div>
            </div>

            <aside id="purchase" className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_22px_70px_rgba(24,76,146,0.12)] sm:p-6">
              <div className="mx-auto w-full max-w-[235px] overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.22)]">
                <Image
                  src={FIFO_REPORT_COVER_PREVIEW.src}
                  width={FIFO_REPORT_COVER_PREVIEW.width}
                  height={FIFO_REPORT_COVER_PREVIEW.height}
                  unoptimized
                  priority
                  alt="FIFO Construction Fast Entry Guide 2026 actual cover"
                  className="h-auto w-full"
                />
              </div>

              <div className="mt-6 border-t border-[hsl(var(--cc-border))] pt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[hsl(var(--cc-muted))]">Digital guide</p>
                    <p className="mt-1 text-4xl font-semibold tracking-[-0.05em] text-brand">{price}</p>
                  </div>
                  <ShieldCheck className="mb-1 size-6 text-brand" aria-hidden="true" />
                </div>
                <a
                  href="#report-checkout-email"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
                >
                  {copy.primary}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <p className="mt-3 text-center text-[11px] leading-5 text-[hsl(var(--cc-muted))]">{copy.checkoutNote}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-xs font-semibold tracking-[0.12em] text-brand">{copy.decisionEyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.decisionTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {decisions.map((item) => (
              <article key={item.title} className="rounded-[20px] border border-[hsl(var(--cc-border))] bg-white p-6 shadow-[0_10px_32px_rgba(15,23,42,0.04)]">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-brand">{item.icon}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.025em]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-ink-secondary))]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-brand">{copy.insideEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.insideTitle}</h2>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-[hsl(var(--cc-ink-secondary))]">{copy.insideText}</p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {contents.map((item, index) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--cc-border))] bg-white px-4 py-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-brand">{String(index + 1).padStart(2, "0")}</span>
                <span className="pt-1 text-sm font-semibold leading-5">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.12em] text-brand">{copy.proofEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.proofTitle}</h2>
            <p className="mt-4 text-[15px] leading-7 text-[hsl(var(--cc-ink-secondary))]">{copy.proofText}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard value={copy.proofOneValue} label={copy.proofOneLabel} />
            <StatCard value={copy.proofTwoValue} label={copy.proofTwoLabel} />
            <StatCard value={copy.proofThreeValue} label={copy.proofThreeLabel} />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4 text-sm leading-6 text-[hsl(var(--cc-ink-secondary))]">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
            <p><strong className="font-semibold text-[hsl(var(--cc-ink))]">{copy.employerNote}</strong></p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-brand">{copy.forEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.forTitle}</h2>
          </div>
          <div>
            <ul className="space-y-3">
              {copy.forItems.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--cc-border))] bg-white px-4 py-4 text-sm leading-6 text-[hsl(var(--cc-ink-secondary))]">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-blue-50 text-brand"><ArrowRight className="size-3" aria-hidden="true" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-5 text-[hsl(var(--cc-muted))]">{copy.scopeNote}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[920px] overflow-hidden rounded-[26px] bg-[hsl(var(--cc-ink))] px-6 py-9 text-white sm:px-10 sm:py-11">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.12em] text-blue-200">{product.region} · {copy.digital}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.finalTitle}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-[15px]">{copy.finalText}</p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-4xl font-semibold tracking-[-0.05em] text-blue-300">{price}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 sm:justify-end"><Clock3 className="size-3.5" aria-hidden="true" />Edition 1.0</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function ProofPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
      <span className="text-brand" aria-hidden="true">{icon}</span>
      {label}
    </span>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="rounded-[20px] border border-[hsl(var(--cc-border))] bg-white p-6">
      <p className="text-3xl font-semibold tracking-[-0.045em] text-brand">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-ink-secondary))]">{label}</p>
    </article>
  )
}
