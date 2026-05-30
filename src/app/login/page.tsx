import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

const TRUST = [
  "Official government data",
  "2,860+ courses tracked",
  "Free to explore",
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── 좌측: 짙은 남색 배경 ── */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-b from-slate-900 to-indigo-950 p-10">

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">CC</span>
          </div>
          <span className="font-semibold text-white text-base tracking-tight">
            CampCareer
          </span>
        </Link>

        {/* 중앙 카피 */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white leading-[1.15] tracking-tight mb-4">
            Make smarter<br />
            study abroad<br />
            decisions.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            Real salary data, government statistics, and ROI analysis — all in one place.
          </p>
        </div>

        {/* 신뢰 지표 */}
        <div className="flex flex-col gap-3">
          {TRUST.map((t) => (
            <div key={t} className="flex items-center gap-2.5 text-sm text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── 우측: 흰 배경 폼 ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* 모바일 로고 */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">CC</span>
            </div>
            <span className="font-semibold text-slate-900 text-sm">CampCareer</span>
          </div>

          {/* 헤딩 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to your account</p>
          </div>

          {/* Google OAuth 버튼 */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-5"
          >
            <span className="font-black text-[15px] leading-none" style={{ color: "#4285F4" }}>
              G
            </span>
            Continue with Google
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-400 whitespace-nowrap">or continue with email</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* 이메일/패스워드 폼 */}
          <form className="space-y-4" action="#">
            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-600 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* 패스워드 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-600"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm mt-1"
            >
              Sign in
            </button>
          </form>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-flex items-center gap-0.5"
            >
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>

          {/* 약관 */}
          <p className="text-center text-xs text-slate-400 mt-5">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-slate-600 transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>

    </div>
  )
}
