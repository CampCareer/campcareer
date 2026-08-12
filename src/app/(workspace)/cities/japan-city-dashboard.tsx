import type { JpCityProfile } from "@/lib/cities/jp-city-profile.server"

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)
}

export function JapanCityDashboard({ profile }: { profile: JpCityProfile }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:px-10">
      <header className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#315ea8]">Japan city profile · verification preview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1f2937] sm:text-4xl">Study in {profile.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5f6368]">
          This Phase 5 profile uses the Phase 2 geography boundary and private Phase 3–4 read models only. Provider and programme coverage is intentionally conservative.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#4b5563]">
          <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5">{profile.scopeLabel}</span>
          <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5">Area code {profile.adminCode}</span>
          <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5">{profile.regionName}</span>
        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-[#e3e8ef] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Population</p>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{profile.population ? formatNumber(profile.population.amount) : "Pending"}</p>
          <p className="mt-2 text-xs leading-5 text-[#6b7280]">{profile.population ? `${profile.population.geography} · ${profile.population.dataAsOf}${profile.population.preliminary ? " · preliminary census" : ""}` : "Official same-boundary population evidence pending."}</p>
        </article>

        <article className="rounded-xl border border-[#e3e8ef] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Living-cost reference</p>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{profile.livingCost ? `${formatMoney(profile.livingCost.low, profile.livingCost.currency)}/mo` : "Pending"}</p>
          <p className="mt-2 text-xs leading-5 text-[#6b7280]">National JASSO planning baseline. It is not a cheapest-city ranking and is not city-specific.</p>
        </article>

        <article className="rounded-xl border border-[#e3e8ef] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Transport reference</p>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{profile.transport ? formatMoney(profile.transport.amount, profile.transport.currency) : "Pending"}</p>
          <p className="mt-2 text-xs leading-5 text-[#6b7280]">{profile.transport ? `${profile.transport.mode ?? "local transport"} · ${profile.transport.period}. Source-native product; no synthetic monthly normalization.` : "Local source-native reference pending."}</p>
        </article>

        <article className="rounded-xl border border-[#e3e8ef] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Student work context</p>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{profile.workRights ? `Up to ${profile.workRights.hoursNormalPeriod}h/week` : "Pending"}</p>
          <p className="mt-2 text-xs leading-5 text-[#6b7280]">National immigration context; permission is required. It is not a city differentiator or automatic entitlement.</p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-[#e3e8ef] bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#315ea8]">Verified education footprint</p>
              <h2 className="mt-1 text-xl font-bold text-[#111827]">Institutions and teaching locations</h2>
            </div>
            <p className="text-xs text-[#6b7280]">{profile.linkedInstitutionCount} institutions · {profile.linkedCampusCount} locations</p>
          </div>
          <div className="mt-4 space-y-3">
            {profile.institutions.map((institution) => (
              <div key={institution.id} className="rounded-xl bg-[#f8fafc] p-4">
                <p className="font-semibold text-[#1f2937]">{institution.name}</p>
                <p className="mt-1 text-xs text-[#6b7280]">{institution.identifierMaturity}</p>
                <ul className="mt-2 space-y-1 text-sm text-[#4b5563]">
                  {institution.locations.map((location) => (
                    <li key={location.id}>{location.name}{location.addressLine ? ` · ${location.addressLine}` : ""}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#e3e8ef] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#315ea8]">Programme coverage</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">{profile.programmeCoverage.label}</h2>
          <p className="mt-3 text-sm leading-6 text-[#5f6368]">{profile.programmeCoverage.detail}</p>
          {profile.programmeSample.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {profile.programmeSample.map((programme) => (
                <li key={programme.id} className="rounded-xl bg-[#f8fafc] p-3">
                  <p className="text-sm font-semibold text-[#1f2937]">{programme.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6b7280]">{programme.institutionName} · {programme.locationName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl bg-[#fff8e8] p-4 text-sm leading-6 text-[#6b5a2b]">Programme verification is pending, not that the city has no programmes.</div>
          )}
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-[#e3e8ef] bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#315ea8]">Employment context</p>
        <h2 className="mt-1 text-xl font-bold text-[#111827]">Local economic focus</h2>
        <p className="mt-2 text-sm leading-6 text-[#5f6368]">Official/local context only, not a shortage ranking or job guarantee.</p>
        {profile.employmentSectorBasis ? <p className="mt-2 text-xs text-[#6b7280]">Basis: {profile.employmentSectorBasis}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.employmentSectors.map((sector) => <span key={sector} className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-xs font-medium text-[#315ea8]">{sector}</span>)}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#e3e8ef] bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#315ea8]">Source notes</p>
        <p className="mt-2 text-sm leading-6 text-[#5f6368]">Population uses the same Phase 2 statistical/municipal boundary. Living cost and work rules are national context; transport remains source-native. These methods are deliberately not collapsed into a synthetic city score.</p>
        <ul className="mt-4 space-y-2 text-xs text-[#6b7280]">
          {profile.sources.map((source) => <li key={source.url}>{source.name} · {source.dataAsOf} · {source.confidence}</li>)}
        </ul>
      </section>
    </main>
  )
}
