import { pageMetadata } from "@/lib/seo"
import SchoolCompareClient from "./SchoolCompareClient"

export const metadata = pageMetadata({
  title: "학교 비교",
  description: "국가별 학교의 학비·졸업 후 초봉·ROI를 나란히 비교하세요.",
  path: "/compare/schools",
})

export default function SchoolComparePage() {
  return <SchoolCompareClient />
}
