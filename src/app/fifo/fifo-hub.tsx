"use client"

import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  CircleDollarSign,
  FileSearch,
  Gauge,
  ShieldCheck,
  Ticket,
} from "lucide-react"
import { FIFO_PATHS } from "@/lib/fifo/fifo-paths"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"

export function FifoHub() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"

  const copy = isKo
    ? {
        eyebrow: "AUSTRALIA FIFO · 2026 RESEARCH",
        title: "FIFO 진입 경로를 비교하고, 돈을 쓰기 전에 판단하세요.",
        intro: "CampCareer는 높은 연봉 숫자만 나열하지 않습니다. 첫 취업 가능성, 필요한 티켓, 교육 부담, 보수와 수요 근거를 함께 검증해 어떤 경로가 실제로 더 나은지 보여줍니다.",
        methodology: "검증 방식 보기",
        report: "2026 FIFO 리포트",
        pathsTitle: "첫 3개 FIFO 경로",
        pathsText: "현재 세 경로를 우선 검증하고 있습니다. 근거가 충분해질 때까지 점수와 급여를 비워둡니다.",
        status: "RESEARCHING",
        entryScore: "ENTRY SCORE",
        pay: "PAY",
        tickets: "TICKETS",
        verifying: "검증 중",
        view: "리서치 페이지 보기",
        howTitle: "CampCareer가 FIFO 경로를 평가하는 방법",
        howText: "좋아 보이는 직업이 아니라, 실제로 들어갈 수 있는 직업을 비교하기 위한 네 가지 질문입니다.",
        firstJob: "첫 취업 현실성",
        firstJobText: "경력 없는 지원자가 실제 채용 요건을 충족할 수 있는지 봅니다.",
        payTitle: "보수 근거",
        payText: "출처, 기준일, 역할 범위를 확인한 보수만 사용합니다.",
        ticketTitle: "티켓·교육 부담",
        ticketText: "필수, 유용, 고용주별 요구를 분리하고 시간·비용 부담을 함께 봅니다.",
        demandTitle: "수요 근거",
        demandText: "광고 개수 하나가 아니라 반복적으로 확인 가능한 노동시장·고용주 근거를 봅니다.",
        ticketsTitle: "티켓부터 사지 마세요.",
        ticketsIntro: "FIFO 준비에서 가장 비싼 실수 중 하나는 직업을 정하기 전에 교육과 티켓부터 결제하는 것입니다. CampCareer는 각 경로에서 무엇이 정말 필요한지 검증한 뒤 세 단계로 나눠 표시합니다.",
        required: "Required",
        useful: "Useful",
        employerSpecific: "Employer-specific",
        requiredText: "해당 경로에 들어가기 위해 반드시 확인해야 할 요건",
        usefulText: "채용 가능성을 높일 수 있지만 모든 경우에 필수는 아닌 항목",
        employerText: "현장, 장비, 고용주에 따라 달라지는 항목",
        evidenceTitle: "근거가 준비되기 전에는 점수를 만들지 않습니다.",
        evidenceText: "각 상세페이지는 보수, 수요, 진입 부담, 첫 취업 근거가 충분할 때만 CampCareer Entry Score를 공개합니다.",
      }
    : {
        eyebrow: "AUSTRALIA FIFO · 2026 RESEARCH",
        title: "Compare FIFO entry paths before you spend money on training.",
        intro: "CampCareer does not rank jobs by headline salary alone. We verify first-job reality, tickets, training burden, pay and demand evidence so you can see which path is actually worth pursuing.",
        methodology: "See methodology",
        report: "2026 FIFO Report",
        pathsTitle: "The first 3 FIFO paths",
        pathsText: "These are the first paths we are verifying. Scores and pay stay blank until the evidence is strong enough to publish.",
        status: "RESEARCHING",
        entryScore: "ENTRY SCORE",
        pay: "PAY",
        tickets: "TICKETS",
        verifying: "Verifying",
        view: "Open research page",
        howTitle: "How CampCareer will rate FIFO paths",
        howText: "Four questions designed to compare jobs you can realistically enter, not just jobs that look attractive from the outside.",
        firstJob: "First-job reality",
        firstJobText: "Can a first-time applicant realistically meet current hiring requirements?",
        payTitle: "Pay evidence",
        payText: "We use pay only when the source, date and role scope are clear enough to compare.",
        ticketTitle: "Ticket & training burden",
        ticketText: "Required, useful and employer-specific requirements are separated, including time and cost burden.",
        demandTitle: "Demand evidence",
        demandText: "We look for repeatable labour-market and employer evidence rather than one vacancy count.",
        ticketsTitle: "Do not buy tickets first.",
        ticketsIntro: "One of the easiest ways to waste money preparing for FIFO is paying for training before choosing the job path. CampCareer verifies what matters for each path, then separates requirements into three buckets.",
        required: "Required",
        useful: "Useful",
        employerSpecific: "Employer-specific",
        requiredText: "Requirements that must be checked before entering the path",
        usefulText: "Items that may improve employability but are not universal requirements",
        employerText: "Requirements that vary by site, equipment or employer",
        evidenceTitle: "No evidence, no score.",
        evidenceText: "Each detail page stays unrated until CampCareer has enough evidence for pay, demand, entry burden and first-job reality.",
      }

  return (
    <div className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-gradient-to-b from-blue-50/60 to-white px-5 py-14 sm:px-6 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {copy.eyebrow}
          </div>
          <h1 className="mx-auto mt-5 max-w-4xl text-[42px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[56px] lg:text-[64px]">
            {copy.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-lg sm:leading-8">
            {copy.intro}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={localizePath("/methodology", locale)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-blue-300 hover:text-brand"
            >
              <FileSearch className="size-4 text-brand" aria-hidden="true" />
              {copy.methodology}
            </Link>
            <Link
              href={`${localizePath("/", locale)}#fifo-report`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]"
            >
              {copy.report}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 sm:py-16" aria-labelledby="fifo-path-list-heading">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-2xl">
            <h2 id="fifo-path-list-heading" className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.pathsTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))] sm:text-base">{copy.pathsText}</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {FIFO_PATHS.map((path) => (
              <article key={path.slug} className="flex min-h-[350px] flex-col rounded-[20px] border border-[hsl(var(--cc-border))] bg-white p-5 shadow-[0_14px_36px_rgba(16,24,40,0.055)] sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.05em] text-brand">{copy.status}</span>
                  <BriefcaseBusiness className="size-5 text-brand" aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-[hsl(var(--cc-muted))]">{isKo ? path.pathType.ko : path.pathType.en}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{path.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? path.summary.ko : path.summary.en}</p>

                <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[hsl(var(--cc-border))] py-4">
                  <ResearchMetric label={copy.entryScore} value="—" />
                  <ResearchMetric label={copy.pay} value={copy.verifying} small />
                  <ResearchMetric label={copy.tickets} value={copy.verifying} small />
                </div>

                <Link
                  href={localizePath(`/fifo/${path.slug}`, locale)}
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand transition hover:text-[hsl(var(--brand-press))]"
                >
                  {copy.view}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-14 sm:px-6 sm:py-16" aria-labelledby="fifo-method-heading">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-2xl">
            <h2 id="fifo-method-heading" className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.howTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))] sm:text-base">{copy.howText}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MethodCard icon={<BriefcaseBusiness className="size-5" />} title={copy.firstJob} text={copy.firstJobText} />
            <MethodCard icon={<CircleDollarSign className="size-5" />} title={copy.payTitle} text={copy.payText} />
            <MethodCard icon={<Ticket className="size-5" />} title={copy.ticketTitle} text={copy.ticketText} />
            <MethodCard icon={<Gauge className="size-5" />} title={copy.demandTitle} text={copy.demandText} />
          </div>
        </div>
      </section>

      <section id="tickets" className="scroll-mt-24 px-5 py-14 sm:px-6 sm:py-16" aria-labelledby="fifo-tickets-heading">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-brand"><Ticket className="size-5" aria-hidden="true" /></span>
            <h2 id="fifo-tickets-heading" className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.ticketsTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-[hsl(var(--cc-muted))] sm:text-base">{copy.ticketsIntro}</p>
          </div>
          <div className="grid gap-3">
            <TicketBucket icon={<BadgeCheck className="size-5" />} title={copy.required} text={copy.requiredText} />
            <TicketBucket icon={<ClipboardCheck className="size-5" />} title={copy.useful} text={copy.usefulText} />
            <TicketBucket icon={<BriefcaseBusiness className="size-5" />} title={copy.employerSpecific} text={copy.employerText} />
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto flex max-w-[1100px] items-start gap-4 rounded-[20px] border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-brand shadow-sm"><ShieldCheck className="size-5" aria-hidden="true" /></span>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">{copy.evidenceTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.evidenceText}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ResearchMetric({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-semibold tracking-[0.04em] text-[hsl(var(--cc-muted))]">{label}</p>
      <p className={small ? "mt-1 text-[11px] font-semibold text-[hsl(var(--cc-muted))]" : "mt-1 text-xl font-semibold tracking-[-0.035em] text-brand"}>{value}</p>
    </div>
  )
}

function MethodCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5">
      <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-brand" aria-hidden="true">{icon}</span>
      <h3 className="mt-4 text-base font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{text}</p>
    </article>
  )
}

function TicketBucket({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="flex gap-4 rounded-[16px] border border-[hsl(var(--cc-border))] bg-white p-5 shadow-[0_8px_22px_rgba(16,24,40,0.04)]">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-brand" aria-hidden="true">{icon}</span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-[hsl(var(--cc-muted))]">{text}</p>
      </div>
    </article>
  )
}
