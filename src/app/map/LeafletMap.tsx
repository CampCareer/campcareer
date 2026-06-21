"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import L from "leaflet"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import type { MapData } from "@/lib/map-data"

// 베이스맵 없음(확정): 타일 레이어 없이 GeoJSON 폴리곤만 slate 배경 위에 렌더 → 외부 타일/토큰 의존 0.
const AU_BOUNDS: L.LatLngBoundsExpression = [
  [-44, 112],
  [-10, 154],
]

// choropleth 보라 램프 (연한 violet-100 → 진한 violet-700)
const RAMP_LIGHT = [237, 233, 254] // #ede9fe
const RAMP_DARK = [109, 40, 217] // #6d28d9

function lerpColor(t: number): string {
  const c = RAMP_LIGHT.map((a, i) => Math.round(a + (RAMP_DARK[i] - a) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

export default function LeafletMap({
  data,
  selected,
  onSelectState,
}: {
  data: MapData
  selected: StateCode | null
  onSelectState: (s: StateCode) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.GeoJSON | null>(null)
  const selectedRef = useRef<StateCode | null>(selected)
  const onSelectRef = useRef(onSelectState)
  onSelectRef.current = onSelectState

  // 주별 부족직종 개수의 min/max — 색 대비를 데이터 범위에 맞춰 정규화
  const counts = STATE_CODES.map((c) => data.shortageByState[c]?.length ?? 0)
  const minCount = Math.min(...counts)
  const maxCount = Math.max(...counts)

  function colorFor(code: StateCode): string {
    const n = data.shortageByState[code]?.length ?? 0
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

  // init (한 번만)
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return
    const map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: true,
    })
    mapRef.current = map
    map.fitBounds(AU_BOUNDS)

    // grid(lg:grid-cols-2) 에서 컨테이너 폭이 0 으로 시작할 수 있어, 실제 크기가 잡히면
    // invalidateSize() 로 재측정하고 호주 경계에 다시 맞춘다. 반응형 리사이즈도 함께 처리.
    const ro = new ResizeObserver(() => {
      if (mapRef.current !== map) return
      map.invalidateSize()
      const bounds = layerRef.current?.getBounds()
      if (bounds && bounds.isValid()) map.fitBounds(bounds, { padding: [8, 8] })
      else map.fitBounds(AU_BOUNDS)
    })
    ro.observe(container)

    fetch("/au-states.geojson")
      .then((r) => r.json())
      .then((geo: GeoJSON.FeatureCollection) => {
        // 이 effect 의 map 이 더 이상 활성 인스턴스가 아니면(StrictMode 재마운트·빠른 이탈) 중단
        if (mapRef.current !== map) return
        const layer = L.geoJSON(geo, {
          style: (feature) => styleFor(feature?.properties?.STATE_CODE as StateCode),
          onEachFeature: (feature, lyr) => {
            const code = feature?.properties?.STATE_CODE as StateCode
            lyr.on({
              click: () => onSelectRef.current(code),
              mouseover: () => {
                if (selectedRef.current !== code) (lyr as L.Path).setStyle({ weight: 2, fillOpacity: 0.95 })
              },
              mouseout: () => {
                if (selectedRef.current !== code) (lyr as L.Path).setStyle(styleFor(code))
              },
            })
          },
        }).addTo(map)
        layerRef.current = layer
        map.fitBounds(layer.getBounds(), { padding: [8, 8] })

        // 키보드 접근성: 각 폴리곤 path 에 tabindex/role/aria 부여
        layer.eachLayer((l) => {
          const path = (l as L.Path).getElement() as SVGElement | null
          const code = (l as L.GeoJSON & { feature?: GeoJSON.Feature }).feature?.properties
            ?.STATE_CODE as StateCode | undefined
          if (!path || !code) return
          path.setAttribute("tabindex", "0")
          path.setAttribute("role", "button")
          path.setAttribute("aria-label", `${STATE_NAMES[code]} 선택`)
          path.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelectRef.current(code)
            }
          })
        })
      })
      .catch((err) => console.error("[LeafletMap] geojson load failed:", err))

    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 선택 변경 시 전체 스타일 재적용
  useEffect(() => {
    selectedRef.current = selected
    layerRef.current?.setStyle((feature) => styleFor(feature?.properties?.STATE_CODE as StateCode))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <div
      ref={containerRef}
      className="h-[440px] sm:h-[560px] w-full rounded-xl border border-slate-200 overflow-hidden"
      style={{ background: "#f1f5f9" }}
    />
  )
}
