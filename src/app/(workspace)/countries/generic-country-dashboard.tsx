import Link from "next/link"
import { ArrowUpRight, Banknote, MapPin, ScrollText, Sparkles, Stamp, Wallet } from "lucide-react"
import { getLaunchCountry } from "@/data/launch-countries"
import { getCountryExplorer } from "@/lib/workspace/country-explorer"
import { getCountryProfile } from "@/lib/workspace/country-profile"
import { VISA_CATALOG } from "@/lib/workspace/visa-catalog"
import { cn } from "@/lib/utils"

const KIND_STYLES: Record<string, string> = {
  Study: "bg-[#eef4ff] text-[#2563eb]",
  Work: "bg-[#fbf0e7] text-[#c2691e]",
  Skilled: "bg-[#f3f0fa] text-[#6d4fc4]",
  "Working holiday": "bg-[#edf5ea] text-[#3e7a2e]",
  Family: "bg-[#f5f3f0] text-[#6f6d68]",
  Temporary: "bg-[#f5f3f0] text-[#6f6d68]",
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function StatCard({
  icon,
  label,
  value,
  hint,
  accent,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
  accent: string
  href?: string
}) {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg", accent)}>{icon}</span>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3a19b]">{label}</p>
      </div>
      <p className="mt-3 text-[24px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{value}</p>
      {hint && <p className="mt-1 text-[12.5px] leading-5 text-[#6f6d68]">{hint}</p>}
    </>
  )

  if (href) {
    return (
      <Link href={href} className="block rounded-xl border border-[#e7e6e3] bg-white p-4 transition hover:border-[#6d4fc4]/40">
        {content}
      </Link>
    )
  }

  return <div className="rounded-xl border border-[#e7e6e3] bg-white p-4">{content}</div>
}

export function GenericCountryDashboard({ countryCode }: { countryCode: string }) {
  const country = getLaunchCountry(countryCode)
  if (!country) return null

  const explorer = getCountryExplorer(country.code)
  const profile = getCountryProfile(country.code)
  const visas = VISA_CATALOG.filter((visa) => visa.countryCode === country.code)
  const cityCount = explorer?.regions.reduce((total, region) => total + region.cities.length, 0) ?? 0

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Stamp className="size-4 text-[#6d4fc4]" />}
          accent="bg-[#f3f0fa]"
          label="Visa options"
          value={String(visas.length)}
          hint={`${visas.length} ${visas.length === 1 ? "pathway" : "pathways"} to study, work or settle`}
          href="/visas"
        />
        <StatCard
          icon={<Banknote className="size-4 text-[#2563eb]" />}
          accent="bg-[#eef4ff]"
          label="Average salary"
          value={profile?.salary ? formatMoney(profile.salary.value, profile.salary.currency) : "—"}
          hint={profile?.salary ? profile.salary.unit : "Source pending — data coming soon"}
        />
        <StatCard
          icon={<Wallet className="size-4 text-[#c2691e]" />}
          accent="bg-[#fbf0e7]"
          label="Living costs"
          value={profile?.livingCost ? formatMoney(profile.livingCost.value, profile.livingCost.currency) : "—"}
          hint={profile?.livingCost ? profile.livingCost.unit : "Source pending — data coming soon"}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-[#e7e6e3] bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#f0efec] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <ScrollText className="size-4 text-[#6d4fc4]" />
              <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Visa options</h2>
            </div>
            <span className="text-[11.5px] font-medium text-[#a3a19b]">{visas.length} pathways</span>
          </div>
          {visas.length > 0 ? (
            <ul className="divide-y divide-[#f0efec]">
              {visas.map((visa) => (
                <li key={visa.name} className="flex items-start gap-3 px-5 py-3.5">
                  <span className={cn("mt-0.5 inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide", KIND_STYLES[visa.kind] ?? KIND_STYLES.Temporary)}>
                    {visa.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <a href={visa.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-[13.5px] font-semibold text-[#1b1b1b] transition hover:text-[#2563eb]">
                      {visa.name}
                      <ArrowUpRight className="size-3.5 text-[#c4c2bc]" />
                    </a>
                    <span className="mt-0.5 block text-[12.5px] leading-5 text-[#6f6d68]">{visa.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-[13px] text-[#a3a19b]">Visa pathways are being catalogued.</p>
          )}
        </section>

        <section className="rounded-xl border border-[#e7e6e3] bg-white">
          <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
            <Sparkles className="size-4 text-[#2563eb]" />
            <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Work opportunities</h2>
          </div>
          {profile?.workOpportunities ? (
            <div className="px-5 py-4">
              <p className="text-[12.5px] font-semibold text-[#1b1b1b]">{profile.workOpportunities.headline}</p>
              <ul className="mt-3 space-y-2.5">
                {profile.workOpportunities.items.map((item) => (
                  <li key={item.title} className="flex items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                    <span className="text-[12.5px] font-medium text-[#4d4c48]">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="px-5 py-8 text-[13px] leading-5 text-[#a3a19b]">Country work-opportunity data is being prepared.</p>
          )}
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-[#e7e6e3] bg-white">
        <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
          <MapPin className="size-4 text-[#3e7a2e]" />
          <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Regions &amp; cities</h2>
          <span className="ml-auto text-[11.5px] font-medium text-[#a3a19b]">{cityCount} cities</span>
        </div>
        {explorer ? (
          <div className="grid gap-x-8 gap-y-5 px-5 py-5 sm:grid-cols-2">
            {explorer.regions.map((region) => (
              <div key={region.name}>
                <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1b1b1b]">
                  <MapPin className="size-3.5 text-[#9c9a94]" />
                  {region.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {region.cities.map((city) => (
                    <span key={city} className="rounded-md border border-[#e7e6e3] bg-[#fafaf8] px-2.5 py-1 text-[12px] font-medium text-[#4d4c48]">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-[13px] text-[#a3a19b]">Region and city data is being prepared.</p>
        )}
      </section>
    </div>
  )
}
