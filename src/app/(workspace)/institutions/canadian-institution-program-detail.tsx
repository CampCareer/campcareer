import Link from "next/link"
import {
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { InstitutionLogo } from "@/components/institution-logo"
import { getLaunchCountry } from "@/data/launch-countries"
import { institutionCountryPath } from "@/lib/institutions/institution-search"
import type {
  InstitutionCampusLocation,
  InstitutionDetail,
} from "@/lib/institutions/institution-detail.server"
import type {
  CaInstitutionProgramSummary,
  CaProgramListItem,
} from "@/lib/programs/ca-programs.server"
import {
  caPgwpLabel,
  caPublicationEvidenceLabel,
} from "@/lib/programs/ca-program-presentation"
import { caProgramDetailPath } from "@/lib/programs/program-search"

function verifiedKindLabel(kind: string | null) {
  switch (kind) {
    case "university":
      return "University"
    case "college":
      return "College"
    case "polytechnic":
      return "Polytechnic"
    case "tafe_vet":
      return "TAFE / VET"
    case "other":
      return "Other"
    default:
      return null
  }
}

function ownershipLabel(ownership: string | null) {
  switch (ownership) {
    case "public":
      return "Public"
    case "private":
      return "Private"
    case "private_nonprofit":
      return "Private nonprofit"
    case "private_forprofit":
      return "Private for-profit"
    default:
      return null
  }
}

function safeWebsiteUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
  } catch {
    return null
  }
}

function locationLabel(location: InstitutionCampusLocation) {
  const city = location.city ?? location.reportedCity
  return [city, location.region].filter(Boolean).join(", ") || "Location not published"
}

