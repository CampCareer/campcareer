import type { Metadata } from "next"
import { InstitutionsExplorer } from "./institutions-explorer"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Institutions",
  description:
    "Explore verified higher-education institutions and their connected programs, campuses and normalized cities.",
}

export default async function InstitutionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <InstitutionsExplorer countryCode="AU" searchParams={await searchParams} />
}
