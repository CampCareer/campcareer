import { permanentRedirect } from "next/navigation"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export default function LegacySydneyMelbourneComparePage() {
  permanentRedirect(buildCityCompareCanonicalHref({ left: "sydney", right: "melbourne" }))
}
