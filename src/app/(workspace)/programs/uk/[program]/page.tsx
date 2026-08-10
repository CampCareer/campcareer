import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Building2, CalendarClock, Clock3, GraduationCap, ShieldCheck } from "lucide-react"
import { getUkProgramBySlug } from "@/lib/programs/uk-programs.server"
import { isIndexableUkProgramSlug, ukProgramDetailPath } from "@/lib/programs/uk-program-seo"
import { institutionDetailPath } from "@/lib/institutions/institution-search"
import { SITE_URL } from "@/lib/seo-routes.mjs"

type Params = { params: Promise<{ program: string }> }

function safeSlug(value: string) {
  const slug = value.trim().toLowerCase()
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null
}

function safeUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
  } catch {
    return null
  }
}

function durationLabel(months: number | null) {
  if (!months) return "Not published"
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}

function humanize(value: string | null) {
  if (!value) return "Not published"
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function admissionCopy(status: string) {
  if (status === "open") return {
    label: "Applications open",
    body: "A current programme or admission source supports an open application window. Recheck the official page before applying because deadlines can change.",
    className: "border-[#cfe0c9] bg-[#f4f9f2] text-[#37672c]",
  }
  if (status === "closed") return {
    label: "Verified application cycle closed",
    body: "The programme remains in the catalogue, but the verified application state is closed. CampCareer does not infer a future intake from programme existence alone.",
    className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]",
  }
  if (status === "not_yet_open") return {
    label: "Next cycle not yet open",
    body: "A future intake or application cycle is source-backed, but applications are not yet open.",
    className: "border-[#d9e3f7] bg-[#f7f9ff] text-[#315f9f]",
  }
  if (status === "restricted") return {
    label: "Applicant restrictions apply",
    body: "The current source limits this pathway to a defined applicant group. Programme existence remains separate from admission eligibility.",
    className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]",
  }
  return {
    label: "Current application window not confirmed",
    body: "The programme and international-study context are source-backed, but CampCareer has not inferred that applications are open today.",
    className: "border-[#d9e3f7] bg-[#f7f9ff] text-[#315f9f]",
  }
}

async function loadProgram(segment: string) {
  const slug = safeSlug(segment)
  return slug ? getUkProgramBySlug(slug) : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) return { title: "Program not found", robots: { index: false, follow: false } }
  const canonical = ukProgramDetailPath(program.slug)
  const indexable = program.indexable && isIndexableUkProgramSlug(program.slug)
  return {
    title: `${program.title} · ${program.institutionName}`,
    description: `${program.title} at ${program.institutionName}. Programme source, international-student eligibility, Student sponsor evidence and application timing are tracked separately.`,
    alternates: { canonical: `${SITE_URL}${canonical}` },
    robots: { index: indexable, follow: true },
  }
}

