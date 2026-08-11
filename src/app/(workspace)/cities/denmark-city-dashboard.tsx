import Link from "next/link"
import {
  ArrowRight,
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
import type { DkCityProfile } from "@/lib/cities/dk-city-profile.server"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

function money(value: number, currency = "DKK") {
  return new Intl.NumberFormat("en-DK", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-DK", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function periodLabel(period: string) {
  return period.replaceAll("_", " ")
}

function livingValue(profile: DkCityProfile) {
  if (!profile.livingCost) return "—"
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)}`
}

function transportValue(profile: DkCityProfile) {
  if (!profile.transport) return "—"
  return `${money(profile.transport.amount, profile.transport.currency)} / ${periodLabel(profile.transport.period)}`
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2 text-[#77746e]">{icon}<p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p></div>
      <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{note}</p>
    </article>
  )
}

export function DenmarkCityDashboard({ profile }: { profile: DkCityProfile }) {
  const summerMonths = profile.workRights?.fullTimeMonths.join(", ") || "June, July, August"
  const compareReady = Boolean(
    profile.population && profile.livingCost && profile.transport && profile.workRights &&
    profile.employmentSectors.length > 0 && profile.linkedCampusCount > 0 && profile.linkedInstitutionCount > 0,
  )
  const compareHref = buildCityCompareCanonicalHref({ country: "DK", left: profile.slug })

  return (
    <div>
      <section className="bg-gradient-to-br from-[#6f1721] via-[#9d2633] to-[#c44a56] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/70" aria-label="Breadcrumb">
            <Link href="/countries" className="hover:text-white">Countries</Link><span>/</span>
            <Link href="/countries/dk" className="hover:text-white">Denmark</Link><span>/</span><span>{profile.regionName}</span>
          </nav>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Cities</p>
          <h1 className="mt-2 text-[38px] font-semibold leading-tight tracking-[-0.03em] sm:text-[48px]">{profile.name}</h1>
          <p className="mt-2 text-[14px] font-medium text-white/85">{profile.regionName} · {profile.scopeLabel} · municipality {profile.municipalityCode}</p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
        <section className="-mt-8 rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#9d2633]">Student decision snapshot</p>
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Verified municipality evidence for {profile.name}</h2>
              <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-[#77746e]">Campus membership and population use the {profile.scopeLabel} boundary. Copenhagen and Frederiksberg remain separate municipalities rather than being merged into a Greater Copenhagen study destination.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[10.5px] font-semibold text-[#5d6470]">
                <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedInstitutionCount} verified university institutions</span>
                <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedCampusCount} verified locations</span>
                <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedProgramCount} verified-partial programmes</span>
                <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">5 verified metrics</span>
              </div>
            </div>
            {compareReady ? (
              <Link href={compareHref} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e0b9bf] px-3.5 py-2 text-[11.5px] font-semibold text-[#9d2633] hover:bg-[#fff7f8]">
                Compare {profile.name} <ArrowRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<Users className="size-4 text-[#9d2633]" />} label="Population" value={profile.population ? compact(profile.population.amount) : "—"} note={profile.population ? `${profile.population.geography} · ${profile.population.quarter ?? profile.population.dataAsOf}` : "Verified population unavailable"} />
          <MetricCard icon={<Wallet className="size-4 text-[#b7661f]" />} label="Student living" value={livingValue(profile)} note={profile.livingCost?.citySpecific ? "City-specific monthly reference" : "Official national monthly student-budget baseline · not city-specific"} />
          <MetricCard icon={<TrainFront className="size-4 text-[#6d4fc4]" />} label="Public transport" value={transportValue(profile)} note={profile.transport ? "Source-native general adult fare reference · not a universal student concession" : "Verified transport reference unavailable"} />
          <MetricCard icon={<Clock3 className="size-4 text-[#3e7a2e]" />} label="Student permit work" value={profile.workRights ? `${profile.workRights.hoursNormalPeriod} h / ${profile.workRights.period}` : "—"} note="Relevant Danish student residence-permit context · the monthly cap is not converted to a weekly entitlement" />
        </div>

        <section className="mt-5 rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5 sm:p-6">
          <div className="flex items-start gap-3"><Info className="mt-0.5 size-4 shrink-0 text-[#a86514]" /><div>
            <h2 className="text-[14px] font-semibold text-[#5d3a0b]">{profile.programmeCoverage.label}</h2>
            <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">{profile.programmeCoverage.detail}</p>
            <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">Danish professional higher-education providers are still an explicit coverage gap; the current institution layer is a verified university core.</p>
          </div></div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
          <div className="space-y-5">
            <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[#9d2633]"><GraduationCap className="size-4" /><h2 className="text-[15px] font-semibold">Verified university locations</h2><span className="ml-auto rounded-full bg-[#fbf0f1] px-2.5 py-1 text-[10.5px] font-semibold text-[#9d2633]">{profile.linkedInstitutionCount} institutions · {profile.linkedCampusCount} locations</span></div>
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Every row uses canonical Danish ministry-backed university identity plus an official location source. This is not a complete inventory of all Danish higher-education providers.</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {profile.institutions.map((institution) => (
                  <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
                    <div className="flex items-start gap-3"><span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#9d2633] shadow-sm"><Building2 className="size-4" /></span><div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b]">{institution.name}</p>
                      <p className="mt-0.5 text-[10.5px] text-[#8f8c85]">UFM identity: {institution.authorityIdentifier}</p>
                      <div className="mt-2 space-y-1.5">{institution.campuses.map((campus) => <div key={campus.id} className="text-[10.5px] leading-4 text-[#77746e]"><div className="flex items-start gap-1.5"><MapPin className="mt-0.5 size-3 shrink-0" /><span>{campus.name}{campus.addressLine ? ` · ${campus.addressLine}` : ""}{campus.postalCode ? ` · ${campus.postalCode}` : ""}</span></div></div>)}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1"><a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#9d2633] hover:underline">Official site <ExternalLink className="size-3" /></a><a href={institution.authoritySourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#9d2633] hover:underline">UFM source <ExternalLink className="size-3" /></a></div>
                    </div></div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[#6d4fc4]"><BookOpen className="size-4" /><h2 className="text-[15px] font-semibold">Verified programme sample</h2></div>
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Showing up to 8 alphabetic examples from {profile.linkedProgramCount} programmes whose Study in Denmark source city matches a verified official location. This sample and total are verified partial coverage, not an exhaustive municipality catalogue.</p>
              <div className="mt-4 space-y-2">{profile.programmeSample.map((programme) => (
                <a key={programme.id} href={programme.officialUrl} target="_blank" rel="noreferrer" className="block rounded-lg border border-[#eeece8] bg-[#fafaf8] px-3.5 py-3 hover:border-[#d7d3cc]"><div className="flex items-start justify-between gap-3"><div><p className="text-[12px] font-semibold leading-5 text-[#1b1b1b]">{programme.title}</p><p className="mt-0.5 text-[10.5px] text-[#77746e]">{programme.institutionName} · {programme.campusName}{programme.type ? ` · ${programme.type}` : ""}</p></div><ExternalLink className="mt-0.5 size-3.5 shrink-0 text-[#8f8c85]" /></div></a>
              ))}</div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-xl border border-[#e7e6e3] bg-white p-5"><div className="flex items-center gap-2 text-[#3e7a2e]"><BriefcaseBusiness className="size-4" /><h2 className="text-[14.5px] font-semibold">Career environment</h2></div><p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{profile.employmentSectorBasis ?? "Official municipal economic context."} These are context signals, not shortage rankings or employment guarantees.</p><div className="mt-3 flex flex-wrap gap-2">{profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>)}</div></section>
            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5"><h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Student work context</h2><p className="mt-2 text-[11.5px] leading-5 text-[#5e6f91]">The stored national reference is up to {profile.workRights?.hoursNormalPeriod ?? 90} hours per month from September through May for the relevant student residence-permit context. Full-time work is permitted in {summerMonths} under that context.</p>{profile.workRights?.note ? <p className="mt-2 text-[11px] leading-5 text-[#5e6f91]">{profile.workRights.note}</p> : null}</section>
            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5"><h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Metric sources</h2><div className="mt-3 space-y-2">{profile.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-white px-3 py-2.5 text-[10.5px] leading-4 text-[#5e6f91] hover:underline">{source.name} · {source.dataAsOf}</a>)}</div></section>
          </div>
        </div>
      </main>
    </div>
  )
}
