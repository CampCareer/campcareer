import type { Metadata } from "next"
import { CountryHub } from "@/components/country-profiles/country-hub"
import { FI_CITIES, FI_REGIONS, FI_UNIVERSITIES } from "@/data/fi-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Finland Study and Career Profile | CampCareer",
    description: "Explore Finnish regional study locations, institutions and career-comparison methodology.",
    path: "/fi",
  }),
  alternates: { canonical: "/fi" },
  robots: { index: isCountrySearchIndexable("FI"), follow: true },
}

export default function FinlandHubPage() {
  return (
    <CountryHub
      countryCode="FI"
      countryName="Finland"
      classificationLabel="Classification of Occupations 2010"
      regions={FI_REGIONS}
      cityCount={FI_CITIES.length}
      institutionCount={FI_UNIVERSITIES.length}
      jobsPath="/fi/jobs"
    />
  )
}
