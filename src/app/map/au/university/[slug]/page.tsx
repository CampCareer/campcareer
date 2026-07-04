import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import AustraliaMap from "../../../AustraliaMap"

export const revalidate = 86400

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.auRankedColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const title = `${college.college_name} — QS Ranking #${college.qsRank}`
  const description = `${college.college_name} in ${college.city_name}, ${college.college_state}. QS #${college.qsRank}. Top ranked Australian university.`

  return pageMetadata({
    title,
    description,
    path: `/map/au/university/${params.slug}`,
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
