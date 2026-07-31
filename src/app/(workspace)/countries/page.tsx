import { CountriesExplorer } from "./countries-explorer"

export const metadata = {
  title: "Countries",
  description: "Country dashboards with visa options, average salary, living costs and work opportunities.",
  robots: { index: false, follow: false } as const,
}

export default async function CountriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q : ""
  return <CountriesExplorer initialQuery={q} />
}
