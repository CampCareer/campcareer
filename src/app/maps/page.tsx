import { getInitialMapShellData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import CampCareerMaps from "../map/CampCareerMaps"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer Maps — Australia Study & Career Pathways",
  description:
    "Explore study, career, salary, university, and migration pathway signals across Australian states and regions.",
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
