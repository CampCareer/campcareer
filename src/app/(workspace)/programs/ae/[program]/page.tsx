import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, Clock3, GraduationCap, MapPin, ShieldCheck, WalletCards } from "lucide-react"
import { getAeProgramBySlug } from "@/lib/programs/ae-programs.server"
import { aeProgramDetailPath, isIndexableAeProgramSlug } from "@/lib/programs/ae-program-seo"
import { institutionDetailPath } from "@/lib/institutions/institution-search"

const BASE_URL = "https://www.campcareer.com"
const AE_PUBLIC_INSTITUTION_SLUGS = new Set([
  "american-university-of-sharjah",
  "khalifa-university",
  "mohammed-bin-rashid-university-of-medicine-and-health-sciences",
  "new-york-university-abu-dhabi",
  "united-arab-emirates-university",
])

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
  } catch { return null }
}

function durationLabel(months: number | null) {
  if (!months) return "Not published"
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}

function moneyLabel(value: number | null) {
  if (value == null) return "Not published"
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(value)
}

function admissionCopy(status: string, verification: string) {
  if (verification !== "verified") return {
    label: "International admission not yet verified",
    body: "CampCareer has verified the program record, but has not yet verified a current program-level international application window. Do not infer availability from accreditation status.",
    className: "border-[#e5e1d7] bg-[#faf9f5] text-[#6f6d68]",
  }
  if (status === "open") return {
    label: "International applications open",
    body: "A current provider source supports an open international application path. Confirm dates and seat availability again before applying.",
    className: "border-[#cfe0c9] bg-[#f4f9f2] text-[#37672c]",
  }
  if (status === "closed") return {
    label: "Current application cycle closed",
    body: "The program remains source-verified, but the currently verified application deadline has passed. This does not mean the program is discontinued.",
    className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]",
  }
  if (status === "restricted") return {
    label: "International admission restricted",
    body: "The current admission source limits this program to a defined domestic or nationality cohort. Accreditation remains separate from admission eligibility.",
    className: "border-[#eed8cf] bg-[#fff8f5] text-[#9a4e39]",
  }
  return {
    label: "Admission schedule not confirmed",
    body: "Eligibility may exist, but CampCareer has not verified a current open intake for this program.",
    className: "border-[#d9e3f7] bg-[#f7f9ff] text-[#315f9f]",
  }
}

async function loadProgram(segment: string) {
  const slug = safeSlug(segment)
  return slug ? getAeProgramBySlug(slug) : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) return { title: "Program not found", robots: { index: false, follow: false } }
  const canonical = aeProgramDetailPath(program.slug)
  return {
    title: `${program.title} · ${program.institutionName}`,
    description: `${program.title} at ${program.institutionName}. Accreditation and current international admission status are tracked separately on CampCareer.`,
    alternates: { canonical: `${BASE_URL}${canonical}` },
    robots: { index: isIndexableAeProgramSlug(program.slug) && program.verificationTier === "A", follow: true },
  }
}

