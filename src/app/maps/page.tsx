import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { pageMetadata } from "@/lib/seo"
import { getInitialMapShellData } from "@/lib/map-data"
import CampCareerMaps from "@/app/map/CampCareerMaps"

// The map shell reads live Supabase datasets. Render per request so CI static
// generation does not require production service-role credentials.
export const dynamic = "force-dynamic"

export const metadata = pageMetadata({
  title: "Regional career context in Australia | CampCareer",
  description: "Use source-labelled Australian regional signals as context after evaluating a career with CampCareer Score.",
  path: "/maps",
})

export default async function MapsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const country = typeof params.country === "string" ? params.country.toUpperCase() : "AU"
  const career = typeof params.career === "string" ? params.career : typeof params.occupation === "string" ? params.occupation : null
  const careerHref = career
    ? `/career?country=${encodeURIComponent(country)}&occupation=${encodeURIComponent(career)}`
    : null
  const data = await getInitialMapShellData()

  return (
    <main className="flex h-[calc(100dvh-3.5rem)] w-full flex-col sm:h-[calc(100dvh-4rem)]">
      <section className="shrink-0 border-b border-[hsl(var(--cc-border))] bg-[hsl(var(--cc-canvas))] px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-brand">REGIONAL CONTEXT</p>
            <h1 className="mt-0.5 text-base font-semibold text-[hsl(var(--cc-ink))]">Regional signals support a career decision</h1>
            <p className="mt-0.5 text-xs leading-5 text-[hsl(var(--cc-muted))]">Use the map after evaluating the career. Geography can change local opportunity and entry logistics, but it is not a separate CampCareer score.</p>
          </div>
          <Link href={careerHref ?? "/"} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand hover:underline">
            {careerHref ? <ArrowLeft className="size-3.5" /> : null}
            {careerHref ? "Back to Career Page" : "Evaluate a career"}
            {!careerHref ? <ArrowRight className="size-3.5" /> : null}
          </Link>
        </div>
      </section>
      <div className="min-h-0 flex-1"><CampCareerMaps data={data} auOnly routeMode /></div>
    </main>
  )
}
