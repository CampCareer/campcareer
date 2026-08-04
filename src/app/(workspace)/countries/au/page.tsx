import { AustraliaCountryDashboard } from "../australia-country-dashboard"
import { CountryDashboardShell } from "../country-dashboard-shell"
import { getAustraliaCountryMetrics } from "@/lib/workspace/australia-country-metrics"

export const metadata = {
  title: "Australia",
  description: "Australia study, living, salary, visa and city information.",
  alternates: { canonical: "/countries/au" },
  robots: { index: false, follow: false } as const,
}

export default async function AustraliaPage() {
  const metrics = await getAustraliaCountryMetrics()

  return (
    <CountryDashboardShell countryCode="AU">
      <AustraliaCountryDashboard metrics={metrics} />
    </CountryDashboardShell>
  )
}
