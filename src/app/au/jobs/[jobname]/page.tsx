import "server-only"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { getOccupationDetail, getAllOccupationSlugs } from "./sample-data"
import { OccupationDetailClient } from "./OccupationDetail"

export const revalidate = 86400

type Params = { jobname: string }

type OccRow = {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  shortage_rating: number | null
  median_salary_aud: number | null
  on_csol: boolean
  confidence: string | null
  last_verified: string | null
}

type StateOccRow = {
  anzsco_code: string
  state: string
  state_shortage_rating: number
}

export async function generateStaticParams() {
  return getAllOccupationSlugs().map((jobname) => ({ jobname }))
}

async function getOccupationData(slug: string) {
  const detail = getOccupationDetail(slug)
  if (!detail) return null

  const { data: occRow } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, confidence, last_verified")
    .eq("anzsco_code", detail.anzscoCode)
    .single()

  const { data: stateRows } = await supabaseAdmin
    .from("occupation_state_au")
    .select("anzsco_code, state, state_shortage_rating")
    .eq("anzsco_code", detail.anzscoCode)

  return {
    detail,
    occ: occRow as OccRow | null,
    states: (stateRows ?? []) as StateOccRow[],
  }
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { jobname } = await props.params
  const data = await getOccupationData(jobname)
  if (!data) return { title: "Occupation not found" }

  return pageMetadata({
    title: `${data.detail.name} — Australia Jobs & Salary | CampCareer`,
    description: `${data.detail.name} (${data.detail.anzscoCode}) in Australia: salary, shortage rating, skills, visa pathways, and live job listings. Updated ${data.detail.lastVerified}.`,
    path: `/au/jobs/${jobname}`,
  })
}

export default async function AuOccupationPage(props: { params: Promise<Params> }) {
  const { jobname } = await props.params
  const data = await getOccupationData(jobname)
  if (!data) notFound()

  const { detail, occ, states } = data
  const salary = occ?.median_salary_aud ?? null
  const shortage = occ?.shortage_rating ?? null

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Australia", path: "/au" },
        { name: "Jobs", path: "/au/jobs" },
        { name: detail.name, path: `/au/jobs/${jobname}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: detail.name,
        occupationCategory: `ANZSCO ${detail.anzscoCode}`,
        description: detail.description,
        ...(salary && {
          estimatedSalary: {
            "@type": "MonetaryAmount",
            currency: "AUD",
            value: salary,
          },
        }),
        mainEntityOfPage: `https://www.campcareer.com/au/jobs/${jobname}`,
      }} />

      <OccupationDetailClient
        detail={detail}
        salary={salary}
        shortageRating={shortage}
        onCSOL={occ?.on_csol ?? false}
        stateShortages={states.map((s) => ({ state: s.state, rating: s.state_shortage_rating }))}
      />
    </>
  )
}
