import type { Metadata } from "next"
import { CountryHub } from "@/components/country-profiles/country-hub"
import { NZ_CITIES, NZ_REGIONS, NZ_UNIVERSITIES } from "@/data/nz-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "New Zealand Study and Career Profile | CampCareer",
    description: "Explore New Zealand regional study locations, institutions and career-comparison methodology.",
    path: "/nz",
  }),
  alternates: { canonical: "/nz" },
  robots: { index: isCountrySearchIndexable("NZ"), follow: true },
}

export default function NewZealandHubPage() {
  return (
    <CountryHub
      countryCode="NZ"
      countryName="New Zealand"
      classificationLabel="ANZSCO"
      regions={NZ_REGIONS}
      cityCount={NZ_CITIES.length}
      institutionCount={NZ_UNIVERSITIES.length}
      jobsPath="/nz/jobs"
    />
  )
}
