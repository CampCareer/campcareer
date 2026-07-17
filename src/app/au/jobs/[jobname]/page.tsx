import "server-only"
import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getCoursesForOccupation } from "@/lib/occupations-au"
import { getAuOccupationSlug, slugifyAuOccupation } from "@/lib/au-occupation-slug"
import { getAuOfficialOccupationContent } from "@/lib/au-osca-content"
import { getAuJsaOslRatings } from "@/lib/au-jsa-osl"
import { getAuCareerTaxonomy } from "@/lib/au-career-taxonomy"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { getOccupationDetail, getOccupationDetailByAnzsco, type OccupationDetail } from "./sample-data"
import { OccupationDetailClient } from "./OccupationDetail"

export const revalidate = 86400
export const dynamicParams = true

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
  anzsco_v13: string | null
}

type StateOccRow = {
  anzsco_code: string
  state: string
  shortage_rating: number
}

type JsaProfile = {
  employment_total: number | null
  part_time_share_pct: number | null
  female_share_pct: number | null
  median_age: number | null
  full_time_share_pct: number | null
  average_full_time_hours: number | null
  state_distribution: { name: string; share: number }[]
  education_distribution: { name: string; share: number }[]
  industries: { name: string; share?: number }[]
}

type JsaPathway = { qualification_code: string; qualification_title: string; pathway_type: string; licensing_required: boolean; licensing_may_be_required: boolean }
type JsaDriver = { shortage_driver: string }
type JsaVacancy = { state: string; period: string; vacancy_count: number | null; index_value: number | null; series: string }
type JsaOutlook = { period_start: string; period_end: string; employment_start: number | null; employment_end: number | null; employment_change: number | null; employment_change_pct: number | null; geography: string }
type JsaRegionalEmployment = { state: string | null; sa4_name: string | null; employment_total: number | null; annual_change: number | null; annual_change_pct: number | null }
type JsaMobilityFlow = { financial_year: string; recent_anzsco_v13: string; worker_count: number; recent_occupation_title: string | null }
type JsaMobilityStock = { financial_year: string; worker_stock: number; stock_delta: number | null; inflow: number | null; outflow: number | null }
type MobilityPath = { oscaCode: string; title: string; href: string; workerCount: number; nationalShortage: string | null; outlook2035Pct: number | null; onCsol: boolean }

function normaliseOccupationLabel(value: string | null | undefined) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function selectMappedOccupation(flow: JsaMobilityFlow, occupations: OccRow[]): OccRow | null {
  const candidates = occupations.filter((item) => item.anzsco_v13 === flow.recent_anzsco_v13)
  if (candidates.length === 0) return null
  const sourceTitle = normaliseOccupationLabel(flow.recent_occupation_title)
  return candidates.find((item) => normaliseOccupationLabel(item.occupation_en) === sourceTitle)
    ?? candidates.find((item) => normaliseOccupationLabel(item.occupation_en).includes(sourceTitle) || sourceTitle.includes(normaliseOccupationLabel(item.occupation_en)))
    ?? candidates[0]
}

async function getAllOccupationsUncached(): Promise<OccRow[]> {
  const { data, error } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, anzsco_v13, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, related_broad_field, confidence, source_name, source_url, last_verified")
    .not("anzsco_code", "is", null)
    .order("occupation_en")

  if (error) {
    console.error("[au-jobs] occupations failed:", error.message)
    return []
  }

  return (data ?? []) as OccRow[]
}

// The list is reused by every occupation detail page. Cache it independently
// so a new or revalidated detail page does not scan all 600 occupations again.
const getAllOccupations = unstable_cache(
  getAllOccupationsUncached,
  ["au-job-occupations"],
  { revalidate: 86400, tags: ["au-job-occupations"] },
)

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
    occupation.confidence ? `Data confidence: ${occupation.confidence}.` : null,
    !occupation.on_csol ? "A missing CSOL flag is not a finding of visa ineligibility; check the current Home Affairs list." : null,
  ].filter(Boolean)
  return details.join(" ") || null
}

