"use client"

import Link from "next/link"
import { ArrowRight, FileText, ShieldCheck } from "lucide-react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE, formatAud } from "@/lib/report-catalog"

type ContextCopy = {
  title: string
  text: string
}

function contextCopy(pathSlug: string, pathName: string, isKo: boolean): ContextCopy {
  if (pathSlug === "rigger") {
    return isKo
      ? {
          title: "DG + RB에 돈을 쓰기 전에 전체 진입 경로를 비교하세요.",
          text: "가이드는 Dogging + Basic Rigging의 비용·교육시간을 Scaffolding, Plant Operator, 더 낮은 비용의 진입 옵션과 나란히 비교하고, 고용주 요구사항과 첫 지원 순서까지 이어줍니다.",
        }
      : {
          title: "Before you pay for DG + RB, compare the full entry plan.",
          text: "The guide puts Dogging + Basic Rigging cost and training time beside Scaffolding, Plant Operator and lower-cost entry options, then carries the decision through employer requirements and the first-application sequence.",
        }
  }

  if (pathSlug === "scaffolder") {
    return isKo
      ? {
          title: "Basic Scaffolding을 결제하기 전에 다른 경로와 비용을 비교하세요.",
          text: "가이드에서 Basic Scaffolding 경로를 broad safety stack, Dogging + Basic Rigging, Plant Operator 경로와 비용·기간 기준으로 비교한 뒤 교육과 지원 순서를 정할 수 있습니다.",
        }
      : {
          title: "Before you pay for Basic Scaffolding, compare the alternatives.",
          text: "The guide compares the Basic Scaffolding route with a broad safety stack, Dogging + Basic Rigging and Plant Operator pathways by cost and time, then connects that choice to training and application steps.",
        }
  }

  if (["dump-truck-operator", "plant-operator", "excavator-operator", "loader-operator"].includes(pathSlug)) {
    return isKo
      ? {
          title: "모바일 플랜트 쪽을 보고 있다면 교육비부터 비교하세요.",
          text: "가이드의 Plant Operator 섹션은 장비 경로를 다른 FIFO construction 진입 옵션과 비교하고, 티켓·교육 부담, 빠른 진입 전략, 고용주 요구사항과 지원 순서를 한 흐름으로 정리합니다.",
        }
      : {
          title: "Considering mobile plant? Compare the training spend before you commit.",
          text: "The guide's Plant Operator section compares equipment work with other FIFO construction entry options, then links ticket and training burden to fastest-entry strategy, employer requirements and application steps.",
        }
  }

  if (pathSlug === "drillers-offsider") {
    return isKo
      ? {
          title: "이 무료 직업 분석 다음에는 construction 대안을 비교하세요.",
          text: "이 페이지의 Driller's Offsider 근거를 그대로 반복하는 상품이 아닙니다. 가이드는 FIFO construction 직업 비교, 티켓 비용·교육시간, 빠른 진입 경로, 고용주 요구사항, training·recruiter·첫 지원 순서를 묶어 다음 결정을 돕습니다.",
        }
      : {
          title: "Use this free path analysis, then compare the construction alternatives.",
          text: "The paid guide does not simply repeat this Driller's Offsider page. It adds a FIFO construction role comparison, ticket cost and training time, fastest-entry pathways, employer requirements, training and recruiter channels, and the first-application sequence.",
        }
  }

  return isKo
    ? {
        title: `${pathName}을 본 다음, 실제 지출과 지원 순서를 결정하세요.`,
        text: "무료 사이트는 경로를 비교하는 데 쓰고, 가이드는 직업 선택 → 필요한 티켓 → 비용·기간 → 고용주 요구사항 → 첫 지원 순서까지 실행 계획을 잡는 데 사용합니다.",
      }
    : {
        title: `After reviewing ${pathName}, decide the spend and application sequence.`,
        text: "Use the free site to compare paths. Use the guide to move from role choice to ticket spend, cost and time, employer requirements and the first application sequence.",
      }
}

export function FifoReportContextCta({ pathSlug, pathName }: { pathSlug: string; pathName: string }) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const price = formatAud(FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents)
  const copy = contextCopy(pathSlug, pathName, isKo)
  const reportHref = localizePath("/fifo/report", locale)
  const bullets = isKo
    ? ["티켓 비용 + 교육시간", "빠른 진입 경로 비교", "19개 WA 채용공고 요구사항 분석"]
    : ["Ticket cost + training time", "Fastest-entry pathway comparison", "19-ad WA employer requirement analysis"]

  return (
    <section data-testid="fifo-context-report-cta" className="border-t border-[hsl(var(--cc-border))] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-5 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[1080px] overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(24,76,146,0.08)]">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {isKo ? "NEXT STEP · FIFO CONSTRUCTION FAST ENTRY GUIDE" : "NEXT STEP · FIFO CONSTRUCTION FAST ENTRY GUIDE"}
            </div>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{copy.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[hsl(var(--cc-ink-secondary))]">{copy.text}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {bullets.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-[hsl(var(--cc-muted))]">{item}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/55 p-4 lg:min-w-[220px] lg:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--cc-muted))]">{isKo ? "완성된 23페이지 디지털 가이드" : "Complete 23-page digital guide"}</p>
            <p className="mt-1 text-3xl font-semibold tracking-[-0.045em] text-brand">{price}</p>
            <Link href={reportHref} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">
              <FileText className="size-4" aria-hidden="true" />
              {isKo ? `가이드 전체 보기 — ${price}` : `See the full guide — ${price}`}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <p className="mt-2 text-[10px] leading-4 text-[hsl(var(--cc-muted))]">Western Australia · Edition 1.0</p>
          </div>
        </div>
      </div>
    </section>
  )
}
