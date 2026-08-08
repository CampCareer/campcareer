import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  ExternalLink,
  GraduationCap,
  MapPin,
  TrainFront,
  Users,
  Wallet,
} from "lucide-react"
import type { AuCityProfile } from "@/lib/cities/au-city-profile.server"

const CITY_IMAGES: Record<string, string> = {
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1800&h=800&fit=crop&auto=format",
  melbourne: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1800&h=800&fit=crop&auto=format",
  brisbane: "https://images.unsplash.com/photo-1659563270346-e54a44b06677?w=1800&h=800&fit=crop&auto=format",
  perth: "https://pw-cdn.watercorporation.com.au/-/media/WaterCorp/Image-Gallery/Page-Images/Help-and-advice/Business-customers/Case-studies/City-of-Perth-Page-Image.png?h=440&w=1200",
}

function money(value: number, currency = "AUD", decimals = 0) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function population(value: number) {
  return new Intl.NumberFormat("en-AU", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2 text-[#77746e]">{icon}<p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</p></div>
      <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{note}</p>
    </article>
  )
}

function livingCostValue(profile: AuCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
    return `~${money(profile.livingCost.low)}`
  }
  return `${money(profile.livingCost.low)}–${money(profile.livingCost.high)}`
}

function transportNote(profile: AuCityProfile) {
  if (!profile.transport) return "Verified student transport reference unavailable"
  if (profile.transport.referenceKind === "flat_fare_per_journey") {
    return "Flat Translink fare per journey · distance independent · Airtrain excluded"
  }
  if (profile.transport.referenceKind === "tertiary_concession_go_anywhere_fare") {
    return "Transperth Go Anywhere concession fare · full-time tertiary eligibility and Tertiary SmartRider required"
  }
  if (profile.transport.referenceKind === "tertiary_concession_peak_fare") {
    return "Adelaide Metro tertiary concession peak fare · lower off-peak fares available · valid full-time student ID required"
  }
  if (profile.transport.referenceKind === "student_pass_weekly_equivalent") {
    const pass = profile.transport.annualPass ? `${money(profile.transport.annualPass)} annual pass` : "annual student pass"
    return `${pass} ÷ 52 · eligible international students only · calculated reference`
  }
  if (profile.transport.eligibleConcessionAmount != null) {
    return `Full-fare weekly cap · eligible concession ${money(profile.transport.eligibleConcessionAmount)}`
  }
  return profile.transport.eligibilityRequired ? "Eligibility conditions apply" : "Published transport reference"
}

function transportValue(profile: AuCityProfile) {
  if (!profile.transport) return "—"
  const decimals = profile.transport.weeklyReference < 20 ? 2 : 0
  const period = profile.transport.period === "trip" ? "trip" : "week"
  return `${money(profile.transport.weeklyReference, profile.transport.currency, decimals)}/${period}`
}

