import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"

export const metadata: Metadata = { title: "University Matches", robots: { index: false, follow: true } }
export default async function UniversitySearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const one = (key: string) => typeof query[key] === "string" ? query[key] : undefined
  if (one("country")?.toUpperCase() === "AU") {
    const target = new URLSearchParams()
    for (const key of ["category", "field", "city", "career", "budget"]) {
      const value = one(key)
      if (value) target.set(key, value)
    }
    permanentRedirect(`/au/study${target.size ? `?${target.toString()}` : ""}`)
  }
  const target = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") target.set(key, value)
    else if (Array.isArray(value)) value.forEach((item) => target.append(key, item))
  }
  permanentRedirect(`/study/search${target.size ? `?${target.toString()}` : ""}`)
}
