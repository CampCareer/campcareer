"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import L from "leaflet"
import { Maximize2 } from "lucide-react"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import { SA4_BY_STATE, type SA4Region } from "@/data/sa4-regions"
import { useTranslations } from "@/lib/i18n/locale-provider"
import type { MapData } from "@/lib/map-data"

// SA4 코드 → 지역명 (툴팁/하이라이트용)
const SA4_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  Object.values(SA4_BY_STATE)
    .flat()
    .map((r) => [r.code, r.name]),
)

const AU_BOUNDS = L.latLngBounds([-44, 112], [-10, 154])
const US_BOUNDS = L.latLngBounds([24, -125], [49, -66])
const CA_BOUNDS = L.latLngBounds([41, -145], [85, -50])
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

function isCanada(properties: Record<string, unknown>): boolean {
  return properties?.ISO_A3 === "CAN" || properties?.ADM0_A3 === "CAN"
}

export default function LeafletMap({
  data,
  selected,
  selectedSA4,
  activeCountry,
  onSelectState,
  onSelectCountry,
  onSelectSA4,
  onReset,
}: {
  data: MapData
  selected: string | null
  selectedSA4: SA4Region | null
  activeCountry: "AU" | "US" | "CA" | null
  onSelectState: (s: string) => void
  onSelectCountry: (c: "AU" | "US" | "CA") => void
  onSelectSA4: (code: string) => void
  onReset: () => void
}) {
  const t = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const auLayerRef = useRef<L.GeoJSON | null>(null)
  const usLayerRef = useRef<L.GeoJSON | null>(null)
  const caLayerRef = useRef<L.GeoJSON | null>(null)
  const worldLayerRef = useRef<L.GeoJSON | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)
  const layersByCode = useRef<Partial<Record<StateCode, L.Polygon>>>({})
  // SA4(지역) 드릴다운: 전체 지오메트리는 한 번만 로드(sa4GeoRef)하고, 선택된 주의 지역만
  // sa4Layer 로 렌더한다. sa4ByCode 로 선택 지역 bounds 를 찾아 줌인한다.
  const sa4GeoRef = useRef<GeoJSON.FeatureCollection | null>(null)
  const sa4LayerRef = useRef<L.GeoJSON | null>(null)
  const sa4ByCode = useRef<Record<string, L.Polygon>>({})
  const selectedRef = useRef<string | null>(selected)
  const selectedSA4Ref = useRef<SA4Region | null>(selectedSA4)
  const activeCountryRef = useRef(activeCountry)
  const didFitRef = useRef(false)
  const onSelectStateRef = useRef(onSelectState)
  const onSelectCountryRef = useRef(onSelectCountry)
  const onSelectSA4Ref = useRef(onSelectSA4)
  onSelectStateRef.current = onSelectState
  onSelectCountryRef.current = onSelectCountry
  onSelectSA4Ref.current = onSelectSA4

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

  // 컨테이너가 아직 0폭(레이아웃 전)이면 leaflet 의 zoom 계산이 NaN LatLng 를 만들어
  // flyToBounds/fitBounds 가 throw 한다. 그래서 모든 bounds 이동은 이 가드를 통과시킨다.
  // (딥링크로 selected 가 마운트 직후 null→NSW 로 바뀔 때 특히 중요 — 초기 fit 도 line 376
  // 에서 같은 clientWidth>0 조건을 본다.)
  function safeBounds(bounds: L.LatLngBoundsExpression): L.LatLngBounds | null {
    const container = containerRef.current
    if (!mapRef.current || !container || container.clientWidth === 0) return null
    const b = L.latLngBounds(bounds as L.LatLngBoundsLiteral)
    return b.isValid() ? b : null
  }

  function fitToBounds(bounds: L.LatLngBoundsExpression, animate: boolean) {
    const map = mapRef.current
    const b = safeBounds(bounds)
    if (!map || !b) return
    if (animate) map.flyToBounds(b, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
    else map.fitBounds(b, { padding: [20, 20], maxZoom: 6 })
  }

  function sa4StyleFor(code: string): L.PathOptions {
    const isSel = selectedSA4Ref.current?.code === code
    return {
      fillColor: "#7c3aed",
      fillOpacity: isSel ? 0.45 : 0.08,
      color: isSel ? "#4c1d95" : "#ffffff",
      weight: isSel ? 2.5 : 1,
    }
  }

  // 선택된 주의 SA4 지역만 주 폴리곤 위(sa4Pane)에 렌더한다. 주 미선택·비AU면 제거.
  function renderSA4() {
    const map = mapRef.current
    if (!map) return
    if (sa4LayerRef.current) {
      map.removeLayer(sa4LayerRef.current)
      sa4LayerRef.current = null
    }
    sa4ByCode.current = {}
    const stateCode = selectedRef.current
    if (activeCountryRef.current !== "AU" || !stateCode || !sa4GeoRef.current) return

    const fc: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: sa4GeoRef.current.features.filter(
        (f) => f.properties?.STATE_CODE === stateCode,
      ),
    }
    const layer = L.geoJSON(fc, {
      pane: "sa4Pane",
      style: (feature) => sa4StyleFor(feature?.properties?.SA4_CODE as string),
      onEachFeature: (feature, lyr) => {
        const code = feature?.properties?.SA4_CODE as string
        if (!code) return
        sa4ByCode.current[code] = lyr as L.Polygon
        lyr.bindTooltip(SA4_NAME_BY_CODE[code] ?? code, {
          sticky: true,
          direction: "top",
          className: "!rounded-md !border-0 !bg-slate-900 !px-2 !py-1 !text-xs !text-white !shadow-md",
        })
        lyr.on({
          click: () => onSelectSA4Ref.current(code),
          mouseover: () => {
            if (selectedSA4Ref.current?.code !== code) (lyr as L.Path).setStyle({ fillOpacity: 0.22 })
          },
          mouseout: () => {
            if (selectedSA4Ref.current?.code !== code) (lyr as L.Path).setStyle(sa4StyleFor(code))
          },
        })
      },
    })
    sa4LayerRef.current = layer
    map.addLayer(layer)

    layer.eachLayer((l) => {
      const el = (l as L.Path).getElement() as SVGElement | null
      const code = (l as L.GeoJSON & { feature?: GeoJSON.Feature }).feature?.properties
        ?.SA4_CODE as string | undefined
      if (!el || !code) return
      el.setAttribute("tabindex", "0")
      el.setAttribute("role", "button")
      el.setAttribute("aria-label", SA4_NAME_BY_CODE[code] ?? code)
      el.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelectSA4Ref.current(code)
        }
      })
    })
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

    // 월드(국가) 레이어를 주(state) 레이어보다 항상 아래에 그리도록 전용 pane 을 둔다.
    // 두 GeoJSON 은 독립 fetch 로 로드되는데, 큰 world-countries.geojson 이 나중에
    // 끝나면 호주 폴리곤이 주 위에 깔려 첫 클릭이 "국가 선택"으로 새던 버그를 막는다.
    // (overlayPane 기본 zIndex=400 → basePane 350 으로 낮춘다.)
    map.createPane("basePane")
    const basePane = map.getPane("basePane")
    if (basePane) basePane.style.zIndex = "350"

    // SA4(지역) 레이어는 주 폴리곤(overlayPane 400) 위에 올린다.
    map.createPane("sa4Pane")
    const sa4Pane = map.getPane("sa4Pane")
    if (sa4Pane) sa4Pane.style.zIndex = "401"

    const ro = new ResizeObserver(() => {
      if (mapRef.current !== map) return
      map.invalidateSize()
      if (!didFitRef.current && container.clientWidth > 0) {
        if (activeCountryRef.current === "AU") map.fitBounds(AU_BOUNDS)
        else if (activeCountryRef.current === "US") map.fitBounds(US_BOUNDS)
        else if (activeCountryRef.current === "CA") map.fitBounds(CA_BOUNDS)
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
          pane: "basePane",
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
              click: () => onSelectCountryRef.current(isAU ? "AU" : isUS ? "US" : "CA"),
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
                  onSelectCountryRef.current(isAU ? "AU" : isUS ? "US" : "CA")
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
            // 딥링크(?state=NSW)로 이미 주가 선택돼 있으면 그 주로, 아니면 호주 전체로 맞춘다.
            const sel = selectedRef.current
            const selLyr = sel ? layersByCode.current[sel as StateCode] : undefined
            fitToBounds(selLyr ? selLyr.getBounds() : AU_BOUNDS, false)
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
          style: (feature) => {
            const postal = feature?.properties?.postal as string | undefined
            const isSel = selectedRef.current === postal
            return {
              fillColor: "#e0f2fe",
              fillOpacity: isSel ? 0.8 : 0.4,
              color: isSel ? "#1e293b" : "#0284c7",
              weight: isSel ? 3 : 1,
            }
          },
          onEachFeature: (feature, lyr) => {
            const postal = feature?.properties?.postal as string | undefined
            ;(lyr as L.Path).on({
              click: () => {
                if (postal) {
                  onSelectCountryRef.current("US")
                  onSelectStateRef.current(postal)
                }
              },
              mouseover: () => (lyr as L.Path).setStyle({ weight: 2, fillOpacity: 0.6 }),
              mouseout: () => {
                (lyr as L.Path).setStyle({
                  fillColor: "#e0f2fe",
                  fillOpacity: selectedRef.current === postal ? 0.8 : 0.4,
                  color: selectedRef.current === postal ? "#1e293b" : "#0284c7",
                  weight: selectedRef.current === postal ? 3 : 1,
                })
              },
            })
            const el = (lyr as L.Path).getElement() as SVGElement | null
            if (el && postal) {
              el.setAttribute("tabindex", "0")
              el.setAttribute("role", "button")
              el.setAttribute("aria-label", (feature?.properties?.name as string) ?? postal)
              el.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelectStateRef.current(postal)
                }
              })
            }
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

    // Canada provinces layer
    fetch("/ca-provinces.geojson")
      .then((r) => r.json())
      .then((geo: GeoJSON.FeatureCollection) => {
        if (mapRef.current !== map) return
        const caLayer = L.geoJSON(geo, {
          style: (feature) => {
            const postal = feature?.properties?.postal as string | undefined
            const isSel = selectedRef.current === postal
            return {
              fillColor: "#fce7f3",
              fillOpacity: isSel ? 0.8 : 0.4,
              color: isSel ? "#1e293b" : "#ec4899",
              weight: isSel ? 3 : 1,
            }
          },
          onEachFeature: (feature, lyr) => {
            const postal = feature?.properties?.postal as string | undefined
            const name = feature?.properties?.name as string | undefined
            ;(lyr as L.Path).on({
              click: () => {
                if (postal) {
                  onSelectCountryRef.current("CA")
                  onSelectStateRef.current(postal)
                }
              },
              mouseover: () => (lyr as L.Path).setStyle({ weight: 2, fillOpacity: 0.6 }),
              mouseout: () => {
                (lyr as L.Path).setStyle({
                  fillColor: "#fce7f3",
                  fillOpacity: selectedRef.current === postal ? 0.8 : 0.4,
                  color: selectedRef.current === postal ? "#1e293b" : "#ec4899",
                  weight: selectedRef.current === postal ? 3 : 1,
                })
              },
            })
            const el = (lyr as L.Path).getElement() as SVGElement | null
            if (el && postal) {
              el.setAttribute("tabindex", "0")
              el.setAttribute("role", "button")
              el.setAttribute("aria-label", name ?? postal)
              el.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelectStateRef.current(postal)
                }
              })
            }
          },
        })
        caLayerRef.current = caLayer

        if (activeCountryRef.current === "CA") {
          map.addLayer(caLayer)
          if (!didFitRef.current && container.clientWidth > 0) {
            fitToBounds(CA_BOUNDS, false)
            didFitRef.current = true
          }
        }
      })
      .catch((err) => console.error("[LeafletMap] ca geojson load failed:", err))

    // SA4 지역 경계 — 한 번만 로드해 두고, 주 선택 시 해당 주의 지역만 렌더한다.
    fetch("/au-sa4.geojson")
      .then((r) => r.json())
      .then((geo: GeoJSON.FeatureCollection) => {
        if (mapRef.current !== map) return
        sa4GeoRef.current = geo
        renderSA4() // 딥링크(?state=NSW)로 이미 주가 선택돼 있으면 즉시 렌더
      })
      .catch((err) => console.error("[LeafletMap] sa4 geojson load failed:", err))

    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
      worldLayerRef.current = null
      auLayerRef.current = null
      usLayerRef.current = null
      caLayerRef.current = null
      markerLayerRef.current = null
      sa4LayerRef.current = null
      sa4GeoRef.current = null
      sa4ByCode.current = {}
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
    if (caLayerRef.current && map.hasLayer(caLayerRef.current)) map.removeLayer(caLayerRef.current)
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
    } else if (activeCountry === "CA") {
      if (caLayerRef.current) map.addLayer(caLayerRef.current)
      fitToBounds(CA_BOUNDS, true)
    } else {
      fitToBounds(WORLD_BOUNDS, true)
    }
    renderSA4()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCountry])

  // Selected state changed
  useEffect(() => {
    selectedRef.current = selected
    auLayerRef.current?.setStyle((feature) => styleFor(feature?.properties?.STATE_CODE as StateCode))
    if (auLayerRef.current && activeCountry === "AU") {
      if (selected) {
        const lyr = layersByCode.current[selected as StateCode]
        const b = safeBounds(lyr ? lyr.getBounds() : AU_BOUNDS)
        if (b) mapRef.current?.flyToBounds(b, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
      } else {
        const b = safeBounds(AU_BOUNDS)
        if (b) mapRef.current?.flyToBounds(b, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
      }
    } else if (usLayerRef.current && activeCountry === "US") {
      // Update US state styling based on selection
      usLayerRef.current.setStyle((feature) => {
        const postal = feature?.properties?.postal as string | undefined
        const isSel = selected === postal
        return {
          fillColor: "#e0f2fe",
          fillOpacity: isSel ? 0.8 : 0.4,
          color: isSel ? "#1e293b" : "#0284c7",
          weight: isSel ? 3 : 1,
        }
      })
    } else if (caLayerRef.current && activeCountry === "CA") {
      caLayerRef.current.setStyle((feature) => {
        const postal = feature?.properties?.postal as string | undefined
        const isSel = selected === postal
        return {
          fillColor: "#fce7f3",
          fillOpacity: isSel ? 0.8 : 0.4,
          color: isSel ? "#1e293b" : "#ec4899",
          weight: isSel ? 3 : 1,
        }
      })
    }
    // 주가 바뀌면 그 주의 SA4 지역을 (재)렌더한다.
    renderSA4()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // 선택된 지역(SA4) 변경 → 지역 폴리곤 하이라이트 + 해당 지역으로 줌인.
  useEffect(() => {
    selectedSA4Ref.current = selectedSA4
    const layer = sa4LayerRef.current
    if (!layer) return
    layer.setStyle((feature) => sa4StyleFor(feature?.properties?.SA4_CODE as string))
    if (selectedSA4) {
      const lyr = sa4ByCode.current[selectedSA4.code]
      const b = lyr ? safeBounds(lyr.getBounds()) : null
      if (b) mapRef.current?.flyToBounds(b, { padding: [40, 40], maxZoom: 8, duration: 0.6 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSA4])

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
        {t.map.seeAll}
      </button>

      {activeCountry === "AU" && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="mb-1 text-[11px] font-medium text-slate-500">{t.map.legendShortageCount}</p>
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
