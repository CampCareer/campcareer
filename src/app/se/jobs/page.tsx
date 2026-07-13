import type { Metadata } from "next"
import { CountryJobs } from "@/components/country-profiles/country-jobs"
import { SE_OCCUPATIONS, isSEOccupationIndexable } from "@/data/se-map-data"
import { slugifyMapTerm } from "@/lib/map-slugs"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sweden Occupations and Study Pathways | CampCareer",
    description: "Swedish occupation-code and source-verification methodology for career comparisons.",
    path: "/se/jobs",
  }),
  alternates: { canonical: "/se/jobs" },
  robots: { index: isCountrySearchIndexable("SE"), follow: true },
}

export default function SwedenJobsPage() {
  return (
    <CountryJobs
      countryCode="SE"
      countryName="Sweden"
      classificationLabel="SSYK 2012"
      hubPath="/se"
      occupations={SE_OCCUPATIONS.filter(isSEOccupationIndexable).map((occupation) => ({
        code: occupation.ssykCode,
        nameEn: occupation.nameEn,
        nameLocal: occupation.nameKo,
        field: occupation.relatedField,
        path: "/maps/se/" + slugifyMapTerm(occupation.nameEn),
      }))}
    />
  )
}
