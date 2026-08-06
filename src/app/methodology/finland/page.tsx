import { Batch3MethodologyPage } from "../batch-3-methodology-page"
import { BATCH_3_COUNTRY_CONTENT } from "@/data/batch-3-country-content"

export const metadata = {
  title: "Finland Sources and Methodology",
  description: "Official Finland sources and calculation methods for salary, student costs, tuition, work permissions and study information.",
  alternates: { canonical: "/methodology/finland" },
}

export default function FinlandMethodologyPage() {
  return <Batch3MethodologyPage profile={BATCH_3_COUNTRY_CONTENT.FI} />
}
