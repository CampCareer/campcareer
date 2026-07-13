import type { Metadata } from "next"
import { CountryHub } from "@/components/country-profiles/country-hub"
import { DK_CITIES, DK_REGIONS, DK_UNIVERSITIES } from "@/data/dk-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Denmark Study and Career Profile | CampCareer",
    description: "Explore Danish regional study locations, institutions and career-comparison methodology.",
    path: "/dk",
  }),
  alternates: { canonical: "/dk" },
  robots: { index: isCountrySearchIndexable("DK"), follow: true },
}

export default function DenmarkHubPage() {
  return (
    <CountryHub
      countryCode="DK"
      countryName="Denmark"
      classificationLabel="DISCO-08"
      regions={DK_REGIONS}
      cityCount={DK_CITIES.length}
      institutionCount={DK_UNIVERSITIES.length}
      jobsPath="/dk/jobs"
    />
  )
}