export function CityDashboard({ profile }: { profile: AuCityProfile }) {
  const scopeLabel = profile.population?.geography ?? `Greater ${profile.name}`
  const image = CITY_IMAGES[profile.slug]
  const compareAvailable = ["sydney", "melbourne"].includes(profile.slug)

  return (
    <div>
      <section className="relative z-0 overflow-hidden bg-[#273444]">
        {image && <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-8 sm:pt-20 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/70" aria-label="Breadcrumb">
            <Link href="/countries" className="hover:text-white">Countries</Link><span>/</span><Link href="/countries/au" className="hover:text-white">Australia</Link><span>/</span><span>{profile.regionName}</span>
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
                {profile.name} providers and programs use official CRICOS registered delivery locations linked to the canonical Greater {profile.name} city ID.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {compareAvailable && <Link href="/compare?type=city&country=AU" className="inline-flex items-center gap-1.5 rounded-lg border border-[#cfd9ca] px-3.5 py-2 text-[11.5px] font-semibold text-[#3e7a2e] hover:bg-[#f7faf5]">Compare Sydney vs Melbourne <ArrowRight className="size-3.5" /></Link>}
              <Link href="/countries/au" className="inline-flex items-center gap-1.5 px-2 py-2 text-[11.5px] font-semibold text-[#2563eb] hover:underline">Australia dashboard <ArrowRight className="size-3.5" /></Link>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<Users className="size-4 text-[#2563eb]" />} label="Population" value={profile.population ? population(profile.population.amount) : "—"} note={profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}` : "Verified city population unavailable"} />
          <MetricCard icon={<Wallet className="size-4 text-[#c2691e]" />} label="Student living" value={livingCostValue(profile)} note={`Indicative monthly reference · tuition excluded${profile.livingCost?.evidenceKind === "calculated" ? " · calculated" : ""}`} />
          <MetricCard icon={<TrainFront className="size-4 text-[#6d4fc4]" />} label="Student transport" value={transportValue(profile)} note={transportNote(profile)} />
          <MetricCard icon={<Clock3 className="size-4 text-[#3e7a2e]" />} label="Student work" value={profile.workRights ? `${profile.workRights.hoursPerFortnight} h / fortnight` : "—"} note={profile.workRights?.unrestrictedWhenCourseNotInSession ? "During study periods · no hour cap when the course is not in session" : "Check current visa conditions"} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[#2563eb]">
              <GraduationCap className="size-4" />
              <h2 className="text-[15px] font-semibold">Study providers with registered {profile.name} locations</h2>
              <span className="ml-auto rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10.5px] font-semibold text-[#2563eb]">{profile.linkedInstitutionCount} providers · {profile.linkedCampusCount} locations</span>
            </div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Provider and campus membership comes from the Australian Government CRICOS Locations register.</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {profile.institutions.map((institution) => (
                <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#3e7a2e] shadow-sm"><Building2 className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      {institution.profilePath ? (
                        <Link href={institution.profilePath} className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b] transition hover:text-[#3e7a2e] hover:underline">
                          {institution.name}
                        </Link>
                      ) : (
                        <p className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b]">{institution.name}</p>
                      )}
                      <p className="mt-0.5 text-[10.5px] text-[#8f8c85]">{institution.type ?? "Education provider"} · {institution.campuses.length} registered {institution.campuses.length === 1 ? "location" : "locations"}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {institution.campuses.slice(0, 3).map((campus) => <span key={campus.id} className="rounded-md bg-white px-2 py-1 text-[9.5px] text-[#77746e]">{campus.locality ?? campus.name}</span>)}
                        {institution.campuses.length > 3 && <span className="rounded-md bg-white px-2 py-1 text-[9.5px] text-[#77746e]">+{institution.campuses.length - 3}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {institution.profilePath && <Link href={institution.profilePath} className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#3e7a2e] hover:underline">Institution profile <ArrowRight className="size-3" /></Link>}
                        {institution.websiteUrl && <a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2563eb] hover:underline">Official site <ExternalLink className="size-3" /></a>}
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
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Official city or state economic guidance highlights these sectors as local career context. They are not shortage rankings.</p>
              <div className="mt-3 flex flex-wrap gap-2">{profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>)}</div>
            </section>

            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
              <div className="flex items-center gap-2 text-[#2563eb]"><MapPin className="size-4" /><h2 className="text-[14.5px] font-semibold">Verified {profile.name} programs</h2></div>
              <p className="mt-2 text-[27px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{profile.verifiedProgramCount.toLocaleString("en-AU")}</p>
              <p className="mt-1 text-[11px] leading-5 text-[#5e6f91]">Active CRICOS courses with at least one registered delivery location mapped to Greater {profile.name}.</p>
              <Link href={`/programs?country=AU&city=${profile.slug}`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#1f55c9]">Browse {profile.name} programs <ArrowRight className="size-3.5" /></Link>
              <p className="mt-3 text-[10.5px] leading-4 text-[#8090ad]">Each program detail page lists the registered CRICOS delivery locations used for this filter.</p>
            </section>
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
