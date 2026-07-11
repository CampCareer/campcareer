import Link from "next/link"
import { notFound } from "next/navigation"
import { getAUMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { STATE_NAMES } from "../../../states"
import type { StateCode } from "../../../states"
import UniversityStaticCard from "../../../UniversityStaticCard"

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await getAUMapData()
  return data.auRankedColleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = await getAUMapData()
  const college = data.auRankedColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const stateName = STATE_NAMES[college.college_state as StateCode] ?? college.college_state
  const title = `${college.college_name} — QS #${college.qsRank} · ${stateName}, Australia`
  const description = `${college.college_name} is a top-ranked Australian university in ${college.city_name}, ${stateName}. QS World Ranking #${college.qsRank}. Explore salary data for graduates and in-demand occupations in the region.`

  return pageMetadata({
    title,
    description,
    path: `/map/au/university/${params.slug}`,
  })
}

export default async function UniversityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = await getAUMapData()
  const college = data.auRankedColleges.find((c) => c.slug === params.slug)
  if (!college) notFound()

  const stateName = STATE_NAMES[college.college_state as StateCode] ?? college.college_state

  // Top 5 high-pay occupations in this state (from shortage data — AU has salary per occ+state)
  const stateShortage = data.shortageByState[college.college_state as StateCode] ?? []
  const topOccs = [...stateShortage]
    .filter((o) => o.median_salary_aud != null)
    .sort((a, b) => (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0))
    .slice(0, 5)
    .map((o) => ({ name: o.occupation_en, salary: o.median_salary_aud, currency: "A$" }))

  return (
    <main className="min-h-screen bg-slate-50">
      <UniversityStaticCard
        d={{
          name: college.college_name,
          cityName: college.city_name,
          locationLabel: stateName,
          countryCode: "AU",
          countryLabel: "Australia",
          qsRank: college.qsRank,
          website: college.website,
          tuitionCurrency: "A$",
          earningsCurrency: "A$",
          topOccupations: topOccs,
        }}
      />
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          href={`/maps?country=au&university=${params.slug}`}
          className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Open interactive map
        </Link>
      </section>
    </main>
  )
}
