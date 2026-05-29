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
  roi: number
  color: string
}

// recharts 3.x: per-bar fill via `fill` accessor on <Bar> avoids Cell rendering issues
export default function CompareBarChart({ data }: { data: ChartEntry[] }) {
  const maxRoi = Math.max(...data.map((d) => d.roi), 1)
  const domainMax = Math.ceil((maxRoi * 1.15) / 10) * 10

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
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: "12px",
          }}
          formatter={(value) => [Number(value).toFixed(1), "Avg ROI Score"]}
          cursor={{ fill: "rgba(99,102,241,0.05)" }}
        />
        <Bar dataKey="roi" radius={[6, 6, 0, 0]} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
