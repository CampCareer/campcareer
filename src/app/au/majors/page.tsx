import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getStudyConcept } from "@/data/study-concepts"
import { localizePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
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
  const locale = await getLocale()
  const query = await searchParams
  const one = (key: string) => (typeof query[key] === "string" ? query[key] : undefined)

  const selectedMajor = one("major")
  if (selectedMajor) {
    const concept = getStudyConcept(selectedMajor)
    if (concept) redirect(localizePath(`/au/majors/${concept.slug}`, locale))
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") params.set(key, value)
  }
  const qs = params.toString()
  redirect(`${localizePath('/', locale)}${qs ? `?${qs}` : ''}`)
}
