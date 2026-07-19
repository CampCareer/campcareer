"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { ArrowRight, Building2, Search } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import { AU_MAJOR_CATEGORY_HIGHLIGHTS } from "@/data/au-major-category-highlights"
import { localizePath } from "@/lib/i18n/config"
import { IconPicker, type PickerOption, countryFlag } from "@/components/ui/icon-picker"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"

export function CountriesHub({ locale = "en" }: { locale?: "en" | "ko" }) {
  return <Hub eyebrow="Countries" title="Explore 20 study destinations." body="Start with a destination, or rank countries from a career, budget, and priority."><Link href={localizePath("/countries/search", locale)} className="hub-cta bg-blue-600 hover:bg-blue-700"><Search className="h-4 w-4" />Rank countries for me</Link><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{LAUNCH_COUNTRIES.map((country) => <Link key={country.code} href={localizePath(`/countries/${country.slug}`, locale)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"><div className="relative h-40 overflow-hidden"><img src={country.image} alt={country.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /></div><div className="p-4"><p className="text-xs font-semibold tracking-[.15em] text-blue-700">{country.code}</p><h2 className="mt-1 font-semibold text-slate-950">{country.name}</h2><p className="mt-2 text-xs text-slate-500">{country.publicationStage === "DECISION_READY" ? "Decision-ready" : "Discovery data available"}</p></div></Link>)}</div></Hub>
}

export function MajorsHub({ locale = "en" }: { locale?: "en" | "ko" }) {
  return <div>
    <section className="border-b border-slate-200/90 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
        <h1 className="mb-5 text-left text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:whitespace-nowrap lg:text-4xl">Find the right major for your future</h1>
        <MajorFinder locale={locale} />
      </div>
    </section>
    <section className="bg-white"><main className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-14">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Explore Australian major categories</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Compare the career signals behind each study area before choosing a major.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{STUDY_CATEGORIES.map((category) => {
        const { Icon, tone } = getStudyCategoryVisual(category.id)
        const highlight = AU_MAJOR_CATEGORY_HIGHLIGHTS[category.id]
        return <Link key={category.id} href={`${localizePath("/au/majors", locale)}?${new URLSearchParams({ category: category.id })}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md">
          <span className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span>
          <h3 className="mt-5 text-base font-semibold leading-6 text-slate-950">{category.label}</h3>
          <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">{highlight.demand}</p>
          <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-700">
            <p>{highlight.salary}</p>
            <p className="mt-1 text-blue-700">{highlight.outlook}</p>
          </div>
          <span className="mt-4 inline-flex text-sm font-semibold text-slate-600 group-hover:text-blue-700">Search</span>
        </Link>
      })}</div>
      <p className="mt-5 text-xs leading-5 text-slate-500">Australia indicators use representative occupations mapped to each study area. Pay is indicative median occupation pay, not a graduate salary; outlook is a mapped 2035 projection.</p>
    </main></section>
  </div>
}

function MajorFinder({ locale }: { locale: "en" | "ko" }) {
  const router = useRouter()
  const [country, setCountry] = useState("AU")
  const [category, setCategory] = useState("")
  const countryOptions = useMemo<PickerOption[]>(() => [
    { value: "everywhere", label: "Everywhere", description: "Explore all destinations", icon: "🌍", keywords: "global all" },
    ...LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name, description: `Explore ${item.name} major pathways`, icon: countryFlag(item.code), keywords: `${item.code} ${item.slug}` })),
  ], [])
  const categoryOptions = useMemo<PickerOption[]>(() => [
    { value: "", label: "Choose a category", description: "Browse all available study areas", icon: "✨", keywords: "all categories" },
    ...STUDY_CATEGORIES.map((item) => {
      const visual = getStudyCategoryVisual(item.id)
      return { value: item.id, label: item.label, description: `Explore ${item.label} majors`, icon: "", iconComponent: visual.Icon, iconTone: visual.tone, keywords: `${item.id} ${item.label}` }
    }),
  ], [])

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new URLSearchParams(category ? { category } : {})
    if (country === "AU") {
      router.push(`${localizePath("/au/majors", locale)}${query.size ? `?${query}` : ""}`)
      return
    }
    router.push(`${localizePath("/countries/search", locale)}?${new URLSearchParams({ country, ...(category ? { category } : {}) })}`)
  }

  return <form onSubmit={submit} className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1"><IconPicker name="country" label="Where" value={country} options={countryOptions} onChange={setCountry} searchPlaceholder="Search countries" testId="major-country" /></div>
      <div className="flex-1"><IconPicker name="category" label="Major category" value={category} options={categoryOptions} onChange={setCategory} searchPlaceholder="Search categories" testId="major-category" /></div>
      <button className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">Search</button>
    </div>
  </form>
}

export function UniversitiesHub({ locale = "en" }: { locale?: "en" | "ko" }) {
  return <div>
    <section className="border-b border-slate-200/90 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
        <h1 className="mb-5 text-left text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:whitespace-nowrap lg:text-4xl">Find the right study option</h1>
        <UniversityFinder locale={locale} />
      </div>
    </section>
    <div className="bg-white"><main className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-14"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{LAUNCH_COUNTRIES.map((country) => <Link key={country.code} href={country.code === "AU" ? localizePath("/au/study", locale) : `${localizePath("/study/search", locale)}?country=${country.code}`} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"><p className="text-xs font-semibold tracking-[.15em] text-blue-700">{country.code}</p><h2 className="mt-1 font-semibold text-slate-950">{country.name}</h2><p className="mt-2 text-xs text-slate-500">{country.code === "AU" ? "Compare tuition and outcomes" : "Institution evidence in progress"}</p></Link>)}</div></main></div>
  </div>
}

function UniversityFinder({ locale }: { locale: "en" | "ko" }) {
  const router = useRouter()
  const [country, setCountry] = useState("AU")
  const [category, setCategory] = useState("")
  const countryOptions = useMemo<PickerOption[]>(() => LAUNCH_COUNTRIES.map((item) => ({ value: item.code, label: item.name, description: `Explore ${item.name} university options`, icon: countryFlag(item.code), keywords: `${item.code} ${item.slug}` })), [])
  const categoryOptions = useMemo<PickerOption[]>(() => [
    { value: "", label: "Choose a category", description: "Browse all available study areas", icon: "✨", keywords: "all categories" },
    ...STUDY_CATEGORIES.map((item) => {
      const visual = getStudyCategoryVisual(item.id)
      return { value: item.id, label: item.label, description: `Explore ${item.label} study options`, icon: "", iconComponent: visual.Icon, iconTone: visual.tone, keywords: `${item.id} ${item.label}` }
    }),
  ], [])

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (country === "AU") {
      const query = category ? `?${new URLSearchParams({ category })}` : ""
      router.push(`${localizePath("/au/study", locale)}${query}`)
      return
    }
    router.push(`${localizePath("/study/search", locale)}?${new URLSearchParams({ country, ...(category ? { category } : {}) })}`)
  }

  return <form onSubmit={submit} className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1"><IconPicker name="country" label="Where" value={country} options={countryOptions} onChange={setCountry} searchPlaceholder="Search countries" testId="university-country" /></div>
      <div className="flex-1"><IconPicker name="category" label="Major" value={category} options={categoryOptions} onChange={setCategory} searchPlaceholder="Search categories" testId="university-category" /></div>
      <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"><Building2 className="h-4 w-4" />Search study options</button>
    </div>
  </form>
}

function Hub({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children: React.ReactNode }) {
  return <div className="bg-slate-50"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{eyebrow}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{body}</p></div></section><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main></div>
}
