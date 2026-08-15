import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"

export const metadata: Metadata = {
  title: "CampCareer",
  description: "Start with a career, see the CampCareer Score, then follow the path to study and jobs.",
  robots: { index: false, follow: false },
}

export default function LegacyMemberHomePage() {
  // The authenticated dashboard is intentionally dormant in Wave 1.
  // Preserve its components and data model, but do not make /home a product destination.
  permanentRedirect("/")
}
