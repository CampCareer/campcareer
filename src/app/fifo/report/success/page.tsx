import type { Metadata } from "next"
import { FifoReportSuccessPage } from "./fifo-report-success-page"

export const metadata: Metadata = {
  title: "FIFO Guide Purchase Complete",
  description: "Confirmation page for a completed CampCareer FIFO guide checkout.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <FifoReportSuccessPage />
}
