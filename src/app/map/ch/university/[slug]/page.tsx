import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CH_UNIVERSITIES } from "@/data/ch-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

function getUniversity(slug: string) {
  return CH_UNIVERSITIES.find((university) => university.slug === slug) ?? null
}

export function generateStaticParams() {
  return CH_UNIVERSITIES.map((university) => ({ slug: university.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const university = getUniversity((await props.params).slug)
  if (!university) return { title: "Institution not found", robots: { index: false, follow: false } }
  return {
    ...pageMetadata({ title: `${university.nameEn} | Switzerland institution profile | CampCareer`, description: `${university.nameEn} is an accredited ${university.institutionType.toLowerCase()} in ${university.cityName}, Switzerland.`, path: `/map/ch/university/${university.slug}` }),
    robots: { index: isCountrySearchIndexable("CH"), follow: true },
  }
}

export default async function SwitzerlandUniversityPage(props: { params: Promise<{ slug: string }> }) {
  const university = getUniversity((await props.params).slug)
  if (!university) notFound()
  return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link href="/ch" className="text-sm font-semibold text-blue-700 hover:underline">Switzerland profile</Link><h1 className="mt-5 text-4xl font-semibold text-slate-950">{university.nameEn}</h1><p className="mt-3 text-slate-600">{university.nameKo} · {university.cityName}</p><div className="mt-8 rounded-lg border border-slate-200 p-5"><p className="text-sm text-slate-500">Institution type</p><p className="mt-1 font-semibold">{university.institutionType}</p><p className="mt-4 text-sm text-slate-500">International-student availability: {university.internationalStudentAvailability}</p><a href={university.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:underline">Official website</a></div></main>
}
