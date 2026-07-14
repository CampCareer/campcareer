import { CountriesHub } from "@/components/discovery/discovery-hub"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({ title: "Explore Study Destinations", description: "Explore 20 study destinations and rank verified career pathways by budget and priority.", path: "/countries" })
export default function CountriesPage() { return <CountriesHub /> }
