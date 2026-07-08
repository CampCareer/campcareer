import { notFound } from "next/navigation"
import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { NL_PROVINCE_NAMES } from "../../../states"
import CampCareerMaps from "../../../CampCareerMaps"
import UniversityStaticCard from "../../../UniversityStaticCard"

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await getMapData()
  return data.nlColleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.nlColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const provinceName = NL_PROVINCE_NAMES[college.province] ?? college.province
  const rankStr = college.qs_rank ? `QS #${college.qs_rank} · ` : ""
  const tuitionStr = college.tuition != null
    ? `Tuition €${college.tuition.toLocaleString()}/yr (non-EU). `
    : ""
  const title = `${college.college_name} — ${rankStr}${provinceName}, Netherlands`
  const description = `${college.college_name} in ${college.city_name}, ${provinceName}. ${rankStr}${tuitionStr}Top Dutch research university — study in the Netherlands as an international student.`

  return pageMetadata({
    title,
    description,
    path: `/map/nl/university/${params.slug}`,
  })
}

export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.nlColleges.find((c) => c.slug === params.slug)
  if (!college) notFound()

  const provinceName = NL_PROVINCE_NAMES[college.province] ?? college.province

  const cityData = data.nlCities.find(
    (c) => c.name.toLowerCase() === college.city_name.toLowerCase(),
  )

  const provinceHighPay = data.nlHighPayByRegion[college.province] ?? []
  const topOccs = provinceHighPay
    .slice(0, 5)
    .map((o) => ({ name: o.occupation_en, salary: o.median_salary_eur, currency: "€" }))

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <UniversityStaticCard
        d={{
          name: college.college_name,
          cityName: college.city_name,
          locationLabel: provinceName,
          countryCode: "NL",
          countryLabel: "Netherlands",
          qsRank: college.qs_rank,
          website: college.website,
          tuition: college.tuition,
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
