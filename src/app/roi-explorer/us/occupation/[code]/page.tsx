import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { getUSOccDetail } from "@/lib/us-occupation-detail"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import USOccupationDetailPage from "./USOccupationDetailPage"

export const revalidate = 86400

const getDetail = cache(getUSOccDetail)

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const occ = getDetail(params.code)
  if (!occ) return { title: "Occupation Not Found" }

  return pageMetadata({
    title: `${occ.occ_title} — Salary & Job Outlook in USA (SOC ${params.code}) 2026`,
    description: `${occ.occ_title} (SOC ${params.code}) salary, job outlook, employment stats in the United States. Median wage $${occ.median_wage.toLocaleString()}/yr, shortage score ${occ.shortage_score}/100. Data from BLS OES. Updated for 2026.`,
    path: `/roi-explorer/us/occupation/${params.code}`,
  })
}

export default async function Page({ params }: { params: { code: string } }) {
  const occ = getDetail(params.code)
  if (!occ) notFound()
  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "ROI Explorer", path: "/roi-explorer" },
        { name: "United States", path: "/roi-explorer/us" },
        { name: occ.occ_title, path: `/roi-explorer/us/occupation/${params.code}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: occ.occ_title,
        occupationCategory: `SOC ${params.code}`,
        description: `${occ.occ_title} in the United States. Median annual wage $${occ.median_wage.toLocaleString()}.`,
        estimatedSalary: { "@type": "MonetaryAmount", currency: "USD", value: occ.median_wage },
        mainEntityOfPage: `https://www.campcareer.com/roi-explorer/us/occupation/${params.code}`,
      }} />
      <USOccupationDetailPage occ={occ} />
    </>
  )
}
