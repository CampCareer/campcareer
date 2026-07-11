import type { Metadata } from "next"
import Link from "next/link"
import { FR_UNIVERSITIES } from "@/data/fr-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
function getUniversity(slug: string) { return FR_UNIVERSITIES.find((university) => university.slug === slug) ?? null }
export function generateStaticParams() { return FR_UNIVERSITIES.map((university) => ({ slug: university.slug })) }
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const university = getUniversity(params.slug);if (!university) return { title: "University not found" };return pageMetadata({ title: `${university.nameFr} | France university map | CampCareer`, description: `${university.nameFr}, a public higher-education institution in ${university.cityName}, France.`, path: `/map/fr/university/${university.slug}` })
}
export default async function FranceUniversityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const university = getUniversity(params.slug);if (!university) return null;return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link href={`/map?country=fr&state=${university.regionCode}`} className="text-sm font-semibold text-blue-700 hover:underline">France Maps</Link><h1 className="mt-5 text-4xl font-semibold text-slate-950">{university.nameFr}</h1><p className="mt-3 text-slate-600">{university.nameEn} · {university.cityName}</p>{university.qsRank2027 != null && <div className="mt-8 rounded-lg border border-violet-200 bg-violet-50 p-5"><p className="text-sm font-medium text-violet-700">QS World University Rankings 2027</p><p className="mt-1 text-3xl font-semibold text-violet-950">#{university.qsRank2027}</p>{university.qsRankSourceUrl && <a href={university.qsRankSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-violet-700 hover:underline">QS ranking source</a>}</div>}<div className="mt-8 rounded-lg border border-slate-200 p-5"><p className="text-sm text-slate-500">Institution type</p><p className="mt-1 font-semibold">{university.institutionType}</p>{university.studentCount != null && <p className="mt-4 text-sm text-slate-600">{university.studentCount.toLocaleString()} enrolled students in the MESR catalog.</p>}<a href={university.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:underline">Official website</a></div></main>
}
