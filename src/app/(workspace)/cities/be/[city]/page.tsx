import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BelgiumCityDashboard } from "@/app/(workspace)/cities/belgium-city-dashboard"
import { getBeCityProfile } from "@/lib/cities/be-city-profile.server"
import { PUBLISHED_BE_CITY_SLUGS, isPublishedBeCitySlug } from "@/lib/cities/city-routes"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_BE_CITY_SLUGS)[number], string> = {
  brussels: "Brussels",
  ghent: "Ghent",
  leuven: "Leuven",
  antwerp: "Antwerp",
  "louvain-la-neuve": "Louvain-la-Neuve",
  liege: "Liège",
}

export function generateStaticParams() {
  return PUBLISHED_BE_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedBeCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Belgium`,
    description: `Explore ${name} population scope, student living costs, transport, international-student work context, verified university teaching locations and programme-delivery coverage.`,
    alternates: { canonical: `/cities/be/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function BelgiumCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedBeCitySlug(normalized)) notFound()
  const profile = await getBeCityProfile(normalized)
  if (!profile) notFound()

  const compareHref = buildCityCompareCanonicalHref({ country: "BE", left: profile.slug })

  return (
    <>
      <BelgiumCityDashboard profile={profile} />
      <div className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-[#dce3eb] bg-[#f7f9fb] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4d657c]">City Compare</p>
            <p className="mt-1 text-[12px] leading-5 text-[#64748b]">Compare {profile.name} with another verified Belgium Tier A study destination using the same evidence contracts.</p>
          </div>
          <Link href={compareHref} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#4d657c] px-4 text-[11.5px] font-semibold text-white sm:mt-0">
            Compare {profile.name}
          </Link>
        </div>
      </div>
    </>
  )
}
