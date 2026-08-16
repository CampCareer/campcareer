"use client"

import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CircleDollarSign,
  ExternalLink,
  Gauge,
  GraduationCap,
  ShieldCheck,
  Ticket,
} from "lucide-react"
import type { FifoPath } from "@/lib/fifo/fifo-paths"
import { ALL_FIFO_PATHS } from "@/lib/fifo/all-fifo-paths"
import { FIFO_ENTRY_SCORE_WEIGHTS } from "@/lib/fifo/entry-score"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"

export function VerifiedFifoJobDetail({ path }: { path: FifoPath }) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const research = path.published
  if (!research) return null

  const otherPaths = ALL_FIFO_PATHS.filter(
    (candidate) => candidate.slug !== path.slug && candidate.slug !== "plant-operator",
  ).slice(0, 4)
  const copy = isKo
    ? {
        back: "FIFO 직업으로 돌아가기",
        verified: "VERIFIED · 2026",
        confidence: `근거 신뢰도 ${research.confidence}`,
        score: "ENTRY SCORE",
        pay: "ENTRY-LEVEL FIFO PAY",
        demand: "DEMAND",
        access: "ACCESSIBILITY",
        asOf: `근거 기준 ${research.asOf}`,
        verdictTitle: "CampCareer 판단",
        verdict: "고소득 FIFO에 처음 들어가기 위한 강한 경로입니다. 단, 쉬운 직업은 아닙니다.",
        verdictText: "업계 경력이 없어도 entry-level traineeship으로 진입할 수 있고 Cert II를 채용 후 취득하는 고용주 경로가 확인됩니다. 대신 HR 면허, First Aid/CPR, 의료·D&A 검사와 강한 육체노동 적응이 실제 선발 장벽입니다.",
        breakdown: "Entry Score 구성",
        breakdownText: "빠르게 고소득 현장 일자리로 들어가는 관점에서 네 요소를 가중 평균합니다.",
        payLabel: "Pay",
        accessLabel: "Accessibility",
        demandLabel: "Demand",
        trainingLabel: "Training burden",
        reqTitle: "지원 전에 실제로 필요한 것",
        reqText: "아래는 현재 주요 고용주 entry-level 채용에서 반복 확인되는 조건입니다. 법적 공통요건과 고용주별 요건을 동일시하지 않습니다.",
        common: "현재 고용주 공통 진입 조건",
        training: "채용 후 훈련 경로",
        avoid: "선결제하지 말아야 할 것",
        payEvidence: "보수 근거",
        demandEvidence: "수요 근거",
        sourceTitle: "근거 자료",
        sourceText: "공식 자료는 역할·훈련·안전 범위를 정하는 데 사용하고, 고용주·시장 자료는 현재 채용 조건과 보수를 검증하는 데 사용합니다.",
        report: "2026 FIFO 리포트 보기",
        compare: "다른 FIFO 경로 비교",
        open: "보기",
      }
    : {
        back: "Back to FIFO jobs",
        verified: "VERIFIED · 2026",
        confidence: `${research.confidence} evidence confidence`,
        score: "ENTRY SCORE",
        pay: "ENTRY-LEVEL FIFO PAY",
        demand: "DEMAND",
        access: "ACCESSIBILITY",
        asOf: `Evidence checked ${research.asOf}`,
        verdictTitle: "CampCareer verdict",
        verdict: "A strong first route into high-paying FIFO work — but not an easy job.",
        verdictText: "Current major-employer traineeships accept applicants without drilling-industry experience and can fund Certificate II training after hire. The real filters are HR licensing, First Aid/CPR, screening, physical capacity and willingness to work long remote shifts.",
        breakdown: "How the Entry Score is built",
        breakdownText: "Four factors are weighted for one question: how attractive is this path for someone trying to enter high-paying field work relatively quickly?",
        payLabel: "Pay",
        accessLabel: "Accessibility",
        demandLabel: "Demand",
        trainingLabel: "Training burden",
        reqTitle: "What you actually need before applying",
        reqText: "These are requirements repeatedly visible in current major-employer entry-level recruitment. CampCareer does not present employer conditions as universal legal requirements.",
        common: "Common current entry conditions",
        training: "Training after hire",
        avoid: "Do not buy these blindly",
        payEvidence: "Pay evidence",
        demandEvidence: "Demand evidence",
        sourceTitle: "Evidence used",
        sourceText: "Official sources define the occupation, training and safety scope. Employer and market sources verify current hiring conditions and pay.",
        report: "See the 2026 FIFO Report",
        compare: "Compare other FIFO paths",
        open: "Open",
      }

  return (
    <div className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-gradient-to-b from-blue-50/65 to-white px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <Link href={localizePath("/fifo", locale)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cc-muted))] transition hover:text-brand">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.back}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-white">{copy.verified}</span>
                <span className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-brand">{copy.confidence}</span>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-brand">{isKo ? path.pathType.ko : path.pathType.en}</p>
              <h1 className="mt-2 text-[46px] font-semibold leading-[1] tracking-[-0.055em] sm:text-[60px]">{path.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-lg sm:leading-8">
                {isKo ? path.summary.ko : path.summary.en}
              </p>
              <p className="mt-4 text-xs font-medium text-[hsl(var(--cc-muted))]">{copy.asOf}</p>
            </div>

            <aside className="rounded-[20px] border border-blue-100 bg-white p-5 shadow-[0_18px_42px_rgba(16,24,40,0.075)] sm:p-6">
              <div className="flex items-end justify-between gap-4 border-b border-[hsl(var(--cc-border))] pb-5">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.08em] text-[hsl(var(--cc-muted))]">{copy.score}</p>
                  <p className="mt-1 text-5xl font-semibold tracking-[-0.06em] text-brand">{research.score.total}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand">{research.score.band}</span>
              </div>
              <div className="grid gap-4 pt-5">
                <HeroMetric label={copy.pay} value={research.pay.display} />
                <HeroMetric label={copy.demand} value={isKo ? research.demand.label.ko : research.demand.label.en} />
                <HeroMetric label={copy.access} value={isKo ? research.accessibility.label.ko : research.accessibility.label.en} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex items-start gap-4 rounded-[20px] border border-blue-100 bg-blue-50/55 p-5 sm:p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-brand shadow-sm"><ShieldCheck className="size-5" aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{copy.verdictTitle}</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">{copy.verdict}</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.verdictText}</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.breakdown}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.breakdownText}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreCard icon={<CircleDollarSign className="size-5" />} title={copy.payLabel} score={research.score.components.pay} weight={FIFO_ENTRY_SCORE_WEIGHTS.pay} text={isKo ? research.pay.note.ko : research.pay.note.en} />
              <ScoreCard icon={<BriefcaseBusiness className="size-5" />} title={copy.accessLabel} score={research.score.components.accessibility} weight={FIFO_ENTRY_SCORE_WEIGHTS.accessibility} text={isKo ? research.accessibility.note.ko : research.accessibility.note.en} />
              <ScoreCard icon={<Gauge className="size-5" />} title={copy.demandLabel} score={research.score.components.demand} weight={FIFO_ENTRY_SCORE_WEIGHTS.demand} text={isKo ? research.demand.note.ko : research.demand.note.en} />
              <ScoreCard icon={<GraduationCap className="size-5" />} title={copy.trainingLabel} score={research.score.components.trainingBurden} weight={FIFO_ENTRY_SCORE_WEIGHTS.trainingBurden} text={isKo ? research.trainingBurden.note.ko : research.trainingBurden.note.en} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.reqTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.reqText}</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <RequirementCard icon={<BadgeCheck className="size-5" />} title={copy.common} items={research.requirements.common.map((item) => isKo ? item.ko : item.en)} />
            <RequirementCard icon={<GraduationCap className="size-5" />} title={copy.training} items={research.requirements.training.map((item) => isKo ? item.ko : item.en)} />
            <RequirementCard icon={<Ticket className="size-5" />} title={copy.avoid} items={research.requirements.notUniversal.map((item) => isKo ? item.ko : item.en)} />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-[1080px] gap-5 lg:grid-cols-2">
          <EvidenceCard icon={<CircleDollarSign className="size-5" />} title={copy.payEvidence} headline={research.pay.display} text={isKo ? research.pay.note.ko : research.pay.note.en} />
          <EvidenceCard icon={<Gauge className="size-5" />} title={copy.demandEvidence} headline={isKo ? research.demand.label.ko : research.demand.label.en} text={isKo ? research.demand.note.ko : research.demand.note.en} />
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.sourceTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.sourceText}</p>
          <div className="mt-7 grid gap-3">
            {research.sources.map((source) => (
              <a key={`${source.publisher}-${source.label}`} href={source.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 rounded-[16px] border border-[hsl(var(--cc-border))] bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/25">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-brand">{source.type}</span>
                    <span className="text-xs text-[hsl(var(--cc-muted))]">{source.date}</span>
                  </div>
                  <p className="mt-2 font-semibold tracking-[-0.015em]">{source.label}</p>
                  <p className="mt-1 text-xs text-[hsl(var(--cc-muted))]">{source.publisher}</p>
                </div>
                <ExternalLink className="size-4 shrink-0 text-brand transition group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-col gap-5 rounded-[20px] border border-blue-100 bg-blue-50/55 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">Australia FIFO Entry Report 2026</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? "이와 같은 근거 기반 비교를 여러 FIFO 진입 경로에 적용한 전체 리포트입니다." : "The full report applies this evidence model across multiple FIFO entry paths."}</p>
            </div>
            <Link href={`${localizePath("/", locale)}#fifo-report`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">
              {copy.report}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">{copy.compare}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {otherPaths.map((candidate) => (
                <Link key={candidate.slug} href={localizePath(`/fifo/${candidate.slug}`, locale)} className="group flex items-center justify-between rounded-[16px] border border-[hsl(var(--cc-border))] p-4 transition hover:border-blue-200 hover:bg-blue-50/35">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[hsl(var(--cc-muted))]">{candidate.status === "verified" ? "VERIFIED" : "RESEARCHING"}</p>
                    <p className="mt-1 text-base font-semibold">{candidate.name}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand">{copy.open}<ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4"><span className="text-[10px] font-semibold tracking-[0.05em] text-[hsl(var(--cc-muted))]">{label}</span><span className="max-w-[190px] text-right text-sm font-semibold">{value}</span></div>
}

function ScoreCard({ icon, title, score, weight, text }: { icon: React.ReactNode; title: string; score: number; weight: number; text: string }) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-brand" aria-hidden="true">{icon}</span>
        <div className="text-right"><p className="text-2xl font-semibold tracking-[-0.04em] text-brand">{score.toFixed(1)}</p><p className="text-[10px] font-semibold text-[hsl(var(--cc-muted))]">{Math.round(weight * 100)}% weight</p></div>
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-[hsl(var(--cc-muted))]">{text}</p>
    </article>
  )
}

function RequirementCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: readonly string[] }) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5">
      <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-brand" aria-hidden="true">{icon}</span>
      <h3 className="mt-4 text-base font-semibold tracking-[-0.02em]">{title}</h3>
      <ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-6 text-[hsl(var(--cc-muted))]"><ShieldCheck className="mt-1 size-3.5 shrink-0 text-brand" aria-hidden="true" /><span>{item}</span></li>)}</ul>
    </article>
  )
}

function EvidenceCard({ icon, title, headline, text }: { icon: React.ReactNode; title: string; headline: string; text: string }) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-brand" aria-hidden="true">{icon}</span><h2 className="text-lg font-semibold tracking-[-0.02em]">{title}</h2></div>
      <p className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-brand">{headline}</p>
      <p className="mt-3 text-sm leading-7 text-[hsl(var(--cc-muted))]">{text}</p>
    </article>
  )
}
