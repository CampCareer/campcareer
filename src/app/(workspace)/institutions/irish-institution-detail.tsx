import Link from "next/link"
import { ExternalLink, GraduationCap, Landmark, MapPin } from "lucide-react"
import { InstitutionLogo } from "@/components/institution-logo"
import { institutionCountryPath } from "@/lib/institutions/institution-search"
import type {
  InstitutionCountBreakdown,
  InstitutionDetail,
  InstitutionProgrammePreview,
} from "@/lib/institutions/institution-detail.server"

function safeUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
  } catch {
    return null
  }
}

function kindLabel(value: string | null) {
  if (value === "university") return "University"
  if (value === "college") return "College"
  if (value === "polytechnic") return "Polytechnic"
  if (value === "tafe_vet") return "TAFE / VET"
  if (value === "other") return "Other education provider"
  return null
}

function ownershipLabel(value: string | null) {
  if (value === "public") return "Public"
  if (value === "private") return "Private"
  if (value === "private_nonprofit") return "Private nonprofit"
  if (value === "private_forprofit") return "Private for-profit"
  return null
}

function identityLabel(system: string | null) {
  if (system === "IE_HEA_LISTED_HEI_NAME") return "HEA-listed institution"
  if (system === "IE_QQI_REVIEWED_PRIVATE_HEI_NAME" || system === "IE_QQI_PRIVATE_HEI_NAME") return "QQI private HEI"
  if (system === "IE_QQI_CENTRE_NAME") return "QQI FET centre"
  if (system === "IE_QQI_PROVIDER_NAME") return "QQI provider"
  if (system === "IE_OFFICIAL_PROVIDER_NAME") return "Official provider identity"
  return "Verified identity"
}

function cleanLabel(value: string) {
  return value.replace(/\.\s*$/, "")
}

function Breakdown({ items }: { items: InstitutionCountBreakdown[] }) {
  if (!items.length) return <p className="text-[11.5px] text-[#8b8881]">Not currently classified.</p>
  return (
    <div className="divide-y divide-[#efeee9]">
      {items.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-4 py-2.5">
          <span className="text-[12px] text-[#4d4c48]">{cleanLabel(item.name)}</span>
          <span className="rounded-full bg-[#f4f4f1] px-2 py-1 text-[10px] font-semibold text-[#77746e]">{item.count}</span>
        </div>
      ))}
    </div>
  )
}

function ProgramCard({ program }: { program: InstitutionProgrammePreview }) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-[#fbfbf9] p-4">
      {program.programmeType ? (
        <span className="rounded-md bg-[#f4f4f1] px-2 py-1 text-[9.5px] font-semibold uppercase tracking-wide text-[#77746e]">
          {program.programmeType}
        </span>
      ) : null}
      <h3 className="mt-2 text-[13px] font-semibold leading-5 text-[#1b1b1b]">{program.title}</h3>
      {program.fieldName ? <p className="mt-1 text-[11px] leading-4 text-[#77746e]">{cleanLabel(program.fieldName)}</p> : null}
      <p className="mt-3 text-[10px] font-medium text-[#aaa7a0]">Program detail page not yet published</p>
    </article>
  )
}

