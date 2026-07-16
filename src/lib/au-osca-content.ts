import profiles from "@/data/au-osca-occupation-profiles.json"

export type AuOfficialOccupationContent = {
  code: string
  title: string
  alternativeTitles: string[]
  leadStatement: string
  registrationOrLicensing: string | null
  inclusionAndExclusion: string | null
  skillAttributes: string | null
  skillLevel: number | null
  mainTasks: string[]
  specialisations: string[]
  occupationInNecCategory: string | null
  officialUrl: string
}

type OscaSnapshot = {
  source: {
    name: string
    pageUrl: string
    datasetUrl: string
    classification: string
    released: string
    retrievedAt: string
    contentHash: string
  }
  occupations: AuOfficialOccupationContent[]
}

const snapshot = profiles as OscaSnapshot
const byCode = new Map(snapshot.occupations.map((occupation) => [occupation.code, occupation]))

export const AU_OSCA_SOURCE = snapshot.source

export function getAuOfficialOccupationContent(code: string): AuOfficialOccupationContent | null {
  return byCode.get(code) ?? null
}
