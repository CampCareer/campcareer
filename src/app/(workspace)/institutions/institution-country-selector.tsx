"use client"

import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { getLaunchCountry } from "@/data/launch-countries"
import { countryDisplayName } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import {
  INSTITUTION_MVP_COUNTRIES,
  institutionCountryPath,
  type InstitutionMvpCountryCode,
} from "@/lib/institutions/institution-search"

export function InstitutionCountrySelector({ countryCode }: { countryCode: InstitutionMvpCountryCode }) {
  const router = useRouter()
  const locale = useRouteLocale()
  const label = locale === "ko" ? "교육기관 국가" : "Institution country"

  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={countryCode}
        onChange={(event) => {
          router.push(institutionCountryPath(event.target.value as InstitutionMvpCountryCode))
        }}
        className="h-9 cursor-pointer appearance-none rounded-full border border-[#e0dfdb] bg-white py-1.5 pl-3 pr-8 text-[11.5px] font-semibold text-[#4d4c48] outline-none transition hover:border-[#b9cdb3] focus:border-[#3e7a2e] focus:ring-2 focus:ring-[#3e7a2e]/10"
      >
        {INSTITUTION_MVP_COUNTRIES.map((code) => {
          const country = getLaunchCountry(code)
          return <option key={code} value={code}>{countryDisplayName(locale, code, country?.name ?? code)}</option>
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#77746e]" />
    </label>
  )
}
