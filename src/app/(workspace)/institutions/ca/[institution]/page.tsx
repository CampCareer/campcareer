import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { DatabaseZap } from "lucide-react"
import { SITE_URL } from "@/lib/seo-routes.mjs"
import {
  institutionDetailPath,
  normalizeInstitutionSlugSegment,
} from "@/lib/institutions/institution-search"
import { INDEXABLE_INSTITUTION_ROUTES } from "@/lib/institutions/institution-seo"
import { getInstitutionDetail, type InstitutionDetail } from "@/lib/institutions/institution-detail.server"
import {
  getCaInstitutionProgramSummary,
  type CaInstitutionProgramSummary,
} from "@/lib/programs/ca-programs.server"
import { CanadianInstitutionProgramDetailView } from "../../canadian-institution-program-detail"

export const revalidate = 3600

type Params = { params: Promise<{ institution: string }> }

function isIndexableCanadaInstitution(slug: string) {
  return INDEXABLE_INSTITUTION_ROUTES.some(([countryCode, routeSlug]) => countryCode === "CA" && routeSlug === slug)
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { institution } = await params
  const slug = normalizeInstitutionSlugSegment(institution)
  if (!slug) return { title: "Institution not found", robots: { index: false, follow: true } }

  try {
    const detail = await getInstitutionDetail("CA", slug)
    if (!detail) return { title: "Institution not found", robots: { index: false, follow: true } }
    const canonicalPath = institutionDetailPath("CA", detail.slug)
    return {
      title: `${detail.name} | Institutions`,
      description: `Explore ${detail.name} DLI identity, source-backed locations and CampCareer programs published against the 80 target careers.`,
      alternates: { canonical: `${SITE_URL}${canonicalPath}` },
      robots: { index: isIndexableCanadaInstitution(detail.slug), follow: true },
    }
  } catch {
    return { title: "Institution | CampCareer", robots: { index: false, follow: true } }
  }
}

export default async function CanadaInstitutionDetailPage({ params }: Params) {
  const { institution } = await params
  const slug = normalizeInstitutionSlugSegment(institution)
  if (!slug) notFound()

  const canonicalPath = institutionDetailPath("CA", slug)
  if (institution !== slug) permanentRedirect(canonicalPath)

  let detail: InstitutionDetail | null = null
  let publication: CaInstitutionProgramSummary | null = null
  let loadFailed = false

  try {
    ;[detail, publication] = await Promise.all([
      getInstitutionDetail("CA", slug),
      getCaInstitutionProgramSummary(slug),
    ])
  } catch (error) {
    console.error("Unable to load Canadian institution detail page", error)
    loadFailed = true
  }

  if (loadFailed) return <InstitutionUnavailable />
  if (!detail) notFound()
  if (!publication) return <InstitutionUnavailable />

  return <CanadianInstitutionProgramDetailView institution={detail} publication={publication} />
}

function InstitutionUnavailable() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#f0d8d2] bg-[#fff9f7] p-10 text-center">
      <DatabaseZap className="size-7 text-[#b65c45]" />
      <h1 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Institution data is temporarily unavailable</h1>
      <p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">Please try again shortly. No cached or substitute institution profile has been shown.</p>
    </div>
  )
}
