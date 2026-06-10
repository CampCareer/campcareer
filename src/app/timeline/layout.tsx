import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Application Timeline — Plan Your Study Abroad Schedule",
  description: "Month-by-month timeline planner for study abroad applications: admissions, visa, housing, and departure milestones across 5 countries.",
  path: "/timeline",
})

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
