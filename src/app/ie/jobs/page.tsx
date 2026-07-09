import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { getMapOccupations } from "@/lib/map-slugs"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Ireland Critical Skills Jobs — Graduate Outcomes & Work Pathways | CampCareer",
  description:
    "Browse Ireland Critical Skills occupation signals linked to graduate employment outcomes and post-study work pathways.",
  path: "/ie/jobs",
})

export default async function IrelandJobsPage() {
  const occupations = await getMapOccupations("ie")

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Ireland", path: "/ie" },
        { name: "Jobs", path: "/ie/jobs" },
      ])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Ireland Critical Skills Occupations",
          description: `${occupations.length} Irish Critical Skills occupation signals with graduate outcome context`,
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
            <Link href="/ie" className="hover:underline">Ireland</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Ireland Critical Skills Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            Critical Skills occupation signals connected to Irish graduate outcome fields.
            Use this as the first pass before validating exact permit, salary, and employer requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {occupations.map((occupation) => (
            <Link
              key={`${occupation.code}-${occupation.slug}`}
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
                  {occupation.shortageRating}/5 critical skills
                </span>
                <span className="ml-auto">{occupation.codeLabel} {occupation.code}</span>
              </div>
              {occupation.field && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
                  {occupation.field}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
