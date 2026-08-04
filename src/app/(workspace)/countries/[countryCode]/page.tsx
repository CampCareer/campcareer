import { notFound, redirect } from "next/navigation"
import { getLaunchCountry } from "@/data/launch-countries"
import { CountryDashboardShell } from "../country-dashboard-shell"
import { GenericCountryDashboard } from "../generic-country-dashboard"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const country = getLaunchCountry(countryCode)

  if (!country) return {}

  const canonicalPath = `/countries/${country.code.toLowerCase()}`

  return {
    title: country.name,
    description: `${country.name} study, visa, salary, living-cost and city information.`,
    alternates: { canonical: canonicalPath },
    robots: { index: false, follow: false } as const,
  }
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const country = getLaunchCountry(countryCode)

  if (!country) notFound()

  const normalizedCode = country.code.toLowerCase()
  if (countryCode !== normalizedCode) redirect(`/countries/${normalizedCode}`)

  return (
    <CountryDashboardShell countryCode={country.code}>
      <GenericCountryDashboard countryCode={country.code} />
    </CountryDashboardShell>
  )
}
