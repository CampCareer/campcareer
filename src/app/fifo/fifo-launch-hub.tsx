"use client"

import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, CircleDollarSign, FileText, Gauge, ShieldCheck, Ticket } from "lucide-react"
import { ALL_FIFO_PATHS } from "@/lib/fifo/all-fifo-paths"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE, formatAud } from "@/lib/report-catalog"

export function FifoLaunchHub() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const reportHref = localizePath("/fifo/report", locale)
  const reportPrice = formatAud(FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents)
  const copy = isKo
    ? {
        eyebrow: "AUSTRALIA FIFO · 2026",
        title: "FIFO 진입 경로를 돈 쓰기 전에 비교하세요.",
        intro: "CampCareer는 급여만 보지 않습니다. 실제 첫 취업 가능성, 필요한 조건, 교육 부담과 현재 수요를 함께 봅니다.",
        report: "2026 FIFO 가이드 보기",
        pathsTitle: "첫 FIFO 경로 비교",
        pathsText: "Driller's Offsider, Dump Truck Operator, Scaffolder, Rigger는 근거 검증을 통과했습니다. Plant Operator는 장비별로 분리하며 Excavator와 Loader는 검증 전까지 점수를 공개하지 않습니다.",
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
        cautionText: "Driller's Offsider는 입사 후 Cert II, Dump Truck는 고용주 traineeship을 통한 Cert III 경로가 확인됩니다. Scaffolder는 SB→SI/SA와 현장경력이 중요하고, Rigger는 DG→RB→RI→RA의 순차 면허와 경력이 일반 시장의 핵심입니다. 단, Monadelphous에는 실제 무경력 FIFO Rigging traineeship 경로가 확인됩니다.",
        evidenceTitle: "근거가 있는 숫자만 공개합니다.",
        evidenceText: "현재 Driller's Offsider, Dump Truck Operator, Scaffolder, Rigger에만 점수를 공개합니다. Plant Operator 전체, Excavator, Loader는 동일한 evidence gate를 통과할 때까지 미평가 상태입니다.",
        bridgeEyebrow: "FREE INSIGHT → FULL EXECUTION GUIDE",
        bridgeTitle: "사이트에서 경로를 비교하고, 가이드에서 실제 지출과 지원 순서를 정하세요.",
        bridgeText: "무료 FIFO 페이지는 어떤 경로가 현실적인지 판단할 근거를 제공합니다. 완성된 23페이지 가이드는 ticket 비용·교육시간, 빠른 진입 경로, 19개 WA 채용공고 요구사항, training·recruiter·첫 지원 순서까지 실행 단계로 이어줍니다.",
        bridgeCta: `가이드 전체 보기 — ${reportPrice}`,
        bridgeItems: ["티켓 비용 + 교육시간", "빠른 진입 경로 비교", "19개 WA 채용공고 분석"],
      }
    : {
        eyebrow: "AUSTRALIA FIFO · 2026",
        title: "Compare FIFO entry paths before you spend money on training.",
        intro: "CampCareer compares first-job reality, entry requirements, training burden, pay and current demand — not headline salary alone.",
        report: "See the 2026 FIFO Guide",
        pathsTitle: "First FIFO paths",
        pathsText: "Driller's Offsider, Dump Truck Operator, Scaffolder and Rigger have passed the evidence gate. Plant Operator is split by equipment; Excavator and Loader stay unrated until their evidence is strong enough.",
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
        cautionText: "Driller's Offsider can lead to employer-supported Cert II training, and Dump Truck traineeships can include Certificate III. Scaffolder depends on SB→SI/SA plus site experience. Rigger follows DG→RB→RI→RA and mainstream FIFO hiring usually expects experience, although Monadelphous currently demonstrates a genuine zero-experience FIFO rigging traineeship route.",
        evidenceTitle: "Only evidence-backed numbers go live.",
        evidenceText: "Driller's Offsider, Dump Truck Operator, Scaffolder and Rigger are rated today. Broad Plant Operator, Excavator and Loader stay unrated until they pass the same evidence gate.",
        bridgeEyebrow: "FREE INSIGHT → FULL EXECUTION GUIDE",
        bridgeTitle: "Compare the path on the site. Plan the spend and application sequence in the guide.",
        bridgeText: "The free FIFO pages help you judge which paths are realistic. The completed 23-page guide goes further with ticket cost and training time, fastest-entry pathways, a 19-ad WA employer requirement analysis, training and recruiter channels, and the first-application sequence.",
        bridgeCta: `See the full guide — ${reportPrice}`,
        bridgeItems: ["Ticket cost + training time", "Fastest-entry pathway comparison", "19-ad WA employer analysis"],
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
          <Link href={reportHref} className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">
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

          <div data-testid="fifo-hub-report-bridge" className="mt-8 overflow-hidden rounded-[22px] border border-blue-100 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#eff6ff_100%)] p-5 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand">{copy.bridgeEyebrow}</p>
                <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{copy.bridgeTitle}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[hsl(var(--cc-ink-secondary))]">{copy.bridgeText}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {copy.bridgeItems.map((item) => (
                    <span key={item} className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-[hsl(var(--cc-muted))]">{item}</span>
                  ))}
                </div>
              </div>
              <div className="lg:text-right">
                <p className="text-3xl font-semibold tracking-[-0.045em] text-brand">{reportPrice}</p>
                <Link href={reportHref} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">
                  <FileText className="size-4" aria-hidden="true" />
                  {copy.bridgeCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
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
