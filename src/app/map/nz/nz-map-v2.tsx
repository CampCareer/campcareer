"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import { ExternalLink, GraduationCap, MapPin } from "lucide-react"

type Bundle = Awaited<ReturnType<typeof import("@/lib/nz-map-v2")["getNZMapV2Bundle"]>>

export default function NZMapV2({ bundle }: { bundle: Bundle }) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layers = useRef<L.LayerGroup | null>(null)
  const [regionCode, setRegionCode] = useState<string>("AUK")
  const region = bundle.regions.find((item) => item.code === regionCode) ?? bundle.regions[0]
  const institutions = bundle.institutions.filter((item) => item.regionCode === region.code)
  const cities = bundle.cities.filter((item) => item.regionCode === region.code)

  useEffect(() => {
    if (!container.current || map.current) return
    const instance = L.map(container.current, { zoomControl: true }).setView([-41.2, 173.5], 5)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 12,
    }).addTo(instance)
    map.current = instance
    return () => { instance.remove(); map.current = null }
  }, [])

  useEffect(() => {
    const instance = map.current
    if (!instance) return
    layers.current?.remove()
    const group = L.layerGroup().addTo(instance)
    layers.current = group
    let cancelled = false
    fetch(bundle.boundaryUrl)
      .then((response) => response.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        if (cancelled) return
        const layer = L.geoJSON(geojson, {
          style: (feature) => ({
            color: feature?.properties?.code === region.code ? "#4f46e5" : "#94a3b8",
            weight: feature?.properties?.code === region.code ? 3 : 1,
            fillColor: feature?.properties?.code === region.code ? "#c7d2fe" : "#f8fafc",
            fillOpacity: feature?.properties?.code === region.code ? 0.65 : 0.3,
          }),
          onEachFeature: (feature, item) => item.on("click", () => {
            const code = String(feature.properties?.code ?? "")
            if (bundle.regions.some((value) => value.code === code)) setRegionCode(code)
          }),
        }).addTo(group)
        instance.fitBounds(layer.getBounds(), { padding: [20, 20] })
      })
    return () => { cancelled = true; group.remove() }
  }, [bundle, region.code])

  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <section className="border-b bg-white"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-700">New Zealand · Maps</p>
      <h1 className="mt-2 text-3xl font-semibold">Explore study locations across New Zealand</h1>
      <p className="mt-3 max-w-3xl text-slate-600">Official boundaries, location references and institution markers are available now. Rent, shortage and pay evidence is published only after source-row review.</p>
    </div></section>
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px] sm:px-6">
      <div ref={container} className="h-[58vh] min-h-[480px] overflow-hidden rounded-xl border bg-slate-100" />
      <aside className="space-y-4">
        <section className="rounded-xl border bg-white p-5"><label className="text-sm font-semibold">Region</label><select value={region.code} onChange={(event) => setRegionCode(event.target.value)} className="mt-2 w-full rounded-md border px-3 py-2">
          {bundle.regions.map((item) => <option key={item.code} value={item.code}>{item.nameEn}</option>)}
        </select><h2 className="mt-5 text-xl font-semibold">{region.nameEn}</h2><p className="mt-1 text-sm text-slate-500">{region.nameKo}</p></section>
        <section className="rounded-xl border bg-white p-5"><h3 className="font-semibold">Rent</h3><p className="mt-2 text-sm text-amber-700">Verification in progress</p><a className="mt-2 inline-flex text-sm font-medium text-indigo-700 hover:underline" href={region.rent.sourceUrl} target="_blank" rel="noreferrer">Official rental-bond source <ExternalLink className="ml-1 h-4 w-4" /></a></section>
        <section className="rounded-xl border bg-white p-5"><h3 className="font-semibold">Shortage and high-income occupations</h3><p className="mt-2 text-sm text-amber-700">Verification in progress — no unreviewed salary or shortage figures are shown.</p><a className="mt-2 inline-flex text-sm font-medium text-indigo-700 hover:underline" href={region.occupations.sourceUrl} target="_blank" rel="noreferrer">ANZSCO source <ExternalLink className="ml-1 h-4 w-4" /></a></section>
        <section className="rounded-xl border bg-white p-5"><h3 className="flex items-center gap-2 font-semibold"><GraduationCap className="h-4 w-4" /> Institutions ({institutions.length})</h3><p className="mt-1 text-xs text-slate-500">International-student eligibility: not verified</p><ul className="mt-3 space-y-3">{institutions.map((item) => <li key={item.slug}><a href={item.officialUrl} target="_blank" rel="noreferrer" className="font-medium text-indigo-700 hover:underline">{item.name}</a><p className="text-xs text-slate-500">{item.type} · {item.cityName}</p></li>)}</ul></section>
        <section className="rounded-xl border bg-white p-5"><h3 className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4" /> Cities</h3><p className="mt-2 text-sm text-slate-600">{cities.map((item) => item.nameEn).join(", ") || "No representative city reference yet."}</p></section>
      </aside>
    </div>
  </main>
}
