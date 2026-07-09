import { createHash } from "crypto"
import type { PilotSourceRecord } from "@/data/pilot-source-registry"
import type { PilotOccupation } from "@/lib/pilot-launch-gate"

export type OfficialSourcePayload = {
  source: PilotSourceRecord
  body: string
  retrievedAt: string
  summary: string
}

export type PilotSourceSnapshot = {
  countryCode: string
  category: string
  sourceUrl: string
  contentHash: string
  retrievedAt: string
  summary: string
}

export type PilotOccupationImport = Omit<PilotOccupation, "reviewStatus"> & {
  reviewStatus?: PilotOccupation["reviewStatus"]
}

export function createPilotSourceSnapshot(payload: OfficialSourcePayload): PilotSourceSnapshot {
  if (!payload.body.trim()) throw new Error("Official source payload is empty.")
  if (Number.isNaN(Date.parse(payload.retrievedAt))) throw new Error("Official source retrieval time is invalid.")

  return {
    countryCode: payload.source.country,
    category: payload.source.category,
    sourceUrl: payload.source.sourceUrl,
    contentHash: createHash("sha256").update(payload.body).digest("hex"),
    retrievedAt: payload.retrievedAt,
    summary: payload.summary.trim().slice(0, 2_000),
  }
}

// Imports never self-publish: raw values remain review-required until a human
// validates the source mapping, Korean title, and foreign-worker pathway.
export function preparePilotOccupationImport(input: PilotOccupationImport): PilotOccupation {
  if (!input.sourceCode.trim() || !input.nameEn.trim()) throw new Error("Occupation source code and English name are required.")
  if (input.medianSalary !== null && input.medianSalary < 0) throw new Error("Median salary cannot be negative.")
  if (input.shortageScore !== null && (input.shortageScore < 0 || input.shortageScore > 100)) {
    throw new Error("Shortage score must be between 0 and 100.")
  }

  return {
    ...input,
    sourceCode: input.sourceCode.trim(),
    nameEn: input.nameEn.trim(),
    nameKo: input.nameKo?.trim() || null,
    localName: input.localName?.trim() || null,
    reviewStatus: "review-required",
  }
}
