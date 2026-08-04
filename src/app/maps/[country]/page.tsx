import {
  getLaunchCountry,
  getLaunchCountryBySlug,
  type LaunchCountryCode,
} from "@/data/launch-countries"
import { buildMapsHref, type MapSearchParams } from "@/app/map/maps-route"
import { notFound, permanentRedirect } from "next/navigation"

const LEGACY_COUNTRY_ALIASES: Record<string, LaunchCountryCode> = {
  gb: "GB",
  uk: "GB",
  uae: "AE",
  usa: "US",
}

/** Compatibility for old `/maps/au` and `/maps/australia` bookmarks. */
export default async function LegacyCountryMapPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>
  searchParams: Promise<MapSearchParams>
}) {
  const requestedCountry = (await params).country.toLowerCase()
  const country =
    getLaunchCountry(requestedCountry) ??
    getLaunchCountryBySlug(requestedCountry) ??
    getLaunchCountry(LEGACY_COUNTRY_ALIASES[requestedCountry] ?? "")

  if (!country) notFound()
  permanentRedirect(buildMapsHref(await searchParams, country.code))
}
