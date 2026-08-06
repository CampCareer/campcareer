import { permanentRedirect } from "next/navigation"

export default async function CoursesRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") {
      params.set(key, value)
      continue
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
    }
  }

  const query = params.toString()
  permanentRedirect(query ? `/programs?${query}` : "/programs")
}
