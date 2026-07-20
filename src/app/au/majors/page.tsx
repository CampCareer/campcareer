import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getStudyConcept } from "@/data/study-concepts"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Australia Career Path Finder — CampCareer",
  description: "Find your best Australia study path with personalised salary, cost and pathway signals.",
  path: "/au/majors",
})

export default async function AustralianMajorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const one = (key: string) => (typeof query[key] === "string" ? query[key] : undefined)

  const selectedMajor = one("major")
  if (selectedMajor) {
    const concept = getStudyConcept(selectedMajor)
    if (concept) redirect(`/au/majors/${concept.slug}`)
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") params.set(key, value)
  }
  const qs = params.toString()
  redirect(qs ? `/?${qs}` : "/")
}
