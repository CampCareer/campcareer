import { HomeFinder } from "@/components/home/home-finder"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "CampCareer — Jobs, Salary & PR Pathways for Australia, Canada & USA",
  description:
    "Pick a country and state — see in-demand jobs, median salaries, and permanent residency pathways. Built on government data: ANZSCO, ABS, BLS, Statistics Canada.",
  path: "/",
})

export default function LandingPage() {
  return <HomeFinder />
}
