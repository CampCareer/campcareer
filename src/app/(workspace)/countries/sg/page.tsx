import { Batch2CountryDashboard } from "../batch-2-country-dashboard"
import { CountryDashboardShell } from "../country-dashboard-shell"
import { BATCH_2_COUNTRY_CONTENT } from "@/data/batch-2-country-content"
import { getBatch2CountryMetrics } from "@/lib/workspace/batch-2-country-metrics"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Study and Work in Singapore",
  description: "Singapore salary ranges, student living costs, tuition, study calendar, strong fields, institutions and districts with official sources.",
  alternates: { canonical: "/countries/sg" },
  robots: { index: true, follow: true } as const,
}

export default async function SingaporePage() {
  const metrics = await getBatch2CountryMetrics("SG")
  return <CountryDashboardShell countryCode="SG"><Batch2CountryDashboard metrics={metrics} profile={BATCH_2_COUNTRY_CONTENT.SG} /></CountryDashboardShell>
}
