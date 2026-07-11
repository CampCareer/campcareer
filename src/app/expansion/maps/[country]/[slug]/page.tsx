import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PILOT_OCCUPATIONS } from "@/data/pilot-occupations"
import { isPilotOccupationIndexable } from "@/lib/pilot-launch-gate"
import { PilotOccupationPage, pilotOccupationSlug } from "@/components/expansion/pilot-occupation-page"

type Props = { params: Promise<{ country: string; slug: string }> }
type RouteParams = Awaited<Props["params"]>

function findOccupation(params: RouteParams) {
  return PILOT_OCCUPATIONS.find((occupation) =>
    occupation.country.toLowerCase() === params.country && pilotOccupationSlug(occupation) === params.slug && isPilotOccupationIndexable(occupation),
  ) ?? null
}

export function generateStaticParams() {
  return PILOT_OCCUPATIONS.filter(isPilotOccupationIndexable).map((occupation) => ({
    country: occupation.country.toLowerCase(),
    slug: pilotOccupationSlug(occupation),
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const occupation = findOccupation(params)
  if (!occupation) return { title: "Occupation pilot not found" }
  const path = `/expansion/maps/${params.country}/${params.slug}`
  return {
    title: `${occupation.nameEn ?? occupation.localName ?? occupation.sourceCode} salary, demand, and work pathway | CampCareer`,
    description: `Validate salary, labour demand, foreign-worker access, and language barriers for ${occupation.nameEn ?? occupation.localName ?? occupation.sourceCode}.`,
    alternates: { canonical: path, languages: { en: path, "ko-KR": `/ko/maps/${params.country}/${params.slug}` } },
  }
}

export default async function EnglishPilotOccupationPage(props: Props) {
  const params = await props.params;
  const occupation = findOccupation(params)
  if (!occupation) notFound()
  return <PilotOccupationPage occupation={occupation} locale="en" />
}
