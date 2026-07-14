const METROPOLITAN_FRANCE_BOUNDS = {
  minLatitude: 40,
  maxLatitude: 52,
  minLongitude: -6,
  maxLongitude: 10,
} as const

export type CoordinateBounds = {
  minLatitude: number
  maxLatitude: number
  minLongitude: number
  maxLongitude: number
}

function isFrance(properties: Record<string, unknown>): boolean {
  return properties.ISO_A3 === "FRA" || properties.ADM0_A3 === "FRA"
}

/**
 * Walk arbitrarily nested GeoJSON coordinates without assuming a fixed ring
 * depth. Invalid positions are ignored so one malformed point cannot erase a
 * whole country from the world layer.
 */
export function getCoordinateBounds(coordinates: unknown): CoordinateBounds | null {
  const bounds: CoordinateBounds = {
    minLatitude: Number.POSITIVE_INFINITY,
    maxLatitude: Number.NEGATIVE_INFINITY,
    minLongitude: Number.POSITIVE_INFINITY,
    maxLongitude: Number.NEGATIVE_INFINITY,
  }

  let positionCount = 0

  const visit = (value: unknown): void => {
    if (!Array.isArray(value)) return

    const [longitude, latitude] = value
    if (
      typeof longitude === "number" &&
      Number.isFinite(longitude) &&
      typeof latitude === "number" &&
      Number.isFinite(latitude)
    ) {
      bounds.minLatitude = Math.min(bounds.minLatitude, latitude)
      bounds.maxLatitude = Math.max(bounds.maxLatitude, latitude)
      bounds.minLongitude = Math.min(bounds.minLongitude, longitude)
      bounds.maxLongitude = Math.max(bounds.maxLongitude, longitude)
      positionCount += 1
      return
    }

    for (const child of value) visit(child)
  }

  visit(coordinates)
  return positionCount > 0 ? bounds : null
}

function intersectsMetropolitanFrance(bounds: CoordinateBounds): boolean {
  return !(
    bounds.maxLatitude < METROPOLITAN_FRANCE_BOUNDS.minLatitude ||
    bounds.minLatitude > METROPOLITAN_FRANCE_BOUNDS.maxLatitude ||
    bounds.maxLongitude < METROPOLITAN_FRANCE_BOUNDS.minLongitude ||
    bounds.minLongitude > METROPOLITAN_FRANCE_BOUNDS.maxLongitude
  )
}

/**
 * Natural Earth combines metropolitan France with overseas territories in a
 * single MultiPolygon. Keep every polygon intersecting metropolitan Europe
 * (including Corsica), while leaving all other country features untouched.
 */
export function metropolitanFranceOnly(
  geo: GeoJSON.FeatureCollection,
): GeoJSON.FeatureCollection {
  return {
    ...geo,
    features: geo.features.map((feature) => {
      const properties = (feature.properties ?? {}) as Record<string, unknown>
      if (!isFrance(properties) || feature.geometry?.type !== "MultiPolygon") {
        return feature
      }

      const coordinates = feature.geometry.coordinates.filter((polygon) => {
        const bounds = getCoordinateBounds(polygon)
        return bounds !== null && intersectsMetropolitanFrance(bounds)
      })

      return {
        ...feature,
        geometry: { ...feature.geometry, coordinates },
      } as GeoJSON.Feature
    }),
  }
}
