import { CountryDashboardShell } from "./country-dashboard-shell"

export const metadata = {
  title: "Countries",
  description: "Country dashboards with visa options, average salary, living costs and work opportunities.",
  alternates: { canonical: "/countries" },
  robots: { index: false, follow: false } as const,
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
