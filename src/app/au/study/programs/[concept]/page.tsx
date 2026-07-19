import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { getStudyConcept, STUDY_CONCEPTS } from "@/data/study-concepts"
import { getAuVocationalProgramShortlistItem } from "@/data/au-vocational-program-shortlist"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { CourseOffering } from "@/lib/study-product/types"
import { aqfLabel } from "@/lib/au-universities"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 3600

const PAGE_SIZE = 10
const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"] as const

type Params = { concept: string }

type QualGroupKey = "certificate-diploma" | "bachelor" | "master"

type QualificationGroup = {
  key: QualGroupKey
  label: string
  aqfLevels: number[]
  count: number
}

type CourseRow = {
  id: string
  title: string
  courseCode: string | null
  aqfLevel: number | null
  courseType: string | null
  durationYears: number | null
  tuitionFeeAud: number | null
  officialUrl: string
  sourceLabel: string
  eligibilityNote: string | null
  providerName: string
  campus: string | null
  state: string | null
  syncedAt: string
}

const QUAL_GROUPS: { key: QualGroupKey; label: string; aqfLevels: number[] }[] = [
  { key: "certificate-diploma", label: "Certificate & Diploma", aqfLevels: [1, 2, 3, 4, 5, 6] },
  { key: "bachelor", label: "Bachelor", aqfLevels: [7] },
  { key: "master", label: "Master", aqfLevels: [8, 9, 10] },
]

function isQualGroupKey(v: string | undefined): v is QualGroupKey {
  return !!v && QUAL_GROUPS.some((g) => g.key === v)
}

function groupCourses(courses: CourseRow[]): QualificationGroup[] {
  return QUAL_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    aqfLevels: group.aqfLevels,
    count: courses.filter((c) => c.aqfLevel != null && group.aqfLevels.includes(c.aqfLevel)).length,
  })).filter((g) => g.count > 0)
}

function filterByGroup(courses: CourseRow[], key: QualGroupKey | null): CourseRow[] {
  if (!key) return courses
  const group = QUAL_GROUPS.find((g) => g.key === key)
  if (!group) return courses
  return courses.filter((c) => c.aqfLevel != null && group.aqfLevels.includes(c.aqfLevel))
}

function filterByState(courses: CourseRow[], state: string | null): CourseRow[] {
  if (!state) return courses
  const upper = state.toUpperCase()
  return courses.filter((c) => c.state?.toUpperCase() === upper)
}

