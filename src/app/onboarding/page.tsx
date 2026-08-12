import { Suspense } from "react"
import { CareerPersonalisationOnboarding } from "@/components/onboarding/career-personalisation-onboarding"

export default function OnboardingPage() {
  return <Suspense fallback={<main className="min-h-[70vh] bg-[#fafafa]" />}><CareerPersonalisationOnboarding /></Suspense>
}
