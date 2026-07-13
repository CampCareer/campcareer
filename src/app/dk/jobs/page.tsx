import type { Metadata } from "next"
import { CountryJobs } from "@/components/country-profiles/country-jobs"
import { DK_OCCUPATIONS, isDKOccupationIndexable } from "@/data/dk-map-data"
import { slugifyMapTerm } from "@/lib/map-slugs"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Denmark Occupations and Study Pathways | CampCareer",
    description: "Danish occupation-code and source-verification methodology for career comparisons.",
    path: "/dk/jobs",
  }),
  alternates: { canonical: "/dk/jobs" },
  robots: { index: isCountrySearchIndexable("DK"), follow: true },
}

export default function DenmarkJobsPage() {
  return (
    <CountryJobs
      countryCode="DK"
      countryName="Denmark"
      classificationLabel="DISCO-08"
      hubPath="/dk"
      occupations={DK_OCCUPATIONS.filter(isDKOccupationIndexable).map((occupation) => ({
        code: occupation.dosCode,
        nameEn: occupation.nameEn,
        nameLocal: occupation.nameKo,
        field: occupation.relatedField,
        path: "/maps/dk/" + slugifyMapTerm(occupation.nameEn),
      }))}
    />
  )
}
