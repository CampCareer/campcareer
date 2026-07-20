import { HomeFinder } from "@/components/home/home-finder"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "Find Your Australia Study & Career Path",
  description:
    "Explore Australian study paths and career options with source-backed tuition, outcomes, and post-study pathway evidence.",
  path: "/",
})

export default function LandingPage() {
  return <HomeFinder locale="en" />
}
