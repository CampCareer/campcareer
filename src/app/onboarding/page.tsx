import { permanentRedirect } from "next/navigation"

// The Australia Pathfinder is the single public planning entry point.
export default async function OnboardingPage() {
  permanentRedirect("/home")
}
