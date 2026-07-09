import Link from "next/link"
import { notFound } from "next/navigation"
import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { UK_REGION_NAMES } from "../../../states"
import UniversityStaticCard from "../../../UniversityStaticCard"

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await getMapData()
  return data.ukColleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.ukColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const regionName = UK_REGION_NAMES[college.region] ?? college.region
  const rankStr = college.qs_rank ? `QS #${college.qs_rank} · ` : ""
  const earningsStr = college.median_earnings != null
    ? `Median earnings £${college.median_earnings.toLocaleString()} · `
    : ""
  const title = `${college.college_name} — ${rankStr}${regionName}, UK`
  const description = college.median_earnings != null
    ? `${college.college_name} in ${college.city_name}, ${regionName}. ${rankStr}${earningsStr}Tuition £${college.tuition?.toLocaleString() ?? "—"}/yr for international students.`
    : `${college.college_name} in ${college.city_name}, ${regionName}. ${rankStr}Tuition, earnings, and in-demand occupations for international students in the UK.`

  return pageMetadata({
    title,
    description,
    path: `/map/uk/university/${params.slug}`,
  })
}

export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.ukColleges.find((c) => c.slug === params.slug)
  if (!college) notFound()

  const regionName = UK_REGION_NAMES[college.region] ?? college.region

  const cityData = data.ukCities.find(
    (c) => c.name.toLowerCase() === college.city_name.toLowerCase(),
  )

  const regionHighPay = data.ukHighPayByRegion[college.region] ?? []
  const topOccs = regionHighPay
    .slice(0, 5)
    .map((o) => ({ name: o.occupation_en, salary: o.median_salary_gbp, currency: "£" }))

  return (
    <main className="min-h-screen bg-slate-50">
      <UniversityStaticCard
        d={{
          name: college.college_name,
          cityName: college.city_name,
          locationLabel: regionName,
          countryCode: "UK",
          countryLabel: "United Kingdom",
          qsRank: college.qs_rank,
          website: college.website,
          tuition: college.tuition,
          tuitionCurrency: "£",
          medianEarnings: college.median_earnings,
          earningsCurrency: "£",
          rentMedian: cityData?.rent_median ?? undefined,
          rentCurrency: "£",
          topOccupations: topOccs,
        }}
      />
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          href={`/maps?country=uk&university=${params.slug}`}
          className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Open interactive map
        </Link>
      </section>
    </main>
  )
}
