import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Career Path Simulator — From Degree to PR",
  description: "Simulate your career path from study abroad to permanent residency: visa stages, salary growth, and immigration milestones by country and field.",
  path: "/career-path",
})

export default function CareerPathLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
