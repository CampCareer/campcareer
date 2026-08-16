"use client"

import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Ticket,
} from "lucide-react"
import { FIFO_PATHS } from "@/lib/fifo/fifo-paths"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"

export function HomeHub() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"

  const copy = isKo
    ? {
        headlineLead: "호주 고소득 현장 일자리로 가는",
        headlineAccent: "가장 빠른 경로",
        description: "FIFO 직업, 필요한 티켓, 진입 난이도와 실제 보수를 비교해 잘못된 교육에 시간과 돈을 낭비하지 마세요.",
        explore: "FIFO 직업 보기",
        report: "2026 FIFO 리포트 보기",
        trust: "막연한 커리어 조언이 아니라, 실제 진입 경로를 찾는 사람을 위해 만듭니다.",
        panelTitle: "Top FIFO Paths",
        panelBadge: "1 verified · 2 researching",
        score: "ENTRY SCORE",
        barrier: "ENTRY",
        pay: "TYPICAL PAY (AUD)",
        verifying: "검증 중",
        research: "RESEARCHING",
        verified: "VERIFIED",
        methodology: "급여, 수요, 교육 부담, 첫 취업 현실성을 검증한 뒤에만 점수를 공개합니다.",
        benefitJobs: "초보자를 위한 현실적인 직업",
        benefitJobsText: "급여만이 아니라 진입 난이도와 첫 취업 가능성까지 함께 비교합니다.",
        benefitTickets: "돈 쓸 가치가 있는 티켓",
        benefitTicketsText: "필수 자격, 도움이 되는 자격, 나중에 따도 되는 자격을 구분합니다.",
        benefitPay: "출처가 있는 FIFO 보수",
        benefitPayText: "공개 전 모든 보수 범위를 출처와 기준일로 검증합니다.",
        reportEyebrow: "COMING SOON",
        reportTitle: "Australia FIFO Entry Report 2026",
        reportText: "15개 이상의 진입 경로, 필요한 티켓, 현실적인 보수, 처음부터 시작하는 추천 순서를 한 리포트에 정리합니다.",
        launch: "출시가 $29",
        launchNote: "첫 판의 데이터 검증이 끝나면 결제를 엽니다.",
      }
    : {
        headlineLead: "Find your fastest path into high-paying work",
        headlineAccent: "in Australia.",
        description: "Compare FIFO jobs, required tickets, entry difficulty and real pay — without wasting years on the wrong training.",
        explore: "Explore FIFO Jobs",
        report: "Get the 2026 FIFO Report",
        trust: "Built for people who want practical paths, not vague career advice.",
        panelTitle: "Top FIFO Paths",
        panelBadge: "1 verified · 2 researching",
        score: "ENTRY SCORE",
        barrier: "ENTRY",
        pay: "TYPICAL PAY (AUD)",
        verifying: "Verifying",
        research: "RESEARCHING",
        verified: "VERIFIED",
        methodology: "We publish scores only after pay, demand, training burden and first-job evidence are verified.",
        benefitJobs: "Best Jobs for Beginners",
        benefitJobsText: "Compare realistic entry paths by pay, training burden, demand and first-job difficulty.",
        benefitTickets: "Tickets That Matter",
        benefitTicketsText: "See which licences are required, which help, and which can wait until later.",
        benefitPay: "Real FIFO Pay",
        benefitPayText: "Every salary range is sourced and date-stamped before we publish it.",
        reportEyebrow: "COMING SOON",
        reportTitle: "Australia FIFO Entry Report 2026",
        reportText: "15+ entry paths, required tickets, realistic salaries, and the best routes from zero — in one decision-ready report.",
        launch: "$29 launch price",
        launchNote: "Checkout opens when the first edition finishes verification.",
      }

  return (
    <div className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Australia FIFO · 2026 research
              </div>

              <h1 className="mt-5 text-[44px] font-semibold leading-[0.99] tracking-[-0.055em] text-[hsl(var(--cc-ink))] sm:text-[58px] lg:text-[66px]">
                {copy.headlineLead}{" "}
                <span className="text-brand">{copy.headlineAccent}</span>
              </h1>

              <p className="mt-6 max-w-xl text-[16px] leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-[18px] sm:leading-8">
                {copy.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={localizePath("/fifo", locale)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
                >
                  {copy.explore}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#fifo-report"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[hsl(var(--cc-ink))] transition hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                >
                  {copy.report}
                  <FileText className="size-4 text-brand" aria-hidden="true" />
                </Link>
              </div>

              <p className="mt-5 flex max-w-xl items-start gap-2 text-xs leading-5 text-[hsl(var(--cc-muted))] sm:text-sm">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                {copy.trust}
              </p>
            </div>

            <section id="fifo-jobs" aria-labelledby="fifo-paths-heading" className="scroll-mt-24 overflow-hidden rounded-[22px] border border-[hsl(var(--cc-border))] bg-white shadow-[0_22px_60px_rgba(16,24,40,0.09)]">
              <div className="flex items-center justify-between gap-4 border-b border-[hsl(var(--cc-border))] px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-50 text-brand"><BriefcaseBusiness className="size-4.5" aria-hidden="true" /></span>
                  <h2 id="fifo-paths-heading" className="truncate text-lg font-semibold tracking-[-0.02em] sm:text-xl">{copy.panelTitle}</h2>
                </div>
                <Link href={localizePath("/fifo", locale)} className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-brand transition hover:bg-blue-100">{copy.panelBadge}</Link>
              </div>

              <div className="hidden grid-cols-[1fr_88px_116px_134px] gap-3 border-b border-[hsl(var(--cc-border))] bg-slate-50/70 px-6 py-2.5 text-[10px] font-semibold tracking-[0.04em] text-[hsl(var(--cc-muted))] sm:grid">
                <span /><span>{copy.score}</span><span>{copy.barrier}</span><span>{copy.pay}</span>
              </div>

              <div>
                {FIFO_PATHS.map((path) => {
                  const published = path.published
                  return (
                    <Link key={path.name} href={localizePath(`/fifo/${path.slug}`, locale)} className="group grid gap-4 border-b border-[hsl(var(--cc-border))] px-5 py-5 transition last:border-b-0 hover:bg-blue-50/35 sm:grid-cols-[1fr_88px_116px_134px] sm:items-center sm:gap-3 sm:px-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[15px] font-semibold tracking-[-0.015em] transition group-hover:text-brand sm:text-base">{path.name}</h3>
                          <span className={published ? "rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white" : "rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-brand"}>{published ? copy.verified : copy.research}</span>
                        </div>
                        <p className="mt-1 text-xs text-[hsl(var(--cc-muted))]">{isKo ? path.pathType.ko : path.pathType.en}</p>
                      </div>
                      <Metric label={copy.score} value={published ? String(published.score.total) : "—"} />
                      <Metric label={copy.barrier} value={published ? `${published.accessibility.score.toFixed(1)}/10` : copy.verifying} muted={!published} />
                      <Metric label={copy.pay} value={published ? published.pay.display : copy.verifying} muted={!published} />
                    </Link>
                  )
                })}
              </div>

              <div className="flex items-start gap-2 border-t border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-4 text-[11px] leading-5 text-[hsl(var(--cc-muted))] sm:px-6 sm:text-xs">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />{copy.methodology}
              </div>
            </section>
          </div>

          <section id="tickets" className="scroll-mt-24 pt-10 sm:pt-12" aria-label="CampCareer FIFO value proposition">
            <div className="grid gap-4 md:grid-cols-3">
              <BenefitCard icon={<BriefcaseBusiness className="size-6" />} title={copy.benefitJobs} text={copy.benefitJobsText} />
              <BenefitCard icon={<Ticket className="size-6" />} title={copy.benefitTickets} text={copy.benefitTicketsText} />
              <BenefitCard icon={<CircleDollarSign className="size-6" />} title={copy.benefitPay} text={copy.benefitPayText} />
            </div>
          </section>

          <section id="fifo-report" className="mt-5 scroll-mt-24 overflow-hidden rounded-[22px] border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/60 p-5 sm:mt-6 sm:p-7 lg:p-8" aria-labelledby="fifo-report-heading">
            <div className="grid items-center gap-6 md:grid-cols-[150px_1fr_auto] md:gap-8">
              <div className="mx-auto w-[124px] rounded-md bg-[hsl(var(--cc-ink))] px-4 py-5 text-left text-white shadow-[0_12px_30px_rgba(16,24,40,0.15)] md:mx-0">
                <p className="text-[10px] font-semibold tracking-[0.12em] text-blue-200">AUSTRALIA</p>
                <p className="mt-2 text-sm font-semibold leading-4">FIFO ENTRY REPORT</p>
                <p className="mt-5 text-2xl font-semibold text-blue-300">2026</p>
                <div className="mt-7 h-1 w-8 rounded-full bg-brand" />
              </div>

              <div>
                <span className="inline-flex rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-white">{copy.reportEyebrow}</span>
                <h2 id="fifo-report-heading" className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{copy.reportTitle}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-ink-secondary))] sm:text-[15px]">{copy.reportText}</p>
              </div>

              <div className="md:min-w-[210px] md:text-right">
                <div className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white md:w-auto">{copy.launch}</div>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[hsl(var(--cc-muted))] md:justify-end"><LockKeyhole className="size-3.5" aria-hidden="true" />{copy.launchNote}</p>
              </div>
            </div>
          </section>

          <div className="mt-7 text-center text-xs text-[hsl(var(--cc-muted))]">
            <Link href={localizePath("/blog", locale)} className="font-semibold text-brand transition hover:text-[hsl(var(--brand-press))]">
              {isKo ? "CampCareer 리서치와 가이드 보기" : "Read CampCareer research and guides"}<ArrowRight className="ml-1 inline size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-semibold tracking-[0.04em] text-[hsl(var(--cc-muted))] sm:hidden">{label}</p>
      <p className={muted ? "mt-1 text-xs font-semibold text-[hsl(var(--cc-muted))] sm:mt-0" : "mt-1 text-xl font-semibold tracking-[-0.04em] text-brand sm:mt-0"}>{value}</p>
    </div>
  )
}

function BenefitCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,0.045)] sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand" aria-hidden="true">{icon}</span>
        <div><h3 className="text-base font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{text}</p></div>
      </div>
    </article>
  )
}