export function IrishInstitutionDetailView({ institution }: { institution: InstitutionDetail }) {
  const website = safeUrl(institution.websiteUrl)
  const identitySource = safeUrl(institution.identitySourceUrl)
  const operatorWebsite = safeUrl(institution.operatorWebsiteUrl)
  const operatorSource = safeUrl(institution.operatorSourceUrl)
  const kind = kindLabel(institution.institutionKind)
  const ownership = ownershipLabel(institution.ownershipType)

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#8f8c85]">
        <Link href="/institutions" className="transition hover:text-[#3e7a2e]">Institutions</Link>
        <span>/</span>
        <Link href={institutionCountryPath("IE")} className="transition hover:text-[#3e7a2e]">Ireland</Link>
        <span>/</span>
        <span className="truncate text-[#5f5d58]">{institution.name}</span>
      </nav>

      <header className="mt-5 rounded-2xl border border-[#e7e6e3] bg-white p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <InstitutionLogo name={institution.name} logoUrl={institution.logoUrl} size="detail" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">Ireland institution</p>
              <h1 className="mt-2 max-w-3xl text-[27px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-3xl">{institution.name}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {kind ? <span className="rounded-full bg-[#edf5ea] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{kind}</span> : null}
                {ownership ? <span className="rounded-full border border-[#e3e2dd] px-3 py-1.5 text-[11px] font-medium text-[#686660]">{ownership}</span> : null}
              </div>
            </div>
          </div>
          {website ? (
            <a href={website} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#326625]">
              Official website <ExternalLink className="size-3.5" />
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#fafaf8] p-4"><GraduationCap className="size-4 text-[#3e7a2e]" /><p className="mt-2 text-[22px] font-semibold text-[#1b1b1b]">{institution.programCount.toLocaleString()}</p><p className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Active programs</p></div>
          <div className="rounded-xl bg-[#fafaf8] p-4"><MapPin className="size-4 text-[#3e7a2e]" /><p className="mt-2 text-[22px] font-semibold text-[#1b1b1b]">{institution.campusCount.toLocaleString()}</p><p className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Location records</p></div>
          <div className="rounded-xl bg-[#fafaf8] p-4"><MapPin className="size-4 text-[#3e7a2e]" /><p className="mt-2 text-[22px] font-semibold text-[#1b1b1b]">{institution.cityCount.toLocaleString()}</p><p className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Location areas</p></div>
        </div>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)] lg:items-start">
        <main className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2"><GraduationCap className="size-4 text-[#3e7a2e]" /><h2 className="text-[16px] font-semibold text-[#1b1b1b]">Programs</h2></div>
            <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">Active canonical programs connected to this institution. Ireland program detail routes are not created until that public surface is ready.</p>
            {institution.programs.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{institution.programs.map((program) => <ProgramCard key={program.id} program={program} />)}</div> : <p className="mt-4 text-[12px] text-[#8b8881]">No active program records are currently published for this institution.</p>}
          </section>

          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2"><MapPin className="size-4 text-[#3e7a2e]" /><h2 className="text-[16px] font-semibold text-[#1b1b1b]">Locations</h2></div>
            <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">Official institution locations are preferred. Where a complete official inventory has not yet been curated, CampCareer falls back to the source-reported Qualifax location without claiming it is a complete campus list.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {institution.campuses.map((location) => {
                const locationUrl = safeUrl(location.officialUrl)
                const place = [location.city ?? location.reportedCity, location.region].filter(Boolean).join(", ")
                const address = [location.address, location.postalCode].filter(Boolean).join(" ")
                return (
                  <article key={location.id} className="rounded-xl border border-[#e7e6e3] bg-white p-4">
                    <h3 className="text-[13px] font-semibold text-[#1b1b1b]">{location.name ?? "Location"}</h3>
                    {place ? <p className="mt-1 text-[11.5px] text-[#6f6d68]">{place}</p> : null}
                    {address ? <p className="mt-1 text-[10.5px] leading-4 text-[#9a9790]">{address}</p> : null}
                    {locationUrl ? <a href={locationUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#3e7a2e] hover:underline">Official location source <ExternalLink className="size-3" /></a> : null}
                  </article>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <h2 className="text-[16px] font-semibold text-[#1b1b1b]">Program profile</h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div><h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b8881]">Study areas</h3><Breakdown items={institution.studyAreas} /></div>
              <div><h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b8881]">Program types</h3><Breakdown items={institution.programmeTypes} /></div>
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center gap-2"><Landmark className="size-4 text-[#3e7a2e]" /><h2 className="text-[14px] font-semibold text-[#1b1b1b]">Institution information</h2></div>
            <dl className="mt-4 space-y-4">
              <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Verified identity</dt><dd className="mt-1 text-[12.5px] font-medium text-[#4d4c48]">{identityLabel(institution.identitySystem)}</dd>{institution.identityValue ? <dd className="mt-0.5 text-[11px] text-[#77746e]">{institution.identityValue}</dd> : null}{identitySource ? <dd className="mt-1"><a href={identitySource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#3e7a2e] hover:underline">Identity source <ExternalLink className="size-3" /></a></dd> : null}</div>
              {institution.operatorName ? <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Operated by</dt><dd className="mt-1 text-[12.5px] font-medium text-[#4d4c48]">{institution.operatorName}</dd><dd className="mt-1 flex gap-3">{operatorWebsite ? <a href={operatorWebsite} target="_blank" rel="noreferrer" className="text-[10.5px] font-semibold text-[#3e7a2e] hover:underline">ETB website</a> : null}{operatorSource ? <a href={operatorSource} target="_blank" rel="noreferrer" className="text-[10.5px] font-semibold text-[#3e7a2e] hover:underline">Relationship source</a> : null}</dd></div> : null}
              {institution.cityNames.length ? <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Location areas</dt><dd className="mt-1 text-[12px] leading-5 text-[#4d4c48]">{institution.cityNames.join(", ")}</dd></div> : null}
            </dl>
          </section>
          <section className="rounded-2xl border border-[#e7e6e3] bg-[#fbfbf9] p-5"><h2 className="text-[12.5px] font-semibold text-[#4d4c48]">About this profile</h2><p className="mt-2 text-[10.5px] leading-5 text-[#8b8881]">Ireland profiles are published only when a current HEA, QQI or official provider identity can be sourced. Administrative ETB operators are modeled separately from learner-facing institutions.</p></section>
        </aside>
      </div>
    </>
  )
}
