import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { DatabaseZap } from "lucide-react"
import { SITE_URL } from "@/lib/seo-routes.mjs"
import {
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
  normalizeInstitutionSlugSegment,
} from "@/lib/institutions/institution-search"
import { INDEXABLE_INSTITUTION_ROUTES } from "@/lib/institutions/institution-seo"
import { INDEXABLE_DE_INSTITUTION_ROUTES } from "@/lib/institutions/institution-seo-de"
import { INDEXABLE_NL_INSTITUTION_ROUTES } from "@/lib/institutions/institution-seo-nl"
import { INDEXABLE_NZ_INSTITUTION_ROUTES } from "@/lib/institutions/institution-seo-nz"
import { INDEXABLE_SG_INSTITUTION_ROUTES } from "@/lib/institutions/institution-seo-sg"
import { INDEXABLE_UK_INSTITUTION_ROUTES } from "@/lib/institutions/institution-seo-uk"
import { getInstitutionDetail, type InstitutionDetail } from "@/lib/institutions/institution-detail.server"
import { CanadianInstitutionDetailView } from "../../canadian-institution-detail"
import { GermanyInstitutionDetailView } from "../../germany-institution-detail"
import { InstitutionDetailView } from "../../institution-detail"
import { NetherlandsInstitutionDetailView } from "../../netherlands-institution-detail"
import { NewZealandInstitutionDetailView } from "../../new-zealand-institution-detail"
import { SingaporeInstitutionDetailView } from "../../singapore-institution-detail"

export const revalidate = 3600

type InstitutionDetailPageProps = { params: Promise<{ country: string; institution: string }> }

function isIndexableInstitutionRoute(countryCode: string, slug: string) {
  return INDEXABLE_INSTITUTION_ROUTES.some(([c, s]) => c === countryCode && s === slug)
    || INDEXABLE_UK_INSTITUTION_ROUTES.some(([c, s]) => c === countryCode && s === slug)
    || INDEXABLE_NL_INSTITUTION_ROUTES.some(([c, s]) => c === countryCode && s === slug)
    || INDEXABLE_NZ_INSTITUTION_ROUTES.some(([c, s]) => c === countryCode && s === slug)
    || INDEXABLE_SG_INSTITUTION_ROUTES.some(([c, s]) => c === countryCode && s === slug)
    || INDEXABLE_DE_INSTITUTION_ROUTES.some(([c, s]) => c === countryCode && s === slug)
}

export async function generateMetadata({ params }: InstitutionDetailPageProps): Promise<Metadata> {
  const { country, institution } = await params
  const countryCode = normalizeInstitutionCountrySegment(country)
  const slug = normalizeInstitutionSlugSegment(institution)
  if (!countryCode || !slug) return { title: "Institution not found", robots: { index: false, follow: true } }

  try {
    const detail = await getInstitutionDetail(countryCode, slug)
    if (!detail) return { title: "Institution not found", robots: { index: false, follow: true } }
    const canonicalPath = institutionDetailPath(countryCode, detail.slug)
    const locationLabel = countryCode === "AU" ? "campuses" : "locations"
    const description = countryCode === "NL"
      ? `Explore ${detail.name} official institution identity, BRIN registration and source-backed ${locationLabel} on CampCareer. Program data will be added as the Netherlands catalogue is verified.`
      : countryCode === "NZ"
        ? `Explore ${detail.name} NZQA provider identity and source-backed ${locationLabel} on CampCareer. Program data will be added as the New Zealand catalogue is verified.`
        : countryCode === "SG"
          ? `Explore ${detail.name} UEN identity and source-backed ${locationLabel} on CampCareer. Program data will be added as the Singapore catalogue is verified.`
          : countryCode === "DE"
            ? `Explore ${detail.name} HRK-verified official identity and DFG-verified ${locationLabel} on CampCareer. Program data will be added as the Germany catalogue is verified.`
            : `Explore ${detail.name} programs, ${locationLabel} and source-backed institution details on CampCareer.`

    return {
      title: `${detail.name} | Institutions`,
      description,
      alternates: { canonical: `${SITE_URL}${canonicalPath}` },
      robots: { index: isIndexableInstitutionRoute(countryCode, detail.slug), follow: true },
    }
  } catch {
    return { title: "Institution | CampCareer", robots: { index: false, follow: true } }
  }
}

export default async function InstitutionDetailPage({ params }: InstitutionDetailPageProps) {
  const { country, institution } = await params
  const countryCode = normalizeInstitutionCountrySegment(country)
  const slug = normalizeInstitutionSlugSegment(institution)
  if (!countryCode || !slug) notFound()

  const canonicalPath = institutionDetailPath(countryCode, slug)
  if (country !== countryCode.toLowerCase() || institution !== slug) permanentRedirect(canonicalPath)

  let detail: InstitutionDetail | null = null
  try {
    detail = await getInstitutionDetail(countryCode, slug)
  } catch (error) {
    console.error("Unable to load institution detail page", error)
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#f0d8d2] bg-[#fff9f7] p-10 text-center">
        <DatabaseZap className="size-7 text-[#b65c45]" />
        <h1 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Institution data is temporarily unavailable</h1>
        <p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">Please try again shortly. No cached or substitute institution profile has been shown.</p>
      </div>
    )
  }

  if (!detail) notFound()
  if (countryCode === "CA") return <CanadianInstitutionDetailView institution={detail} />
  if (countryCode === "NL") return <NetherlandsInstitutionDetailView institution={detail} />
  if (countryCode === "NZ") return <NewZealandInstitutionDetailView institution={detail} />
  if (countryCode === "SG") return <SingaporeInstitutionDetailView institution={detail} />
  if (countryCode === "DE") return <GermanyInstitutionDetailView institution={detail} />
  return <InstitutionDetailView institution={detail} />
}
