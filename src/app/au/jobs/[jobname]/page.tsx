import "server-only"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getCoursesForOccupation } from "@/lib/occupations-au"
import { getAuOccupationSlug, slugifyAuOccupation } from "@/lib/au-occupation-slug"
import { AU_OSCA_SOURCE, getAuOfficialOccupationContent } from "@/lib/au-osca-content"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { getOccupationDetail, getOccupationDetailByAnzsco, type OccupationDetail } from "./sample-data"
import { OccupationDetailClient } from "./OccupationDetail"

export const revalidate = 86400

type Params = { jobname: string }

type OccRow = {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  shortage_rating: number | null
  median_salary_aud: number | null
  on_csol: boolean
  related_broad_field: string | null
  confidence: string | null
  source_name: string | null
  source_url: string | null
  last_verified: string | null
}

type StateOccRow = {
  anzsco_code: string
  state: string
  shortage_rating: number
}

async function getAllOccupations(): Promise<OccRow[]> {
  const { data, error } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, related_broad_field, confidence, source_name, source_url, last_verified")
    .not("anzsco_code", "is", null)
    .order("occupation_en")

  if (error) {
    console.error("[au-jobs] occupations failed:", error.message)
    return []
  }

  return (data ?? []) as OccRow[]
}

function findOccupation(jobname: string, occupations: OccRow[]): OccRow | null {
  const normalized = slugifyAuOccupation(jobname)
  return occupations.find((occupation) =>
    occupation.anzsco_code === jobname ||
    getAuOccupationSlug(occupation, occupations) === normalized ||
    slugifyAuOccupation(occupation.occupation_en) === normalized,
  ) ?? null
}

function fallbackDetail(occupation: OccRow): OccupationDetail {
  const sourceLabel = occupation.source_name ?? "the listed labour-market source"
  return {
    slug: slugifyAuOccupation(occupation.occupation_en),
    anzscoCode: occupation.anzsco_code,
    name: occupation.occupation_en,
    nameKo: occupation.occupation_ko ?? occupation.occupation_en,
    lastVerified: occupation.last_verified?.slice(0, 10) ?? "Refresh pending",
    sources: [sourceLabel],
    description: `CampCareer tracks ${occupation.occupation_en} as OSCA ${occupation.anzsco_code}. Occupation-specific duties are being verified against an authoritative Australian source; the labour-market indicators above are published independently from this description.`,
    environments: [],
    anzscoDescriptionUrl: occupation.source_url ?? "",
    skillsCore: [],
    skillsEdge: [],
    credentials: [],
  }
}

function buildDataNote(occupation: OccRow): string | null {
  const details = [
    `Official occupation content: ${AU_OSCA_SOURCE.classification}, Australian Bureau of Statistics.`,
    occupation.source_name ? `Source: ${occupation.source_name}.` : null,
    occupation.last_verified ? `Last verified: ${occupation.last_verified.slice(0, 10)}.` : "The next source refresh date has not yet been recorded.",
    occupation.confidence ? `Data confidence: ${occupation.confidence}.` : null,
    !occupation.on_csol ? "A missing CSOL flag is not a finding of visa ineligibility; check the current Home Affairs list." : null,
  ].filter(Boolean)
  return details.join(" ") || null
}

async function getOccupationData(jobname: string) {
  const occupations = await getAllOccupations()
  const occupation = findOccupation(jobname, occupations)
  if (!occupation) return null

  const [stateResult, courses] = await Promise.all([
    supabaseAdmin
      .from("occupation_state_au")
      .select("anzsco_code, state, shortage_rating")
      .eq("anzsco_code", occupation.anzsco_code),
    occupation.related_broad_field ? getCoursesForOccupation(occupation.related_broad_field, 4) : Promise.resolve([]),
  ])

  const officialContent = getAuOfficialOccupationContent(occupation.anzsco_code)
  const curated = getOccupationDetailByAnzsco(occupation.anzsco_code) ?? getOccupationDetail(getAuOccupationSlug(occupation, occupations))
  // ANZSCO versions can change a code while retaining the occupation label.
  // Keep the hand-reviewed content for the six samples, but always show the
  // code from the current published occupation row.
  const baseDetail = curated
    ? { ...curated, anzscoCode: occupation.anzsco_code, name: occupation.occupation_en, nameKo: occupation.occupation_ko ?? curated.nameKo }
    : fallbackDetail(occupation)
  const detail = officialContent
    ? {
      ...baseDetail,
      description: officialContent.leadStatement || baseDetail.description,
      anzscoDescriptionUrl: officialContent.officialUrl,
      sources: [...new Set(["ABS OSCA", ...baseDetail.sources])],
    }
    : baseDetail

  return {
    occupation,
    occupations,
    detail,
    officialContent,
    states: (stateResult.data ?? []) as StateOccRow[],
    courses,
  }
}

export async function generateStaticParams() {
  const occupations = await getAllOccupations()
  return occupations.map((occupation) => ({ jobname: getAuOccupationSlug(occupation, occupations) }))
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { jobname } = await props.params
  const data = await getOccupationData(jobname)
  if (!data) return { title: "Occupation not found" }

  const { occupation, detail, occupations } = data
  const slug = getAuOccupationSlug(occupation, occupations)
  return pageMetadata({
    title: `${detail.name} — Australia Jobs, Salary & Skills | CampCareer`,
    description: `${detail.name} (OSCA ${detail.anzscoCode}) in Australia: available salary, shortage, regional and pathway data with source status.`,
    path: `/au/jobs/${slug}`,
  })
}

export default async function AuOccupationPage(props: { params: Promise<Params> }) {
  const { jobname } = await props.params
  const data = await getOccupationData(jobname)
  if (!data) notFound()

  const { occupation, occupations, detail, officialContent, states, courses } = data
  const slug = getAuOccupationSlug(occupation, occupations)

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Australia", path: "/au" },
        { name: "Jobs", path: "/au/jobs" },
        { name: detail.name, path: `/au/jobs/${slug}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: detail.name,
        occupationCategory: `OSCA ${detail.anzscoCode}`,
        description: detail.description,
        ...(occupation.median_salary_aud != null && {
          estimatedSalary: {
            "@type": "MonetaryAmount",
            currency: "AUD",
            value: occupation.median_salary_aud,
          },
        }),
        mainEntityOfPage: `https://www.campcareer.com/au/jobs/${slug}`,
      }} />

      <OccupationDetailClient
        detail={detail}
        salary={occupation.median_salary_aud}
        shortageRating={occupation.shortage_rating}
        onCSOL={occupation.on_csol}
        stateShortages={states.map((state) => ({ state: state.state, rating: state.shortage_rating }))}
        relatedCourses={courses.map((course) => ({
          id: course.id,
          title: course.title,
          courseUrl: course.course_url,
          durationYears: course.duration_years,
        }))}
        dataNote={buildDataNote(occupation)}
        officialContent={officialContent}
      />
    </>
  )
}
