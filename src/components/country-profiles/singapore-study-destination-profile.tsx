import Link from "next/link"
import type { SingaporeDestinationProfile } from "@/lib/destinations/sg-destination-profile.server"

const money = (amount: number) => new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  maximumFractionDigits: 0,
}).format(amount)

const compact = (amount: number) => new Intl.NumberFormat("en-SG", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(amount)

export function SingaporeStudyDestinationProfile({ profile }: { profile: SingaporeDestinationProfile }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Study destination</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Singapore at a glance</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Singapore is treated as one country-level city-state destination. Local areas are useful for housing and commuting, not as separate study cities.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {profile.linkedInstitutionCount} verified universities · {profile.linkedCampusCount} primary locations
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FactCard
            label="Population"
            value={profile.population ? compact(profile.population.amount) : "Pending"}
            note={profile.population?.referencePeriod ?? "Official source pending"}
          />
          <FactCard
            label="Student living"
            value={profile.livingCost ? `${money(profile.livingCost.low)}–${money(profile.livingCost.high)}` : "Pending"}
            note="Monthly reference; tuition excluded"
          />
          <FactCard
            label="Term-time work"
            value={profile.workRights ? `${profile.workRights.hours} hours/week` : "Pending"}
            note="Eligibility conditions apply"
          />
          <FactCard
            label="Student's Pass application"
            value={profile.studentPassApplicationFee ? money(profile.studentPassApplicationFee.amount) : "Pending"}
            note="Processing fee; other fees may apply"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-semibold">Study cost and transport context</h3>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
              {profile.tuition ? (
                <p>
                  <b className="text-slate-900">Tuition reference:</b> {money(profile.tuition.low)}–{money(profile.tuition.high)} per year for the current source-backed undergraduate scenario. This is not a universal national fee{profile.tuition.tuitionGrantObligationApplies ? ", and the cited Tuition Grant scenario carries a service obligation" : ""}.
                </p>
              ) : null}
              {profile.transport ? (
                <p>
                  <b className="text-slate-900">Public transport:</b> adult card fares start at {profile.transport.adultBasicFareLow == null ? "the published fare" : money(profile.transport.adultBasicFareLow)}; the adult monthly pass reference is {profile.transport.adultMonthlyPass == null ? "source-dependent" : money(profile.transport.adultMonthlyPass)}. University-student concession products require eligibility.
                </p>
              ) : null}
              {profile.workRights ? (
                <p>
                  <b className="text-slate-900">Work rights:</b> the {profile.workRights.hours}-hour school-term reference applies only to qualifying foreign students under the Ministry of Manpower rules. It is not an unconditional allowance for every international student.
                </p>
              ) : null}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-semibold">Programme coverage</h3>
            <p className="mt-3 text-sm font-semibold text-slate-900">{profile.programmeCoverage.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{profile.programmeCoverage.detail}</p>
            <p className="mt-4 text-sm text-slate-500">Verified programme count: {profile.linkedProgramCount}</p>
          </article>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Verified universities and primary locations</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {profile.institutions.map((institution) => (
              <article key={institution.id} className="rounded-xl border border-slate-200 p-4">
                <Link href={`/institutions/sg/${institution.slug}`} className="font-semibold text-slate-950 hover:text-teal-700">
                  {institution.name}
                </Link>
                <p className="mt-2 text-sm text-slate-600">{institution.campus.name}</p>
                <p className="mt-1 text-sm text-slate-500">{institution.campus.addressLine}, Singapore {institution.campus.postalCode}</p>
              </article>
            ))}
          </div>
        </div>

        {profile.employmentSectors.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Economic sector context</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">These are national industry-context signals, not shortage rankings or job guarantees.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.employmentSectors.map((sector) => (
                <span key={sector} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">{sector}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sg/jobs" className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">Explore Singapore job signals</Link>
          <Link href="/map?country=sg&area=central" className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50">Compare living areas</Link>
          <Link href="/institutions?country=SG" className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50">Browse institutions</Link>
        </div>
      </div>
    </section>
  )
}

function FactCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p>
    </div>
  )
}
