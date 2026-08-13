import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import type { CanonicalCareer } from "@/data/career-comparison-catalog"
import { AU_VOCATIONAL_PROGRAM_SHORTLIST } from "@/data/au-vocational-program-shortlist"
import { getLaunchCountry } from "@/data/launch-countries"
import { getOccupationEditorial } from "@/data/occupation-editorial"
import { AUSTRALIA_NURSING_PROGRAMS } from "@/data/programs/australia-nursing"
import {
  OPPORTUNITY_SCORE_MAXIMA,
  type CountryOccupationProfile,
  type OpportunityScoreBreakdown,
} from "@/lib/workspace/country-occupation-contract"
import { getAuOccupationStatePageByRegionCode } from "@/lib/workspace/au-occupation-state-seo"

const SCORE_LABELS: Array<{ key: keyof OpportunityScoreBreakdown; label: string }> = [
  { key: "shortage", label: "Official shortage" },
  { key: "vacancyIntensity", label: "Vacancy intensity" },
  { key: "employerDiversity", label: "Employer diversity" },
  { key: "vacancyTrend", label: "Vacancy trend" },
  { key: "entryLevel", label: "Entry-level access" },
  { key: "salary", label: "Relative salary" },
  { key: "growth", label: "Employment growth" },
  { key: "visa", label: "Visa pathways" },
  { key: "entryBurden", label: "Entry burden" },
]

const compact = (value: number | null) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)

const number = (value: number | null) =>
  value == null ? "—" : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)

const percent = (value: number | null) =>
  value == null ? "—" : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)}%`

const money = (currency: string, value: number | null) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value)

function scoreTone(score: number) {
  if (score >= 85) return "Excellent"
  if (score >= 70) return "Strong"
  if (score >= 55) return "Moderate"
  return "Limited"
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2 text-[#2563eb]">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-[23px] font-semibold tracking-[-0.025em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#77746e]">{hint}</p>
    </article>
  )
}

type ProgramCard = {
  id: string
  title: string
  provider: string
  url: string
  meta: string
  note?: string
}

function getProgramCards(profile: CountryOccupationProfile): ProgramCard[] {
  if (profile.countryCode !== "AU") return []

  const programRefs = new Set(profile.programLinks.map((link) => link.programRef))
  const canonicalCards: ProgramCard[] = profile.programLinks.flatMap((link) => {
    const program = link.program
    if (!program?.url) return []

    const duration =
      program.durationYears == null
        ? "Duration —"
        : `${program.durationYears} ${program.durationYears === 1 ? "year" : "years"}`
    const relationNote =
      link.relationType === "graduate_entry"
        ? "Graduate-entry pathway"
        : link.relationType === "progression"
          ? "Progression pathway"
          : link.relationType === "related"
            ? "Related study option"
            : "Direct entry-to-practice pathway"

    return [
      {
        id: link.programRef,
        title: program.title,
        provider: program.provider,
        url: program.url,
        meta: `${duration} · ${money("AUD", program.tuitionFeeAud)} annual tuition`,
        note: relationNote,
      },
    ]
  })

  const nursingCards: ProgramCard[] = AUSTRALIA_NURSING_PROGRAMS.filter((program) =>
    programRefs.has(program.id)
  ).map((program) => ({
    id: program.id,
    title: program.programName,
    provider: program.institutionName,
    url: program.source.url,
    meta: `${program.durationLabel} · ${program.tuitionLabel}`,
    note: program.registrationOutcome,
  }))

  const vocationalCards: ProgramCard[] = AU_VOCATIONAL_PROGRAM_SHORTLIST.filter((program) =>
    programRefs.has(program.id)
  ).map((program) => {
    const fee =
      program.tuitionAmount && program.tuitionCurrency
        ? money(program.tuitionCurrency, program.tuitionAmount)
        : program.internationalEligible
          ? "Check current fee"
          : "Apprenticeship / domestic pathway"
    const duration = program.durationMonths ? `${program.durationMonths} months` : program.qualificationLevel

    return {
      id: program.id,
      title: program.title,
      provider: program.providerName,
      url: program.officialUrl,
      meta: `${duration} · ${fee}`,
      note: program.eligibilityNote,
    }
  })

  return [...canonicalCards, ...nursingCards, ...vocationalCards]
}

type ProfileLink = CountryOccupationProfile["links"][number]

function LinkList({ links, hoverClass = "hover:border-[#cfd8ed]" }: { links: ProfileLink[]; hoverClass?: string }) {
  return (
    <div className="mt-4 space-y-2">
      {links.map((link) => (
        <a
          key={`${link.linkType}-${link.url}`}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center justify-between rounded-xl border border-[#f0efec] bg-[#fafaf8] px-3.5 py-2.5 text-[12px] font-medium text-[#1b1b1b] transition ${hoverClass}`}
        >
          <span className="min-w-0 truncate">{link.label}</span>
          <ArrowUpRight className="ml-3 size-3.5 shrink-0 text-[#9c9a94]" />
        </a>
      ))}
    </div>
  )
}

