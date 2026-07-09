import Link from "next/link"
import type { PilotOccupation } from "@/lib/pilot-launch-gate"
import { scoreHiddenRoiPath } from "@/lib/hidden-roi"

export function pilotOccupationSlug(occupation: Pick<PilotOccupation, "nameEn" | "sourceCode">) {
  const base = occupation.nameEn
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return base || occupation.sourceCode.toLowerCase()
}

export function PilotOccupationPage({
  occupation,
  locale,
}: {
  occupation: PilotOccupation
  locale: "en" | "ko"
}) {
  const roi = scoreHiddenRoiPath(occupation)
  const korean = locale === "ko"
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
          <Link href={korean ? `/ko/${occupation.country.toLowerCase()}/jobs` : `/expansion/${occupation.country.toLowerCase()}/jobs`} className="text-sm font-semibold text-slate-500 hover:text-slate-950">
            {korean ? "직업 목록" : "Occupation list"}
          </Link>
          <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-brand">{occupation.sourceCode} · ISCO {occupation.iscoCode ?? "pending"}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">{korean ? occupation.nameKo : occupation.nameEn}</h1>
          {occupation.localName && <p className="mt-3 text-lg text-slate-500">{occupation.localName}</p>}
          <p className="mt-5 text-base leading-7 text-slate-600">
            {korean ? "임금, 수요, 외국인 취업 경로, 언어 장벽을 함께 검증한 숨은 고ROI 직업 경로입니다." : "A hidden high-ROI path validated across income, demand, foreign-worker access, and language barriers."}
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6">
        <Metric label={korean ? "중위 임금" : "Median salary"} value={occupation.medianSalary === null ? "Pending" : occupation.medianSalary.toLocaleString()} />
        <Metric label={korean ? "수요 점수" : "Demand score"} value={occupation.shortageScore === null ? "Pending" : `${occupation.shortageScore}/100`} />
        <Metric label={korean ? "고ROI 점수" : "Hidden ROI score"} value={roi.score === null ? "Pending" : `${roi.score}/100`} />
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}
