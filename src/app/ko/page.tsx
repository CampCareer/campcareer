import Link from "next/link"
import { EXPANSION_COUNTRIES } from "@/data/expansion-countries"
import { pageMetadata } from "@/lib/seo"

export const metadata = {
  ...pageMetadata({
    title: "CampCareer 한국어 - 유학·이민 직업 ROI 비교",
    description: "한국 취업과 해외 유학·이민 경로를 직업 수요, 연봉, 언어, 체류 경로로 비교합니다.",
    path: "/ko",
  }),
  alternates: { canonical: "/ko", languages: { "ko-KR": "/ko", en: "/" } },
}

export default function KoreanExpansionPage() {
  const pilots = EXPANSION_COUNTRIES.filter((country) => country.wave === "pilot" || country.wave === "baseline")
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">CampCareer 한국어</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">유학 후 어디서, 어떤 직업으로 일할지 비교하세요.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">국가 인기도 대신 직업 수요, 세후 소득, 현지 언어, 외국인 취업 경로, 한국 귀국 대비를 함께 봅니다.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {pilots.map((country) => (
            <Link key={country.slug} href={`/ko/${country.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-slate-400">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{country.wave}</p>
              <h2 className="mt-2 text-2xl font-semibold">{country.nameKo}</h2>
              <p className="mt-2 text-sm text-slate-600">{country.role === "return-benchmark" ? "해외 선택지와 비교하는 귀국 기준선" : "공식 데이터 기반 국가 파일럿"}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
