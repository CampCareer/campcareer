"use client"

// recharts(~150kB)는 필드 선택 시에만 필요 — RoiExplorerClient에서
// next/dynamic으로 lazy-load 되도록 별도 모듈로 분리.
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const SYMBOL: Record<string, string> = { us: "$", au: "A$", ca: "C$", gb: "£", ie: "€" }

export default function SalaryGrowthChart({
  data,
  country,
  label,
}: {
  data: { year: string; salary: number }[]
  country: string
  label: string
}) {
  const sym = SYMBOL[country] ?? "$"
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
          width={52}
        />
        <Tooltip
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0
            return [`${sym}${Math.round(num).toLocaleString()}`, label]
          }}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "13px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
        <Line
          type="monotone"
          dataKey="salary"
          name={label}
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={{ fill: "#2563eb", r: 5, strokeWidth: 0 }}
          activeDot={{ r: 7, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
