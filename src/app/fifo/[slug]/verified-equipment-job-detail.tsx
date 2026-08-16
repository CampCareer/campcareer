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

export function VerifiedEquipmentJobDetail({ path }: { path: FifoPath }) {
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
        pay: "FIFO PAY",
        demand: "DEMAND",
        access: "ACCESSIBILITY",
        checked: `근거 기준 ${research.asOf}`,
        verdictTitle: "CampCareer 판단",
        verdict: "초보자에게 실제 고용주 진입창구가 확인된 강한 장비 경로입니다.",
        breakdown: "Entry Score 구성",
        breakdownText: "빠르게 고소득 현장 일자리로 진입하는 관점에서 네 요소를 가중 평균합니다.",
        requirements: "지원 전에 실제로 필요한 것",
        requirementsText: "현재 traineeship과 채용공고에서 확인되는 조건을 정리했습니다. 특정 고용주 조건을 보편적 법적 요건으로 표현하지 않습니다.",
        common: "현재 진입 조건",
        training: "훈련 경로",
        avoid: "선결제 주의",
        sources: "근거 자료",
        sourcesText: "공식 자료는 직업·훈련 범위를, 고용주·시장 자료는 실제 채용 조건과 보수를 검증하는 데 사용합니다.",
        report: "2026 FIFO 리포트 보기",
        compare: "다른 FIFO 경로 비교",
      }
    : {
        back: "Back to FIFO jobs",
        verified: "VERIFIED · 2026",
        confidence: `${research.confidence} evidence confidence`,
        score: "ENTRY SCORE",
        pay: "FIFO PAY",
        demand: "DEMAND",
        access: "ACCESSIBILITY",
        checked: `Evidence checked ${research.asOf}`,
        verdictTitle: "CampCareer verdict",
        verdict: "A strong equipment route because a real employer-led beginner intake exists now.",
        breakdown: "How the Entry Score is built",
        breakdownText: "Four factors are weighted for one question: how attractive is this route for someone trying to enter high-paying field work relatively quickly?",
        requirements: "What you actually need before applying",
        requirementsText: "These conditions come from current traineeships and hiring evidence. Employer-specific criteria are not presented as universal legal requirements.",
        common: "Current entry conditions",
        training: "Training pathway",
        avoid: "Do not buy these blindly",
        sources: "Evidence used",
        sourcesText: "Official sources define occupation and training scope. Employer and market sources verify current hiring conditions and pay.",
        report: "See the 2026 FIFO Report",
        compare: "Compare other FIFO paths",
      }

  return (
    <div className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-gradient-to-b from-blue-50/65 to-white px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <Link href={localizePath("/fifo", locale)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cc-muted))] transition hover:text-brand">
            <ArrowLeft className="size-4" aria-hidden="true" />{copy.back}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-white">{copy.verified}</span>
                <span className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-brand">{copy.confidence}</span>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-brand">{isKo ? path.pathType.ko : path.pathType.en}</p>
              <h1 className="mt-2 text-[46px] font-semibold leading-[1] tracking-[-0.055em] sm:text-[60px]">{path.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-lg sm:leading-8">{isKo ? path.summary.ko : path.summary.en}</p>
              <p className="mt-4 text-xs font-medium text-[hsl(var(--cc-muted))]">{copy.checked}</p>
            </div>

            <aside className="rounded-[20px] border border-blue-100 bg-white p-5 shadow-[0_18px_42px_rgba(16,24,40,0.075)] sm:p-6">
              <div className="flex items-end justify-between gap-4 border-b border-[hsl(var(--cc-border))] pb-5">
                <div><p className="text-[10px] font-semibold tracking-[0.08em] text-[hsl(var(--cc-muted))]">{copy.score}</p><p className="mt-1 text-5xl font-semibold tracking-[-0.06em] text-brand">{research.score.total}</p></div>
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
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[hsl(var(--cc-muted))]">{isKo ? path.researchNote.ko : path.researchNote.en}</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.breakdown}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.breakdownText}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreCard icon={<CircleDollarSign className="size-5" />} title="Pay" score={research.score.components.pay} weight={FIFO_ENTRY_SCORE_WEIGHTS.pay} text={isKo ? research.pay.note.ko : research.pay.note.en} />
              <ScoreCard icon={<BriefcaseBusiness className="size-5" />} title="Accessibility" score={research.score.components.accessibility} weight={FIFO_ENTRY_SCORE_WEIGHTS.accessibility} text={isKo ? research.accessibility.note.ko : research.accessibility.note.en} />
              <ScoreCard icon={<Gauge className="size-5" />} title="Demand" score={research.score.components.demand} weight={FIFO_ENTRY_SCORE_WEIGHTS.demand} text={isKo ? research.demand.note.ko : research.demand.note.en} />
              <ScoreCard icon={<GraduationCap className="size-5" />} title="Training burden" score={research.score.components.trainingBurden} weight={FIFO_ENTRY_SCORE_WEIGHTS.trainingBurden} text={isKo ? research.trainingBurden.note.ko : research.trainingBurden.note.en} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.requirements}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.requirementsText}</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <RequirementCard icon={<BadgeCheck className="size-5" />} title={copy.common} items={research.requirements.common.map((item) => isKo ? item.ko : item.en)} />
            <RequirementCard icon={<GraduationCap className="size-5" />} title={copy.training} items={research.requirements.training.map((item) => isKo ? item.ko : item.en)} />
            <RequirementCard icon={<Ticket className="size-5" />} title={copy.avoid} items={research.requirements.notUniversal.map((item) => isKo ? item.ko : item.en)} />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.sources}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.sourcesText}</p>
          <div className="mt-7 grid gap-3">
            {research.sources.map((source) => (
              <a key={`${source.publisher}-${source.label}`} href={source.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 rounded-[16px] border border-[hsl(var(--cc-border))] bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/25">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-brand">{source.type}</span><span className="text-xs text-[hsl(var(--cc-muted))]">{source.date}</span></div>
                  <p className="mt-2 font-semibold tracking-[-0.015em]">{source.label}</p><p className="mt-1 text-xs text-[hsl(var(--cc-muted))]">{source.publisher}</p>
                </div>
                <ExternalLink className="size-4 shrink-0 text-brand" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-col gap-5 rounded-[20px] border border-blue-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">Australia FIFO Entry Report 2026</p><p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? "같은 근거 기준으로 FIFO 진입 경로를 비교하는 전체 리포트입니다." : "The full report compares FIFO entry paths using the same evidence gate and scoring model."}</p></div>
            <Link href={`${localizePath("/", locale)}#fifo-report`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">{copy.report}<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-[-0.035em]">{copy.compare}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {otherPaths.map((candidate) => (
              <Link key={candidate.slug} href={localizePath(`/fifo/${candidate.slug}`, locale)} className="rounded-[16px] border border-[hsl(var(--cc-border))] bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/25">
                <div className="flex items-center justify-between gap-3"><span className="font-semibold">{candidate.name}</span><ArrowRight className="size-4 text-brand" aria-hidden="true" /></div>
                <p className="mt-1 text-xs text-[hsl(var(--cc-muted))]">{candidate.published ? `${candidate.published.score.total} ${candidate.published.score.band}` : isKo ? "검증 중" : "Researching"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[9px] font-semibold tracking-[0.06em] text-[hsl(var(--cc-muted))]">{label}</p><p className="mt-1 text-sm font-semibold text-[hsl(var(--cc-ink-secondary))]">{value}</p></div>
}

function ScoreCard({ icon, title, score, weight, text }: { icon: React.ReactNode; title: string; score: number; weight: number; text: string }) {
  return <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5"><div className="flex items-center justify-between gap-3"><span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span><span className="text-xs font-semibold text-[hsl(var(--cc-muted))]">{Math.round(weight * 100)}%</span></div><p className="mt-4 text-sm font-semibold">{title}</p><p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-brand">{score.toFixed(1)}</p><p className="mt-3 text-xs leading-5 text-[hsl(var(--cc-muted))]">{text}</p></article>
}

function RequirementCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: readonly string[] }) {
  return <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5"><span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span><h3 className="mt-4 text-base font-semibold">{title}</h3><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-[hsl(var(--cc-muted))]"><BadgeCheck className="mt-1 size-4 shrink-0 text-brand" aria-hidden="true" />{item}</li>)}</ul></article>
}
