"use client"

import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  FileSearch,
  Gauge,
  ShieldCheck,
  Ticket,
} from "lucide-react"
import type { FifoPath } from "@/lib/fifo/fifo-paths"
import { FIFO_PATHS } from "@/lib/fifo/fifo-paths"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"

export function FifoJobDetail({ path }: { path: FifoPath }) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const otherPaths = FIFO_PATHS.filter((candidate) => candidate.slug !== path.slug)

  const copy = isKo
    ? {
        back: "FIFO 직업으로 돌아가기",
        eyebrow: "CAMPCAREER FIFO RESEARCH",
        researching: "RESEARCHING",
        introLabel: "현재 상태",
        introValue: "근거 검증 중",
        entryScore: "ENTRY SCORE",
        pay: "TYPICAL PAY",
        requirements: "ENTRY REQUIREMENTS",
        verifying: "검증 중",
        gateTitle: "이 경로는 아직 점수화하지 않았습니다.",
        gateText: "CampCareer는 보수, 수요, 진입 부담, 첫 취업 현실성 근거가 준비되기 전에는 점수를 공개하지 않습니다.",
        focusTitle: "지금 검증하고 있는 것",
        focusText: "이 목록의 핵심 질문을 공식 자료와 실제 채용 근거로 채운 뒤 공개 점수를 계산합니다.",
        publishTitle: "점수 공개 전에 확인할 4가지",
        firstJob: "첫 취업 현실성",
        firstJobText: "처음 시작하는 지원자가 현재 채용 요건을 충족할 수 있는지 확인합니다.",
        payTitle: "보수",
        payText: "역할 범위와 기준일이 명확한 보수 근거만 비교에 사용합니다.",
        ticketsTitle: "티켓·교육",
        ticketsText: "필수, 유용, 고용주별 요건을 나누고 시간·비용 부담을 봅니다.",
        demandTitle: "수요",
        demandText: "반복 확인 가능한 노동시장·고용주 근거가 있는지 확인합니다.",
        sourceTitle: "Evidence gate",
        sourceText: "이 페이지는 구조를 먼저 공개하되, 검증되지 않은 급여나 점수는 표시하지 않습니다. 데이터 검증이 끝나면 출처와 기준일을 함께 공개합니다.",
        report: "2026 FIFO 리포트 보기",
        otherTitle: "다른 FIFO 경로 비교",
        open: "리서치 페이지 보기",
      }
    : {
        back: "Back to FIFO jobs",
        eyebrow: "CAMPCAREER FIFO RESEARCH",
        researching: "RESEARCHING",
        introLabel: "CURRENT STATUS",
        introValue: "Evidence verification in progress",
        entryScore: "ENTRY SCORE",
        pay: "TYPICAL PAY",
        requirements: "ENTRY REQUIREMENTS",
        verifying: "Verifying",
        gateTitle: "This path is not rated yet.",
        gateText: "CampCareer does not publish a score until pay, demand, entry burden and first-job reality have enough evidence to compare fairly.",
        focusTitle: "What we are verifying now",
        focusText: "These are the questions CampCareer will fill with official sources and current hiring evidence before calculating a public score.",
        publishTitle: "Four checks before a score goes live",
        firstJob: "First-job reality",
        firstJobText: "Can a first-time applicant realistically meet current hiring requirements?",
        payTitle: "Pay",
        payText: "Only pay evidence with a clear source, date and role scope is used for comparison.",
        ticketsTitle: "Tickets & training",
        ticketsText: "Required, useful and employer-specific requirements are separated with time and cost burden.",
        demandTitle: "Demand",
        demandText: "We look for repeatable labour-market and employer evidence before calling a path strong.",
        sourceTitle: "Evidence gate",
        sourceText: "The page structure can go live before the research is complete, but unverified salary and score figures do not. Sources and evidence dates will appear with the final rating.",
        report: "See the 2026 FIFO Report",
        otherTitle: "Compare other FIFO paths",
        open: "Open research page",
      }

  return (
    <div className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-gradient-to-b from-blue-50/55 to-white px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1060px]">
          <Link
            href={localizePath("/fifo", locale)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cc-muted))] transition hover:text-brand"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.back}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-white">{copy.researching}</span>
                <span className="text-xs font-semibold tracking-[0.07em] text-[hsl(var(--cc-muted))]">{copy.eyebrow}</span>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-brand">{isKo ? path.pathType.ko : path.pathType.en}</p>
              <h1 className="mt-2 text-[46px] font-semibold leading-[1] tracking-[-0.055em] sm:text-[60px]">{path.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-lg sm:leading-8">
                {isKo ? path.summary.ko : path.summary.en}
              </p>
            </div>

            <aside className="rounded-[18px] border border-blue-100 bg-white p-5 shadow-[0_14px_36px_rgba(16,24,40,0.06)]">
              <p className="text-[10px] font-semibold tracking-[0.08em] text-[hsl(var(--cc-muted))]">{copy.introLabel}</p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">{copy.introValue}</p>
              <div className="mt-5 grid gap-3 border-t border-[hsl(var(--cc-border))] pt-5">
                <StatusRow label={copy.entryScore} value="—" emphasized />
                <StatusRow label={copy.pay} value={copy.verifying} />
                <StatusRow label={copy.requirements} value={copy.verifying} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1060px]">
          <div className="flex items-start gap-4 rounded-[18px] border border-blue-100 bg-blue-50/55 p-5 sm:p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-brand shadow-sm"><ShieldCheck className="size-5" aria-hidden="true" /></span>
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.02em]">{copy.gateTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.gateText}</p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-brand"><FileSearch className="size-5" aria-hidden="true" /></span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{copy.focusTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.focusText}</p>
            </div>
            <div className="overflow-hidden rounded-[18px] border border-[hsl(var(--cc-border))] bg-white">
              {(isKo ? path.researchFocus.ko : path.researchFocus.en).map((item, index) => (
                <div key={item} className="flex gap-4 border-b border-[hsl(var(--cc-border))] p-5 last:border-b-0">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-brand">{index + 1}</span>
                  <p className="pt-1 text-sm font-medium leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1060px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.publishTitle}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CheckCard icon={<BriefcaseBusiness className="size-5" />} title={copy.firstJob} text={copy.firstJobText} />
            <CheckCard icon={<CircleDollarSign className="size-5" />} title={copy.payTitle} text={copy.payText} />
            <CheckCard icon={<Ticket className="size-5" />} title={copy.ticketsTitle} text={copy.ticketsText} />
            <CheckCard icon={<Gauge className="size-5" />} title={copy.demandTitle} text={copy.demandText} />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1060px]">
          <div className="grid gap-6 rounded-[20px] border border-[hsl(var(--cc-border))] p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{copy.sourceTitle}</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? path.researchNote.ko : path.researchNote.en}</p>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-[hsl(var(--cc-muted))]">{copy.sourceText}</p>
            </div>
            <Link
              href={`${localizePath("/", locale)}#fifo-report`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]"
            >
              {copy.report}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">{copy.otherTitle}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {otherPaths.map((candidate) => (
                <Link
                  key={candidate.slug}
                  href={localizePath(`/fifo/${candidate.slug}`, locale)}
                  className="group flex items-center justify-between rounded-[16px] border border-[hsl(var(--cc-border))] p-4 transition hover:border-blue-200 hover:bg-blue-50/35"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[hsl(var(--cc-muted))]">{isKo ? candidate.pathType.ko : candidate.pathType.en}</p>
                    <p className="mt-1 text-base font-semibold">{candidate.name}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand">
                    {copy.open}
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatusRow({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] font-semibold tracking-[0.05em] text-[hsl(var(--cc-muted))]">{label}</span>
      <span className={emphasized ? "text-xl font-semibold tracking-[-0.03em] text-brand" : "text-xs font-semibold text-[hsl(var(--cc-muted))]"}>{value}</span>
    </div>
  )
}

function CheckCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-[17px] border border-[hsl(var(--cc-border))] bg-white p-5">
      <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-brand" aria-hidden="true">{icon}</span>
      <h3 className="mt-4 text-base font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{text}</p>
    </article>
  )
}
