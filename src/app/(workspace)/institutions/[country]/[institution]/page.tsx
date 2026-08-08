import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { DatabaseZap } from "lucide-react"
import { SITE_URL } from "@/lib/seo-routes.mjs"
import {
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
  normalizeInstitutionSlugSegment,
} from "@/lib/institutions/institution-search"
import { getInstitutionDetail, type InstitutionDetail } from "@/lib/institutions/institution-detail.server"
import { InstitutionDetailView } from "../../institution-detail"
import { IrishInstitutionDetailView } from "../../irish-institution-detail"

export const revalidate = 3600

type InstitutionDetailPageProps = {
  params: Promise<{
    country: string
    institution: string
  }>
}

export async function generateMetadata({
  params,
}: InstitutionDetailPageProps): Promise<Metadata> {
  const { country, institution } = await params
  const countryCode = normalizeInstitutionCountrySegment(country)
  const slug = normalizeInstitutionSlugSegment(institution)

  if (!countryCode || !slug) {
    return {
      title: "Institution not found",
      robots: { index: false, follow: true },
    }
  }

  try {
    const detail = await getInstitutionDetail(countryCode, slug)
    if (!detail) {
      return {
        title: "Institution not found",
        robots: { index: false, follow: true },
      }
    }

    const canonicalPath = institutionDetailPath(countryCode, detail.slug)
    const locationTerm = countryCode === "IE" ? "locations" : "campuses"
    return {
      title: `${detail.name} | Institutions`,
      description: `Explore ${detail.name} programs, ${locationTerm} and source-backed institution details on CampCareer.`,
      alternates: {
        canonical: `${SITE_URL}${canonicalPath}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch {
    return {
      title: "Institution | CampCareer",
      robots: { index: false, follow: true },
    }
  }
}

export default async function InstitutionDetailPage({
  params,
}: InstitutionDetailPageProps) {
  const { country, institution } = await params
  const countryCode = normalizeInstitutionCountrySegment(country)
  const slug = normalizeInstitutionSlugSegment(institution)

  if (!countryCode || !slug) notFound()

  const canonicalPath = institutionDetailPath(countryCode, slug)
  if (country !== countryCode.toLowerCase() || institution !== slug) {
    permanentRedirect(canonicalPath)
  }

  let detail: InstitutionDetail | null = null
  try {
    detail = await getInstitutionDetail(countryCode, slug)
  } catch (error) {
    console.error("Unable to load institution detail page", error)

    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#f0d8d2] bg-[#fff9f7] p-10 text-center">
        <DatabaseZap className="size-7 text-[#b65c45]" />
        <h1 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
          Institution data is temporarily unavailable
        </h1>
        <p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">
          Please try again shortly. No cached or substitute institution profile has been shown.
        </p>
      </div>
    )
  }

  if (!detail) notFound()
  if (countryCode === "IE") return <IrishInstitutionDetailView institution={detail} />
  return <InstitutionDetailView institution={detail} />
}
