import { getLocale } from "@/lib/i18n/server"
import { CountryDashboardShell } from "./country-dashboard-shell"

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: locale === "ko" ? "국가" : "Countries",
    description: locale === "ko" ? "CampCareer 국가별 정보 대시보드입니다." : "CampCareer country information dashboards.",
    alternates: { canonical: "/countries" },
    robots: { index: false, follow: false } as const,
  }
}

export default async function CountriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q : ""
  return <CountryDashboardShell initialQuery={q} />
}
