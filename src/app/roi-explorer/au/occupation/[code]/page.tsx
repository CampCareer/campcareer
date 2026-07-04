import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getOccupationPageData, getOccupationMeta } from "@/lib/occupation-detail"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import OccupationDetailPage from "./OccupationDetailPage"

export const revalidate = 3600
export const dynamicParams = true

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const occ = await getOccupationMeta(params.code)
  if (!occ) return { title: "Occupation Not Found" }

  const salary = occ.median_salary_aud ? `A$${occ.median_salary_aud.toLocaleString()}` : ""
  const shortage = occ.shortage_rating != null ? `${"★".repeat(Math.round(occ.shortage_rating))} shortage` : ""

  return pageMetadata({
    title: `${occ.occupation_en} — ANZSCO ${params.code} Salary & Skills Shortage in Australia 2026`,
    description: `${occ.occupation_en} (ANZSCO ${params.code}) visa pathways, skills assessment, average salary ${salary}, and shortage rating ${shortage} in Australia. Updated for 2026.${occ.median_salary_aud ? ` Median salary ${salary}/yr.` : ""}`,
    path: `/roi-explorer/au/occupation/${params.code}`,
  })
}

export default async function Page({ params }: { params: { code: string } }) {
  const data = await getOccupationPageData(params.code)
  if (!data) notFound()
  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "ROI Explorer", path: "/roi-explorer" },
        { name: "Australia", path: "/roi-explorer/au" },
        { name: data.occupationName, path: `/roi-explorer/au/occupation/${params.code}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: data.occupationName,
        occupationCategory: `ANZSCO ${params.code}`,
        description: data.plainEnglish.bullets.join(" "),
        ...(data.snapshot.medianSalaryText !== "—" && {
          estimatedSalary: { "@type": "MonetaryAmount", currency: "AUD", value: data.snapshot.medianSalaryText.replace(/[^0-9,]/g, "") },
        }),
        mainEntityOfPage: `https://www.campcareer.com/roi-explorer/au/occupation/${params.code}`,
      }} />
      <OccupationDetailPage data={data} />
    </>
  )
}