'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const INITIAL_COUNT = 10

function money(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `A$${Math.round(value).toLocaleString()}` : '—'
}

function percent(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value * 100)}%` : '—'
}

export type FieldGroupRow = {
  fieldName: string
  cleanFieldName: string
  aqfLabel: string
  courseCount: number | null
  tuition: number | null
  medianEarnings: number | null
  employmentRate: number | null
  roiScore: number | null
  paybackYears: number | null
  programHref: string
  compareHref: string
  evidenceHref: string | null
  evidenceLabel: string | null
}

function ProgramEvidenceActions({ evidenceHref, evidenceLabel, programHref, compareHref }: { evidenceHref: string | null; evidenceLabel: string | null; programHref: string; compareHref: string }) {
  return <div className="flex min-w-48 flex-col items-start gap-2 text-xs">
    {evidenceHref ? <a href={evidenceHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-700 hover:underline"><ExternalLink className="size-3.5" />{evidenceLabel}</a> : <span className="font-medium text-slate-500">Official course link pending</span>}
    <Link href={programHref} className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-800">See matching programs <ArrowRight className="size-3.5" /></Link>
    <Link href={compareHref} className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-700">Compare this group <ArrowRight className="size-3.5" /></Link>
  </div>
}

function RoiBarChart({ fields }: { fields: FieldGroupRow[] }) {
  const chartData = fields.slice(0, 12).map((f) => ({
    name: f.cleanFieldName || '—',
    roi: f.roiScore ?? 0,
  }))

  return (
    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-slate-500">ROI Score by Field</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }} barCategoryGap="20%">
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            formatter={(value) => [Number(value).toFixed(1), 'ROI Score']}
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            cursor={{ fill: 'rgba(37,99,235,0.04)' }}
          />
          <Bar dataKey="roi" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.roi > 5 ? '#2563eb' : entry.roi > 3 ? '#60a5fa' : '#93c5fd'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function FieldGroupsSection({
  fields,
  rowsLength,
  totalFields,
}: {
  fields: FieldGroupRow[]
  rowsLength: number
  totalFields: number
}) {
  const [expanded, setExpanded] = useState(false)
  const visibleFields = expanded ? fields : fields.slice(0, INITIAL_COUNT)
  const hasMore = fields.length > INITIAL_COUNT

  return (
    <section className="mx-auto max-w-5xl px-5 pb-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-950">Study groups & outcomes</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Each row is a field and AQF tuition group used for this university&apos;s ROI estimate.
              Earnings, employment and completion are provider-level QILT measures; the program
              source shows the closest verified course or active CRICOS record.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            {totalFields} field groups
          </span>
        </div>

        <RoiBarChart fields={fields} />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-400">
              <tr>
                <th className="pb-3 pr-4">Field & level</th>
                <th className="pb-3 pr-4">Annual tuition</th>
                <th className="pb-3 pr-4">Graduate earnings*</th>
                <th className="pb-3 pr-4">ROI</th>
                <th className="pb-3">Program & next step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleFields.map((row, index) => (
                <tr key={`${row.fieldName}-${row.aqfLabel}-${index}`} className="group align-top transition-colors hover:bg-blue-50/30">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">
                      {row.cleanFieldName || 'Available study group'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {row.aqfLabel}
                      {row.courseCount ? ` · ${row.courseCount} course${row.courseCount === 1 ? '' : 's'}` : ''}
                    </p>
                  </td>
                  <td className="py-4 pr-4 font-medium text-slate-800">{money(row.tuition)}</td>
                  <td className="py-4 pr-4">
                    <p className="font-medium text-slate-800">{money(row.medianEarnings)}</p>
                    <p className="mt-1 text-xs text-slate-400">Employment {percent(row.employmentRate)}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-700">
                      {row.roiScore?.toFixed(1) ?? '—'}
                    </span>
                    <p className="mt-1 text-xs text-slate-400">Payback {row.paybackYears ?? '—'} yrs</p>
                  </td>
                  <td className="py-4">
                    <ProgramEvidenceActions
                      evidenceHref={row.evidenceHref}
                      evidenceLabel={row.evidenceLabel}
                      programHref={row.programHref}
                      compareHref={row.compareHref}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-blue-700"
            >
              {expanded ? (
                <>Show less <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Show all {fields.length} fields <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-sm leading-6 text-slate-700">
        <div className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
          Data confidence
        </div>
        <p className="mt-1">
          Graduate earnings, employment and completion measures are reported at provider level
          from QILT-linked source data; tuition and course counts are grouped by field and AQF level.
          Confirm course fees, CRICOS status and entry requirements with the university before applying.
        </p>
      </div>
    </section>
  )
}
