'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, Clock, GraduationCap, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { RoiInfo } from '@/components/roi-info'
import { useParams, useSearchParams } from 'next/navigation'

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

function fmt(value: number, country: Country): string {
  const { symbol } = CURRENCY[country]
  return `${symbol}${Math.round(value).toLocaleString()}`
}

function calcTax(gross: number, country: Country, state: string): number {
  if (country === 'ie') {
    const credits = 3750
    let tax = gross <= 42000 ? gross * 0.20 : 8400 + (gross - 42000) * 0.40
    tax = Math.max(0, tax - credits)
    let usc = 0
    if (gross <= 12012)      usc = gross * 0.005
    else if (gross <= 21295) usc = 60 + (gross - 12012) * 0.02
    else if (gross <= 70044) usc = 246 + (gross - 21295) * 0.04
    else                      usc = 2196 + (gross - 70044) * 0.08
    const prsi = gross > 18304 ? gross * 0.04 : 0
    return Math.round(tax + usc + prsi)
  }
  if (country === 'uk') {
    const taxable = Math.max(0, gross - 12570)
    let tax = 0
    if (taxable <= 37700)       tax = taxable * 0.20
    else if (taxable <= 125140) tax = 7540 + (taxable - 37700) * 0.40
    else                         tax = 42384 + (taxable - 125140) * 0.45
    let ni = 0
    if (gross > 12570 && gross <= 50270) ni = (gross - 12570) * 0.08
    else if (gross > 50270)               ni = (50270 - 12570) * 0.08 + (gross - 50270) * 0.02
    return Math.round(tax + ni)
  }
  if (country === 'au') {
    let tax = 0
    if (gross <= 18200)       tax = 0
    else if (gross <= 45000)  tax = (gross - 18200) * 0.19
    else if (gross <= 120000) tax = 5092 + (gross - 45000) * 0.325
    else if (gross <= 180000) tax = 29467 + (gross - 120000) * 0.37
    else                       tax = 51667 + (gross - 180000) * 0.45
    return Math.round(tax + gross * 0.02)
  }
  if (country === 'ca') {
    const fd = Math.max(0, gross - 15705)
    let federal = 0
    if (fd <= 55867)       federal = fd * 0.15
    else if (fd <= 111733) federal = 8380 + (fd - 55867) * 0.205
    else                    federal = 19832 + (fd - 111733) * 0.26
    const cpp = Math.min(Math.max(0, gross - 3500), 68500) * 0.0595
    const ei  = Math.min(gross, 63200) * 0.0166
    const PROV: Record<string, number> = { ON: 0.0505, BC: 0.0506, QC: 0.14, AB: 0.10, MB: 0.108, NS: 0.0879, NB: 0.094, SK: 0.105, NL: 0.087, PE: 0.0965 }
    return Math.round(federal + cpp + ei + gross * (PROV[state] ?? 0.08))
  }
  // US
  const taxable = Math.max(0, gross - 14600)
  let federal = 0
  if (taxable <= 11600)       federal = taxable * 0.10
  else if (taxable <= 47150)  federal = 1160 + (taxable - 11600) * 0.12
  else if (taxable <= 100525) federal = 5426 + (taxable - 47150) * 0.22
  else                         federal = 17168 + (taxable - 100525) * 0.24
  const STATE_TAX: Record<string, number> = { AL:0.05,AK:0,AZ:0.025,AR:0.047,CA:0.093,CO:0.044,CT:0.065,DE:0.066,DC:0.085,FL:0,GA:0.055,HI:0.11,ID:0.058,IL:0.0495,IN:0.0305,IA:0.057,KS:0.057,KY:0.045,LA:0.0425,ME:0.075,MD:0.0575,MA:0.05,MI:0.0425,MN:0.0985,MS:0.05,MO:0.054,MT:0.069,NE:0.0664,NV:0,NH:0,NJ:0.0637,NM:0.059,NY:0.0685,NC:0.0499,ND:0.029,OH:0.0399,OK:0.0475,OR:0.099,PA:0.0307,RI:0.0599,SC:0.07,SD:0,TN:0,TX:0,UT:0.0485,VT:0.0875,VA:0.0575,WA:0,WV:0.065,WI:0.0765,WY:0 }
  const fica = Math.min(gross, 160200) * 0.062 + gross * 0.0145
  return Math.round(federal + gross * (STATE_TAX[state] ?? 0.05) + fica)
}

