import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SpainCityDashboard } from "@/app/(workspace)/cities/spain-city-dashboard"
import { getEsCityProfile } from "@/lib/cities/es-city-profile.server"
import { PUBLISHED_ES_CITY_SLUGS, isPublishedEsCitySlug } from "@/lib/cities/city-routes"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return PUBLISHED_ES_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isPublishedEsCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const profile = await getEsCityProfile(normalized)
  if (!profile) return { robots: { index: false, follow: false } }

  return {
    title: `Study in ${profile.name}, Spain`,
    description: `Explore ${profile.name} municipality population, official student living-cost and transport references, national student-work context, verified teaching locations and conservative programme coverage.`,
    alternates: { canonical: `/cities/es/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function SpainCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isPublishedEsCitySlug(normalized)) notFound()

  const profile = await getEsCityProfile(normalized)
  if (!profile) notFound()

  const compareHref = buildCityCompareCanonicalHref({ country: "ES", left: profile.slug })

  return <>
    <SpainCityDashboard profile={profile} />
    <div className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
      <div className="rounded-xl border border-[#eaded7] bg-[#fff7f2] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9b4a24]">City Compare</p>
          <p className="mt-1 text-[12px] leading-5 text-[#74716b]">Compare {profile.name} with another verified Spain Tier A municipality while preserving each source&apos;s methodology.</p>
        </div>
        <Link href={compareHref} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#9b4a24] px-4 text-[11.5px] font-semibold text-white sm:mt-0">
          Compare {profile.name}
        </Link>
      </div>
    </div>
  </>
}
