import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { STUDY_CONCEPTS, getStudyConcept } from "@/data/study-concepts"
import { ConceptProfile } from "@/components/study-product/concept-profile"

type Props = { params: Promise<{ concept: string }> }

export function generateStaticParams() {
  return STUDY_CONCEPTS.map((concept) => ({ concept: concept.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concept = getStudyConcept((await params).concept)
  if (!concept) return {}
  const path = `/ko/fields/${concept.slug}`
  return {
    title: `${concept.labelKo} 유학 과정·비용·취업 경로 | CampCareer`,
    description: `${concept.labelKo} 과정의 국가별 자격, 비용, 취업 전망과 졸업 후 경로를 비교하세요.`,
    alternates: { canonical: path, languages: { en: `/fields/${concept.slug}`, "ko-KR": path, "x-default": `/fields/${concept.slug}` } },
  }
}

export default async function KoreanFieldPage({ params }: Props) {
  const concept = getStudyConcept((await params).concept)
  if (!concept) notFound()
  return <ConceptProfile concept={concept} locale="ko-KR" />
}
