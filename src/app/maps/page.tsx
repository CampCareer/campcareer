import { pageMetadata } from "@/lib/seo"
import { getInitialMapShellData } from "@/lib/map-data"
import CampCareerMaps from "@/app/map/CampCareerMaps"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "Australia opportunity map | CampCareer",
  description: "Explore Australia by state using source-labelled occupation, employment, and regional signals.",
  path: "/maps",
})

export default async function MapsPage() {
  const data = await getInitialMapShellData()
  return <div className="h-[calc(100dvh-3.5rem)] w-full sm:h-[calc(100dvh-4rem)]"><CampCareerMaps data={data} auOnly routeMode /></div>
}