function SchoolTypeBadge({ type }: { type?: string }) {
  if (!type) return null
  const map: Record<string, { label: string; cls: string }> = {
    public:            { label: 'Public',     cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    private_nonprofit: { label: 'Private',    cls: 'bg-violet-50 text-violet-700 border-violet-200' },
    private_forprofit: { label: 'For-Profit', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  }
  const { label, cls } = map[type] ?? { label: type, cls: 'bg-slate-50 text-slate-600 border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}

function CollegeDetailInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const collegeId = params.college_id as string
  const countryParam = searchParams.get('country')
  const country = (VALID_COUNTRIES.includes(countryParam as Country) ? countryParam : 'us') as Country

  const [rows, setRows] = useState<RoiRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showAfterTax, setShowAfterTax] = useState(false)

  useEffect(() => {
    fetch(`/api/roi?college_id=${collegeId}&country=${country}&limit=200&sort=roi_score`)
      .then((r) => r.json())
      .then((json) => {
        setRows(json.data ?? [])
        setLoading(false)
      })
  }, [collegeId, country])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (rows.length === 0) {
    return <div className="max-w-5xl mx-auto px-6 py-20 text-slate-500">No data found.</div>
  }

  const best = rows[0]
  const currCode = CURRENCY[country].code
  const annualRent = (best.median_earnings - best.net_salary) / 1.4
  const livingCost = annualRent * 0.4
  const taxAmount = calcTax(best.median_earnings, country, best.college_state)
  const netAfterTax = best.median_earnings - taxAmount

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
        </p>

        {/* 공식 사이트 링크 */}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(best.college_name)}+official+site`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Official Website
          </a>
          {country === 'au' && (
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(best.college_name)}+CRICOS+registered`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              CRICOS Check
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate-500">Gross</span>
          <button
            onClick={() => setShowAfterTax((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${showAfterTax ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showAfterTax ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className="text-xs text-slate-500">After Tax</span>
          {showAfterTax && (
            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
              Estimated · {country.toUpperCase()} tax rules
            </span>
          )}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="overflow-visible">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ROI Score</span>
              <RoiInfo className="ml-auto" />
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
            <p className="text-2xl font-bold text-emerald-600">
              {showAfterTax ? fmt(netAfterTax, country) : fmt(best.net_salary, country)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {showAfterTax ? 'after tax' : 'after living costs'} · {currCode}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payback</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{best.payback_years} yrs</p>
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
                  sublabel: 'gross income',
                  value: best.median_earnings,
                  pct: 100,
                  barColor: 'bg-slate-300',
                  textColor: 'text-slate-700',
                  sign: '',
                },
                ...(showAfterTax ? [{
                  label: `Income Tax & ${country === 'ie' ? 'USC/PRSI' : country === 'uk' ? 'NI' : country === 'au' ? 'Medicare' : country === 'ca' ? 'CPP/EI' : 'FICA'}`,
                  sublabel: `${country.toUpperCase()} tax rules · estimated`,
                  value: taxAmount,
                  pct: (taxAmount / best.median_earnings) * 100,
                  barColor: 'bg-purple-300',
                  textColor: 'text-purple-600',
                  sign: '−',
                }] : []),
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
                  <span className="text-2xl font-bold text-emerald-600">
                    {fmt(showAfterTax ? netAfterTax : best.net_salary, country)}
                  </span>
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

export default function CollegeDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-6 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CollegeDetailInner />
    </Suspense>
  )
}
