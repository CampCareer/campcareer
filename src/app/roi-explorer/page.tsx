"use client"

import { useState } from "react"
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DollarSign,
  Home,
  TrendingUp,
  PiggyBank,
  Star,
  Globe,
  GraduationCap,
} from "lucide-react"

type ROIEntry = {
  grossSalary: number
  netSalary: number
  avgRent: number
  livingCosts: number
  netMonthly: number
  roiScore: number
  currency: string
  symbol: string
}

// country -> major -> data
const DATA: Record<string, Record<string, ROIEntry>> = {
  Australia: {
    "Computer Science":  { grossSalary: 75000, netSalary: 60212, avgRent: 2200, livingCosts: 1500, netMonthly: 1318, roiScore: 82, currency: "AUD", symbol: "A$" },
    Nursing:             { grossSalary: 65000, netSalary: 53412, avgRent: 2200, livingCosts: 1500, netMonthly: 751,  roiScore: 70, currency: "AUD", symbol: "A$" },
    Engineering:         { grossSalary: 80000, netSalary: 63612, avgRent: 2200, livingCosts: 1500, netMonthly: 1601, roiScore: 86, currency: "AUD", symbol: "A$" },
    Business:            { grossSalary: 58000, netSalary: 48652, avgRent: 2200, livingCosts: 1500, netMonthly: 354,  roiScore: 58, currency: "AUD", symbol: "A$" },
    Education:           { grossSalary: 55000, netSalary: 46612, avgRent: 2200, livingCosts: 1500, netMonthly: 184,  roiScore: 48, currency: "AUD", symbol: "A$" },
    Psychology:          { grossSalary: 55000, netSalary: 46612, avgRent: 2200, livingCosts: 1500, netMonthly: 184,  roiScore: 48, currency: "AUD", symbol: "A$" },
    Marketing:           { grossSalary: 58000, netSalary: 48652, avgRent: 2200, livingCosts: 1500, netMonthly: 354,  roiScore: 58, currency: "AUD", symbol: "A$" },
    Accounting:          { grossSalary: 62000, netSalary: 51372, avgRent: 2200, livingCosts: 1500, netMonthly: 581,  roiScore: 63, currency: "AUD", symbol: "A$" },
    Law:                 { grossSalary: 70000, netSalary: 56812, avgRent: 2200, livingCosts: 1500, netMonthly: 1034, roiScore: 76, currency: "AUD", symbol: "A$" },
    "Data Science":      { grossSalary: 85000, netSalary: 67012, avgRent: 2200, livingCosts: 1500, netMonthly: 1884, roiScore: 89, currency: "AUD", symbol: "A$" },
  },
  UK: {
    "Computer Science":  { grossSalary: 35000, netSalary: 27822, avgRent: 1400, livingCosts: 900, netMonthly: 18,   roiScore: 50, currency: "GBP", symbol: "£" },
    Nursing:             { grossSalary: 28000, netSalary: 23062, avgRent: 1400, livingCosts: 900, netMonthly: -378, roiScore: 32, currency: "GBP", symbol: "£" },
    Engineering:         { grossSalary: 38000, netSalary: 29862, avgRent: 1400, livingCosts: 900, netMonthly: 189,  roiScore: 56, currency: "GBP", symbol: "£" },
    Business:            { grossSalary: 30000, netSalary: 24422, avgRent: 1400, livingCosts: 900, netMonthly: -265, roiScore: 38, currency: "GBP", symbol: "£" },
    Education:           { grossSalary: 26000, netSalary: 21702, avgRent: 1400, livingCosts: 900, netMonthly: -492, roiScore: 28, currency: "GBP", symbol: "£" },
    Psychology:          { grossSalary: 26000, netSalary: 21702, avgRent: 1400, livingCosts: 900, netMonthly: -492, roiScore: 28, currency: "GBP", symbol: "£" },
    Marketing:           { grossSalary: 29000, netSalary: 23742, avgRent: 1400, livingCosts: 900, netMonthly: -322, roiScore: 36, currency: "GBP", symbol: "£" },
    Accounting:          { grossSalary: 32000, netSalary: 25782, avgRent: 1400, livingCosts: 900, netMonthly: -152, roiScore: 44, currency: "GBP", symbol: "£" },
    Law:                 { grossSalary: 40000, netSalary: 31222, avgRent: 1400, livingCosts: 900, netMonthly: 302,  roiScore: 60, currency: "GBP", symbol: "£" },
    "Data Science":      { grossSalary: 42000, netSalary: 32582, avgRent: 1400, livingCosts: 900, netMonthly: 415,  roiScore: 63, currency: "GBP", symbol: "£" },
  },
  Canada: {
    "Computer Science":  { grossSalary: 70000, netSalary: 52500, avgRent: 1800, livingCosts: 1300, netMonthly: 1075, roiScore: 80, currency: "CAD", symbol: "C$" },
    Nursing:             { grossSalary: 60000, netSalary: 45600, avgRent: 1800, livingCosts: 1300, netMonthly: 500,  roiScore: 68, currency: "CAD", symbol: "C$" },
    Engineering:         { grossSalary: 75000, netSalary: 55500, avgRent: 1800, livingCosts: 1300, netMonthly: 1325, roiScore: 83, currency: "CAD", symbol: "C$" },
    Business:            { grossSalary: 55000, netSalary: 42350, avgRent: 1800, livingCosts: 1300, netMonthly: 229,  roiScore: 58, currency: "CAD", symbol: "C$" },
    Education:           { grossSalary: 50000, netSalary: 39000, avgRent: 1800, livingCosts: 1300, netMonthly: -50,  roiScore: 45, currency: "CAD", symbol: "C$" },
    Psychology:          { grossSalary: 50000, netSalary: 39000, avgRent: 1800, livingCosts: 1300, netMonthly: -50,  roiScore: 45, currency: "CAD", symbol: "C$" },
    Marketing:           { grossSalary: 55000, netSalary: 42350, avgRent: 1800, livingCosts: 1300, netMonthly: 229,  roiScore: 58, currency: "CAD", symbol: "C$" },
    Accounting:          { grossSalary: 60000, netSalary: 45600, avgRent: 1800, livingCosts: 1300, netMonthly: 500,  roiScore: 68, currency: "CAD", symbol: "C$" },
    Law:                 { grossSalary: 65000, netSalary: 48750, avgRent: 1800, livingCosts: 1300, netMonthly: 863,  roiScore: 74, currency: "CAD", symbol: "C$" },
    "Data Science":      { grossSalary: 80000, netSalary: 58400, avgRent: 1800, livingCosts: 1300, netMonthly: 1667, roiScore: 86, currency: "CAD", symbol: "C$" },
  },
  Ireland: {
    "Computer Science":  { grossSalary: 50000, netSalary: 35000, avgRent: 1900, livingCosts: 1200, netMonthly: -183, roiScore: 48, currency: "EUR", symbol: "€" },
    Nursing:             { grossSalary: 45000, netSalary: 32400, avgRent: 1900, livingCosts: 1200, netMonthly: -400, roiScore: 38, currency: "EUR", symbol: "€" },
    Engineering:         { grossSalary: 55000, netSalary: 37400, avgRent: 1900, livingCosts: 1200, netMonthly: 17,   roiScore: 52, currency: "EUR", symbol: "€" },
    Business:            { grossSalary: 42000, netSalary: 30240, avgRent: 1900, livingCosts: 1200, netMonthly: -580, roiScore: 35, currency: "EUR", symbol: "€" },
    Education:           { grossSalary: 38000, netSalary: 27740, avgRent: 1900, livingCosts: 1200, netMonthly: -788, roiScore: 28, currency: "EUR", symbol: "€" },
    Psychology:          { grossSalary: 38000, netSalary: 27740, avgRent: 1900, livingCosts: 1200, netMonthly: -788, roiScore: 28, currency: "EUR", symbol: "€" },
    Marketing:           { grossSalary: 42000, netSalary: 30240, avgRent: 1900, livingCosts: 1200, netMonthly: -580, roiScore: 35, currency: "EUR", symbol: "€" },
    Accounting:          { grossSalary: 46000, netSalary: 32660, avgRent: 1900, livingCosts: 1200, netMonthly: -378, roiScore: 40, currency: "EUR", symbol: "€" },
    Law:                 { grossSalary: 55000, netSalary: 37400, avgRent: 1900, livingCosts: 1200, netMonthly: 17,   roiScore: 52, currency: "EUR", symbol: "€" },
    "Data Science":      { grossSalary: 58000, netSalary: 38860, avgRent: 1900, livingCosts: 1200, netMonthly: 138,  roiScore: 55, currency: "EUR", symbol: "€" },
  },
  USA: {
    "Computer Science":  { grossSalary: 95000, netSalary: 70241, avgRent: 2000, livingCosts: 1400, netMonthly: 2453, roiScore: 92, currency: "USD", symbol: "$" },
    Nursing:             { grossSalary: 65000, netSalary: 50636, avgRent: 2000, livingCosts: 1400, netMonthly: 820,  roiScore: 72, currency: "USD", symbol: "$" },
    Engineering:         { grossSalary: 90000, netSalary: 66974, avgRent: 2000, livingCosts: 1400, netMonthly: 2181, roiScore: 88, currency: "USD", symbol: "$" },
    Business:            { grossSalary: 65000, netSalary: 50636, avgRent: 2000, livingCosts: 1400, netMonthly: 820,  roiScore: 70, currency: "USD", symbol: "$" },
    Education:           { grossSalary: 45000, netSalary: 35891, avgRent: 2000, livingCosts: 1400, netMonthly: -409, roiScore: 42, currency: "USD", symbol: "$" },
    Psychology:          { grossSalary: 48000, netSalary: 38152, avgRent: 2000, livingCosts: 1400, netMonthly: -221, roiScore: 46, currency: "USD", symbol: "$" },
    Marketing:           { grossSalary: 58000, netSalary: 45687, avgRent: 2000, livingCosts: 1400, netMonthly: 407,  roiScore: 62, currency: "USD", symbol: "$" },
    Accounting:          { grossSalary: 58000, netSalary: 45687, avgRent: 2000, livingCosts: 1400, netMonthly: 407,  roiScore: 62, currency: "USD", symbol: "$" },
    Law:                 { grossSalary: 72000, netSalary: 55211, avgRent: 2000, livingCosts: 1400, netMonthly: 1201, roiScore: 76, currency: "USD", symbol: "$" },
    "Data Science":      { grossSalary: 105000, netSalary: 76776, avgRent: 2000, livingCosts: 1400, netMonthly: 2998, roiScore: 96, currency: "USD", symbol: "$" },
  },
}

