import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock3,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { getStudyConcept, STUDY_CONCEPTS } from "@/data/study-concepts"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getOfficialCourseRegistry } from "@/lib/study-product/course-offerings"
import { aqfLabel } from "@/lib/au-universities"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 3600

type Params = { concept: string }

type QualificationGroup = {
  aqfLevel: number
  label: string
  count: number
  courses: CourseRow[]
}

type CourseRow = {
  id: string
  title: string
  courseCode: string | null
  aqfLevel: number | null
  courseType: string | null
  durationYears: number | null
  tuitionFeeAud: number | null
  cricosUrl: string | null
  providerName: string
  campus: string | null
  syncedAt: string
}

const AQF_GROUPS: { aqfLevels: number[]; label: string; shortLabel: string }[] = [
  { aqfLevels: [1, 2, 3, 4], label: "Certificate I–IV", shortLabel: "Certificate" },
  { aqfLevels: [5], label: "Diploma", shortLabel: "Diploma" },
  { aqfLevels: [6], label: "Advanced Diploma", shortLabel: "Adv. Diploma" },
  { aqfLevels: [7], label: "Bachelor", shortLabel: "Bachelor" },
  { aqfLevels: [8], label: "Graduate Certificate / Diploma", shortLabel: "Grad. Cert/Dip" },
  { aqfLevels: [9, 10], label: "Master / Doctoral", shortLabel: "Master" },
]

export function generateStaticParams() {
  return STUDY_CONCEPTS.map((concept) => ({ concept: concept.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { concept: slug } = await params
  const concept = getStudyConcept(slug)
  if (!concept) return { title: "Program not found" }
  return pageMetadata({
    title: `${concept.label} programs in Australia — Verified CRICOS courses`,
    description: `Browse verified ${concept.label} programs across qualification levels in Australia. Compare diploma, bachelor, master and certificate courses from CRICOS-registered providers.`,
    path: `/au/study/programs/${concept.slug}`,
  })
}

async function fetchCourses(conceptId: string): Promise<CourseRow[]> {
  const concept = getStudyConcept(conceptId)
  if (!concept) return []

  const searchTerm = concept.roiSearchTerm

  let { data, error } = await supabaseAdmin
    .from("courses_au")
    .select(
      "id, institution_id, course_code, title, field_name, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url, synced_at",
    )
    .ilike("field_name", `%${searchTerm.replace(/[%_]/g, "")}%`)
    .not("cricos_url", "is", null)
    .eq("cricos_status", "active")
    .order("aqf_level", { ascending: true, nullsFirst: true })
    .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
    .limit(60)

  if (!error && (!data || data.length === 0)) {
    const fallback = await supabaseAdmin
      .from("courses_au")
      .select(
        "id, institution_id, course_code, title, field_name, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url, synced_at",
      )
      .ilike("title", `%${searchTerm.replace(/[%_]/g, "")}%`)
      .not("cricos_url", "is", null)
      .eq("cricos_status", "active")
      .order("aqf_level", { ascending: true, nullsFirst: true })
      .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
      .limit(60)
    data = fallback.data
    error = fallback.error
  }

  if (error || !data?.length) return []

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
      cricosUrl: row.cricos_url as string,
      providerName: (provider?.name as string | undefined) ?? humanizeSlug(row.institution_id as string),
      campus: [provider?.city, provider?.state].filter(Boolean).join(", ") || null,
      syncedAt: String(row.synced_at ?? "2026-04-01"),
    }
  })
}

function groupByQualification(courses: CourseRow[]): QualificationGroup[] {
  return AQF_GROUPS.map((group) => {
    const matched = courses.filter(
      (c) => c.aqfLevel != null && group.aqfLevels.includes(c.aqfLevel),
    )
    return {
      aqfLevel: group.aqfLevels[0],
      label: group.label,
      count: matched.length,
      courses: matched,
    }
  }).filter((g) => g.count > 0)
}

export default async function AuStudyProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<{ level?: string }>
}) {
  const { concept: slug } = await params
  const sp = await searchParams
  const concept = getStudyConcept(slug)
  if (!concept) notFound()

  const allCourses = await fetchCourses(concept.id)
  const groups = groupByQualification(allCourses)
  const registry = getOfficialCourseRegistry("AU")

  const activeLevel = sp.level
    ? Number(sp.level)
    : null

  const displayCourses = activeLevel != null
    ? allCourses.filter((c) => c.aqfLevel === activeLevel)
    : allCourses

  const activeGroup = activeLevel != null
    ? groups.find((g) => g.aqfLevel === activeLevel)
    : null

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
                Australia · Verified CRICOS programs
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {concept.label} programs
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Browse verified {concept.label} courses across all qualification
                levels. Only offerings traceable to the official CRICOS registry
                are shown. Confirm current intake and eligibility directly with
                the provider.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <BadgeCheck className="h-5 w-5" />
              {allCourses.length} verified programs
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {groups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-950">
              Browse by qualification level
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a level to filter verified programs.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeLevel == null && (
                <Link
                  href={`/au/study/programs/${concept.slug}`}
                  className="flex items-center justify-between rounded-2xl border-2 border-blue-600 bg-blue-50 p-4 transition hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-bold text-blue-700">All levels</p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">
                      {allCourses.length}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    Selected
                  </span>
                </Link>
              )}
              {activeLevel != null && (
                <Link
                  href={`/au/study/programs/${concept.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
                      All levels
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">
                      {allCourses.length}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </Link>
              )}
              {groups.map((group) => {
                const isActive = activeLevel === group.aqfLevel
                return (
                  <Link
                    key={group.aqfLevel}
                    href={`/au/study/programs/${concept.slug}?level=${group.aqfLevel}`}
                    className={`flex items-center justify-between rounded-2xl p-4 transition ${
                      isActive
                        ? "border-2 border-blue-600 bg-blue-50"
                        : "border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-bold ${isActive ? "text-blue-700" : "text-slate-700"}`}
                      >
                        {group.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-950">
                        {group.count}
                      </p>
                    </div>
                    {isActive ? (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                        Selected
                      </span>
                    ) : (
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {activeGroup && (
          <p className="mb-6 text-sm font-semibold text-blue-700">
            Showing {activeGroup.count} {activeGroup.label} programs
          </p>
        )}

        {displayCourses.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {displayCourses.map((course) => (
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
                  <CourseFact
                    icon={GraduationCap}
                    label="Official code"
                    value={course.courseCode ?? "—"}
                  />
                  <CourseFact
                    icon={Clock3}
                    label="Duration"
                    value={
                      course.durationYears
                        ? `${course.durationYears} years`
                        : "Check provider"
                    }
                  />
                  <CourseFact
                    icon={MapPin}
                    label="Campus"
                    value={course.campus ?? "Check provider"}
                  />
                  <CourseFact
                    icon={GraduationCap}
                    label="Annual tuition"
                    value={
                      course.tuitionFeeAud
                        ? `A$${Math.round(course.tuitionFeeAud).toLocaleString()}`
                        : "Check official page"
                    }
                  />
                </div>

                <div className="mt-5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-800">
                  <strong>Australian Government CRICOS</strong> · Verified{" "}
                  {formatDate(course.syncedAt)}
                </div>

                <a
                  href={course.cricosUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Open official course page
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
              {activeLevel != null
                ? `No verified ${activeGroup?.label ?? "qualifications"} are currently available for ${concept.label}. Try browsing all levels or check the official registry.`
                : `No verified ${concept.label} programs are available yet. Use the official registry below for the current catalogue.`}
            </p>
            {registry && (
              <a
                href={registry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
              >
                {registry.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

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
      <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
        {value}
      </p>
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
