import Link from "next/link"
import {
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
import type { DeCityProfile } from "@/lib/cities/de-city-profile.server"

function money(value: number, currency = "EUR", decimals = 0) {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-DE", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function periodLabel(period: string) {
  return period.replaceAll("_", " ")
}

function livingValue(profile: DeCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
    return `~${money(profile.livingCost.low, profile.livingCost.currency)}`
  }
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)}`
}

function transportValue(profile: DeCityProfile) {
  if (!profile.transport) return "—"
  const { referenceAmount, low, high, currency, period } = profile.transport
  if (referenceAmount != null) {
    const decimals = referenceAmount % 1 === 0 ? 0 : 2
    return `${money(referenceAmount, currency, decimals)} / ${periodLabel(period)}`
  }
  if (low != null && high != null) {
    return `${money(low, currency)}–${money(high, currency)} / ${periodLabel(period)}`
  }
  return "—"
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

export function GermanyCityDashboard({ profile }: { profile: DeCityProfile }) {
  const scopeCopy = `${profile.name} uses the official Destatis / GV-ISys municipality boundary for the public city and population contract. Metro areas, neighbouring municipalities and institution marketing regions are not silently folded into this profile.`

  return (
    <div>
      <section className="bg-gradient-to-br from-[#20242c] via-[#343b47] to-[#5a6372] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/70" aria-label="Breadcrumb">
            <Link href="/countries" className="hover:text-white">Countries</Link>
            <span>/</span>
            <Link href="/countries/de" className="hover:text-white">Germany</Link>
            <span>/</span>
            <span>{profile.region}</span>
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
            <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedInstitutionCount} verified institutions</span>
            <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">{profile.linkedCampusCount} verified teaching locations</span>
            <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1">5 verified city metrics</span>
          </div>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Users className="size-4 text-[#4d657c]" />}
            label="Population"
            value={profile.population ? compact(profile.population.amount) : "—"}
            note={profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}${profile.population.ags ? ` · AGS ${profile.population.ags}` : ""}` : "Verified municipality population unavailable"}
          />
          <MetricCard
            icon={<Wallet className="size-4 text-[#a86b18]" />}
            label="Student living"
            value={livingValue(profile)}
            note={profile.livingCost ? `Indicative monthly EUR reference · source methodology varies by city${profile.livingCost.confidence === "low" ? " · lower-confidence local guidance" : ""}` : "Verified student living reference unavailable"}
          />
          <MetricCard
            icon={<TrainFront className="size-4 text-[#6552a5]" />}
            label="Student transport"
            value={transportValue(profile)}
            note={profile.transport ? `Source-native ticket period${profile.transport.eligibilityOrEnrolmentConditionsApply ? " · enrolment or eligibility conditions apply" : ""}` : "Verified student transport reference unavailable"}
          />
          <MetricCard
            icon={<Clock3 className="size-4 text-[#3e7a2e]" />}
            label="Student work"
            value={profile.workRights ? `${profile.workRights.hoursTermTime} h / week` : "—"}
            note="Federal reference for eligible third-country students during lecture periods; individual residence conditions still control"
          />
        </div>

        {profile.livingCost?.note || profile.transport?.note ? (
          <section className="mt-5 rounded-xl border border-[#dce3eb] bg-[#f7f9fb] p-5">
            <h2 className="text-[13.5px] font-semibold text-[#334155]">Metric context</h2>
            {profile.livingCost?.note ? <p className="mt-2 text-[11.5px] leading-5 text-[#64748b]"><strong>Living:</strong> {profile.livingCost.note}</p> : null}
            {profile.transport?.note ? <p className="mt-2 text-[11.5px] leading-5 text-[#64748b]"><strong>Transport:</strong> {profile.transport.note}</p> : null}
          </section>
        ) : null}

        <section className="mt-5 rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-4 shrink-0 text-[#a86514]" />
            <div>
              <h2 className="text-[14px] font-semibold text-[#5d3a0b]">{profile.programmeCoverage.label}</h2>
              <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">{profile.programmeCoverage.detail}</p>
              <p className="mt-1 text-[11.5px] leading-5 text-[#7a5a31]">
                The city catalogue state is shown as verification pending rather than “0 programmes”.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[#4d657c]">
              <GraduationCap className="size-4" />
              <h2 className="text-[15px] font-semibold">Verified institutions in {profile.scopeLabel}</h2>
              <span className="ml-auto rounded-full bg-[#f1f4f7] px-2.5 py-1 text-[10.5px] font-semibold text-[#4d657c]">
                {profile.linkedInstitutionCount} institutions · {profile.linkedCampusCount} locations
              </span>
            </div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
              This is the Phase 3 initial verified teaching-location set, not a complete inventory of every German university site. Multi-campus institutions are kept inside the municipality boundary only when the teaching location itself is explicitly verified.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {profile.institutions.map((institution) => (
                <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#4d657c] shadow-sm"><Building2 className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b]">{institution.name}</p>
                      <p className="mt-0.5 text-[10.5px] text-[#8f8c85]">Verified domain {institution.verifiedDomain} · {institution.campuses.length} teaching {institution.campuses.length === 1 ? "location" : "locations"}</p>
                      <div className="mt-2 space-y-1.5">
                        {institution.campuses.map((campus) => (
                          <div key={campus.id} className="flex items-start gap-1.5 text-[10.5px] leading-4 text-[#77746e]">
                            <MapPin className="mt-0.5 size-3 shrink-0" />
                            <span>{campus.name}{campus.addressLine ? ` · ${campus.addressLine}` : ""}{campus.postalCode ? ` · ${campus.postalCode}` : ""}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#4d657c] hover:underline">
                          Official site <ExternalLink className="size-3" />
                        </a>
                        <a href={institution.identitySourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#4d657c] hover:underline">
                          Identity source <ExternalLink className="size-3" />
                        </a>
                        {institution.campuses[0] ? (
                          <a href={institution.campuses[0].sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#4d657c] hover:underline">
                            Location source <ExternalLink className="size-3" />
                          </a>
                        ) : null}
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
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
                {profile.employmentSectorBasis ?? "Official city economic-development context."} These are context signals, not shortage rankings, job guarantees or immigration eligibility signals.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.employmentSectors.map((sector) => (
                  <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
              <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">International student work context</h2>
              <p className="mt-2 text-[11.5px] leading-5 text-[#5e6f91]">
                The stored federal reference is up to {profile.workRights?.hoursTermTime ?? 20} hours per week during lecture periods for eligible third-country students, or the annual {profile.workRights?.fullDaysPerYear ?? 140} full / {profile.workRights?.halfDaysPerYear ?? 280} half-day rule.
              </p>
              {profile.workRights?.studentAuxiliaryTaskException ? <p className="mt-2 text-[11px] leading-5 text-[#5e6f91]">Student auxiliary academic work has a separate exception in the stored federal guidance.</p> : null}
              {profile.workRights?.note ? <p className="mt-2 text-[11px] leading-5 text-[#5e6f91]">{profile.workRights.note}</p> : null}
            </section>

            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
              <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Metric sources</h2>
              <div className="mt-3 space-y-2">
                {profile.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-white px-3 py-2.5 text-[10.5px] leading-4 text-[#5e6f91] hover:underline">
                    {source.name} · {source.dataAsOf} · {source.confidence} confidence
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
