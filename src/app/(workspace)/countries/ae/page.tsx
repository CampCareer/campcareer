import { Batch3CountryDashboard } from "../batch-3-country-dashboard"
import { CountryDashboardShell } from "../country-dashboard-shell"
import { BATCH_3_COUNTRY_CONTENT } from "@/data/batch-3-country-content"
import { getBatch3CountryMetrics } from "@/lib/workspace/batch-3-country-metrics"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Study and Work in the United Arab Emirates",
  description: "UAE salary policy benchmarks, student living costs, tuition, study calendar, strong fields, institutions and cities with official sources.",
  alternates: { canonical: "/countries/ae" },
  robots: { index: true, follow: true } as const,
}

export default async function UnitedArabEmiratesPage() {
  const metrics = await getBatch3CountryMetrics("AE")
  return (
    <CountryDashboardShell countryCode="AE">
      <Batch3CountryDashboard metrics={metrics} profile={BATCH_3_COUNTRY_CONTENT.AE} />
    </CountryDashboardShell>
  )
}
