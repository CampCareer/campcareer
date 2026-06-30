import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import CareerCompareClient from "./CareerCompareClient"

export async function generateMetadata() {
  const t = getTranslations()
  return pageMetadata({
    title: t.compare.careers.pageTitle,
    description: t.compare.careers.pageSubtitle,
    path: "/compare/careers",
  })
}

export default function CareerComparePage() {
  return <CareerCompareClient />
}
