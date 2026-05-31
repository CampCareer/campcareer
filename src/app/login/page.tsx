'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

const TRUST = [
  'Official government data',
  '11,000+ courses tracked',
  'Free to explore',
]

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  async function handleGoogle() {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setIsLoading(false)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      if (error) {
        setError(error.message)
        setIsLoading(false)
      } else {
        setError('Check your email to confirm your account!')
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* 좌측 */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-b from-slate-900 to-indigo-950 p-10">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">CC</span>
          </div>
          <span className="font-semibold text-white text-base tracking-tight">CampCareer</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white leading-[1.15] tracking-tight mb-4">
            Make smarter<br />study abroad<br />decisions.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            Real salary data, government statistics, and ROI analysis — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {TRUST.map((t) => (
            <div key={t} className="flex items-center gap-2.5 text-sm text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* 우측 */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">CC</span>
            </div>
            <span className="font-semibold text-slate-900 text-sm">CampCareer</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === 'signin' ? 'Sign in to your account' : 'Start exploring for free'}
            </p>
          </div>

          {/* 에러/성공 메시지 */}
          {error && (
            <div className={`text-sm px-4 py-3 rounded-xl mb-5 ${
              error.includes('Check your email')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-5 disabled:opacity-50"
          >
            <span className="font-black text-[15px] leading-none" style={{ color: '#4285F4' }}>G</span>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-400 whitespace-nowrap">or continue with email</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-600 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-xs font-medium text-slate-600">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) { setError('Enter your email first'); return }
                      await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${location.origin}/auth/callback`,
                      })
                      setError('Password reset email sent!')
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-flex items-center gap-0.5"
            >
              {mode === 'signin' ? 'Get started' : 'Sign in'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </p>

          <p className="text-center text-xs text-slate-400 mt-5">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-600 transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
