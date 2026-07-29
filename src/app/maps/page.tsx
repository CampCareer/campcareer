import { getInitialMapShellData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import CampCareerMaps from "../map/CampCareerMaps"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer Maps — Career route regions and work signals",
  description:
    "Explore the destination regions, occupation signals, and employers behind a CampCareer route search.",
  path: "/maps",
})

export default async function MapsPage() {
  const data = await getInitialMapShellData()

  return (
    <div className="h-[100dvh] w-full">
      <CampCareerMaps data={data} auOnly />
    </div>
  )
}
