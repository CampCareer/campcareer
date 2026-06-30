import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import CompareHubClient from "./CompareHubClient"

export async function generateMetadata() {
  const t = getTranslations()
  return pageMetadata({
    title: t.compare.hub.title,
    description: t.compare.hub.subtitle,
    path: "/compare",
  })
}

export default function ComparePage() {
  return <CompareHubClient />
}
