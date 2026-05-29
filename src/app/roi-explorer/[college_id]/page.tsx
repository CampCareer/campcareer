import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, TrendingUp, DollarSign, Clock, GraduationCap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'

type RoiRow = {
  college_id: string
  college_name: string
  college_state: string
  school_type?: string
  city_id: string
  city_name: string
  city_state: string
  roi_score: number
  net_salary: number
  payback_years: number
  tuition: number
  graduation_rate: number
  median_earnings: number
  field_name?: string | null
}

const VALID_COUNTRIES = ['us', 'au', 'ca', 'uk', 'ie'] as const
type Country = typeof VALID_COUNTRIES[number]

const CURRENCY: Record<Country, { symbol: string; code: string }> = {
  us: { symbol: '$',  code: 'USD' },
  au: { symbol: 'A$', code: 'AUD' },
  ca: { symbol: 'C$', code: 'CAD' },
  uk: { symbol: '£',  code: 'GBP' },
  ie: { symbol: '€',  code: 'EUR' },
}

const COUNTRY_LABEL: Record<Country, string> = {
  us: 'United States',
  au: 'Australia',
  ca: 'Canada',
  uk: 'United Kingdom',
  ie: 'Ireland',
}

function getTableName(country: Country): string {
  return country === 'au' ? 'roi_explorer_au'
    : country === 'ca' ? 'roi_explorer_ca'
    : country === 'uk' ? 'roi_explorer_uk'
    : country === 'ie' ? 'roi_explorer_ie'
    : 'roi_explorer_us'
}

function fmt(value: number, country: Country): string {
  const { symbol } = CURRENCY[country]
  return `${symbol}${Math.round(value).toLocaleString()}`
}

function SchoolTypeBadge({ type }: { type?: string }) {
  if (!type) return null
  const map: Record<string, { label: string; cls: string }> = {
    public:             { label: 'Public',    cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    private_nonprofit:  { label: 'Private',   cls: 'bg-violet-50 text-violet-700 border-violet-200' },
    private_forprofit:  { label: 'For-Profit', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  }
  const { label, cls } = map[type] ?? { label: type, cls: 'bg-slate-50 text-slate-600 border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}

export default async function CollegeDetailPage({
  params,
  searchParams,
}: {
  params: { college_id: string }
  searchParams: { country?: string }
}) {
  const country = (VALID_COUNTRIES.includes(searchParams.country as Country)
    ? searchParams.country
    : 'us') as Country

  const { data, error } = await supabase
    .from(getTableName(country))
    .select('*')
    .eq('college_id', params.college_id)
    .gt('roi_score', 0)
    .gt('payback_years', 0)
    .order('roi_score', { ascending: false })
    .limit(200)

  if (error || !data || data.length === 0) {
    notFound()
  }

  const rows = data as RoiRow[]
  const best = rows[0]
  const currCode = CURRENCY[country].code

  // Derive annual rent: net_salary = median_earnings - annual_rent × 1.4
  const annualRent = (best.median_earnings - best.net_salary) / 1.4
  const livingCost = annualRent * 0.4

  const TABLE_COLS = [
    ['City',                           'text-left'],
    ['ROI Score',                      'text-right'],
    [`Net Salary (${currCode})`,       'text-right'],
    [`Annual Rent (${currCode})`,      'text-right'],
    ['Payback',                        'text-right'],
  ] as const

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

      {/* Back */}
      <Link
        href={`/roi-explorer?country=${country}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        ROI Explorer
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <SchoolTypeBadge type={best.school_type} />
          <span className="text-xs text-slate-400">{COUNTRY_LABEL[country]}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{best.college_name}</h1>
        <p className="text-slate-500 text-sm">
          {best.college_state}
          {rows.length > 0 && (
            <> · {rows.length} {rows.length === 1 ? 'city' : 'cities'} analyzed</>
          )}
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ROI Score</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{best.roi_score.toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-0.5">best city</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Net Salary</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{fmt(best.net_salary, country)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{currCode} / year</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payback</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{best.payback_years}년</p>
            <p className="text-xs text-slate-400 mt-0.5">best city</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Grad Rate</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{(best.graduation_rate * 100).toFixed(1)}%</p>
            <p className="text-xs text-slate-400 mt-0.5">graduation</p>
          </CardContent>
        </Card>
      </div>

      {/* City Comparison Table */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">City ROI Comparison</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {TABLE_COLS.map(([label, align]) => (
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
                {rows.map((row) => {
                  const rent = (row.median_earnings - row.net_salary) / 1.4
                  return (
                    <tr key={row.city_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {row.city_name}
                        {row.city_state && row.city_state !== row.college_state && (
                          <span className="text-slate-400 text-xs ml-1.5">({row.city_state})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-indigo-600">{row.roi_score.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                        {fmt(row.net_salary, country)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {fmt(rent, country)}
                        <span className="text-slate-400 text-xs ml-0.5">/yr</span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                        {row.payback_years}년
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Financial Breakdown</h2>
        <Card>
          <CardContent className="pt-5 pb-6">
            <p className="text-xs text-slate-400 mb-5">
              Net Salary calculation — based on best-ROI city ({best.city_name})
            </p>

            {/* Tuition & Earnings info row */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-5 border-b border-slate-100">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Annual Tuition</p>
                <p className="text-xl font-bold text-slate-800">{fmt(best.tuition, country)}</p>
                <p className="text-xs text-slate-400 mt-0.5">per year · {fmt(best.tuition * 4, country)} total (4yr)</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Median Graduate Earnings</p>
                <p className="text-xl font-bold text-slate-800">{fmt(best.median_earnings, country)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{currCode} / year</p>
              </div>
            </div>

            {/* Net Salary waterfall */}
            <div className="space-y-3">
              {[
                {
                  label: 'Median Graduate Earnings',
                  sublabel: 'starting income',
                  value: best.median_earnings,
                  pct: 100,
                  barColor: 'bg-slate-300',
                  textColor: 'text-slate-700',
                  sign: '',
                },
                {
                  label: 'Annual Rent',
                  sublabel: 'city average × 12 months',
                  value: annualRent,
                  pct: (annualRent / best.median_earnings) * 100,
                  barColor: 'bg-rose-300',
                  textColor: 'text-rose-600',
                  sign: '−',
                },
                {
                  label: 'Living Cost',
                  sublabel: 'rent × 0.4 (utilities, food, etc.)',
                  value: livingCost,
                  pct: (livingCost / best.median_earnings) * 100,
                  barColor: 'bg-orange-300',
                  textColor: 'text-orange-600',
                  sign: '−',
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
                      {fmt(value, country)}
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
                    <span className="text-base font-bold text-slate-900">= Net Salary</span>
                    <span className="text-xs text-slate-400 ml-2">after rent &amp; living costs</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">{fmt(best.net_salary, country)}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${Math.min((best.net_salary / best.median_earnings) * 100, 100).toFixed(1)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {((best.net_salary / best.median_earnings) * 100).toFixed(1)}% of median earnings retained
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  )
}
