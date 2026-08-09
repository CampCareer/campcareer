import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  ExternalLink,
  GraduationCap,
  Info,
  TrainFront,
  Users,
  Wallet,
} from "lucide-react"
import type { UsCityProfile } from "@/lib/cities/us-city-profile.server"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

function money(value: number, currency = "USD", decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function periodLabel(period: string) {
  return period.replaceAll("_", " ")
}

function livingValue(profile: UsCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
    return `~${money(profile.livingCost.low, profile.livingCost.currency)}`
  }
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)}`
}

function transportValue(profile: UsCityProfile) {
  if (!profile.transport) return "—"
  const decimals = profile.transport.referenceAmount % 1 === 0 ? 0 : 2
  return `${money(profile.transport.referenceAmount, profile.transport.currency, decimals)} / ${periodLabel(profile.transport.period)}`
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2 text-[#77746e]">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p>
      </div>
      <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{note}</p>
    </article>
  )
}

export function UnitedStatesCityDashboard({ profile }: { profile: UsCityProfile }) {
  const compareReady = Boolean(
    profile.population &&
      profile.livingCost &&
      profile.transport &&
      profile.workRights &&
      profile.employmentSectors.length > 0 &&
      profile.linkedCampusCount > 0 &&
      profile.linkedInstitutionCount > 0,
  )
  const compareHref = buildCityCompareCanonicalHref({ country: "US", left: profile.slug })

  return (
    <div>
      <section className="bg-gradient-to-br from-[#172033] via-[#25364f] to-[#344f70] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/70" aria-label="Breadcrumb">
            <Link href="/countries" className="hover:text-white">Countries</Link>
            <span>/</span>
            <Link href="/countries/us" className="hover:text-white">United States</Link>
            <span>/</span>
            <span>{profile.regionName}</span>
          </nav>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Cities</p>
          <h1 className="mt-2 text-[38px] font-semibold leading-tight tracking-[-0.03em] sm:text-[48px]">{profile.name}</h1>
          <p className="mt-2 text-[14px] font-medium text-white/85">{profile.regionName} · {profile.countryName} · named-city scope</p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
        <section className="-mt-8 rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#2563eb]">Student decision snapshot</p>
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Study destination evidence for {profile.name}</h2>
              <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-[#77746e]">
                This profile uses the approved named-city geography. Neighbouring municipalities, boroughs and metro areas are not added unless explicit canonical campus evidence supports the city link.
              </p>
            </div>
            {compareReady ? (
              <Link href={compareHref} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#bfcff0] px-3.5 py-2 text-[11.5px] font-semibold text-[#2563eb] hover:bg-[#f7f9fe]">
                Compare {profile.name} <ArrowRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<Users className="size-4 text-[#2563eb]" />} label="Population" value={profile.population ? compact(profile.population.amount) : "—"} note={profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}` : "Verified population unavailable"} />
          <MetricCard icon={<Wallet className="size-4 text-[#c2691e]" />} label="Student living" value={livingValue(profile)} note={profile.livingCost ? `Indicative monthly USD reference · tuition excluded${profile.livingCost.summerReference ? " · summer reference" : ""}` : "Verified student living reference unavailable"} />
          <MetricCard icon={<TrainFront className="size-4 text-[#6d4fc4]" />} label="Student transport" value={transportValue(profile)} note={profile.transport ? `Source-native fare period${profile.transport.eligibilityRequired ? " · student eligibility required" : ""}` : "Verified transport reference unavailable"} />
          <MetricCard icon={<Clock3 className="size-4 text-[#3e7a2e]" />} label="F-1 student work" value={profile.workRights ? `${profile.workRights.hours} h / week` : "—"} note="On-campus during academic sessions; off-campus work requires separate authorization" />
        </div>

        <section className="mt-5 rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-4 shrink-0 text-[#a86514]" />
            <div>
              <h2 className="text-[14px] font-semibold text-[#5d3a0b]">{profile.programmeCoverage.label}</h2>
              <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">{profile.programmeCoverage.detail}</p>
              <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">
                The value in the linkage table is therefore not presented as “0 programmes”. Programme delivery will appear only after explicit campus offering evidence is published.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[#2563eb]">
              <GraduationCap className="size-4" />
              <h2 className="text-[15px] font-semibold">Canonical institutions with {profile.name} locations</h2>
              <span className="ml-auto rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10.5px] font-semibold text-[#2563eb]">
                {profile.linkedInstitutionCount} institutions · {profile.linkedCampusCount} locations
              </span>
            </div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
              Membership is based on canonical campus geography links. Institution names are not geocoded or inferred from marketing-area labels.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {profile.institutions.map((institution) => (
                <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#2563eb] shadow-sm"><Building2 className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      {institution.profilePath ? (
                        <Link href={institution.profilePath} className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b] hover:text-[#2563eb] hover:underline">{institution.name}</Link>
                      ) : <p className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b]">{institution.name}</p>}
                      <p className="mt-0.5 text-[10.5px] text-[#8f8c85]">{institution.type ?? "Education provider"} · {institution.campuses.length} canonical {institution.campuses.length === 1 ? "location" : "locations"}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {institution.profilePath ? <Link href={institution.profilePath} className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2563eb] hover:underline">Institution profile <ArrowRight className="size-3" /></Link> : null}
                        {institution.websiteUrl ? <a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2563eb] hover:underline">Official site <ExternalLink className="size-3" /></a> : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
              <div className="flex items-center gap-2 text-[#3e7a2e]"><BriefcaseBusiness className="size-4" /><h2 className="text-[14.5px] font-semibold">Career environment</h2></div>
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Official economic-development focus sectors. These are not shortage rankings or employment guarantees.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>)}
              </div>
            </section>

            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
              <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Metric sources</h2>
              <div className="mt-3 space-y-2">
                {profile.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-white px-3 py-2.5 text-[10.5px] leading-4 text-[#5e6f91] hover:underline">
                    {source.name} · {source.dataAsOf}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
