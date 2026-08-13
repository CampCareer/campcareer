import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { KoreaCityDashboard } from "@/app/(workspace)/cities/korea-city-dashboard"
import { getKrCityProfile } from "@/lib/cities/kr-city-profile.server"
import { PUBLISHED_KR_CITY_SLUGS, isPublishedKrCitySlug } from "@/lib/cities/city-routes"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return PUBLISHED_KR_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isPublishedKrCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const profile = await getKrCityProfile(normalized)
  if (!profile) return { robots: { index: false, follow: false } }

  return {
    title: `Study in ${profile.name}, South Korea`,
    description: `Explore ${profile.name} administrative-city population, official national living-cost planning context, source-native transport reference, student-work context, verified teaching locations and conservative programme coverage.`,
    alternates: { canonical: `/cities/kr/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function KoreaCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isPublishedKrCitySlug(normalized)) notFound()

  const profile = await getKrCityProfile(normalized)
  if (!profile) notFound()

  const compareHref = buildCityCompareCanonicalHref({ country: "KR", left: profile.slug })

  return <>
    <KoreaCityDashboard profile={profile} />
    <div className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
      <div className="rounded-xl border border-[#dce5f3] bg-[#f4f8ff] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#315ea8]">City Compare</p>
          <p className="mt-1 text-[12px] leading-5 text-[#74716b]">Compare {profile.name} with another verified South Korea Tier A city while preserving each source&apos;s methodology.</p>
        </div>
        <Link href={compareHref} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#315ea8] px-4 text-[11.5px] font-semibold text-white sm:mt-0">Compare {profile.name}</Link>
      </div>
    </div>
  </>
}
