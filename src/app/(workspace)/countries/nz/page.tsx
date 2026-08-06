import { Batch2CountryDashboard } from "../batch-2-country-dashboard"
import { CountryDashboardShell } from "../country-dashboard-shell"
import { BATCH_2_COUNTRY_CONTENT } from "@/data/batch-2-country-content"
import { getBatch2CountryMetrics } from "@/lib/workspace/batch-2-country-metrics"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Study and Work in New Zealand",
  description: "New Zealand salary ranges, student living costs, tuition, study calendar, strong fields, institutions and cities with official sources.",
  alternates: { canonical: "/countries/nz" },
  robots: { index: true, follow: true } as const,
}

export default async function NewZealandPage() {
  const metrics = await getBatch2CountryMetrics("NZ")
  return <CountryDashboardShell countryCode="NZ"><Batch2CountryDashboard metrics={metrics} profile={BATCH_2_COUNTRY_CONTENT.NZ} /></CountryDashboardShell>
}
