import type { Metadata } from "next"
import { CountryHub } from "@/components/country-profiles/country-hub"
import { CH_CITIES, CH_REGIONS, CH_UNIVERSITIES } from "@/data/ch-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Switzerland Study and Career Profile | CampCareer",
    description: "Explore Switzerland's cantons, accredited higher-education institutions and official labour-data coverage.",
    path: "/ch",
  }),
  alternates: { canonical: "/ch" },
  robots: { index: isCountrySearchIndexable("CH"), follow: true },
}

export default function SwitzerlandHubPage() {
  return <CountryHub countryCode="CH" countryName="Switzerland" classificationLabel="CH-ISCO-19" regions={CH_REGIONS} cityCount={CH_CITIES.length} institutionCount={CH_UNIVERSITIES.length} jobsPath="/map?country=ch" showDataNotice={false} />
}
