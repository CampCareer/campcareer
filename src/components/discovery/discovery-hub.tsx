import Link from "next/link"
import { ArrowRight, Building2, MapPinned, Search } from "lucide-react"
import { CANONICAL_CAREERS } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { localizePath } from "@/lib/i18n/config"

export function CountriesHub({ locale = "en" }: { locale?: "en" | "ko" }) {
  return <Hub eyebrow="Countries" title="Explore 20 study destinations." body="Start with a destination, or rank countries from a career, budget, and priority."><Link href={localizePath("/countries/search", locale)} className="hub-cta bg-blue-600 hover:bg-blue-700"><Search className="h-4 w-4" />Rank countries for me</Link><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{LAUNCH_COUNTRIES.map((country) => <Link key={country.code} href={localizePath(`/countries/${country.slug}`, locale)} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300"><p className="text-xs font-semibold tracking-[.15em] text-blue-700">{country.code}</p><h2 className="mt-1 font-semibold text-slate-950">{country.name}</h2><p className="mt-2 text-xs text-slate-500">{country.publicationStage === "DECISION_READY" ? "Decision-ready" : "Discovery data available"}</p></Link>)}</div></Hub>
}

export function MajorsHub({ locale = "en" }: { locale?: "en" | "ko" }) {
  return <Hub eyebrow="Majors" title="Explore careers by country and region." body="Tell us where you want to live, then discover which career paths have local evidence."><Link href={localizePath("/majors/search", locale)} className="hub-cta bg-amber-400 text-amber-950 hover:bg-amber-300"><MapPinned className="h-4 w-4" />Find regional paths</Link><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{CANONICAL_CAREERS.map((career) => <Link key={career.id} href={`${localizePath("/countries/search", locale)}?career=${career.id}&budget=50000-75000&goal=career-outcomes&currency=USD`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300"><p className="text-xs font-semibold uppercase tracking-[.12em] text-amber-800">{career.categoryId}</p><h2 className="mt-1 font-semibold text-slate-950">{career.label}</h2><span className="mt-3 inline-flex items-center text-sm font-semibold text-slate-600">Explore <ArrowRight className="ml-1 h-4 w-4" /></span></Link>)}</div></Hub>
}

export function UniversitiesHub({ locale = "en" }: { locale?: "en" | "ko" }) {
  return <Hub eyebrow="Universities" title="Find universities that fit your budget." body="Search by country, career, and first-year budget. Admission requirements and ROI appear only when reviewed."><Link href={localizePath("/universities/search", locale)} className="hub-cta bg-rose-600 hover:bg-rose-700"><Building2 className="h-4 w-4" />Find university matches</Link><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{LAUNCH_COUNTRIES.map((country) => <Link key={country.code} href={`${localizePath("/universities/search", locale)}?country=${country.code}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-rose-300"><p className="text-xs font-semibold tracking-[.15em] text-rose-700">{country.code}</p><h2 className="mt-1 font-semibold text-slate-950">{country.name}</h2><p className="mt-2 text-xs text-slate-500">Explore institution evidence</p></Link>)}</div></Hub>
}

function Hub({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children: React.ReactNode }) {
  return <div className="bg-slate-50"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{eyebrow}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{body}</p></div></section><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main></div>
}
