import Link from "next/link"
import { Building2, ExternalLink, GraduationCap, Landmark, MapPin } from "lucide-react"
import { InstitutionLogo } from "@/components/institution-logo"
import { institutionCountryPath } from "@/lib/institutions/institution-search"
import type { UsInstitutionDetailResult } from "@/lib/institutions/us-institution-detail.server"

function safeUrl(value: string | null) {
  if (!value) return null
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null } catch { return null }
}

export function UsInstitutionDetailView({ result }: { result: UsInstitutionDetailResult }) {
  const { institution, identity } = result
  const website = safeUrl(institution.websiteUrl)
  const unitidSource = safeUrl(identity.unitidSourceUrl)
  const selectionSource = safeUrl(identity.selectionSourceUrl)
  const countryPath = institutionCountryPath("US")

  return <>
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#8f8c85]">
      <Link href="/institutions" className="transition hover:text-[#3e7a2e]">Institutions</Link><span>/</span>
      <Link href={countryPath} className="transition hover:text-[#3e7a2e]">United States</Link><span>/</span>
      <span className="truncate text-[#5f5d58]">{institution.name}</span>
    </nav>

    <header className="mt-5 rounded-2xl border border-[#e7e6e3] bg-white p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <InstitutionLogo name={institution.name} logoUrl={institution.logoUrl} size="detail" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">US research university launch cohort</p>
            <h1 className="mt-2 max-w-3xl text-[27px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-3xl">{institution.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#edf5ea] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">NCES / IPEDS verified</span>
              <span className="rounded-full border border-[#e3e2dd] px-3 py-1.5 text-[11px] font-medium text-[#686660]">UNITID {identity.unitid}</span>
            </div>
          </div>
        </div>
        {website ? <a href={website} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#326625]">Official website<ExternalLink className="size-3.5" /></a> : null}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#fafaf8] p-4"><GraduationCap className="size-4 text-[#3e7a2e]" /><p className="mt-2 text-[16px] font-semibold text-[#1b1b1b]">Pending</p><p className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Program catalogue</p></div>
        <div className="rounded-xl bg-[#fafaf8] p-4"><Building2 className="size-4 text-[#3e7a2e]" /><p className="mt-2 text-[22px] font-semibold text-[#1b1b1b]">{institution.campusCount.toLocaleString()}</p><p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">Publication locations</p></div>
        <div className="rounded-xl bg-[#fafaf8] p-4"><Landmark className="size-4 text-[#3e7a2e]" /><p className="mt-2 text-[22px] font-semibold text-[#1b1b1b]">#{identity.ncsesRank}</p><p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#929089]">FY2024 federal S&amp;E support</p></div>
      </div>
    </header>

    <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)] lg:items-start">
      <main className="min-w-0 space-y-5">
        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2"><GraduationCap className="size-4 text-[#3e7a2e]" /><h2 className="text-[16px] font-semibold text-[#1b1b1b]">Programs</h2></div>
          <div className="mt-4 rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-6"><p className="text-[12px] leading-5 text-[#77746e]">CampCareer has not published the US degree-program catalogue yet. The existing US CIP outcome dataset is not treated as a degree catalogue, so zero canonical program records do not mean this university offers no programs.</p></div>
        </section>
        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2"><MapPin className="size-4 text-[#3e7a2e]" /><h2 className="text-[16px] font-semibold text-[#1b1b1b]">IPEDS publication location</h2></div>
          <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">This city/state record supports publication only. It is not a complete campus inventory or an inferred street-level coordinate.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{institution.campuses.map((location) => <article key={location.id} className="rounded-xl border border-[#e7e6e3] bg-white p-4"><div className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#3e7a2e]" /><div><h3 className="text-[13px] font-semibold text-[#1b1b1b]">{location.city ?? location.reportedCity ?? "Verified city"}</h3><p className="mt-1 text-[11.5px] text-[#6f6d68]">{location.region ?? "United States"}</p></div></div></article>)}</div>
        </section>
      </main>
      <aside className="space-y-5">
        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5">
          <div className="flex items-center gap-2"><Landmark className="size-4 text-[#3e7a2e]" /><h2 className="text-[14px] font-semibold text-[#1b1b1b]">Source information</h2></div>
          <dl className="mt-4 space-y-4">
            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">IPEDS UNITID</dt><dd className="mt-1 flex items-center gap-2 text-[12.5px] font-medium text-[#4d4c48]">{identity.unitid}{unitidSource ? <a href={unitidSource} target="_blank" rel="noreferrer" className="text-[#3e7a2e]" aria-label="Open IPEDS source"><ExternalLink className="size-3.5" /></a> : null}</dd></div>
            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#aaa7a0]">Launch cohort basis</dt><dd className="mt-1 flex items-center gap-2 text-[12.5px] font-medium text-[#4d4c48]">NCSES FY2024 federal S&amp;E support top 25{selectionSource ? <a href={selectionSource} target="_blank" rel="noreferrer" className="text-[#3e7a2e]" aria-label="Open NCSES source"><ExternalLink className="size-3.5" /></a> : null}</dd></div>
          </dl>
        </section>
      </aside>
    </div>
  </>
}