function StateDemandCard({
  rank,
  regionCode,
  vacancyCount,
  shortageRating,
  href,
}: {
  rank: number
  regionCode: string
  vacancyCount: number | null
  shortageRating: number | null
  href: string | null
}) {
  const rankTone = rank === 1 ? "border-[#ead29a] bg-[#fffaf0]" : rank === 2 ? "border-[#dce1e8] bg-[#f7f9fc]" : rank === 3 ? "border-[#d69a72] bg-[#fff4ed]" : "border-[#f0e5d9] bg-[#fffaf5]"
  const rankLabelTone = rank === 1 ? "text-[#9c7a4f]" : rank === 2 ? "text-[#6d7787]" : rank === 3 ? "text-[#b86636]" : "text-[#9c7a4f]"
  const content = <>
    <span className={`absolute left-2 top-1.5 text-[9px] font-bold sm:left-2.5 sm:top-2 ${rankLabelTone}`}>#{rank}</span>
    <p className="text-[11px] font-bold text-[#c2691e]">{regionCode}</p>
    <p className="mt-1 text-[16px] font-semibold text-[#1b1b1b] sm:text-[18px]">{number(vacancyCount)}</p>
    <p className="mt-0.5 text-[9px] leading-3 text-[#8f8c85] sm:text-[10px] sm:leading-normal">
      3-mo vacancies · shortage {shortageRating ?? "—"}/3
    </p>
  </>
  const className = `relative block rounded-xl border p-2.5 text-center sm:p-3 ${rankTone}`

  return href ? <Link href={href} className={`${className} transition hover:border-[#c2691e]/60`}>{content}</Link> : <div className={className}>{content}</div>
}

