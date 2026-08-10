import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SwedenCityDashboard } from "@/app/(workspace)/cities/sweden-city-dashboard"
import { getSeCityProfile } from "@/lib/cities/se-city-profile.server"
import { PUBLISHED_SE_CITY_SLUGS, isPublishedSeCitySlug } from "@/lib/cities/city-routes"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_SE_CITY_SLUGS)[number], string> = {
  stockholm: "Stockholm",
  gothenburg: "Gothenburg",
  uppsala: "Uppsala",
  lund: "Lund",
  linkoping: "Linköping",
  umea: "Umeå",
}

export function generateStaticParams() {
  return PUBLISHED_SE_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedSeCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Sweden`,
    description: `Explore ${name} municipality population, student budget and transport references, current student work context, verified university locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/se/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function SwedenCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedSeCitySlug(normalized)) notFound()
  const profile = await getSeCityProfile(normalized)
  if (!profile) notFound()

  const compareHref = buildCityCompareCanonicalHref({ country: "SE", left: profile.slug })

  return (
    <>
      <SwedenCityDashboard profile={profile} />
      <div className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-[#dce3eb] bg-[#f7f9fb] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4d657c]">City Compare</p>
            <p className="mt-1 text-[12px] leading-5 text-[#64748b]">Compare {profile.name} with another verified Sweden Tier A study city using the same municipality and evidence contracts.</p>
          </div>
          <Link href={compareHref} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#4d657c] px-4 text-[11.5px] font-semibold text-white sm:mt-0">
            Compare {profile.name}
          </Link>
        </div>
      </div>
    </>
  )
}
