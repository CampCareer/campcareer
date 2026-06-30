import { pageMetadata } from "@/lib/seo"
import Link from "next/link"
import { GraduationCap, Building2, Briefcase } from "lucide-react"

export const metadata = pageMetadata({
  title: "비교",
  description:
    "학교·전공·직업을 나란히 비교하세요 — 국가별, 지역별 데이터를 한눈에.",
  path: "/compare",
})

const compareTypes = [
  {
    href: "/compare/schools",
    icon: Building2,
    title: "학교 비교",
    description: "같은 전공의 학교끼리, 혹은 국가별 학교를 비교해보세요.",
    status: "준비 중",
  },
  {
    href: "/compare/majors",
    icon: GraduationCap,
    title: "전공 비교",
    description: "국가별로 같은 전공의 취업·비자·ROI를 나란히 비교해보세요.",
    status: null,
  },
  {
    href: "/compare/careers",
    icon: Briefcase,
    title: "직업 비교",
    description: "같은 직업을 국가별·지역별로 비교해보세요.",
    status: null,
  },
]

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-10">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          비교
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
          두 대상을 나란히 놓고 비교해보세요. 학교·전공·직업 각각의 카테고리에서
          국가별·지역별 데이터를 한눈에 볼 수 있습니다.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-3">
        {compareTypes.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                {item.description}
              </p>
              {item.status && (
                <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {item.status}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
