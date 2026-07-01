import Link from "next/link"
import { LogoMark } from "@/components/logo-mark"
import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import { DegreeRiskForm } from "./degree-risk-form"

export const metadata = pageMetadata({
  title: "Degree Risk Checker — Will Your Degree Lead to a Job?",
  description:
    "Answer 6 quick questions and see your major's employment potential, visa pathway, market demand, AI exposure, and study ROI — before choosing where to study abroad.",
  path: "/degree-risk",
})

export default function DegreeRiskPage() {
  const t = getTranslations()
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-slate-200">
        <div className="max-w-xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="font-semibold text-slate-900 text-sm tracking-tight">CampCareer</span>
          </Link>
          <Link href="/methodology" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Methodology
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 min-h-[calc(100dvh-3.5rem)] flex flex-col justify-center py-10">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
          {t.degreeRisk.pageTitle}
        </h1>
        <p className="mt-2 mb-8 text-body-lg text-slate-500">
          {t.degreeRisk.pageSubtitle}
        </p>
        <DegreeRiskForm />
      </main>
    </div>
  )
}
