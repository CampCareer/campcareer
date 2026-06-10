import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Get Started — Personalise Your Plan",
  description: "Tell us your target country and field of study to personalise your CampCareer experience.",
  path: "/onboarding",
})

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
