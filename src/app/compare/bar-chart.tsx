"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

export interface ChartEntry {
  country: string
  value: number
  color: string
}

interface Props {
  data: ChartEntry[]
  valueLabel?: string
  formatValue?: (v: number) => string
  formatTick?: (v: number) => string
}

export default function CompareBarChart({
  data,
  valueLabel = "Avg ROI Score",
  formatValue = (v) => v.toFixed(1),
  formatTick,
}: Props) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)

  // For salary values (large numbers) auto-scale to K; for small values keep as-is
  const isSalary = maxVal > 500
  const domainMax = isSalary
    ? Math.ceil((maxVal * 1.15) / 5000) * 5000
    : Math.ceil((maxVal * 1.15) / 10) * 10

  const defaultTick = isSalary
    ? (v: number) => `${Math.round(v / 1000)}K`
    : (v: number) => v.toFixed(0)

  const tickFmt = formatTick ?? defaultTick

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="country"
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, domainMax]}
          tickFormatter={tickFmt}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: "12px",
          }}
          formatter={(v) => [formatValue(Number(v)), valueLabel]}
          cursor={{ fill: "rgba(99,102,241,0.05)" }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
