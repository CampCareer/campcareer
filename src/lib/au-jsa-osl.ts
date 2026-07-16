import source from "@/data/au-jsa-osl-2025.json"

export type AuJsaOslRating = "S" | "M" | "R" | "NS"

type JsaOccupation = {
  oscaCode: string
  title: string
  nationalRating: AuJsaOslRating
  stateRatings: Record<string, AuJsaOslRating>
}

type JsaOslSource = {
  source: { name: string; url: string; year: number }
  occupations: JsaOccupation[]
}

const jsaOsl = source as JsaOslSource
const byOscaCode = new Map(jsaOsl.occupations.map((occupation) => [occupation.oscaCode, occupation]))

export const AU_JSA_OSL_SOURCE = jsaOsl.source

export function getAuJsaOslRatings(oscaCode: string): JsaOccupation | null {
  return byOscaCode.get(oscaCode) ?? null
}

export function getAuJsaOslLabel(rating: AuJsaOslRating): string {
  return ({ S: "Shortage", M: "Metropolitan shortage", R: "Regional shortage", NS: "No shortage" })[rating]
}
