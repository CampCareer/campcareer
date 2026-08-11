import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SwitzerlandCityDashboard } from "@/app/(workspace)/cities/switzerland-city-dashboard"
import { getChCityProfile } from "@/lib/cities/ch-city-profile.server"
import { SUPPORTED_CH_CITY_SLUGS, isSupportedChCitySlug } from "@/lib/cities/city-routes"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof SUPPORTED_CH_CITY_SLUGS)[number], string> = {
  zurich: "Zurich",
  lausanne: "Lausanne",
  basel: "Basel",
  lugano: "Lugano",
  fribourg: "Fribourg",
  geneva: "Geneva",
}

export function generateStaticParams() {
  return SUPPORTED_CH_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedChCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Switzerland`,
    description: `Explore ${name} municipality population, source-aware student living and transport references, Swiss student-work context, verified university study locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/ch/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function SwitzerlandCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedChCitySlug(normalized)) notFound()

  const profile = await getChCityProfile(normalized)
  if (!profile) notFound()
  const compareHref = buildCityCompareCanonicalHref({ country: "CH", left: profile.slug })

  return <>
    <SwitzerlandCityDashboard profile={profile} />
    <div className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
      <div className="rounded-xl border border-[#ead9dc] bg-[#fff7f8] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a31c2a]">City Compare</p>
          <p className="mt-1 text-[12px] leading-5 text-[#64748b]">Compare {profile.name} with another verified Switzerland Tier A municipality using the same evidence contract.</p>
        </div>
        <Link href={compareHref} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#a31c2a] px-4 text-[11.5px] font-semibold text-white sm:mt-0">Compare {profile.name}</Link>
      </div>
    </div>
  </>
}
