import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  GraduationCap,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { InstitutionLogo } from "@/components/institution-logo"
import { institutionCountryPath } from "@/lib/institutions/institution-search"
import type { InstitutionDetail } from "@/lib/institutions/institution-detail.server"
import { caProgramDetailPath } from "@/lib/programs/program-search"

function safeWebsiteUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
  } catch {
    return null
  }
}

function kindLabel(kind: string | null) {
  if (kind === "university") return "University"
  if (kind === "college") return "College"
  if (kind === "polytechnic") return "Polytechnic"
  if (kind === "other") return "Other"
  return null
}

function ownershipLabel(ownership: string | null) {
  if (ownership === "public") return "Public"
  if (ownership === "private") return "Private"
  if (ownership === "private_nonprofit") return "Private nonprofit"
  if (ownership === "private_forprofit") return "Private for-profit"
  return null
}

export function CaInstitutionDetailView({ institution }: { institution: InstitutionDetail }) {
  const website = safeWebsiteUrl(institution.websiteUrl)
  const countryPath = institutionCountryPath("CA")
  const kind = kindLabel(institution.institutionKind)
  const ownership = ownershipLabel(institution.ownershipType)

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#8f8c85]">
        <Link href="/institutions" className="transition hover:text-[#3e7a2e]">Institutions</Link>
        <span>/</span>
        <Link href={countryPath} className="transition hover:text-[#3e7a2e]">Canada</Link>
        <span>/</span>
        <span className="truncate text-[#5f5d58]">{institution.name}</span>
      </nav>

      <header className="mt-5 rounded-2xl border border-[#e7e6e3] bg-white p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <InstitutionLogo name={institution.name} logoUrl={institution.logoUrl} size="detail" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">Canada institution</p>
              <h1 className="mt-2 max-w-3xl text-[27px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-3xl">
                {institution.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {kind && <span className="rounded-full bg-[#edf5ea] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{kind}</span>}
                {ownership && <span className="rounded-full border border-[#e3e2dd] px-3 py-1.5 text-[11px] font-medium text-[#686660]">{ownership}</span>}
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-semibold text-[#2563eb]">
                  <ShieldCheck className="size-3" /> Phase 3 publication scope
                </span>
              </div>
            </div>
          </div>

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#326625]"
            >
              Official website <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric icon={<GraduationCap className="size-4" />} value={institution.programCount} label="Published target programs" />
          <Metric icon={<Building2 className="size-4" />} value={institution.campusCount} label="Campus records" />
          <Metric icon={<MapPin className="size-4" />} value={institution.cityCount} label="Normalized cities" />
        </div>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)] lg:items-start">
        <main className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[16px] font-semibold text-[#1b1b1b]">Published target programs</h2>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">
              Only Canada programs with an approved relationship to one of the 80 target careers and a public Tier A/B decision are shown here.
            </p>

            {institution.programs.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-6">
                <p className="text-[12px] text-[#77746e]">No target programs at this institution currently meet the Canada publication gate.</p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {institution.programs.map((program) => {
                  const href = program.legacyProgramId
                    ? caProgramDetailPath(program.legacyProgramId, program.title)
                    : null

                  const body = (
                    <>
                      {program.programmeType && (
                        <span className="rounded-md bg-[#f4f4f1] px-2 py-1 text-[9.5px] font-semibold uppercase tracking-wide text-[#77746e]">
                          {program.programmeType}
                        </span>
                      )}
                      <h3 className="mt-2 text-[13px] font-semibold leading-5 text-[#1b1b1b]">{program.title}</h3>
                      {program.fieldName && <p className="mt-1 line-clamp-2 text-[11px] leading-4.5 text-[#77746e]">{program.fieldName}</p>}
                    </>
                  )

                  return href ? (
                    <Link key={program.id} href={href} className="group rounded-xl border border-[#e7e6e3] bg-white p-4 transition hover:border-[#bfcdb9] hover:shadow-sm">
                      {body}
                      <span className="mt-3 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#3e7a2e]">
                        View program <ArrowUpRight className="size-3" />
                      </span>
                    </Link>
                  ) : (
                    <article key={program.id} className="rounded-xl border border-[#e7e6e3] bg-[#fbfbf9] p-4">{body}</article>
                  )
                })}
              </div>
            )}

            {institution.programCount > institution.programs.length && (
              <Link
                href={`/programs?country=CA&q=${encodeURIComponent(institution.name)}`}
                className="mt-4 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#3e7a2e] hover:underline"
              >
                Browse all {institution.programCount.toLocaleString()} published target programs <ArrowUpRight className="size-3" />
              </Link>
            )}
          </section>

          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[16px] font-semibold text-[#1b1b1b]">Campuses</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {institution.campuses.length ? institution.campuses.map((campus) => (
                <article key={campus.id} className="rounded-xl border border-[#e7e6e3] bg-white p-4">
                  <p className="text-[13px] font-semibold text-[#1b1b1b]">{campus.name ?? "Campus"}</p>
                  <p className="mt-1 text-[11.5px] text-[#6f6d68]">
                    {[campus.city ?? campus.reportedCity, campus.region].filter(Boolean).join(", ") || "Location not published"}
                  </p>
                  {[campus.address, campus.postalCode].filter(Boolean).length > 0 && (
                    <p className="mt-1 text-[10.5px] text-[#9a9790]">{[campus.address, campus.postalCode].filter(Boolean).join(" ")}</p>
                  )}
                </article>
              )) : (
                <p className="text-[12px] text-[#77746e]">No campus records are currently published for this institution.</p>
              )}
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center gap-2">
              <Landmark className="size-4 text-[#3e7a2e]" />
              <h2 className="text-[14px] font-semibold text-[#1b1b1b]">Published program profile</h2>
            </div>
            <p className="mt-2 text-[10.5px] leading-5 text-[#8b8881]">
              These distributions are computed only from the public Tier A/B target-program set, not the institution&apos;s full catalogue.
            </p>
            <Breakdown title="Study areas" items={institution.studyAreas} />
            <Breakdown title="Program types" items={institution.programmeTypes} />
          </section>

          <section className="rounded-2xl border border-[#e7e6e3] bg-[#fbfbf9] p-5">
            <h2 className="text-[12.5px] font-semibold text-[#4d4c48]">About this Canada profile</h2>
            <p className="mt-2 text-[10.5px] leading-5 text-[#8b8881]">
              The institution identity and campus data remain source-backed. Program totals are intentionally narrower: only reviewed target programs that pass the Canada publication gate are counted.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-xl bg-[#fafaf8] p-4">
      <span className="text-[#3e7a2e]">{icon}</span>
      <p className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{value.toLocaleString()}</p>
      <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">{label}</p>
    </div>
  )
}

function Breakdown({ title, items }: { title: string; items: InstitutionDetail["studyAreas"] }) {
  return (
    <div className="mt-5">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">{title}</h3>
      <div className="mt-2 space-y-2">
        {items.slice(0, 8).map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-[11.5px]">
            <span className="min-w-0 truncate text-[#5f5d58]">{item.name}</span>
            <span className="shrink-0 font-semibold text-[#77746e]">{item.count}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-[11px] text-[#9b9891]">Not published</p>}
      </div>
    </div>
  )
}
