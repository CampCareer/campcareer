import type { Metadata } from "next"
import { CountryJobs } from "@/components/country-profiles/country-jobs"
import { NZ_OCCUPATIONS, isNZOccupationIndexable } from "@/data/nz-map-data"
import { slugifyMapTerm } from "@/lib/map-slugs"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "New Zealand Occupations and Study Pathways | CampCareer",
    description: "New Zealand occupation-code and source-verification methodology for career comparisons.",
    path: "/nz/jobs",
  }),
  alternates: { canonical: "/nz/jobs" },
  robots: { index: isCountrySearchIndexable("NZ"), follow: true },
}

export default function NewZealandJobsPage() {
  return (
    <CountryJobs
      countryCode="NZ"
      countryName="New Zealand"
      classificationLabel="ANZSCO"
      hubPath="/nz"
      occupations={NZ_OCCUPATIONS.filter(isNZOccupationIndexable).map((occupation) => ({
        code: occupation.anzscoCode,
        nameEn: occupation.nameEn,
        nameLocal: occupation.nameKo,
        field: occupation.relatedField,
        path: "/maps/nz/" + slugifyMapTerm(occupation.nameEn),
      }))}
    />
  )
}
