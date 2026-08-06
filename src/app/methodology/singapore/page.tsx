import { Batch2MethodologyPage } from "../batch-2-methodology-page"
import { BATCH_2_COUNTRY_CONTENT } from "@/data/batch-2-country-content"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Singapore Sources & Methodology",
  description: BATCH_2_COUNTRY_CONTENT.SG.methodologyDescription,
  path: "/methodology/singapore",
})

export default function SingaporeMethodologyPage() {
  return <Batch2MethodologyPage profile={BATCH_2_COUNTRY_CONTENT.SG} />
}
