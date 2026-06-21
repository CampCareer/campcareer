import { pageMetadata } from "@/lib/seo"
import CompareClient from "./CompareClient"

export const metadata = pageMetadata({
  title: "직업 비교",
  description:
    "호주 직업을 나란히 비교하세요 — 평균 연봉, 전국·주별 인력 부족 정도, 비자 스폰서 적격(CSOL) 여부를 한눈에.",
  path: "/compare",
})

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">직업 비교</h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
          직업을 검색해 추가하면 평균 연봉·주별 인력 부족·비자 적격 여부를 나란히 비교할 수 있어요. (최대 4개)
        </p>
      </header>
      <CompareClient />
    </div>
  )
}
