"use client"

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
import type { FifoPath } from "@/lib/fifo/fifo-paths"
import { FIFO_ENTRY_SCORE_WEIGHTS } from "@/lib/fifo/entry-score"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"

export function VerifiedScaffolderJobDetail({ path }: { path: FifoPath }) {
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
        verdict: "고수입·고수요 직업이지만, SB 하나로 바로 FIFO에 들어가는 경로는 아닙니다.",
        verdictText: "현실적인 초보 경로는 Basic 면허와 로컬/산업 현장 또는 traineeship으로 시작해 경험을 쌓고, Intermediate/Advanced와 현장 티켓을 추가한 뒤 FIFO로 이동하는 것입니다. 현재 대형 WA FIFO 공고는 SI/SA 보유자 중심입니다.",
        ladderTitle: "Scaffolder 면허는 세 단계입니다",
        ladderText: "Scaffolding work에서 4m 초과 추락 위험이 있는 범위는 HRWL 대상입니다. 면허 단계는 누적되고, FIFO 시장에서는 Basic보다 Intermediate/Advanced의 가치가 훨씬 큽니다.",
        basic: "Basic · SB",
        basicText: "CPCCLSF2001 · 선행 단위 없음 · modular/prefabricated scaffold 등 Basic 범위",
        intermediate: "Intermediate · SI",
        intermediateText: "CPCCLSF3001 · Basic 선행 · tube & coupler, cantilevered scaffold, mast climber 등",
        advanced: "Advanced · SA",
        advancedText: "CPCCLSF4001 · Intermediate 선행 · hung/suspended scaffold 등 Advanced 범위",
        realityTitle: "첫 취업과 첫 FIFO 취업을 분리해서 보세요",
        realityText: "Caledonia는 초보 Scaffolder traineeship을 반복 운영하지만, 현재 SRG/Bugarrba·Linkforce 계열 FIFO 공고는 SI/SA와 site-ready 조건을 요구합니다. 즉 무경력자는 먼저 현장 역량을 만든 뒤 FIFO로 이동하는 전략이 더 현실적입니다.",
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
        verdict: "High pay and high demand — but an SB ticket alone is not a direct FIFO shortcut.",
        verdictText: "The practical beginner route is Basic licensing plus local/industrial work or a structured traineeship, then moving into Intermediate/Advanced licensing and site-ready experience before targeting major FIFO work. Current WA FIFO hiring is heavily weighted toward SI/SA scaffolders.",
        ladderTitle: "Scaffolding has a three-step licence ladder",
        ladderText: "Scaffolding work with a potential fall over four metres is high-risk work. The licence classes build on each other, and the FIFO market values Intermediate and Advanced capability much more than Basic alone.",
        basic: "Basic · SB",
        basicText: "CPCCLSF2001 · no prerequisite · modular/prefabricated scaffolds and other Basic-class work",
        intermediate: "Intermediate · SI",
        intermediateText: "CPCCLSF3001 · Basic prerequisite · tube-and-coupler, cantilevered scaffolds, mast climbers and more",
        advanced: "Advanced · SA",
        advancedText: "CPCCLSF4001 · Intermediate prerequisite · hung and suspended scaffolds and Advanced-class work",
        realityTitle: "Separate your first job from your first FIFO job",
        realityText: "Caledonia runs recurring beginner scaffolding traineeships, while current SRG/Bugarrba and other major-site FIFO ads focus on SI/SA, recent safety tickets and site readiness. A beginner can enter scaffolding; the FIFO move usually comes after competency and experience are built.",
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
              <p className="mt-4 text-xs font-medium text-[hsl(var(--cc-muted))]">{copy.asOf}</p>
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
            <div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{copy.verdictTitle}</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">{copy.verdict}</h2><p className="mt-3 max-w-4xl text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.verdictText}</p></div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.ladderTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.ladderText}</p>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              <LicenceCard title={copy.basic} text={copy.basicText} index="01" />
              <LicenceCard title={copy.intermediate} text={copy.intermediateText} index="02" />
              <LicenceCard title={copy.advanced} text={copy.advancedText} index="03" />
            </div>
          </div>

          <div className="mt-12 rounded-[20px] border border-[hsl(var(--cc-border))] bg-slate-50/60 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">ENTRY REALITY</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{copy.realityTitle}</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.realityText}</p>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.breakdown}</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreCard icon={<CircleDollarSign className="size-5" />} title="Pay" score={research.score.components.pay} weight={FIFO_ENTRY_SCORE_WEIGHTS.pay} text={isKo ? research.pay.note.ko : research.pay.note.en} />
              <ScoreCard icon={<BadgeCheck className="size-5" />} title="Accessibility" score={research.score.components.accessibility} weight={FIFO_ENTRY_SCORE_WEIGHTS.accessibility} text={isKo ? research.accessibility.note.ko : research.accessibility.note.en} />
              <ScoreCard icon={<Gauge className="size-5" />} title="Demand" score={research.score.components.demand} weight={FIFO_ENTRY_SCORE_WEIGHTS.demand} text={isKo ? research.demand.note.ko : research.demand.note.en} />
              <ScoreCard icon={<GraduationCap className="size-5" />} title="Training burden" score={research.score.components.trainingBurden} weight={FIFO_ENTRY_SCORE_WEIGHTS.trainingBurden} text={isKo ? research.trainingBurden.note.ko : research.trainingBurden.note.en} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-5 lg:grid-cols-3">
            <RequirementCard icon={<BadgeCheck className="size-5" />} title={copy.requirements} items={research.requirements.common.map((item) => isKo ? item.ko : item.en)} />
            <RequirementCard icon={<GraduationCap className="size-5" />} title={copy.training} items={research.requirements.training.map((item) => isKo ? item.ko : item.en)} />
            <RequirementCard icon={<Ticket className="size-5" />} title={copy.avoid} items={research.requirements.notUniversal.map((item) => isKo ? item.ko : item.en)} />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{copy.sources}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.sourceText}</p>
          <div className="mt-7 grid gap-3">
            {research.sources.map((source) => (
              <a key={`${source.publisher}-${source.label}`} href={source.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 rounded-[16px] border border-[hsl(var(--cc-border))] bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/25">
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-brand">{source.type}</span><span className="text-xs text-[hsl(var(--cc-muted))]">{source.date}</span></div><p className="mt-2 font-semibold tracking-[-0.015em]">{source.label}</p><p className="mt-1 text-xs text-[hsl(var(--cc-muted))]">{source.publisher}</p></div>
                <ExternalLink className="size-4 shrink-0 text-brand transition group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-5 rounded-[20px] border border-blue-100 bg-blue-50/55 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">Australia FIFO Entry Report 2026</p><p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? "면허 비용·기간·현실적인 첫 취업 순서를 다른 FIFO 경로와 한 번에 비교합니다." : "Compare licence cost, training time and the realistic first-job sequence against other FIFO entry paths."}</p></div>
            <Link href={`${localizePath("/", locale)}#fifo-report`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">{copy.report}<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] font-semibold tracking-[0.06em] text-[hsl(var(--cc-muted))]">{label}</p><p className="mt-1 text-sm font-semibold text-[hsl(var(--cc-ink-secondary))]">{value}</p></div>
}

function LicenceCard({ index, title, text }: { index: string; title: string; text: string }) {
  return <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5"><span className="text-xs font-semibold text-brand">{index}</span><h3 className="mt-3 text-xl font-semibold tracking-[-0.025em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))]">{text}</p></article>
}

function ScoreCard({ icon, title, score, weight, text }: { icon: React.ReactNode; title: string; score: number; weight: number; text: string }) {
  return <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5"><div className="flex items-center justify-between gap-3"><span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span><span className="text-xs font-semibold text-[hsl(var(--cc-muted))]">{Math.round(weight * 100)}%</span></div><div className="mt-5 flex items-end gap-1"><span className="text-3xl font-semibold tracking-[-0.05em] text-brand">{score.toFixed(1)}</span><span className="pb-1 text-xs text-[hsl(var(--cc-muted))]">/10</span></div><h3 className="mt-2 text-sm font-semibold">{title}</h3><p className="mt-3 text-xs leading-5 text-[hsl(var(--cc-muted))]">{text}</p></article>
}

function RequirementCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return <article className="rounded-[18px] border border-[hsl(var(--cc-border))] bg-white p-5"><span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span><h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{title}</h3><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-[hsl(var(--cc-muted))]"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />{item}</li>)}</ul></article>
}
