import Link from "next/link"
import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { STATE_CODES, STATE_NAMES } from "@/app/map/states"
import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import type { Metadata } from "next"

export const metadata: Metadata = pageMetadata({
  title: "Australia Employment by State — Top Jobs by Employment Scale | CampCareer",
  description: "Browse employment data by Australian state and territory. See top occupations, salary estimates, and job search links for NSW, VIC, QLD, WA, SA, TAS, NT, ACT.",
  path: "/employment",
})

export default async function EmploymentLandingPage() {
  const t = getTranslations()
  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t.employment.pageTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t.employment.pageDesc}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATE_CODES.map((code) => (
            <Link
              key={code}
              href={`/employment/au/${code.toLowerCase()}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand/30 hover:bg-brand-tint"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800 group-hover:text-brand-press">
                  {STATE_NAMES[code]}
                </h2>
                <span className="text-sm font-medium text-slate-400">{code}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {t.employment.viewOccupations}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
