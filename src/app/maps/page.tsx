import { pageMetadata } from "@/lib/seo"
import { getInitialMapShellData } from "@/lib/map-data"
import CampCareerMaps from "@/app/map/CampCareerMaps"

// The map shell reads live Supabase datasets. Render per request so CI static
// generation does not require production service-role credentials.
export const dynamic = "force-dynamic"

export const metadata = pageMetadata({
  title: "Australia opportunity map | CampCareer",
  description: "Explore Australia by state using source-labelled occupation, employment, and regional signals.",
  path: "/maps",
})

export default async function MapsPage() {
  const data = await getInitialMapShellData()
  return <div className="h-[calc(100dvh-3.5rem)] w-full sm:h-[calc(100dvh-4rem)]"><CampCareerMaps data={data} auOnly routeMode /></div>
}