const COUNTRIES = ["Australia", "UK", "Canada", "Ireland", "USA"] as const
const MAJORS = [
  "Computer Science",
  "Nursing",
  "Engineering",
  "Business",
  "Education",
  "Psychology",
  "Marketing",
  "Accounting",
  "Law",
  "Data Science",
] as const

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺",
  UK: "🇬🇧",
  Canada: "🇨🇦",
  Ireland: "🇮🇪",
  USA: "🇺🇸",
}

function roiColor(score: number) {
  if (score >= 80) return { bar: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Excellent" }
  if (score >= 65) return { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Good" }
  if (score >= 50) return { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Fair" }
  return { bar: "bg-rose-400", badge: "bg-rose-50 text-rose-700 border-rose-200", label: "Low" }
}

function fmt(symbol: string, amount: number) {
  return `${symbol}${Math.abs(amount).toLocaleString()}`
}

export default function ROIExplorerPage() {
  const [country, setCountry] = useState<string>("")
  const [major, setMajor] = useState<string>("")

  const result = country && major ? DATA[country]?.[major] : null

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* Page header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
          <TrendingUp className="w-3 h-3" />
          Sample data — API integration coming soon
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ROI Explorer</h1>
        <p className="mt-2 text-slate-500 text-sm leading-relaxed">
          Select a country and degree to estimate your financial return on investment as an international graduate.
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-4 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Country select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Country
              </label>
              <Select value={country} onValueChange={(v) => setCountry(v ?? "")}>
                <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue placeholder="Select country…" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {COUNTRY_FLAGS[c]} {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Major select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                Degree / Major
              </label>
              <Select value={major} onValueChange={(v) => setMajor(v ?? "")}>
                <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 text-sm">
                  <SelectValue placeholder="Select major…" />
                </SelectTrigger>
                <SelectContent>
                  {MAJORS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {!result && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">Select a country and major to see your ROI estimate.</p>
        </div>
      )}

      {/* Results */}
      {result && (() => {
        const { symbol, currency, grossSalary, netSalary, avgRent, livingCosts, netMonthly, roiScore } = result
        const roi = roiColor(roiScore)
        const netMonthlyPositive = netMonthly >= 0

        return (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">

            {/* Context badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                {COUNTRY_FLAGS[country]} {country} · {major}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">in {currency}</span>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-3">

              {/* Gross salary */}
              <Card className="shadow-sm">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                    </div>
                    <CardTitle className="text-xs text-slate-500 font-medium">Starting Salary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-2xl font-bold text-slate-900">{fmt(symbol, grossSalary)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">per year (gross)</p>
                </CardContent>
              </Card>

              {/* After-tax */}
              <Card className="shadow-sm">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <PiggyBank className="w-4 h-4 text-emerald-500" />
                    </div>
                    <CardTitle className="text-xs text-slate-500 font-medium">After-Tax Take-Home</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-2xl font-bold text-slate-900">{fmt(symbol, netSalary)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {Math.round((netSalary / grossSalary) * 100)}% of gross · {fmt(symbol, Math.round(netSalary / 12))}/mo
                  </p>
                </CardContent>
              </Card>

              {/* Avg rent */}
              <Card className="shadow-sm">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <Home className="w-4 h-4 text-orange-500" />
                    </div>
                    <CardTitle className="text-xs text-slate-500 font-medium">Average Monthly Rent</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-2xl font-bold text-slate-900">{fmt(symbol, avgRent)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">+ {fmt(symbol, livingCosts)} living costs</p>
                </CardContent>
              </Card>

              {/* Net monthly */}
              <Card className={`shadow-sm ${netMonthlyPositive ? "" : "ring-1 ring-rose-200"}`}>
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${netMonthlyPositive ? "bg-indigo-50" : "bg-rose-50"}`}>
                      <TrendingUp className={`w-4 h-4 ${netMonthlyPositive ? "text-indigo-500" : "text-rose-500"}`} />
                    </div>
                    <CardTitle className="text-xs text-slate-500 font-medium">Net Monthly Surplus</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className={`text-2xl font-bold ${netMonthlyPositive ? "text-slate-900" : "text-rose-600"}`}>
                    {netMonthlyPositive ? "" : "−"}{fmt(symbol, netMonthly)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">after rent & living costs</p>
                </CardContent>
              </Card>

            </div>

            {/* ROI score */}
            <Card className="shadow-sm">
              <CardHeader className="pb-0 border-b">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-indigo-500" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-800">ROI Score</CardTitle>
                  </div>
                  <div className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${roi.badge}`}>
                    {roi.label}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-bold text-slate-900 leading-none">{roiScore}</span>
                  <span className="text-slate-400 text-sm mb-1">/ 100</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${roi.bar}`}
                    style={{ width: `${roiScore}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  Score reflects starting salary, effective tax rate, and cost of living. Based on sample data — actual figures vary by city, employer, and lifestyle.
                </p>
              </CardContent>
            </Card>

          </div>
        )
      })()}

    </div>
  )
}
