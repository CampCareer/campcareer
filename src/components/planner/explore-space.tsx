"use client"

import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Search,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

type ExploreSpaceProps = {
  isKo: boolean
}

const EXPLORE_SECTIONS = [
  {
    id: "majors",
    icon: Target,
    href: "/au/majors",
    titleEn: "Explore Majors",
    titleKo: "전공 탐색",
    descEn: "39 study fields across 10 categories with career outcomes",
    descKo: "10개 카테고리, 39개 전공의 진로 데이터",
    color: "blue" as const,
  },
  {
    id: "study",
    icon: GraduationCap,
    href: "/au/study",
    titleEn: "Explore Universities",
    titleKo: "학교 탐색",
    descEn: "Compare tuition, ROI, and employment rates across Australian universities",
    descKo: "호주 대학교의 학비, ROI, 취업률 비교",
    color: "violet" as const,
  },
  {
    id: "jobs",
    icon: BriefcaseBusiness,
    href: "/au/jobs",
    titleEn: "Explore Careers",
    titleKo: "직업 탐색",
    descEn: "Salary, growth outlook, and skill demand for Australian occupations",
    descKo: "호주 직업별 임금, 성장 전망, 기술 수요",
    color: "emerald" as const,
  },
]

export function ExploreSpace({ isKo }: ExploreSpaceProps) {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-6 pb-16 pt-8 sm:px-10 sm:pt-12">
      {/* Header */}
      <header>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
          <Search className="size-3.5" />
          {isKo ? "탐색" : "EXPLORE"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {isKo ? "무엇을 찾아볼까요?" : "What would you like to explore?"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isKo
            ? "전공, 학교, 직업에 대한 데이터를 탐색하고 비교하세요."
            : "Discover and compare data on majors, universities, and careers."}
        </p>
      </header>

      {/* Search bar (decorative for now) */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={
            isKo
              ? "전공, 학교, 직업 검색 (예: 간호, 멜버른 대학교...)"
              : "Search majors, schools, jobs (e.g. nursing, University of Melbourne...)"
          }
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          readOnly
        />
      </div>

      {/* Explore cards */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">
          {isKo ? "빠른 접근" : "Quick access"}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {EXPLORE_SECTIONS.map((section) => (
            <ExploreCard key={section.id} section={section} isKo={isKo} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-700">
          {isKo
            ? "데이터는 호주 정부 공식 출처에서 제공됩니다."
            : "Data is sourced from official Australian government datasets."}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {isKo
            ? "QILT, ABS, Department of Home Affairs, CRICOS"
            : "QILT, ABS, Department of Home Affairs, CRICOS"}
        </p>
      </div>
    </section>
  )
}

function ExploreCard({
  section,
  isKo,
}: {
  section: (typeof EXPLORE_SECTIONS)[number]
  isKo: boolean
}) {
  const Icon = section.icon
  const colors = {
    blue: "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50",
    violet: "border-violet-200 hover:border-violet-300 hover:bg-violet-50/50",
    emerald: "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50",
  }
  const iconColors = {
    blue: "bg-blue-100 text-blue-600",
    violet: "bg-violet-100 text-violet-600",
    emerald: "bg-emerald-100 text-emerald-600",
  }

  return (
    <Link
      href={section.href}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-5 transition hover:shadow-sm",
        colors[section.color],
      )}
    >
      <div
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          iconColors[section.color],
        )}
      >
        <Icon className="size-5" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-900">
        {isKo ? section.titleKo : section.titleEn}
      </h2>
      <p className="mt-1 flex-1 text-xs leading-5 text-slate-500">
        {isKo ? section.descKo : section.descEn}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition group-hover:gap-1.5 group-hover:text-blue-600">
        {isKo ? "바로가기" : "Go"} <ArrowRight className="size-3.5" />
      </span>
    </Link>
  )
}
