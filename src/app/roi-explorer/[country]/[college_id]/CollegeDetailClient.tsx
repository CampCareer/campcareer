'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, Clock, GraduationCap, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { RoiInfo } from '@/components/roi-info'
import { useTranslations } from '@/lib/i18n/locale-provider'
import { calcTax } from '@/lib/tax'
import { degreeYears } from '@/lib/degree-years'

export type DetailRow = {
  college_id: string
  college_name: string
  college_state: string
  school_type?: string
  city_id?: string | null
  city_name?: string | null
  city_state?: string | null
  college_city?: string | null
  roi_score: number
  net_salary: number
  payback_years: number
  tuition: number
  graduation_rate: number | null
  median_earnings: number
  field_name?: string | null
  rent_median?: number | null
  cost_of_living_index?: number | null
  duration_years?: number | null
}

type Country = 'us' | 'au' | 'ca' | 'uk' | 'ie' | 'de' | 'nl'

const CURRENCY: Record<Country, { symbol: string; code: string }> = {
  us: { symbol: '$',  code: 'USD' },
  au: { symbol: 'A$', code: 'AUD' },
  ca: { symbol: 'C$', code: 'CAD' },
  uk: { symbol: '£',  code: 'GBP' },
  ie: { symbol: '€',  code: 'EUR' },
  de: { symbol: '€',  code: 'EUR' },
  nl: { symbol: '€',  code: 'EUR' },
}

const COUNTRY_LABEL: Record<Country, string> = {
  us: 'United States',
  au: 'Australia',
  ca: 'Canada',
  uk: 'United Kingdom',
  ie: 'Ireland',
  de: 'Germany',
  nl: 'Netherlands',
}

// Share of city market rent a student/graduate typically pays in shared accommodation.
// Market rent data (rent_median) represents a full private-market unit; students typically
// share, so we apply this factor before annualising.
const STUDENT_RENT_SHARE: Record<Country, number> = {
  us: 0.45,
  au: 0.45,
  ca: 0.45,
  uk: 0.45,
  ie: 0.45,
  de: 0.45,
  nl: 0.45,
}

const LIVING_COST_MULTIPLIER = 0.4

function fmt(value: number, country: Country): string {
  const { symbol } = CURRENCY[country]
  return `${symbol}${Math.round(value).toLocaleString()}`
}

function fmtMaybe(value: number | null | undefined, country: Country): string {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return 'Not available'
  }

  return fmt(value, country)
}

function fmtPercent(rate: number | null | undefined): string {
  if (typeof rate !== 'number' || !Number.isFinite(rate)) return '—'
  return `${(rate * 100).toFixed(1)}%`
}

