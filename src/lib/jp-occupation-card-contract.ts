import type { Locale } from "@/lib/i18n/config"

export type TranslationStatus = "pending" | "machine-draft" | "human-reviewed"
export type EvidenceStatus = "pending" | "official" | "review-required"

export type JapanOccupationCard = {
  sourceCode: string
  localName: string
  nameEn: string | null
  nameKo: string | null
  translationStatus: TranslationStatus
  jobTagOccupationId: string | null
  skills: Array<{ nameJa: string; nameEn: string | null; nameKo: string | null; sourceUrl: string }>
  qualifications: Array<{ nameJa: string; nameEn: string | null; nameKo: string | null; required: boolean | null; sourceUrl: string }>
  courses: Array<{ titleJa: string; titleEn: string | null; titleKo: string | null; provider: string; url: string; evidenceStatus: EvidenceStatus }>
  sourceStatus: EvidenceStatus
}

export function occupationDisplayName(
  occupation: Pick<JapanOccupationCard, "localName" | "nameEn" | "nameKo">,
  locale: Locale,
) {
  if (locale === "ko") return occupation.nameKo ?? occupation.localName
  return occupation.nameEn ?? occupation.localName
}

export function getJapanCareerLinks(localName: string, prefectureJa?: string | null) {
  const query = [localName, prefectureJa].filter(Boolean).join(" ")
  return {
    // We link out to the live source rather than copying job listings, whose
    // terms, availability, and application status change continuously.
    helloWork: "https://www.hellowork.mhlw.go.jp/",
    indeedJapan: `https://jp.indeed.com/jobs?q=${encodeURIComponent(query)}`,
    jobTagSearch: `https://shigoto.mhlw.go.jp/User/Search/Freeword?keyword=${encodeURIComponent(localName)}`,
    jassoStudySearch: "https://www.jasso.go.jp/en/study_j/index.html",
  }
}

export function isJapanOccupationCardIndexable(card: JapanOccupationCard) {
  return card.translationStatus === "human-reviewed"
    && card.sourceStatus === "official"
    && card.jobTagOccupationId != null
    && card.skills.length > 0
    && card.courses.some((course) => course.evidenceStatus === "official")
}
