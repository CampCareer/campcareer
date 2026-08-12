import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Personalise your career path — CampCareer",
  description: "Add your background to focus an overseas career path on the real eligibility checks.",
  path: "/onboarding",
})

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
