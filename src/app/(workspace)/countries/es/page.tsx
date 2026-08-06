import { Batch2CountryDashboard } from "../batch-2-country-dashboard"
import { CountryDashboardShell } from "../country-dashboard-shell"
import { BATCH_2_COUNTRY_CONTENT } from "@/data/batch-2-country-content"
import { getBatch2CountryMetrics } from "@/lib/workspace/batch-2-country-metrics"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Study and Work in Spain",
  description: "Spain salary ranges, student living costs, tuition, study calendar, strong fields, institutions and cities with official sources.",
  alternates: { canonical: "/countries/es" },
  robots: { index: true, follow: true } as const,
}

export default async function SpainPage() {
  const metrics = await getBatch2CountryMetrics("ES")
  return <CountryDashboardShell countryCode="ES"><Batch2CountryDashboard metrics={metrics} profile={BATCH_2_COUNTRY_CONTENT.ES} /></CountryDashboardShell>
}