export function CountryOccupationDashboard({
  career,
  profile,
}: {
  career: CanonicalCareer
  profile: CountryOccupationProfile
}) {
  const editorial = getOccupationEditorial(career.id)
  const countryEditorial = editorial?.countries[profile.countryCode]
  const metric = profile.metric
  const countryName = getLaunchCountry(profile.countryCode)?.name ?? profile.countryCode
  const jobLinks = profile.links.filter((link) => link.linkType === "job_search")
  const employers = profile.links.filter((link) => link.linkType === "employer")
  const entryLinks = profile.links.filter(
    (link) => link.linkType === "entry_program" || link.linkType === "graduate_program"
  )
  const programs = getProgramCards(profile)
  const rankedRegions = [...profile.regions].sort((first, second) => (second.vacancyCount ?? -1) - (first.vacancyCount ?? -1))

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-2xl bg-[#2563eb] p-7 text-white">
        <span aria-hidden="true" className="absolute -right-12 -top-16 size-48 rounded-full bg-white/10" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                {countryName} · {profile.officialCodeSystem} {profile.officialUnitGroupCode}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
                {profile.specialisations.length} official occupations
              </span>
            </div>
            <h2 className="mt-4 text-[30px] font-semibold tracking-[-0.025em]">
              {profile.officialTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-white/85">
              {countryEditorial?.headline ?? editorial?.overview}
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-white/70">
              Opportunity score
            </p>
            <p className="mt-1 text-[42px] font-semibold leading-none">{metric.opportunityScore}</p>
            <p className="mt-1.5 text-[11px] font-semibold">{scoreTone(metric.opportunityScore)} · 100</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Banknote className="size-4" />}
          label="Median earnings"
          value={money(profile.currency, metric.annualisedMedianSalary)}
          hint={`${money(profile.currency, metric.medianWeeklyEarnings)} weekly · full-time non-managerial median`}
        />
        <MetricCard
          icon={<BriefcaseBusiness className="size-4" />}
          label="Online vacancies"
          value={number(metric.vacanciesThreeMonthAvg)}
          hint={`3-month average · ${metric.vacancyPeriod ?? "latest period"} · ${percent(metric.vacancyYoyPct)} year on year`}
        />
        <MetricCard
          icon={<Users className="size-4" />}
          label="Employment"
          value={compact(metric.employmentTotal)}
          hint={`${percent(metric.partTimeSharePct)} part-time · median age ${metric.medianAge ?? "—"}`}
        />
        <MetricCard
          icon={<TrendingUp className="size-4" />}
          label="Career outlook"
          value={percent(metric.employmentGrowth10yPct)}
          hint={`${percent(metric.employmentGrowth5yPct)} projected growth over five years`}
        />
      </div>

      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-semibold text-[#1b1b1b]">Career Opportunity Score</h3>
            <p className="mt-1 text-[11.5px] text-[#8f8c85]">
              {metric.scoreMethodologyVersion} · {metric.scoreStatus}
            </p>
          </div>
          <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-[11px] font-bold text-[#3e7a2e]">
            {metric.opportunityScore}/100
          </span>
        </div>
        <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {SCORE_LABELS.map(({ key, label }) => {
            const value = metric.score[key]
            const maximum = OPPORTUNITY_SCORE_MAXIMA[key]
            const width = maximum ? Math.round((value / maximum) * 100) : 0
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="font-medium text-[#4d4c48]">{label}</span>
                  <span className="font-semibold text-[#2563eb]">{value}/{maximum}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eef0f4]">
                  <div className="h-full rounded-full bg-[#2563eb]" style={{ width: `${width}%` }} />
                </div>
              </div>
            )
          })}
        </div>
        {countryEditorial?.scoreCaveat && (
          <p className="mt-5 rounded-xl bg-[#fff8ee] px-4 py-3 text-[11.5px] leading-5 text-[#795b34]">
            {countryEditorial.scoreCaveat}
          </p>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
          <div className="flex items-center gap-2 text-[#6d4fc4]">
            <GraduationCap className="size-4" />
            <h3 className="text-[15px] font-semibold">Entry pathway</h3>
          </div>
          <p className="mt-3 text-[13px] leading-6 text-[#5f5d58]">{countryEditorial?.entryPathway}</p>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#e7e0f3] bg-[#f8f6fc] p-4">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#6d4fc4]" />
            <p className="text-[12px] leading-5 text-[#5f5570]">{countryEditorial?.registration}</p>
          </div>
          {programs.length > 0 && (
            <div className="mt-4 space-y-2">
              {programs.map((program) => (
                <a
                  key={program.id}
                  href={program.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-[#f0efec] bg-[#fafaf8] p-3.5 transition hover:border-[#cfcac2]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12.5px] font-semibold text-[#1b1b1b]">{program.title}</p>
                      <p className="mt-0.5 text-[11px] text-[#77746e]">{program.provider}</p>
                    </div>
                    <ArrowUpRight className="size-3.5 shrink-0 text-[#9c9a94]" />
                  </div>
                  <p className="mt-2 text-[10.5px] text-[#8f8c85]">{program.meta}</p>
                  {program.note && (
                    <p className="mt-1.5 text-[10.5px] leading-4 text-[#77746e]">{program.note}</p>
                  )}
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
          <div className="flex items-center gap-2 text-[#3e7a2e]">
            <BadgeCheck className="size-4" />
            <h3 className="text-[15px] font-semibold">Official occupations included</h3>
          </div>
          <div className="mt-4 space-y-2">
            {profile.specialisations.map((item) => (
              <div key={item.officialCode} className="rounded-xl border border-[#edf0ea] bg-[#fafcf9] px-3.5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[12.5px] font-semibold text-[#2f4f29]">{item.officialTitle}</p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#3e7a2e]">
                    {item.officialCode}
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] text-[#7d8b78]">
                  {item.legacyCodeSystem && item.legacyCode
                    ? `Legacy ${item.legacyCodeSystem} ${item.legacyCode} · `
                    : ""}
                  {item.visaEligible ? "visa-list eligible" : "verify visa status"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
        <div className="flex items-center gap-2 text-[#c2691e]">
          <MapPinned className="size-4" />
          <h3 className="text-[15px] font-semibold">State demand ranking</h3>
        </div>
        <p className="mt-1.5 text-[10.5px] leading-4 text-[#8f8c85]">Ranked by published 3-month vacancies — not a personal outcome or visa ranking.</p>
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
          {rankedRegions.map((region, index) => {
            const rank = index + 1
            const statePage = profile.countryCode === "AU"
              ? getAuOccupationStatePageByRegionCode(region.regionCode, career.id)
              : null
            return <StateDemandCard
              key={region.regionCode}
              rank={rank}
              regionCode={region.regionCode}
              vacancyCount={region.vacancyCount}
              shortageRating={region.shortageRating}
              href={statePage?.path ?? null}
            />
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
          <div className="flex items-center gap-2 text-[#2563eb]">
            <BriefcaseBusiness className="size-4" />
            <h3 className="text-[15px] font-semibold">Jobs and entry pathways</h3>
          </div>
          {countryEditorial?.jobMarketNote && (
            <p className="mt-3 text-[12.5px] leading-5 text-[#6f6d68]">{countryEditorial.jobMarketNote}</p>
          )}
          <LinkList links={[...jobLinks, ...entryLinks]} />
        </section>

        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
          <div className="flex items-center gap-2 text-[#3e7a2e]">
            <Building2 className="size-4" />
            <h3 className="text-[15px] font-semibold">Major employers</h3>
          </div>
          <p className="mt-3 text-[11.5px] leading-5 text-[#77746e]">
            Major organisations and employer networks with official career pages relevant to this occupation.
          </p>
          <LinkList links={employers} hoverClass="hover:border-[#cfe0ca]" />
        </section>
      </div>
    </div>
  )
}
