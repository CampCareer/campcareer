import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Building2, CalendarClock, Clock3, GraduationCap, Languages, MapPin, ShieldCheck } from "lucide-react"
import { getNoProgramBySlug } from "@/lib/programs/no-programs.server"
import { isIndexableNoProgramSlug, noProgramDetailPath } from "@/lib/programs/no-program-seo"
import { institutionDetailPath } from "@/lib/institutions/institution-search"

const BASE_URL = "https://www.campcareer.com"
const NO_PUBLIC_INSTITUTION_SLUGS = new Set([
  "nord-university","norwegian-university-of-life-sciences","norwegian-university-of-science-and-technology","oslomet-oslo-metropolitan-university","uit-the-arctic-university-of-norway","university-of-agder","university-of-bergen","university-of-inland-norway","university-of-oslo","university-of-south-eastern-norway","university-of-stavanger",
])

type Params = { params: Promise<{ program: string }> }

function safeSlug(value: string) {
  const slug = value.trim().toLowerCase()
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null
}
function safeUrl(value: string | null) {
  if (!value) return null
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null } catch { return null }
}
function durationLabel(months: number | null) {
  if (!months) return "Not published"
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}
function admissionCopy(status: string, verification: string) {
  if (verification === "unverified" || verification === "stale" || verification === "rejected") return { label: "Current international admission not verified", body: "The programme record exists, but CampCareer has not verified a current international application pathway for this programme.", className: "border-[#e5e1d7] bg-[#faf9f5] text-[#6f6d68]" }
  if (status === "open") return { label: "International applications open", body: "A current programme source supports an open international application window. Recheck the provider page before submitting because deadlines can change.", className: "border-[#cfe0c9] bg-[#f4f9f2] text-[#37672c]" }
  if (status === "closed") return { label: "Verified application cycle closed", body: "The programme remains in the source-verified catalogue, but the verified application window has closed. No future intake is implied.", className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]" }
  if (status === "restricted") return { label: "International admission restricted", body: "The current source limits this pathway to a defined applicant group such as EU/EEA or qualifying Norwegian residence categories. Programme existence remains separate from admission eligibility.", className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]" }
  return { label: "English-taught pathway verified · current window unknown", body: "HK-dir lists this programme as taught in English, but CampCareer has not inferred that applications are open today.", className: "border-[#d9e3f7] bg-[#f7f9ff] text-[#315f9f]" }
}
async function loadProgram(segment: string) { const slug = safeSlug(segment); return slug ? getNoProgramBySlug(slug) : null }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) return { title: "Program not found", robots: { index: false, follow: false } }
  const canonical = noProgramDetailPath(program.slug)
  return { title: `${program.title} · ${program.institutionName}`, description: `${program.title} at ${program.institutionName}. HK-dir programme listing and current international application status are tracked separately.`, alternates: { canonical: `${BASE_URL}${canonical}` }, robots: { index: isIndexableNoProgramSlug(program.slug) && program.internationalAdmissionStatus !== "closed", follow: true } }
}

