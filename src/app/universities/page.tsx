import { UniversitiesHub } from "@/components/discovery/discovery-hub"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({ title: "Find Universities by Budget", description: "Explore university options by destination, career, budget, requirements, and reviewed ROI evidence.", path: "/universities" })
export default function UniversitiesPage() { return <UniversitiesHub /> }
