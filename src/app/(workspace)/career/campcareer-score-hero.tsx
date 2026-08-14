"use client"

import { useEffect, useState } from "react"
import { CircleAlert } from "lucide-react"
import type { CampCareerScore, CampCareerVerdict } from "@/lib/campcareer-score"
import type { CareerMarketInsight } from "@/lib/workspace/career-market-contract"
import type { OverviewSearchValues } from "../home/home-overview-config"

type Locale = "en" | "ko"

type EvidenceConfidence = "verified" | "estimated" | "limited_evidence"

const verdictLabel: Record<CampCareerVerdict, { en: string; ko: string }> = {
  excellent: { en: "Excellent career", ko: "매우 매력적인 커리어" },
  strong: { en: "Strong career", ko: "매력적인 커리어" },
  mixed: { en: "Mixed career", ko: "장단점이 뚜렷한 커리어" },
  challenging: { en: "Challenging career", ko: "진입 판단이 필요한 커리어" },
  tough: { en: "Tough career", ko: "신중한 판단이 필요한 커리어" },
}

const confidenceLabel: Record<EvidenceConfidence, { en: string; ko: string }> = {
  verified: { en: "Verified", ko: "검증됨" },
  estimated: { en: "Estimated", ko: "추정 포함" },
  limited_evidence: { en: "Limited", ko: "근거 제한" },
}

function publicScore(insight: CareerMarketInsight): CampCareerScore | null {
  return insight.profile?.metric.campCareerScore ?? insight.foundation?.campCareerScore ?? null
}

function evidenceConfidence(insight: CareerMarketInsight): EvidenceConfidence {
  if (insight.foundation?.scoreConfidence) return insight.foundation.scoreConfidence
  const status = insight.profile?.metric.scoreStatus
  if (status === "published" || status === "reviewed") return "verified"
  if (status === "provisional") return "estimated"
  return "limited_evidence"
}

function verdictSentence(score: CampCareerScore, locale: Locale) {
  if (score.entry <= 4) {
    return locale === "ko"
      ? "시장 매력도에 비해 자격·교육·면허 등 취업 준비 장벽이 큰 편입니다."
      : "The market can be attractive, but qualification, training or licensing makes the route to job-ready status harder."
  }
  if (score.demand >= 8 && score.pay >= 7) {
    return locale === "ko"
      ? "높은 수요와 좋은 보수가 이 직업의 가장 큰 강점입니다."
      : "Strong demand and good relative pay are the biggest reasons this career scores well."
  }
  if (score.demand <= 4) {
    return locale === "ko"
      ? "진입 조건보다 현지 일자리 수요가 전체 점수를 더 크게 제한합니다."
      : "Local job demand is the main factor holding this career back."
  }
  if (score.pay <= 4) {
    return locale === "ko"
      ? "일자리 기회가 있더라도 현지 기준 상대 보수가 전체 매력도를 낮춥니다."
      : "Job opportunities may exist, but relative pay reduces the overall attractiveness."
  }
  return locale === "ko"
    ? "수요, 보수, 진입 난이도를 함께 보면 장점과 비용이 비교적 균형적인 직업입니다."
    : "Demand, pay and entry difficulty create a relatively balanced career tradeoff."
}

function ScoreDimension({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <div className="flex items-end justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-2xl font-semibold tracking-[-0.05em] text-slate-950">{value}<span className="ml-0.5 text-xs font-medium text-slate-400">/10</span></p>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  )
}

export function CampCareerScoreHero({ query, locale }: { query: OverviewSearchValues; locale: Locale }) {
  const [insight, setInsight] = useState<CareerMarketInsight | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setInsight(null)
    setFailed(false)
    fetch(`/api/home/career-insight?country=${encodeURIComponent(query.country)}&career=${encodeURIComponent(query.occupation)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Career score request failed")
        return response.json() as Promise<CareerMarketInsight>
      })
      .then(setInsight)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setFailed(true)
      })
    return () => controller.abort()
  }, [query.country, query.occupation])

  if (failed) return null

  if (!insight) {
    return <section className="mt-5 animate-pulse rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8"><div className="h-4 w-40 rounded bg-slate-200" /><div className="mt-5 h-16 w-48 rounded bg-slate-200" /><div className="mt-6 grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-24 rounded-2xl bg-slate-200" />)}</div></section>
  }

  if (!insight.country) return null

  const score = publicScore(insight)
  const careerName = locale === "ko" ? insight.career.labelKo : insight.career.label
  const confidence = evidenceConfidence(insight)

  if (!score) {
    return (
      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="campcareer-score-heading">
        <p className="text-xs font-bold tracking-[0.12em] text-blue-700">{insight.country.name} · {careerName}</p>
        <h1 id="campcareer-score-heading" className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl">{locale === "ko" ? "점수 준비 중" : "Score not ready yet"}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{locale === "ko" ? "Demand, Pay, Entry 중 하나 이상의 필수 근거가 아직 충분하지 않아 총점을 만들지 않았습니다. 확인된 근거와 진입 경로는 아래에서 계속 볼 수 있습니다." : "One or more required Demand, Pay or Entry evidence groups are not ready, so CampCareer does not manufacture a total. Verified evidence and the pathway remain available below."}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800"><CircleAlert className="size-3.5" /> {locale === "ko" ? "임의 평균값을 사용하지 않음" : "No guessed average used"}</div>
      </section>
    )
  }

  return (
    <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="campcareer-score-heading">
      <p className="text-xs font-bold tracking-[0.12em] text-blue-700">{insight.country.name} · {careerName}</p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">CampCareer Score</p>
          <h1 id="campcareer-score-heading" className="mt-1 text-6xl font-semibold leading-none tracking-[-0.09em] text-slate-950 sm:text-7xl">{score.total}<span className="ml-1 text-lg font-medium tracking-[-0.03em] text-slate-400">/100</span></h1>
        </div>
        <div className="sm:max-w-lg sm:text-right">
          <p className="text-lg font-bold uppercase tracking-[0.06em] text-slate-900">{verdictLabel[score.verdict][locale]}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{verdictSentence(score, locale)}</p>
          <p className="mt-2 text-xs font-medium text-slate-500">{locale === "ko" ? "근거 신뢰도" : "Evidence"}: {confidenceLabel[confidence][locale]}</p>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <ScoreDimension label="Demand" value={score.demand} helper={locale === "ko" ? "현지에서 실제 일자리 수요가 얼마나 강한가" : "How strong is real local demand for this work?"} />
        <ScoreDimension label="Pay" value={score.pay} helper={locale === "ko" ? "현지 노동시장과 비교해 보수가 얼마나 좋은가" : "How well does it pay relative to the local labour market?"} />
        <ScoreDimension label="Entry" value={score.entry} helper={locale === "ko" ? "새로 시작해 취업 준비 상태가 되기 얼마나 쉬운가" : "How easy is it for a newcomer to become job-ready?"} />
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">{locale === "ko" ? "공식: Demand 40% + Pay 30% + Entry 30%. 비자와 개인 자격은 이 점수에 포함하지 않고 아래 경로에서 별도로 다룹니다." : "Formula: Demand 40% + Pay 30% + Entry 30%. Visa and personal eligibility are excluded from this public score and handled in the pathway below."}</p>
    </section>
  )
}
