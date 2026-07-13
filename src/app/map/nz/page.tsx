import { pageMetadata } from "@/lib/seo"
import { getNZMapV2Bundle } from "@/lib/nz-map-v2"
import NZMapV2 from "./nz-map-client"

export const revalidate = 86400
export const metadata = pageMetadata({
  title: "New Zealand study location map | CampCareer",
  description: "Explore New Zealand regions, representative cities and tertiary institutions with transparent data-verification status.",
  path: "/map/nz",
})

export default function NewZealandMapPage() {
  return <NZMapV2 bundle={getNZMapV2Bundle()} />
}
