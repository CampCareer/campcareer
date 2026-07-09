import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import CampCareerMaps from "../map/CampCareerMaps"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "CampCareer Maps — Study, Career & Migration Pathways",
  description:
    "Explore study, career, salary, university, and migration pathway signals across countries in a Google Maps-style CampCareer experience.",
  path: "/maps",
})

export default async function MapsPage() {
  const data = await getMapData()

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <CampCareerMaps data={data} />
    </div>
  )
}
