'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from '@/lib/i18n/locale-provider'
import { ArrowRight, Check, Copy, CheckCheck, BarChart2 } from 'lucide-react'

type RoiRow = {
  college_id: string
  college_name: string
  college_state: string
  field_name: string | null
  roi_score: number
  net_salary: number
  gross_salary: number | null
  payback_years: number
  tuition: number
}

const DEFAULT_STATE: Record<string, string> = {
  us: 'CA', au: 'NSW', ca: 'ON', uk: 'ALL_STATES', ie: 'Leinster',
}

const CURRENCY: Record<string, string> = {
  IE: '€', AU: 'A$', CA: 'C$', UK: '£', US: '$',
}

const FIELD_SUGGESTIONS = [
  'Computer Science', 'Business', 'Nursing',
  'Engineering', 'Data Science', 'Law',
]

type Step = 1 | 2 | 3 | 4 | 5 | 6
type Goal = 'visa' | 'pr' | 'study'
type Budget = 'low' | 'mid' | 'high'
type English = 'advanced' | 'intermediate' | 'beginner'
type Environment = 'city' | 'town' | 'any'

function getMatchReasons(
  row: RoiRow,
  goal: Goal,
  budget: Budget,
  currency: string
): string[] {
  const reasons: string[] = []
  reasons.push(`Avg. salary ${currency}${Math.round(row.net_salary).toLocaleString()} (estimated)`)
  if (row.roi_score >= 10) reasons.push('Strong estimated ROI for this field')
  if (row.payback_years > 0 && row.payback_years <= 3) reasons.push('Estimated payback under 3 years')
  if (goal === 'pr') reasons.push('Relevant to PR-focused planning')
  if (goal === 'visa') reasons.push('Post-study work options may be available')
  if (budget === 'low' && row.tuition > 0 && row.tuition < 15000) reasons.push('Within your selected budget range')
  if (budget === 'mid' && row.tuition > 0 && row.tuition <= 30000) reasons.push('Within your selected budget range')
  return reasons.slice(0, 3)
}

function recommend(
  goal: Goal,
  budget: Budget,
  english: English,
  environment: Environment
): { country: string; flag: string; reasons: string[] } {
  const scores: Record<string, number> = { IE: 0, AU: 0, CA: 0, UK: 0, US: 0 }

  if (goal === 'visa')       { scores.AU += 3; scores.CA += 3; scores.UK += 2; scores.IE += 1 }
  else if (goal === 'pr')    { scores.CA += 4; scores.AU += 3; scores.IE += 2 }
  else                       { scores.IE += 3; scores.UK += 3; scores.US += 2; scores.AU += 1 }

  if (budget === 'low')      { scores.IE += 4; scores.CA += 2; scores.UK += 1 }
  else if (budget === 'mid') { scores.AU += 3; scores.CA += 3; scores.IE += 2; scores.UK += 2 }
  else                       { scores.US += 4; scores.UK += 3; scores.AU += 2 }

  if (english === 'beginner')          { scores.CA += 2; scores.IE += 2 }
  else if (english === 'intermediate') { scores.AU += 2; scores.IE += 2; scores.UK += 1 }
  else                                 { scores.US += 2; scores.UK += 2; scores.AU += 1 }

  if (environment === 'city')      { scores.UK += 2; scores.US += 2; scores.AU += 1 }
  else if (environment === 'town') { scores.IE += 3; scores.CA += 2; scores.AU += 1 }
  else                             { scores.CA += 1; scores.IE += 1 }

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]

  const COUNTRY_META: Record<string, { flag: string; reasons: Record<string, string[]> }> = {
    IE: { flag: '🇮🇪', reasons: {
      visa:  ['Work permit pathways may be available (EU)', 'Critical Skills Employment Permit pathway', 'Relatively low tuition fees'],
      pr:    ['EU permanent residency pathways available', 'Stamp 4 eligibility after qualifying period', 'Relatively lower cost of living'],
      study: ['Low tuition from ~€10k/yr (varies)', 'HEA graduate salary data (public)', 'English-speaking EU study option'],
    }},
    AU: { flag: '🇦🇺', reasons: {
      visa:  ['Post-study work visa options (2–4 yrs, check requirements)', '8,500+ CRICOS-registered courses', 'Competitive graduate salary ranges'],
      pr:    ['Points-based PR pathways may be available (subclass 189/190)', 'State nomination may be available', 'Skilled worker demand in some occupations'],
      study: ['QILT-based graduate outcome data (public)', 'Wide range of study fields available', 'High quality of life index'],
    }},
    CA: { flag: '🇨🇦', reasons: {
      visa:  ['Post-Graduation Work Permit options (check IRCC)', 'Express Entry pathway (points-based)', 'Settlement support programs available'],
      pr:    ['Express Entry PR pathway (points-based, check IRCC)', 'Provincial Nominee Programs available', 'Generally stable immigration policy'],
      study: ['Affordable tuition fees (varies by province)', 'French-speaking options available', 'Multicultural environment'],
    }},
    UK: { flag: '🇬🇧', reasons: {
      visa:  ['Graduate Route post-study work option (2 yrs)', 'Access to major global companies', 'HESA graduate salary data (public)'],
      pr:    ['Skilled Worker visa pathway may be available', 'Indefinite Leave to Remain after qualifying period', 'Major financial and tech hub'],
      study: ['Russell Group and other top universities', '1-year master\'s programmes available', 'HESA graduate outcomes data (public)'],
    }},
    US: { flag: '🇺🇸', reasons: {
      visa:  ['OPT post-study work options (STEM up to 3 yrs)', 'Access to major tech and finance hubs', 'High estimated graduate salary ranges'],
      pr:    ['Employment-based immigration pathways (EB-2/EB-3)', 'Multiple immigration pathway options', 'High demand for tech talent in some sectors'],
      study: ['College Scorecard data (public)', 'Scholarships may be available (varies)', 'World-class universities and programs'],
    }},
  }

  const meta = COUNTRY_META[top]
  return { country: top, flag: meta.flag, reasons: meta.reasons[goal] }
}

