import { notFound } from "next/navigation"
import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { DE_BUNDESLAND_NAMES } from "../../../states"
import CampCareerMaps from "../../../CampCareerMaps"
import UniversityStaticCard from "../../../UniversityStaticCard"

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await getMapData()
  return data.deColleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.deColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const regionName = DE_BUNDESLAND_NAMES[college.region] ?? college.region
  const rankStr = college.qs_rank ? `QS #${college.qs_rank} · ` : ""
  const tuitionStr = college.tuition != null
    ? `Tuition €${college.tuition.toLocaleString()}/yr (non-EU). `
    : "Tuition-free for international students. "
  const earningsStr = college.median_earnings != null
    ? `Median earnings €${college.median_earnings.toLocaleString()}. `
    : ""
  const title = `${college.college_name} — ${rankStr}${regionName}, Germany`
  const description = `${college.college_name} in ${college.city_name}, ${regionName}. ${rankStr}${tuitionStr}${earningsStr}In-demand occupations and salary data for graduates.`

  return pageMetadata({
    title,
    description,
    path: `/map/de/university/${params.slug}`,
  })
}

export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.deColleges.find((c) => c.slug === params.slug)
  if (!college) notFound()

  const regionName = DE_BUNDESLAND_NAMES[college.region] ?? college.region

  const cityData = data.deCities.find(
    (c) => c.name.toLowerCase() === college.city_name.toLowerCase(),
  )

  const regionHighPay = data.deHighPayByRegion[college.region] ?? []
  const topOccs = regionHighPay
    .slice(0, 5)
    .map((o) => ({ name: o.occupation_en, salary: o.median_salary_eur, currency: "€" }))

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <UniversityStaticCard
        d={{
          name: college.college_name,
          cityName: college.city_name,
          locationLabel: regionName,
          countryCode: "DE",
          countryLabel: "Germany",
          qsRank: college.qs_rank,
          website: college.website,
          tuition: college.tuition,
          tuitionFree: college.tuition == null,
          tuitionCurrency: "€",
          medianEarnings: college.median_earnings,
          earningsCurrency: "€",
          rentMedian: cityData?.rent_median ?? undefined,
          rentCurrency: "€",
          topOccupations: topOccs,
        }}
      />
      <div className="min-h-0 flex-1">
        <CampCareerMaps data={data} initialUniversity={params.slug} />
      </div>
    </div>
  )
}
