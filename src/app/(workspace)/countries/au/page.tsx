import { AustraliaCountryPage } from "../australia-country-page"
import { getAustraliaCountryMetrics } from "@/lib/workspace/australia-country-metrics"

export const metadata = {
  title: "Australia",
  description: "Australia study, living, salary, visa and city information.",
  robots: { index: false, follow: false } as const,
}

export default async function AustraliaPage() {
  const metrics = await getAustraliaCountryMetrics()
  return <AustraliaCountryPage metrics={metrics} />
}
