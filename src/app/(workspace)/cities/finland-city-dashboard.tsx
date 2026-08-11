import Link from "next/link"
import { BookOpen, BriefcaseBusiness, Building2, Clock3, ExternalLink, GraduationCap, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { FiCityProfile } from "@/lib/cities/fi-city-profile.server"

function money(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-FI", { style: "currency", currency, maximumFractionDigits: value % 1 ? 2 : 0 }).format(value)
}
function compact(value: number) {
  return new Intl.NumberFormat("en-FI", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}
function period(value: string) { return value.replaceAll("_", " ") }

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
    <div className="flex items-center gap-2 text-[#77746e]">{icon}<p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p></div>
    <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
    <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{note}</p>
  </article>
}

export function FinlandCityDashboard({ profile }: { profile: FiCityProfile }) {
  const living = profile.livingCost ? `${money(profile.livingCost.low)}–${money(profile.livingCost.high)}` : "—"
  const transport = profile.transport ? `${money(profile.transport.amount)} / ${period(profile.transport.period)}` : "—"

  return <div>
    <section className="bg-gradient-to-br from-[#0b4f6c] via-[#157a8a] to-[#d5eef2] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/75" aria-label="Breadcrumb">
          <Link href="/countries" className="hover:text-white">Countries</Link><span>/</span>
          <Link href="/countries/fi" className="hover:text-white">Finland</Link><span>/</span><span>{profile.name}</span>
        </nav>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">Cities · Phase 5 profile</p>
        <h1 className="mt-2 text-[38px] font-semibold leading-tight tracking-[-0.03em] sm:text-[48px]">{profile.name}</h1>
        <p className="mt-2 text-[14px] font-medium text-white/90">{profile.regionName} · {profile.scopeLabel} · Statistics Finland {profile.municipalityCode}</p>
      </div>
    </section>

    <main className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
      <section className="-mt-8 rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
        <p className="text-[12px] font-semibold text-[#157a8a]">Student decision snapshot</p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Verified municipality evidence for {profile.name}</h2>
        <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-[#77746e]">Population, study-location membership and route identity use the exact Statistics Finland municipality boundary. Helsinki and Espoo are not silently combined into a metropolitan geography.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10.5px] font-semibold text-[#5d6470]">
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedInstitutionCount} verified university-core institutions</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedCampusCount} verified study-location representatives</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedProgramCount} verified-partial programmes</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">5 verified metrics</span>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Users className="size-4 text-[#157a8a]" />} label="Population" value={profile.population ? compact(profile.population.amount) : "—"} note={profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}` : "Verified population unavailable"} />
        <MetricCard icon={<Wallet className="size-4 text-[#a56b00]" />} label="Student living" value={living} note={profile.livingCost?.citySpecific ? "City-specific monthly reference" : "National planning range · not a measured city cost ranking"} />
        <MetricCard icon={<TrainFront className="size-4 text-[#6655aa]" />} label="Student transport" value={transport} note={profile.transport?.note ?? "Source-native local operator reference"} />
        <MetricCard icon={<Clock3 className="size-4 text-[#3e7a2e]" />} label="Student permit work" value={profile.workRights ? `${profile.workRights.hoursNormalPeriod} h / ${period(profile.workRights.period)}` : "—"} note="National Migri residence-permit context · not a city differentiator" />
      </div>

      <section className="mt-5 rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5 sm:p-6">
        <div className="flex items-start gap-3"><Info className="mt-0.5 size-4 shrink-0 text-[#a86514]" /><div>
          <h2 className="text-[14px] font-semibold text-[#5d3a0b]">{profile.programmeCoverage.label}</h2>
          <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">{profile.programmeCoverage.detail}</p>
          <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">The current provider foundation is a selected ten-university core, not Finland&apos;s complete recognised HEI/UAS universe. Institution identity is still name-based provisional while Studyinfo organisation OID reconciliation remains pending.</p>
          <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">Source-native degree levels may be shown below; canonical `qualification_level_id` repair is still pending.</p>
        </div></div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[#157a8a]"><GraduationCap className="size-4" /><h2 className="text-[15px] font-semibold">Verified university study locations</h2><span className="ml-auto text-[10.5px] font-semibold">{profile.linkedInstitutionCount} institutions</span></div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Each row is a verified city study-location representative for the current university core. It is not a complete physical-campus inventory.</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">{profile.institutions.map((institution) => <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
              <div className="flex gap-3"><Building2 className="mt-1 size-4 shrink-0 text-[#157a8a]" /><div className="min-w-0">
                <p className="text-[12.5px] font-semibold leading-5">{institution.name}</p>
                <p className="mt-0.5 text-[10.5px] text-[#8f8c85]">{institution.authorityIdentifierSystem}: {institution.authorityIdentifier} · provisional identity</p>
                {institution.locations.map((location) => <a key={location.id} href={location.sourceUrl} target="_blank" rel="noreferrer" className="mt-1.5 flex gap-1 text-[10.5px] text-[#77746e] hover:underline"><MapPin className="mt-0.5 size-3 shrink-0" />{location.name} <ExternalLink className="mt-0.5 size-3 shrink-0" /></a>)}
                {institution.websiteUrl ? <a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10.5px] font-semibold text-[#157a8a] hover:underline">Official site <ExternalLink className="inline size-3" /></a> : null}
              </div></div>
            </article>)}</div>
          </section>

          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[#6655aa]"><BookOpen className="size-4" /><h2 className="text-[15px] font-semibold">Verified programme sample</h2></div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Up to 8 alphabetical examples from {profile.linkedProgramCount} exact source-city matched programmes. Counts remain verified-partial because UAS and other recognised-provider coverage is incomplete.</p>
            <div className="mt-4 space-y-2">{profile.programmeSample.map((programme) => <a key={programme.id} href={programme.officialUrl} target="_blank" rel="noreferrer" className="block rounded-lg border border-[#eeece8] bg-[#fafaf8] px-3.5 py-3 hover:border-[#d7d3cc]">
              <p className="text-[12px] font-semibold leading-5">{programme.title}</p>
              <p className="mt-0.5 text-[10.5px] text-[#77746e]">{programme.institutionName} · {programme.locationName}{programme.sourceDegreeLevel ? ` · ${programme.sourceDegreeLevel}` : ""}</p>
            </a>)}</div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5"><div className="flex items-center gap-2 text-[#3e7a2e]"><BriefcaseBusiness className="size-4" /><h2 className="text-[14.5px] font-semibold">Career environment</h2></div><p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{profile.employmentSectorBasis}. Context only — not a shortage ranking or employment guarantee.</p><div className="mt-3 flex flex-wrap gap-2">{profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>)}</div></section>
          <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5"><h2 className="text-[14.5px] font-semibold">Student work context</h2><p className="mt-2 text-[11.5px] leading-5 text-[#5e6f91]">{profile.workRights?.note ?? "Verified national student work-rule context unavailable."}</p></section>
          <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5"><h2 className="text-[14.5px] font-semibold">Metric sources</h2><div className="mt-3 space-y-2">{profile.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-white px-3 py-2.5 text-[10.5px] leading-4 text-[#5e6f91] hover:underline">{source.name} · {source.dataAsOf}</a>)}</div></section>
        </div>
      </div>
    </main>
  </div>
}
