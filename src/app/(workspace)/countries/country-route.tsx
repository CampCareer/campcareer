import type { Metadata } from "next"
import { getLaunchCountry, type LaunchCountryCode } from "@/data/launch-countries"
import { CountryDashboardShell } from "./country-dashboard-shell"
import { GenericCountryDashboard } from "./generic-country-dashboard"

export function buildCountryMetadata(code: LaunchCountryCode): Metadata {
  const country = getLaunchCountry(code)

  if (!country) return {}

  return {
    title: country.name,
    description: `${country.name} study, visa, salary, living-cost and city information.`,
    alternates: { canonical: `/countries/${country.code.toLowerCase()}` },
    robots: { index: false, follow: false },
  }
}

export function CountryRoute({ code }: { code: LaunchCountryCode }) {
  return (
    <CountryDashboardShell countryCode={code}>
      <GenericCountryDashboard countryCode={code} />
    </CountryDashboardShell>
  )
}
