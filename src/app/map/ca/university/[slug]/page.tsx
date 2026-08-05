import Link from "next/link"
import { notFound } from "next/navigation"
import { getCAMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { CA_PROVINCE_NAMES } from "../../../states"
import UniversityStaticCard from "../../../UniversityStaticCard"

// This page depends on live Supabase data. Render it per request instead of
// executing service-role queries while GitHub CI is collecting static pages.
export const dynamic = "force-dynamic"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const data = await getCAMapData()
  const college = data.caColleges.find((c) => c.slug === params.slug)
  if (!college) return pageMetadata({ title: "University Details", description: "", path: "/map" })

  const provinceName = CA_PROVINCE_NAMES[college.province] ?? college.province
  const rankStr = college.qs_rank ? `QS #${college.qs_rank} · ` : ""
  const earningsStr = college.median_earnings != null
    ? `Median earnings C$${college.median_earnings.toLocaleString()} · `
    : ""
  const gradStr = college.graduation_rate != null
    ? `Graduation rate ${Math.round(college.graduation_rate * 100)}%. `
    : ""
  const title = `${college.college_name} — ${rankStr}${provinceName}, Canada`
  const description = `${college.college_name} in ${college.city_name}, ${provinceName}. ${rankStr}${earningsStr}${gradStr}Study in Canada — tuition, earnings, and ROI for international students.`

  return pageMetadata({
    title,
    description,
    path: `/map/ca/university/${params.slug}`,
  })
}

export default async function UniversityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const data = await getCAMapData()
  const college = data.caColleges.find((c) => c.slug === params.slug)
  if (!college) notFound()

  const provinceName = CA_PROVINCE_NAMES[college.province] ?? college.province

  // City rent data
  const cityData = data.caCities.find(
    (c) => c.name.toLowerCase() === college.city_name.toLowerCase(),
  )

  // Top 5 high-pay occupations in this province
  const provinceHighPay = data.caHighPayByProvince[college.province] ?? []
  const topOccs = provinceHighPay
    .slice(0, 5)
    .map((o) => ({ name: o.occupation_en, salary: o.median_salary_cad, currency: "C$" }))

  return (
    <main className="min-h-screen bg-slate-50">
      <UniversityStaticCard
        d={{
          name: college.college_name,
          cityName: college.city_name,
          locationLabel: provinceName,
          countryCode: "CA",
          countryLabel: "Canada",
          qsRank: college.qs_rank,
          website: college.website,
          tuition: college.avg_net_price,
          tuitionCurrency: "C$",
          medianEarnings: college.median_earnings,
          earningsCurrency: "C$",
          graduationRate: college.graduation_rate ?? undefined,
          rentMedian: cityData?.rent_median ?? undefined,
          rentCurrency: "C$",
          topOccupations: topOccs,
        }}
      />
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          href={`/maps?country=ca&university=${params.slug}`}
          className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Open interactive map
        </Link>
      </section>
    </main>
  )
}
