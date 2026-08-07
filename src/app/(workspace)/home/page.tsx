import { permanentRedirect } from "next/navigation"
import { HOME_CANONICAL_PATH } from "@/lib/seo-routes.mjs"

export default function LegacyHomePage() {
  permanentRedirect(HOME_CANONICAL_PATH)
}
