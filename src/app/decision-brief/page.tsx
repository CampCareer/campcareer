import { pageMetadata } from "@/lib/seo"
import { DecisionBriefClient } from "./decision-brief-client"

export const metadata = {
  ...pageMetadata({
    title: "Your Study Abroad Decision Brief",
    description: "Compare your strongest study-abroad and immigration options by salary, budget, risk, and policy sources.",
    path: "/decision-brief",
  }),
  robots: { index: false, follow: true },
}

export default function DecisionBriefPage() {
  return <DecisionBriefClient />
}
