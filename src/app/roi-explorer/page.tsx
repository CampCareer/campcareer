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
  id: string
  college_name: string
  field_name: string | null
  city_name: string
  roi_score: number
  net_salary: number
  payback_years: number
  tuition: number
  graduation_rate: number
}

const SORT_OPTIONS = [
  { value: "roi_score",     label: "ROI Score" },
  { value: "net_salary",    label: "Net Salary" },
  { value: "payback_years", label: "Payback Years" },
] as const

const LIMIT_OPTIONS = [20, 50, 100] as const

function fmtUSD(n: number) {
  return `$${Math.round(n).toLocaleString()}`
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-100 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function ROIExplorerPage() {
  const [sort, setSort]   = useState("roi_score")
  const [limit, setLimit] = useState(50)
  const [data, setData]   = useState<RoiRow[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/roi?state=CA&limit=${limit}&sort=${sort}`)
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
  }, [sort, limit])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
          <TrendingUp className="w-3 h-3" />
          Live data · California colleges
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ROI Explorer</h1>
        <p className="mt-2 text-slate-500 text-sm leading-relaxed">
          Compare return on investment across California colleges and cities.
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-4 pb-5">
          <div className="flex flex-wrap items-end gap-4">

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
                    ["Field",       "text-left"],
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
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[220px] truncate">
                        {row.college_name}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {row.field_name ?? "-"}
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
