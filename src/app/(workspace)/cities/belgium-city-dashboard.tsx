import Link from "next/link"
import { BriefcaseBusiness, Building2, Clock3, ExternalLink, GraduationCap, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { BeCityProfile } from "@/lib/cities/be-city-profile.server"

function money(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-BE", { style: "currency", currency, maximumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-BE", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function periodLabel(value: string) {
  return value.replaceAll("_", " ")
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
    <div className="flex items-center gap-2 text-[#77746e]">{icon}<p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p></div>
    <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
    <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{note}</p>
  </article>
}

export function BelgiumCityDashboard({ profile }: { profile: BeCityProfile }) {
  const living = profile.livingCost
    ? Math.abs(profile.livingCost.high - profile.livingCost.low) < 1
      ? `~${money(profile.livingCost.low, profile.livingCost.currency)}`
      : `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)}`
    : "—"
  const scopeCopy = profile.slug === "brussels"
    ? "Brussels uses the Brussels-Capital Region as the public study-destination and population boundary; the City of Brussels municipality is not substituted for the region."
    : profile.slug === "louvain-la-neuve"
      ? "Louvain-la-Neuve is a study-destination label inside Ottignies-Louvain-la-Neuve. Population evidence is therefore shown for the municipality rather than treating Louvain-la-Neuve as a standalone municipality."
      : `${profile.name} uses the municipality boundary for the public study-destination and population contract.`

  return <div>
    <section className="bg-gradient-to-br from-[#20242c] via-[#343b47] to-[#5a6372] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/70" aria-label="Breadcrumb">
          <Link href="/countries" className="hover:text-white">Countries</Link><span>/</span>
          <Link href="/countries/be" className="hover:text-white">Belgium</Link><span>/</span><span>{profile.region}</span>
        </nav>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Cities</p>
        <h1 className="mt-2 text-[38px] font-semibold leading-tight tracking-[-0.03em] sm:text-[48px]">{profile.name}</h1>
        <p className="mt-2 text-[14px] font-medium text-white/85">{profile.region} · {profile.scopeLabel}</p>
      </div>
    </section>

    <main className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
      <section className="-mt-8 rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
        <p className="text-[12px] font-semibold text-[#5b6574]">Student decision snapshot</p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Study destination evidence for {profile.name}</h2>
        <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-[#77746e]">{scopeCopy}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10.5px] font-semibold text-[#5d6470]">
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedInstitutionCount} verified universities</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedCampusCount} verified teaching locations</span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">5 verified city metrics</span>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Users className="size-4" />} label="Population" value={profile.population ? compact(profile.population.amount) : "—"} note={profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}${profile.population.refnisCode ? ` · REFNIS ${profile.population.refnisCode}` : ""}` : "Verified population unavailable"} />
        <MetricCard icon={<Wallet className="size-4" />} label="Student living" value={living} note={profile.livingCost ? `Indicative monthly reference · methodology varies by source · ${profile.livingCost.confidence} confidence` : "Verified student living reference unavailable"} />
        <MetricCard icon={<TrainFront className="size-4" />} label="Student transport" value={profile.transport ? `${money(profile.transport.amount, profile.transport.currency)} / ${periodLabel(profile.transport.period)}` : "—"} note={profile.transport ? "Source-native ticket period · age, enrolment or residence conditions may apply" : "Verified transport reference unavailable"} />
        <MetricCard icon={<Clock3 className="size-4" />} label="Student work" value={profile.workRights ? `${profile.workRights.hoursSchoolPeriod} h / week` : "—"} note="Belgian national reference during the school period; residence and study-compatibility conditions apply" />
      </div>

      {profile.livingCost?.note ? <section className="mt-5 rounded-xl border border-[#dce3eb] bg-[#f7f9fb] p-5"><h2 className="text-[13.5px] font-semibold text-[#334155]">Living-cost methodology</h2><p className="mt-2 text-[11.5px] leading-5 text-[#64748b]">{profile.livingCost.note}</p></section> : null}

      <section className="mt-5 rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5 sm:p-6">
        <div className="flex items-start gap-3"><Info className="mt-0.5 size-4 shrink-0 text-[#a86514]" /><div>
          <h2 className="text-[14px] font-semibold text-[#5d3a0b]">{profile.programmeCoverage.label}</h2>
          <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">{profile.programmeCoverage.detail}</p>
          <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">The city catalogue state is shown as verification pending rather than “0 programmes”.</p>
        </div></div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2"><GraduationCap className="size-4" /><h2 className="text-[15px] font-semibold">Verified universities and teaching locations</h2></div>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">This is an initial verified university set, not a complete Belgian higher-education provider inventory. Universities of applied sciences and university colleges can be missing until separately verified.</p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {profile.institutions.map((institution) => <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
              <div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white"><Building2 className="size-4" /></span><div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold">{institution.name}</p><p className="mt-0.5 text-[10.5px] text-[#8f8c85]">Official identity verified · {institution.campuses.length} teaching {institution.campuses.length === 1 ? "location" : "locations"}</p>
                <div className="mt-2 space-y-1.5">{institution.campuses.map((campus) => <div key={campus.id} className="flex items-start gap-1.5 text-[10.5px] leading-4 text-[#77746e]"><MapPin className="mt-0.5 size-3 shrink-0" /><span>{campus.name}{campus.locality ? ` · ${campus.locality}` : ""}{campus.addressLine ? ` · ${campus.addressLine}` : ""}{campus.postalCode ? ` · ${campus.postalCode}` : ""}</span></div>)}</div>
                <div className="mt-2 flex flex-wrap gap-3"><a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="text-[10.5px] font-semibold hover:underline">Official site <ExternalLink className="inline size-3" /></a><a href={institution.identitySourceUrl} target="_blank" rel="noreferrer" className="text-[10.5px] font-semibold hover:underline">Identity source <ExternalLink className="inline size-3" /></a>{institution.campuses[0] ? <a href={institution.campuses[0].sourceUrl} target="_blank" rel="noreferrer" className="text-[10.5px] font-semibold hover:underline">Location source <ExternalLink className="inline size-3" /></a> : null}</div>
              </div></div>
            </article>)}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5"><div className="flex items-center gap-2"><BriefcaseBusiness className="size-4" /><h2 className="text-[14.5px] font-semibold">Career environment</h2></div><p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{profile.employmentSectorBasis ?? "Official local economic context."} These sectors are context only, not shortage rankings, job guarantees or immigration eligibility signals.</p><div className="mt-3 flex flex-wrap gap-2">{profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border px-3 py-1.5 text-[11px] font-semibold">{sector}</span>)}</div></section>
          <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5"><h2 className="text-[14.5px] font-semibold">International student work context</h2><p className="mt-2 text-[11.5px] leading-5 text-[#5e6f91]">The stored Belgian reference is up to {profile.workRights?.hoursSchoolPeriod ?? 20} hours per week during the school period for eligible foreign students. During school holidays, the stored residence-based rule does not apply that 20-hour cap.</p>{profile.workRights?.compatibilityWithStudiesRequired ? <p className="mt-2 text-[11px] leading-5 text-[#5e6f91]">Work outside school holidays must remain compatible with studies; individual residence conditions still control.</p> : null}</section>
          <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5"><h2 className="text-[14.5px] font-semibold">Metric sources</h2><div className="mt-3 space-y-2">{profile.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-white px-3 py-2.5 text-[10.5px] leading-4 hover:underline">{source.name} · {source.dataAsOf} · {source.confidence} confidence</a>)}</div></section>
        </div>
      </div>
    </main>
  </div>
}
