import Link from "next/link"
import type { ExpansionCountry } from "@/data/expansion-countries"
import { PILOT_OCCUPATIONS } from "@/data/pilot-occupations"
import { getPilotSources, type PilotCountryCode } from "@/data/pilot-source-registry"
import { evaluatePilotLaunch, isPilotOccupationIndexable } from "@/lib/pilot-launch-gate"
import { isPilotCountry } from "@/components/expansion/country-pilot-page"

const PILOT_CODE_BY_SLUG: Record<string, PilotCountryCode> = { kr: "KR", jp: "JP", sg: "SG", fr: "FR" }

export function PilotJobsPage({ country, locale }: { country: ExpansionCountry; locale: "en" | "ko" }) {
  if (!isPilotCountry(country)) return null
  const code = PILOT_CODE_BY_SLUG[country.slug]
  const sources = getPilotSources(code)
  const gate = evaluatePilotLaunch(code, sources, PILOT_OCCUPATIONS)
  const jobs = PILOT_OCCUPATIONS.filter((occupation) => occupation.country === code && isPilotOccupationIndexable(occupation))
  const korean = locale === "ko"

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
          <Link href={korean ? `/ko/${country.slug}` : `/expansion/${country.slug}`} className="text-sm font-semibold text-slate-500 hover:text-slate-950">
            {korean ? `${country.nameKo} 국가 페이지` : `${country.nameEn} country page`}
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand">{korean ? "직업 데이터" : "Occupation data"}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">{korean ? `${country.nameKo} 숨은 고ROI 경로` : `Hidden high-ROI paths in ${country.nameEn}`}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {korean ? "임금, 수요, 외국인 취업 경로, 언어 근거가 모두 검토된 직업만 여기에 공개합니다." : "Only occupations with reviewed salary, demand, foreign-worker pathway, and language evidence appear here."}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {gate.ready ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <article key={job.sourceCode} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{job.iscoCode ?? "Local code"}</p>
                <h2 className="mt-2 text-xl font-semibold">{korean ? job.nameKo : job.nameEn}</h2>
                <p className="mt-1 text-sm text-slate-500">{job.localName}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <p className="font-semibold">{korean ? "직업 페이지를 아직 공개하지 않습니다." : "Occupation pages are not public yet."}</p>
            <p className="mt-2 text-sm leading-6">{korean ? "50개 검토 직업과 80% 이상의 임금·수요 근거가 채워질 때 자동으로 공개됩니다." : "They publish automatically after 50 reviewed occupations meet the 80% salary-and-demand evidence threshold."}</p>
          </div>
        )}
      </section>
    </main>
  )
}
