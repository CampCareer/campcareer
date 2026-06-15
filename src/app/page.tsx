import { HomePageClient } from "@/components/home/home-page-client"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "CampCareer | Will Your Degree Survive the AI Era?",
  description:
    "Score your major on 5 layers — employment, visa pathway (OPT, H-1B, PGWP, Graduate Route, 485), market demand, AI exposure, and ROI — across the US, Canada, UK, Australia, and Ireland. Built on government data. Then see where to study it.",
  path: "/",
})

export default function LandingPage() {
  return <HomePageClient />
}
