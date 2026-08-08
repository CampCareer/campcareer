import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { getCountryOccupationProfile } from "@/lib/workspace/country-occupation-read"
import { getAuOccupationStatePagesForCareer } from "@/lib/workspace/au-occupation-state-seo"
import { getIndexableOccupationRoute } from "@/lib/workspace/occupation-routes"
import { OccupationExplorer } from "../../occupation-explorer"

export const dynamic = "force-dynamic"

type OccupationDetailPageProps = {
  params: Promise<{ country: string; occupation: string }>
}

export async function generateMetadata({ params }: OccupationDetailPageProps): Promise<Metadata> {
  const { country, occupation } = await params
  const route = getIndexableOccupationRoute(country, occupation)

  if (!route) {
    return {
      title: "Occupation",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${route.career.label} in ${route.country.name}`,
    description: `Explore source-backed salary, demand, registration and pathway data for ${route.career.label} in ${route.country.name}.`,
    alternates: { canonical: route.path },
    robots: { index: true, follow: true },
  }
}

export default async function OccupationDetailPage({ params }: OccupationDetailPageProps) {
  const { country, occupation } = await params
  const route = getIndexableOccupationRoute(country, occupation)
  if (!route) notFound()

  if (country !== route.country.code.toLowerCase() || occupation !== route.career.id) {
    permanentRedirect(route.path)
  }

  const profile = await getCountryOccupationProfile(route.country.code, route.career.id)
  if (!profile) notFound()

  const statePages = route.country.code === "AU"
    ? getAuOccupationStatePagesForCareer(route.career.id)
    : []

  return (
    <>
      <OccupationExplorer
        initialQuery=""
        initialOccupation={route.career.id}
        initialCountry={route.country.code}
      />
      {statePages.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6" aria-label={`${route.career.label} demand by Australian state`}>
          <h2 className="text-[15px] font-semibold text-[#1b1b1b]">{route.career.label} demand by state and territory</h2>
          <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">Compare the verified regional shortage and vacancy evidence used by CampCareer.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {statePages.map((page) => (
              <Link key={page.path} href={page.path} className="rounded-full border border-[#deddd8] px-3 py-1.5 text-[11px] font-semibold text-[#5f5d57] transition hover:border-[#2563eb]/40 hover:text-[#2563eb]">
                {page.state.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
