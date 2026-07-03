import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import AustraliaMap from "../../../AustraliaMap"

export const revalidate = 86400
export const dynamic = "force-static"

export async function generateStaticParams() {
  const data = await getMapData()
  return data.caColleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getMapData()
  const college = data.caColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const title = `${college.college_name} — ${college.province}`
  const description = college.median_earnings != null
    ? `${college.college_name} in ${college.city_name}, ${college.province}. Median earnings $${college.median_earnings.toLocaleString()} · Graduation rate ${Math.round(college.graduation_rate! * 100)}%`
    : `${college.college_name} in ${college.city_name}, ${college.province}. Learn about tuition, earnings, and more.`

  return pageMetadata({
    title,
    description,
    path: `/map/ca/university/${params.slug}`,
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
