"use client"

import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, CircleDollarSign, Gauge, ShieldCheck, Ticket } from "lucide-react"
import { ALL_FIFO_PATHS } from "@/lib/fifo/all-fifo-paths"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"

export function FifoLaunchHub() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const copy = isKo
    ? {
        eyebrow: "AUSTRALIA FIFO · 2026",
        title: "FIFO 진입 경로를 돈 쓰기 전에 비교하세요.",
        intro: "CampCareer는 급여만 보지 않습니다. 실제 첫 취업 가능성, 필요한 조건, 교육 부담과 현재 수요를 함께 봅니다.",
        report: "2026 FIFO 리포트",
        pathsTitle: "첫 FIFO 경로 비교",
        pathsText: "Driller's Offsider, Dump Truck Operator, Scaffolder는 근거 검증을 통과했습니다. Plant Operator는 장비별로 분리하며 Excavator와 Loader는 검증 전까지 점수를 공개하지 않습니다.",
        entryScore: "ENTRY SCORE",
        pay: "PAY",
        access: "ENTRY",
        demand: "DEMAND",
        verified: "VERIFIED",
        researching: "RESEARCHING",
        verifying: "검증 중",
        open: "상세 근거 보기",
        methodTitle: "Entry Score는 이렇게 계산합니다",
        methodText: "Pay 35% · Accessibility 30% · Demand 20% · Training burden 15%. 모든 항목이 0–10점이고, 근거가 부족하면 총점을 만들지 않습니다.",
        cautionTitle: "티켓보다 직업을 먼저 고르세요.",
        cautionText: "Driller's Offsider는 입사 후 Cert II, Dump Truck는 고용주 traineeship을 통한 Cert III 경로가 확인됩니다. Scaffolder는 SB만 따는 것보다 SB→SI/SA와 현장경력을 어떻게 쌓을지가 더 중요합니다.",
        evidenceTitle: "근거가 있는 숫자만 공개합니다.",
        evidenceText: "현재 Driller's Offsider, Dump Truck Operator, Scaffolder에만 점수를 공개합니다. Plant Operator 전체, Excavator, Loader는 동일한 evidence gate를 통과할 때까지 미평가 상태입니다.",
      }
    : {
        eyebrow: "AUSTRALIA FIFO · 2026",
        title: "Compare FIFO entry paths before you spend money on training.",
        intro: "CampCareer compares first-job reality, entry requirements, training burden, pay and current demand — not headline salary alone.",
        report: "2026 FIFO Report",
        pathsTitle: "First FIFO paths",
        pathsText: "Driller's Offsider, Dump Truck Operator and Scaffolder have passed the evidence gate. Plant Operator is split by equipment; Excavator and Loader stay unrated until their evidence is strong enough.",
        entryScore: "ENTRY SCORE",
        pay: "PAY",
        access: "ENTRY",
        demand: "DEMAND",
        verified: "VERIFIED",
        researching: "RESEARCHING",
        verifying: "Verifying",
        open: "See the evidence",
        methodTitle: "How Entry Score works",
        methodText: "Pay 35% · Accessibility 30% · Demand 20% · Training burden 15%. Each component is scored 0–10 and no total is published until the evidence gate passes.",
        cautionTitle: "Choose the job before buying tickets.",
        cautionText: "Driller's Offsider can lead to employer-supported Cert II training after hire, and Dump Truck traineeships can include Certificate III training. For Scaffolder, the real question is how to build from SB into SI/SA and site experience — not how fast you can buy one ticket.",
        evidenceTitle: "Only evidence-backed numbers go live.",
        evidenceText: "Driller's Offsider, Dump Truck Operator and Scaffolder are rated today. Broad Plant Operator, Excavator and Loader stay unrated until they pass the same evidence gate.",
      }

  return (
    <div className="bg-white text-[hsl(var(--cc-ink))]">
      <section className="border-b border-[hsl(var(--cc-border))] bg-gradient-to-b from-blue-50/60 to-white px-5 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm">
            <ShieldCheck className="size-3.5" aria-hidden="true" />{copy.eyebrow}
          </div>
          <h1 className="mx-auto mt-5 max-w-4xl text-[42px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[56px] lg:text-[64px]">{copy.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[hsl(var(--cc-ink-secondary))] sm:text-lg sm:leading-8">{copy.intro}</p>
          <Link href={`${localizePath("/", locale)}#fifo-report`} className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">
            {copy.report}<ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.pathsTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))] sm:text-base">{copy.pathsText}</p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ALL_FIFO_PATHS.map((path) => {
              const published = path.published
              return (
                <article key={path.slug} className="flex min-h-[380px] flex-col rounded-[20px] border border-[hsl(var(--cc-border))] bg-white p-5 shadow-[0_14px_36px_rgba(16,24,40,0.055)] sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className={published ? "rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold tracking-[0.05em] text-white" : "rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.05em] text-brand"}>{published ? copy.verified : copy.researching}</span>
                    <BriefcaseBusiness className="size-5 text-brand" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-[hsl(var(--cc-muted))]">{isKo ? path.pathType.ko : path.pathType.en}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{path.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[hsl(var(--cc-muted))]">{isKo ? path.summary.ko : path.summary.en}</p>

                  <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 border-y border-[hsl(var(--cc-border))] py-4">
                    <Metric label={copy.entryScore} value={published ? `${published.score.total} ${published.score.band}` : "—"} highlight={Boolean(published)} />
                    <Metric label={copy.pay} value={published ? published.pay.display : copy.verifying} />
                    <Metric label={copy.access} value={published ? `${published.accessibility.score.toFixed(1)}/10` : copy.verifying} />
                    <Metric label={copy.demand} value={published ? `${published.demand.score.toFixed(1)}/10` : copy.verifying} />
                  </div>

                  <Link href={localizePath(`/fifo/${path.slug}`, locale)} className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand transition hover:text-[hsl(var(--brand-press))]">
                    {copy.open}<ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--cc-border))] bg-slate-50/60 px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-5 lg:grid-cols-2">
          <article className="rounded-[20px] border border-[hsl(var(--cc-border))] bg-white p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-brand"><Gauge className="size-5" aria-hidden="true" /></span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">{copy.methodTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.methodText}</p>
          </article>
          <article id="tickets" className="scroll-mt-24 rounded-[20px] border border-blue-100 bg-blue-50/55 p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-white text-brand shadow-sm"><Ticket className="size-5" aria-hidden="true" /></span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">{copy.cautionTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[hsl(var(--cc-muted))]">{copy.cautionText}</p>
          </article>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto flex max-w-[1100px] items-start gap-4 rounded-[20px] border border-blue-100 bg-white p-5 sm:p-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-50 text-brand"><CircleDollarSign className="size-5" aria-hidden="true" /></span>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">{copy.evidenceTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-[hsl(var(--cc-muted))]">{copy.evidenceText}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div><p className="text-[9px] font-semibold tracking-[0.05em] text-[hsl(var(--cc-muted))]">{label}</p><p className={highlight ? "mt-1 text-lg font-semibold tracking-[-0.03em] text-brand" : "mt-1 text-xs font-semibold text-[hsl(var(--cc-ink-secondary))]"}>{value}</p></div>
}
