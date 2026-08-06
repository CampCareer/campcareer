import Link from "next/link"
import {
  Banknote,
  Building2,
  CalendarDays,
  GraduationCap,
  MapPin,
  Sparkles,
  Stamp,
  Wallet,
} from "lucide-react"
import { COUNTRY_INSTITUTION_TYPE_LABELS } from "@/data/australia-occupation-country-profile"
import type { Batch3CountryContent } from "@/data/batch-3-country-content"
import type { CountryMetrics, CountryMoneyRange } from "@/lib/workspace/country-metric-contract"
import { getCountryExplorer } from "@/lib/workspace/country-explorer"
import { VISA_CATALOG } from "@/lib/workspace/visa-catalog"
import { cn } from "@/lib/utils"

function compactAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount)
}

function formatRange(range: CountryMoneyRange | undefined) {
  if (!range) return "—"
  return `${range.currency} ${compactAmount(range.low)}–${compactAmount(range.high)}`
}

function formatRanking(range: CountryMoneyRange | undefined) {
  if (!range) return "—"
  return `${range.currency} ${compactAmount(range.rankingValue)}`
}

function MetricCard({
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
  hint: string
  accent: string
  href?: string
}) {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg", accent)}>{icon}</span>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">{label}</p>
      </div>
      <p className="mt-3 text-[25px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{hint}</p>
    </>
  )
  const className =
    "rounded-xl border border-[#e7e6e3] bg-white p-4 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]/15"
  return href ? (
    <Link href={href} className={cn(className, "block hover:border-[#c9d7f5] hover:shadow-sm")}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  )
}

export function Batch3CountryDashboard({
  metrics,
  profile,
}: {
  metrics: CountryMetrics
  profile: Batch3CountryContent
}) {
  const explorer = getCountryExplorer(profile.countryCode)
  const visas = VISA_CATALOG.filter((visa) => visa.countryCode === profile.countryCode)
  if (!explorer) return null

  const cityCount = explorer.regions.reduce((total, region) => total + region.cities.length, 0)
  const salaryHint = metrics.salaryRange
    ? `${profile.salaryHint} · comparison ${formatRanking(metrics.salaryRange)}`
    : "Verified salary range coming soon"
  const livingHint = metrics.livingCostRange
    ? profile.livingHint
    : "Verified student planning range coming soon"

  return (
    <div>
      <p className="mb-4 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">{profile.introduction}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<Stamp className="size-4 text-[#6d4fc4]" />}
          accent="bg-[#f3f0fa]"
          label="Visa options"
          value={String(visas.length)}
          hint={profile.visaHint}
          href={`/visas?country=${profile.countryCode}`}
        />
        <MetricCard
          icon={<Banknote className="size-4 text-[#2563eb]" />}
          accent="bg-[#eef4ff]"
          label="Salary range"
          value={formatRange(metrics.salaryRange)}
          hint={salaryHint}
        />
        <MetricCard
          icon={<Wallet className="size-4 text-[#c2691e]" />}
          accent="bg-[#fbf0e7]"
          label="Living costs"
          value={formatRange(metrics.livingCostRange)}
          hint={livingHint}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <div className="flex items-center gap-2 text-[#2563eb]">
            <CalendarDays className="size-4" />
            <h2 className="text-[14.5px] font-semibold">Academic year</h2>
          </div>
          <p className="mt-3 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{profile.academicYear.headline}</p>
          <p className="mt-2 text-[12.5px] leading-5 text-[#6f6d68]">{profile.academicYear.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.academicYear.intakes.map((intake) => (
              <span key={intake} className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-semibold text-[#2563eb]">
                {intake}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <div className="flex items-center gap-2 text-[#3e7a2e]">
            <GraduationCap className="size-4" />
            <h2 className="text-[14.5px] font-semibold">Strong majors by workforce demand</h2>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {profile.strongMajors.map((major) => (
              <div key={major.id} className="rounded-lg border border-[#dfe8db] bg-[#f7faf5] px-3 py-2.5">
                <p className="text-[12px] font-semibold text-[#2f5f25]">{major.label}</p>
                <p className="mt-1 text-[10.5px] leading-4 text-[#66805f]">{major.reason}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-[#e7e6e3] bg-white p-5">
        <div className="flex items-center gap-2 text-[#6d4fc4]">
          <Building2 className="size-4" />
          <h2 className="text-[14.5px] font-semibold">Major universities and colleges</h2>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {profile.majorInstitutions.map((institution) => (
            <div key={institution.name} className="rounded-lg border border-[#f0efec] bg-[#fafaf8] px-3 py-3">
              <p className="text-[12px] font-semibold leading-4 text-[#1b1b1b]">{institution.name}</p>
              <p className="mt-1 text-[10.5px] text-[#9a978f]">
                {COUNTRY_INSTITUTION_TYPE_LABELS[institution.type]} · {institution.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-[#e7e6e3] bg-white lg:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
            <MapPin className="size-4 text-[#3e7a2e]" />
            <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Regions &amp; cities</h2>
            <span className="ml-auto text-[11.5px] font-medium text-[#a3a19b]">{cityCount} cities</span>
          </div>
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
        </section>

        <section className="rounded-xl border border-[#e7e6e3] bg-white">
          <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
            <Sparkles className="size-4 text-[#2563eb]" />
            <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Work opportunities</h2>
          </div>
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
        </section>
      </div>
    </div>
  )
}