export default async function UkProgramDetailPage({ params }: Params) {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) notFound()
  const canonicalPath = ukProgramDetailPath(program.slug)
  if (segment !== program.slug) permanentRedirect(canonicalPath)

  const admission = admissionCopy(program.admissionState)
  const institutionPath = institutionDetailPath("UK", program.institutionSlug)
  const officialUrl = safeUrl(program.officialProgramUrl)
  const qualificationUrl = safeUrl(program.officialQualificationUrl)
  const internationalUrl = safeUrl(program.internationalSourceUrl)
  const sponsorUrl = safeUrl(program.sponsorSourceUrl)
  const admissionUrl = safeUrl(program.admissionSourceUrl)

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/programs?country=UK" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]"><ArrowLeft className="size-3.5" /> Back to UK programmes</Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <main className="min-w-0">
          <header className="rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f4f8f2] via-white to-[#eef4ff] p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 text-[10.5px] font-semibold">
              <span className="rounded-full bg-white px-3 py-1">{program.qualificationTitle ?? humanize(program.canonicalLevel)}</span>
              {program.indexable ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />Programme source verified</span>
              ) : (
                <span className="rounded-full bg-[#faf4e8] px-3 py-1 text-[#8a651f]">International eligibility review needed</span>
              )}
            </div>
            <h1 className="mt-5 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#1b1b1b] sm:text-[36px]">{program.title}</h1>
            <Link href={institutionPath} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4f4d48] hover:text-[#3e7a2e] hover:underline"><Building2 className="size-4" />{program.institutionName}</Link>
            {program.fieldName && <p className="mt-3 text-[12px] text-[#77746e]">{program.fieldName}</p>}
          </header>

          <section className={`mt-5 rounded-xl border p-5 ${admission.className}`}>
            <h2 className="text-[14.5px] font-semibold">{admission.label}</h2>
            <p className="mt-2 text-[12px] leading-5">{admission.body}</p>
            {program.intakeLabel && <p className="mt-3 text-[11px] font-semibold">Intake: {program.intakeLabel}</p>}
            {program.applicationDeadline && <p className="mt-1 text-[11px]">Application deadline: {program.applicationDeadline}</p>}
          </section>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric icon={<GraduationCap className="size-4" />} label="Qualification" value={program.qualificationTitle ?? humanize(program.canonicalLevel)} />
            <Metric icon={<Clock3 className="size-4" />} label="Duration" value={durationLabel(program.durationMonths)} />
            <Metric icon={<Building2 className="size-4" />} label="Study mode" value={program.studyMode ?? "Confirm with provider"} />
            <Metric icon={<CalendarClock className="size-4" />} label="Application state" value={humanize(program.admissionState)} />
          </div>

          <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <h2 className="text-[14.5px] font-semibold">International-study evidence</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Evidence label="International students" value={program.internationalStudentsEligible === true ? "Eligible" : program.internationalStudentsEligible === false ? "Not eligible" : "Needs programme-level review"} />
              <Evidence label="Student sponsor evidence" value={program.studentSponsorEligible === true ? "Confirmed" : program.studentSponsorEligible === false ? "Not confirmed" : "Not resolved"} />
            </div>
            <p className="mt-4 text-[10.5px] leading-5 text-[#8f8c85]">A Confirmation of Acceptance for Studies (CAS) is student-specific post-offer evidence. CampCareer does not infer CAS availability as a static programme attribute.</p>
          </section>

          {program.occupationRelations.length > 0 && (
            <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
              <h2 className="text-[14.5px] font-semibold">Related CampCareer careers</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {program.occupationRelations.map((relation, index) => {
                  const careerId = relation.careerId ?? program.careerIds[index] ?? `career-${index + 1}`
                  return <span key={`${careerId}-${index}`} className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[10.5px] font-medium text-[#686660]">{careerId.replaceAll("-", " ")}</span>
                })}
              </div>
              <p className="mt-3 text-[10.5px] leading-5 text-[#8f8c85]">These are reviewed education relationships. They do not imply professional registration, licensing or guaranteed employment eligibility in the UK.</p>
            </section>
          )}
        </main>

        <aside className="rounded-2xl border border-[#e7e6e3] bg-white p-5 lg:sticky lg:top-20">
          <h2 className="text-[14px] font-semibold">Official sources</h2>
          <div className="mt-4 space-y-2">
            {officialUrl && <SourceLink href={officialUrl} primary>Official programme page</SourceLink>}
            {qualificationUrl && qualificationUrl !== officialUrl && <SourceLink href={qualificationUrl}>Qualification source</SourceLink>}
            {internationalUrl && internationalUrl !== officialUrl && <SourceLink href={internationalUrl}>International-student source</SourceLink>}
            {sponsorUrl && sponsorUrl !== internationalUrl && sponsorUrl !== officialUrl && <SourceLink href={sponsorUrl}>Student sponsor source</SourceLink>}
            {admissionUrl && admissionUrl !== officialUrl && admissionUrl !== internationalUrl && <SourceLink href={admissionUrl}>Admission source</SourceLink>}
          </div>
          <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Programme-specific campus and city are intentionally omitted until a current programme source establishes the delivery location.</p>
        </aside>
      </div>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-[#e7e6e3] bg-white p-4"><div className="flex items-center gap-2 text-[#8f8c85]">{icon}<span className="text-[10.5px] font-semibold uppercase tracking-[0.06em]">{label}</span></div><p className="mt-2 text-[13px] font-semibold text-[#34332f]">{value}</p></div>
}

function Evidence({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#fafaf8] p-3"><p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#8f8c85]">{label}</p><p className="mt-1 text-[12.5px] font-semibold text-[#34332f]">{value}</p></div>
}

function SourceLink({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className={primary ? "flex items-center justify-center gap-2 rounded-lg bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white" : "flex items-center justify-center gap-2 rounded-lg border border-[#cfd9ca] px-4 py-2.5 text-[12px] font-semibold text-[#3e7a2e]"}>{children}<ArrowUpRight className="size-3.5" /></a>
}
