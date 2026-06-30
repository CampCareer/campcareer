import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import MajorCompareClient from "./MajorCompareClient"

export async function generateMetadata() {
  const t = getTranslations()
  return pageMetadata({
    title: t.compare.majors.pageTitle,
    description: t.compare.majors.pageSubtitle,
    path: "/compare/majors",
  })
}

export default function MajorComparePage() {
  return <MajorCompareClient />
}