const COUNTRY_NAME: Record<string, string> = {
  IE: 'Ireland', AU: 'Australia', CA: 'Canada', UK: 'United Kingdom', US: 'United States'
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations()
  const to = t.onboarding
  const [step, setStep] = useState<Step>(1)
  const [field, setField] = useState<string>('')
  const [goal, setGoal] = useState<Goal | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [english, setEnglish] = useState<English | null>(null)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ country: string; flag: string; reasons: string[] } | null>(null)
  const [matchedSchools, setMatchedSchools] = useState<RoiRow[]>([])
  const [copied, setCopied] = useState(false)

  async function handleFinish(env: Environment) {
    if (!goal || !budget || !english) return
    setSaving(true)
    const rec = recommend(goal, budget, english, env)
    setResult(rec)

    let schools: RoiRow[] = []
    try {
      const c = rec.country.toLowerCase()
      const res = await fetch(
        `/api/roi?country=${c}&state=${encodeURIComponent(DEFAULT_STATE[c])}&field=${encodeURIComponent(field)}&sort=roi_score&limit=5`
      )
      const json = await res.json()
      schools = json.data ?? []
    } catch {
      schools = []
    }
    setMatchedSchools(schools)

    setStep(6)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error: prefError } = await supabase.from('user_preferences').upsert({
        id: user.id,
        field,
        goal,
        budget,
        english,
        environment: env,
        recommended_country: rec.country,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      // Non-fatal: result screen is already visible so the user experience is
      // unaffected if preference saving fails (e.g. missing column, network error).
      if (prefError) {
        console.error('[onboarding] Failed to save preferences:', prefError.message)
      }
    }
    setSaving(false)
  }

  async function handleCopyToClipboard() {
    if (!result) return
    const top = matchedSchools[0]
    const text = top
      ? `🎓 My suggested starting school for ${field} is ${result.flag} ${top.college_name} (${COUNTRY_NAME[result.country]})!\n\nFind yours → campcareer.com`
      : `🎓 My suggested study destination is ${result.flag} ${COUNTRY_NAME[result.country]}!\n\n✅ ${result.reasons.join('\n✅ ')}\n\nFind yours → campcareer.com`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleTwitterShare() {
    if (!result) return
    const top = matchedSchools[0]
    const text = top
      ? `My suggested school for ${field} is ${result.flag} ${top.college_name} (${COUNTRY_NAME[result.country]})!\n\nFind yours → campcareer.com`
      : `My suggested study destination is ${result.flag} ${COUNTRY_NAME[result.country]}!\n\n✅ ${result.reasons[0]}\n✅ ${result.reasons[1]}\n\nFind yours → campcareer.com`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const STEPS_TOTAL = 5
  const progress = step >= 6 ? 100 : ((step - 1) / STEPS_TOTAL) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* 상단 진행률 바 */}
      {step < 6 && (
        <div className="fixed top-0 inset-x-0 z-50">
          <div className="h-1.5 bg-slate-100">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 결과 화면 */}
      {step === 6 && result && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

          {/* Badge + Header */}
          <span className="inline-flex items-center text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
            {to.badge}
          </span>
          <p className="text-slate-400 text-sm mb-1">{to.resultHeader}</p>
          <p className="text-2xl font-bold text-slate-900 mb-6">
            {field} &middot; {result.flag} {COUNTRY_NAME[result.country]}
          </p>

          {matchedSchools.length > 0 ? (
            <div className="w-full max-w-md">

              {/* #1 featured card */}
              {(() => {
                const top = matchedSchools[0]
                const currency = CURRENCY[result.country] ?? '$'
                const reasons = getMatchReasons(top, goal!, budget!, currency)
                return (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">{to.resultBadge}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        ROI {top.roi_score.toFixed(1)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-0.5">{top.college_name}</h2>
                    <p className="text-sm text-slate-500 mb-4">
                      {top.field_name ?? field} &middot; {top.college_state}
                    </p>
                    <div className="space-y-2">
                      {reasons.map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-sm text-slate-700">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* #2–5 compact list */}
              {matchedSchools.slice(1).length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 mb-3 text-left overflow-hidden">
                  {matchedSchools.slice(1).map((s, i) => (
                    <div key={s.college_id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          <span className="text-xs text-slate-400 mr-1">#{i + 2}</span>
                          {s.college_name}
                        </p>
                        <p className="text-xs text-slate-400">{s.field_name ?? field}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-bold text-blue-600">ROI {s.roi_score.toFixed(1)}</p>
                        <p className="text-xs text-slate-500">
                          {CURRENCY[result.country]}{Math.round(s.net_salary).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Data limitation note */}
              <p className="text-xs text-slate-400 text-center mb-4 px-1">
                ⚠️ {to.dataNote}
              </p>

            </div>
          ) : (
            /* Fallback: API returned no schools — show original country card */
            <div className="w-full max-w-md mb-4">
              <div className="text-[72px] leading-none mb-4">{result.flag}</div>
              <h1 className="text-4xl font-bold text-slate-900 mb-6">{COUNTRY_NAME[result.country]}</h1>
              <div className="bg-slate-50 rounded-3xl p-7 text-left space-y-4 mb-4">
                {result.reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-700 font-medium">{r}</p>
                  </div>
                ))}
              </div>
              {/* Data limitation note for fallback */}
              <p className="text-xs text-slate-400 text-center mb-0 px-1">
                ⚠️ {to.dataNote}
              </p>
            </div>
          )}

          {/* Trust disclaimer */}
          <div className="w-full max-w-md rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 mb-5 text-left">
            <p className="text-xs text-amber-700 leading-relaxed">⚠️ {to.resultDisclaimer}</p>
          </div>

          {/* Share buttons */}
          <div className="w-full max-w-md flex gap-3 mb-4">
            <button
              type="button"
              onClick={handleTwitterShare}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3.5 rounded-2xl transition-colors text-sm bg-white"
            >
              <span className="font-black text-base" style={{ color: '#000' }}>𝕏</span>
              Share on X
            </button>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3.5 rounded-2xl transition-colors text-sm bg-white"
            >
              {copied
                ? <><CheckCheck className="w-4 h-4 text-emerald-500" /> Copied!</>
                : <><Copy className="w-4 h-4" /> Copy Result</>
              }
            </button>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => { router.push('/planner'); router.refresh() }}
            disabled={saving}
            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-colors flex items-center justify-center gap-3 text-lg mb-3"
          >
            {to.ctaDashboard}
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary CTAs */}
          <div className="w-full max-w-md grid grid-cols-2 gap-2.5">
            <Link
              href="/roi-explorer"
              className="flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium py-3 rounded-xl transition-colors text-sm bg-white"
            >
              <BarChart2 className="w-4 h-4 shrink-0" />
              {to.ctaRoi}
            </Link>
          </div>

        </div>
      )}

      {/* 질문 화면 */}
      {step < 6 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg">

            {/* Wizard branding */}
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3 text-center">
              {to.badge}
            </p>

            {/* Step 번호 */}
            <p className="text-sm font-medium text-slate-400 mb-6 text-center">
              {step} of {STEPS_TOTAL}
            </p>

            {/* Step 1 — Field */}
            {step === 1 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  What do you want<br />to study?
                </h2>
                <p className="text-slate-400 text-center mb-8">
                  {to.step1Subtitle}
                </p>
                <input
                  type="text"
                  value={field}
                  onChange={e => setField(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && field.trim().length >= 2) setStep(2) }}
                  placeholder="e.g. Computer Science, Nursing..."
                  className="w-full border-2 border-slate-200 focus:border-blue-400 rounded-2xl px-5 py-4 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none transition-colors mb-4"
                  autoFocus
                />
                <div className="flex flex-wrap gap-2 mb-6">
                  {FIELD_SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setField(s); setStep(2) }}
                      className="text-sm px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors bg-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={field.trim().length < 2}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition-colors"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 — Goal */}
            {step === 2 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  What&apos;s your<br />main goal?
                </h2>
                <p className="text-slate-400 text-center mb-10">
                  This helps us find the best country for you
                </p>
                <div className="space-y-4">
                  {[
                    { value: 'visa' as Goal,  emoji: '💼', title: 'Work after graduation', desc: 'Get a work visa and build your career abroad' },
                    { value: 'pr' as Goal,    emoji: '🏡', title: 'Permanent residency',   desc: 'Settle down and get a long-term visa or PR' },
                    { value: 'study' as Goal, emoji: '🎓', title: 'Academic excellence',   desc: 'Focus on the best education and ROI' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setGoal(opt.value); setStep(3) }}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-5 transition-all text-left group"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-blue-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Budget */}
            {step === 3 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  What&apos;s your<br />annual tuition budget?
                </h2>
                <p className="text-slate-400 text-center mb-10">Tuition fees per year</p>
                <div className="space-y-4">
                  {[
                    { value: 'low' as Budget,  emoji: '💚', title: 'Under $15,000 / year',      desc: 'Budget-friendly options with great ROI' },
                    { value: 'mid' as Budget,  emoji: '💛', title: '$15,000 – $30,000 / year',  desc: 'Mid-range with strong career outcomes' },
                    { value: 'high' as Budget, emoji: '💙', title: 'Over $30,000 / year',       desc: 'Premium institutions, highest earning potential' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setBudget(opt.value); setStep(4) }}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-5 transition-all text-left group"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-blue-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 — English */}
            {step === 4 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  What&apos;s your<br />English level?
                </h2>
                <p className="text-slate-400 text-center mb-10">Be honest — this affects visa requirements</p>
                <div className="space-y-4">
                  {[
                    { value: 'advanced' as English,     emoji: '🟢', title: 'Advanced / Native',    desc: 'IELTS 7.0+ or equivalent' },
                    { value: 'intermediate' as English, emoji: '🟡', title: 'Intermediate',          desc: 'IELTS 5.5–6.5 or currently studying' },
                    { value: 'beginner' as English,     emoji: '🔴', title: 'Beginner / Preparing',  desc: 'Still building English skills' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setEnglish(opt.value); setStep(5) }}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-5 transition-all text-left group"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-blue-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 — Environment */}
            {step === 5 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  Where do you prefer<br />to live?
                </h2>
                <p className="text-slate-400 text-center mb-10">City life or something quieter?</p>
                <div className="space-y-4">
                  {[
                    { value: 'city' as Environment, emoji: '🌆', title: 'Big city',               desc: 'London, Sydney, Toronto, New York' },
                    { value: 'town' as Environment, emoji: '🏘️', title: 'Mid-size / college town', desc: 'Lower cost, tight-knit community' },
                    { value: 'any' as Environment,  emoji: '🌍', title: 'No preference',          desc: 'Open to anything' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleFinish(opt.value)}
                      disabled={saving}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-5 transition-all text-left group disabled:opacity-50"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-blue-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
