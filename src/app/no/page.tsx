import type { Metadata } from "next"
import { CountryHub } from "@/components/country-profiles/country-hub"
import { NO_CITIES, NO_REGIONS, NO_UNIVERSITIES } from "@/data/no-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Norway Study and Career Profile | CampCareer",
    description: "Explore Norwegian regional study locations, institutions and career-comparison methodology.",
    path: "/no",
  }),
  alternates: { canonical: "/no" },
  robots: { index: isCountrySearchIndexable("NO"), follow: true },
}

export default function NorwayHubPage() {
  return (
    <CountryHub
      countryCode="NO"
      countryName="Norway"
      classificationLabel="STYRK-08"
      regions={NO_REGIONS}
      cityCount={NO_CITIES.length}
      institutionCount={NO_UNIVERSITIES.length}
      jobsPath="/no/jobs"
      countryRoiCode="NO"
    />
  )
}
