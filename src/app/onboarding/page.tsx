import { permanentRedirect } from "next/navigation"
import { localizePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"

// The Australia Pathfinder is the single public planning entry point.
export default async function OnboardingPage() {
  permanentRedirect(localizePath("/", await getLocale()))
}
