import type { Metadata } from "next"
import { FifoReportEmailCapture } from "./fifo-report-email-capture"
import { FifoReportSalesPage } from "./fifo-report-sales-page"

export const metadata: Metadata = {
  title: "FIFO Construction Fast Entry Guide 2026",
  description:
    "See what is inside CampCareer's Western Australia FIFO Construction Fast Entry Guide 2026: role fit, ticket costs, fastest entry pathways, roster reality, employer requirements, training and first-job strategy.",
  alternates: { canonical: "/fifo/report" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FIFO Construction Fast Entry Guide 2026 | CampCareer",
    description:
      "A practical Western Australia FIFO guide built around role choice, ticket strategy and the first-job application sequence.",
  },
}

export default function FifoReportPage() {
  return (
    <>
      <FifoReportSalesPage />
      <FifoReportEmailCapture />
    </>
  )
}
