import { permanentRedirect } from "next/navigation"

export default function LegacySydneyMelbourneComparePage() {
  permanentRedirect("/compare?type=city&country=AU")
}
