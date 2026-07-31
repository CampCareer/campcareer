"use client"

import {
  ArrowUpRight,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  ListChecks,
  MapPin,
  Receipt,
  TrendingUp,
} from "lucide-react"
import type { VisaEntry } from "@/lib/workspace/visa-catalog"
import type { VisaDetail } from "@/lib/workspace/visa-detail"
import { cn } from "@/lib/utils"

const KIND_BADGE: Record<string, string> = {
  Study: "bg-[#eef3fb] text-[#3a5c9a]",
  Work: "bg-[#f0f5ee] text-[#4a7a33]",
  "Working holiday": "bg-[#faf3ea] text-[#a0672a]",
  Skilled: "bg-[#f3f0fa] text-[#6a4f9a]",
  Family: "bg-[#fdf0f0] text-[#a05555]",
  Temporary: "bg-[#f4f0ee] text-[#8a5a4a]",
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

function DetailStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-[#e7e6e3] bg-white p-3.5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#a3a19b]">
        <span className="text-[#6d4fc4]">{icon}</span>
        {label}
      </div>
      <p className="mt-1.5 text-[16px] font-semibold tracking-[-0.01em] text-[#1b1b1b]">{value}</p>
    </div>
  )
}

function SectionTitle({
  icon,
  title,
  right,
}: {
  icon: React.ReactNode
  title: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0efec] px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <span className="text-[#6d4fc4]">{icon}</span>
        <h3 className="text-[14.5px] font-semibold text-[#1b1b1b]">{title}</h3>
      </div>
      {right}
    </div>
  )
}

export function VisaDetailPanel({
  visa,
  detail,
  cities,
}: {
  visa: VisaEntry
  detail: VisaDetail | null
  cities?: string[]
}) {
  const total = detail
    ? detail.costBreakdown.items.reduce((n, item) => n + item.amount, 0)
    : 0

  return (
    <div className="overflow-hidden rounded-xl border border-[#e7e6e3] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
                KIND_BADGE[visa.kind] ?? KIND_BADGE.Temporary
              )}
            >
              {visa.kind}
            </span>
            {detail?.status && (
              <span className="rounded-md bg-[#f3f0fa] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#6d4fc4]">
                {detail.status}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-[20px] font-semibold leading-tight tracking-[-0.01em] text-[#1b1b1b]">
            {visa.name}
          </h2>
          <p className="mt-0.5 text-[12.5px] text-[#a3a19b]">{visa.country}</p>
        </div>
        <a
          href={visa.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e0dfdb] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1b1b1b] transition hover:border-[#6d4fc4]/40 hover:text-[#6d4fc4]"
        >
          Official source <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      {!detail ? (
        <div className="border-t border-[#f0efec] px-5 py-10 text-center">
          <p className="text-[13.5px] font-medium text-[#6f6d68]">{visa.note}</p>
          <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-5 text-[#a3a19b]">
            We&apos;re researching the full breakdown — requirements, process timeline and costs —
            for this visa. Check back soon.
          </p>
          <p className="mt-4 text-[11.5px] font-medium text-[#c4c2bc]">
            Issuing authority: {visa.authority}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 border-t border-[#f0efec] px-5 py-4 sm:grid-cols-2">
            <DetailStat
              icon={<Clock className="size-3.5" />}
              label="Processing time"
              value={detail.processingTime}
            />
            <DetailStat
              icon={<TrendingUp className="size-3.5" />}
              label="Success rate"
              value={detail.successRate ?? "—"}
            />
            {detail.duration && (
              <DetailStat
                icon={<CalendarRange className="size-3.5" />}
                label="Duration"
                value={detail.duration}
              />
            )}
            {detail.minSalary && (
              <DetailStat
                icon={<CircleDollarSign className="size-3.5" />}
                label="Min. salary"
                value={detail.minSalary}
              />
            )}
          </div>

          <div className="border-t border-[#f0efec]">
            <SectionTitle
              icon={<ListChecks className="size-4" />}
              title="Requirements"
              right={
                <span className="text-[11.5px] font-medium text-[#a3a19b]">
                  {detail.requirements.length} items
                </span>
              }
            />
            <ul className="px-5 py-4">
              {detail.requirements.map((requirement) => (
                <li key={requirement} className="flex items-start gap-2.5 py-1.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#3e7a2e]" />
                  <span className="text-[13px] leading-5.5 text-[#4d4c48]">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#f0efec]">
            <SectionTitle
              icon={<Clock className="size-4" />}
              title="Process overview"
              right={
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f3f0fa] px-2.5 py-1 text-[11.5px] font-semibold text-[#6d4fc4]">
                  Total: {detail.totalEstimatedTime}
                </span>
              }
            />
            <ol className="px-5 py-4">
              {detail.process.map((step, index) => (
                <li key={step.step} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f3f0fa] text-[11px] font-bold text-[#6d4fc4]">
                      {index + 1}
                    </span>
                    {index < detail.process.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-[#e7e6e3]" />
                    )}
                  </div>
                  <div className={cn("min-w-0 flex-1 pb-5", index === detail.process.length - 1 && "pb-0")}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[13px] font-semibold text-[#1b1b1b]">{step.step}</p>
                      <span className="shrink-0 text-[12px] font-medium text-[#6f6d68]">
                        {step.duration}
                      </span>
                    </div>
                    {step.note && (
                      <p className="mt-0.5 text-[12.5px] leading-5 text-[#a3a19b]">{step.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-[#f0efec]">
            <SectionTitle
              icon={<Receipt className="size-4" />}
              title="Cost breakdown"
            />
            <div className="px-5 py-4">
              <ul className="divide-y divide-[#f0efec]">
                {detail.costBreakdown.items.map((item) => (
                  <li key={item.item} className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-[#4d4c48]">
                      {item.item}
                      {item.optional && (
                        <span className="rounded-md bg-[#f5f3f0] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8a8578]">
                          Optional
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] font-semibold text-[#1b1b1b]">
                      {formatMoney(item.amount, detail.costBreakdown.currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#fafaf8] px-3.5 py-2.5">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#6f6d68]">
                  Total estimated cost
                </span>
                <span className="text-[16px] font-bold tracking-[-0.01em] text-[#6d4fc4]">
                  {formatMoney(total, detail.costBreakdown.currency)}
                </span>
              </div>
              <p className="mt-2 text-[11.5px] text-[#a3a19b]">{detail.costNote}</p>
            </div>
          </div>

          <div className="border-t border-[#f0efec] px-5 py-4">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-[#1b1b1b]">
              <MapPin className="size-3.5 text-[#6d4fc4]" /> Top cities
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(detail.topCities.length > 0
                ? detail.topCities
                : (cities ?? []).slice(0, 6)
              ).map((city) => (
                <span
                  key={city}
                  className="rounded-md border border-[#e7e6e3] bg-[#fafaf8] px-2.5 py-1 text-[12px] font-medium text-[#4d4c48]"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
