import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { DE_BUNDESLAND_NAMES } from "../../../states"
import AustraliaMap from "../../../AustraliaMap"

export const revalidate = 86400

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.deColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const regionName = DE_BUNDESLAND_NAMES[college.region] ?? college.region
  const rankStr = college.qs_rank ? `QS #${college.qs_rank} · ` : ""
  const earningsStr = college.median_earnings != null
    ? `Median earnings €${college.median_earnings.toLocaleString()} · `
    : ""
  const title = `${college.college_name} — ${regionName}`
  const description = college.median_earnings != null
    ? `${college.college_name} in ${college.city_name}, ${regionName}. ${rankStr}${earningsStr}Tuition €${college.tuition?.toLocaleString() ?? "free"}`
    : `${college.college_name} in ${college.city_name}, ${regionName}. ${rankStr}Learn about tuition, earnings, and ROI.`

  return pageMetadata({
    title,
    description,
    path: `/map/de/university/${params.slug}`,
  })
}

export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <AustraliaMap data={data} initialUniversity={params.slug} />
    </div>
  )
}
