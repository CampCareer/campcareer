"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CountryPill } from "@/components/workspace/country-pill"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { COMPARE_MODE_NAV_ITEMS, type CompareModeType } from "@/lib/compare-navigation"
import {
  buildCareerCompareCanonicalHref,
  buildCityCompareCanonicalHref,
  buildProgramCompareCanonicalHref,
} from "@/lib/compare-routes"

export { COMPARE_MODE_NAV_ITEMS }

type ComparePageHeaderProps = {
  activeType: CompareModeType
  countryCode?: string | null
}

const TITLE: Record<CompareModeType, { en: string; ko: string }> = {
  program: { en: "Compare programs", ko: "프로그램 비교" },
  country: { en: "Compare country context", ko: "국가 맥락 비교" },
  city: { en: "Compare city context", ko: "도시 맥락 비교" },
  career: { en: "Compare careers", ko: "커리어 비교" },
}

export function ComparePageHeader({ activeType, countryCode }: ComparePageHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useRouteLocale()
  const showCountry = activeType === "program" || activeType === "career" || activeType === "city"
  const resolvedCountry = countryCode?.toUpperCase() || "AU"
  const title = TITLE[activeType]

  function updateCountry(code: string | null) {
    if (!code) return

    if (activeType === "city") {
      router.replace(buildCityCompareCanonicalHref({ country: code }), { scroll: false })
      return
    }

    if (activeType === "career") {
      router.replace(
        buildCareerCompareCanonicalHref({
          country: code,
          profile: searchParams.get("profile") ?? undefined,
          city: searchParams.get("city"),
          careers: (searchParams.get("careers") ?? "").split(",").filter(Boolean),
        }),
        { scroll: false },
      )
      return
    }

    router.replace(buildProgramCompareCanonicalHref(), { scroll: false })
  }

  return (
    <header className="mb-5 border-b border-[hsl(var(--cc-border))] pb-4">
      <p className="text-[10px] font-semibold tracking-[0.12em] text-brand">{locale === "ko" ? "보조 판단" : "SECONDARY DECISION"}</p>
      <div className="mt-1.5 flex min-h-10 flex-wrap items-center gap-3">
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.025em] text-[hsl(var(--cc-ink))] sm:text-3xl">
          {title[locale]}
        </h1>
        {showCountry ? (
          <CountryPill value={resolvedCountry} allowAll={false} onChange={updateCountry} />
        ) : null}
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--cc-muted))]">
        {locale === "ko"
          ? "비교는 결론을 대신하지 않습니다. Career Page의 Score, 근거와 Path를 확인한 뒤 실제 선택지를 검증할 때 사용하세요."
          : "Comparison does not replace the verdict. Use it to test real options after reviewing the Career Page score, evidence and path."}
      </p>
    </header>
  )
}
