import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { NorwayCityDashboard } from "@/app/(workspace)/cities/norway-city-dashboard"
import { getNoCityProfile } from "@/lib/cities/no-city-profile.server"
import { PUBLISHED_NO_CITY_SLUGS, isPublishedNoCitySlug } from "@/lib/cities/city-routes"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_NO_CITY_SLUGS)[number], string> = {
  oslo: "Oslo",
  trondheim: "Trondheim",
  stavanger: "Stavanger",
  as: "Ås",
  tromso: "Tromsø",
}

export function generateStaticParams() {
  return PUBLISHED_NO_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedNoCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Norway`,
    description: `Explore ${name} municipality population, student living-cost and transport references, national study-permit work context, verified university study locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/no/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function NorwayCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedNoCitySlug(normalized)) notFound()

  const profile = await getNoCityProfile(normalized)
  if (!profile) notFound()
  const compareHref = buildCityCompareCanonicalHref({ country: "NO", left: profile.slug })

  return <>
    <NorwayCityDashboard profile={profile} />
    <div className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
      <div className="rounded-xl border border-[#dbe7e3] bg-[#f4f8f6] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#275b50]">City Compare</p>
          <p className="mt-1 text-[12px] leading-5 text-[#64748b]">Compare {profile.name} with another verified Norway Tier A municipality using the same evidence contract.</p>
        </div>
        <Link href={compareHref} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#275b50] px-4 text-[11.5px] font-semibold text-white sm:mt-0">Compare {profile.name}</Link>
      </div>
    </div>
  </>
}
