"use client"

import { useRouter } from "next/navigation"
import { useSelectedCountry } from "@/components/workspace/country-context"

const COUNTRY_PICKER_FLAG = "campcareer:open-country-picker"

export function ChangeCountryButton() {
  const router = useRouter()
  const { setSelectedCountry } = useSelectedCountry()

  function openPicker() {
    window.sessionStorage.setItem(COUNTRY_PICKER_FLAG, "1")
    setSelectedCountry(null)
    router.push("/countries")
  }

  return (
    <button
      type="button"
      onClick={openPicker}
      className="mt-5 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
    >
      Change country
    </button>
  )
}
