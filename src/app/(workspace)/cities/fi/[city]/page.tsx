import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FinlandCityDashboard } from "@/app/(workspace)/cities/finland-city-dashboard"
import { getFiCityProfile } from "@/lib/cities/fi-city-profile.server"
import { PUBLISHED_FI_CITY_SLUGS, isPublishedFiCitySlug } from "@/lib/cities/city-routes"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_FI_CITY_SLUGS)[number], string> = {
  helsinki: "Helsinki", espoo: "Espoo", tampere: "Tampere", turku: "Turku", oulu: "Oulu", jyvaskyla: "Jyväskylä", lappeenranta: "Lappeenranta", joensuu: "Joensuu",
}

export function generateStaticParams() { return PUBLISHED_FI_CITY_SLUGS.map((city) => ({ city })) }

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedFiCitySlug(normalized)) return { robots: { index: false, follow: false } }
  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Finland`,
    description: `Explore ${name} municipality population, student-budget and transport references, national student-work context, verified university-core study locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/fi/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function FinlandCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedFiCitySlug(normalized)) notFound()
  const profile = await getFiCityProfile(normalized)
  if (!profile) notFound()
  const compareHref = buildCityCompareCanonicalHref({ country: "FI", left: profile.slug })

  return <>
    <FinlandCityDashboard profile={profile} />
    <div className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10"><div className="rounded-xl border border-[#dbe7e3] bg-[#f4f8f6] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#275b50]">City Compare</p><p className="mt-1 text-[12px] leading-5 text-[#64748b]">Compare {profile.name} with another verified Finland Tier A municipality using the same evidence contract.</p></div><Link href={compareHref} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#275b50] px-4 text-[11.5px] font-semibold text-white sm:mt-0">Compare {profile.name}</Link></div></div>
  </>
}
