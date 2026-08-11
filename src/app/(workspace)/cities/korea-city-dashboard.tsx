import Link from "next/link"
import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Clock3,
  ExternalLink,
  GraduationCap,
  Info,
  MapPin,
  TrainFront,
  Users,
  Wallet,
} from "lucide-react"
import type { KrCityProfile } from "@/lib/cities/kr-city-profile.server"

function money(value: number, currency = "KRW") {
  return new Intl.NumberFormat("en-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-KR", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function readable(value: string) {
  return value.replaceAll("_", " ")
}

export function KoreaCityDashboard({ profile }: { profile: KrCityProfile }) {
  const livingValue = profile.livingCost
    ? `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)}`
    : "—"
  const transportValue = profile.transport
    ? `${money(profile.transport.amount, profile.transport.currency)} / ${readable(profile.transport.period)}`
    : "—"

  return <div>
    <section className="bg-gradient-to-br from-[#172554] via-[#1e3a8a] to-[#dc2626] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/75" aria-label="Breadcrumb">
          <Link href="/countries" className="hover:text-white">Countries</Link>
          <span>/</span>
          <Link href="/countries/kr" className="hover:text-white">South Korea</Link>
          <span>/</span>
          <span>{profile.name}</span>
        </nav>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">Cities · Phase 5 profile</p>
        <h1 className="mt-2 text-[38px] font-semibold leading-tight tracking-[-0.03em] sm:text-[48px]">{profile.name}</h1>
        <p className="mt-2 text-[14px] font-medium text-white/90">
          {profile.regionName} · {profile.scopeLabel} · MOIS {profile.adminCode}
        </p>
      </div>
    </section>

    <main className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
      <section className="-mt-8 rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
        <p className="text-[12px] font-semibold text-[#1e3a8a]">Student decision snapshot</p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Verified administrative-city evidence for {profile.name}</h2>
        <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-[#77746e]">
          Route identity and population use the Phase 2 MOIS administrative boundary. Multi-campus university brands do not merge Seoul, Suwon or Yongin, and programme delivery is linked only through exact Study in Korea source-city evidence plus verified teaching locations.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10.5px] font-semibold text-[#5d6470]">
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedInstitutionCount} verified provider representatives</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedCampusCount} verified teaching locations</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedProgramCount} strict city-linked programmes</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">5 verified metrics</span>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
          <div className="flex items-center gap-2 text-[#77746e]"><Users className="size-4 text-[#1e3a8a]" /><p className="text-[11px] font-semibold uppercase tracking-[0.08em]">Population</p></div>
          <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{profile.population ? compact(profile.population.amount) : "—"}</p>
          <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf} · resident registration` : "Verified population unavailable"}</p>
        </article>

        <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
          <div className="flex items-center gap-2 text-[#77746e]"><Wallet className="size-4 text-[#a56b00]" /><p className="text-[11px] font-semibold uppercase tracking-[0.08em]">Living-cost planning</p></div>
          <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{livingValue}</p>
          <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">National Study in Korea baseline · not city-specific · not ranking-safe</p>
        </article>

        <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
          <div className="flex items-center gap-2 text-[#77746e]"><TrainFront className="size-4 text-[#6655aa]" /><p className="text-[11px] font-semibold uppercase tracking-[0.08em]">Transport reference</p></div>
          <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{transportValue}</p>
          <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{profile.transport?.mode ? `${readable(profile.transport.mode)} · ` : ""}source-native single-ride reference</p>
        </article>

        <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
          <div className="flex items-center gap-2 text-[#77746e]"><Clock3 className="size-4 text-[#3e7a2e]" /><p className="text-[11px] font-semibold uppercase tracking-[0.08em]">Student work context</p></div>
          <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{profile.workRights ? `${profile.workRights.hoursNormalPeriod} h / ${readable(profile.workRights.period)}` : "—"}</p>
          <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">Conditional national reference · not an automatic entitlement</p>
        </article>
      </div>

      <section className="mt-5 rounded-xl border border-[#dbe5f5] bg-[#f7f9fd] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-4 shrink-0 text-[#1e3a8a]" />
          <div>
            <h2 className="text-[14px] font-semibold text-[#172554]">{profile.programmeCoverage.label}</h2>
            <p className="mt-1 text-[11.5px] leading-5 text-[#5e6f91]">{profile.programmeCoverage.detail}</p>
            <p className="mt-1 text-[11.5px] leading-5 text-[#5e6f91]">Current institution coverage is a selected Study in Korea provider foundation. It must not be presented as the complete higher-education universe of the city.</p>
          </div>
        </div>
      </section>

      {profile.livingCost?.note ? <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5">
        <h2 className="text-[14px] font-semibold">Living-cost methodology</h2>
        <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{profile.livingCost.note}</p>
      </section> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[#1e3a8a]">
              <GraduationCap className="size-4" />
              <h2 className="text-[15px] font-semibold">Verified teaching-location representatives</h2>
              <span className="ml-auto text-[10.5px] font-semibold">{profile.linkedInstitutionCount} institutions</span>
            </div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Official teaching-location evidence is verified for each entry. This is not a complete campus inventory.</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {profile.institutions.map((institution) => <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
                <div className="flex gap-3">
                  <Building2 className="mt-1 size-4 shrink-0 text-[#1e3a8a]" />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold leading-5">{institution.name}</p>
                    <p className="mt-0.5 break-all text-[10.5px] text-[#8f8c85]">{institution.authorityIdentifierSystem}: {institution.authorityIdentifier}</p>
                    {institution.locations.map((location) => <a key={location.id} href={location.sourceUrl} target="_blank" rel="noreferrer" className="mt-1.5 flex gap-1 text-[10.5px] text-[#77746e] hover:underline">
                      <MapPin className="mt-0.5 size-3 shrink-0" />
                      <span>{location.name}{location.programmeAssignmentVerified ? " · programme linkage verified" : " · programme linkage pending"}</span>
                      <ExternalLink className="mt-0.5 size-3 shrink-0" />
                    </a>)}
                    {institution.websiteUrl ? <a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10.5px] font-semibold text-[#1e3a8a] hover:underline">Official site <ExternalLink className="inline size-3" /></a> : null}
                  </div>
                </div>
              </article>)}
            </div>
          </section>

          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[#6655aa]"><BookOpen className="size-4" /><h2 className="text-[15px] font-semibold">Verified programme sample</h2></div>
            {profile.programmeSample.length ? <>
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Up to 8 examples from {profile.linkedProgramCount} strict city-linked Study in Korea programmes. The count remains verified-partial.</p>
              <div className="mt-4 space-y-2">
                {profile.programmeSample.map((programme) => <a key={programme.id} href={programme.officialUrl} target="_blank" rel="noreferrer" className="block rounded-lg border border-[#eeece8] bg-[#fafaf8] px-3.5 py-3 hover:border-[#d7d3cc]">
                  <p className="text-[12px] font-semibold leading-5">{programme.title}</p>
                  <p className="mt-0.5 text-[10.5px] text-[#77746e]">{programme.institutionName} · {programme.locationName}{programme.sourceDegreeLevel ? ` · ${programme.sourceDegreeLevel}` : ""}</p>
                </a>)}
              </div>
            </> : <p className="mt-2 rounded-lg bg-[#fafaf8] p-4 text-[11.5px] leading-5 text-[#77746e]">No programme count is published for this city yet. This means verification is pending, not that the city has no programmes.</p>}
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center gap-2 text-[#3e7a2e]"><BriefcaseBusiness className="size-4" /><h2 className="text-[14.5px] font-semibold">Economic context</h2></div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{profile.employmentSectorBasis}. Official local strategy context only, not a shortage ranking or job guarantee.</p>
            <div className="mt-3 flex flex-wrap gap-2">{profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>)}</div>
          </section>

          <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
            <h2 className="text-[14.5px] font-semibold">Student work context</h2>
            <p className="mt-2 text-[11.5px] leading-5 text-[#5e6f91]">{profile.workRights?.note ?? "Verified national student work-rule context unavailable."}</p>
          </section>

          <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
            <h2 className="text-[14.5px] font-semibold">Metric sources</h2>
            <div className="mt-3 space-y-2">{profile.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-white px-3 py-2.5 text-[10.5px] leading-4 text-[#5e6f91] hover:underline">{source.name} · {source.dataAsOf}</a>)}</div>
          </section>
        </div>
      </div>
    </main>
  </div>
}
