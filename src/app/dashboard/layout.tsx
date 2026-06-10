import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Dashboard — Your Study Abroad Plan",
  description: "Your personalised study abroad dashboard: saved courses, checklist progress, timeline, and ROI insights.",
  path: "/dashboard",
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
