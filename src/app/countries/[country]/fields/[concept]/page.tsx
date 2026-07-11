import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { COUNTRY_ROI_INSIGHTS } from "@/data/country-roi-mvp"
import { STUDY_CONCEPTS, getStudyConcept } from "@/data/study-concepts"
import { recommendStudyCountries } from "@/lib/study-product/recommendation"

type Props = { params: Promise<{ country: string; concept: string }> }

export function generateStaticParams() {
  return STUDY_CONCEPTS.flatMap((concept) => {
    if (!concept.legacyField) return []
    return COUNTRY_ROI_INSIGHTS
      .filter((country) => concept.coverageByCountry[country.code] === "DECISION_READY")
      .map((country) => ({ country: country.slug, concept: concept.slug }))
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const values = await params
  const concept = getStudyConcept(values.concept)
  const country = COUNTRY_ROI_INSIGHTS.find((item) => item.slug === values.country)
  if (!concept || !country) return {}
  const path = `/countries/${country.slug}/fields/${concept.slug}`
  return {
    title: `Study ${concept.label} in ${country.name}: cost and career evidence | CampCareer`,
    description: `Compare verified ${concept.label} study costs, career signals and post-study options in ${country.name}, with dated sources.`,
    alternates: { canonical: path, languages: { en: path, "x-default": path } },
  }
}

export default async function CountryConceptPage({ params }: Props) {
  const values = await params
  const concept = getStudyConcept(values.concept)
  const country = COUNTRY_ROI_INSIGHTS.find((item) => item.slug === values.country)
  if (!concept || !country || !concept.legacyField || concept.coverageByCountry[country.code] !== "DECISION_READY") notFound()

  const result = recommendStudyCountries({
    locale: "en",
    originCountry: "GLOBAL",
    targetConceptId: concept.id,
    firstYearBudget: { amount: 50_000, currency: "USD" },
    priority: "CAREER_OUTCOME",
  })
  const recommendation = result.rankedCountries.find((item) => item.countryCode === country.code)
  if (!recommendation) notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Verified country pathway</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Study {concept.label} in {country.name}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{recommendation.why} {recommendation.caution}</p>
      <div className="mt-8 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-800">{recommendation.fitBand.replaceAll("_", " ")}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Data {result.dataVersion}</span></div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendation.metrics.map((metric) => (
          <article key={metric.key} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{metric.label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{metric.value}</p>
            <p className="mt-4 text-xs leading-5 text-slate-500">{metric.sourceName} · as of {metric.asOf} · verified {metric.lastVerifiedAt}</p>
            {metric.sourceUrl ? <a href={metric.sourceUrl} rel="noreferrer" target="_blank" className="mt-2 inline-flex text-xs font-semibold text-blue-700 hover:underline">Open source</a> : null}
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-semibold text-amber-950">Important trade-off</h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">{recommendation.caution}</p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={recommendation.shortlistHref} className="inline-flex min-h-12 items-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700">View verified courses</Link>
        <Link href={`/fields/${concept.slug}`} className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 px-6 text-sm font-bold text-slate-800 hover:bg-slate-50">Compare other countries</Link>
      </div>
      <p className="mt-10 text-xs leading-5 text-slate-500">{result.disclaimer}</p>
    </main>
  )
}
