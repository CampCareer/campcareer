import type { Metadata } from "next"
import { CountryJobs } from "@/components/country-profiles/country-jobs"
import { FI_OCCUPATIONS, isFIOccupationIndexable } from "@/data/fi-map-data"
import { slugifyMapTerm } from "@/lib/map-slugs"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Finland Occupations and Study Pathways | CampCareer",
    description: "Finnish occupation-code and source-verification methodology for career comparisons.",
    path: "/fi/jobs",
  }),
  alternates: { canonical: "/fi/jobs" },
  robots: { index: isCountrySearchIndexable("FI"), follow: true },
}

export default function FinlandJobsPage() {
  return (
    <CountryJobs
      countryCode="FI"
      countryName="Finland"
      classificationLabel="Classification of Occupations 2010"
      hubPath="/fi"
      occupations={FI_OCCUPATIONS.filter(isFIOccupationIndexable).map((occupation) => ({
        code: occupation.iscoCode,
        nameEn: occupation.nameEn,
        nameLocal: occupation.nameKo,
        field: occupation.relatedField,
        path: "/maps/fi/" + slugifyMapTerm(occupation.nameEn),
      }))}
    />
  )
}
