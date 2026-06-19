import { HomeSearch } from "@/components/home/home-search"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "CampCareer — Will Your Degree Get You a Visa & PR Abroad?",
  description:
    "Find out if your major leads to a post-study work visa and PR — scored across 5 study-abroad countries (US, Canada, UK, Australia, Ireland) on visa pathway (OPT, H-1B, PGWP, Graduate Route, 485), PR routes, employment, AI exposure, and ROI. Built on government data, updated as visa rules change. Then see where to study it.",
  path: "/",
})

export default function LandingPage() {
  return <HomeSearch />
}
