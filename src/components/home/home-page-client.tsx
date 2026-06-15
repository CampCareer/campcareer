"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp, GraduationCap, ShieldCheck } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { LogoMark } from "@/components/logo-mark"
import { Button } from "@/components/ui/button"
import { HeroCardRotator } from "@/components/home/hero-card-rotator"
import { useTranslations } from "@/lib/i18n/locale-provider"

export function HomePageClient() {
  const t = useTranslations()
  const tl = t.landing

  const PROVENANCE = [
    tl.provenance.employment,
    tl.provenance.visa,
    tl.provenance.demand,
    tl.provenance.ai,
    tl.provenance.roi,
  ]

  const STEPS = [
    { n: "1", emoji: "📝", title: tl.howItWorks.step1Title, desc: tl.howItWorks.step1Desc },
    { n: "2", emoji: "📊", title: tl.howItWorks.step2Title, desc: tl.howItWorks.step2Desc },
    { n: "3", emoji: "🎓", title: tl.howItWorks.step3Title, desc: tl.howItWorks.step3Desc },
  ]

  return (
    <div className="bg-background text-slate-900">

      {/* ── Navigation ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <LogoMark size={32} />
            <span className="font-semibold text-slate-900 text-base tracking-tight">CampCareer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/degree-risk" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {tl.nav.degreeRisk}
            </Link>
            <Link href="/roi-explorer" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {tl.nav.roiExplorer}
            </Link>
            <Link href="/methodology" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {tl.nav.methodology}
            </Link>
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {tl.nav.blog}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" />
            <Link
              href="/login"
              className="hidden sm:block text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {tl.nav.signIn}
            </Link>
            <Link
              href="/degree-risk"
              className="text-sm font-medium bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {tl.nav.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-background pt-28 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-tint border border-blue-100 text-brand text-xs px-3.5 py-1.5 rounded-full mb-6 max-w-full">
              <span className="truncate">{tl.hero.badge}</span>
            </div>

            <h1 className="font-display text-4xl lg:text-[3.5rem] font-semibold text-slate-900 leading-[1.08] tracking-tight mb-5 break-keep">
              {tl.hero.headlineLine1}
              <br />
              {tl.hero.headlineLine2}
            </h1>

            <p className="text-base lg:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {tl.hero.subtitle}
            </p>

            <div className="flex flex-col items-center lg:items-start">
              <Button asChild variant="tactile" size="tactile">
                <Link href="/degree-risk">
                  {tl.hero.ctaRisk}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <span className="mt-3 text-xs text-slate-400">{tl.hero.ctaRiskSub}</span>
            </div>

            <Link
              href="/roi-explorer"
              className="inline-flex items-center gap-1.5 mt-6 text-sm text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors"
            >
              {tl.hero.ctaSecondary}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right: rotating sample result cards (real verified data) */}
          <HeroCardRotator />
        </div>
      </section>

      {/* ── Data provenance ── */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-slate-900 flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            {tl.provenance.title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{tl.provenance.subtitle}</p>

          <ul className="mt-8 grid gap-3 text-left max-w-2xl mx-auto">
            {PROVENANCE.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {line}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-slate-400">{tl.provenance.disclaimer}</p>
          <Link
            href="/methodology"
            className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {tl.provenance.methodologyLink}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl font-semibold text-slate-900 text-center mb-14">
            {tl.howItWorks.sectionTitle}
          </h2>
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex-1 flex items-center gap-4 md:flex-col md:text-center md:gap-0">
                <div className="relative mb-0 md:mb-4 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-3xl">
                    {step.emoji}
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {step.n}
                  </span>
                </div>
                <div className="md:px-4">
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block self-center text-2xl text-slate-300">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Narrative: decide what, then where ── */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold text-slate-900">{tl.narrative.sectionTitle}</h2>
            <p className="mt-3 text-slate-500">{tl.narrative.sectionSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/degree-risk"
              className="group bg-white border border-slate-200 rounded-2xl p-7 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{tl.narrative.card1Title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{tl.narrative.card1Desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
                {tl.narrative.card1Cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/roi-explorer"
              className="group bg-white border border-slate-200 rounded-2xl p-7 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{tl.narrative.card2Title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{tl.narrative.card2Desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
                {tl.narrative.card2Cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-semibold text-white mb-8">{tl.cta.title}</h2>
          <Link
            href="/degree-risk"
            className="inline-flex items-center gap-2 bg-white text-brand font-semibold tracking-tight px-8 min-h-[56px] rounded-xl text-[17px] shadow-sm transition-colors hover:bg-white/90"
          >
            {tl.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <span>{tl.footer.copyright}</span>
          <div className="flex items-center gap-4">
            <Link href="/methodology" className="hover:text-slate-600 transition-colors">Methodology</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <span>{tl.footer.dataSources}</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
