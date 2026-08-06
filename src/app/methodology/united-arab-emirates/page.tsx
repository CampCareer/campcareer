import { Batch3MethodologyPage } from "../batch-3-methodology-page"
import { BATCH_3_COUNTRY_CONTENT } from "@/data/batch-3-country-content"

export const metadata = {
  title: "United Arab Emirates Sources and Methodology",
  description: "Official UAE sources and calculation methods for wage policy benchmarks, student costs, tuition, work permissions and study information.",
  alternates: { canonical: "/methodology/united-arab-emirates" },
}

export default function UnitedArabEmiratesMethodologyPage() {
  return <Batch3MethodologyPage profile={BATCH_3_COUNTRY_CONTENT.AE} />
}
