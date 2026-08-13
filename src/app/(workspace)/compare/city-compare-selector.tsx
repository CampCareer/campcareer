"use client"

import { ArrowLeftRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export type CityCompareOption = {
  slug: string
  name: string
  regionName: string
}

type CityCompareSelectorProps = {
  options: readonly CityCompareOption[]
  leftSlug: string
  rightSlug: string
  countryCode?: string
}

export function CityCompareSelector({
  options,
  leftSlug,
  rightSlug,
  countryCode = "AU",
}: CityCompareSelectorProps) {
  const router = useRouter()
  const locale = useRouteLocale()
  const ko = locale === "ko"

  function navigate(left: string, right: string) {
    if (!left || !right || left === right) return
    router.replace(
      localizePath(
        buildCityCompareCanonicalHref({
          country: countryCode,
          left,
          right,
        }),
        locale,
      ),
      { scroll: false },
    )
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-[#e7e6e3] bg-white p-4 sm:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] sm:items-end sm:p-5">
      <label className="block min-w-0">
        <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">
          {ko ? "첫 번째 도시" : "First city"}
        </span>
        <select
          value={leftSlug}
          onChange={(event) => navigate(event.target.value, rightSlug)}
          className="h-11 w-full min-w-0 rounded-xl border border-[#dfded9] bg-[#fafaf8] px-3 text-[13px] font-semibold text-[#1b1b1b] outline-none focus:border-[#6d4fc4] focus:ring-4 focus:ring-[#6d4fc4]/10"
          aria-label={ko ? "비교할 첫 번째 도시" : "First city to compare"}
        >
          {options.map((city) => (
            <option key={city.slug} value={city.slug} disabled={city.slug === rightSlug}>
              🏙️ {city.name} · {city.regionName}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => navigate(rightSlug, leftSlug)}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#ded9eb] bg-[#f8f6fc] px-3 text-[#6d4fc4] transition hover:bg-[#f3f0fa] focus:outline-none focus:ring-4 focus:ring-[#6d4fc4]/10 sm:grid sm:w-11 sm:place-items-center sm:px-0"
        aria-label={ko ? "비교 도시 순서 바꾸기" : "Swap compared cities"}
        title={ko ? "도시 순서 바꾸기" : "Swap cities"}
      >
        <ArrowLeftRight className="size-4" />
        <span className="text-[12px] font-semibold sm:hidden">{ko ? "도시 바꾸기" : "Swap cities"}</span>
      </button>

      <label className="block min-w-0">
        <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">
          {ko ? "두 번째 도시" : "Second city"}
        </span>
        <select
          value={rightSlug}
          onChange={(event) => navigate(leftSlug, event.target.value)}
          className="h-11 w-full min-w-0 rounded-xl border border-[#dfded9] bg-[#fafaf8] px-3 text-[13px] font-semibold text-[#1b1b1b] outline-none focus:border-[#6d4fc4] focus:ring-4 focus:ring-[#6d4fc4]/10"
          aria-label={ko ? "비교할 두 번째 도시" : "Second city to compare"}
        >
          {options.map((city) => (
            <option key={city.slug} value={city.slug} disabled={city.slug === leftSlug}>
              🏙️ {city.name} · {city.regionName}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
