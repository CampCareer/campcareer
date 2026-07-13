import type { Metadata } from "next"
import { CountryJobs } from "@/components/country-profiles/country-jobs"
import { NO_OCCUPATIONS, isNOOccupationIndexable } from "@/data/no-map-data"
import { slugifyMapTerm } from "@/lib/map-slugs"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Norway Occupations and Study Pathways | CampCareer",
    description: "Norwegian occupation-code and source-verification methodology for career comparisons.",
    path: "/no/jobs",
  }),
  alternates: { canonical: "/no/jobs" },
  robots: { index: isCountrySearchIndexable("NO"), follow: true },
}

export default function NorwayJobsPage() {
  return (
    <CountryJobs
      countryCode="NO"
      countryName="Norway"
      classificationLabel="STYRK-08"
      hubPath="/no"
      occupations={NO_OCCUPATIONS.filter(isNOOccupationIndexable).map((occupation) => ({
        code: occupation.stykrCode,
        nameEn: occupation.nameEn,
        nameLocal: occupation.nameKo,
        field: occupation.relatedField,
        path: "/maps/no/" + slugifyMapTerm(occupation.nameEn),
      }))}
    />
  )
}
