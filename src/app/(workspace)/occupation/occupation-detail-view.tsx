"use client"

import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  ShieldAlert,
} from "lucide-react"
import type { CanonicalCareer } from "@/data/career-comparison-catalog"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import {
  DEMAND_RATING_LABELS,
  type OccupationDetail,
} from "@/lib/workspace/occupation-detail"

const CATEGORY_LABELS = new Map<string, string>(STUDY_CATEGORIES.map((c) => [c.id, c.label]))
const CATEGORY_ACCENT = new Map<string, string>([
  ["trades", "#c2691e"],
  ["health", "#2563eb"],
  ["technology", "#6d4fc4"],
  ["engineering", "#3e7a2e"],
  ["business", "#2563eb"],
  ["education", "#6d4fc4"],
  ["environment", "#3e7a2e"],
  ["design", "#c2691e"],
  ["hospitality", "#c2691e"],
  ["transport", "#6d4fc4"],
])

const REGION_RATING_TONE = new Map<string, string>([
  ["S", "bg-[#edf5ea] text-[#3e7a2e]"],
  ["M", "bg-[#fbf0e7] text-[#c2691e]"],
  ["R", "bg-[#f3f0fa] text-[#6d4fc4]"],
  ["NS", "bg-[#f6f6f4] text-[#a3a19b]"],
])

const fmt = (value: number) => new Intl.NumberFormat("en-US").format(value)

function SalaryBar({ low, median, high }: { low: number; median: number; high: number }) {
  const position = ((median - low) / (high - low)) * 100

  return (
    <div className="mt-4">
      <div className="relative h-2.5 rounded-full bg-[linear-gradient(90deg,#eef4ff,#2563eb)]">
        <div
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#2563eb] shadow-sm"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[#a3a19b]">
        <span>low {fmt(low)}</span>
        <span className="text-[#2563eb]">median {fmt(median)}</span>
        <span>high {fmt(high)}</span>
      </div>
    </div>
  )
}

export function OccupationDetailPanel({
  career,
  detail,
  countryCode,
  countryName,
}: {
  career: CanonicalCareer
  detail: OccupationDetail | undefined
  countryCode?: string
  countryName?: string
}) {
  const accent = CATEGORY_ACCENT.get(career.categoryId) ?? "#2563eb"
  const categoryLabel = CATEGORY_LABELS.get(career.categoryId) ?? career.categoryId

  const demand = detail?.demand.filter(
    (entry) => !countryCode || entry.countryCode === countryCode
  )
  const salaries = detail?.salaries.filter(
    (entry) => !countryCode || entry.countryCode === countryCode
  )

  if (!detail) {
    return (
      <div className="rounded-2xl border border-[#e7e6e3] bg-white p-8 text-center">
        <span
          className="mx-auto grid size-12 place-items-center rounded-2xl"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          <BriefcaseBusiness className="size-5" />
        </span>
        <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: accent }}>
          {categoryLabel}
        </p>
        <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
          {career.label}
        </h2>
        <p className="mt-1 text-[14px] text-[#6f6d68]">{career.labelKo}</p>
        <p className="mt-6 text-[13px] text-[#a3a19b]">
          A detailed entry for this occupation is coming. It will follow the Registered
          Nurse template.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section
        className="relative overflow-hidden rounded-2xl p-7 text-white"
        style={{ backgroundColor: accent }}
      >
        <span aria-hidden="true" className="absolute -top-16 -right-10 size-44 rounded-full bg-white/10" />
        <span aria-hidden="true" className="absolute -bottom-20 right-24 size-32 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
              {categoryLabel}
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
              {detail.labelKo}
            </span>
          </div>
          <h2 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.025em]">
            {detail.label}
          </h2>
          <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-white/85">{detail.overview.en}</p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {(demand?.length ? demand : detail.demand).map((entry) => (
          <div key={`demand-${entry.countryCode}`} className="rounded-2xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-[#a3a19b]">
                Demand · {entry.countryLabel}
                {countryCode === entry.countryCode && countryName && (
                  <span className="ml-1.5 rounded-full bg-[#edf5ea] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[#3e7a2e]">
                    {countryName}
                  </span>
                )}
              </p>
              <BadgeCheck className="size-4 text-[#3e7a2e]" />
            </div>
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#edf5ea] px-2.5 py-1 text-[13px] font-semibold text-[#3e7a2e]">
              <span className="size-1.5 rounded-full bg-[#3e7a2e]" />
              {entry.rating}
            </span>
            <p className="mt-2.5 text-[13px] leading-5.5 text-[#6f6d68]">{entry.note}</p>

            {entry.regionRatings && (
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {Object.entries(entry.regionRatings).map(([region, rating]) => (
                  <div
                    key={region}
                    className="flex flex-col items-center gap-0.5 rounded-lg border border-[#f0efec] bg-[#fafaf8] py-1.5"
                    title={`${region}: ${DEMAND_RATING_LABELS[rating] ?? rating}`}
                  >
                    <span className="text-[10px] font-semibold text-[#9c9a94]">{region}</span>
                    <span
                      className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                        REGION_RATING_TONE.get(rating) ?? "bg-[#f6f6f4] text-[#a3a19b]"
                      }`}
                    >
                      {rating}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[12px] font-medium text-[#2563eb] hover:underline"
            >
              {entry.sourceLabel} →
            </a>
          </div>
        ))}

        {(salaries?.length ? salaries : detail.salaries).map((entry) => (
          <div key={`salary-${entry.countryCode}`} className="rounded-2xl border border-[#e7e6e3] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-[#a3a19b]">
                Salary · {entry.countryLabel}
                {countryCode === entry.countryCode && countryName && (
                  <span className="ml-1.5 rounded-full bg-[#edf5ea] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[#3e7a2e]">
                    {countryName}
                  </span>
                )}
              </p>
              <Banknote className="size-4 text-[#c2691e]" />
            </div>
            <p className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
              {entry.currency} {fmt(entry.median)}
              <span className="ml-1.5 text-[12px] font-medium text-[#a3a19b]">/ yr median</span>
            </p>
            <SalaryBar low={entry.low} median={entry.median} high={entry.high} />
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[12px] font-medium text-[#2563eb] hover:underline"
            >
              {entry.sourceLabel} →
            </a>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1b1b1b]">What they do</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {detail.mainTasks.map((task, index) => (
            <div
              key={task}
              className="flex items-center gap-3 rounded-xl border border-[#f0efec] bg-[#fafaf8] p-3"
            >
              <span
                className="grid size-6 shrink-0 place-items-center rounded-lg text-[11.5px] font-bold text-white"
                style={{ backgroundColor: accent }}
              >
                {index + 1}
              </span>
              <p className="text-[13px] leading-5 text-[#4d4c48]">{task}</p>
            </div>
          ))}
        </div>
      </section>

      {detail.registration && (
        <section className="flex items-start gap-3 rounded-2xl border border-[#f0e0cb] bg-[#fbf0e7] p-5">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#c2691e]" />
          <p className="text-[13.5px] leading-6 text-[#5d4a33]">{detail.registration.en}</p>
        </section>
      )}

      <section className="rounded-2xl border border-[#e7e6e3] bg-white p-6">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1b1b1b]">Sources</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {detail.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-[#f0efec] bg-[#fafaf8] px-3.5 py-2.5 text-[12.5px] font-medium text-[#1b1b1b] transition hover:border-[#d8d8d4]"
              >
                {source.label}
                <ArrowUpRight className="ml-2 size-3.5 shrink-0 text-[#9c9a94]" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
