import { notFound } from "next/navigation"
import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { STATE_CODES, STATE_NAMES, type StateCode } from "@/app/map/states"
import { getEmploymentPageData } from "@/lib/employment-data"
import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import { OccupationCard } from "@/components/employment/occupation-card"
import type { Metadata } from "next"
import type { CourseLite } from "@/lib/map-data"

type Props = { params: Promise<{ state: string }> }

export async function generateStaticParams() {
  return STATE_CODES.map((code) => ({ state: code.toLowerCase() }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const code = state.toUpperCase() as StateCode
  const name = STATE_NAMES[code]
  if (!name) return {}
  return pageMetadata({
    title: `${name} Employment — Top Jobs by Employment Scale | CampCareer`,
    description: `See the top ${name} (Australia) occupations by employment. ${name} job market data from JSA NERO 2026, with salary estimates and job search links.`,
    path: `/employment/au/${state.toLowerCase()}`,
  })
}

export const revalidate = 86400
export const dynamic = "force-static"

function getMatchingCourses(
  broadField: string | null,
  stateCode: StateCode,
  coursesByFieldState: Record<string, Record<string, CourseLite[]>>,
) {
  if (!broadField) return []
  const byState = coursesByFieldState[broadField]
  if (!byState) return []
  const courses = byState[stateCode]
  if (!courses) return []
  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    institution_name: c.institution_name,
    tuition_fee_aud: c.tuition_fee_aud,
    duration_years: c.duration_years,
    url: c.cricos_url ?? c.website_url ?? null,
  }))
}

function stateJsonLd(code: StateCode, occupations: { rank: number; name: string; emp: number }[]) {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${STATE_NAMES[code]} Employment — Top Occupations by Employment Scale`,
      description: `The top occupations in ${STATE_NAMES[code]}, Australia, ranked by estimated employment. Source: JSA NERO 2026-05.`,
      itemListElement: occupations.map((o) => ({
        "@type": "ListItem",
        position: o.rank,
        item: {
          "@type": "Occupation",
          name: o.name,
          description: `Approximately ${o.emp.toLocaleString()} people employed in ${STATE_NAMES[code]}.`,
        },
      })),
    }),
  }
}

export default async function StateEmploymentPage({ params }: Props) {
  const { state } = await params
  const code = state.toUpperCase() as StateCode

  if (!(STATE_CODES as string[]).includes(code)) {
    notFound()
  }

  const [employmentData, mapData] = await Promise.all([
    getEmploymentPageData(code),
    getMapData(),
  ])

  const occupations = employmentData.occupations.map((occ) => ({
    ...occ,
    courses: getMatchingCourses(occ.broad_field, code, mapData.coursesByFieldState),
  }))

  const stateName = STATE_NAMES[code]
  const t = getTranslations()

  return (
    <>
      <TopNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={stateJsonLd(code, occupations)} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-slate-400">
          <a href="/" className="hover:text-slate-600">{t.employment.home}</a>
          <span className="mx-1.5">/</span>
          <a href="/employment" className="hover:text-slate-600">{t.employment.employment}</a>
          <span className="mx-1.5">/</span>
          <span className="text-slate-600">AU</span>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700 font-medium">{code}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t.employment.h1.replace('{stateName}', stateName)}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t.employment.subtitle.replace('{stateName}', stateName)}
          </p>
        </div>

        {/* Occupation list */}
        <div className="space-y-2">
          {occupations.map((occ) => (
            <OccupationCard
              key={occ.a4}
              occupation={occ}
              stateCode={code}
            />
          ))}
        </div>

        {/* State navigation */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t.employment.otherStates}
          </p>
          <div className="flex flex-wrap gap-2">
            {STATE_CODES.filter((s) => s !== code).map((s) => (
              <a
                key={s}
                href={`/employment/au/${s.toLowerCase()}`}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-brand/30 hover:text-brand-press"
              >
                {STATE_NAMES[s]}
              </a>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
