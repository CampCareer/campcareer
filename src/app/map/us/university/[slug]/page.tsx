import Link from "next/link"
import { notFound } from "next/navigation"
import { getUSMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { US_STATE_NAMES } from "../../../states"
import UniversityStaticCard from "../../../UniversityStaticCard"

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await getUSMapData()
  return data.usRankedColleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = await getUSMapData()
  const college = data.usRankedColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const stateName = US_STATE_NAMES[college.college_state] ?? college.college_state
  const earningsStr = college.median_earnings != null
    ? ` Median graduate earnings $${college.median_earnings.toLocaleString()}.`
    : ""
  const gradStr = college.graduation_rate != null
    ? ` Graduation rate ${Math.round(college.graduation_rate * 100)}%.`
    : ""
  const title = `${college.college_name} — QS #${college.qsRank} · ${stateName}`
  const description = `${college.college_name} in ${college.city_name}, ${stateName}. QS #${college.qsRank} · ROI score ${college.roi_score ?? "—"}.${earningsStr}${gradStr} Tuition $${college.tuition?.toLocaleString() ?? "—"}/yr.`

  return pageMetadata({
    title,
    description,
    path: `/map/us/university/${params.slug}`,
  })
}

export default async function UniversityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = await getUSMapData()
  const college = data.usRankedColleges.find((c) => c.slug === params.slug)
  if (!college) notFound()

  const stateName = US_STATE_NAMES[college.college_state] ?? college.college_state

  const stateShortage = data.usShortageByState[college.college_state] ?? []
  const topOccs = [...stateShortage]
    .filter((o) => o.median_wage != null)
    .sort((a, b) => (b.median_wage ?? 0) - (a.median_wage ?? 0))
    .slice(0, 5)
    .map((o) => ({ name: o.occ_title, salary: o.median_wage, currency: "$" }))

  return (
    <main className="min-h-screen bg-slate-50">
      <UniversityStaticCard
        d={{
          name: college.college_name,
          cityName: college.city_name,
          locationLabel: stateName,
          countryCode: "US",
          countryLabel: "United States",
          qsRank: college.qsRank,
          website: college.website,
          tuition: college.tuition,
          tuitionCurrency: "$",
          medianEarnings: college.median_earnings,
          earningsCurrency: "$",
          graduationRate: college.graduation_rate ?? undefined,
          roiScore: college.roi_score ?? undefined,
          topOccupations: topOccs,
        }}
      />
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          href={`/maps?country=us&university=${params.slug}`}
          className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Open interactive map
        </Link>
      </section>
    </main>
  )
}
