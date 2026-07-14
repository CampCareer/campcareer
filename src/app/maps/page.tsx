import { getInitialMapShellData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import CampCareerMaps from "../map/CampCareerMaps"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer Maps — Study, Career & Migration Pathways",
  description:
    "Explore study, career, salary, university, and migration pathway signals across countries in a Google Maps-style CampCareer experience.",
  path: "/maps",
})

export default async function MapsPage() {
  // Serialize only the initial Australia shell. Every other country bundle is
  // fetched by CampCareerMaps after selection instead of entering the RSC
  // payload for every visitor.
  const data = await getInitialMapShellData()

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <CampCareerMaps data={data} />
    </div>
  )
}
