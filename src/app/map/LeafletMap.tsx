"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import L from "leaflet"
import { Maximize2 } from "lucide-react"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import type { MapData } from "@/lib/map-data"

// 베이스맵 없음(확정): 타일 레이어 없이 GeoJSON 폴리곤만 slate 배경 위에 렌더 → 외부 타일/토큰 의존 0.
const AU_BOUNDS = L.latLngBounds([
  [-44, 112],
  [-10, 154],
])

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
  onReset,
}: {
  data: MapData
  selected: StateCode | null
  onSelectState: (s: StateCode) => void
  onReset: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.GeoJSON | null>(null)
  const layersByCode = useRef<Partial<Record<StateCode, L.Polygon>>>({})
  const selectedRef = useRef<StateCode | null>(selected)
  const didFitRef = useRef(false)
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

  // 현재 상태(선택 주 or 전국)에 맞춰 뷰포트 맞춤
  function fitToSelection(animate: boolean) {
    const map = mapRef.current
    if (!map) return
    const code = selectedRef.current
    const lyr = code ? layersByCode.current[code] : null
    const target = lyr ? lyr.getBounds() : AU_BOUNDS
    if (animate) map.flyToBounds(target, { padding: [30, 30], maxZoom: 6, duration: 0.6 })
    else map.fitBounds(target, { padding: [20, 20], maxZoom: 6 })
  }

  // init (한 번만)
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
      maxBounds: AU_BOUNDS.pad(0.45),
      maxBoundsViscosity: 0.8,
    })
    mapRef.current = map
    map.fitBounds(AU_BOUNDS)

    // grid(lg:grid-cols-2) 에서 컨테이너 폭이 0 으로 시작할 수 있어, 실제 크기가 잡히면
    // invalidateSize() 로 재측정한다. 첫 유효 크기에서만 호주 경계로 맞추고(0-width 버그),
    // 이후엔 사용자의 줌을 건드리지 않도록 크기 재계산만 한다.
    const ro = new ResizeObserver(() => {
      if (mapRef.current !== map) return
      map.invalidateSize()
      if (!didFitRef.current && container.clientWidth > 0) {
        fitToSelection(false)
        didFitRef.current = true
      }
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
            layersByCode.current[code] = lyr as L.Polygon
            const count = data.shortageByState[code]?.length ?? 0
            lyr.bindTooltip(`${STATE_NAMES[code]} · 부족직종 ${count}개`, {
              sticky: true,
              direction: "top",
              className: "!rounded-md !border-0 !bg-slate-900 !px-2 !py-1 !text-xs !text-white !shadow-md",
            })
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

        // 첫 유효 크기 fit 이 아직이면 여기서(레이어 기준) 맞춤
        if (!didFitRef.current && container.clientWidth > 0) {
          fitToSelection(false)
          didFitRef.current = true
        } else if (selectedRef.current) {
          // 딥링크로 들어온 초기 선택 주가 있으면 거기로 줌인
          fitToSelection(true)
        }

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
      layersByCode.current = {}
      didFitRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 선택 변경 시: 스타일 재적용 + 해당 주(또는 전국)로 부드럽게 줌
  useEffect(() => {
    selectedRef.current = selected
    layerRef.current?.setStyle((feature) => styleFor(feature?.properties?.STATE_CODE as StateCode))
    if (layerRef.current) fitToSelection(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[440px] w-full overflow-hidden rounded-xl border border-slate-200 sm:h-[560px]"
        style={{ background: "#f1f5f9" }}
      />

      {/* 전체 보기(리셋) */}
      <button
        type="button"
        onClick={onReset}
        className="absolute right-3 top-3 z-[1000] inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-900"
      >
        <Maximize2 className="h-3.5 w-3.5" />
        전체 보기
      </button>

      {/* 범례 */}
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
    </div>
  )
}
