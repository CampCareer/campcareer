import { AlertCircle, LoaderCircle } from "lucide-react"
import type { CanonicalCareer } from "@/data/career-comparison-catalog"
import type { OccupationDetail } from "@/lib/workspace/occupation-detail"
import type { CountryOccupationProfile } from "@/lib/workspace/country-occupation-contract"
import { CountryOccupationDashboard } from "./country-occupation-dashboard"
import { OccupationDetailPanel as LegacyOccupationDetailPanel } from "./occupation-detail-view"

type CountryProfileStatus = "idle" | "loading" | "ready" | "missing" | "error"

export function CountryAwareOccupationDetail({
  career,
  detail,
  countryCode,
  countryName,
  countryProfile,
  countryProfileStatus,
}: {
  career: CanonicalCareer
  detail: OccupationDetail | undefined
  countryCode?: string
  countryName?: string
  countryProfile: CountryOccupationProfile | null
  countryProfileStatus: CountryProfileStatus
}) {
  if (!countryCode) {
    return (
      <LegacyOccupationDetailPanel
        career={career}
        detail={detail}
        countryCode={countryCode}
        countryName={countryName}
      />
    )
  }

  if (countryProfileStatus === "loading") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#e7e6e3] bg-white p-10 text-center">
        <LoaderCircle className="size-6 animate-spin text-[#2563eb]" />
        <p className="mt-3 text-[13px] font-medium text-[#6f6d68]">
          Loading {countryName ?? countryCode} occupation data…
        </p>
      </div>
    )
  }

  if (countryProfile) {
    return <CountryOccupationDashboard career={career} profile={countryProfile} />
  }

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e7e6e3] bg-white/70 p-10 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#fff4e8] text-[#c2691e]">
        <AlertCircle className="size-5" />
      </span>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#c2691e]">
        {countryName ?? countryCode}
      </p>
      <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
        {career.label}
      </h2>
      <p className="mt-3 max-w-md text-[13px] leading-6 text-[#6f6d68]">
        {countryProfileStatus === "error"
          ? "This country profile could not be loaded. No data from another country has been substituted."
          : "Verified country-specific salary, demand, pathway and job-market data are not published for this occupation yet. No data from another country has been substituted."}
      </p>
    </div>
  )
}
