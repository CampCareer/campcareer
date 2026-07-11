import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import SchoolCompareClient from "./SchoolCompareClient"

export async function generateMetadata() {
  const t = await getTranslations()
  return pageMetadata({
    title: t.compare.schools.pageTitle,
    description: t.compare.schools.pageSubtitle,
    path: "/compare/schools",
  })
}

export default function SchoolComparePage() {
  return <SchoolCompareClient />
}
