import { permanentRedirect } from "next/navigation"
import { AustraliaPathfinder } from "@/components/au-pathfinder/australia-pathfinder"
import { profileFromSearchParams } from "@/lib/au-pathfinder"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer — Australia Study & Career Pathways",
  description:
    "Find your best Australia study path. Compare visa options, salary, shortage signals and PR pathways across 10 fields with source-backed data.",
  path: "/",
})

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const one = (key: string) => (typeof query[key] === "string" ? query[key] : undefined)

  const selectedMajor = one("major")
  if (selectedMajor) permanentRedirect(`/au/majors/${selectedMajor}`)

  return (
    <AustraliaPathfinder
      initialProfile={profileFromSearchParams({
        category: one("category"),
        goal: one("goal"),
        pathGoal: one("pathGoal"),
        budget: one("budget"),
        timeline: one("timeline"),
        stage: one("stage"),
        visa: one("visa"),
      })}
    />
  )
}
