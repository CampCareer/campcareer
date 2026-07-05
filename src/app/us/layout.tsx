import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Work & Study in the USA | CampCareer",
  description:
    "Explore job salaries, visa pathways, and university options for working in the United States. Real salary data from Bureau of Labor Statistics.",
}

export default function UsLayout({ children }: { children: React.ReactNode }) {
  return children
}
