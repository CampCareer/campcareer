import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
  ShieldCheck,
  WalletCards,
} from "lucide-react"
import { getCanonicalCareer } from "@/data/career-comparison-catalog"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"
import { institutionDetailPath } from "@/lib/institutions/institution-search"
import { caProgramCityPath } from "@/lib/programs/ca-program-city-routes"
import {
  caAdmissionPresentation,
  caPgwpLabel,
  caPublicationEvidenceLabel,
  formatCaEvidenceDate,
  type CaAdmissionTone,
} from "@/lib/programs/ca-program-presentation"
import { getCaProgramById } from "@/lib/programs/ca-programs.server"
import { caProgramDetailPath, parseProgramId } from "@/lib/programs/program-search"
import { SITE_URL } from "@/lib/seo-routes.mjs"

type Params = { params: Promise<{ program: string }> }

async function loadProgram(segment: string) {
  const id = parseProgramId(segment)
  return id ? getCaProgramById(id) : null
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

function money(value: number | null) {
  if (value == null) return null
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value)
}

function duration(value: number | null) {
  if (value == null) return null
  if (value < 1) return `${Math.round(value * 12)} months`
  return `${new Intl.NumberFormat("en-CA", { maximumFractionDigits: 1 }).format(value)} ${value === 1 ? "year" : "years"}`
}

function admissionToneClass(tone: CaAdmissionTone) {
  if (tone === "positive") return "border-[#cfe2ca] bg-[#f2f8ef] text-[#3e7a2e]"
  if (tone === "caution") return "border-[#ead9af] bg-[#fff9eb] text-[#8a6820]"
  if (tone === "negative") return "border-[#efd2ca] bg-[#fff4f1] text-[#a94e38]"
  return "border-[#e2e1dc] bg-[#f8f8f6] text-[#686660]"
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) return { title: "Program not found", robots: { index: false, follow: false } }

  return {
    title: `${program.title} · ${program.institutionName}`,
    description: [
      program.credentialType,
      program.institutionName,
      [program.city, program.province].filter(Boolean).join(", "),
      caPgwpLabel(program.pgwpState),
    ]
      .filter(Boolean)
      .join(" · "),
    alternates: { canonical: `${SITE_URL}${caProgramDetailPath(program.id, program.title)}` },
    robots: { index: program.indexableDetail, follow: true },
  }
}

