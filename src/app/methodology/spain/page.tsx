import { Batch2MethodologyPage } from "../batch-2-methodology-page"
import { BATCH_2_COUNTRY_CONTENT } from "@/data/batch-2-country-content"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Spain Sources & Methodology",
  description: BATCH_2_COUNTRY_CONTENT.ES.methodologyDescription,
  path: "/methodology/spain",
})

export default function SpainMethodologyPage() {
  return <Batch2MethodologyPage profile={BATCH_2_COUNTRY_CONTENT.ES} />
}
