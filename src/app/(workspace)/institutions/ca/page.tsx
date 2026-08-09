import type { Metadata } from "next"
import { CaInstitutionsExplorer } from "./ca-institutions-explorer"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Canada Institutions",
  description: "Explore verified Canadian institutions with DLI and location data plus CampCareer programs published against the 80 target careers.",
  alternates: { canonical: "/institutions/ca" },
  robots: { index: true, follow: true },
}

export default async function CanadaInstitutionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <CaInstitutionsExplorer searchParams={await searchParams} />
}
