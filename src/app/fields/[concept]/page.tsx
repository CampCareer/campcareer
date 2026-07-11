import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { STUDY_CONCEPTS, getStudyConcept } from "@/data/study-concepts"
import { ConceptProfile } from "@/components/study-product/concept-profile"

type Props = { params: Promise<{ concept: string }> }

export function generateStaticParams() {
  return STUDY_CONCEPTS.map((concept) => ({ concept: concept.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { concept: slug } = await params
  const concept = getStudyConcept(slug)
  if (!concept) return {}
  const path = `/fields/${concept.slug}`
  return {
    title: `${concept.label} study pathways, costs and careers | CampCareer`,
    description: `${concept.description} Compare verified country pathways, qualifications, cost and career evidence.`,
    alternates: { canonical: path, languages: { en: path, "ko-KR": `/ko/fields/${concept.slug}`, "x-default": path } },
  }
}

export default async function FieldPage({ params }: Props) {
  const concept = getStudyConcept((await params).concept)
  if (!concept) notFound()
  return <ConceptProfile concept={concept} locale="en" />
}
