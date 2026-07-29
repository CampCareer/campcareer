import { RouteSearchLanding } from "@/components/routes/route-search-landing"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer — Source-backed international career routes",
  description:
    "Find a source-backed route from your citizenship to the work you want abroad: visa conditions, preparation, jobs, training, and map context.",
  path: "/",
})

export default function LandingPage() {
  return <RouteSearchLanding locale="en" />
}
