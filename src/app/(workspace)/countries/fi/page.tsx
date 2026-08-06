import { Batch3CountryDashboard } from "../batch-3-country-dashboard"
import { CountryDashboardShell } from "../country-dashboard-shell"
import { BATCH_3_COUNTRY_CONTENT } from "@/data/batch-3-country-content"
import { getBatch3CountryMetrics } from "@/lib/workspace/batch-3-country-metrics"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Study and Work in Finland",
  description: "Finland salary ranges, student living costs, tuition, study calendar, strong fields, institutions and cities with official sources.",
  alternates: { canonical: "/countries/fi" },
  robots: { index: true, follow: true } as const,
}

export default async function FinlandPage() {
  const metrics = await getBatch3CountryMetrics("FI")
  return (
    <CountryDashboardShell countryCode="FI">
      <Batch3CountryDashboard metrics={metrics} profile={BATCH_3_COUNTRY_CONTENT.FI} />
    </CountryDashboardShell>
  )
}
