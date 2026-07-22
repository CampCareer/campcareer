import { AU_CONCEPT_OCCUPATIONS } from "@/data/au-major-occupation-map"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"

type Locale = "en" | "ko"

export type AuStudySubjectSuggestion = {
  id: string
  label: string
  detail: string
  query: string
}

export type AuStudyCareerSuggestion = {
  id: string
  label: string
  detail: string
  query: string
}

function normalize(value: string) {
  return value
    // NFC preserves complete Korean syllables; NFKD splits them into Jamo and
    // would turn a Korean search such as "간호" into an empty query here.
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3]+/gi, " ")
    .trim()
}

function localizedLabel(locale: Locale, en: string, ko: string) {
  return locale === "ko" ? ko : en
}

/**
 * Keeps the subject field assistive rather than speculative: every chip comes
 * from the published study taxonomy and its explicit AU occupation mapping.
 */
export function getAuStudySearchSuggestions({
  category,
  query,
  locale,
}: {
  category?: string
  query?: string
  locale: Locale
}): {
  subjects: AuStudySubjectSuggestion[]
  careers: AuStudyCareerSuggestion[]
} {
  const categoryLabels = new Map<string, string>(STUDY_CATEGORIES.map((item) => [item.id, `${item.id} ${item.label} ${item.labelKo}`]))
  const normalizedQuery = normalize(query ?? "")
  const scopedConcepts = STUDY_CONCEPTS.filter((concept) => !category || concept.category === category)
  const matches = (value: string) => !normalizedQuery || normalize(value).includes(normalizedQuery)

  const matchingConcepts = scopedConcepts.filter((concept) => matches([
    concept.id,
    concept.label,
    concept.labelKo,
    concept.roiSearchTerm,
    categoryLabels.get(concept.category) ?? "",
    ...concept.aliases,
    ...concept.aliasesKo,
  ].join(" ")))

  const subjects = matchingConcepts
    .slice(0, 8)
    .map((concept) => ({
      id: concept.id,
      label: localizedLabel(locale, concept.label, concept.labelKo),
      detail: localizedLabel(locale, "Study subject", "세부 전공"),
      query: concept.roiSearchTerm,
    }))

  const careers = scopedConcepts
    .flatMap((concept) => {
      const occupationGroup = AU_CONCEPT_OCCUPATIONS.find((item) => item.conceptId === concept.id)
      return (occupationGroup?.representativeOccupations ?? []).map((occupation) => ({
        id: `${concept.id}:${occupation.oscaCode}`,
        label: localizedLabel(locale, occupation.label, occupation.labelKo),
        detail: localizedLabel(locale, `${localizedLabel(locale, concept.label, concept.labelKo)} study path`, `${localizedLabel(locale, concept.label, concept.labelKo)} 전공 경로`),
        query: concept.roiSearchTerm,
        searchable: `${occupation.label} ${occupation.labelKo} ${concept.label} ${concept.labelKo} ${concept.roiSearchTerm}`,
      }))
    })
    .filter((career) => matches(career.searchable))
    .slice(0, 8)
    .map(({ searchable: _searchable, ...career }) => career)

  return { subjects, careers }
}
