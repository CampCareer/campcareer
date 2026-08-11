import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Building2, CalendarClock, Clock3, GraduationCap, ShieldCheck } from "lucide-react"
import { getNzProgramBySlug } from "@/lib/programs/nz-programs.server"
import { isIndexableNzProgramSlug, nzProgramDetailPath } from "@/lib/programs/nz-program-seo"
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
  if (status === "open") return { label: "Applications open", body: "A current official source supports an open application window. Recheck the provider page before applying because deadlines can change.", className: "border-[#cfe0c9] bg-[#f4f9f2] text-[#37672c]" }
  if (status === "closed") return { label: "Verified application cycle closed", body: "The programme remains in the catalogue, but the verified application state is closed. CampCareer does not infer a future intake from programme existence alone.", className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]" }
  if (status === "not_yet_open") return { label: "Next cycle not yet open", body: "A future intake or application cycle is source-backed, but applications are not yet open.", className: "border-[#d9e3f7] bg-[#f7f9ff] text-[#315f9f]" }
  if (status === "restricted") return { label: "Applicant restrictions apply", body: "The current source limits this pathway to a defined applicant group. Programme existence remains separate from admission eligibility.", className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]" }
  return { label: "Current application window not confirmed", body: "The programme and international-study route are source-backed, but CampCareer has not inferred that applications are open today.", className: "border-[#d9e3f7] bg-[#f7f9ff] text-[#315f9f]" }
}

async function loadProgram(segment: string) {
  const slug = safeSlug(segment)
  return slug ? getNzProgramBySlug(slug) : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) return { title: "Program not found", robots: { index: false, follow: false } }
  const canonical = nzProgramDetailPath(program.slug)
  const indexable = program.indexable && isIndexableNzProgramSlug(program.slug)
  return {
    title: `${program.title} · ${program.institutionName}`,
    description: `${program.title} at ${program.institutionName}. NZQCF metadata, international-study eligibility, provider Code context and application timing are tracked separately.`,
    alternates: { canonical: `${SITE_URL}${canonical}` },
    robots: { index: indexable, follow: true },
  }
}

export default async function NzProgramDetailPage({ params }: Params) {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) notFound()
  const canonicalPath = nzProgramDetailPath(program.slug)
  if (segment !== program.slug) permanentRedirect(canonicalPath)

  const admission = admissionCopy(program.admissionState)
  const institutionPath = institutionDetailPath("NZ", program.institutionSlug)
  const officialUrl = safeUrl(program.officialProgramUrl)
  const internationalUrl = safeUrl(program.internationalSourceUrl ?? program.programmeInternationalSourceUrl)
  const codeUrl = safeUrl(program.codeSignatorySourceUrl)
  const admissionUrl = safeUrl(program.admissionSourceUrl)
  const authorityUrl = safeUrl(program.programmeAuthorityUrl)
  const visaUrl = safeUrl(program.visaSourceUrl)

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/programs?country=NZ" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]"><ArrowLeft className="size-3.5" /> Back to New Zealand programmes</Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <main className="min-w-0">
          <header className="rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f4f8f2] via-white to-[#eef4ff] p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 text-[10.5px] font-semibold">
              <span className="rounded-full bg-white px-3 py-1">{humanize(program.qualificationName ?? program.degreeLevel)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />Programme source verified</span>
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
            <Metric icon={<GraduationCap className="size-4" />} label="Qualification" value={program.qualificationName ?? humanize(program.degreeLevel)} />
            <Metric icon={<Clock3 className="size-4" />} label="Duration" value={durationLabel(program.durationMonths)} />
            <Metric icon={<Building2 className="size-4" />} label="Study mode" value={program.studyMode ?? "Confirm with provider"} />
            <Metric icon={<CalendarClock className="size-4" />} label="NZQCF" value={program.nzqcfLevel ? `Level ${program.nzqcfLevel}${program.nzqcfCredits ? ` · ${program.nzqcfCredits} credits` : ""}` : "Not published"} />
          </div>

          <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <h2 className="text-[14.5px] font-semibold">International study and provider evidence</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Evidence label="International students" value={program.internationalStudentsEligible === true ? "Eligible route verified" : program.internationalStudentsEligible === false ? "Not eligible" : "Needs programme-level review"} />
              <Evidence label="Provider Code context" value={program.codeSignatoryStatus === "confirmed" ? "Confirmed" : "Not resolved"} />
              <Evidence label="Programme authority" value={program.programmeAuthority ?? "Not published"} />
              <Evidence label="Provider number" value={program.providerNumber ?? "Not published"} />
            </div>
            {program.studentVisaContext && <p className="mt-4 text-[10.5px] leading-5 text-[#8f8c85]">{program.studentVisaContext}</p>}
          </section>

          {program.postStudyWorkContext && (
            <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
              <h2 className="text-[14.5px] font-semibold">Post-study work context</h2>
              <p className="mt-3 text-[11.5px] leading-5 text-[#6f6d68]">{program.postStudyWorkContext}</p>
              <p className="mt-3 text-[10.5px] leading-5 text-[#8f8c85]">This is qualification-level context, not a guarantee of an applicant-specific visa outcome.</p>
            </section>
          )}

          {program.occupationRelations.length > 0 && (
            <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
              <h2 className="text-[14.5px] font-semibold">Related CampCareer careers</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {program.occupationRelations.map((relation, index) => {
                  const careerId = relation.careerId ?? program.careerIds[index] ?? `career-${index + 1}`
                  return <span key={`${careerId}-${index}`} className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[10.5px] font-medium text-[#686660]">{careerId.replaceAll("-", " ")} · {relation.relationType ?? "related"}</span>
                })}
              </div>
              <p className="mt-3 text-[10.5px] leading-5 text-[#8f8c85]">These are reviewed education relationships. They do not imply professional registration, licensing, visa approval or guaranteed employment eligibility in New Zealand.</p>
            </section>
          )}
        </main>

        <aside className="rounded-2xl border border-[#e7e6e3] bg-white p-5 lg:sticky lg:top-20">
          <h2 className="text-[14px] font-semibold">Official sources</h2>
          <div className="mt-4 space-y-2">
            {officialUrl && <SourceLink href={officialUrl} primary>Official programme page</SourceLink>}
            {internationalUrl && internationalUrl !== officialUrl && <SourceLink href={internationalUrl}>International-student source</SourceLink>}
            {codeUrl && codeUrl !== internationalUrl && codeUrl !== officialUrl && <SourceLink href={codeUrl}>Provider Code source</SourceLink>}
            {admissionUrl && admissionUrl !== officialUrl && admissionUrl !== internationalUrl && <SourceLink href={admissionUrl}>Admission source</SourceLink>}
            {authorityUrl && <SourceLink href={authorityUrl}>Programme authority source</SourceLink>}
            {visaUrl && <SourceLink href={visaUrl}>Immigration New Zealand source</SourceLink>}
          </div>
          <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Programme-specific campus and city are intentionally omitted until current programme-level delivery evidence establishes the location.</p>
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