export default async function NoProgramDetailPage({ params }: Params) {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) notFound()
  const canonicalPath = noProgramDetailPath(program.slug)
  if (segment !== program.slug) permanentRedirect(canonicalPath)
  const admission = admissionCopy(program.internationalAdmissionStatus, program.admissionVerificationStatus)
  const institutionPath = program.institutionSlug && NO_PUBLIC_INSTITUTION_SLUGS.has(program.institutionSlug) ? institutionDetailPath("NO", program.institutionSlug) : null
  const authorityUrl = safeUrl(program.officialProgramUrl)
  const institutionUrl = safeUrl(program.institutionProgramUrl)
  const admissionUrl = safeUrl(program.admissionSourceUrl)

  return <div className="mx-auto max-w-5xl">
    <Link href="/programs?country=NO" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]"><ArrowLeft className="size-3.5" /> Back to Norway programs</Link>
    <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <main className="min-w-0">
        <header className="rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f4f8f2] via-white to-[#eef4ff] p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 text-[10.5px] font-semibold"><span className="rounded-full bg-white px-3 py-1">{program.degreeLevel}</span><span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />HK-dir source verified</span></div>
          <h1 className="mt-5 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#1b1b1b] sm:text-[36px]">{program.title}</h1>
          {institutionPath ? <Link href={institutionPath} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4f4d48] hover:text-[#3e7a2e] hover:underline"><Building2 className="size-4" />{program.institutionName}</Link> : <p className="mt-3 text-[14px] font-semibold text-[#4f4d48]">{program.institutionName}</p>}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#77746e]">{program.city && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{program.city}</span>}{program.languageContext && <span className="inline-flex items-center gap-1.5"><Languages className="size-4" />{program.languageContext}</span>}</div>
        </header>
        <section className={`mt-5 rounded-xl border p-5 ${admission.className}`}><h2 className="text-[14.5px] font-semibold">{admission.label}</h2><p className="mt-2 text-[12px] leading-5">{admission.body}</p>{program.intakeLabel && <p className="mt-3 text-[11px] font-semibold">Verified intake: {program.intakeLabel}</p>}{program.applicationDeadline && <p className="mt-1 text-[11px]">Application deadline: {program.applicationDeadline}</p>}</section>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><Metric icon={<GraduationCap className="size-4" />} label="Study level" value={program.degreeLevel} /><Metric icon={<Clock3 className="size-4" />} label="Duration" value={durationLabel(program.durationMonths)} /><Metric icon={<Languages className="size-4" />} label="Language context" value={program.languageRequirementContext ?? program.languageContext ?? "Confirm with provider"} /><Metric icon={<CalendarClock className="size-4" />} label="Admission status" value={program.internationalAdmissionStatus.replaceAll("_", " ")} /></div>
        <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6"><h2 className="text-[14.5px] font-semibold">Source semantics</h2><p className="mt-3 text-[12px] leading-6 text-[#65625c]">{program.sourceVerificationLabel ?? "HK-dir Study in Norway English-taught programme source verified."}</p><p className="mt-2 text-[11px] leading-5 text-[#8f8c85]">Study in Norway is used as the authority catalogue for English-taught programmes. CampCareer does not convert a university’s institutional accreditation or self-accrediting authority into a programme-level NOKUT accreditation claim.</p></section>
        {program.occupationIds.length > 0 && <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6"><h2 className="text-[14.5px] font-semibold">CampCareer career links</h2><div className="mt-3 flex flex-wrap gap-2">{program.occupationIds.map((id) => <span key={id} className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[10.5px] font-medium text-[#686660]">{id.replace(/-/g, " ")}</span>)}</div><p className="mt-3 text-[10.5px] leading-5 text-[#8f8c85]">These are reviewed education relationships, not claims of Norwegian professional licensing or guaranteed employment eligibility.</p></section>}
      </main>
      <aside className="rounded-2xl border border-[#e7e6e3] bg-white p-5 lg:sticky lg:top-20"><h2 className="text-[14px] font-semibold">Source status</h2><dl className="mt-4 space-y-3 text-[11.5px]"><div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Programme source</dt><dd className="font-semibold">Tier {program.verificationTier}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Admission evidence</dt><dd className="font-semibold">{program.admissionVerificationStatus}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Programme accreditation claim</dt><dd className="font-semibold">{program.hasProgrammeAccreditationClaim ? "Yes" : "No"}</dd></div></dl><div className="mt-5 space-y-2">{authorityUrl && <SourceLink href={authorityUrl} primary>Study in Norway source</SourceLink>}{institutionUrl && institutionUrl !== authorityUrl && <SourceLink href={institutionUrl}>Institution website</SourceLink>}{admissionUrl && admissionUrl !== authorityUrl && admissionUrl !== institutionUrl && <SourceLink href={admissionUrl}>Admission source</SourceLink>}</div><p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Admission windows and requirements can change. Unknown values stay unknown until a current source is verified.</p></aside>
    </div>
  </div>
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-[#e7e6e3] bg-white p-4"><div className="flex items-center gap-2 text-[#8f8c85]">{icon}<span className="text-[10.5px] font-semibold uppercase tracking-[0.06em]">{label}</span></div><p className="mt-2 text-[13px] font-semibold text-[#34332f]">{value}</p></div> }
function SourceLink({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) { return <a href={href} target="_blank" rel="noreferrer" className={primary ? "flex items-center justify-center gap-2 rounded-lg bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white" : "flex items-center justify-center gap-2 rounded-lg border border-[#cfd9ca] px-4 py-2.5 text-[12px] font-semibold text-[#3e7a2e]"}>{children}<ArrowUpRight className="size-3.5" /></a> }
