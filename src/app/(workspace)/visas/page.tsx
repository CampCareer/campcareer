import { VisasExplorer } from "./visas-explorer"

export const metadata = {
  title: "Visas",
  description: "Match a visa to your study, work or working-holiday plan with official source links.",
  robots: { index: false, follow: false } as const,
}

export default async function VisasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q : ""
  return <VisasExplorer initialQuery={q} />
}