function LocationList({ locations, total }: { locations: InstitutionCampusLocation[]; total: number }) {
  if (locations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-6">
        <p className="text-[12px] text-[#77746e]">No verified study locations are currently published for this institution.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {locations.map((location) => (
          <article key={location.id} className="rounded-xl border border-[#e7e6e3] bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f2f5ef] text-[#3e7a2e]">
                <MapPin className="size-4" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold leading-5 text-[#1b1b1b]">{location.name ?? "Study location"}</h3>
                <p className="mt-1 text-[11.5px] leading-5 text-[#6f6d68]">{locationLabel(location)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      {total > locations.length ? (
        <p className="mt-3 text-[10.5px] text-[#9c9a94]">
          Showing {locations.length} of {total.toLocaleString()} current location records.
        </p>
      ) : null}
    </>
  )
}

function ProgramPreview({ program }: { program: CaProgramListItem }) {
  return (
    <Link
      href={caProgramDetailPath(program.id, program.title)}
      className="group rounded-xl border border-[#e7e6e3] bg-[#fbfbf9] p-4 transition hover:border-[#bfcdb9] hover:bg-white hover:shadow-sm"
    >
      <div className="flex flex-wrap gap-1.5">
        {program.credentialType ? (
          <span className="rounded-md bg-[#f4f4f1] px-2 py-1 text-[9.5px] font-semibold uppercase tracking-wide text-[#77746e]">
            {program.credentialType}
          </span>
        ) : null}
        <span className="rounded-md bg-[#edf5ea] px-2 py-1 text-[9.5px] font-semibold text-[#3e7a2e]">
          {caPublicationEvidenceLabel(program.publicationTier)}
        </span>
      </div>
      <h3 className="mt-2 text-[13px] font-semibold leading-5 text-[#1b1b1b] transition group-hover:text-[#3e7a2e]">{program.title}</h3>
      {program.fieldName ? <p className="mt-1 line-clamp-2 text-[11px] leading-4.5 text-[#77746e]">{program.fieldName}</p> : null}
      <div className="mt-3 flex items-center justify-between gap-3 text-[10.5px]">
        <span className={program.pgwpState === "eligible" ? "font-semibold text-[#2563eb]" : program.pgwpState === "ineligible" ? "font-semibold text-[#b65c45]" : "font-medium text-[#8b8881]"}>
          {caPgwpLabel(program.pgwpState)}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#3e7a2e]">
          View program <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  )
}

function PublicationPrograms({ institution, publication }: { institution: InstitutionDetail; publication: CaInstitutionProgramSummary }) {
  const allProgramsHref = `/programs?country=CA&institution=${encodeURIComponent(institution.slug)}`

  if (publication.total === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-6">
        <p className="text-[12px] leading-5 text-[#77746e]">
          No programs from this institution are currently in CampCareer&apos;s published 80-career Canada set. This does not mean the institution offers no other programs.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {publication.programs.map((program) => <ProgramPreview key={program.id} program={program} />)}
      </div>
      {publication.total > publication.programs.length ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10.5px] text-[#9c9a94]">
            Showing {publication.programs.length} of {publication.total.toLocaleString()} published target-career programs.
          </p>
          <Link href={allProgramsHref} className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">
            View all published programs <ArrowRight className="size-3" />
          </Link>
        </div>
      ) : null}
    </>
  )
}

export function CanadianInstitutionProgramDetailView({
  institution,
  publication,
}: {
  institution: InstitutionDetail
  publication: CaInstitutionProgramSummary
}) {
  const country = getLaunchCountry(institution.countryCode)
  const kind = verifiedKindLabel(institution.institutionKind)
  const ownership = ownershipLabel(institution.ownershipType)
  const website = safeWebsiteUrl(institution.websiteUrl)
  const dliSource = safeWebsiteUrl(institution.dliSourceUrl)
  const countryPath = institutionCountryPath(institution.countryCode)

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#8f8c85]">
        <Link href="/institutions" className="transition hover:text-[#3e7a2e]">Institutions</Link>
        <span>/</span>
        <Link href={countryPath} className="transition hover:text-[#3e7a2e]">{country?.name ?? institution.countryCode}</Link>
        <span>/</span>
        <span className="truncate text-[#5f5d58]">{institution.name}</span>
      </nav>

      <header className="mt-5 rounded-2xl border border-[#e7e6e3] bg-white p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <InstitutionLogo name={institution.name} logoUrl={institution.logoUrl} size="detail" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">Canada institution</p>
              <h1 className="mt-2 max-w-3xl text-[27px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-3xl">{institution.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {kind ? <span className="rounded-full bg-[#edf5ea] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{kind}</span> : null}
                {ownership ? <span className="rounded-full border border-[#e3e2dd] px-3 py-1.5 text-[11px] font-medium text-[#686660]">{ownership}</span> : null}
              </div>
            </div>
          </div>
          {website ? (
            <a href={website} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#326625]">
              Official website <ExternalLink className="size-3.5" />
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#fafaf8] p-4">
            <GraduationCap className="size-4 text-[#3e7a2e]" />
            <p className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{publication.total.toLocaleString()}</p>
            <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Published career programs</p>
          </div>
          <div className="rounded-xl bg-[#fafaf8] p-4">
            <MapPin className="size-4 text-[#3e7a2e]" />
            <p className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{institution.campusCount.toLocaleString()}</p>
            <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Location records</p>
          </div>
          <div className="rounded-xl bg-[#fafaf8] p-4">
            <MapPin className="size-4 text-[#3e7a2e]" />
            <p className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{institution.cityCount.toLocaleString()}</p>
            <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Normalized cities</p>
          </div>
        </div>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)] lg:items-start">
        <main className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[16px] font-semibold text-[#1b1b1b]">Published programs</h2>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">
              Programs below belong to CampCareer&apos;s reviewed Canada publication set for the 80 target careers. Other institution programs are intentionally outside this count.
            </p>
            <div className="mt-4"><PublicationPrograms institution={institution} publication={publication} /></div>
          </section>

          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[16px] font-semibold text-[#1b1b1b]">Study locations</h2>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">
              Source-backed study locations from the IRCC DLI list or official institution program catalogues. These records do not claim that every program is offered at every listed location.
            </p>
            <div className="mt-4"><LocationList locations={institution.campuses} total={institution.campusCount} /></div>
          </section>

          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[16px] font-semibold text-[#1b1b1b]">Published-program evidence</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#fafaf8] p-4">
                <p className="text-[20px] font-semibold text-[#1b1b1b]">{publication.indexableCount.toLocaleString()}</p>
                <p className="mt-1 text-[10.5px] leading-4 text-[#8b8881]">Official program page verified</p>
              </div>
              <div className="rounded-xl bg-[#fafaf8] p-4">
                <p className="text-[20px] font-semibold text-[#1b1b1b]">{publication.pgwpEligibleCount.toLocaleString()}</p>
                <p className="mt-1 text-[10.5px] leading-4 text-[#8b8881]">PGWP eligible</p>
              </div>
              <div className="rounded-xl bg-[#fafaf8] p-4">
                <p className="text-[20px] font-semibold text-[#1b1b1b]">{publication.pgwpUnknownCount.toLocaleString()}</p>
                <p className="mt-1 text-[10.5px] leading-4 text-[#8b8881]">PGWP not confirmed</p>
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center gap-2">
              <Landmark className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[14px] font-semibold text-[#1b1b1b]">Institution information</h2>
            </div>
            <dl className="mt-4 space-y-4">
              <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Country</dt><dd className="mt-1 text-[12.5px] font-medium text-[#4d4c48]">Canada</dd></div>
              {kind ? <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Verified type</dt><dd className="mt-1 text-[12.5px] font-medium text-[#4d4c48]">{kind}</dd></div> : null}
              {ownership ? <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Ownership</dt><dd className="mt-1 text-[12.5px] font-medium text-[#4d4c48]">{ownership}</dd></div> : null}
              {institution.cityNames.length ? <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Location areas</dt><dd className="mt-1 text-[12px] leading-5 text-[#4d4c48]">{institution.cityNames.join(", ")}</dd></div> : null}
              {institution.dliNumber ? (
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">DLI number</dt>
                  <dd className="mt-1 flex items-center gap-2 text-[12.5px] font-semibold text-[#4d4c48]">
                    {institution.dliNumber}
                    {dliSource ? <a href={dliSource} target="_blank" rel="noreferrer" aria-label="Open IRCC DLI source" className="text-[#3e7a2e]"><ExternalLink className="size-3.5" /></a> : null}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-2xl border border-[#e7e6e3] bg-[#fbfbf9] p-5">
            <h2 className="text-[12.5px] font-semibold text-[#4d4c48]">About this profile</h2>
            <p className="mt-2 text-[10.5px] leading-5 text-[#8b8881]">
              DLI identity is shown only when verified from IRCC. Published program counts are limited to CampCareer&apos;s reviewed 80-career Canada set. A DLI listing alone does not mean every program is PGWP eligible; program-level PGWP evidence is shown separately.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}
