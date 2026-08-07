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

const SYDNEY_IMAGE =
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1800&h=800&fit=crop&auto=format"

function money(value: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function population(value: number) {
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
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

export function CityDashboard({ profile }: { profile: AuCityProfile }) {
  const scopeLabel = profile.population?.geography ?? `Greater ${profile.name}`

  return (
    <div>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${SYDNEY_IMAGE})` }} />
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

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-8 lg:px-10">
        <div className="-mt-8 rounded-2xl border border-[#e7e6e3] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#3e7a2e]">Student decision snapshot</p>
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Study, living and work context in one place</h2>
              <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-[#77746e]">
                Sydney study providers and programs now use official CRICOS registered delivery locations linked to the canonical Greater Sydney city ID.
              </p>
            </div>
            <Link href="/countries/au" className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#2563eb] hover:underline">Australia dashboard <ArrowRight className="size-3.5" /></Link>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<Users className="size-4 text-[#2563eb]" />} label="Population" value={profile.population ? population(profile.population.amount) : "—"} note={profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}` : "Verified city population unavailable"} />
          <MetricCard icon={<Wallet className="size-4 text-[#c2691e]" />} label="Student living" value={profile.livingCost ? `${money(profile.livingCost.low)}–${money(profile.livingCost.high)}` : "—"} note="Indicative monthly range · tuition excluded" />
          <MetricCard icon={<TrainFront className="size-4 text-[#6d4fc4]" />} label="Public transport" value={profile.transport ? `${money(profile.transport.adultWeeklyCap)}/week` : "—"} note={profile.transport?.concessionWeeklyCap != null ? `Adult Opal cap · eligible concession cap ${money(profile.transport.concessionWeeklyCap)}` : "Adult Opal weekly cap"} />
          <MetricCard icon={<Clock3 className="size-4 text-[#3e7a2e]" />} label="Student work" value={profile.workRights ? `${profile.workRights.hoursPerFortnight} h / fortnight` : "—"} note={profile.workRights?.unrestrictedWhenCourseNotInSession ? "During study periods · no hour cap when the course is not in session" : "Check current visa conditions"} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[#2563eb]">
              <GraduationCap className="size-4" />
              <h2 className="text-[15px] font-semibold">Study providers with registered Sydney locations</h2>
              <span className="ml-auto rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10.5px] font-semibold text-[#2563eb]">{profile.linkedInstitutionCount} providers · {profile.linkedCampusCount} locations</span>
            </div>
            <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Provider and campus membership comes from the Australian Government CRICOS Locations register.</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {profile.institutions.map((institution) => (
                <article key={institution.id} className="rounded-lg border border-[#eeece8] bg-[#fafaf8] p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#3e7a2e] shadow-sm"><Building2 className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold leading-5 text-[#1b1b1b]">{institution.name}</p>
                      <p className="mt-0.5 text-[10.5px] text-[#8f8c85]">{institution.type ?? "Education provider"} · {institution.campuses.length} registered {institution.campuses.length === 1 ? "location" : "locations"}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {institution.campuses.slice(0, 3).map((campus) => (
                          <span key={campus.id} className="rounded-md bg-white px-2 py-1 text-[9.5px] text-[#77746e]">{campus.locality ?? campus.name}</span>
                        ))}
                        {institution.campuses.length > 3 && <span className="rounded-md bg-white px-2 py-1 text-[9.5px] text-[#77746e]">+{institution.campuses.length - 3}</span>}
                      </div>
                      {institution.websiteUrl && <a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2563eb] hover:underline">Official site <ExternalLink className="size-3" /></a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
              <div className="flex items-center gap-2 text-[#3e7a2e]"><BriefcaseBusiness className="size-4" /><h2 className="text-[14.5px] font-semibold">Career environment</h2></div>
              <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Study NSW highlights these sectors as prominent Sydney work environments. They are context signals, not shortage rankings.</p>
              <div className="mt-3 flex flex-wrap gap-2">{profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full border border-[#dfe8db] bg-[#f7faf5] px-3 py-1.5 text-[11px] font-semibold text-[#3e7a2e]">{sector}</span>)}</div>
            </section>

            <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
              <div className="flex items-center gap-2 text-[#2563eb]"><MapPin className="size-4" /><h2 className="text-[14.5px] font-semibold">Verified Sydney programs</h2></div>
              <p className="mt-2 text-[27px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{profile.verifiedProgramCount.toLocaleString("en-AU")}</p>
              <p className="mt-1 text-[11px] leading-5 text-[#5e6f91]">Active CRICOS courses with at least one registered delivery location mapped to Greater Sydney.</p>
              <Link href="/programs?country=AU&city=sydney" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#1f55c9]">Browse Sydney programs <ArrowRight className="size-3.5" /></Link>
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
