import type { Metadata } from "next"
import { AustraliaReportLaunch } from "@/components/reports/australia-report-launch"

export const metadata: Metadata = {
  title: "Australia ROI Reports — Launch Updates",
  description: "Prepare for CampCareer Australia ROI reports. Compare fields, cities, universities, and your own shortlist before report sales open.",
  robots: { index: false, follow: true },
}

export default function AustraliaReportLaunchPage() {
  return <AustraliaReportLaunch />
}
