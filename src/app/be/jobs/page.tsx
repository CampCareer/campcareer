import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { formatMapSalary, getMapOccupations } from "@/lib/map-slugs"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Belgium Jobs & Occupations — Salary & Shortage Guide | CampCareer",
  description:
    "Browse Belgium occupations with gross monthly salary signals, shortage ratings, and source links from Statbel, VDAB, Actiris, Forem, and Jobat.",
  path: "/be/jobs",
})

export default async function BelgiumJobsPage() {
  const occupations = await getMapOccupations("be")

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Belgium", path: "/be" },
        { name: "Jobs", path: "/be/jobs" },
      ])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Belgium Occupations",
          description: `${occupations.length} Belgium occupation and field signals with salary and shortage data`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: occupations.length,
            itemListElement: occupations.slice(0, 100).map((occupation, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://www.campcareer.com${occupation.path}`,
              name: occupation.name,
            })),
          },
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8">
          <nav className="mb-4 text-sm text-slate-400">
            <Link href="/be" className="hover:underline">Belgium</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Belgium Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            Canonical Belgium occupation signals combining Statbel salary context, VDAB/Actiris/Forem
            shortage lists, Jobat career links, tax references, and regional labour-market context.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {occupations.map((occupation) => {
            const salary = formatMapSalary(occupation.medianSalary, occupation.currency)
            const demand = occupation.shortageRating != null
              ? `${occupation.shortageRating}/5 shortage`
              : "Demand varies"

            return (
              <Link
                key={occupation.code}
                href={occupation.path}
                className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-brand/40 hover:bg-brand-tint"
              >
                <div className="mb-2 text-sm font-medium leading-snug text-foreground group-hover:text-brand-press">
                  {occupation.name}
                </div>
                {occupation.localName && (
                  <div className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {occupation.localName}
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-600">
                    {salary === "Not available" ? salary : `${salary}/mo gross`}
                  </span>
                  <span className="ml-auto">{demand}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
