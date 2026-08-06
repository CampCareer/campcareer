import { Batch3MethodologyPage } from "../batch-3-methodology-page"
import { BATCH_3_COUNTRY_CONTENT } from "@/data/batch-3-country-content"

export const metadata = {
  title: "Switzerland Sources and Methodology",
  description: "Official Switzerland sources and calculation methods for salary, student costs, tuition, work permissions and study information.",
  alternates: { canonical: "/methodology/switzerland" },
}

export default function SwitzerlandMethodologyPage() {
  return <Batch3MethodologyPage profile={BATCH_3_COUNTRY_CONTENT.CH} />
}
