"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { CareerMarketResults } from "../home/career-market-results"
import { getOverviewSearchQuery } from "../home/home-overview-config"
import { CareerResultActions } from "./career-result-actions"

export function CareerResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useRouteLocale()
  const query = getOverviewSearchQuery(searchParams)

  useEffect(() => {
    if (!query) router.replace("/")
  }, [query, router])

  if (!query) return <main id="main-content" className="min-h-[calc(100vh-3.5rem)] bg-white" />

  return <main id="main-content" className="cc-result-page cc-result-motion min-h-[calc(100vh-3.5rem)] bg-white px-5 pb-16 pt-7 sm:px-8 sm:pt-10">
    <div className="mx-auto max-w-5xl">
      <Link href={localizePath("/", locale)} className="cc-result-back inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"><ArrowLeft className="size-4" /> {locale === "ko" ? "다시 검색하기" : "Search again"}</Link>
      <CareerMarketResults query={query} locale={locale} presentation="page" />
      <CareerResultActions query={query} locale={locale} />
    </div>
  </main>
}
