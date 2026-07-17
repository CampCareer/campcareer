import type { Metadata } from "next"
import { CountryHub } from "@/components/country-profiles/country-hub"
import { SE_CITIES, SE_REGIONS, SE_UNIVERSITIES } from "@/data/se-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sweden Study and Career Profile | CampCareer",
    description: "Explore Swedish regional study locations, institutions and career-comparison methodology.",
    path: "/se",
  }),
  alternates: { canonical: "/se" },
  robots: { index: isCountrySearchIndexable("SE"), follow: true },
}

export default function SwedenHubPage() {
  return (
    <CountryHub
      countryCode="SE"
      countryName="Sweden"
      classificationLabel="SSYK 2012"
      regions={SE_REGIONS}
      cityCount={SE_CITIES.length}
      institutionCount={SE_UNIVERSITIES.length}
      jobsPath="/se/jobs"
      countryRoiCode="SE"
    />
  )
}
