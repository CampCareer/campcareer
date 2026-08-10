import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldCheck,
  TrainFront,
  Users,
  Wallet,
} from "lucide-react"
import type { CaCityProfile } from "@/lib/cities/ca-city-profile.server"
import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"

const CITY_IMAGES: Record<string, string> = {
  toronto:
    "https://images.unsplash.com/photo-1697607932663-71d59867b733?auto=format&fit=crop&fm=jpg&q=80&w=1800",
  vancouver: "https://unsplash.com/photos/SbrSpd8Ei2A/download?force=true&w=1800",
  montreal: "https://unsplash.com/photos/A_YKzd73HHA/download?force=true&w=1800",
  ottawa: "https://unsplash.com/photos/r4gsIYkI97c/download?force=true&w=1800",
  calgary: "https://unsplash.com/photos/hyDnHG9cPj0/download?force=true&w=1800",
}

function money(value: number, currency = "CAD", decimals = 0) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function population(value: number) {
  return new Intl.NumberFormat("en-CA", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2 text-[#77746e]">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p>
      </div>
      <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{note}</p>
    </article>
  )
}

function livingCostValue(profile: CaCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
    return `~${money(profile.livingCost.low, profile.livingCost.currency)}`
  }
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)}`
}

function livingCostNote(profile: CaCityProfile) {
  if (!profile.livingCost) return "Verified student living reference unavailable"
  const evidence = profile.livingCost.evidenceKind === "calculated" ? " · calculated" : ""
  return `Indicative monthly reference · tuition excluded${evidence}`
}

function transportPeriod(period: string) {
  if (period === "4_month_term") return "4-month term"
  if (period === "month") return "month"
  if (period === "trip") return "trip"
  return period.replaceAll("_", " ")
}

function transportValue(profile: CaCityProfile) {
  if (!profile.transport) return "—"
  const decimals = profile.transport.referenceAmount % 1 === 0 ? 0 : 2
  return `${money(profile.transport.referenceAmount, profile.transport.currency, decimals)}/${transportPeriod(profile.transport.period)}`
}

function transportNote(profile: CaCityProfile) {
  if (!profile.transport) return "Verified student transport reference unavailable"
  if (profile.transport.referenceKind === "ttc_post_secondary_monthly_pass") return "TTC post-secondary monthly pass · eligibility and photo ID requirements apply"
  if (profile.transport.referenceKind === "upass_bc_monthly") return "U-Pass BC monthly fee · participating institution and student eligibility rules apply"
  if (profile.transport.referenceKind === "stm_student_monthly_all_modes_a") return "STM reduced student 18+ All Modes A monthly pass · photo OPUS card required"
  if (profile.transport.referenceKind === "ottawa_upass_term") return "uOttawa U-Pass · current four-month term reference · eligibility and exemption rules apply"
  if (profile.transport.referenceKind === "calgary_upass_fall_term") return "Calgary Transit Fall 2026 U-Pass · term-based student fee · eligibility rules apply"
  return profile.transport.eligibilityRequired
    ? "Published student transport reference · eligibility conditions apply"
    : "Published transport reference"
}

function workValue(profile: CaCityProfile) {
  if (!profile.workRights) return "—"
  return `${profile.workRights.hours} h / week`
}

export function CanadaCityDashboard({ profile }: { profile: CaCityProfile }) {
  const image = CITY_IMAGES[profile.slug]
  const scopeLabel = profile.population?.geography ?? profile.name
  const published = profile.publishedPrograms
  const compareAvailable = Boolean(
    profile.population &&
      profile.livingCost &&
      profile.transport &&
      profile.workRights &&
      profile.employmentSectors.length > 0 &&
      profile.linkedCampusCount > 0 &&
      profile.linkedInstitutionCount > 0 &&
      published &&
      published.totalPrograms > 0,
  )
  const compareHref = buildCityCompareCanonicalHref({ country: "CA", left: profile.slug })
  const programsHref = `/programs?country=CA&city=${encodeURIComponent(profile.slug)}`

  return (
    <div>
      <section className="relative z-0 overflow-hidden bg-[#273444]">
        {image ? <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} /> : null}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-8 sm:pt-20 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/70" aria-label="Breadcrumb">
            <Link href="/countries" className="hover:text-white">Countries</Link><span>/</span>
            <Link href="/countries/ca" className="hover:text-white">Canada</Link><span>/</span><span>{profile.regionName}</span>
          </nav>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Cities</p>
          <h1 className="mt-2 text-[38px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[48px]">{profile.name}</h1>
          <p className="mt-2 text-[14px] font-medium text-white/85">{profile.regionName} · {profile.countryName} · {scopeLabel}</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
        <div className="relative z-20 -mt-8 rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#3e7a2e]">Student decision snapshot</p>
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Study, living and work context in one place</h2>
              <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-[#77746e]">
                Program counts below use CampCareer&apos;s reviewed Canada program set for the 80 target careers. Institution and location records remain source-backed city connections and are kept separate from program publication eligibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {compareAvailable ? (
                <Link href={compareHref} className="inline-flex items-center gap-1.5 rounded-lg border border-[#cfd9ca] px-3.5 py-2 text-[11.5px] font-semibold text-[#3e7a2e] hover:bg-[#f7faf5]">
                  Compare {profile.name} with another city <ArrowRight className="size-3.5" />
                </Link>
              ) : null}
              <Link href="/countries/ca" className="inline-flex items-center gap-1.5 px-2 py-2 text-[11.5px] font-semibold text-[#2563eb] hover:underline">Canada dashboard <ArrowRight className="size-3.5" /></Link>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<Users className="size-4 text-[#2563eb]" />} label="Population" value={profile.population ? population(profile.population.amount) : "—"} note={profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}` : "Verified city population unavailable"} />
          <MetricCard icon={<Wallet className="size-4 text-[#c2691e]" />} label="Student living" value={livingCostValue(profile)} note={livingCostNote(profile)} />
          <MetricCard icon={<TrainFront className="size-4 text-[#6d4fc4]" />} label="Student transport" value={transportValue(profile)} note={transportNote(profile)} />
          <MetricCard icon={<Clock3 className="size-4 text-[#3e7a2e]" />} label="Student work" value={workValue(profile)} note="IRCC off-campus limit during regular academic sessions · eligibility conditions apply" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[#2563eb]">
              <GraduationCap className="size-4" />
              <h2 className="text-[15px] font-semibold">Institutions with {profile.name} locations</h2>
              <span className="ml-auto rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10.5px] font-semibold text-[#2563eb]">{profile.linkedInstitutionCount} institutions · {profile.linkedCampusCount} locations</span>
            </div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
              This section uses source-backed institution and location records. Program publication counts are shown separately so a location link is never treated as proof that every program is offered there.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {profile.institutions.map((institution) => (
                <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#3e7a2e] shadow-sm"><Building2 className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      {institution.profilePath ? <Link href={institution.profilePath} className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b] transition hover:text-[#3e7a2e] hover:underline">{institution.name}</Link> : <p className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b]">{institution.name}</p>}
                      <p className="mt-0.5 text-[10.5px] text-[#8f8c85]">{institution.type ?? "Education provider"} · {institution.campuses.length} verified {institution.campuses.length === 1 ? "location" : "locations"}</p>
                      <div className="mt-2 flex flex-wrap gap-1">{institution.campuses.map((campus) => <span key={campus.id} className="rounded-md bg-white px-2 py-1 text-[9.5px] text-[#77746e]">{campus.locality ?? campus.name}</span>)}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {institution.profilePath ? <Link href={institution.profilePath} className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#3e7a2e] hover:underline">Institution profile <ArrowRight className="size-3" /></Link> : null}
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
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Official city economic guidance highlights these sectors as local career context. They are not shortage rankings.</p>
              <div className="mt-3 flex flex-wrap gap-2">{profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>)}</div>
            </section>

            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
              <div className="flex items-center gap-2 text-[#2563eb]"><MapPin className="size-4" /><h2 className="text-[14.5px] font-semibold">Published target-career programs</h2></div>
              <p className="mt-2 text-[27px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{published?.totalPrograms.toLocaleString("en-CA") ?? "0"}</p>
              <p className="mt-1 text-[11px] leading-5 text-[#5e6f91]">Programs in CampCareer&apos;s reviewed Canada set whose published city is {profile.name}. This is intentionally narrower than an institution&apos;s full catalogue.</p>
              {published ? (
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="rounded-lg bg-white/70 px-3 py-2"><p className="font-semibold text-[#1b1b1b]">{published.indexablePrograms}</p><p className="text-[#6f6d68]">Official page verified</p></div>
                  <div className="rounded-lg bg-white/70 px-3 py-2"><p className="font-semibold text-[#1b1b1b]">{published.pgwpEligiblePrograms}</p><p className="text-[#6f6d68]">PGWP eligible</p></div>
                </div>
              ) : null}
              <Link href={programsHref} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#1f55c9]">Browse {profile.name} programs <ArrowRight className="size-3.5" /></Link>
            </section>

            {published && published.pgwpUnknownPrograms > 0 ? (
              <section className="rounded-xl border border-[#e5e3dc] bg-[#fbfbf9] p-5">
                <div className="flex items-center gap-2 text-[#77746e]"><ShieldCheck className="size-4" /><h2 className="text-[13px] font-semibold">PGWP evidence note</h2></div>
                <p className="mt-2 text-[11px] leading-5 text-[#77746e]">{published.pgwpUnknownPrograms} published {profile.name} programs keep PGWP as not confirmed because official provider or IRCC-aligned evidence is insufficient. Not confirmed does not mean ineligible.</p>
              </section>
            ) : null}
          </div>
        </div>

        <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
          <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Sources and freshness</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {profile.sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-lg border border-[#eeece8] bg-[#fafaf8] px-3.5 py-3 transition hover:border-[#cbd8ef] hover:bg-white">
                <div className="flex items-start gap-2"><ExternalLink className="mt-0.5 size-3.5 shrink-0 text-[#8f8c85]" /><div><p className="text-[11.5px] font-semibold leading-4 text-[#3f3e3a]">{source.name}</p><p className="mt-1 text-[10px] text-[#9a978f]">Data as of {source.dataAsOf} · {source.confidence} confidence</p></div></div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