async function getOccupationDataUncached(jobname: string) {
  const occupations = await getAllOccupations()
  const occupation = findOccupation(jobname, occupations)
  if (!occupation) return null

  const anzsco = occupation.anzsco_v13 ?? occupation.anzsco_code
  const unitGroup = anzsco.slice(0, 4)
  const [stateResult, courses, profileResult, pathwayResult, driverResult, vacancyResult, outlookResult, regionalResult, mobilityFlowsResult, mobilityStockResult] = await Promise.all([
    supabaseAdmin
      .from("occupation_state_au")
      .select("anzsco_code, state, shortage_rating")
      .eq("anzsco_code", occupation.anzsco_code),
    occupation.related_broad_field ? getCoursesForOccupation(occupation.related_broad_field, 4) : Promise.resolve([]),
    supabaseAdmin.from("occupation_profiles_au").select("employment_total, part_time_share_pct, female_share_pct, median_age, full_time_share_pct, average_full_time_hours, state_distribution, education_distribution, industries").eq("anzsco_v13", anzsco).maybeSingle(),
    supabaseAdmin.from("occupation_pathways_au").select("qualification_code, qualification_title, pathway_type, licensing_required, licensing_may_be_required").eq("osca_code", occupation.anzsco_code).order("pathway_type"),
    supabaseAdmin.from("occupation_shortage_drivers_au").select("shortage_driver").eq("anzsco_unit_group", unitGroup).maybeSingle(),
    supabaseAdmin.from("occupation_vacancies_au").select("state, period, vacancy_count, index_value, series").eq("anzsco_unit_group", unitGroup).eq("series", "three_month_average").order("period", { ascending: false }).limit(24),
    supabaseAdmin.from("occupation_outlook_au").select("period_start, period_end, employment_start, employment_end, employment_change, employment_change_pct, geography").eq("anzsco_unit_group", unitGroup).eq("geography", "AU").order("period_end"),
    supabaseAdmin.from("occupation_regional_employment_au").select("state, sa4_name, employment_total, annual_change, annual_change_pct").eq("anzsco_unit_group", unitGroup).eq("period", "2026-06-15").order("employment_total", { ascending: false }).limit(5),
    supabaseAdmin.from("occupation_mobility_flows_au").select("financial_year, recent_anzsco_v13, worker_count, recent_occupation_title").eq("previous_anzsco_v13", anzsco).eq("financial_year", "2020_2021").order("worker_count", { ascending: false }).limit(40),
    supabaseAdmin.from("occupation_mobility_stocks_au").select("financial_year, worker_stock, stock_delta, inflow, outflow").eq("anzsco_v13", anzsco).order("financial_year", { ascending: false }).limit(1).maybeSingle(),
  ])

  const officialContent = getAuOfficialOccupationContent(occupation.anzsco_code)
  const jsaRatings = getAuJsaOslRatings(occupation.anzsco_code)
  const careerCategory = getAuCareerTaxonomy(occupation.anzsco_code)?.category ?? null
  const mappedMobility = ((mobilityFlowsResult.data ?? []) as JsaMobilityFlow[])
    .flatMap((flow) => {
      const destination = selectMappedOccupation(flow, occupations)
      return destination ? [{ flow, destination }] : []
    })
    .filter(({ destination }, index, routes) => routes.findIndex((route) => route.destination.anzsco_code === destination.anzsco_code) === index)
    .slice(0, 5)
  const mobilityUnitGroups = [...new Set(mappedMobility.map(({ destination }) => (destination.anzsco_v13 ?? "").slice(0, 4)).filter(Boolean))]
  const mobilityOutlookResult = mobilityUnitGroups.length > 0
    ? await supabaseAdmin.from("occupation_outlook_au").select("anzsco_unit_group, employment_change_pct").in("anzsco_unit_group", mobilityUnitGroups).eq("geography", "AU").eq("period_end", "2035-05-01")
    : { data: [] as { anzsco_unit_group: string; employment_change_pct: number | null }[] }
  const mobilityOutlookByUnitGroup = new Map((mobilityOutlookResult.data ?? []).map((item) => [item.anzsco_unit_group, item.employment_change_pct]))
  const mobilityPaths: MobilityPath[] = mappedMobility.map(({ flow, destination }) => ({
    oscaCode: destination.anzsco_code,
    title: destination.occupation_en,
    href: "/au/jobs/" + getAuOccupationSlug(destination, occupations),
    workerCount: flow.worker_count,
    nationalShortage: getAuJsaOslRatings(destination.anzsco_code)?.nationalRating ?? null,
    outlook2035Pct: mobilityOutlookByUnitGroup.get((destination.anzsco_v13 ?? "").slice(0, 4)) ?? null,
    onCsol: destination.on_csol,
  }))
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
    detail: (jsaRatings || mobilityPaths.length > 0 || mobilityStockResult.data)
      ? { ...detail, sources: [...new Set([...(jsaRatings ? ["Jobs and Skills Australia OSL"] : []), ...(mobilityPaths.length > 0 || mobilityStockResult.data ? ["Jobs and Skills Australia DOM"] : []), ...detail.sources])] }
      : detail,
    officialContent,
    careerCategory,
    jsaRatings,
    states: (stateResult.data ?? []) as StateOccRow[],
    courses,
    jsaProfile: profileResult.data as JsaProfile | null,
    jsaPathways: (pathwayResult.data ?? []) as JsaPathway[],
    jsaDriver: driverResult.data as JsaDriver | null,
    jsaVacancies: (vacancyResult.data ?? []) as JsaVacancy[],
    jsaOutlook: (outlookResult.data ?? []) as JsaOutlook[],
    jsaRegionalEmployment: (regionalResult.data ?? []) as JsaRegionalEmployment[],
    jsaMobility: {
      stock: mobilityStockResult.data as JsaMobilityStock | null,
      paths: mobilityPaths,
    },
  }
}

