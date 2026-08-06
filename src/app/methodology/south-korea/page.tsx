import { Batch2MethodologyPage } from "../batch-2-methodology-page"
import { BATCH_2_COUNTRY_CONTENT } from "@/data/batch-2-country-content"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "South Korea Sources & Methodology",
  description: BATCH_2_COUNTRY_CONTENT.KR.methodologyDescription,
  path: "/methodology/south-korea",
})

export default function SouthKoreaMethodologyPage() {
  return <Batch2MethodologyPage profile={BATCH_2_COUNTRY_CONTENT.KR} />
}
