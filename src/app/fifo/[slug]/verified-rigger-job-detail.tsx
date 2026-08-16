"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  ExternalLink,
  Gauge,
  GraduationCap,
  ShieldCheck,
  Ticket,
} from "lucide-react"
import { FIFO_ENTRY_SCORE_WEIGHTS } from "@/lib/fifo/entry-score"
import type { FifoPath } from "@/lib/fifo/fifo-paths"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export function VerifiedRiggerJobDetail({ path }: { path: FifoPath }) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const research = path.published
  if (!research) return null

  const copy = isKo
    ? {
        back: "FIFO 직업으로 돌아가기",
        verified: "VERIFIED · 2026",
        confidence: `근거 신뢰도 ${research.confidence}`,
        score: "ENTRY SCORE",
        pay: "현재 FIFO 보수",
        demand: "DEMAND",
        access: "ACCESSIBILITY",
        asOf: `근거 기준 ${research.asOf}`,
        verdictTitle: "CampCareer 판단",
        verdict: "Rigger는 무경력 FIFO 진입이 실제로 가능하지만, 티켓 하나짜리 지름길은 아닙니다.",
        verdictText:
          "가장 좋은 초보 경로는 Monadelphous 같은 structured traineeship을 잡는 것입니다. 그 기회를 못 잡으면 DG → RB로 시작해 로컬·산업 현장에서 경험을 만든 뒤 RI로 올라가는 편이 현실적입니다. 일반 WA FIFO 시장은 RI/RA와 현장경력을 강하게 요구합니다.",
        ladderTitle: "Rigger 면허는 DG에서 RA까지 누적됩니다",
        ladderText:
          "Rigging HRWL은 앞 단계를 건너뛸 수 없습니다. Dogging이 Basic의 선행이고, Basic이 Intermediate의 선행이며, Intermediate가 Advanced의 선행입니다.",
        dogging: "Dogging · DG",
        doggingText: "CPCCLDG3001 · Rigging 진입 전 첫 HRWL 단계",
        basic: "Basic · RB",
        basicText: "CPCCLRG3001 · DG 선행 · basic rigging 범위",
        intermediate: "Intermediate · RI",
        intermediateText: "CPCCLRG3002 · RB 선행 · cranes, conveyors, dual lifts 등",
        advanced: "Advanced · RA",
        advancedText: "CPCCLRG4001 · RI 선행 · advanced structures와 suspended rigging 범위",
        realityTitle: "첫 FIFO가 가능한 예외 경로와 일반 시장을 구분하세요",
        realityText:
          "2026 Monadelphous Heavy Lift traineeship은 기존 rigging 경력 없이 18개월 full-time FIFO 과정으로 Certificate III와 Intermediate Rigger를 목표로 하는 직접 진입 경로입니다. 그러나 MinRes, Linkforce, Techforce의 일반 공고는 RI/RA와 최소 12개월에서 2년 이상의 현장경력을 요구합니다. 즉 traineeship은 진짜 경로지만 모든 초보자가 바로 살 수 있는 티켓형 경로는 아닙니다.",
        demandCaution: "공식 shortage는 아닙니다",
        demandCautionText:
          "현재 WA FIFO 채용은 강하지만 Jobs and Skills Australia 2025 OSL에서 Construction Rigger는 전국과 WA 모두 No Shortage입니다. CampCareer는 현재 채용 강도를 Demand에 반영하되 official shortage라고 부르지 않습니다.",
        breakdown: "Entry Score 구성",
        requirements: "현재 FIFO에서 반복 확인되는 조건",
        training: "훈련·면허 경로",
        avoid: "돈 쓰기 전에 알아둘 것",
        sources: "근거 자료",
        sourceText: "공식 규제·훈련 자료와 현재 고용주·시장 근거를 분리해 사용합니다.",
        report: "2026 FIFO 리포트 보기",
      }
    : {
        back: "Back to FIFO jobs",
        verified: "VERIFIED · 2026",
        confidence: `${research.confidence} evidence confidence`,
        score: "ENTRY SCORE",
        pay: "CURRENT FIFO PAY",
        demand: "DEMAND",
        access: "ACCESSIBILITY",
        asOf: `Evidence checked ${research.asOf}`,
        verdictTitle: "CampCareer verdict",
        verdict: "Rigger has a real zero-experience FIFO route, but it is not a one-ticket shortcut.",
        verdictText:
          "The best beginner outcome is a structured traineeship such as Monadelphous Heavy Lift. Without that opening, the practical route is DG → RB, local or industrial rigging experience, then RI before targeting mainstream FIFO. Current WA FIFO hiring is heavily weighted toward RI/RA holders with site experience.",
        ladderTitle: "Rigging licences build from DG to RA",
        ladderText:
          "The HRWL sequence cannot be skipped. Dogging is the prerequisite for Basic Rigging, Basic is the prerequisite for Intermediate, and Intermediate is the prerequisite for Advanced.",
        dogging: "Dogging · DG",
        doggingText: "CPCCLDG3001 · first HRWL step before the rigging classes",
        basic: "Basic · RB",
        basicText: "CPCCLRG3001 · DG prerequisite · basic rigging scope",
        intermediate: "Intermediate · RI",
        intermediateText: "CPCCLRG3002 · RB prerequisite · cranes, conveyors, dual lifts and more",
        advanced: "Advanced · RA",
        advancedText: "CPCCLRG4001 · RI prerequisite · advanced structures and suspended rigging scope",
        realityTitle: "Separate the direct trainee exception from the normal FIFO market",
        realityText:
          "Monadelphous' 2026 Heavy Lift traineeship is a genuine direct route: an 18-month full-time FIFO program toward Certificate III in Rigging and Intermediate Rigger, with current job-board copies stating previous rigging experience is not required. Mainstream MinRes, Linkforce and Techforce vacancies instead ask for RI/RA and roughly 12 months to 2+ years of site experience. The traineeship is real, but it is a selective opening rather than a ticket you can simply buy.",
        demandCaution: "This is not an official shortage occupation",
        demandCautionText:
          "WA FIFO hiring is strong, but the Jobs and Skills Australia 2025 OSL rates Construction Rigger as No Shortage nationally and in WA. CampCareer scores the current hiring market without relabelling it as an official shortage.",
        breakdown: "How the Entry Score is built",
        requirements: "What current FIFO employers repeatedly ask for",
        training: "Training and licence path",
        avoid: "Know this before spending money",
        sources: "Evidence used",
        sourceText: "Official regulation and training sources are separated from current employer and market evidence.",
        report: "See the 2026 FIFO Report",
      }

  return (
    <div className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-gradient-to-b from-blue-50/65 to-white px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <Link
            href={localizePath("/fifo", locale)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cc-muted))] transition hover:text-brand"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.back}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-white">
                  {copy.verified}
                </span>
                <span className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-brand">
                  {copy.confidence}
                </span>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-brand">
                {isKo ? path.pathType.ko : path.pathType.en}
              </p>
              <h1 className="mt-2 text-[46px] font-semibold leading-[1] tracking-[-0.055em] sm:text-[60px]">
                {path.name}
              </h1>
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
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand">
                  {research.score.band}
                </span>
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
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-brand shadow-sm">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{copy.verdictTitle}</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">{copy.verdict}</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.verdictText}</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.ladderTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.ladderText}</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <LicenceCard title={copy.dogging} text={copy.doggingText} index="01" />
              <LicenceCard title={copy.basic} text={copy.basicText} index="02" />
              <LicenceCard title={copy.intermediate} text={copy.intermediateText} index="03" />
              <LicenceCard title={copy.advanced} text={copy.advancedText} index="04" />
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[20px] border border-[hsl(var(--cc-border))] bg-slate-50/60 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">ENTRY REALITY</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{copy.realityTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.realityText}</p>
            </article>
            <article className="rounded-[20px] border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">DEMAND CHECK</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{copy.demandCaution}</h2>
              <p className="mt-3 text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.demandCautionText}</p>
            </article>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.breakdown}</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreCard
                icon={<CircleDollarSign className="size-5" />}
                title="Pay"
                score={research.score.components.pay}
                weight={FIFO_ENTRY_SCORE_WEIGHTS.pay}
                text={isKo ? research.pay.note.ko : research.pay.note.en}
              />
              <ScoreCard
                icon={<BadgeCheck className="size-5" />}
                title="Accessibility"
                score={research.score.components.accessibility}
                weight={FIFO_ENTRY_SCORE_WEIGHTS.accessibility}
                text={isKo ? research.accessibility.note.ko : research.accessibility.note.en}
              />
              <ScoreCard
                icon={<Gauge className="size-5" />}
                title="Demand"
                score={research.score.components.demand}
                weight={FIFO_ENTRY_SCORE_WEIGHTS.demand}
                text={isKo ? research.demand.note.ko : research.demand.note.en}
              />
              <ScoreCard
                icon={<GraduationCap className="size-5" />}
                title="Training burden"
                score={research.score.components.trainingBurden}
                weight={FIFO_ENTRY_SCORE_WEIGHTS.trainingBurden}
                text={isKo ? research.trainingBurden.note.ko : research.trainingBurden.note.en}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-5 lg:grid-cols-3">
            <RequirementCard
              icon={<BadgeCheck className="size-5" />}
              title={copy.requirements}
              items={research.requirements.common.map((item) => (isKo ? item.ko : item.en))}
            />
            <RequirementCard
              icon={<GraduationCap className="size-5" />}
              title={copy.training}
              items={research.requirements.training.map((item) => (isKo ? item.ko : item.en))}
            />
            <RequirementCard
              icon={<Ticket className="size-5" />}
              title={copy.avoid}
              items={research.requirements.notUniversal.map((item) => (isKo ? item.ko : item.en))}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.sources}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.sourceText}</p>
          <div className="mt-7 grid gap-3">
            {research.sources.map((source) => (
              <a
                key={`${source.publisher}-${source.label}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 rounded-[16px] border border-[hsl(var(--cc-border))] bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/25"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-brand">
                      {source.type}
                    </span>
                    <span className="text-xs text-[hsl(var(--cc-muted))]">{source.date}</span>
                  </div>
                  <p className="mt-2 font-semibold tracking-[-0.015em]">{source.label}</p>
                  <p className="mt-1 text-xs text-[hsl(var(--cc-muted))]">{source.publisher}</p>
                </div>
                <ExternalLink className="size-4 shrink-0 text-brand transition group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-5 rounded-[20px] border border-blue-100 bg-blue-50/55 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">Australia FIFO Entry Report 2026</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-muted))]">
                {isKo
                  ? "면허 비용·기간·현실적인 첫 취업 순서를 다른 FIFO 경로와 한 번에 비교합니다."
                  : "Compare licence cost, training time and the realistic first-job sequence against other FIFO entry paths."}
              </p>
            </div>
            <Link
              href={`${localizePath("/", locale)}#fifo-report`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]"
            >
              {copy.report}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[hsl(var(--cc-muted))]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[hsl(var(--cc-ink-secondary))]">{value}</p>
    </div>
  )
}

function LicenceCard({ title, text, index }: { title: string; text: string; index: string }) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5">
      <p className="text-[10px] font-semibold tracking-[0.08em] text-brand">{index}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))]">{text}</p>
    </article>
  )
}

function ScoreCard({
  icon,
  title,
  score,
  weight,
  text,
}: {
  icon: ReactNode
  title: string
  score: number
  weight: number
  text: string
}) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-brand">{icon}</span>
        <span className="text-xs font-semibold text-[hsl(var(--cc-muted))]">{Math.round(weight * 100)}%</span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <p className="text-3xl font-semibold tracking-[-0.05em] text-brand">{score.toFixed(1)}</p>
        <p className="pb-1 text-xs font-semibold text-[hsl(var(--cc-muted))]">/ 10</p>
      </div>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-3 text-xs leading-5 text-[hsl(var(--cc-muted))]">{text}</p>
    </article>
  )
}

function RequirementCard({ icon, title, items }: { icon: ReactNode; title: string; items: readonly string[] }) {
  return (
    <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5 sm:p-6">
      <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span>
      <h2 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-[hsl(var(--cc-muted))]">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
