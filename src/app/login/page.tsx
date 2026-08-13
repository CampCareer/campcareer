'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { getSafeNextPath } from '@/lib/auth/safe-next'
import { getPostLoginDestination } from '@/lib/auth/post-login-destination'
import { getPathwayBackPath, getPathwaySummaryFromNext, type PathwaySummary } from '@/lib/auth/pathway-next'
import { localizePath, withoutLocalePrefix, type Locale } from '@/lib/i18n/config'
import { useRouteLocale } from '@/lib/i18n/locale-provider'
import { LOGIN_COPY } from './login-copy'

type LoginNotice = {
  tone: 'error' | 'success'
  message: string
}

const PATHWAY_FIELD_KO: Record<string, string> = {
  trades: '건설·기술직',
  health: '보건·돌봄',
  technology: 'IT·데이터·과학',
  engineering: '공학·제조·자원',
  business: '비즈니스·금융·법·공공행정',
  education: '교육·사회·커뮤니티 서비스',
  environment: '환경·농업',
  design: '디자인·미디어·문화',
  hospitality: '호텔·리테일·서비스',
  transport: '운송·항공·해양·물류',
  'not-sure': '분야 미선택',
  'computer-science': '컴퓨터과학',
  'data-science': '데이터과학',
  'artificial-intelligence': '인공지능',
  'software-engineering': '소프트웨어공학',
  'information-technology': '정보기술',
  finance: '금융',
  accounting: '회계학',
  marketing: '마케팅',
  economics: '경제학',
  nursing: '간호학',
  medicine: '의학',
  pharmacy: '약학',
  law: '법학',
  psychology: '심리학',
  biology: '생물학',
  'mechanical-engineering': '기계공학',
  'electrical-engineering': '전기공학',
  'chemical-engineering': '화학공학',
  mathematics: '수학',
  communications: '커뮤니케이션',
  'political-science': '정치학',
  architecture: '건축학',
}

const PATHWAY_STATUS_KO: Record<string, string> = {
  'no-field': '선택지를 탐색 중',
  'choosing-school': '프로그램 선택 중',
  'preparing-application': '지원 준비 중',
  'already-qualified': '이미 자격 보유',
  'looking-for-job': '취업 또는 스폰서 찾는 중',
  'preparing-visa': '비자 준비 중',
}

function localizePathwaySummary(summary: PathwaySummary, next: string, locale: Locale): PathwaySummary {
  if (locale !== 'ko') return summary

  const url = new URL(next, 'https://campcareer.local')
  const origin = url.searchParams.get('origin')?.toUpperCase() ?? ''
  const destination = url.searchParams.get('country')?.toUpperCase() ?? ''
  const field = url.searchParams.get('field') ?? ''
  const status = url.searchParams.get('status') ?? (field === 'not-sure' ? 'no-field' : 'choosing-school')
  const regionNames = new Intl.DisplayNames(['ko'], { type: 'region' })
  const destinationLabel = (destination && regionNames.of(destination)) || summary.country
  const originLabel = (origin && regionNames.of(origin)) || ''

  return {
    country: originLabel ? `${originLabel} → ${destinationLabel}` : destinationLabel,
    field: PATHWAY_FIELD_KO[field] ?? summary.field,
    status: PATHWAY_STATUS_KO[status] ?? summary.status,
  }
}

