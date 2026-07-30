import { RouteSearchLanding } from "@/components/routes/route-search-landing"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer — Verified work and study routes",
  description:
    "Search source-backed study and work information by destination, career, and goal. Get course, job, and regional links in one place.",
  path: "/",
})

export default function LandingPage() {
  return <RouteSearchLanding locale="en" />
}
