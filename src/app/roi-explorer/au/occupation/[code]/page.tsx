import "server-only"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getOccupationPageData, getOccupationMeta } from "@/lib/occupation-detail"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { supabaseAdmin } from "@/lib/supabase-admin"
import OccupationDetailPage from "./OccupationDetailPage"

// Build-time pre-render all 395 AU occupation pages so Google doesn't encounter
// on-demand ISR cold starts during crawl — solves the "77 indexed / 1400 submitted" gap.
export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code")
  return (data ?? []).map((row) => ({ code: row.anzsco_code as string }))
}

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
        { name: "CampCareer", path: "/" },
        { name: "Australia", path: "/au" },
        { name: "Jobs", path: "/au/jobs" },
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
      {/* FAQPage schema — triggers "People Also Ask" rich snippets in Google */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the average salary for ${data.occupationName} in Australia?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: data.snapshot.medianSalaryText !== "—"
                ? `The median salary for ${data.occupationName} in Australia is ${data.snapshot.medianSalaryText} per year. The salary range is ${data.snapshot.salaryRangeText}.`
                : `Salary data for ${data.occupationName} in Australia varies by state and employer. Check current job listings for up-to-date figures.`,
            },
          },
          {
            "@type": "Question",
            name: `Is ${data.occupationName} in demand in Australia?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${data.occupationName} has a ${data.shortage.nationalLevel.toLowerCase()} skills shortage rating in Australia (score: ${data.shortage.nationalScore}/100). ${data.shortage.nationalLevel === "Strong" || data.shortage.nationalLevel === "High" ? "This occupation is on the Skills in Demand list and may qualify for priority visa processing." : "Demand varies by state and region."}`,
            },
          },
          {
            "@type": "Question",
            name: `What visa do I need to work as ${data.occupationName} in Australia?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Common visa pathways for ${data.occupationName} in Australia include the Temporary Skill Shortage (TSS) visa subclass 482, the Skilled Independent visa subclass 189, and state-nominated visas (subclass 190/491). ${data.snapshot.visaPathwaysText}`,
            },
          },
        ],
      }} />
      <OccupationDetailPage data={data} />
    </>
  )
}