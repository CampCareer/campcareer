import { pageMetadata } from "@/lib/seo"
import { getNOMapV2Bundle } from "@/lib/no-map-v2"
import NorwayMapV2 from "./no-map-client"

export const revalidate = 86400
export const metadata = pageMetadata({
  title: "Norway study location map | CampCareer",
  description: "Explore Norway counties, representative cities and university references with transparent data-verification status.",
  path: "/map/no",
})

export default function NorwayMapPage() {
  return <NorwayMapV2 bundle={getNOMapV2Bundle()} />
}
