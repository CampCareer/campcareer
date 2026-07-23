import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react"
import { getStudyConcept, STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { localizePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Explore Australia study fields and career pathways",
  description: "Browse every Australia study field, then compare the pathway, programmes, costs and career signals that matter to you.",
  path: "/au/majors",
})

export default async function AustralianMajorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [locale, query] = await Promise.all([getLocale(), searchParams])
  const isKo = locale === "ko"
  const one = (key: string) => (typeof query[key] === "string" ? query[key] : undefined)
  const selectedMajor = one("major")
  const selectedCategory = STUDY_CATEGORIES.find((category) => category.id === one("category"))

  if (selectedMajor) {
    const concept = getStudyConcept(selectedMajor)
    if (concept) redirect(localizePath(`/au/majors/${concept.slug}`, locale))
  }

  const categories = selectedCategory ? [selectedCategory] : STUDY_CATEGORIES
  const conceptCount = STUDY_CONCEPTS.filter((concept) => categories.some((category) => category.id === concept.category)).length

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden au-discovery-hero">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
          <Link href={localizePath("/", locale)} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white">
            <ArrowLeft className="size-4" />
            {isKo ? "내 경로 찾기로 돌아가기" : "Back to Find my path"}
          </Link>
          <div className="mt-7 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-100">Australia · Field explorer</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {selectedCategory
                  ? (isKo ? selectedCategory.labelKo : selectedCategory.label)
                  : (isKo ? "호주의 모든 전공 경로 둘러보기" : "Browse every Australia study field")}
              </h1>
              <p className="mt-3 text-base leading-7 text-blue-50">
                {selectedCategory
                  ? (isKo ? `${conceptCount}개 경로의 학업, 프로그램, 커리어 신호를 비교해보세요.` : `Compare the ${conceptCount} study pathways, programmes and career signals in this field.`)
                  : (isKo ? `10개 분야, ${conceptCount}개 경로를 한눈에 살펴보고 나에게 맞는 전공을 선택하세요.` : `Explore ${categories.length} fields and ${conceptCount} study pathways before choosing the route that fits you.`)}
              </p>
            </div>
            <Link href={localizePath("/au/study", locale)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50">
              <GraduationCap className="size-4" />
              {isKo ? "학교·비용 비교하기" : "Compare study options"}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          {selectedCategory && (
            <Link href={localizePath("/au/majors", locale)} className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800">
              <ArrowLeft className="size-4" />
              {isKo ? "전체 전공 보기" : "View all fields"}
            </Link>
          )}
          <div className="grid gap-5 lg:grid-cols-2">
            {categories.map((category) => {
              const { Icon, tone } = getStudyCategoryVisual(category.id)
              const concepts = STUDY_CONCEPTS.filter((concept) => concept.category === category.id)
              return (
                <article key={category.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{isKo ? "전공 분야" : "Study field"}</p>
                        <h2 className="mt-1 text-lg font-semibold leading-6 text-slate-950">{isKo ? category.labelKo : category.label}</h2>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{concepts.length}</span>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {concepts.map((concept) => (
                      <Link key={concept.id} href={localizePath(`/au/majors/${concept.slug}`, locale)} className="group rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-blue-300 hover:bg-blue-50/60">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900">{isKo ? concept.labelKo : concept.label}</h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{concept.description}</p>
                          </div>
                          <ArrowRight className="mt-0.5 size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