// Keep occupation detail data out of the hot request path. The React cache
// deduplicates generateMetadata and the page render within a request, while
// the persistent cache shares the result across visitors for 24 hours.
const getOccupationData = cache(async (jobname: string) => unstable_cache(
  () => getOccupationDataUncached(jobname),
  ["au-job-detail", jobname],
  { revalidate: 86400, tags: ["au-job-detail", `au-job:${jobname}`] },
)())

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

  const { occupation, occupations, detail, officialContent, jsaRatings, states, courses, jsaProfile, jsaPathways, jsaDriver, jsaVacancies, jsaOutlook, jsaRegionalEmployment, jsaMobility } = data
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
        nationalJsaRating={jsaRatings?.nationalRating ?? null}
        onCSOL={occupation.on_csol}
        stateShortages={jsaRatings
          ? Object.entries(jsaRatings.stateRatings).map(([state, jsaRating]) => ({ state, jsaRating }))
          : states.map((state) => ({ state: state.state, rating: state.shortage_rating }))}
        relatedCourses={courses.map((course) => ({
          id: course.id,
          title: course.title,
          officialCourseUrl: course.official_url_status === "verified" ? course.official_course_url : null,
          cricosUrl: course.cricos_url,
          durationYears: course.duration_years,
          aqfLevel: course.aqf_level,
        }))}
        universityRoiHref={occupation.related_broad_field ? `/au/study?field=${encodeURIComponent(occupation.related_broad_field)}` : null}
        dataNote={buildDataNote(occupation)}
        officialContent={officialContent}
        careerCategory={data.careerCategory}
        jsaProfile={jsaProfile}
        jsaPathways={jsaPathways}
        shortageDriver={jsaDriver?.shortage_driver ?? null}
        vacancies={jsaVacancies}
        outlook={jsaOutlook}
        regionalEmployment={jsaRegionalEmployment}
        mobility={jsaMobility}
      />
    </>
  )
}
