import type { CountryOccupationProfile } from "./country-occupation-contract"

export type CareerMarketDemand = {
  countryCode: string
  countryName: string
  rating: string | null
  note: string
  sourceLabel: string | null
  sourceUrl: string | null
}

export type CareerMarketRecommendation = {
  countryCode: string
  countryName: string
  officialTitle: string | null
  opportunityScore: number | null
  scoreStatus: "provisional" | "reviewed" | "published" | null
  registrationRequired: boolean | null
  publicationStatus: "review_required" | "profile_ready" | "decision_ready" | null
  demand: CareerMarketDemand | null
}

export type CareerVisaPathway = {
  name: string
  kind: "Study" | "Work" | "Working holiday" | "Skilled" | "Family" | "Temporary"
  note: string
  authority: string
  sourceUrl: string
  sourceTitle: string
  lastVerifiedOn: string
}

export type CareerMarketInsight = {
  career: {
    id: string
    label: string
    labelKo: string
    overview: { ko: string; en: string } | null
    registration: { ko: string; en: string } | null
    mainTasks: string[]
    sources: { label: string; url: string }[]
  }
  country: { code: string; name: string } | null
  profile: CountryOccupationProfile | null
  demand: CareerMarketDemand | null
  recommendations: CareerMarketRecommendation[]
  visas: CareerVisaPathway[]
}
