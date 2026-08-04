import {
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarDays,
  GraduationCap,
  Home,
  TrendingUp,
} from "lucide-react"
import { AUSTRALIA_OCCUPATION_COUNTRY_PROFILE } from "@/data/australia-occupation-country-profile"
import type {
  AustraliaCountryMetric,
  AustraliaCountryMetrics,
} from "@/lib/workspace/australia-country-metrics"

const money = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 0,
})

function formatMoney(metric: AustraliaCountryMetric | undefined, suffix: string) {
  if (!metric) return "Data unavailable"
  return `${metric.currency} ${money.format(metric.amount)} ${suffix}`
}

function sourceDate(metric: AustraliaCountryMetric | undefined) {
  if (!metric) return null
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
  }).format(new Date(`${metric.dataAsOf}T00:00:00Z`))
}

function SourceLink({ metric }: { metric: AustraliaCountryMetric | undefined }) {
  if (!metric) return null
  return (
    <a
      href={metric.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#2563eb] hover:underline"
    >
      {metric.sourceName}
      <ArrowUpRight className="size-3" />
    </a>
  )
}

export function AustraliaCountryOverview({ metrics }: { metrics: AustraliaCountryMetrics }) {
  const profile = AUSTRALIA_OCCUPATION_COUNTRY_PROFILE
  const annualSalary = metrics.average_full_time_annual_earnings
  const monthlyLiving = metrics.student_living_cost_shared_monthly_average
  const monthlyLivingLow = metrics.student_living_cost_shared_monthly_low
  const monthlyLivingHigh = metrics.student_living_cost_shared_monthly_high
  const minimumWage = metrics.national_minimum_hourly_wage
  const casualWage = metrics.national_minimum_casual_hourly_wage
  const sharedRent = metrics.shared_room_rent_weekly_average

  return (
    <section className="lg:col-span-2 overflow-hidden rounded-2xl border border-[#dfe6ef] bg-white">
      <div className="border-b border-[#e7e6e3] bg-[#f7f9fc] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#2563eb]">
              Australia country context
            </p>
            <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
              Study, living and labour-market baseline
            </h2>
          </div>
          <span className="rounded-full border border-[#d9e4f5] bg-white px-3 py-1 text-[11px] font-medium text-[#52606d]">
            Numeric inputs from Supabase
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-[#e7e6e3] bg-[#fafaf8] p-4">
            <div className="flex items-center gap-2 text-[#c2691e]">
              <Banknote className="size-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em]">Average salary</p>
            </div>
            <p className="mt-3 text-[21px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
              {formatMoney(annualSalary, "/ year")}
            </p>
            <p className="mt-1 text-[11.5px] leading-5 text-[#7d7a73]">
              Full-time adult ordinary-time earnings. This is a national benchmark, not an occupation-specific salary.
            </p>
            {sourceDate(annualSalary) && (
              <p className="mt-2 text-[10.5px] text-[#a3a19b]">Data as of {sourceDate(annualSalary)}</p>
            )}
            <SourceLink metric={annualSalary} />
          </article>

          <article className="rounded-xl border border-[#e7e6e3] bg-[#fafaf8] p-4">
            <div className="flex items-center gap-2 text-[#3e7a2e]">
              <Home className="size-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em]">Shared living cost</p>
            </div>
            <p className="mt-3 text-[21px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
              {formatMoney(monthlyLiving, "/ month")}
            </p>
            <p className="mt-1 text-[11.5px] leading-5 text-[#7d7a73]">
              One international student in a sharehouse. Five-city range:{" "}
              {monthlyLivingLow && monthlyLivingHigh
                ? `${monthlyLivingLow.currency} ${money.format(monthlyLivingLow.amount)}–${money.format(monthlyLivingHigh.amount)} / month`
                : "unavailable"}.
            </p>
            {sharedRent && (
              <p className="mt-2 text-[11px] font-medium text-[#52606d]">
                Average share-room rent: {formatMoney(sharedRent, "/ week")}
              </p>
            )}
            <p className="mt-2 text-[10.5px] leading-4 text-[#a3a19b]">
              Includes share-room rent, basic food, public transport and mobile. Tuition, visa fees, health insurance and entertainment are excluded.
            </p>
            <SourceLink metric={monthlyLiving} />
          </article>

          <article className="rounded-xl border border-[#e7e6e3] bg-[#fafaf8] p-4">
            <div className="flex items-center gap-2 text-[#6d4fc4]">
              <TrendingUp className="size-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em]">Minimum wage</p>
            </div>
            <p className="mt-3 text-[21px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
              {formatMoney(minimumWage, "/ hour")}
            </p>
            <p className="mt-1 text-[11.5px] leading-5 text-[#7d7a73]">
              National adult minimum for employees not covered by an award or enterprise agreement.
            </p>
            {casualWage && (
              <p className="mt-2 text-[11px] font-medium text-[#52606d]">
                Casual benchmark: {formatMoney(casualWage, "/ hour")}
              </p>
            )}
            {sourceDate(minimumWage) && (
              <p className="mt-2 text-[10.5px] text-[#a3a19b]">Effective {sourceDate(minimumWage)}</p>
            )}
            <SourceLink metric={minimumWage} />
          </article>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-xl border border-[#e7e6e3] p-4">
            <div className="flex items-center gap-2 text-[#2563eb]">
              <CalendarDays className="size-4" />
              <h3 className="text-[13px] font-semibold">Academic year</h3>
            </div>
            <p className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">
              {profile.academicYear.headline}
            </p>
            <p className="mt-1.5 text-[12px] leading-5 text-[#6f6d68]">
              {profile.academicYear.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.academicYear.intakes.map((intake) => (
                <span
                  key={intake}
                  className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10.5px] font-semibold text-[#2563eb]"
                >
                  {intake}
                </span>
              ))}
            </div>
            <a
              href={profile.academicYear.source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#2563eb] hover:underline"
            >
              {profile.academicYear.source.label}
              <ArrowUpRight className="size-3" />
            </a>
          </article>

          <article className="rounded-xl border border-[#e7e6e3] p-4">
            <div className="flex items-center gap-2 text-[#3e7a2e]">
              <GraduationCap className="size-4" />
              <h3 className="text-[13px] font-semibold">Strong majors by workforce demand</h3>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {profile.strongMajors.map((major) => (
                <div key={major.id} className="rounded-lg bg-[#f7faf5] px-3 py-2.5">
                  <p className="text-[12px] font-semibold text-[#1b1b1b]">{major.label}</p>
                  <p className="mt-1 text-[10.5px] leading-4 text-[#77746d]">{major.reason}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="mt-4 rounded-xl border border-[#e7e6e3] p-4">
          <div className="flex items-center gap-2 text-[#6d4fc4]">
            <Building2 className="size-4" />
            <h3 className="text-[13px] font-semibold">Major universities and public VET providers</h3>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {profile.majorInstitutions.map((institution) => (
              <div key={institution.name} className="rounded-lg border border-[#f0efec] bg-[#fafaf8] px-3 py-2.5">
                <p className="text-[11.5px] font-semibold leading-4 text-[#1b1b1b]">{institution.name}</p>
                <p className="mt-1 text-[10px] text-[#9a978f]">
                  {institution.type === "public_vet" ? "Public VET" : "Research university"} · {institution.location}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {profile.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#2563eb] hover:underline"
              >
                {source.label}
                <ArrowUpRight className="size-3" />
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
