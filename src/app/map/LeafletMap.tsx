"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import L from "leaflet"
import { Maximize2 } from "lucide-react"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import type { MapData } from "@/lib/map-data"

const AU_BOUNDS = L.latLngBounds([-44, 112], [-10, 154])
const US_BOUNDS = L.latLngBounds([24, -125], [49, -66])
const WORLD_BOUNDS = L.latLngBounds([-90, -180], [90, 180])

const RAMP_LIGHT = [237, 233, 254]
const RAMP_DARK = [109, 40, 217]

function lerpColor(t: number): string {
  const c = RAMP_LIGHT.map((a, i) => Math.round(a + (RAMP_DARK[i] - a) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

function roiColor(score: number | null): string {
  if (!score || score <= 0) return "#94a3b8"
  if (score > 15) return "#16a34a"
  if (score > 8) return "#22c55e"
  if (score > 5) return "#65a30d"
  if (score > 3) return "#eab308"
  return "#ef4444"
}

function isAustralia(properties: Record<string, unknown>): boolean {
  return properties?.ISO_A3 === "AUS" || properties?.ADM0_A3 === "AUS"
}

function isUSA(properties: Record<string, unknown>): boolean {
  return properties?.ISO_A3 === "USA" || properties?.ADM0_A3 === "USA"
}

export default function LeafletMap({
  data,
  selected,
  activeCountry,
  onSelectState,
  onSelectCountry,
  onReset,
}: {
  data: MapData
  selected: StateCode | null
  activeCountry: "AU" | "US" | null
  onSelectState: (s: StateCode) => void
  onSelectCountry: (c: "AU" | "US") => void
  onReset: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const auLayerRef = useRef<L.GeoJSON | null>(null)
  const usLayerRef = useRef<L.GeoJSON | null>(null)
  const worldLayerRef = useRef<L.GeoJSON | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)
  const layersByCode = useRef<Partial<Record<StateCode, L.Polygon>>>({})
  const selectedRef = useRef<StateCode | null>(selected)
  const activeCountryRef = useRef(activeCountry)
  const didFitRef = useRef(false)
  const onSelectStateRef = useRef(onSelectState)
  const onSelectCountryRef = useRef(onSelectCountry)
  onSelectStateRef.current = onSelectState
  onSelectCountryRef.current = onSelectCountry

  const dataRef = useRef(data)
  dataRef.current = data

  const counts = STATE_CODES.map((c) => data.shortageByState[c]?.length ?? 0)
  const minCount = Math.min(...counts)
  const maxCount = Math.max(...counts)

  function colorFor(code: StateCode): string {
    const n = dataRef.current.shortageByState[code]?.length ?? 0
    const t = maxCount === minCount ? 0.6 : (n - minCount) / (maxCount - minCount)
    return lerpColor(t)
  }

  function styleFor(code: StateCode): L.PathOptions {
    const isSel = selectedRef.current === code
    return {
      fillColor: colorFor(code),
      fillOpacity: isSel ? 0.95 : 0.8,
      color: isSel ? "#1e293b" : "#ffffff",
      weight: isSel ? 3 : 1,
    }
  }

  function buildMarkers(): L.LayerGroup {
    const group = L.layerGroup()
    const colleges = dataRef.current.usColleges
    for (const c of colleges) {
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: Math.max(4, Math.min(10, (c.roi_score ?? 0) * 0.5)),
        fillColor: roiColor(c.roi_score),
        fillOpacity: 0.8,
        color: "#ffffff",
        weight: 1,
      })
      const lines = [
        c.college_name,
        `${c.city_name}, ${c.college_state}`,
        c.roi_score != null ? `ROI: ${c.roi_score}` : "",
        c.tuition != null ? `Tuition: A$${c.tuition.toLocaleString()}` : "",
        c.median_earnings != null ? `Earnings: $${c.median_earnings.toLocaleString()}` : "",
        c.graduation_rate != null ? `Grad rate: ${Math.round(c.graduation_rate * 100)}%` : "",
      ]
      marker.bindTooltip(c.college_name, {
        sticky: true,
        direction: "top",
        className: "!rounded-md !border-0 !bg-slate-900 !px-2 !py-1 !text-xs !text-white !shadow-md",
      })
      marker.bindPopup(
        `<div class="text-sm leading-relaxed">${lines.filter(Boolean).join("<br>")}</div>`,
      )
      marker.on({
        mouseover: () => marker.setStyle({ radius: Math.max(6, Math.min(14, (c.roi_score ?? 0) * 0.7)), fillOpacity: 1 }),
        mouseout: () => marker.setStyle({ radius: Math.max(4, Math.min(10, (c.roi_score ?? 0) * 0.5)), fillOpacity: 0.8 }),
      })
      group.addLayer(marker)
    }
    return group
  }

  function updateMarkers() {
    const map = mapRef.current
    if (!map) return
    if (markerLayerRef.current) {
      map.removeLayer(markerLayerRef.current)
      markerLayerRef.current = null
    }
    if (activeCountryRef.current === "US" && map.getZoom() >= 5) {
      const group = buildMarkers()
      group.addTo(map)
      markerLayerRef.current = group
    }
  }

  function fitToBounds(bounds: L.LatLngBoundsExpression, animate: boolean) {
    const map = mapRef.current
    if (!map) return
    if (animate) map.flyToBounds(bounds, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
    else map.fitBounds(bounds, { padding: [20, 20], maxZoom: 6 })
  }

  // Init map, load all GeoJSON layers
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return
    const map = L.map(container, {
      attributionControl: false,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      minZoom: 2,
      maxZoom: 10,
      maxBounds: WORLD_BOUNDS.pad(0.3),
      maxBoundsViscosity: 0.8,
    })
    mapRef.current = map
    map.fitBounds(WORLD_BOUNDS)

    const ro = new ResizeObserver(() => {
      if (mapRef.current !== map) return
      map.invalidateSize()
      if (!didFitRef.current && container.clientWidth > 0) {
        if (activeCountryRef.current === "AU") map.fitBounds(AU_BOUNDS)
        else if (activeCountryRef.current === "US") map.fitBounds(US_BOUNDS)
        else map.fitBounds(WORLD_BOUNDS)
        didFitRef.current = true
      }
    })
    ro.observe(container)

    // Zoom change → update marker visibility
    map.on("zoomend", () => {
      if (activeCountryRef.current === "US") updateMarkers()
    })

    // World countries layer
    fetch("/world-countries.geojson")
      .then((r) => r.json())
      .then((geo: GeoJSON.FeatureCollection) => {
        if (mapRef.current !== map) return
        const worldLayer = L.geoJSON(geo, {
          style: (feature) => {
            if (feature && isAustralia(feature.properties as Record<string, unknown>)) {
              return { fillColor: "#e0e7ff", color: "#6366f1", weight: 2, fillOpacity: 0.5 }
            }
            if (feature && isUSA(feature.properties as Record<string, unknown>)) {
              return { fillColor: "#dcfce7", color: "#22c55e", weight: 2, fillOpacity: 0.5 }
            }
            return { fillColor: "#f8fafc", color: "#cbd5e1", weight: 0.8, fillOpacity: 0.6 }
          },
          onEachFeature: (feature, lyr) => {
            const props = feature.properties as Record<string, unknown>
            const isAU = isAustralia(props)
            const isUS = isUSA(props)
            if (!isAU && !isUS) return

            const name = isAU ? "Australia" : "United States"
            lyr.bindTooltip(name, {
              sticky: true,
              direction: "top",
              className: "!rounded-md !border-0 !bg-slate-900 !px-2 !py-1 !text-xs !text-white !shadow-md",
            })
            lyr.on({
              click: () => onSelectCountryRef.current(isAU ? "AU" : "US"),
              mouseover: () => (lyr as L.Path).setStyle({ weight: 3, fillOpacity: 0.7 }),
              mouseout: () => {
                const baseStyle = isAU
                  ? { fillColor: "#e0e7ff", color: "#6366f1", weight: 2, fillOpacity: 0.5 }
                  : { fillColor: "#dcfce7", color: "#22c55e", weight: 2, fillOpacity: 0.5 }
                ;(lyr as L.Path).setStyle(baseStyle)
              },
            })
            const el = (lyr as L.Path).getElement() as SVGElement | null
            if (el) {
              el.setAttribute("tabindex", "0")
              el.setAttribute("role", "button")
              el.setAttribute("aria-label", name)
              el.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelectCountryRef.current(isAU ? "AU" : "US")
                }
              })
            }
          },
        }).addTo(map)
        worldLayerRef.current = worldLayer
      })
      .catch((err) => console.error("[LeafletMap] world geojson load failed:", err))

    // AU states layer
    fetch("/au-states.geojson")
      .then((r) => r.json())
      .then((geo: GeoJSON.FeatureCollection) => {
        if (mapRef.current !== map) return
        const auLayer = L.geoJSON(geo, {
          style: (feature) => styleFor(feature?.properties?.STATE_CODE as StateCode),
          onEachFeature: (feature, lyr) => {
            const code = feature?.properties?.STATE_CODE as StateCode
            layersByCode.current[code] = lyr as L.Polygon
            const count = dataRef.current.shortageByState[code]?.length ?? 0
            lyr.bindTooltip(`${STATE_NAMES[code]} · ${count}`, {
              sticky: true,
              direction: "top",
              className: "!rounded-md !border-0 !bg-slate-900 !px-2 !py-1 !text-xs !text-white !shadow-md",
            })
            lyr.on({
              click: () => onSelectStateRef.current(code),
              mouseover: () => {
                if (selectedRef.current !== code) (lyr as L.Path).setStyle({ weight: 2, fillOpacity: 0.95 })
              },
              mouseout: () => {
                if (selectedRef.current !== code) (lyr as L.Path).setStyle(styleFor(code))
              },
            })
          },
        })
        auLayerRef.current = auLayer

        if (activeCountryRef.current === "AU") {
          map.addLayer(auLayer)
          if (!didFitRef.current && container.clientWidth > 0) {
            fitToBounds(AU_BOUNDS, false)
            didFitRef.current = true
          }
        }

        auLayer.eachLayer((l) => {
          const path = (l as L.Path).getElement() as SVGElement | null
          const code = (l as L.GeoJSON & { feature?: GeoJSON.Feature }).feature?.properties
            ?.STATE_CODE as StateCode | undefined
          if (!path || !code) return
          path.setAttribute("tabindex", "0")
          path.setAttribute("role", "button")
          path.setAttribute("aria-label", STATE_NAMES[code])
          path.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelectStateRef.current(code)
            }
          })
        })
      })
      .catch((err) => console.error("[LeafletMap] au geojson load failed:", err))

    // US states layer
    fetch("/us-states.geojson")
      .then((r) => r.json())
      .then((geo: GeoJSON.FeatureCollection) => {
        if (mapRef.current !== map) return
        const usLayer = L.geoJSON(geo, {
          style: () => ({
            fillColor: "#e0f2fe",
            fillOpacity: 0.4,
            color: "#0284c7",
            weight: 1,
          }),
          onEachFeature: (_feature, lyr) => {
            (lyr as L.Path).on({
              mouseover: () => (lyr as L.Path).setStyle({ weight: 2, fillOpacity: 0.6 }),
              mouseout: () => (lyr as L.Path).setStyle({ fillColor: "#e0f2fe", fillOpacity: 0.4, color: "#0284c7", weight: 1 }),
            })
          },
        })
        usLayerRef.current = usLayer

        if (activeCountryRef.current === "US") {
          map.addLayer(usLayer)
          if (!didFitRef.current && container.clientWidth > 0) {
            fitToBounds(US_BOUNDS, false)
            didFitRef.current = true
          }
        }
      })
      .catch((err) => console.error("[LeafletMap] us geojson load failed:", err))

    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
      worldLayerRef.current = null
      auLayerRef.current = null
      usLayerRef.current = null
      markerLayerRef.current = null
      layersByCode.current = {}
      didFitRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Toggle active country
  useEffect(() => {
    activeCountryRef.current = activeCountry
    const map = mapRef.current
    if (!map) return

    // Hide all country layers
    if (auLayerRef.current && map.hasLayer(auLayerRef.current)) map.removeLayer(auLayerRef.current)
    if (usLayerRef.current && map.hasLayer(usLayerRef.current)) map.removeLayer(usLayerRef.current)
    if (markerLayerRef.current) {
      map.removeLayer(markerLayerRef.current)
      markerLayerRef.current = null
    }

    if (activeCountry === "AU") {
      if (auLayerRef.current) map.addLayer(auLayerRef.current)
      fitToBounds(AU_BOUNDS, true)
    } else if (activeCountry === "US") {
      if (usLayerRef.current) map.addLayer(usLayerRef.current)
      fitToBounds(US_BOUNDS, true)
      updateMarkers()
    } else {
      fitToBounds(WORLD_BOUNDS, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCountry])

  // Selected state changed
  useEffect(() => {
    selectedRef.current = selected
    auLayerRef.current?.setStyle((feature) => styleFor(feature?.properties?.STATE_CODE as StateCode))
    if (auLayerRef.current && activeCountry === "AU") {
      if (selected) {
        const lyr = layersByCode.current[selected]
        const target = lyr ? lyr.getBounds() : AU_BOUNDS
        mapRef.current?.flyToBounds(target, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
      } else {
        mapRef.current?.flyToBounds(AU_BOUNDS, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <div className="relative h-full w-full">
      <style>{".leaflet-interactive:focus { outline: none !important; }"}</style>
      <div ref={containerRef} className="h-full w-full" style={{ background: "#f1f5f9" }} />

      <button
        type="button"
        onClick={onReset}
        className="absolute bottom-3 right-3 z-[1000] inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-900"
      >
        <Maximize2 className="h-3.5 w-3.5" />
        전체 보기
      </button>

      {activeCountry === "AU" && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="mb-1 text-[11px] font-medium text-slate-500">부족 직종 수</p>
          <div
            className="h-2 w-28 rounded-full"
            style={{ background: `linear-gradient(to right, ${lerpColor(0)}, ${lerpColor(1)})` }}
          />
          <div className="mt-1 flex justify-between text-[10px] tabular-nums text-slate-400">
            <span>{minCount}</span>
            <span>{maxCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}
