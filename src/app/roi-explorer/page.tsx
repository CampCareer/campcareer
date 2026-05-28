"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

type RoiRow = {
  college_id: string
  college_name: string
  college_state: string
  city_id: string
  city_name: string
  city_state: string
  roi_score: number
  net_salary: number
  payback_years: number
  tuition: number
  graduation_rate: number
  median_earnings: number
}

const SORT_OPTIONS = [
  { value: "roi_score",     label: "ROI Score" },
  { value: "net_salary",    label: "Net Salary" },
  { value: "payback_years", label: "Payback Years" },
] as const

const LIMIT_OPTIONS = [20, 50, 100] as const

const US_STATES = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "DC", name: "Washington D.C." },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
] as const

function fmtUSD(n: number) {
  return `$${Math.round(n).toLocaleString()}`
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-100 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function ROIExplorerPage() {
  const [state, setState] = useState("CA")
  const [sort, setSort]   = useState("roi_score")
  const [limit, setLimit] = useState(50)
  const [data, setData]   = useState<RoiRow[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const stateName = US_STATES.find((s) => s.abbr === state)?.name ?? state

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/roi?state=${state}&limit=${limit}&sort=${sort}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (json.error) throw new Error(json.error)
        setData(json.data ?? [])
        setCount(json.count ?? 0)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [state, sort, limit])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
          <TrendingUp className="w-3 h-3" />
          Live data · {stateName} colleges
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ROI Explorer</h1>
        <p className="mt-2 text-slate-500 text-sm leading-relaxed">
          Compare return on investment across {stateName} colleges and cities.
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-4 pb-5">
          <div className="flex flex-wrap items-end gap-4">

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">State</label>
              <Select value={state} onValueChange={(v) => v && setState(v)}>
                <SelectTrigger className="w-52 h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Sort by</label>
              <Select value={sort} onValueChange={(v) => v && setSort(v)}>
                <SelectTrigger className="w-44 h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Results</label>
              <Select value={String(limit)} onValueChange={(v) => v && setLimit(Number(v))}>
                <SelectTrigger className="w-28 h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIMIT_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} rows</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!loading && !error && (
              <p className="text-xs text-slate-400 pb-2.5">
                {data.length.toLocaleString()} of {count.toLocaleString()} results
              </p>
            )}

          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load data: {error}
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {[
                    ["College",     "text-left"],
                    ["City",        "text-left"],
                    ["ROI Score",   "text-right"],
                    ["Net Salary",  "text-right"],
                    ["Payback",     "text-right"],
                    ["Tuition",     "text-right"],
                    ["Grad Rate",   "text-right"],
                  ].map(([label, align]) => (
                    <th
                      key={label}
                      className={`px-4 py-3 ${align} text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                  : data.map((row) => (
                    <tr key={`${row.college_id}-${row.city_id}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[220px] truncate">
                        {row.college_name}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {row.city_name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-indigo-600">
                          {row.roi_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                        {fmtUSD(row.net_salary)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {row.payback_years}년
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {fmtUSD(row.tuition)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {(row.graduation_rate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
