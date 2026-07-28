import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Australia Pathfinder — CampCareer",
  description: "Find an Australia study and career pathway with source-backed data.",
  path: "/onboarding",
})

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