export default async function CanadaProgramDetailPage({ params }: Params) {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) notFound()

  const canonicalPath = caProgramDetailPath(program.id, program.title)
  const canonicalSegment = canonicalPath.split("/").pop()
  if (segment !== canonicalSegment) permanentRedirect(canonicalPath)

  const officialUrl = safeUrl(program.officialProgramUrl)
  const sourceUrl = safeUrl(program.sourceUrl)
  const irccUrl = safeUrl(program.irccDetailUrl)
  const institutionUrl = safeUrl(program.institutionWebsite)
  const institutionProfilePath = program.institutionSlug
    ? institutionDetailPath("CA", program.institutionSlug)
    : null
  const cityProfilePath = caProgramCityPath(program.city)
  const cityComparePath = cityProfilePath && program.city
    ? buildCityCompareCanonicalHref({ country: "CA", left: program.city })
    : null
  const careers = program.careerIds
    .map((id) => getCanonicalCareer(id))
    .filter((career): career is NonNullable<ReturnType<typeof getCanonicalCareer>> => Boolean(career))
  const location = [program.city, program.province].filter(Boolean).join(", ")
  const admission = caAdmissionPresentation(program.internationalAdmissionStatus)
  const evidenceDate = formatCaEvidenceDate(program.verifiedAt)
  const publicationEvidence = caPublicationEvidenceLabel(program.publicationTier)

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/programs?country=CA"
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]"
      >
        <ArrowLeft className="size-3.5" /> Back to Canadian programs
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <main className="min-w-0">
          <header className="rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f4f8f2] via-white to-[#eef4ff] p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 text-[10.5px] font-semibold">
              {program.credentialType && <span className="rounded-full bg-white px-3 py-1">{program.credentialType}</span>}
              <span
                className={
                  program.publicationTier === "A"
                    ? "rounded-full bg-[#edf5ea] px-3 py-1 text-[#3e7a2e]"
                    : "rounded-full bg-[#f5f3ee] px-3 py-1 text-[#786f60]"
                }
              >
                {publicationEvidence}
              </span>
              <span
                className={`rounded-full px-3 py-1 ${
                  program.pgwpState === "eligible"
                    ? "bg-[#eaf1ff] text-[#2563eb]"
                    : program.pgwpState === "ineligible"
                      ? "bg-[#fff2ee] text-[#b65c45]"
                      : "bg-[#f1f1ef] text-[#77746e]"
                }`}
              >
                {caPgwpLabel(program.pgwpState)}
              </span>
            </div>

            <h1 className="mt-5 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#1b1b1b] sm:text-[36px]">
              {program.title}
            </h1>
            {institutionProfilePath ? (
              <Link
                href={institutionProfilePath}
                className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4f4d48] transition hover:text-[#3e7a2e] hover:underline"
              >
                <Building2 className="size-4" /> {program.institutionName}
              </Link>
            ) : (
              <p className="mt-3 text-[14px] font-semibold text-[#4f4d48]">{program.institutionName}</p>
            )}
            {location && (
              cityProfilePath ? (
                <Link
                  href={cityProfilePath}
                  className="mt-2 inline-flex items-center gap-2 text-[12.5px] text-[#77746e] transition hover:text-[#3e7a2e] hover:underline"
                >
                  <MapPin className="size-4" /> {location}
                </Link>
              ) : (
                <p className="mt-2 flex items-center gap-2 text-[12.5px] text-[#77746e]">
                  <MapPin className="size-4" /> {location}
                </p>
              )
            )}
            {program.fieldName && <p className="mt-5 text-[13px] leading-6 text-[#65625c]">{program.fieldName}</p>}
          </header>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric
              icon={<GraduationCap className="size-4" />}
              label="Study level"
              value={program.educationLevel ?? program.credentialType ?? "Not published"}
            />
            <Metric icon={<Clock3 className="size-4" />} label="Duration" value={duration(program.durationYears) ?? "Not published"} />
            <Metric icon={<WalletCards className="size-4" />} label="Published tuition" value={money(program.tuitionFeeCad) ?? "Not published"} />
            <Metric icon={<ShieldCheck className="size-4" />} label="PGWP" value={caPgwpLabel(program.pgwpState).replace("PGWP ", "")} />
          </div>

          <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">International admission evidence</h2>
            </div>
            <div className={`mt-3 rounded-lg border px-4 py-3 ${admissionToneClass(admission.tone)}`}>
              <p className="text-[12.5px] font-semibold">{admission.label}</p>
              {admission.detail && <p className="mt-1 text-[11.5px] leading-5 opacity-90">{admission.detail}</p>}
            </div>
            {evidenceDate && (
              <p className="mt-3 text-[10.5px] font-medium text-[#8f8c85]">Evidence checked {evidenceDate}</p>
            )}
            <p className="mt-2 text-[10.5px] leading-5 text-[#9b9891]">
              Admission evidence is separate from PGWP eligibility. CampCareer does not infer current international availability from a generic institution Apply link.
            </p>
          </section>

          <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Related target careers</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {careers.map((career) => (
                <Link
                  key={career.id}
                  href={`/programs?country=CA&career=${career.id}`}
                  className="rounded-full border border-[#dfe5dc] bg-[#f8faf7] px-3 py-1.5 text-[11.5px] font-semibold text-[#4f6648] transition hover:border-[#3e7a2e]/40 hover:text-[#3e7a2e]"
                >
                  {career.label}
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside className="rounded-2xl border border-[#e7e6e3] bg-white p-5 lg:sticky lg:top-20">
          <h2 className="text-[14px] font-semibold">At a glance</h2>
          <dl className="mt-4 space-y-3 text-[11.5px]">
            <Row label="DLI" value={program.dliNumber ?? "—"} />
            <Row label="Program code" value={program.programCode ?? "—"} />
            <Row label="CIP" value={program.cipCode ?? "—"} />
            <Row label="PGWP" value={caPgwpLabel(program.pgwpState).replace("PGWP ", "")} />
            <Row label="Publication evidence" value={publicationEvidence} />
          </dl>

          <div className="mt-5 space-y-2">
            {institutionProfilePath && (
              <Link
                href={institutionProfilePath}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#cfd9ca] bg-[#f7faf5] px-4 py-2.5 text-[12px] font-semibold text-[#3e7a2e] transition hover:bg-[#edf5ea]"
              >
                Institution profile <Building2 className="size-3.5" />
              </Link>
            )}
            {cityProfilePath && (
              <Link
                href={cityProfilePath}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#d9e3f7] bg-[#f7f9fe] px-4 py-2.5 text-[12px] font-semibold text-[#2563eb] transition hover:bg-[#eef4ff]"
              >
                City profile <MapPin className="size-3.5" />
              </Link>
            )}
            {cityComparePath && (
              <Link
                href={cityComparePath}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#d9e3f7] px-4 py-2.5 text-[12px] font-semibold text-[#2563eb] transition hover:bg-[#eef4ff]"
              >
                Compare this city <MapPin className="size-3.5" />
              </Link>
            )}
            {officialUrl && <SourceLink href={officialUrl} primary>Official program page</SourceLink>}
            {irccUrl && <SourceLink href={irccUrl}>PGWP / IRCC evidence</SourceLink>}
            {sourceUrl && sourceUrl !== officialUrl && <SourceLink href={sourceUrl}>Program source</SourceLink>}
            {institutionUrl && <SourceLink href={institutionUrl}>Institution website</SourceLink>}
          </div>

          <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">
            Admissions, tuition and PGWP rules can change. Confirm the latest provider and IRCC information before applying.
          </p>
        </aside>
      </div>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2 text-[#8a8882]">
        {icon}
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.06em]">{label}</p>
      </div>
      <p className="mt-2 text-[13px] font-semibold leading-5 text-[#1b1b1b]">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#8f8c85]">{label}</dt>
      <dd className="max-w-[170px] text-right font-semibold leading-5">{value}</dd>
    </div>
  )
}

function SourceLink({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        primary
          ? "flex items-center justify-center gap-2 rounded-lg bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white"
          : "flex items-center justify-center gap-2 rounded-lg border border-[#cfd9ca] px-4 py-2.5 text-[12px] font-semibold text-[#3e7a2e]"
      }
    >
      {children} <ArrowUpRight className="size-3.5" />
    </a>
  )
}
