import { CoursesExplorer } from "../courses/courses-explorer"

export const metadata = {
  title: "Programs",
  description: "Discover degrees, qualifications and trade pathways that lead to work.",
  robots: { index: false, follow: false } as const,
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q : ""
  return <CoursesExplorer initialQuery={q} />
}
