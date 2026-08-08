"use client"

import { ArrowLeftRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

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
  const searchParams = useSearchParams()

  function navigate(left: string, right: string) {
    if (!left || !right || left === right) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("type", "city")
    params.set("country", countryCode.toUpperCase())
    params.set("left", left)
    params.set("right", right)
    router.replace(`/compare?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-[#e7e6e3] bg-white p-4 sm:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] sm:items-end sm:p-5">
      <label className="block">
        <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">
          First city
        </span>
        <select
          value={leftSlug}
          onChange={(event) => navigate(event.target.value, rightSlug)}
          className="h-11 w-full rounded-xl border border-[#dfded9] bg-[#fafaf8] px-3 text-[13px] font-semibold text-[#1b1b1b] outline-none focus:border-[#6d4fc4] focus:ring-4 focus:ring-[#6d4fc4]/10"
          aria-label="First city to compare"
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
        className="grid h-11 w-full place-items-center rounded-xl border border-[#ded9eb] bg-[#f8f6fc] text-[#6d4fc4] transition hover:bg-[#f3f0fa] sm:w-11"
        aria-label="Swap compared cities"
        title="Swap cities"
      >
        <ArrowLeftRight className="size-4" />
      </button>

      <label className="block">
        <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">
          Second city
        </span>
        <select
          value={rightSlug}
          onChange={(event) => navigate(leftSlug, event.target.value)}
          className="h-11 w-full rounded-xl border border-[#dfded9] bg-[#fafaf8] px-3 text-[13px] font-semibold text-[#1b1b1b] outline-none focus:border-[#6d4fc4] focus:ring-4 focus:ring-[#6d4fc4]/10"
          aria-label="Second city to compare"
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
