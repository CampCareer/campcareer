import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in Germany — Salary, Visa & Career Guide | CampCareer",
  description: "Browse KldB-classified occupations in Germany with real salary data, shortage ratings, and career pathways. Data from Bundesagentur für Arbeit.",
  path: "/de",
})

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return children
}
