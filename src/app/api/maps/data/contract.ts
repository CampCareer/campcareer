import {
  getLaunchCountry,
  type CountryPublicationStage,
} from "@/data/launch-countries"

export type MapDataReadiness = {
  publicationStage: CountryPublicationStage
  map: "READY" | "REVIEW_REQUIRED"
  comparison: "READY" | "REVIEW_REQUIRED"
  notices?: string[]
}

export type MapDataEnvelope<TData = unknown> = {
  country: string
  data: TData
  dataVersion: string
  readiness: MapDataReadiness
}

export function buildMapDataEnvelope<TData>(
  country: string,
  data: TData,
  dataVersion: string,
  notices?: string[],
): MapDataEnvelope<TData> {
  const profile = getLaunchCountry(country)
  const publicationStage = profile?.publicationStage ?? "REVIEW_REQUIRED"

  return {
    country: country.toUpperCase(),
    data,
    dataVersion,
    readiness: {
      publicationStage,
      map: profile?.mapReady ? "READY" : "REVIEW_REQUIRED",
      comparison: publicationStage === "DECISION_READY" ? "READY" : "REVIEW_REQUIRED",
      ...(notices?.length ? { notices } : {}),
    },
  }
}
