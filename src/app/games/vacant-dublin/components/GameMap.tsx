"use client"
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Site } from "../data/sites"

interface Props {
  sites:          Site[]
  developed:      Set<string>
  onSelectSite:   (id: string) => void
  selectedSiteId: string | null
}

function siteColor(s: Site, developed: Set<string>) {
  if (developed.has(s.id)) return "#43A047"
  return ({ Vacant: "#E53935", Council: "#1E88E5", Derelict: "#FB8C00" } as Record<string, string>)[s.type] ?? "#E53935"
}

function makeIcon(s: Site, developed: Set<string>) {
  const built = developed.has(s.id)
  const color = siteColor(s, developed)
  const ico   = built ? "🏢" : "📍"
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:${built ? "default" : "pointer"}">
      <div style="font-size:1.6rem;filter:drop-shadow(0 2px 5px rgba(0,0,0,.5))">${ico}</div>
      <div style="background:${color};color:#fff;font-family:'Press Start 2P',monospace;font-size:.32rem;padding:2px 5px;border-radius:3px;margin-top:-3px;box-shadow:0 2px 6px rgba(0,0,0,.4);max-width:86px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.name}</div>
    </div>`,
    iconSize:    [90, 52],
    iconAnchor:  [45, 52],
    popupAnchor: [0, -52],
  })
}

function makePopupHtml(s: Site, developed: Set<string>) {
  const built = developed.has(s.id)
  return `<div style="padding:4px;font-family:'Nunito',sans-serif">
    <div style="font-size:.42rem;color:rgba(255,255,255,.3);margin-bottom:2px">${s.id} · ${s.years}년 방치</div>
    <div style="font-family:'Press Start 2P',monospace;font-size:.5rem;color:#fff;margin-bottom:5px;line-height:1.5">${s.name}</div>
    <div style="font-size:.56rem;color:#FDD835;margin-bottom:2px">토지: €${(s.landVal / 1e6).toFixed(1)}M</div>
    <div style="font-size:.5rem;color:rgba(255,255,255,.42);margin-bottom:8px">${s.area}ha · ${s.type} · ${s.owner}</div>
    ${built
      ? `<div style="color:#A5D6A7;font-size:.52rem">✅ 이미 개발 완료!</div>`
      : `<button data-sid="${s.id}" style="background:#FDD835;color:#0d1642;border:none;border-radius:6px;padding:.38rem .75rem;font-family:'Press Start 2P',monospace;font-size:.4rem;cursor:pointer;width:100%">🏗 개발하기</button>`
    }
  </div>`
}

export default function GameMap({ sites, developed, onSelectSite, selectedSiteId }: Props) {
  const mapRef     = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const selectRef  = useRef(onSelectSite)
  selectRef.current = onSelectSite

  // initialise map once
  useEffect(() => {
    if (mapRef.current) return
    const map = L.map("vd-map", { center: [53.352, -6.268], zoom: 13, zoomControl: false })
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap © CARTO", maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: "bottomright" }).addTo(map)
    mapRef.current = map

    sites.forEach(s => {
      const marker = L.marker([s.lat, s.lng], { icon: makeIcon(s, developed) })
      marker.bindPopup(makePopupHtml(s, developed), { maxWidth: 262 })
      marker.on("click", () => { if (!developed.has(s.id)) selectRef.current(s.id) })
      marker.on("popupopen", () => {
        const el  = marker.getPopup()?.getElement()
        const btn = el?.querySelector<HTMLElement>(`[data-sid="${s.id}"]`)
        if (btn) {
          L.DomEvent.on(btn, "click", () => { selectRef.current(s.id); map.closePopup() })
        }
      })
      marker.addTo(map)
      markersRef.current[s.id] = marker
    })

    return () => { map.remove(); mapRef.current = null; markersRef.current = {} }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // update markers when developed set changes
  useEffect(() => {
    if (!mapRef.current) return
    sites.forEach(s => {
      const m = markersRef.current[s.id]
      if (!m) return
      m.setIcon(makeIcon(s, developed))
      m.bindPopup(makePopupHtml(s, developed), { maxWidth: 262 })
      m.off("click")
      m.on("click", () => { if (!developed.has(s.id)) selectRef.current(s.id) })
    })
  }, [developed, sites])

  // pan to selected site
  useEffect(() => {
    if (!selectedSiteId || !mapRef.current) return
    const site = sites.find(s => s.id === selectedSiteId)
    if (site) {
      mapRef.current.setView([site.lat, site.lng], 15, { animate: true })
      markersRef.current[selectedSiteId]?.openPopup()
    }
  }, [selectedSiteId, sites])

  return (
    <div id="vd-map" className="absolute left-0 right-0 bottom-0" style={{ top: 84 }} />
  )
}