function SchoolTypeBadge({ type }: { type?: string }) {
  const t = useTranslations()
  const td = t.roiExplorer.detail
  if (!type) return null
  const map: Record<string, { label: string; cls: string }> = {
    public:            { label: td.schoolPublic,    cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    private_nonprofit: { label: td.schoolPrivate,   cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    private_forprofit: { label: td.schoolForProfit, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  }
  const { label, cls } = map[type] ?? { label: type, cls: 'bg-slate-50 text-slate-600 border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}

export function CollegeDetailClient({
  country,
  rows,
  websiteUrl,
  backHref,
  backLabel,
}: {
  country: Country
  rows: DetailRow[]
  websiteUrl: string | null
  backHref?: string
  backLabel?: string
}) {
  const t = useTranslations()
  const td = t.roiExplorer.detail
  const [showAfterTax, setShowAfterTax] = useState(false)

  if (rows.length === 0) {
    return <div className="max-w-5xl mx-auto px-6 py-20 text-slate-500">{td.noData}</div>
  }

  const best = rows[0]
  const currCode = CURRENCY[country].code

  const grossSalary = best.median_earnings ?? best.net_salary ?? 0
  const displayCity = best.city_name ?? best.college_city ?? best.college_state

  const monthlyMarketRent =
    typeof best.rent_median === 'number' &&
    Number.isFinite(best.rent_median) &&
    best.rent_median > 0
      ? best.rent_median
      : null

  const monthlyStudentRent = monthlyMarketRent
    ? Math.round(monthlyMarketRent * STUDENT_RENT_SHARE[country])
    : null

  const annualRent = monthlyStudentRent
    ? Math.round(monthlyStudentRent * 12)
    : null

  const livingCost =
    annualRent && annualRent > 0
      ? Math.round(annualRent * LIVING_COST_MULTIPLIER)
      : null

  const hasLivingCostData = annualRent !== null && livingCost !== null

  const taxAmount = calcTax(grossSalary, country, best.college_state)
  const incomeAfterTax = taxAmount == null ? null : Math.max(0, grossSalary - taxAmount)
  const afterTaxAvailable = incomeAfterTax !== null
  const taxBreakdown = showAfterTax && taxAmount !== null
    ? [{
        label: `${td.incomeTax} ${country === 'ie' ? 'USC/PRSI' : country === 'uk' ? 'NI' : country === 'au' ? 'Medicare' : country === 'ca' ? 'CPP/EI' : 'FICA'}`,
        sublabel: `${country.toUpperCase()} ${td.taxEstimated}`,
        value: taxAmount,
        pct: grossSalary > 0 ? (taxAmount / grossSalary) * 100 : 0,
        barColor: 'bg-purple-300',
        textColor: 'text-purple-600',
        sign: '−',
      }]
    : []

  const salaryBase = showAfterTax && afterTaxAvailable ? incomeAfterTax : grossSalary

  // TODO: align ROI score / payback formulas to use the same student-rent share factor
  // so the summary cards and the financial breakdown always reflect the same assumptions.
  const estimatedNetSalary = hasLivingCostData
    ? Math.max(0, salaryBase - annualRent - livingCost)
    : salaryBase

  const retainedPercent =
    hasLivingCostData && grossSalary > 0
      ? Math.max(0, Math.round((estimatedNetSalary / grossSalary) * 1000) / 10)
      : null

  const totalYears = degreeYears(country, best.duration_years)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

      {/* Back */}
      <Link
        href={backHref ?? `/roi-explorer?country=${country}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel ?? td.backLink}
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <SchoolTypeBadge type={best.school_type} />
          <span className="text-xs text-slate-400">{COUNTRY_LABEL[country]}</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-950 tracking-tight">{best.college_name}</h1>
        <p className="text-slate-500 text-sm">
          {best.college_state}
        </p>

        {/* 공식 사이트 링크 — 실제 URL이 있으면 사용, 없으면 구글 검색 폴백 */}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <a
            href={websiteUrl ?? `https://www.google.com/search?q=${encodeURIComponent(best.college_name)}+official+site`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {td.officialWebsite}
          </a>
          {country === 'au' && (
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(best.college_name)}+CRICOS+registered`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {td.cricosCheck}
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate-500">{td.gross}</span>
          <button
            onClick={() => afterTaxAvailable && setShowAfterTax((v) => !v)}
            disabled={!afterTaxAvailable}
            aria-disabled={!afterTaxAvailable}
            className={`relative w-10 h-5 rounded-full transition-colors ${showAfterTax && afterTaxAvailable ? 'bg-blue-600' : 'bg-slate-200'} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showAfterTax ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className="text-xs text-slate-500">{td.afterTax}</span>
          {showAfterTax && afterTaxAvailable && (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              {td.taxEstimate.replace('{country}', country.toUpperCase())}
            </span>
          )}
          {!afterTaxAvailable && <span className="text-xs text-slate-400">Tax estimate unavailable for this country</span>}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="overflow-visible">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-[.18em]">{td.roiScore}</span>
              <RoiInfo className="ml-auto" />
            </div>
            <p className="text-2xl font-semibold text-blue-600">{best.roi_score.toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{td.bestCity}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-[.18em]">{td.netSalary}</span>
            </div>
            <p className="text-2xl font-semibold text-emerald-600">
              {fmt(estimatedNetSalary, country)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasLivingCostData
                ? showAfterTax
                  ? `${td.afterTaxLabel} + ${td.afterLivingCosts}`
                  : td.afterLivingCosts
                : 'before rent & living costs'} · {currCode}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-[.18em]">{td.payback}</span>
            </div>
            <p className="text-2xl font-semibold text-amber-600">{best.payback_years} yrs</p>
            <p className="text-xs text-slate-400 mt-0.5">{td.bestCity}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-[.18em]">{td.gradRate}</span>
            </div>
            <p className="text-2xl font-semibold text-blue-600">{fmtPercent(best.graduation_rate)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{td.graduation}</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{td.financialBreakdown}</h2>
        <Card>
          <CardContent className="pt-5 pb-6">
            <p className="text-xs text-slate-400 mb-5">
              {td.netSalaryCalcPrefix} ({displayCity})
            </p>

            {/* Tuition & Earnings info row */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-5 border-b border-slate-100">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-[.18em] mb-1">{td.annualTuition}</p>
                <p className="text-xl font-semibold text-slate-800">{fmt(best.tuition, country)}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {td.perYear} · {fmt(best.tuition * totalYears, country)} {td.totalYears.replace('{years}', String(totalYears))}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-[.18em] mb-1">{td.medianEarnings}</p>
                <p className="text-xl font-semibold text-slate-800">{fmt(best.median_earnings, country)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{currCode} {td.perYear}</p>
              </div>
            </div>

            <p className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-700">
              {td.financialEstimateNote}
            </p>

            {/* Net Salary waterfall */}
            <div className="space-y-3">
              {[
                {
                  label: td.medianEarnings,
                  sublabel: td.grossIncome,
                  value: grossSalary,
                  pct: 100,
                  barColor: 'bg-slate-300',
                  textColor: 'text-slate-700',
                  sign: '',
                },
                ...taxBreakdown,
                {
                  label: td.annualRent,
                  sublabel: hasLivingCostData ? td.cityAvgMonths : 'rent data unavailable',
                  value: annualRent,
                  pct: annualRent && grossSalary > 0 ? (annualRent / grossSalary) * 100 : 0,
                  barColor: 'bg-rose-300',
                  textColor: 'text-rose-600',
                  sign: hasLivingCostData ? '−' : '',
                },
                {
                  label: td.livingCost,
                  sublabel: hasLivingCostData ? td.rentMultiplier : 'excluded from estimate',
                  value: livingCost,
                  pct: livingCost && grossSalary > 0 ? (livingCost / grossSalary) * 100 : 0,
                  barColor: 'bg-orange-300',
                  textColor: 'text-orange-600',
                  sign: hasLivingCostData ? '−' : '',
                },
              ].map(({ label, sublabel, value, pct, barColor, textColor, sign }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        {sign && <span className={`${textColor} mr-1`}>{sign}</span>}
                        {label}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">{sublabel}</span>
                    </div>
                    <span className={`text-sm font-semibold ${textColor} whitespace-nowrap`}>
                      {fmtMaybe(value, country)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all`}
                      style={{ width: `${Math.min(pct, 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="border-t-2 border-slate-200 pt-4 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-semibold text-slate-900">{td.equalNetSalary}</span>
                    <span className="text-xs text-slate-400 ml-2">
                      {hasLivingCostData ? td.afterRentLiving : 'before rent & living costs'}
                    </span>
                  </div>
                  <span className="text-2xl font-semibold text-emerald-600">
                    {fmt(estimatedNetSalary, country)}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${retainedPercent !== null ? Math.min(retainedPercent, 100).toFixed(1) : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {retainedPercent !== null
                    ? `${retainedPercent.toFixed(1)}${td.earningsRetained}`
                    : 'Living-cost adjustment unavailable'}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  )
}
