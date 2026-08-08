import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Clock3,
  ExternalLink,
  GraduationCap,
  MapPin,
  TrainFront,
  WalletCards,
} from "lucide-react"
import { SITE_URL } from "@/lib/seo-routes.mjs"
import { programDetailPath } from "@/lib/programs/program-search"
import {
  getAuProgrammaticStudyPage,
  getRelatedAuProgrammaticStudyPages,
} from "@/lib/programs/au-programmatic-seo"
import { getAuProgrammaticStudyPageData } from "@/lib/programs/au-programmatic-seo.server"

type Params = { params: Promise<{ city: string; field: string }> }

export const dynamic = "force-dynamic"

function money(value: number | null) {
  if (value == null) return "Not published"
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value)
}

function duration(value: number | null) {
  if (value == null) return "Varies by program"
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} years median`
}

function browseProgramsHref(city: string, broadField: string) {
  const params = new URLSearchParams({ city, field: broadField })
  return `/programs?${params.toString()}`
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city, field } = await params
  const route = getAuProgrammaticStudyPage(city, field)
  if (!route) {
    return { title: "Study page not found", robots: { index: false, follow: false } }
  }

  const data = await getAuProgrammaticStudyPageData(city, field)
  if (!data) {
    return { title: "Study page not found", robots: { index: false, follow: false } }
  }

  return {
    title: `${route.field.label} Courses in ${route.city.label}, Australia`,
    description: `Compare ${data.programCount.toLocaleString("en-AU")} active CRICOS ${route.field.label.toLowerCase()} programs across ${data.institutionCount} providers with verified ${route.city.label} delivery locations, tuition context and student living data.`,
    alternates: { canonical: `${SITE_URL}${route.path}` },
    robots: { index: data.indexable, follow: true },
    openGraph: {
      title: `${route.field.label} Courses in ${route.city.label}`,
      description: `${data.programCount.toLocaleString("en-AU")} active CRICOS programs with verified ${route.city.label} delivery locations.`,
      url: `${SITE_URL}${route.path}`,
      type: "website",
    },
  }
}

export default async function AuProgrammaticStudyPage({ params }: Params) {
  const { city, field } = await params
  const route = getAuProgrammaticStudyPage(city, field)
  if (!route) notFound()
  if (city !== route.city.slug || field !== route.field.slug) permanentRedirect(route.path)

  const data = await getAuProgrammaticStudyPageData(city, field)
  if (!data) notFound()

  const browseHref = browseProgramsHref(route.city.slug, route.field.broadField)
  const related = getRelatedAuProgrammaticStudyPages(route.city.slug, route.field.slug).slice(0, 6)
  const otherCity = route.city.slug === "sydney" ? "melbourne" : "sydney"
  const sameFieldOtherCity = getAuProgrammaticStudyPage(otherCity, route.field.slug)
  const profile = data.cityProfile

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${route.field.label} courses in ${route.city.label}, Australia`,
    url: `${SITE_URL}${route.path}`,
    description: route.field.intro,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.programCount,
      itemListElement: data.featuredPrograms.map((program, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: program.title,
        url: `${SITE_URL}${programDetailPath(program.id, program.title)}`,
      })),
    },
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-8 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#9a978f]" aria-label="Breadcrumb">
        <Link href="/countries/au" className="hover:text-[#2563eb]">Australia</Link>
        <span>/</span>
        <Link href={`/cities/au/${route.city.slug}`} className="hover:text-[#2563eb]">{route.city.label}</Link>
        <span>/</span>
        <span>{route.field.label}</span>
      </nav>

      <header className="mt-6 rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f5f9f3] via-white to-[#eef4ff] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">Study in Australia</p>
        <h1 className="mt-2 max-w-4xl text-[32px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[42px]">
          {route.field.label} courses in {route.city.label}
        </h1>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#66635d]">{route.field.intro}</p>
        <p className="mt-2 max-w-3xl text-[12px] leading-5 text-[#8a8780]">
          Program membership is based on active CRICOS courses with at least one registered delivery location mapped to Greater {route.city.label}; it is not inferred from an institution&apos;s headquarters.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={browseHref} className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#1f55c9]">
            Browse all matching programs <ArrowRight className="size-3.5" />
          </Link>
          <Link href={`/cities/au/${route.city.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#cfd9ca] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#3e7a2e]">
            {route.city.label} city guide <MapPin className="size-3.5" />
          </Link>
        </div>
      </header>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Program market snapshot">
        <Metric label="Active CRICOS programs" value={data.programCount.toLocaleString("en-AU")} note="Verified city delivery" icon={<BookOpenCheck className="size-4" />} />
        <Metric label="Providers" value={data.institutionCount.toLocaleString("en-AU")} note="With matching programs" icon={<Building2 className="size-4" />} />
        <Metric label="Median annual tuition" value={money(data.medianTuitionAud)} note={data.minTuitionAud != null && data.maxTuitionAud != null ? `Published range ${money(data.minTuitionAud)}–${money(data.maxTuitionAud)}` : "Where fee data is published"} icon={<WalletCards className="size-4" />} />
        <Metric label="Typical duration" value={duration(data.medianDurationYears)} note={`${data.verifiedOfficialCount} program pages independently verified`} icon={<Clock3 className="size-4" />} />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.75fr)]">
        <section className="rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#2563eb]">
            <GraduationCap className="size-4" />
            <h2 className="text-[16px] font-semibold text-[#1b1b1b]">Featured {route.field.label} programs</h2>
          </div>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">A sample from the live catalogue. Use the full results page for filters, sorting and the complete program set.</p>
          <div className="mt-4 divide-y divide-[#efeeeb]">
            {data.featuredPrograms.map((program) => (
              <Link key={program.id} href={programDetailPath(program.id, program.title)} className="group flex items-start gap-4 py-4 first:pt-1">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-5 text-[#1b1b1b] group-hover:text-[#2563eb]">{program.title}</p>
                  <p className="mt-1 text-[11px] text-[#77746e]">{program.institutionName}{program.courseType ? ` · ${program.courseType}` : ""}</p>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-[#3e7a2e]">{program.tuitionFeeAud ? money(program.tuitionFeeAud) : "View"}</span>
              </Link>
            ))}
          </div>
          <Link href={browseHref} className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2563eb] hover:underline">See all {data.programCount.toLocaleString("en-AU")} programs <ArrowRight className="size-3.5" /></Link>
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-[#e7e6e3] bg-white p-5">
            <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Common course types</h2>
            <div className="mt-3 space-y-2.5">
              {data.courseTypes.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-[11.5px]">
                  <span className="text-[#66635d]">{item.label}</span>
                  <span className="font-semibold text-[#1b1b1b]">{item.programs}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
            <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Student context in {route.city.label}</h2>
            <div className="mt-3 space-y-3 text-[11.5px]">
              <ContextRow icon={<WalletCards className="size-4" />} label="Living costs" value={profile.livingCost ? `${money(profile.livingCost.low)}–${money(profile.livingCost.high)} / month` : "Not published"} />
              <ContextRow icon={<TrainFront className="size-4" />} label="Transport reference" value={profile.transport ? `${money(profile.transport.weeklyReference)} / week` : "Not published"} />
              <ContextRow icon={<Clock3 className="size-4" />} label="Student work" value={profile.workRights ? `${profile.workRights.hoursPerFortnight} h / fortnight during study periods` : "Check visa conditions"} />
            </div>
            <Link href={`/cities/au/${route.city.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#2563eb] hover:underline">Open full city evidence <ArrowRight className="size-3.5" /></Link>
          </section>
        </div>
      </div>

      <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold text-[#1b1b1b]">Providers with the most matching programs</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {data.providers.map((provider) => (
            <div key={provider.id} className="rounded-lg border border-[#efeeeb] bg-[#fafaf8] p-3.5">
              <p className="text-[12px] font-semibold leading-5 text-[#33312d]">{provider.name}</p>
              <p className="mt-1 text-[10.5px] text-[#8f8c85]">{provider.programs} matching programs</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Explore other fields in {route.city.label}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((page) => (
              <Link key={page.path} href={page.path} className="rounded-full border border-[#deddd8] px-3 py-1.5 text-[11px] font-semibold text-[#5f5d57] hover:border-[#3e7a2e]/50 hover:text-[#3e7a2e]">{page.field.label}</Link>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <h2 className="text-[14.5px] font-semibold text-[#1b1b1b]">Compare the same field by city</h2>
          {sameFieldOtherCity && (
            <Link href={sameFieldOtherCity.path} className="mt-3 flex items-center justify-between rounded-lg border border-[#d9e3f7] bg-[#f7f9fe] px-4 py-3 text-[12px] font-semibold text-[#2563eb]">
              {route.field.label} in {sameFieldOtherCity.city.label}<ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-[#fafaf8] p-5 sm:p-6">
        <h2 className="text-[14px] font-semibold text-[#1b1b1b]">Data quality and sources</h2>
        <p className="mt-2 max-w-4xl text-[11.5px] leading-5 text-[#77746e]">
          Program counts use active Australian Government CRICOS course records and verified registered delivery locations. Tuition and duration summaries only use published values present in the catalogue. City living, transport and work context comes from the verified sources listed on the {route.city.label} city page.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold">
          <a href="https://cricos.education.gov.au/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#2563eb] hover:underline">CRICOS register <ExternalLink className="size-3" /></a>
          <Link href={`/cities/au/${route.city.slug}`} className="text-[#3e7a2e] hover:underline">{profile.sources.length} city evidence sources</Link>
          {data.latestProgramLocationSource && <span className="text-[#8f8c85]">Location data source: {data.latestProgramLocationSource}</span>}
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) {
  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-4">
      <div className="flex items-center gap-2 text-[#77746e]">{icon}<p className="text-[10.5px] font-semibold uppercase tracking-[0.08em]">{label}</p></div>
      <p className="mt-3 text-[22px] font-semibold tracking-[-0.025em] text-[#1b1b1b]">{value}</p>
      <p className="mt-1.5 text-[10.5px] leading-4 text-[#8f8c85]">{note}</p>
    </article>
  )
}

function ContextRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-[#6f7fa0]">{icon}</span>
      <div><p className="font-semibold text-[#4f4d48]">{label}</p><p className="mt-0.5 leading-5 text-[#77746e]">{value}</p></div>
    </div>
  )
}
