import Link from "next/link"
import { notFound } from "next/navigation"
import { getDEMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { DE_BUNDESLAND_NAMES } from "../../../states"
import UniversityStaticCard from "../../../UniversityStaticCard"

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await getDEMapData()
  return data.deColleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = await getDEMapData()
  const college = data.deColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const regionName = DE_BUNDESLAND_NAMES[college.region] ?? college.region
  const rankStr = college.qs_rank ? `QS #${college.qs_rank} · ` : ""
  const tuitionStr = college.tuition != null
    ? `Tuition €${college.tuition.toLocaleString()}/yr (non-EU). `
    : "Tuition-free for international students. "
  const earningsStr = college.median_earnings != null
    ? `Median earnings €${college.median_earnings.toLocaleString()}. `
    : ""
  const title = `${college.college_name} — ${rankStr}${regionName}, Germany`
  const description = `${college.college_name} in ${college.city_name}, ${regionName}. ${rankStr}${tuitionStr}${earningsStr}In-demand occupations and salary data for graduates.`

  return pageMetadata({
    title,
    description,
    path: `/map/de/university/${params.slug}`,
  })
}

export default async function UniversityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = await getDEMapData()
  const college = data.deColleges.find((c) => c.slug === params.slug)
  if (!college) notFound()

  const regionName = DE_BUNDESLAND_NAMES[college.region] ?? college.region

  const cityData = data.deCities.find(
    (c) => c.name.toLowerCase() === college.city_name.toLowerCase(),
  )

  const regionHighPay = data.deHighPayByRegion[college.region] ?? []
  const topOccs = regionHighPay
    .slice(0, 5)
    .map((o) => ({ name: o.occupation_en, salary: o.median_salary_eur, currency: "€" }))

  return (
    <main className="min-h-screen bg-slate-50">
      <UniversityStaticCard
        d={{
          name: college.college_name,
          cityName: college.city_name,
          locationLabel: regionName,
          countryCode: "DE",
          countryLabel: "Germany",
          qsRank: college.qs_rank,
          website: college.website,
          tuition: college.tuition,
          tuitionFree: college.tuition == null,
          tuitionCurrency: "€",
          medianEarnings: college.median_earnings,
          earningsCurrency: "€",
          rentMedian: cityData?.rent_median ?? undefined,
          rentCurrency: "€",
          topOccupations: topOccs,
        }}
      />
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          href={`/maps?country=de&university=${params.slug}`}
          className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Open interactive map
        </Link>
      </section>
    </main>
  )
}
