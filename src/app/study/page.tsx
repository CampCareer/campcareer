import { UniversitiesHub } from "@/components/discovery/discovery-hub"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Find Study Options by Budget",
  description: "Explore study options by destination, career, budget, requirements, and reviewed ROI evidence.",
  path: "/study",
})

export default function StudyPage() {
  return <UniversitiesHub />
}
