import type { Metadata } from "next"
import { MyAustraliaReportWorkspace } from "@/components/reports/my-australia-report-workspace"

export const metadata: Metadata = {
  title: "My Australia ROI Decision Report",
  description: "Save the conditions and Australia study options for your personalised ROI decision report.",
  robots: { index: false, follow: false },
}

export default function MyAustraliaReportPage() {
  return <MyAustraliaReportWorkspace />
}
