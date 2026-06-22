"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import L from "leaflet"
import { Maximize2 } from "lucide-react"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import type { MapData } from "@/lib/map-data"

const AU_BOUNDS = L.latLngBounds([-44, 112], [-10, 154])
const WORLD_BOUNDS = L.latLngBounds([-90, -180], [90, 180])

const RAMP_LIGHT = [237, 233, 254]
const RAMP_DARK = [109, 40, 217]

function lerpColor(t: number): string {
  const c = RAMP_LIGHT.map((a, i) => Math.round(a + (RAMP_DARK[i] - a) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

function isAustralia(properties: Record<string, unknown>): boolean {
  return properties?.ISO_A3 === "AUS" || properties?.ADM0_A3 === "AUS"
}

export default function LeafletMap({
  data,
  selected,
  showAustralia,
  onSelectState,
  onSelectAustralia,
  onReset,
}: {
  data: MapData
  selected: StateCode | null
  showAustralia: boolean
  onSelectState: (s: StateCode) => void
  onSelectAustralia: () => void
  onReset: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const auLayerRef = useRef<L.GeoJSON | null>(null)
  const worldLayerRef = useRef<L.GeoJSON | null>(null)
  const layersByCode = useRef<Partial<Record<StateCode, L.Polygon>>>({})
  const selectedRef = useRef<StateCode | null>(selected)
  const showAuRef = useRef(showAustralia)
  const didFitRef = useRef(false)
  const onSelectStateRef = useRef(onSelectState)
  const onSelectAustraliaRef = useRef(onSelectAustralia)
  onSelectStateRef.current = onSelectState
  onSelectAustraliaRef.current = onSelectAustralia

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

  function fitToSelection(animate: boolean) {
    const map = mapRef.current
    if (!map) return
    const code = selectedRef.current
    const lyr = code ? layersByCode.current[code] : null
    const target = lyr ? lyr.getBounds() : AU_BOUNDS
    if (animate) map.flyToBounds(target, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
    else map.fitBounds(target, { padding: [20, 20], maxZoom: 6 })
  }

  function fitToWorld(animate: boolean) {
    const map = mapRef.current
    if (!map) return
    if (animate) map.flyToBounds(WORLD_BOUNDS, { padding: [10, 10], maxZoom: 2, duration: 0.8 })
    else map.fitBounds(WORLD_BOUNDS, { padding: [10, 10], maxZoom: 2 })
  }

  // Init map, load GeoJSON layers
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return
    const map = L.map(container, {
      attributionControl: false,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      minZoom: 2,
      maxZoom: 8,
      maxBounds: WORLD_BOUNDS.pad(0.3),
      maxBoundsViscosity: 0.8,
    })
    mapRef.current = map
    map.fitBounds(WORLD_BOUNDS)

    const ro = new ResizeObserver(() => {
      if (mapRef.current !== map) return
      map.invalidateSize()
      if (!didFitRef.current && container.clientWidth > 0) {
        if (showAuRef.current) fitToSelection(false)
        else map.fitBounds(WORLD_BOUNDS)
        didFitRef.current = true
      }
    })
    ro.observe(container)

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
            return { fillColor: "#f8fafc", color: "#cbd5e1", weight: 0.8, fillOpacity: 0.6 }
          },
          onEachFeature: (feature, lyr) => {
            if (!isAustralia(feature.properties as Record<string, unknown>)) return
            lyr.bindTooltip("Australia", {
              sticky: true,
              direction: "top",
              className: "!rounded-md !border-0 !bg-slate-900 !px-2 !py-1 !text-xs !text-white !shadow-md",
            })
            lyr.on({
              click: () => onSelectAustraliaRef.current(),
              mouseover: () => (lyr as L.Path).setStyle({ weight: 3, fillOpacity: 0.7 }),
              mouseout: () =>
                (lyr as L.Path).setStyle({
                  fillColor: "#e0e7ff",
                  color: "#6366f1",
                  weight: 2,
                  fillOpacity: 0.5,
                }),
            })
            const el = (lyr as L.Path).getElement() as SVGElement | null
            if (el) {
              el.setAttribute("tabindex", "0")
              el.setAttribute("role", "button")
              el.setAttribute("aria-label", "Australia")
              el.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelectAustraliaRef.current()
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

        if (showAuRef.current) {
          map.addLayer(auLayer)
          if (!didFitRef.current && container.clientWidth > 0) {
            fitToSelection(false)
            didFitRef.current = true
          } else if (selectedRef.current) {
            fitToSelection(true)
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

    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
      worldLayerRef.current = null
      auLayerRef.current = null
      layersByCode.current = {}
      didFitRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Toggle AU states layer on showAustralia change
  useEffect(() => {
    showAuRef.current = showAustralia
    const map = mapRef.current
    const auLayer = auLayerRef.current
    if (!map || !auLayer) return

    if (showAustralia) {
      if (!map.hasLayer(auLayer)) map.addLayer(auLayer)
      fitToSelection(true)
    } else {
      if (map.hasLayer(auLayer)) map.removeLayer(auLayer)
      fitToWorld(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAustralia])

  // Selected state changed
  useEffect(() => {
    selectedRef.current = selected
    auLayerRef.current?.setStyle((feature) => styleFor(feature?.properties?.STATE_CODE as StateCode))
    if (auLayerRef.current && showAustralia) {
      fitToSelection(true)
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

      {showAustralia && (
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