function getPathwaySummaryInput(next: string) {
  const url = new URL(next, 'https://campcareer.local')
  return `${withoutLocalePrefix(url.pathname)}${url.search}${url.hash}`
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedNext = searchParams.get('next')
  const routeLocale = useRouteLocale()
  const copy = LOGIN_COPY[routeLocale]
  const next = getSafeNextPath(requestedNext, localizePath('/home', routeLocale))
  const rawPathwaySummary = getPathwaySummaryFromNext(getPathwaySummaryInput(next))
  const pathwaySummary = rawPathwaySummary ? localizePathwaySummary(rawPathwaySummary, next, routeLocale) : null
  const pathwayBackPath = localizePath(getPathwayBackPath(requestedNext), routeLocale)
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState<LoginNotice | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  async function resolveSignedInDestination(userId: string) {
    const { data } = await supabase
      .from('user_preferences')
      .select('career_personalisation_completed_at')
      .eq('id', userId)
      .maybeSingle()

    return getPostLoginDestination(
      next,
      Boolean(data?.career_personalisation_completed_at),
      routeLocale,
    )
  }

  async function handleGoogle() {
    setIsLoading(true)
    setNotice(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setNotice({ tone: 'error', message: copy.errors.generic })
      setIsLoading(false)
    }
  }

  async function handleEmail(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setNotice(null)

    if (mode === 'signin') {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setNotice({ tone: 'error', message: copy.errors.invalidCredentials })
        setIsLoading(false)
      } else if (data.user) {
        router.push(await resolveSignedInDestination(data.user.id))
        router.refresh()
      } else {
        setNotice({ tone: 'error', message: copy.errors.generic })
        setIsLoading(false)
      }
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) {
      setNotice({ tone: 'error', message: copy.errors.generic })
    } else {
      setNotice({ tone: 'success', message: copy.notices.signupConfirmation })
    }
    setIsLoading(false)
  }

  async function handlePasswordReset() {
    if (!email) {
      setNotice({ tone: 'error', message: copy.notices.enterEmailFirst })
      return
    }

    setIsLoading(true)
    setNotice(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback`,
    })
    setNotice(
      error
        ? { tone: 'error', message: copy.errors.generic }
        : { tone: 'success', message: copy.notices.resetEmailSent },
    )
    setIsLoading(false)
  }

  const isSignIn = mode === 'signin'

  return (
    <main className="min-h-screen bg-[#fafaf9] px-5 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-[460px]">
        <Link
          href={localizePath('/', routeLocale)}
          className="campcareer-wordmark text-[#1b1b1b]"
          aria-label={copy.homeAria}
        >
          campcareer
        </Link>

        <section className="mt-8 sm:mt-10 sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:p-8 sm:shadow-sm">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {isSignIn ? copy.welcome : copy.signup}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              {isSignIn ? copy.welcomeSupporting : copy.signupSupporting}
            </p>
          </div>

          {pathwaySummary && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" aria-label={copy.pathwayAria}>
              <p className="text-xs font-medium text-slate-500">{copy.savePathway}</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {pathwaySummary.country} · {pathwaySummary.field} · {pathwaySummary.status}
              </p>
            </div>
          )}

          {notice && (
            <div
              id="login-message"
              role={notice.tone === 'error' ? 'alert' : 'status'}
              aria-live="polite"
              className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                notice.tone === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
            >
              {notice.message}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="mb-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-4 shrink-0" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            {copy.google}
          </button>

          <div className="mb-5 flex items-center gap-3" aria-hidden="true">
            <div className="flex-1 border-t border-slate-200" />
            <span className="whitespace-nowrap text-xs text-slate-500">{copy.divider}</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4" aria-busy={isLoading}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-700">
                {copy.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="email"
                aria-describedby={notice ? 'login-message' : undefined}
                className="min-h-12 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-xs font-medium text-slate-700">
                  {copy.password}
                </label>
                {isSignIn && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isLoading}
                    className="shrink-0 text-xs font-medium text-brand transition-colors hover:text-brand-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 disabled:opacity-50"
                  >
                    {copy.forgotPassword}
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isSignIn ? 'current-password' : 'new-password'}
                aria-describedby={notice ? 'login-message' : undefined}
                className="min-h-12 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand bg-brand text-sm font-semibold tracking-tight text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isSignIn ? copy.signIn : copy.createAccount}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isSignIn ? copy.newAccount : copy.existingAccount}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(isSignIn ? 'signup' : 'signin')
                setNotice(null)
              }}
              className="inline-flex items-center gap-0.5 font-medium text-brand transition-colors hover:text-brand-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
            >
              {isSignIn ? copy.createAccount : copy.signIn}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </p>

          <Link
            href={pathwayBackPath}
            className="mt-7 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.back}
          </Link>
        </section>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf9]" aria-busy="true" />}>
      <LoginPageContent />
    </Suspense>
  )
}
