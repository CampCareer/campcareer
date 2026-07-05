import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Canada | Study & Work | CampCareer",
  description: "Explore job salaries, visa pathways, and university options for working in Canada. Find your ideal occupation with real NOC salary data.",
}

export default function CaLayout({ children }: { children: React.ReactNode }) {
  return children
}
