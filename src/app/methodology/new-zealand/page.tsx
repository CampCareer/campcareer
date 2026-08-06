import { Batch2MethodologyPage } from "../batch-2-methodology-page"
import { BATCH_2_COUNTRY_CONTENT } from "@/data/batch-2-country-content"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "New Zealand Sources & Methodology",
  description: BATCH_2_COUNTRY_CONTENT.NZ.methodologyDescription,
  path: "/methodology/new-zealand",
})

export default function NewZealandMethodologyPage() {
  return <Batch2MethodologyPage profile={BATCH_2_COUNTRY_CONTENT.NZ} />
}
