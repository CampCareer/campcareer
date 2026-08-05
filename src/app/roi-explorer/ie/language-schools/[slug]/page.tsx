import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSchoolBySlug } from "@/lib/language-schools-ie"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import SchoolDetailPage from "./SchoolDetailPage"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const school = await getSchoolBySlug(params.slug)
  if (!school) return { title: "School Not Found" }

  const accreditations = school.accreditation?.join(", ") ?? ""
  const price = school.price_range_week ?? ""

  return pageMetadata({
    title: `${school.name_en} — 아일랜드 ${school.city} 영어 어학원 2026`,
    description: `${school.name_en} (${school.city}) ${accreditations ? `${accreditations} 인증.` : ""} 주당 수업료 ${price}, 홈스테이/기숙사 제공. ${school.description_ko?.slice(0, 80) ?? ""}`,
    path: `/roi-explorer/ie/language-schools/${params.slug}`,
  })
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const school = await getSchoolBySlug(params.slug)
  if (!school) notFound()
  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "ROI Explorer", path: "/roi-explorer" },
        { name: "Ireland", path: "/roi-explorer/ie" },
        { name: "Language Schools", path: "/roi-explorer/ie/language-schools" },
        { name: school.name_en, path: `/roi-explorer/ie/language-schools/${params.slug}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: school.name_en,
        description: school.description_ko ?? "",
        address: { "@type": "PostalAddress", addressLocality: school.city, addressRegion: school.region, addressCountry: "IE" },
        ...(school.website_url && { url: school.website_url }),
        ...(school.google_rating && { aggregateRating: { "@type": "AggregateRating", ratingValue: school.google_rating, bestRating: 5 } }),
      }} />
      <SchoolDetailPage school={school} />
    </>
  )
}
