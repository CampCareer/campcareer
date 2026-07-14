import { permanentRedirect } from "next/navigation"
import { buildMapsHref, type MapSearchParams } from "./maps-route"

/**
 * `/maps` is the canonical interactive map. Keep old bookmarks and campaign
 * links working, including state/region/tab query parameters.
 */
export default async function LegacyMapPage({
  searchParams,
}: {
  searchParams: Promise<MapSearchParams>
}) {
  permanentRedirect(buildMapsHref(await searchParams))
}