export function generateStaticParams() {
  return STUDY_CONCEPTS.map((concept) => ({ concept: concept.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { concept: slug } = await params
  const concept = getStudyConcept(slug)
  if (!concept) return { title: "Program not found" }
  return pageMetadata({
    title: `${concept.label} programs in Australia — Official course sources`,
    description: `Browse ${concept.label} programs across qualification levels in Australia. Compare active CRICOS courses and reviewed official provider or national training-register pathways.`,
    path: `/au/study/programs/${concept.slug}`,
  })
}

async function fetchCourses(conceptId: string): Promise<CourseRow[]> {
  const concept = getStudyConcept(conceptId)
  if (!concept) return []

  const searchTerm = concept.roiSearchTerm.replace(/[%_]/g, "")

  let { data, error } = await supabaseAdmin
    .from("courses_au")
    .select(
      "id, institution_id, course_code, title, field_name, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url, synced_at",
    )
    .ilike("field_name", `%${searchTerm}%`)
    .not("cricos_url", "is", null)
    .eq("cricos_status", "active")
    .order("aqf_level", { ascending: true, nullsFirst: true })
    .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
    .limit(80)

  if (!error && (!data || data.length === 0)) {
    const fallback = await supabaseAdmin
      .from("courses_au")
      .select(
        "id, institution_id, course_code, title, field_name, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url, synced_at",
      )
      .ilike("title", `%${searchTerm}%`)
      .not("cricos_url", "is", null)
      .eq("cricos_status", "active")
      .order("aqf_level", { ascending: true, nullsFirst: true })
      .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
      .limit(80)
    data = fallback.data
    error = fallback.error
  }

  const registryCourses = error || !data?.length ? [] : await mapRegistryCourses(data)
  const vocationalProgram = getAuVocationalProgramShortlistItem(concept.id)
  const curatedCourse = vocationalProgram ? mapVocationalProgram(vocationalProgram) : null

  // Trade and apprenticeship programmes are often not CRICOS offerings, so
  // they do not appear in the international-course table. Keep a separately
  // verified official provider/training-register source instead of showing 0.
  return [
    ...(curatedCourse ? [curatedCourse] : []),
    ...registryCourses,
  ].filter((course, index, all) => all.findIndex((other) => other.officialUrl === course.officialUrl || (other.courseCode && other.courseCode === course.courseCode && other.providerName === course.providerName)) === index)
}

async function mapRegistryCourses(data: Array<Record<string, unknown>>): Promise<CourseRow[]> {
  const providerIds = Array.from(new Set(data.map((row) => row.institution_id as string)))
  const { data: providers } = await supabaseAdmin
    .from("colleges_au")
    .select("institution_id, name, state, city")
    .in("institution_id", providerIds)
  const providerById = new Map((providers ?? []).map((p) => [p.institution_id as string, p]))

  return data.map((row) => {
    const provider = providerById.get(row.institution_id as string)
    return {
      id: String(row.id),
      title: row.title as string,
      courseCode: row.course_code as string | null,
      aqfLevel: row.aqf_level as number | null,
      courseType: row.course_type as string | null,
      durationYears: row.duration_years as number | null,
      tuitionFeeAud: row.tuition_fee_aud as number | null,
      officialUrl: row.cricos_url as string,
      sourceLabel: "Australian Government CRICOS",
      eligibilityNote: null,
      providerName: (provider?.name as string | undefined) ?? humanizeSlug(row.institution_id as string),
      campus: [provider?.city, provider?.state].filter(Boolean).join(", ") || null,
      state: (provider?.state as string | null) ?? null,
      syncedAt: String(row.synced_at ?? "2026-04-01"),
    }
  })
}

function mapVocationalProgram(program: CourseOffering): CourseRow {
  return {
    id: program.id,
    title: program.title,
    courseCode: program.courseCode ?? null,
    aqfLevel: aqfLevelFromQualification(program.qualificationLevel),
    courseType: program.qualificationLevel ?? null,
    durationYears: program.durationMonths ? program.durationMonths / 12 : null,
    tuitionFeeAud: program.tuitionCurrency === "AUD" ? program.tuitionAmount ?? null : null,
    officialUrl: program.officialUrl,
    sourceLabel: program.sourceName,
    eligibilityNote: program.eligibilityNote ?? null,
    providerName: program.providerName,
    campus: program.campus ?? null,
    state: program.campus?.match(/\b(ACT|NSW|NT|QLD|SA|TAS|VIC|WA)\b/)?.[1] ?? null,
    syncedAt: program.lastVerifiedAt,
  }
}

function aqfLevelFromQualification(value: string | undefined) {
  if (!value) return null
  if (/certificate\s+i\b/i.test(value)) return 1
  if (/certificate\s+ii\b/i.test(value)) return 2
  if (/certificate\s+iii\b/i.test(value)) return 3
  if (/certificate\s+iv\b/i.test(value)) return 4
  if (/graduate certificate/i.test(value)) return 8
  if (/graduate diploma/i.test(value)) return 8
  if (/advanced diploma/i.test(value)) return 6
  if (/diploma/i.test(value)) return 5
  if (/bachelor/i.test(value)) return 7
  if (/master/i.test(value)) return 9
  return null
}

export default async function AuStudyProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<{ level?: string; state?: string; page?: string }>
}) {
  const { concept: slug } = await params
  const sp = await searchParams
  const concept = getStudyConcept(slug)
  if (!concept) notFound()

  const allCourses = await fetchCourses(concept.id)
  const activeLevel = isQualGroupKey(sp.level) ? sp.level : null
  const activeState = sp.state && AU_STATES.includes(sp.state.toUpperCase() as typeof AU_STATES[number])
    ? sp.state.toUpperCase()
    : null
  const currentPage = Math.max(1, Number(sp.page) || 1)

  const afterGroup = filterByGroup(allCourses, activeLevel)
  const afterState = filterByState(afterGroup, activeState)
  const filteredCourses = afterState

  const groups = groupCourses(allCourses)
  const statesInData = [...new Set(allCourses.map((c) => c.state).filter((s): s is string => !!s))].sort()

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedCourses = filteredCourses.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function buildHref(opts: { level?: string | null; state?: string | null; page?: number }) {
    const parts: string[] = []
    const level = opts.level !== undefined ? opts.level : activeLevel
    const state = opts.state !== undefined ? opts.state : activeState
    const page = opts.page ?? 1
    if (level) parts.push(`level=${encodeURIComponent(level)}`)
    if (state) parts.push(`state=${encodeURIComponent(state)}`)
    if (page > 1) parts.push(`page=${page}`)
    const qs = parts.length ? `?${parts.join("&")}` : ""
    return `/au/study/programs/${concept!.slug}${qs}`
  }

  const activeGroup = activeLevel ? QUAL_GROUPS.find((g) => g.key === activeLevel) : null

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <Link
            href={`/au/majors/${concept.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {concept.label}
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-blue-600">
                Australia · Official programme sources
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {concept.label} programs
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Browse {concept.label} courses across all qualification levels.
                We show active CRICOS offerings plus reviewed official provider
                and national training-register pathways where CRICOS does not
                cover an apprenticeship or domestic trade route.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <BadgeCheck className="h-5 w-5" />
              {filteredCourses.length} official programme source{filteredCourses.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Qualification level cards */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Browse by qualification level
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={buildHref({ level: null, page: 1 })}
              className={`flex items-center justify-between rounded-2xl p-4 transition ${
                activeLevel == null
                  ? "border-2 border-blue-600 bg-blue-50"
                  : "border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div>
                <p className={`text-sm font-bold ${activeLevel == null ? "text-blue-700" : "text-slate-700"}`}>
                  All levels
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{allCourses.length}</p>
              </div>
              {activeLevel == null ? (
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">Selected</span>
              ) : (
                <ArrowRight className="h-5 w-5 text-slate-400" />
              )}
            </Link>
            {groups.map((group) => {
              const isActive = activeLevel === group.key
              return (
                <Link
                  key={group.key}
                  href={buildHref({ level: group.key, page: 1 })}
                  className={`flex items-center justify-between rounded-2xl p-4 transition ${
                    isActive
                      ? "border-2 border-blue-600 bg-blue-50"
                      : "border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-bold ${isActive ? "text-blue-700" : "text-slate-700"}`}>
                      {group.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">{group.count}</p>
                  </div>
                  {isActive ? (
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">Selected</span>
                  ) : (
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* State filter */}
        {statesInData.length > 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700">Filter by state</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href={buildHref({ state: null, page: 1 })}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  activeState == null
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                }`}
              >
                All states
              </Link>
              {statesInData.map((s) => (
                <Link
                  key={s}
                  href={buildHref({ state: s, page: 1 })}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    activeState === s
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Active filters summary */}
        {(activeGroup || activeState) && (
          <p className="mb-6 text-sm font-semibold text-blue-700">
            Showing {filteredCourses.length} program{filteredCourses.length !== 1 ? "s" : ""}
            {activeGroup ? ` in ${activeGroup.label}` : ""}
            {activeState ? ` · ${activeState}` : ""}
          </p>
        )}

        {/* Course cards */}
        {paginatedCourses.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {paginatedCourses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      {course.courseType ??
                        (course.aqfLevel != null ? aqfLabel(course.aqfLevel) : "Course")}
                    </p>
                    <h3 className="mt-2 text-xl font-bold leading-7 text-slate-950">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {course.providerName}
                    </p>
                  </div>
                  <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-600" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <CourseFact icon={GraduationCap} label="Official code" value={course.courseCode ?? "—"} />
                  <CourseFact
                    icon={Clock3}
                    label="Duration"
                    value={course.durationYears ? `${course.durationYears} year${course.durationYears !== 1 ? "s" : ""}` : "Check provider"}
                  />
                  <CourseFact icon={MapPin} label="Campus" value={course.campus ?? "Check provider"} />
                  <CourseFact
                    icon={GraduationCap}
                    label="Annual tuition"
                    value={course.tuitionFeeAud ? `A$${Math.round(course.tuitionFeeAud).toLocaleString()}` : "Check official page"}
                  />
                </div>

                <div className="mt-5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-800">
                  <strong>{course.sourceLabel}</strong> · Checked {formatDate(course.syncedAt)}
                </div>

                {course.eligibilityNote && <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">{course.eligibilityNote}</p>}

                <a
                  href={course.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Open official programme page
                  <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No verified programs found
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              {(activeLevel || activeState)
                ? `No verified ${activeGroup?.label ?? concept.label} programs${activeState ? ` in ${activeState}` : ""} are currently available. Try different filters or check the official registry.`
                : `No official ${concept.label} programme source is available yet. Check the national registry while we add a provider-verified pathway.`}
            </p>
            <a href="https://cricos.education.gov.au/Course/CourseSearch.aspx" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">Search CRICOS <ExternalLink className="h-4 w-4" /></a>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-1">
            {safePage > 1 && (
              <Link
                href={buildHref({ page: safePage - 1 })}
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
              .reduce<(number | "dots")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("dots")
                acc.push(p)
                return acc
              }, [])
              .map((item, i) =>
                item === "dots" ? (
                  <span key={`dots-${i}`} className="px-2 text-sm text-slate-400">
                    …
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={buildHref({ page: item })}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                      item === safePage
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    {item}
                  </Link>
                ),
              )}
            {safePage < totalPages && (
              <Link
                href={buildHref({ page: safePage + 1 })}
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </nav>
        )}

        {/* Next step CTA */}
        <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm font-bold text-blue-700">Next step</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Ready to prepare an application?
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
            Request help from a verified school or agent only after you have
            reviewed your shortlist and budget. Partner fees never affect course
            or country ranking.
          </p>
          <Link
            href={`/support/request?concept=${encodeURIComponent(concept.id)}&country=AU`}
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
          >
            Request application support
          </Link>
        </section>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          CampCareer is an information and planning tool and does not guarantee
          admission, visa or qualification eligibility. Verify requirements with
          the provider and official authority before applying.
        </div>
      </section>
    </main>
  )
}

function CourseFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <Icon className="h-4 w-4 text-blue-600" />
      <p className="mt-2 text-[11px] font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{value}</p>
    </div>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value.slice(0, 10)
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date)
}

function humanizeSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ")
}
