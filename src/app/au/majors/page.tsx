import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import { CountrySearchClient } from "@/components/discovery/discovery-search-clients"
import { AustraliaPathfinder } from "@/components/au-pathfinder/australia-pathfinder"
import { getStudyConcept } from "@/data/study-concepts"
import { profileFromSearchParams } from "@/lib/au-pathfinder"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Australia Career Path Finder — Personalised Salary, Cost & Pathway Signals",
  description: "Rank Australian study and career paths around your income goal, tuition budget, study time and current stage using source-backed salary, shortage, outlook and pathway signals.",
  path: "/au/majors",
})

export default async function AustralianMajorsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const one = (key: string) => typeof query[key] === "string" ? query[key] : undefined
  const selectedConcept = one("major") ? getStudyConcept(one("major")!) : null
  if (selectedConcept) permanentRedirect(`/au/majors/${selectedConcept.slug}`)
  if (one("mode") === "explore" || one("sort")) {
    return <CountrySearchClient basePath="/au/majors" initial={{ country: "AU", category: one("category"), major: one("major"), goal: one("goal"), sort: one("sort") }} />
  }
  return <AustraliaPathfinder initialProfile={profileFromSearchParams({ category: one("category"), goal: one("goal"), pathGoal: one("pathGoal"), budget: one("budget"), timeline: one("timeline"), stage: one("stage"), visa: one("visa") })} />
}