export default async function AeProgramDetailPage({ params }: Params) {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) notFound()
  const canonicalPath = aeProgramDetailPath(program.slug)
  if (segment !== program.slug) permanentRedirect(canonicalPath)

  const admission = admissionCopy(program.internationalAdmissionStatus, program.admissionVerificationStatus)
  const institutionPath = program.institutionSlug && AE_PUBLIC_INSTITUTION_SLUGS.has(program.institutionSlug)
    ? institutionDetailPath("AE", program.institutionSlug)
    : null
  const officialUrl = safeUrl(program.officialProgramUrl)
  const registryUrl = safeUrl(program.caaDetailUrl ?? program.registrySourceUrl)
  const admissionUrl = safeUrl(program.admissionSourceUrl)
  const visaUrl = safeUrl(program.visaSourceUrl)
  const accreditationUrl = safeUrl(program.accreditationAuthorityUrl)

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/programs?country=AE" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]"><ArrowLeft className="size-3.5" /> Back to UAE programs</Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <main className="min-w-0">
          <header className="rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f4f8f2] via-white to-[#eef4ff] p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 text-[10.5px] font-semibold">
              {program.credentialType && <span className="rounded-full bg-white px-3 py-1">{program.credentialType}</span>}
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />Accreditation source verified</span>
              <span className={program.verificationTier === "A" ? "rounded-full bg-[#3e7a2e] px-3 py-1 text-white" : "rounded-full bg-[#f3f4f1] px-3 py-1 text-[#686660]"}>{program.verificationTier === "A" ? "Tier A" : "Tier B"}</span>
            </div>
            <h1 className="mt-5 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#1b1b1b] sm:text-[36px]">{program.title}</h1>
            {institutionPath ? (
              <Link href={institutionPath} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4f4d48] hover:text-[#3e7a2e] hover:underline"><Building2 className="size-4" />{program.institutionName}</Link>
            ) : <p className="mt-3 text-[14px] font-semibold text-[#4f4d48]">{program.institutionName}</p>}
            {(program.city || program.emirate) && <p className="mt-2 flex items-center gap-2 text-[12.5px] text-[#77746e]"><MapPin className="size-4" />{[program.city, program.emirate].filter((value, index, all) => value && all.indexOf(value) === index).join(", ")}</p>}
            {program.fieldName && <p className="mt-5 text-[13px] leading-6 text-[#65625c]">{program.fieldName}</p>}
          </header>

          <section className={`mt-5 rounded-xl border p-5 ${admission.className}`}>
            <h2 className="text-[14.5px] font-semibold">{admission.label}</h2>
            <p className="mt-2 text-[12px] leading-5">{admission.body}</p>
            {program.intakeLabel && <p className="mt-3 text-[11px] font-semibold">Verified intake: {program.intakeLabel}</p>}
            {program.applicationDeadline && <p className="mt-1 text-[11px]">Application deadline: {program.applicationDeadline}</p>}
          </section>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric icon={<GraduationCap className="size-4" />} label="Study level" value={program.programmeLevel ?? program.credentialType ?? "Not published"} />
            <Metric icon={<Clock3 className="size-4" />} label="Duration" value={durationLabel(program.durationMonths)} />
            <Metric icon={<WalletCards className="size-4" />} label="Tuition" value={moneyLabel(program.tuitionFeeAed)} />
            <Metric icon={<MapPin className="size-4" />} label="Publication location" value={[program.city, program.emirate].filter((value, index, all) => value && all.indexOf(value) === index).join(", ") || "Not published"} />
          </div>

          <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#2563eb]" /><h2 className="text-[14.5px] font-semibold">Accreditation</h2></div>
            <dl className="mt-4 grid gap-3 text-[11.5px] sm:grid-cols-2">
              <div><dt className="text-[#8f8c85]">Authority</dt><dd className="mt-1 font-semibold text-[#34332f]">{program.accreditationAuthority ?? "Source authority verified"}</dd></div>
              <div><dt className="text-[#8f8c85]">Status</dt><dd className="mt-1 font-semibold text-[#34332f]">{program.accreditationStatus ?? "approved"}</dd></div>
            </dl>
            <p className="mt-4 text-[10.5px] leading-5 text-[#8f8c85]">Accreditation confirms the program record. It does not establish that an international application window is currently open.</p>
          </section>

          {program.occupationIds.length > 0 && (
            <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
              <h2 className="text-[14.5px] font-semibold">CampCareer career links</h2>
              <div className="mt-3 flex flex-wrap gap-2">{program.occupationIds.map((id) => <span key={id} className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[10.5px] font-medium text-[#686660]">{id.replace(/-/g, " ")}</span>)}</div>
              <p className="mt-3 text-[10.5px] leading-5 text-[#8f8c85]">These links are manually reviewed education relationships. They are not a claim of professional registration or guaranteed employment eligibility.</p>
            </section>
          )}
        </main>

        <aside className="rounded-2xl border border-[#e7e6e3] bg-white p-5 lg:sticky lg:top-20">
          <h2 className="text-[14px] font-semibold">Source status</h2>
          <dl className="mt-4 space-y-3 text-[11.5px]">
            <div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Program source</dt><dd className="font-semibold">Tier {program.verificationTier}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Admission evidence</dt><dd className="font-semibold">{program.admissionVerificationStatus}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Visa evidence</dt><dd className="font-semibold">{program.visaSponsorshipAvailable == null ? "Not verified" : program.visaSponsorshipAvailable ? "Available" : "Not available"}</dd></div>
          </dl>
          <div className="mt-5 space-y-2">
            {officialUrl && <SourceLink href={officialUrl} primary>Official program page</SourceLink>}
            {registryUrl && <SourceLink href={registryUrl}>Accreditation record</SourceLink>}
            {admissionUrl && <SourceLink href={admissionUrl}>Admission source</SourceLink>}
            {visaUrl && visaUrl !== admissionUrl && <SourceLink href={visaUrl}>Visa source</SourceLink>}
            {accreditationUrl && accreditationUrl !== registryUrl && <SourceLink href={accreditationUrl}>Accreditation authority</SourceLink>}
          </div>
          <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Admission dates, fees and visa processes change. CampCareer keeps unknown values unknown until a current source is verified.</p>
        </aside>
      </div>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-[#e7e6e3] bg-white p-4"><div className="flex items-center gap-2 text-[#8f8c85]">{icon}<span className="text-[10.5px] font-semibold uppercase tracking-[0.06em]">{label}</span></div><p className="mt-2 text-[13px] font-semibold text-[#34332f]">{value}</p></div>
}

function SourceLink({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className={primary ? "flex items-center justify-center gap-2 rounded-lg bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white" : "flex items-center justify-center gap-2 rounded-lg border border-[#cfd9ca] px-4 py-2.5 text-[12px] font-semibold text-[#3e7a2e]"}>{children}<ArrowUpRight className="size-3.5" /></a>
}
