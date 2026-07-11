import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import CAOccupationDetailPage from "./CAOccupationDetailPage"

export const revalidate = 3600
export const dynamicParams = true

export async function generateMetadata(props: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { data } = await supabase
    .from("occupations_ca")
    .select("occupation_en, median_salary_cad, shortage_rating")
    .eq("noc_code", params.code)
    .single()

  if (!data) return { title: "Occupation Not Found" }

  const salary = data.median_salary_cad ? `C$${data.median_salary_cad.toLocaleString()}` : ""
  const shortage = data.shortage_rating != null ? `${"★".repeat(Math.round(data.shortage_rating))} shortage` : ""

  return pageMetadata({
    title: `${data.occupation_en} — NOC ${params.code} Salary & Skills Shortage in Canada 2026`,
    description: `${data.occupation_en} (NOC ${params.code}) average salary, job outlook, and shortage rating in Canada. Median salary ${salary}. Updated for 2026.${shortage ? ` Shortage: ${shortage}.` : ""}`,
    path: `/roi-explorer/ca/occupation/${params.code}`,
  })
}

export default async function Page(props: { params: Promise<{ code: string }> }) {
  const params = await props.params;
  const { data: occ } = await supabase
    .from("occupations_ca")
    .select("occupation_en, noc_code, median_salary_cad, low_wage_cad, high_wage_cad, shortage_rating, on_teer_eligible, related_broad_field, confidence, data_source, last_verified, cops_future_outlook, cops_recent_outlook, projected_job_openings, projected_job_seekers, employment_growth")
    .eq("noc_code", params.code)
    .single()

  if (!occ) notFound()

  const { data: provinceRows } = await supabase
    .from("occupation_state_ca")
    .select("province, median_wage_cad, low_wage_cad, high_wage_cad, shortage_rating")
    .eq("noc_code", params.code)

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "ROI Explorer", path: "/roi-explorer" },
        { name: "Canada", path: "/roi-explorer/ca" },
        { name: occ.occupation_en, path: `/roi-explorer/ca/occupation/${params.code}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: occ.occupation_en,
        occupationCategory: `NOC ${params.code}`,
        ...(occ.median_salary_cad && {
          estimatedSalary: { "@type": "MonetaryAmount", currency: "CAD", value: occ.median_salary_cad },
        }),
        mainEntityOfPage: `https://www.campcareer.com/roi-explorer/ca/occupation/${params.code}`,
      }} />
      <CAOccupationDetailPage occ={occ} provinceRows={provinceRows ?? []} />
    </>
  )
}
