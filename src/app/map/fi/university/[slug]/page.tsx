import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FI_UNIVERSITIES } from "@/data/fi-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

function getUniversity(slug: string) {
  return FI_UNIVERSITIES.find((university) => university.slug === slug) ?? null
}

export function generateStaticParams() {
  return FI_UNIVERSITIES.map((university) => ({ slug: university.slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const params = await props.params
  const university = getUniversity(params.slug)

  if (!university) {
    return {
      title: "University not found",
      robots: { index: false, follow: false },
    }
  }

  return {
    ...pageMetadata({
      title: university.nameEn + " | Finland university profile | CampCareer",
      description:
        university.nameEn +
        " (" +
        university.nameKo +
        "), a higher-education institution in " +
        university.cityName +
        ", Finland.",
      path: "/map/fi/university/" + university.slug,
    }),
    robots: { index: isCountrySearchIndexable("FI"), follow: true },
  }
}

export default async function FinlandUniversityPage(
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
  const university = getUniversity(params.slug)
  if (!university) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/fi" className="text-sm font-semibold text-blue-700 hover:underline">
        Finland profile
      </Link>
      <h1 className="mt-5 text-4xl font-semibold text-slate-950">
        {university.nameEn}
      </h1>
      <p className="mt-3 text-slate-600">
        {university.nameKo} · {university.cityName}
      </p>
      {university.worldRanking != null && (
        <div className="mt-8 rounded-lg border border-violet-200 bg-violet-50 p-5">
          <p className="text-sm font-medium text-violet-700">
            QS World University Rankings
          </p>
          <p className="mt-1 text-3xl font-semibold text-violet-950">
            #{university.worldRanking}
          </p>
        </div>
      )}
      <div className="mt-8 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-500">Institution type</p>
        <p className="mt-1 font-semibold">{university.institutionType}</p>
        <a
          href={university.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:underline"
        >
          Official website
        </a>
      </div>
    </main>
  )
}
