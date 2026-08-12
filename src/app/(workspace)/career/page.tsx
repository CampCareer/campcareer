import type { Metadata } from "next"
import { Suspense } from "react"
import { CareerResultPage } from "./career-result-page"

export const metadata: Metadata = {
  title: "Career results | CampCareer",
  description: "Review local hiring demand, visa and qualification conditions, and realistic entry routes for your selected career and country.",
  robots: { index: false, follow: false },
}

export default function CareerPage() {
  return <Suspense fallback={<main className="min-h-[calc(100vh-3.5rem)] bg-white" />}><CareerResultPage /></Suspense>
}
