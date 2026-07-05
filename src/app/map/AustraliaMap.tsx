"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ExternalLink, Search, Bookmark, Share2, DollarSign, GraduationCap } from "lucide-react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations, useLocale } from "@/lib/i18n/locale-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATE_CODES, STATE_NAMES, US_STATE_CODES, US_STATE_NAMES, IE_COUNTY_CODES, IE_COUNTY_NAMES, IE_CITY_TO_COUNTY, CA_PROVINCE_CODES, CA_PROVINCE_NAMES, UK_REGION_CODES, UK_REGION_NAMES, type StateCode } from "./states"
import { SA4_BY_STATE, type SA4Region } from "@/data/sa4-regions"
import { WHV_REGIONS } from "@/data/whv-regions"
import { WHV_SPECIFIED_WORK } from "@/data/whv-occupations"
import { WHV_JOB_LINKS, WHV_GENERAL_JOBS } from "@/data/whv-job-links"
import { JOB_SEARCH_LINKS } from "@/data/job-search-links"
import { WHV_POSTCODES } from "@/data/whv-postcodes"
import { WHV_REGION_EMPLOYERS } from "@/data/whv-region-employers"
import POSTCODE_TO_SA4 from "@/data/postcode-to-sa4"
import { getPathway, TAFE_BY_STATE, VET_PORTALS, cricosSearchUrl } from "@/lib/au-pathway"
import { track } from "@/lib/analytics"
import { AffiliateCtas } from "@/components/partners/partner-cta"
import JobListings from "./JobListings"
import { EMPLOYMENT_OCCUPATIONS } from "@/data/employment-occupations"
import { EMPLOYMENT_SALARIES } from "@/data/employment-salaries"
import type { MapData, StateOccupation, USOccupation, HighPayOccupation, USCollege, StateSalaryMult, OccRow, StateShortageByOcc, CourseLite, USStateInfo, StateMajorDensity, USRankedCollege, AURankedCollege, CACollege, CACity, CAOccRow, CAHighPayOccupation, UKOccRow, UKRegionOccupation, UKCollege, UKCity } from "@/lib/map-data"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"
import { getShortageOccupations } from "@/lib/ie-shortage-occupations"
import { getIscBroadField } from "@/lib/ie-fields"

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" />,
})

const STATE_SEEK_PATH: Record<string, string> = {
  NSW: "New-South-Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South-Australia",
  WA: "Western-Australia",
  TAS: "Tasmania",
  NT: "Northern-Territory",
  ACT: "Australian-Capital-Territory",
}

type Tab = "stateInfo" | "shortage" | "pay" | "employment" | "whv"

type NeroOccupation = { a4: string; name: string; emp: number }
type NeroData = Record<string, NeroOccupation[]>

// 지역(SA4) 단위 직업군 데이터 — public/region-occupations.json (IVI 채용공고 + 인구조사 고소득).
type RegionGroup = { code?: string; title: string; value: number }
type RegionEntry = { demand: RegionGroup[]; demandMetro: boolean; pay: RegionGroup[] }
type RegionOccData = Record<string, RegionEntry>

export default function AustraliaMap({
  data,
  initialState,
  initialTab,
  initialSA4,
  initialUniversity,
}: {
  data: MapData
  initialState?: string
  initialTab?: Tab
  initialSA4?: string
  initialUniversity?: string
}) {
  const t = useTranslations()
  // /map은 호주 비치헤드의 front door다 → 진입 즉시 주/지역 선택(검색) 바가 보이도록
  // 기본을 "AU"로 둔다. 월드맵(다른 국가)은 "전체 보기"로 빠져나가 볼 수 있다.
  const [activeCountry, setActiveCountry] = useState<"AU" | "US" | "CA" | "IE" | "UK" | null>("AU")
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedSA4, setSelectedSA4] = useState<SA4Region | null>(null)
  const [tab, setTab] = useState<Tab>("shortage")
  const [neroData, setNeroData] = useState<NeroData | null>(null)
  const neroFetched = useRef(false)
  const [regionData, setRegionData] = useState<RegionOccData | null>(null)
  const regionFetched = useRef(false)
  const initialOccLoaded = useRef(false)
  // 직업 카드 열림 상태 — 툴바의 직업 검색에서도 열 수 있도록 최상위로 끌어올림.
  const [selectedOccCode, setSelectedOccCode] = useState<string | null>(null)
  const [selectedUsOcc, setSelectedUsOcc] = useState<USOccupation | null>(null)
  const [selectedUniv, setSelectedUniv] = useState<USRankedCollege | AURankedCollege | CACollege | UKCollege | null>(null)
  const [selectedNeroA4, setSelectedNeroA4] = useState<string | null>(null)
  const initialNeroLoaded = useRef(false)
  const initialSA4Ref = useRef<string | null>(null)
  // 모바일에서는 우측 패널 대신 구글맵식 바텀시트(드래그로 확장)를 쓴다.
  const [isMobile, setIsMobile] = useState(false)
  // 모바일 접이식 툴바 상태
  const [expanded, setExpanded] = useState(false)

  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [savedOccCodes, setSavedOccCodes] = useState<Set<string>>(new Set())
  const [savedUnivSlugs, setSavedUnivSlugs] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user) { setSavedOccCodes(new Set()); setSavedUnivSlugs(new Set()); return }
    supabase
      .from("saved_occupations")
      .select("occ_code")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setSavedOccCodes(new Set(data.map((r) => r.occ_code)))
      })
    supabase
      .from("saved_universities")
      .select("univ_slug")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setSavedUnivSlugs(new Set(data.map((r) => r.univ_slug)))
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const toggleSaveOcc = async (occCode: string, occTitle: string) => {
    if (!user) { window.location.href = "/login"; return }
    const isSaved = savedOccCodes.has(occCode)
    if (isSaved) {
      await supabase
        .from("saved_occupations")
        .delete()
        .eq("user_id", user.id)
        .eq("occ_code", occCode)
      setSavedOccCodes((prev) => { const next = new Set(prev); next.delete(occCode); return next })
    } else {
      await supabase.from("saved_occupations").upsert({
        user_id: user.id,
        occ_code: occCode,
        occ_title: occTitle,
        country: activeCountry ?? "",
      })
      setSavedOccCodes((prev) => new Set(prev).add(occCode))
    }
  }

  const toggleSaveUniv = async (slug: string, name: string) => {
    if (!user) { window.location.href = "/login"; return }
    const isSaved = savedUnivSlugs.has(slug)
    if (isSaved) {
      await supabase
        .from("saved_universities")
        .delete()
        .eq("user_id", user.id)
        .eq("univ_slug", slug)
      setSavedUnivSlugs((prev) => { const next = new Set(prev); next.delete(slug); return next })
    } else {
      await supabase.from("saved_universities").upsert({
        user_id: user.id,
        univ_slug: slug,
        univ_name: name,
      })
      setSavedUnivSlugs((prev) => new Set(prev).add(slug))
    }
  }

  const shareUniv = (slug: string) => {
    if (!selectedUniv) return
    const country = "college_id" in selectedUniv ? "us" : "qs_rank" in selectedUniv ? "ca" : "au"
    const shareUrl = `${window.location.origin}/map/${country}/university/${slug}`
    if (navigator.share) {
      navigator.share({ url: shareUrl })
    } else {
      navigator.clipboard.writeText(shareUrl)
    }
  }

  const shareOcc = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("country", activeCountry?.toLowerCase() ?? "au")
    if (selected) url.searchParams.set("state", selected)
    const shareUrl = url.toString()
    if (navigator.share) {
      navigator.share({ url: shareUrl })
    } else {
      navigator.clipboard.writeText(shareUrl)
    }
  }

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // 페이지가 정적(force-static)이므로 ?country=au&state=NSW&tab=pay 딥링크는 서버가 아니라
  // 여기서 마운트 후 읽어 반영한다. 전용 페이지(/map/au/employment/nsw 등)에서 initialState /
  // initialTab prop이 넘어오면 URL searchParams보다 우선한다.
  useEffect(() => {
    if (initialState) {
      setActiveCountry("AU")
      setSelected(initialState)
      if (initialTab) setTab(initialTab)
      if (initialSA4) initialSA4Ref.current = initialSA4
      return
    }
    const p = new URLSearchParams(window.location.search)
    const countryRaw = p.get("country")?.toLowerCase()
    const raw = p.get("state")?.toUpperCase()
    if (countryRaw === "us") {
      setActiveCountry("US")
      if (raw && (US_STATE_CODES as readonly string[]).includes(raw)) setSelected(raw)
    } else if (countryRaw === "au" && raw && ((STATE_CODES as readonly string[]).includes(raw) || raw === "WHV")) {
      setActiveCountry("AU")
      setSelected(raw)
      if (raw === "WHV") setTab("whv")
    } else if (countryRaw === "ie") {
      setActiveCountry("IE")
    } else if (countryRaw === "uk" && raw && (UK_REGION_CODES as readonly string[]).includes(raw)) {
      setActiveCountry("UK")
      setSelected(raw)
    }
    const tabParam = p.get("tab")
    if (tabParam === "pay") setTab("pay")
    else if (tabParam === "employment") setTab("employment")
    else if (tabParam === "whv") setTab("whv")
  }, [initialState, initialTab])

  useEffect(() => {
    if (!selected || neroFetched.current) return
    neroFetched.current = true
    fetch("/nero-sa4.json")
      .then((r) => r.json())
      .then((d: NeroData) => setNeroData(d))
      .catch(() => {})
  }, [selected])

  useEffect(() => {
    if (!selected || regionFetched.current) return
    regionFetched.current = true
    fetch("/region-occupations.json")
      .then((r) => r.json())
      .then((d: RegionOccData) => setRegionData(d))
      .catch(() => {})
  }, [selected])

  const [ieSchools, setIeSchools] = useState<Array<{
    id: number; slug: string; name_en: string; name_ko: string | null;
    city: string; lat: number | null; lng: number | null;
    price_range_week: string | null; accreditation: string[] | null;
    description_ko: string | null;
  }> | null>(null)

  useEffect(() => {
    if (activeCountry !== "IE") { setIeSchools(null); return }
    fetch("/api/ie/language-schools")
      .then((r) => r.json())
      .then((d) => setIeSchools(d.schools ?? []))
      .catch(() => setIeSchools([]))
  }, [activeCountry])

  useEffect(() => {
    setSelectedSA4(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // initialSA4 prop → selectedSA4 (selected-clear effect 이후에 적용)
  useEffect(() => {
    if (initialSA4Ref.current && selected) {
      const code = initialSA4Ref.current
      initialSA4Ref.current = null
      const regions = Object.values(SA4_BY_STATE).flat()
      const region = regions.find((r) => r.code === code) ?? null
      if (region) setSelectedSA4(region)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // occ(직업 코드) URL 파라미터 ↔ state 동기화.
  // 최초 마운트 시 URL의 ?occ=… 를 읽어 자동 선택하고,
  // 이후 state가 바뀌면 URL을 갱신한다.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const urlOcc = p.get("occ") ?? null
    const stateOcc = selectedOccCode ?? selectedUsOcc?.occ_code ?? null

    // URL → state (최초 1회)
    if (!initialOccLoaded.current && urlOcc && !stateOcc && activeCountry && selected) {
      initialOccLoaded.current = true
      if (activeCountry === "AU") {
        if (data.auOccupations[urlOcc]) setSelectedOccCode(urlOcc)
      } else {
        const occ = data.usShortageByState[selected]?.find((o) => o.occ_code === urlOcc) ?? null
        if (occ) setSelectedUsOcc(occ)
      }
      return
    }

    // occ가 없는 URL → 초기 적재 완료로 표시
    if (!initialOccLoaded.current && !urlOcc) {
      initialOccLoaded.current = true
    }

    // state → URL (동기화)
    if (initialOccLoaded.current && stateOcc !== urlOcc) {
      if (stateOcc) {
        p.set("occ", stateOcc)
      } else {
        p.delete("occ")
      }
      window.history.replaceState(null, "", `?${p.toString()}`)
    }
  }, [selectedOccCode, selectedUsOcc, activeCountry, selected, data])

  // nero(NERO 고용 코드) URL 파라미터 ↔ state 동기화.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const urlNero = p.get("nero") ?? null

    if (!initialNeroLoaded.current && urlNero && tab === "employment") {
      initialNeroLoaded.current = true
      setSelectedNeroA4(urlNero)
      return
    }

    if (!initialNeroLoaded.current && !urlNero) {
      initialNeroLoaded.current = true
    }

    if (!initialNeroLoaded.current) return

    if (tab === "employment") {
      if (selectedNeroA4 !== urlNero) {
        if (selectedNeroA4) {
          p.set("nero", selectedNeroA4)
        } else {
          p.delete("nero")
        }
        window.history.replaceState(null, "", `?${p.toString()}`)
      }
    } else if (urlNero) {
      p.delete("nero")
      window.history.replaceState(null, "", `?${p.toString()}`)
    }
  }, [selectedNeroA4, tab])

  // region(WHV 지역 코드) URL 파라미터 ↔ state 동기화.
  const regionInitialLoaded = useRef(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const urlRegion = p.get("region") ?? null
    const regionCode = selectedSA4?.code ?? null

    if (!regionInitialLoaded.current && urlRegion && tab === "whv") {
      regionInitialLoaded.current = true
      const regions = Object.values(SA4_BY_STATE).flat()
      const region = regions.find((r) => r.code === urlRegion) ?? null
      if (region) setSelectedSA4(region)
      return
    }

    if (!regionInitialLoaded.current && !urlRegion) {
      regionInitialLoaded.current = true
    }

    if (!regionInitialLoaded.current) return

    if (tab === "whv") {
      if (regionCode !== urlRegion) {
        if (regionCode) {
          p.set("region", regionCode)
        } else {
          p.delete("region")
        }
        window.history.replaceState(null, "", `?${p.toString()}`)
      }
    } else if (urlRegion) {
      p.delete("region")
      window.history.replaceState(null, "", `?${p.toString()}`)
    }
  }, [selectedSA4, tab])

  const onSelectSA4 = useCallback((code: string) => {
    const regions = selected && selected !== "WHV"
      ? SA4_BY_STATE[selected as StateCode] ?? []
      : Object.values(SA4_BY_STATE).flat()
    const region = regions.find((r) => r.code === code) ?? null
    setSelectedSA4(region)
    if (region) track("select_region", { state: selected ?? "", region: region.name })
  }, [selected])

  const onSelectState = useCallback((s: string) => {
    setSelected(s)
    if (s === "WHV") setTab("whv")
    else if (activeCountry === "US") setTab("stateInfo")
    else if (activeCountry === "UK") setTab("stateInfo")
    track("select_state", { country: activeCountry ?? "AU", state: s })
  }, [activeCountry])

  const onSelectCountry = useCallback((country: "AU" | "US" | "CA" | "IE" | "UK") => {
    setActiveCountry(country)
    setSelected(null)
    setSelectedSA4(null)
  }, [])

  // When a US state is already selected and country changes to US, switch to stateInfo
  useEffect(() => {
    if (activeCountry === "US" && selected) setTab("stateInfo")
  }, [activeCountry, selected])

  // UK has no shortage tab — reset to pay if needed
  useEffect(() => {
    if (activeCountry === "UK" && tab === "shortage") setTab("pay")
  }, [activeCountry, tab])

  // Handle initialUniversity prop — find the college and show its info
  useEffect(() => {
    if (!initialUniversity) return
    const usUniv = data.usRankedColleges.find((c) => c.slug === initialUniversity)
    if (usUniv) {
      setSelectedUniv(usUniv)
      setActiveCountry("US")
      setSelected(usUniv.college_state)
      return
    }
    const auUniv = data.auRankedColleges.find((c) => c.slug === initialUniversity)
    if (auUniv) {
      setSelectedUniv(auUniv)
      setActiveCountry("AU")
      setSelected(auUniv.college_state)
      return
    }
    const caUniv = data.caColleges.find((c) => c.slug === initialUniversity)
    if (caUniv) {
      setSelectedUniv(caUniv)
      setActiveCountry("CA")
      setSelected(caUniv.province)
    }
  }, [initialUniversity, data.usRankedColleges, data.auRankedColleges, data.caColleges])

  const onReset = useCallback(() => {
    if (selected !== null) {
      setSelected(null)
      setSelectedSA4(null)
      setTab("shortage")
    } else if (activeCountry !== null) {
      setActiveCountry(null)
      setIeSchools(null)
    }
  }, [selected, activeCountry])

  const onClosePanel = useCallback(() => {
    if (selectedUniv) {
      setSelectedUniv(null)
      return
    }
    const hadDetail = selectedOccCode !== null || selectedUsOcc !== null || selectedNeroA4 !== null
    if (hadDetail) {
      setSelectedOccCode(null)
      setSelectedUsOcc(null)
      setSelectedNeroA4(null)
    }
    if (isMobile) {
      setExpanded(false)
    } else if (!hadDetail) {
      onReset()
    }
  }, [selectedUniv, selectedOccCode, selectedUsOcc, selectedNeroA4, isMobile, onReset])

  const stateItems = useMemo(() => ({
    ...STATE_NAMES,
    WHV: "Second Visa",
  } as Record<string, string>), [])

  const auShortageItems = useMemo<Record<string, string>>(() => {
    if (!selected) return {}
    const occs = data.shortageByState[selected as StateCode] ?? []
    return Object.fromEntries(
      occs.map((o) => [
        o.anzsco_code,
        `${o.occupation_en}${o.median_salary_aud != null ? ` · $${o.median_salary_aud.toLocaleString()}` : ""}`,
      ]),
    )
  }, [data.shortageByState, selected])

  const usShortageItems = useMemo<Record<string, string>>(() => {
    if (!selected) return {}
    const occs = data.usShortageByState[selected] ?? []
    return Object.fromEntries(
      occs.map((o) => [
        o.occ_code,
        `${o.occ_title}${o.median_wage != null ? ` · $${o.median_wage.toLocaleString()}` : ""}`,
      ]),
    )
  }, [data.usShortageByState, selected])

  const caShortageItems = useMemo<Record<string, string>>(() => {
    const occs = selected ? Object.values(data.caOccupations).filter((o) => o.occupation_en) : []
    return Object.fromEntries(
      occs.map((o) => [
        o.noc_code,
        `${o.occupation_en}${o.median_salary_cad != null ? ` · C$${o.median_salary_cad.toLocaleString()}` : ""}`,
      ]),
    )
  }, [data.caOccupations, selected])

  const ukShortageItems = useMemo<Record<string, string>>(() => {
    if (!selected) return {}
    const occs = data.ukShortageByRegion[selected] ?? []
    return Object.fromEntries(
      occs.map((o) => [
        o.soc_code,
        `${o.occupation_en}${o.median_salary_gbp != null ? ` · £${o.median_salary_gbp.toLocaleString()}` : ""}`,
      ]),
    )
  }, [data.ukShortageByRegion, selected])

  const filteredIESchools = useMemo(() => {
    if (!ieSchools) return null
    if (!selected || activeCountry !== "IE") return ieSchools
    return ieSchools.filter((s) => IE_CITY_TO_COUNTY[s.city] === selected)
  }, [ieSchools, selected, activeCountry])

  const countryLabel = activeCountry === "AU" ? "🇦🇺 Australia" : activeCountry === "US" ? "🇺🇸 United States" : activeCountry === "CA" ? "🇨🇦 Canada" : activeCountry === "IE" ? "🇮🇪 Ireland" : activeCountry === "UK" ? "🇬🇧 United Kingdom" : ""
  const stateLabel = selected
    ? activeCountry === "AU"
      ? STATE_NAMES[selected as StateCode]
      : activeCountry === "CA"
        ? CA_PROVINCE_NAMES[selected] ?? selected
        : activeCountry === "IE"
          ? IE_COUNTY_NAMES[selected] ?? selected
          : activeCountry === "UK"
            ? UK_REGION_NAMES[selected] ?? selected
            : US_STATE_NAMES[selected]
    : ""
  const occLabel = selectedOccCode
    ? activeCountry === "AU"
      ? data.shortageByState[selected as StateCode]?.find((o) => o.anzsco_code === selectedOccCode)?.occupation_en
      : activeCountry === "CA"
        ? data.caOccupations[selectedOccCode]?.occupation_en
        : selectedUsOcc?.occ_title
    : ""
  const toolbarSummary = [countryLabel, stateLabel, occLabel].filter(Boolean).join(" · ")

  const toolbarExpanded = !isMobile || expanded

  return (
    <div className="flex h-full w-full flex-col">
      {(activeCountry === "AU" || activeCountry === "US" || activeCountry === "CA" || activeCountry === "IE" || activeCountry === "UK") && (
      <>
        {!toolbarExpanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex w-full items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700"
          >
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{toolbarSummary || t.map.selectCountryPlaceholder}</span>
            <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
          </button>
        )}

        {toolbarExpanded && (
      <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.map.selectCountry}</span>
          <Select
            items={{ AU: "🇦🇺 Australia", US: "🇺🇸 United States", CA: "🇨🇦 Canada", IE: "🇮🇪 Ireland", UK: "🇬🇧 United Kingdom" }}
            value={activeCountry ?? undefined}
            onValueChange={(v) => v && onSelectCountry(v as "AU" | "US" | "CA" | "IE" | "UK")}
          >
            <SelectTrigger className="h-10 w-44 rounded-lg border-slate-200 text-sm">
              <SelectValue placeholder={t.map.selectCountryPlaceholder} />
            </SelectTrigger>
            <SelectContent className="z-[2000]">
              <SelectItem value="AU">🇦🇺 Australia</SelectItem>
              <SelectItem value="US">🇺🇸 United States</SelectItem>
              <SelectItem value="CA">🇨🇦 Canada</SelectItem>
              <SelectItem value="IE">🇮🇪 Ireland</SelectItem>
              <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </label>

        {activeCountry === "UK" ? (
          <>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Region</span>
            <Select
              items={UK_REGION_NAMES}
              value={selected}
              onValueChange={(v) => v && setSelected(v)}
            >
              <SelectTrigger className="h-10 w-56 rounded-lg border-slate-200 text-sm">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent className="z-[2000]">
                {UK_REGION_CODES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {UK_REGION_NAMES[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          {selected && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">{t.map.selectOccupation}</span>
              <Select
                items={ukShortageItems}
                value={selectedOccCode ?? null}
                onValueChange={(v) => {
                  if (!v) return
                  setSelectedOccCode(v)
                  if (isMobile) setExpanded(false)
                }}
              >
                <SelectTrigger className="h-10 w-72 rounded-lg border-slate-200 text-sm">
                  <SelectValue placeholder={t.map.selectStatePlaceholder} />
                </SelectTrigger>
                <SelectContent className="z-[2000] max-h-72">
                  {(data.ukShortageByRegion[selected] ?? []).map((occ) => {
                    const code = occ.soc_code
                    const title = occ.occupation_en
                    const salary = occ.median_salary_gbp
                    return (
                      <SelectItem key={code} value={code}>
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate">{title}</span>
                          {salary != null && (
                            <span className="shrink-0 text-xs text-slate-400">
                              £{salary.toLocaleString()}
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </label>
          )}
          </>
        ) : activeCountry === "IE" ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">County</span>
            <Select
              items={IE_COUNTY_NAMES}
              value={selected}
              onValueChange={(v) => v && setSelected(v)}
            >
              <SelectTrigger className="h-10 w-56 rounded-lg border-slate-200 text-sm">
                <SelectValue placeholder="Select a county" />
              </SelectTrigger>
              <SelectContent className="z-[2000]">
                {IE_COUNTY_CODES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {IE_COUNTY_NAMES[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        ) : (
        <>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">{t.map.selectState}</span>
            <Select
              items={activeCountry === "AU" ? stateItems : activeCountry === "CA" ? CA_PROVINCE_NAMES : US_STATE_NAMES}
              value={selected}
              onValueChange={(v) => {
                if (!v) return
                if (activeCountry === "AU") onSelectState(v)
                else setSelected(v)
              }}
            >
              <SelectTrigger className="h-10 w-56 rounded-lg border-slate-200 text-sm">
                <SelectValue placeholder={t.map.selectStatePlaceholder} />
              </SelectTrigger>
              <SelectContent className="z-[2000]">
                {(activeCountry === "AU" ? STATE_CODES : activeCountry === "CA" ? CA_PROVINCE_CODES : US_STATE_CODES).map((c) => (
                  <SelectItem key={c} value={c}>
                    {activeCountry === "AU" ? STATE_NAMES[c as StateCode] : activeCountry === "CA" ? CA_PROVINCE_NAMES[c] : US_STATE_NAMES[c]}
                  </SelectItem>
                ))}
                {activeCountry === "AU" && (
                  <SelectItem value="WHV">Second Visa</SelectItem>
                )}
              </SelectContent>
            </Select>
          </label>

          {selected !== "WHV" && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">{t.map.selectOccupation}</span>
              {selected ? (
                <Select
                  items={activeCountry === "AU" ? auShortageItems : activeCountry === "CA" ? caShortageItems : usShortageItems}
                  value={activeCountry === "US" && selectedUsOcc ? selectedUsOcc.occ_code : selectedOccCode ?? null}
                  onValueChange={(v) => {
                    if (!v) return
                    if (activeCountry === "AU") setSelectedOccCode(v)
                    else if (activeCountry === "CA") setSelectedOccCode(v)
                    else {
                      const occ = data.usShortageByState[selected]?.find((o) => o.occ_code === v) ?? null
                      setSelectedUsOcc(occ)
                    }
                    if (isMobile) setExpanded(false)
                  }}
                >
                  <SelectTrigger className="h-10 w-72 rounded-lg border-slate-200 text-sm">
                    <SelectValue placeholder={t.map.selectStatePlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="z-[2000] max-h-72">
                    {(activeCountry === "AU"
                      ? data.shortageByState[selected as StateCode] ?? []
                      : activeCountry === "CA"
                        ? Object.values(data.caOccupations)
                        : data.usShortageByState[selected] ?? []
                    ).map((occ) => {
                      const code = activeCountry === "AU" ? (occ as StateOccupation).anzsco_code : activeCountry === "CA" ? (occ as CAOccRow).noc_code : (occ as USOccupation).occ_code
                      const title = activeCountry === "AU" ? (occ as StateOccupation).occupation_en : activeCountry === "CA" ? (occ as CAOccRow).occupation_en : (occ as USOccupation).occ_title
                      const salary = activeCountry === "AU" ? (occ as StateOccupation).median_salary_aud : activeCountry === "CA" ? (occ as CAOccRow).median_salary_cad : (occ as USOccupation).median_wage
                      return (
                        <SelectItem key={code} value={code}>
                          <span className="flex items-center justify-between gap-3">
                            <span className="truncate">{title}</span>
                            {salary != null && (
                              <span className="shrink-0 text-xs text-slate-400">
                                {activeCountry === "CA" ? "C$" : "$"}{salary.toLocaleString()}
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex h-10 w-72 cursor-not-allowed items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
                  {t.map.selectStateFirst}
                </div>
              )}
            </label>
          )}
        </>
        )}

        {isMobile && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
          >
            <ChevronUp className="h-5 w-5 text-slate-400" />
          </button>
        )}

        {selected && (
          <button
            type="button"
            onClick={onReset}
            className="mb-0.5 inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t.map.reset}
          </button>
        )}
      </div>
      )}
    </>
    )}

      <div className="relative min-h-0 flex-1">
        <LeafletMap
          data={data}
          selected={selected}
          selectedSA4={activeCountry === "AU" ? selectedSA4 : null}
          activeCountry={activeCountry}
          ieSchools={filteredIESchools ?? undefined}
          onSelectState={onSelectState}
          onSelectCountry={onSelectCountry}
          onSelectSA4={onSelectSA4}
          onSelectUniversity={(slug: string) => {
            const usUniv = data.usRankedColleges.find((c) => c.slug === slug)
            if (usUniv) {
              setSelectedUniv(usUniv)
              setActiveCountry("US")
              setSelected(usUniv.college_state)
              return
            }
            const auUniv = data.auRankedColleges.find((c) => c.slug === slug)
            if (auUniv) {
              setSelectedUniv(auUniv)
              setActiveCountry("AU")
              setSelected(auUniv.college_state)
              return
            }
            const caUniv = data.caColleges.find((c) => c.slug === slug)
            if (caUniv) {
              setSelectedUniv(caUniv)
              setActiveCountry("CA")
              setSelected(caUniv.province)
              return
            }
            const ukUniv = data.ukColleges.find((c) => c.slug === slug)
            if (ukUniv) {
              setSelectedUniv(ukUniv)
              setActiveCountry("UK")
              setSelected(ukUniv.region)
            }
          }}
          onReset={onReset}
          tab={tab}
        />

        {(selected || activeCountry === "IE" || activeCountry === "UK" || selectedUniv) && (() => {
          const panel = selectedUniv ? (
            <UniversityInfoCard
              college={selectedUniv}
              onClose={() => setSelectedUniv(null)}
              isSaved={savedUnivSlugs.has(selectedUniv.slug)}
              onToggleSave={toggleSaveUniv}
              onShare={shareUniv}
            />
          ) : activeCountry === "IE" ? (
            <IEPanel
              schools={filteredIESchools}
              countyName={selected ? stateLabel : undefined}
              onClose={onClosePanel}
            />
          ) : (
            <Panel
              data={data}
              selected={selected!}
              selectedSA4={activeCountry === "AU" ? selectedSA4 : null}
              tab={tab}
              onTab={setTab}
              onClose={onClosePanel}
              neroData={activeCountry === "AU" ? neroData : null}
              regionData={activeCountry === "AU" ? regionData : null}
              activeCountry={activeCountry}
              selectedOccCode={selectedOccCode}
              setSelectedOccCode={setSelectedOccCode}
              selectedUsOcc={selectedUsOcc}
              setSelectedUsOcc={setSelectedUsOcc}
              savedOccCodes={savedOccCodes}
              onToggleSave={toggleSaveOcc}
              onShare={shareOcc}
              selectedNeroA4={selectedNeroA4}
              setSelectedNeroA4={setSelectedNeroA4}
            />
          )
          return isMobile ? (
            <MobileSheet>{panel}</MobileSheet>
          ) : (
            <div className="absolute right-4 top-4 z-[1000] flex max-h-[calc(100%-2rem)] w-[380px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              {panel}
            </div>
          )
        })()}
      </div>
    </div>
  )
}



function Panel({
  data,
  selected,
  selectedSA4,
  tab,
  onTab,
  onClose,
  neroData,
  regionData,
  activeCountry,
  selectedOccCode,
  setSelectedOccCode,
  selectedUsOcc,
  setSelectedUsOcc,
  savedOccCodes,
  onToggleSave,
  onShare,
  selectedNeroA4,
  setSelectedNeroA4,
}: {
  data: MapData
  selected: string
  selectedSA4: SA4Region | null
  tab: Tab
  onTab: (t: Tab) => void
  onClose: () => void
  neroData: Record<string, NeroOccupation[]> | null
  regionData: RegionOccData | null
  activeCountry: "AU" | "US" | "CA" | "UK" | null
  selectedOccCode: string | null
  setSelectedOccCode: (code: string | null) => void
  selectedUsOcc: USOccupation | null
  setSelectedUsOcc: (occ: USOccupation | null) => void
  savedOccCodes: Set<string>
  onToggleSave: (occCode: string, occTitle: string) => void
  onShare: () => void
  selectedNeroA4: string | null
  setSelectedNeroA4: (a4: string | null) => void
}) {
  const t = useTranslations()
  const locale = useLocale()
  const isAU = activeCountry === "AU"
  const isUS = activeCountry === "US"
  const isUK = activeCountry === "UK"
  const isWhv = selected === "WHV"
  const stateName = isWhv ? "Second Visa"
    : isAU ? STATE_NAMES[selected as StateCode] ?? selected
    : activeCountry === "CA" ? CA_PROVINCE_NAMES[selected] ?? selected
    : isUK ? UK_REGION_NAMES[selected] ?? selected
    : US_STATE_NAMES[selected] ?? selected

  const auShortage = isAU ? (data.shortageByState[selected as StateCode] ?? []) : []
  const usShortage = isUS ? (data.usShortageByState[selected] ?? []) : []
  const usHighPay = isUS ? (data.usHighPayByState[selected] ?? []) : []
  const ukHighPay = isUK ? (data.ukHighPayByRegion[selected] ?? []) : []
  const panelSa4Regions = isAU
    ? isWhv
      ? Object.values(SA4_BY_STATE).flat()
      : SA4_BY_STATE[selected as StateCode] ?? []
    : []

  const occ = selectedOccCode && !isUK ? data.auOccupations[selectedOccCode] : null
  const stateShortages = selectedOccCode ? data.auStateShortages[selectedOccCode] ?? [] : []
  const caProvinceShortages = selectedOccCode ? data.caProvinceShortages[selectedOccCode] ?? [] : []

  // 일부 ANZSCO 코드가 occupations_au 테이블에 없어 occ가 null인 경우
  // shortageByState(occupation_state_au 기반)에서 직업 데이터를 찾아 fallback OccRow 생성
  const allOccupations = useMemo(
    () => Object.values(data.auOccupations).filter((o) => o.anzsco_code != null && o.median_salary_aud != null),
    [data.auOccupations],
  )

  const resolvedOcc = useMemo<OccRow | null>(() => {
    if (isUK || !selectedOccCode || !isAU) return null
    if (occ) return occ
    const fallback = (data.shortageByState[selected as StateCode] ?? []).find(
      (s) => s.anzsco_code === selectedOccCode,
    )
    if (!fallback) return null
    return {
      anzsco_code: fallback.anzsco_code,
      anzsco_v13: fallback.anzsco_v13,
      occupation_en: fallback.occupation_en,
      occupation_ko: fallback.occupation_ko,
      shortage_rating: null,
      median_salary_aud: fallback.median_salary_aud,
      on_csol: fallback.on_csol,
      confidence: fallback.confidence,
      related_broad_field: null,
      pr_note_ko: null,
      source_name: null,
      source_url: null,
      last_verified: null,
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occ, selectedOccCode, isAU, selected])

  const resolvedCAOcc = useMemo<CAOccRow | null>(() => {
    if (!selectedOccCode || activeCountry !== "CA") return null
    return data.caOccupations[selectedOccCode] ?? null
  }, [selectedOccCode, activeCountry, data.caOccupations])

  const resolvedUKOcc = useMemo<UKOccRow | null>(() => {
    if (!selectedOccCode || activeCountry !== "UK") return null
    return data.ukOccupations[selectedOccCode] ?? null
  }, [selectedOccCode, activeCountry, data.ukOccupations])

  const handleSelectOcc = (code: string) => {
    const name = data.auOccupations[code]?.occupation_en ?? code
    track("click_occupation", { type: "au", code, name, state: selected })
    setSelectedOccCode(code)
  }
  const handleUSSelectOcc = (occ: USOccupation) => {
    track("click_occupation", { type: "us", code: occ.occ_code, name: occ.occ_title, state: selected })
    setSelectedUsOcc(occ)
  }
  const handleSelectCAOcc = (code: string) => {
    const name = data.caOccupations[code]?.occupation_en ?? code
    track("click_occupation", { type: "ca", code, name, province: selected })
    setSelectedOccCode(code)
  }
  const handleSelectUKOcc = (code: string) => {
    const name = data.ukOccupations[code]?.occupation_en ?? code
    track("click_occupation", { type: "uk", code, name, region: selected })
    setSelectedOccCode(code)
  }
  const handleBack = () => setSelectedOccCode(null)
  const handleBackNero = () => setSelectedNeroA4(null)

  if (selectedUsOcc) {
    return (
      <USOccupationDetail
        occ={selectedUsOcc}
        stateName={stateName}
        stateCode={selected}
        colleges={data.usColleges}
        onBack={() => setSelectedUsOcc(null)}
        onClose={onClose}
        t={t}
        savedOccCodes={savedOccCodes}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    )
  }

  if (selectedOccCode && resolvedCAOcc) {
    return (
      <CAOccupationDetail
        occ={resolvedCAOcc}
        provinceShortages={caProvinceShortages}
        currentProvince={selected}
        onBack={handleBack}
        onClose={onClose}
        t={t}
        savedOccCodes={savedOccCodes}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    )
  }

  if (selectedOccCode && resolvedUKOcc) {
    return (
      <UKOccupationDetail
        occ={resolvedUKOcc}
        regionName={stateName}
        onBack={handleBack}
        onClose={onClose}
        savedOccCodes={savedOccCodes}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    )
  }

  if (selectedOccCode && resolvedOcc) {
    return (
      <OccupationDetail
        occ={resolvedOcc}
        stateShortages={stateShortages}
        onBack={handleBack}
        onClose={onClose}
        t={t}
        currentState={selected as StateCode}
        data={data}
        savedOccCodes={savedOccCodes}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    )
  }

  if (selectedNeroA4 && neroData && isAU) {
    return (
      <NeroOccupationDetail
        a4={selectedNeroA4}
        stateCode={selected as StateCode}
        neroData={neroData}
        sa4Regions={panelSa4Regions}
        auOccupations={data.auOccupations}
        stateSalaryMult={data.stateSalaryMult}
        coursesByFieldState={data.coursesByFieldState}
        onBack={handleBackNero}
        onClose={onClose}
        t={t}
        savedOccCodes={savedOccCodes}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    )
  }

  return (
    <>
      <div className="flex items-start justify-between gap-2 px-5 pt-4">
        <div>
          <h2 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">
            {selectedSA4 ? selectedSA4.name : stateName}
          </h2>
          {selectedSA4 && isAU && !isWhv && (
            <p className="text-xs text-slate-400">{STATE_NAMES[selected as StateCode]}</p>
          )}
          {selectedSA4 && isWhv && (
            <p className="text-xs text-slate-400">Second Visa · Australia</p>
          )}
          {!selectedSA4 && isWhv && (
            <p className="text-xs text-slate-400">{locale === "ko" ? "전국 지도 — 지역을 클릭하면 상세 정보를 볼 수 있습니다" : "National view — click a region for details"}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!isWhv && (
      <div className="px-5 pt-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-sm">
          {(isUS || activeCountry === "CA" || isUK) && (
            <TabButton active={tab === "stateInfo"} onClick={() => { onTab("stateInfo"); track("switch_tab", { tab: "stateInfo", state: selected }) }}>
              {activeCountry === "CA" ? "State Info" : t.map.tabStateInfo}
            </TabButton>
          )}
          {!isUK && (
            <TabButton active={tab === "shortage"} onClick={() => { onTab("shortage"); track("switch_tab", { tab: "shortage", state: selected }) }}>
              {t.map.tabShortage}
            </TabButton>
          )}
          <TabButton active={tab === "pay"} onClick={() => { onTab("pay"); track("switch_tab", { tab: "pay", state: selected }) }}>
            {t.map.tabPay}
          </TabButton>
          {isAU && (
            <TabButton active={tab === "employment"} onClick={() => { onTab("employment"); track("switch_tab", { tab: "employment", state: selected }) }}>
              {t.map.tabEmployment}
            </TabButton>
          )}
          {isAU && (
            <TabButton active={tab === "whv"} onClick={() => { onTab("whv"); track("switch_tab", { tab: "whv", state: selected }) }}>
              {t.map.tabWhv}
            </TabButton>
          )}
        </div>
      </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {tab === "stateInfo" && isUS && (
          <StateInfoPanel
            stateInfo={data.usStateInfo[selected] ?? null}
            majors={data.usMajorDensity[selected] ?? []}
          />
        )}
        {tab === "stateInfo" && activeCountry === "CA" && (
          <div className="space-y-5">
            <CACitiesPanel
              cities={data.caCities}
              province={selected}
            />
            <CACollegesPanel
              colleges={data.caColleges}
              province={selected}
            />
          </div>
        )}
        {tab === "stateInfo" && isUK && (
          <div className="space-y-5">
            <UKCitiesPanel
              cities={data.ukCities}
              region={selected}
            />
            <UKCollegesPanel
              colleges={data.ukColleges}
              region={selected}
            />
          </div>
        )}
        {tab === "shortage" && isAU && (
          selectedSA4 ? (
            <RegionGroupList
              kind="demand"
              key={selectedSA4.code}
              entry={regionData?.[selectedSA4.code]}
              occupations={auShortage}
              allOccupations={allOccupations}
              onSelectOcc={handleSelectOcc}
              selected={selected as StateCode}
              stateSalaryMult={data.stateSalaryMult}
              highPay={data.highPay}
              t={t}
            />
          ) : (
            <ShortageList rows={auShortage} onSelectOcc={handleSelectOcc} />
          )
        )}
        {tab === "shortage" && isUS && <USShortageList rows={usShortage} onSelectOcc={handleUSSelectOcc} />}
        {tab === "shortage" && !isAU && !isUS && activeCountry !== "CA" && activeCountry !== "UK" && <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>}
        {tab === "shortage" && activeCountry === "CA" && <CAShortageList rows={Object.values(data.caOccupations)} onSelectOcc={handleSelectCAOcc} />}
        {tab === "pay" && isAU && (
          selectedSA4 ? (
            <RegionGroupList
              kind="pay"
              key={selectedSA4.code}
              entry={regionData?.[selectedSA4.code]}
              occupations={auShortage}
              allOccupations={allOccupations}
              onSelectOcc={handleSelectOcc}
              selected={selected as StateCode}
              stateSalaryMult={data.stateSalaryMult}
              highPay={data.highPay}
              t={t}
            />
          ) : (
            <HighPayList
              rows={data.highPay}
              stateRows={auShortage}
              selected={selected as StateCode}
              stateSalaryMult={data.stateSalaryMult}
              onSelectOcc={handleSelectOcc}
            />
          )
        )}
        {tab === "pay" && isUS && <USHighPayList rows={usHighPay} onSelectOcc={handleUSSelectOcc} />}
        {tab === "pay" && !isAU && !isUS && activeCountry !== "CA" && activeCountry !== "UK" && <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>}
        {tab === "pay" && activeCountry === "CA" && <CAHighPayList rows={data.caHighPay} provinceRows={selected ? data.caHighPayByProvince[selected] ?? [] : []} onSelectOcc={handleSelectCAOcc} />}
        {tab === "pay" && isUK && <UKHighPayList rows={ukHighPay} onSelectOcc={handleSelectUKOcc} />}
        {tab === "employment" && (
          <EmploymentList
            sa4={selectedSA4}
            stateCode={isAU ? (selected as StateCode) : null}
            sa4Regions={panelSa4Regions}
            neroData={neroData}
            onSelectNero={(a4) => setSelectedNeroA4(a4)}
          />
        )}
        {tab === "whv" && isAU && (
          <WHVPanel
            selectedSA4={selectedSA4}
            selected={selected as StateCode}
            sa4Regions={panelSa4Regions}
            onToggleSave={onToggleSave}
            onShare={onShare}
            savedOccCodes={savedOccCodes}
          />
        )}
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        {t.map.source}
      </p>
    </>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 font-medium transition-colors",
        active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
      )}
    >
      {children}
    </button>
  )
}

// 모바일 바텀시트 — 구글맵 모바일처럼 손잡이를 위/아래로 끌어 높이를 조절한다.
// 스냅: peek(맵을 넓게) · 기본(절반) · full(화면 거의 전체). 콘텐츠 영역은 따로 스크롤.
function MobileSheet({ children }: { children: React.ReactNode }) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const liveH = useRef(0)
  const drag = useRef<{ startY: number; startH: number } | null>(null)

  const snaps = useCallback(() => {
    const ph = sheetRef.current?.parentElement?.clientHeight ?? 640
    return {
      peek: Math.round(ph * 0.3),
      half: Math.round(ph * 0.62),
      full: Math.max(0, ph - 10),
    }
  }, [])

  useEffect(() => {
    const { half } = snaps()
    liveH.current = half
    setHeight(half)
    const onResize = () => {
      const { peek, full } = snaps()
      setHeight((h) => {
        const next = h == null ? snaps().half : Math.min(full, Math.max(peek, h))
        liveH.current = next
        return next
      })
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [snaps])

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, startH: sheetRef.current?.offsetHeight ?? liveH.current }
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const { peek, full } = snaps()
    const next = Math.min(full, Math.max(peek, drag.current.startH + (drag.current.startY - e.clientY)))
    liveH.current = next
    setHeight(next)
  }
  const endDrag = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    const { peek, half, full } = snaps()
    const h = liveH.current
    const nearest = [peek, half, full].reduce((a, b) => (Math.abs(b - h) < Math.abs(a - h) ? b : a))
    liveH.current = nearest
    setHeight(nearest)
  }

  return (
    <div
      ref={sheetRef}
      className={cn(
        "absolute inset-x-0 bottom-0 z-[1000] flex flex-col overflow-hidden rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-6px_24px_rgba(15,23,42,0.14)]",
        !dragging && "transition-[height] duration-200 ease-out",
      )}
      style={{ height: height ?? "55%" }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-1 active:cursor-grabbing"
      >
        <span className="h-1.5 w-10 rounded-full bg-slate-300" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

function ShortageList({
  rows,
  onSelectOcc,
  hint,
}: {
  rows: StateOccupation[]
  onSelectOcc: (code: string) => void
  hint?: string
}) {
  const t = useTranslations()
  const locale = useLocale()
  const [limit, setLimit] = useState(10)
  const visible = rows.slice(0, limit)
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {hint && <li className="mb-1 px-3 text-xs text-slate-400">{hint}</li>}
      {visible.map((r, i) => (
        <li key={r.anzsco_code}>
          <button
            type="button"
            onClick={() => onSelectOcc(r.anzsco_code)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {r.state_count === 1 && <Badge tone="blue">{t.map.regionalSpecific}</Badge>}
                {r.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
              </span>
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${r.state_shortage_rating >= 3 ? 100 : r.state_shortage_rating >= 2 ? 66 : 33}%` }}
                />
              </span>
            </span>
            <ShortageLabel rating={r.state_shortage_rating} />
          </button>
        </li>
      ))}
      {limit < rows.length && (
        <li>
          <button
            type="button"
            onClick={() => setLimit((p) => Math.min(p + 10, rows.length))}
            className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {locale === "ko" ? "더보기" : "Show more"} ({rows.length - limit})
          </button>
        </li>
      )}
    </ol>
  )
}

// fallback용: shortage 데이터 없이 occupations_au (salary 존재)에서 직접 가져온 목록
function DemandOnlyList({
  rows,
  onSelectOcc,
}: {
  rows: OccRow[]
  onSelectOcc: (code: string) => void
}) {
  const locale = useLocale()
  const [limit, setLimit] = useState(10)
  const visible = rows.slice(0, limit)
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">이 직업군에 해당하는 데이터가 없습니다.</p>
  }
  return (
    <div>
      <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 leading-relaxed">
        이 직군은 기술 이민(189/190/491) 부족직종에 포함되지 않습니다.
        {' '}고용주 스폰서(482 비자) 또는 워킹홀리데이 비자로 취업이 가능합니다.
      </p>
      <ol>
        {visible.map((r, i) => (
          <li key={r.anzsco_code}>
            <button
              type="button"
              onClick={() => onSelectOcc(r.anzsco_code!)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">
                  {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  {r.on_csol ? (
                    <Badge tone="amber">Employer Sponsored (482)</Badge>
                  ) : (
                    <Badge tone="blue">High Demand</Badge>
                  )}
                </span>
              </span>
              <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
                {r.median_salary_aud != null ? `$${(r.median_salary_aud / 1000).toFixed(0)}k` : ""}
              </span>
            </button>
          </li>
        ))}
        {limit < rows.length && (
          <li>
            <button
              type="button"
              onClick={() => setLimit((p) => Math.min(p + 10, rows.length))}
              className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              {locale === "ko" ? "더보기" : "Show more"} ({rows.length - limit})
            </button>
          </li>
        )}
      </ol>
    </div>
  )
}

// 지역(SA4) 부족/고소득 탭 — 보라색 분야(직업군) 막대 차트.
// 분야를 누르면 그 ANZSCO 2자리에 속한 주(state) 직종으로 펼쳐지고(부족=ShortageList, 고소득=HighPayList)
// 직업 클릭 시 상세 카드로 연결된다.
function RegionGroupList({
  kind,
  entry,
  occupations,
  allOccupations,
  onSelectOcc,
  selected,
  stateSalaryMult,
  highPay,
  t,
}: {
  kind: "demand" | "pay"
  entry: RegionEntry | undefined
  occupations: StateOccupation[]
  allOccupations: OccRow[]
  onSelectOcc: (code: string) => void
  selected: StateCode
  stateSalaryMult: StateSalaryMult
  highPay: HighPayOccupation[]
  t: ReturnType<typeof useTranslations>
}) {
  const [openGroup, setOpenGroup] = useState<RegionGroup | null>(null)
  const rows = (kind === "demand" ? entry?.demand : entry?.pay) ?? []
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.regionNoData}</p>
  }

  // 분야 드릴다운
  if (openGroup?.code) {
    const shortageGroup = occupations.filter((o) => (o.anzsco_v13 || o.anzsco_code).startsWith(openGroup.code!))
    const fallbackGroup = allOccupations.filter(
      (o) => o.anzsco_code != null && (o.anzsco_v13 || o.anzsco_code).startsWith(openGroup.code!),
    )
    const useShortage = shortageGroup.length > 0 && kind === "demand"
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpenGroup(null)}
          className="mb-1 inline-flex max-w-full items-center gap-1 px-3 text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="truncate">{openGroup.title}</span>
        </button>
        {useShortage ? (
          <ShortageList rows={shortageGroup} onSelectOcc={onSelectOcc} />
        ) : kind === "pay" ? (
          shortageGroup.length > 0 ? (
            <HighPayList
              rows={highPay}
              stateRows={shortageGroup}
              selected={selected}
              stateSalaryMult={stateSalaryMult}
              onSelectOcc={onSelectOcc}
            />
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">{t.map.regionGroupNoOcc}</p>
          )
        ) : (
          <DemandOnlyList rows={fallbackGroup} onSelectOcc={onSelectOcc} />
        )}
      </div>
    )
  }

  const max = Math.max(...rows.map((r) => r.value), 1)
  const metro = kind === "demand" && !!entry?.demandMetro
  return (
    <div>
      <p className="px-3 pb-2 text-xs text-slate-400">
        {kind === "demand" ? t.map.regionDemandHint : t.map.regionPayHint}
        {metro ? ` · ${t.map.regionMetroNote}` : ""}
      </p>
      <ol>
        {rows.map((r, i) => {
          const shortageCount = r.code ? occupations.filter((o) => (o.anzsco_v13 || o.anzsco_code).startsWith(r.code!)).length : 0
          const fallbackCount = r.code ? allOccupations.filter(
            (o) => o.anzsco_code != null && (o.anzsco_v13 || o.anzsco_code).startsWith(r.code!),
          ).length : 0
          const matchCount = kind === "demand" ? (shortageCount > 0 ? shortageCount : fallbackCount) : shortageCount
          const inner = (
            <>
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{r.title}</span>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${Math.round((r.value / max) * 100)}%` }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
                {r.value.toLocaleString()}
              </span>
              {matchCount > 0 && <ChevronRight className="ml-1 h-4 w-4 shrink-0 text-slate-300" />}
            </>
          )
          return (
            <li key={r.title}>
              {matchCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setOpenGroup(r)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  {inner}
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">{inner}</div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function adjustedSalary(
  salary: number | null,
  anzscoCode: string,
  state: string | null,
  mult: StateSalaryMult,
): { value: number | null; adjusted: boolean } {
  if (salary == null || !state) return { value: salary, adjusted: false }
  const digit = anzscoCode[0]
  const factor = mult[state]?.[digit]
  if (!factor || factor === 1) return { value: salary, adjusted: false }
  return { value: Math.round(salary * factor), adjusted: true }
}

function HighPayList({
  rows,
  stateRows,
  selected,
  stateSalaryMult,
  onSelectOcc,
}: {
  rows: HighPayOccupation[]
  stateRows: StateOccupation[]
  selected: StateCode
  stateSalaryMult: StateSalaryMult
  onSelectOcc: (code: string) => void
}) {
  const t = useTranslations()
  const locale = useLocale()
  const hasStateRows = stateRows.length > 0

  // state 선택 시: 이 주의 부족직종 중 보정 연봉 순으로 정렬 후 상위 12
  type DisplayRow = { anzsco_code: string; occupation_ko: string | null; occupation_en: string; on_csol: boolean; median_salary_aud: number | null; state_count?: number }
  const displayRows: DisplayRow[] = hasStateRows
    ? [...stateRows]
        .filter((r) => r.median_salary_aud != null)
        .sort((a, b) => {
          const adjA = adjustedSalary(a.median_salary_aud, a.anzsco_code, selected, stateSalaryMult).value ?? 0
          const adjB = adjustedSalary(b.median_salary_aud, b.anzsco_code, selected, stateSalaryMult).value ?? 0
          return adjB - adjA
        })
        .slice(0, 12)
    : rows

  const hint = hasStateRows ? t.map.payHintState : t.map.payHintNational

  const computed = displayRows.map((r) => ({
    r,
    ...adjustedSalary(r.median_salary_aud, r.anzsco_code, hasStateRows ? selected : null, stateSalaryMult),
  }))
  const maxAdj = Math.max(...computed.map((c) => c.value ?? 0), 1)

  return (
    <div>
      <p className="mb-1 px-3 text-xs text-slate-400">{hint}</p>
      <ol>
        {computed.map(({ r, value: adj, adjusted }, i) => {
          return (
            <li key={r.anzsco_code}>
              <button
                type="button"
                onClick={() => onSelectOcc(r.anzsco_code)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
              >
                <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-800">
                    {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {r.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
                    {"state_count" in r && r.state_count === 1 && (
                      <Badge tone="blue">{t.map.regionalSpecific}</Badge>
                    )}
                  </span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${adj ? Math.round((adj / maxAdj) * 100) : 0}%` }}
                    />
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold tabular-nums text-slate-700">
                    {adj != null ? `A$${adj.toLocaleString()}` : "—"}
                  </span>
                  {adjusted && (
                    <span className="block text-[10px] text-slate-400">{selected} {t.map.salaryAdjusted} · Census 2021</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function EmploymentList({
  sa4,
  stateCode,
  sa4Regions,
  neroData,
  onSelectNero,
}: {
  sa4: SA4Region | null
  stateCode: StateCode | null
  sa4Regions: SA4Region[]
  neroData: Record<string, NeroOccupation[]> | null
  onSelectNero: (a4: string) => void
}) {
  const t = useTranslations()

  if (!neroData) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-500" />
        <p className="text-sm text-slate-400">{t.map.loadingEmployment}</p>
      </div>
    )
  }

  let occs: NeroOccupation[]

  if (sa4) {
    occs = neroData[sa4.code] ?? []
  } else if (stateCode && sa4Regions.length > 0) {
    const agg = new Map<string, { a4: string; name: string; emp: number }>()
    for (const region of sa4Regions) {
      const rows = neroData[region.code] ?? []
      for (const r of rows) {
        const existing = agg.get(r.a4)
        if (existing) {
          existing.emp += r.emp
        } else {
          agg.set(r.a4, { a4: r.a4, name: r.name, emp: r.emp })
        }
      }
    }
    occs = Array.from(agg.values()).sort((a, b) => b.emp - a.emp)
  } else {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noEmploymentData}</p>
  }

  if (occs.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noEmploymentData}</p>
  }

  const maxEmp = occs[0].emp

  return (
    <div>
      <p className="mb-1 px-3 text-xs text-slate-400">
        {t.map.employmentSource}
      </p>
      <ol>
        {occs.map((r, i) => (
          <li key={r.a4}>
            <button
              type="button"
              onClick={() => onSelectNero(r.a4)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50"
            >
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{r.name}</span>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{ width: `${Math.round((r.emp / maxEmp) * 100)}%` }}
                  />
                </div>
              </span>
              <span className="ml-2 shrink-0 text-xs tabular-nums text-slate-500">
                {t.map.peopleFmt.replace('{n}', r.emp.toLocaleString())}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

function getStateForSA4(code: string): StateCode | null {
  for (const [state, regions] of Object.entries(SA4_BY_STATE)) {
    if (regions.some((r) => r.code === code)) return state as StateCode
  }
  return null
}

function padPostcode(n: number): string {
  return n.toString().padStart(4, "0")
}

function formatPostcodeList(entries: typeof WHV_POSTCODES[string]): string {
  const codes: number[] = []
  for (const e of entries) {
    codes.push(...e.postcodes)
    if (e.ranges) {
      for (const [lo, hi] of e.ranges) {
        for (let i = lo; i <= hi; i++) codes.push(i)
      }
    }
  }
  const sorted = Array.from(new Set(codes)).sort((a, b) => a - b)
  if (sorted.length === 0) return ""
  const parts: string[] = []
  let start = sorted[0]
  let end = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) { end = sorted[i]; continue }
    parts.push(start === end ? padPostcode(start) : `${padPostcode(start)}–${padPostcode(end)}`)
    start = sorted[i]; end = sorted[i]
  }
  parts.push(start === end ? padPostcode(start) : `${padPostcode(start)}–${padPostcode(end)}`)
  return parts.join(", ")
}

// Expand all eligible postcodes for a state into a flat sorted array
function expandStatePostcodes(stateCode: StateCode): number[] {
  const entries = WHV_POSTCODES[stateCode]
  if (!entries) return []
  const codes: number[] = []
  for (const e of entries) {
    codes.push(...e.postcodes)
    if (e.ranges) {
      for (const [lo, hi] of e.ranges) {
        for (let i = lo; i <= hi; i++) codes.push(i)
      }
    }
  }
  return Array.from(new Set(codes)).sort((a, b) => a - b)
}

// Get only the eligible postcodes that fall within a specific SA4
function getPostcodesForSA4(sa4Code: string, stateCode: StateCode): number[] {
  const allEligible = expandStatePostcodes(stateCode)
  return allEligible.filter((pc) => POSTCODE_TO_SA4[pc] === sa4Code)
}

// Format an array of postcodes as compact range string (4-digit padded)
function formatSA4Postcodes(pcs: number[]): string {
  if (pcs.length === 0) return ""
  const sorted = Array.from(new Set(pcs)).sort((a, b) => a - b)
  const parts: string[] = []
  let start = sorted[0]
  let end = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) { end = sorted[i]; continue }
    parts.push(start === end ? padPostcode(start) : `${padPostcode(start)}–${padPostcode(end)}`)
    start = sorted[i]; end = sorted[i]
  }
  parts.push(start === end ? padPostcode(start) : `${padPostcode(start)}–${padPostcode(end)}`)
  return parts.join(", ")
}

function WHVPanel({
  selectedSA4,
  selected,
  sa4Regions,
  onToggleSave,
  onShare,
  savedOccCodes,
}: {
  selectedSA4: SA4Region | null
  selected: StateCode | null
  sa4Regions: SA4Region[]
  onToggleSave?: (code: string, title: string) => void
  onShare?: (title: string) => void
  savedOccCodes?: Set<string>
}) {
  const locale = useLocale()

  if (selectedSA4) {
    const whv = WHV_REGIONS[selectedSA4.code]
    const labels: Record<string, string> = {
      eligible: locale === "ko" ? "세컨비자 가능" : "Second Visa Eligible",
      partial: locale === "ko" ? "일부 가능" : "Partially Eligible",
      none: locale === "ko" ? "불가능" : "Not Eligible",
    }
    const colors: Record<string, string> = { eligible: "text-violet-600", partial: "text-violet-400", none: "text-slate-400" }
    const stateCode = getStateForSA4(selectedSA4.code)
    const sa4Postcodes = stateCode && whv && whv.category === "partial"
      ? getPostcodesForSA4(selectedSA4.code, stateCode)
      : undefined

    return (
      <div className="space-y-3 px-3">
        <p className="text-xs text-slate-400">
          {locale === "ko"
              ? "선택한 지역의 세컨비자(417/462) 지정 근무 가능 여부입니다."
              : "Second Visa (417/462) specified work eligibility for the selected SA4 region."}
        </p>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">{selectedSA4.name}</p>
              <p className={`mt-1 text-sm font-semibold ${colors[whv?.category ?? "none"]}`}>
                {whv ? labels[whv.category] : labels.none}
              </p>
              {whv && whv.pct < 100 && (
                <p className="mt-1 text-xs text-slate-400">
                  {whv.pct}% of postcodes in this region are WHV-eligible
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {onToggleSave && (
                <button type="button"
                  onClick={() => onToggleSave(selectedSA4.code, selectedSA4.name)}
                  aria-label={locale === "ko" ? "저장" : "Save"}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Bookmark className="h-4 w-4" fill={savedOccCodes?.has(selectedSA4.code) ? "currentColor" : "none"} />
                </button>
              )}
              {onShare && (
                <button type="button"
                  onClick={() => onShare(selectedSA4.name)}
                  aria-label={locale === "ko" ? "공유" : "Share"}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {whv && whv.workCategories && whv.workCategories.length > 0 && (
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-medium text-slate-500 mb-2">
              {locale === "ko" ? "세컨비자 지정 근무 가능 직종" : "Eligible specified work"}
            </p>
            <a
              href={WHV_GENERAL_JOBS.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100"
            >
              <ExternalLink className="h-3 w-3 shrink-0" />
              {locale === "ko" ? WHV_GENERAL_JOBS.label_ko : WHV_GENERAL_JOBS.label_en}
            </a>
            <div className="space-y-2">
              {whv.workCategories.map((key) => {
                const work = WHV_SPECIFIED_WORK.find((w) => w.key === key)
                if (!work) return null
                const examples = locale === "ko" ? work.examples_ko : work.examples_en
                const label = locale === "ko" ? work.label_ko : work.label_en
                const links = WHV_JOB_LINKS[key]
                return (
                  <div key={key}>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{examples.join(" · ")}</p>
                    {links && links.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[11px] text-blue-700 transition-colors hover:bg-blue-100"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                            {locale === "ko" ? link.label_ko : link.label_en}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {(() => {
          const employers = WHV_REGION_EMPLOYERS[selectedSA4.code]
          if (!employers || employers.length === 0) return null
          const catLabels: Record<string, { en: string; ko: string }> = {
            mine: { en: "Mining", ko: "광업" },
            hotel: { en: "Hospitality", ko: "관광/호스피탈리티" },
            farm: { en: "Agriculture", ko: "농업" },
            factory: { en: "Manufacturing", ko: "제조업" },
          }
          const catColors: Record<string, string> = {
            mine: "bg-amber-100 text-amber-700",
            hotel: "bg-blue-100 text-blue-700",
            farm: "bg-green-100 text-green-700",
            factory: "bg-purple-100 text-purple-700",
          }
          return (
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-xs font-medium text-slate-500">
                {locale === "ko" ? "지역 고용주" : "Regional Employers"}
              </p>
              <div className="space-y-2">
                {employers.map((emp, i) => (
                  <div key={i} className="rounded-md border border-slate-100 bg-slate-50/50 p-2.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-slate-800">{emp.name}</p>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${catColors[emp.category]}`}>
                        {locale === "ko" ? catLabels[emp.category].ko : catLabels[emp.category].en}
                      </span>
                    </div>
                    <p className="mt-0.5 text-slate-500">{emp.town}</p>
                    <p className="mt-0.5 text-slate-600">{emp.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <a href={emp.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 transition-colors hover:bg-slate-200">
                        <ExternalLink className="h-2.5 w-2.5" /> {locale === "ko" ? "웹사이트" : "Website"}
                      </a>
                      <a href={emp.seekUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 rounded bg-rose-50 px-1.5 py-0.5 text-[11px] text-rose-700 transition-colors hover:bg-rose-100">
                        <ExternalLink className="h-2.5 w-2.5" /> Seek
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {sa4Postcodes && sa4Postcodes.length > 0 && (
          <details className="rounded-lg border border-slate-200 p-3 text-xs text-slate-500 open:pb-3">
            <summary className="cursor-pointer font-medium text-slate-700">
              {locale === "ko" ? `${selectedSA4.name} 세컨비자 가능 포스트코드` : `${selectedSA4.name} eligible postcodes`}
            </summary>
            <p className="mt-2 font-mono text-slate-600 leading-relaxed">{formatSA4Postcodes(sa4Postcodes)}</p>
          </details>
        )}
        <AffiliateCtas />
      </div>
    )
  }

  if (selected && sa4Regions.length > 0) {
    const eligible = sa4Regions.filter((r) => WHV_REGIONS[r.code]?.category === "eligible").length
    const partial = sa4Regions.filter((r) => WHV_REGIONS[r.code]?.category === "partial").length
    const none = sa4Regions.filter((r) => WHV_REGIONS[r.code]?.category === "none").length
    const statePostcodes = WHV_POSTCODES[selected]
    return (
      <div className="space-y-3 px-3">
        <p className="text-xs text-slate-400">
          {locale === "ko"
            ? "해당 주(State)의 SA4 지역별 세컨비자 지정 근무 가능 지역입니다. 지역을 클릭하면 자세한 정보를 볼 수 있습니다."
            : "Second Visa specified work eligibility by SA4 region. Click a region for details."}
        </p>
        <div className="rounded-lg border border-slate-200 p-3 text-sm">
          {eligible > 0 && (
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-violet-600" />
                {locale === "ko" ? "가능" : "Eligible"}
              </span>
              <span className="font-medium text-slate-700">{eligible}</span>
            </div>
          )}
          {partial > 0 && (
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-violet-400" />
                {locale === "ko" ? "일부 가능" : "Partially eligible"}
              </span>
              <span className="font-medium text-slate-700">{partial}</span>
            </div>
          )}
          {none > 0 && (
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-400" />
                {locale === "ko" ? "불가능" : "Not eligible"}
              </span>
              <span className="font-medium text-slate-700">{none}</span>
            </div>
          )}
        </div>

        {statePostcodes && (
          <details className="rounded-lg border border-slate-200 p-3 text-xs text-slate-500 open:pb-3">
            <summary className="cursor-pointer font-medium text-slate-700">
              {locale === "ko" ? `${selected} 세컨비자 가능 포스트코드` : `${selected} eligible postcodes`}
            </summary>
            <div className="mt-2 space-y-2">
              {statePostcodes.map((entry, i) => {
                const expanded = formatPostcodeList([entry])
                if (!expanded) {
                  return (
                    <p key={i} className="text-slate-500">
                      {locale === "ko" ? entry.note_ko : entry.note_en}
                    </p>
                  )
                }
                return (
                  <div key={i}>
                    <p className="text-slate-500">{locale === "ko" ? entry.note_ko : entry.note_en}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-600 leading-relaxed">{expanded}</p>
                  </div>
                )
              })}
            </div>
          </details>
        )}
        <AffiliateCtas />
      </div>
    )
  }

  return (
    <p className="py-8 text-center text-sm text-slate-400">
      {locale === "ko" ? "주와 지역을 선택해주세요." : "Select a state and region to view WHV eligibility."}
    </p>
  )
}

function UniversityInfoCard({
  college,
  onClose,
  isSaved,
  onToggleSave,
  onShare,
}: {
  college: USRankedCollege | AURankedCollege | CACollege | UKCollege
  onClose: () => void
  isSaved: boolean
  onToggleSave: (slug: string, name: string) => void
  onShare: (slug: string) => void
}) {
  const isUK = "region" in college
  const isCA = "province" in college
  const isUS = "college_id" in college
  const stateOrProv = "region" in college ? (college as UKCollege).region : "province" in college ? (college as CACollege).province : (college as USRankedCollege | AURankedCollege).college_state
  const qsRank = "qsRank" in college ? (college as USRankedCollege | AURankedCollege).qsRank : (college as CACollege | UKCollege).qs_rank
  const tuition = "avg_net_price" in college ? (college as CACollege).avg_net_price : "tuition" in college ? (college as USRankedCollege | UKCollege).tuition : null
  const hasEarningsAndCost = "median_earnings" in college && college.median_earnings != null && ("tuition" in college ? college.tuition != null : "avg_net_price" in college ? college.avg_net_price != null : false)
  const netSalary = hasEarningsAndCost
    ? "tuition" in college
      ? college.median_earnings! - college.tuition!
      : college.median_earnings! - (college as CACollege).avg_net_price!
    : "net_salary" in college ? (college as USRankedCollege).net_salary : null
  const roiScore = hasEarningsAndCost
    ? "tuition" in college && college.tuition != null
      ? Math.round((college.median_earnings! / college.tuition!) * 10) / 10
      : Math.round((college.median_earnings! / (college as CACollege).avg_net_price!) * 10) / 10
    : "roi_score" in college ? (college as USRankedCollege).roi_score : null
  const currency = isUK ? "£" : isCA ? "C$" : isUS ? "$" : "A$"

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-900">{college.college_name}</h2>
          <p className="text-xs text-slate-500">{college.city_name}, {stateOrProv}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleSave(college.slug, college.college_name)}
            aria-label="Save university"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={() => onShare(college.slug)}
            aria-label="Share university"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {qsRank != null && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
            QS #{qsRank}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {tuition != null && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Tuition</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {currency}{tuition.toLocaleString()}
              </p>
            </div>
          )}
          {"median_earnings" in college && college.median_earnings != null && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Median Earnings</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {currency}{college.median_earnings.toLocaleString()}
              </p>
            </div>
          )}
          {netSalary != null && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Net Salary</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {currency}{netSalary.toLocaleString()}
              </p>
            </div>
          )}
          {"graduation_rate" in college && college.graduation_rate != null && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Graduation Rate</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {Math.round(college.graduation_rate * 100)}%
              </p>
            </div>
          )}
          {roiScore != null && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">ROI Score</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {roiScore}
              </p>
            </div>
          )}
        </div>

        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            <ExternalLink className="h-4 w-4" />
            Visit official website
          </a>
        )}
      </div>
    </>
  )
}

function StateInfoPanel({
  stateInfo,
  majors,
}: {
  stateInfo: USStateInfo | null
  majors: StateMajorDensity[]
}) {
  return (
    <div className="space-y-5">
      {stateInfo && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Affordability
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Median Rent</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {stateInfo.medianRent != null ? `$${stateInfo.medianRent.toLocaleString()}/mo` : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Median Income</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {stateInfo.medianIncome != null ? `$${stateInfo.medianIncome.toLocaleString()}/yr` : "—"}
              </p>
            </div>
          </div>
          {stateInfo.rentIncomeRatio != null && (
            <div className="mt-3 rounded-lg border p-3" style={{
              borderColor: stateInfo.rentIncomeRatio > 0.3 ? "#fecaca" : stateInfo.rentIncomeRatio > 0.22 ? "#fed7aa" : "#bbf7d0",
              backgroundColor: stateInfo.rentIncomeRatio > 0.3 ? "#fef2f2" : stateInfo.rentIncomeRatio > 0.22 ? "#fff7ed" : "#f0fdf4",
            }}>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Rent-to-Income Ratio</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                {Math.round(stateInfo.rentIncomeRatio * 100)}%
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {stateInfo.rentIncomeRatio > 0.3
                  ? "High cost — rent takes over 30% of income"
                  : stateInfo.rentIncomeRatio > 0.22
                    ? "Moderate cost — rent takes 22–30% of income"
                    : "Affordable — rent under 22% of income"}
              </p>
            </div>
          )}
          {stateInfo.rentByBedrooms && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Median Rent by Bedrooms</p>
              <div className="grid grid-cols-5 gap-1.5">
                {(["studio", "1br", "2br", "3br", "4br"] as const).map((b) => (
                  <div key={b} className="rounded border border-slate-100 bg-white p-2 text-center">
                    <p className="text-[10px] text-slate-400">{b === "studio" ? "Studio" : b.toUpperCase()}</p>
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-slate-800">
                      {stateInfo.rentByBedrooms?.[b] != null ? `$${stateInfo.rentByBedrooms[b].toLocaleString()}` : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
      {!stateInfo && (
        <p className="py-4 text-center text-sm text-slate-400">No affordability data for this state yet.</p>
      )}

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Top Majors in This State
        </h3>
        {majors.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">No major data for this state yet.</p>
        ) : (
          <ol>
            {majors.slice(0, 10).map((m, i) => (
              <li key={m.slug}>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50">
                  <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">{m.label}</span>
                    <span className="mt-0.5 text-xs text-slate-400">
                      {m.occupationCount} occupation{m.occupationCount > 1 ? "s" : ""} · {m.totalEmp.toLocaleString()} employed
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
                    ${m.avgWage.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

function CACitiesPanel({
  cities,
  province,
}: {
  cities: CACity[]
  province: string | null
}) {
  const filtered = province ? cities.filter((c) => c.province === province) : cities
  if (filtered.length === 0) return null

  const maxRent = Math.max(...filtered.map((c) => c.rent_median ?? 0), 1)
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Cost of Living</h3>
      <div className="space-y-1">
        {filtered.map((c) => {
          const barPct = c.rent_median != null ? (c.rent_median / maxRent) * 100 : 0
          const affordability =
            c.cost_of_living_index != null
              ? c.cost_of_living_index > 90 ? "High" : c.cost_of_living_index > 75 ? "Moderate" : "Low"
              : null
          return (
            <div key={c.name} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{c.name}</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: barPct > 80 ? "#ef4444" : barPct > 50 ? "#f59e0b" : "#22c55e",
                      }}
                    />
                  </div>
                  {affordability && (
                    <span className="shrink-0 text-[10px] font-medium" style={{
                      color: affordability === "High" ? "#ef4444" : affordability === "Moderate" ? "#f59e0b" : "#22c55e",
                    }}>
                      {affordability}
                    </span>
                  )}
                </div>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-semibold tabular-nums text-slate-700">
                  {c.rent_median != null ? `$${c.rent_median.toLocaleString()}` : "—"}
                </span>
                <span className="block text-[10px] text-slate-400">/mo</span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function UKCitiesPanel({
  cities,
  region,
}: {
  cities: UKCity[]
  region: string | null
}) {
  const filtered = region ? cities.filter((c) => c.region === region) : cities
  if (filtered.length === 0) return null

  const maxRent = Math.max(...filtered.map((c) => c.rent_median ?? 0), 1)
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Cost of Living</h3>
      <div className="space-y-1">
        {filtered.map((c) => {
          const barPct = c.rent_median != null ? (c.rent_median / maxRent) * 100 : 0
          const affordability =
            c.cost_of_living_index != null
              ? c.cost_of_living_index > 90 ? "High" : c.cost_of_living_index > 75 ? "Moderate" : "Low"
              : null
          return (
            <div key={c.name} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{c.name}</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: barPct > 80 ? "#ef4444" : barPct > 50 ? "#f59e0b" : "#22c55e",
                      }}
                    />
                  </div>
                  {affordability && (
                    <span className="shrink-0 text-[10px] font-medium" style={{
                      color: affordability === "High" ? "#ef4444" : affordability === "Moderate" ? "#f59e0b" : "#22c55e",
                    }}>
                      {affordability}
                    </span>
                  )}
                </div>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-semibold tabular-nums text-slate-700">
                  {c.rent_median != null ? `£${c.rent_median.toLocaleString()}` : "—"}
                </span>
                <span className="block text-[10px] text-slate-400">/mo</span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CACollegesPanel({
  colleges,
  province,
}: {
  colleges: CACollege[]
  province: string | null
}) {
  const filtered = province ? colleges.filter((c) => c.province === province) : colleges
  if (filtered.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">No university data for this province yet.</p>
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{filtered.length} universities{province ? ` in ${CA_PROVINCE_NAMES[province] ?? province}` : ""}</p>
      <ol>
        {filtered.map((c, i) => (
          <li key={c.institution_id}>
            <Link
              href={`/map/ca/university/${c.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{c.college_name}</span>
                <span className="mt-0.5 text-xs text-slate-400">{c.city_name}</span>
              </span>
              <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
                {c.median_earnings != null ? `$${c.median_earnings.toLocaleString()}` : "—"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

function UKCollegesPanel({
  colleges,
  region,
}: {
  colleges: UKCollege[]
  region: string | null
}) {
  const filtered = region ? colleges.filter((c) => c.region === region) : colleges
  if (filtered.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">No university data for this region yet.</p>
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{filtered.length} universities{region ? ` in ${UK_REGION_NAMES[region] ?? region}` : ""}</p>
      <ol>
        {filtered.map((c, i) => (
          <li key={c.institution_id}>
            <Link
              href={`/map/uk/university/${c.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{c.college_name}</span>
                <span className="mt-0.5 text-xs text-slate-400">{c.city_name}</span>
              </span>
              <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
                {c.median_earnings != null ? `£${c.median_earnings.toLocaleString()}` : "—"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CAOccupationDetail({
  occ,
  provinceShortages,
  currentProvince,
  onBack,
  onClose,
  t,
  savedOccCodes,
  onToggleSave,
  onShare,
}: {
  occ: CAOccRow
  provinceShortages: StateShortageByOcc[]
  currentProvince: string | null
  onBack: () => void
  onClose: () => void
  t: ReturnType<typeof useTranslations>
  savedOccCodes: Set<string>
  onToggleSave: (occCode: string, occTitle: string) => void
  onShare: (occTitle: string) => void
}) {
  const locale = useLocale()
  const name = locale === "ko" && occ.occupation_ko ? occ.occupation_ko : occ.occupation_en

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {null}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">
            {name}
          </h2>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(occ.noc_code, name)}
              aria-label="Save occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bookmark className="h-4 w-4" fill={savedOccCodes.has(occ.noc_code) ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => onShare(name)}
              aria-label="Share occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="gray">NOC {occ.noc_code}</Badge>
          {occ.confidence && <Badge tone="blue">{occ.confidence}</Badge>}
        </div>

        {occ.noc_code && (
          <Link
            href={`/roi-explorer/ca/occupation/${occ.noc_code}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            자세히 보기
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}

        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.map.detailMedianSalary}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-800">
              {occ.median_salary_cad != null ? `C$${occ.median_salary_cad.toLocaleString()}` : "—"}
            </p>
            {(occ.low_wage_cad != null || occ.high_wage_cad != null) && (
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                {occ.low_wage_cad != null && <span>Low: C${occ.low_wage_cad.toLocaleString()}</span>}
                {occ.high_wage_cad != null && <span>High: C${occ.high_wage_cad.toLocaleString()}</span>}
              </div>
            )}
          </div>

          {occ.shortage_rating != null && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Shortage Rating
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", shortageColor(occ.shortage_rating))}
                    style={{ width: `${Math.round((occ.shortage_rating / 5) * 100)}%` }}
                  />
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                  {occ.shortage_rating}/5
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{shortageLabel(occ.shortage_rating, t)}</p>
            </div>
          )}

          {provinceShortages.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Shortage by Province
              </p>
              <div className="mt-2 space-y-1">
                {provinceShortages.map((ps) => (
                  <div
                    key={ps.state}
                    className={cn(
                      "flex items-center justify-between rounded px-2 py-1",
                      ps.state === currentProvince && "bg-blue-100"
                    )}
                  >
                    <span className="text-xs font-medium text-slate-600">{ps.state}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs tabular-nums text-slate-500">{ps.rating}/5</span>
                      <span className={cn("h-2 w-8 rounded-full", shortageBar(ps.rating))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {occ.data_source && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Source</p>
              <p className="mt-1 text-xs text-slate-600">{occ.data_source}</p>
              {occ.last_verified && (
                <p className="mt-0.5 text-[10px] text-slate-400">Verified: {occ.last_verified}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function CAShortageList({ rows, onSelectOcc }: { rows: CAOccRow[]; onSelectOcc?: (code: string) => void }) {
  const t = useTranslations()
  const locale = useLocale()
  const [limit, setLimit] = useState(10)
  const sorted = [...rows]
    .filter((r) => r.shortage_rating != null)
    .sort((a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0))
  const visible = sorted.slice(0, limit)
  if (visible.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {visible.map((r, i) => (
        <li key={r.noc_code}>
          <button
            type="button"
            onClick={() => onSelectOcc?.(r.noc_code)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums text-slate-700">
                {r.median_salary_cad != null ? `C$${r.median_salary_cad.toLocaleString()}` : "—"}
              </span>
              <span className="text-[10px] text-slate-400">Shortage: {r.shortage_rating}/5</span>
            </span>
          </button>
        </li>
      ))}
      {limit < sorted.length && (
        <li>
          <button
            type="button"
            onClick={() => setLimit((p) => Math.min(p + 10, sorted.length))}
            className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {locale === "ko" ? "더보기" : "Show more"} ({sorted.length - limit})
          </button>
        </li>
      )}
    </ol>
  )
}

function CAHighPayList({ rows, provinceRows, onSelectOcc }: { rows: CAHighPayOccupation[]; provinceRows?: CAHighPayOccupation[]; onSelectOcc?: (code: string) => void }) {
  const t = useTranslations()
  const locale = useLocale()
  const display = provinceRows && provinceRows.length > 0 ? provinceRows : rows
  if (display.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {display.map((r, i) => (
        <li key={r.noc_code}>
          <button
            type="button"
            onClick={() => onSelectOcc?.(r.noc_code)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums text-slate-700">
                {r.median_salary_cad != null ? `C$${r.median_salary_cad.toLocaleString()}` : "—"}
              </span>
              {r.shortage_rating != null && (
                <span className="text-[10px] text-slate-400">Shortage: {r.shortage_rating}/5</span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ol>
  )
}

function USShortageList({ rows, onSelectOcc }: { rows: USOccupation[]; onSelectOcc: (occ: USOccupation) => void }) {
  const t = useTranslations()
  const locale = useLocale()
  const [limit, setLimit] = useState(10)
  const visible = rows.slice(0, limit)
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {visible.map((r, i) => (
        <li key={r.occ_code}>
          <button
            type="button"
            onClick={() => onSelectOcc(r)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {r.occ_title}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                {r.pct_change > 0 && <span>Growth: +{r.pct_change}%</span>}
                {r.annual_openings > 0 && <span>· Openings: {r.annual_openings.toLocaleString()}</span>}
              </span>
            </span>
            <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
              ${r.median_wage.toLocaleString()}
            </span>
          </button>
        </li>
      ))}
      {limit < rows.length && (
        <li>
          <button
            type="button"
            onClick={() => setLimit((p) => Math.min(p + 10, rows.length))}
            className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {locale === "ko" ? "더보기" : "Show more"} ({rows.length - limit})
          </button>
        </li>
      )}
    </ol>
  )
}

function USHighPayList({ rows, onSelectOcc }: { rows: USOccupation[]; onSelectOcc: (occ: USOccupation) => void }) {
  const t = useTranslations()
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {rows.map((r, i) => (
        <li key={r.occ_code}>
          <button
            type="button"
            onClick={() => onSelectOcc(r)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {r.occ_title}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums text-slate-700">
                ${r.median_wage.toLocaleString()}
              </span>
              {r.pct_change > 0 && (
                <span className="text-[10px] text-emerald-600">+{r.pct_change}% growth</span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ol>
  )
}

function shortageLabel(score: number | null, t: ReturnType<typeof useTranslations>): string {
  if (score == null || score < 3) return t.map.detailLevelLow
  if (score >= 5) return t.map.detailLevelStrong
  if (score >= 4) return t.map.detailLevelHigh
  return t.map.detailLevelMedium
}

function shortageColor(score: number | null): string {
  if (score == null || score < 3) return "bg-slate-300"
  if (score >= 5) return "bg-rose-500"
  if (score >= 4) return "bg-orange-400"
  return "bg-amber-300"
}

function shortageBar(score: number | null): string {
  return shortageColor(score)
}

// 코스의 "관련 학과" 링크 — 대학 공식 도메인(website_url) 안에서 코스명으로 사이트 검색.
// 별도 URL 데이터 없이도 학교 홈페이지가 아니라 해당 프로그램 페이지로 바로 안내한다.
function courseProgramUrl(websiteUrl: string | null, title: string): string | null {
  if (!websiteUrl) return null
  let domain: string
  try {
    domain = new URL(websiteUrl).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
  if (!domain) return null
  return `https://www.google.com/search?q=${encodeURIComponent(`${title} site:${domain}`)}`
}

// 미국 대학은 데이터에 공식 URL이 없어, 학교명 검색으로 공식 사이트까지 안내한다.
// (/roi-explorer 는 현재 next.config 에서 soft-hide 되어 내부 링크가 홈으로 리다이렉트됨.)
function collegeSearchUrl(name: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(name)}`
}

function aqfLabel(level: number | null): string {
  if (!level) return ""
  if (level >= 10) return "Doctoral"
  if (level === 9) return "Master"
  if (level === 8) return "Grad Cert"
  if (level === 7) return "Bachelor"
  if (level === 6) return "Adv Dip"
  if (level === 5) return "Diploma"
  return `Cert ${level}`
}

function OccupationDetail({
  occ,
  stateShortages,
  onBack,
  onClose,
  t,
  currentState,
  data,
  savedOccCodes,
  onToggleSave,
  onShare,
}: {
  occ: OccRow
  stateShortages: StateShortageByOcc[]
  onBack: () => void
  onClose: () => void
  t: ReturnType<typeof useTranslations>
  currentState: StateCode
  data: MapData
  savedOccCodes: Set<string>
  onToggleSave: (occCode: string, occTitle: string) => void
  onShare: (occTitle: string) => void
}) {
  const locale = useLocale()
  const name = locale === "ko" && occ.occupation_ko ? occ.occupation_ko : occ.occupation_en

  const currentStateShortage = stateShortages.find((s) => s.state === currentState)
  const stateRating = currentStateShortage?.rating ?? 0

  const hasNational = occ.shortage_rating != null && occ.shortage_rating > 0
  const nationalWidth = hasNational ? Math.round((occ.shortage_rating! / 5) * 100) : 0

  // "공부하는 곳"·"비자"는 모두 맵 초기 데이터(data)에서 동기적으로 계산한다 → 카드 열면 즉시.
  // (예전엔 /api/occupations/related 를 카드 열 때 fetch 해서 몇 초 지연이 있었다.)
  const pathway = getPathway(occ.anzsco_code)
  const relatedData = {
    pathway,
    courses:
      pathway === "degree" && occ.related_broad_field
        ? data.coursesByFieldState[occ.related_broad_field]?.[currentState] ?? []
        : [],
    tafe: pathway === "vet" ? TAFE_BY_STATE[currentState] : null,
    vetPortals: pathway === "vet" ? VET_PORTALS : [],
    cricosSearch: cricosSearchUrl(),

  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {null}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">
            {name}
          </h2>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(occ.anzsco_code ?? "", name)}
              aria-label="Save occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bookmark className="h-4 w-4" fill={savedOccCodes.has(occ.anzsco_code ?? "") ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => onShare(name)}
              aria-label="Share occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="gray">ANZSCO {occ.anzsco_code}</Badge>
          {occ.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
        </div>

        {occ.anzsco_code && (
          <Link
            href={`/roi-explorer/au/occupation/${occ.anzsco_code}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            자세히 보기
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}

        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.map.detailMedianSalary}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-800">
              {occ.median_salary_aud != null ? `A$${occ.median_salary_aud.toLocaleString()}` : "—"}
            </p>
          </div>

          {stateRating > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {currentState} {t.map.detailStateShortages}
              </p>
              <div className="mt-2">
                <ShortageLabel rating={stateRating} />
              </div>
            </div>
          )}

          {stateShortages.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                {t.map.detailStateShortages} ({locale === "ko" ? "전체주" : "all states"})
              </p>
              <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                {stateShortages.map((s) => (
                  <span key={s.state} className="inline-flex items-center gap-1 text-xs text-slate-700">
                    <span className={cn("font-medium", s.state === currentState && "text-slate-900 underline")}>
                      {s.state}
                    </span>
                    <ShortageLabel rating={s.rating} className="!text-[10px]" />
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasNational && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {t.map.detailNationalShortage}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", shortageColor(occ.shortage_rating))}
                    style={{ width: `${nationalWidth}%` }}
                  />
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                  {occ.shortage_rating}/5
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{shortageLabel(occ.shortage_rating, t)}</p>
            </div>
          )}

          {relatedData.pathway === "degree" ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                {t.map.detailDegreesInState.replace("{state}", currentState)}
              </p>
              {relatedData.courses.length > 0 ? (
              <div className="space-y-2">
                {relatedData.courses.map((c) => {
                  const href = c.institution_id ? `/roi-explorer/au/${c.institution_id}` : null
                  const programUrl = courseProgramUrl(c.website_url, c.title)
                  const info = (
                    <>
                      <p className="text-sm font-medium text-slate-800 leading-snug">{c.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {c.institution_name && <>{c.institution_name} · </>}
                        {c.aqf_level != null && <>{aqfLabel(c.aqf_level)} · </>}
                        {c.duration_years != null && (
                          <>{c.duration_years} yr{c.duration_years > 1 ? "s" : ""} · </>
                        )}
                        {c.tuition_fee_aud != null && <>A${c.tuition_fee_aud.toLocaleString()}/yr</>}
                      </p>
                    </>
                  )
                  // 코스 카드는 /roi-explorer 링크와 외부(CRICOS/홈페이지) 링크를 형제로 둔다.
                  // (앵커 중첩 = 잘못된 HTML 이라 hydration 에러가 난다.)
                  return (
                    <div
                      key={c.id}
                      className="rounded-md border border-slate-100 bg-white p-2.5"
                    >
                      {href ? (
                        <Link href={href} className="block transition-opacity hover:opacity-70">
                          {info}
                        </Link>
                      ) : (
                        info
                      )}
                      {(programUrl || c.cricos_url || c.website_url) && (
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {programUrl && (
                            <a
                              href={programUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t.map.detailCoursePage}
                            </a>
                          )}
                          {c.cricos_url && (
                            <a
                              href={c.cricos_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t.map.detailCricosLink}
                            </a>
                          )}
                          {c.website_url && (
                            <a
                              href={c.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t.map.detailCollegeWebsite}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              ) : (
                <div className="text-xs text-slate-500 leading-relaxed">
                  <p>{t.map.detailNoStateDegrees.replace("{state}", currentState)}</p>
                  {relatedData.cricosSearch && (
                    <a
                      href={relatedData.cricosSearch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t.map.detailCricosLink}
                    </a>
                  )}
                </div>
              )}
              {relatedData.courses.length > 0 && relatedData.cricosSearch && (
                <a
                  href={relatedData.cricosSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  {t.map.detailCricosMore}
                </a>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                {t.map.detailVetInState.replace("{state}", currentState)}
              </p>
              {relatedData.tafe && (
                <a
                  href={relatedData.tafe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-slate-100 bg-white p-2.5 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span className="text-sm font-medium text-slate-800">{relatedData.tafe.name}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-400">
                    {t.map.detailOfficialTafe}
                  </span>
                </a>
              )}
              {relatedData.vetPortals.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-[11px] text-slate-400">{t.map.detailVetPortals}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {relatedData.vetPortals.map((p) => (
                      <a
                        key={p.url}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {p.name}
                      </a>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">{t.map.detailVetHint}</p>
                </div>
              )}
            </div>
          )}



          {occ.last_verified && (
            <p className="text-xs text-slate-400">
              {t.map.detailUpdated}: {occ.last_verified}
            </p>
          )}

          <JobListings what={name} where={currentState} country="AU" />

          <AffiliateCtas />
        </div>
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        {t.map.source}
      </p>
    </>
  )
}

// 미국 직업 상세 카드 — AU OccupationDetail 와 같은 패널 크롬을 쓰되, 우리가 이미 로드한
// 데이터(임금·고용·부족점수)와 외부 링크(O*NET/BLS), 주별 ROI 상위 대학으로 구성한다.
function USOccupationDetail({
  occ,
  stateName,
  stateCode,
  colleges,
  onBack,
  onClose,
  t,
  savedOccCodes,
  onToggleSave,
  onShare,
}: {
  occ: USOccupation
  stateName: string
  stateCode: string
  colleges: USCollege[]
  onBack: () => void
  onClose: () => void
  t: ReturnType<typeof useTranslations>
  savedOccCodes: Set<string>
  onToggleSave: (occCode: string, occTitle: string) => void
  onShare: (occTitle: string) => void
}) {
  // SOC 코드(예: 15-1252) → O*NET 8자리(.00), BLS OEWS(하이픈 제거) 공식 페이지로 연결.
  const onetUrl = `https://www.onetonline.org/link/summary/${occ.occ_code}.00`
  const blsUrl = `https://www.bls.gov/oes/current/oes${occ.occ_code.replace("-", "")}.htm`

  const topSchools = colleges
    .filter((c) => c.college_state === stateCode && c.roi_score != null)
    .sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))
    .slice(0, 6)

  const shortageWidth = Math.max(0, Math.min(100, Math.round(occ.shortage_score)))

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {null}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">
            {occ.occ_title}
          </h2>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(occ.occ_code, occ.occ_title)}
              aria-label="Save occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bookmark className="h-4 w-4" fill={savedOccCodes.has(occ.occ_code) ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => onShare(occ.occ_title)}
              aria-label="Share occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="gray">{t.map.detailSoc} {occ.occ_code}</Badge>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.map.detailMedianSalary}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-800">
              ${occ.median_wage.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              {t.map.detailEmployment}
            </p>
            <dl className="space-y-1.5 text-sm">
              {occ.tot_emp > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t.map.detailEmployed}</dt>
                  <dd className="font-medium tabular-nums text-slate-700">{occ.tot_emp.toLocaleString()}</dd>
                </div>
              )}
              {occ.pct_change !== 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t.map.detailGrowth}</dt>
                  <dd className={cn("font-medium tabular-nums", occ.pct_change > 0 ? "text-emerald-600" : "text-slate-700")}>
                    {occ.pct_change > 0 ? "+" : ""}{occ.pct_change}%
                  </dd>
                </div>
              )}
              {occ.annual_openings > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t.map.detailAnnualOpenings}</dt>
                  <dd className="font-medium tabular-nums text-slate-700">{occ.annual_openings.toLocaleString()}</dd>
                </div>
              )}
            </dl>
            {occ.shortage_score > 0 && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{t.map.detailShortageScore}</span>
                  <span className="tabular-nums">{Math.round(occ.shortage_score)}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-rose-500 transition-all" style={{ width: `${shortageWidth}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              {t.map.detailLearnMore}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={onetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                <ExternalLink className="h-3 w-3" />
                {t.map.detailOnet}
              </a>
              <a
                href={blsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                <ExternalLink className="h-3 w-3" />
                {t.map.detailBls}
              </a>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <Link
                href={`/roi-explorer/us/occupation/${occ.occ_code}`}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                자세히 보기
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              {t.map.detailTopSchools.replace("{state}", stateName)}
            </p>
            {topSchools.length > 0 ? (
              <div className="space-y-2">
                {topSchools.map((c) => (
                  <a
                    key={c.college_id}
                    href={collegeSearchUrl(c.college_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border border-slate-100 bg-white p-2.5 transition-opacity hover:opacity-70"
                  >
                    <p className="flex items-center gap-1 text-sm font-medium text-slate-800 leading-snug">
                      {c.college_name}
                      <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {c.city_name && <>{c.city_name} · </>}
                      {c.roi_score != null && <>ROI {c.roi_score.toFixed(1)}</>}
                      {c.net_salary != null && <> · ${Math.round(c.net_salary).toLocaleString()}</>}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">{t.map.detailNoSchools}</p>
            )}
          </div>

          <JobListings what={occ.occ_title} where={stateCode} country="US" />

          <AffiliateCtas />
        </div>
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        {t.map.source}
      </p>
    </>
  )
}

function NeroOccupationDetail({
  a4,
  stateCode,
  neroData,
  sa4Regions,
  auOccupations,
  stateSalaryMult,
  coursesByFieldState,
  onBack,
  onClose,
  t,
  savedOccCodes,
  onToggleSave,
  onShare,
}: {
  a4: string
  stateCode: StateCode
  neroData: Record<string, NeroOccupation[]>
  sa4Regions: SA4Region[]
  auOccupations: Record<string, OccRow>
  stateSalaryMult: StateSalaryMult
  coursesByFieldState: Record<string, Record<string, CourseLite[]>>
  onBack: () => void
  onClose: () => void
  t: ReturnType<typeof useTranslations>
  savedOccCodes: Set<string>
  onToggleSave: (occCode: string, occTitle: string) => void
  onShare: (occTitle: string) => void
}) {
  const occ = useMemo(() => {
    for (const region of sa4Regions) {
      const rows = neroData[region.code] ?? []
      const found = rows.find((r) => r.a4 === a4)
      if (found) return found
    }
    for (const code of Object.keys(neroData)) {
      const rows = neroData[code] ?? []
      const found = rows.find((r) => r.a4 === a4)
      if (found) return found
    }
    return null
  }, [a4, neroData, sa4Regions])

  const name = occ?.name ?? a4

  const enrich = useMemo(() => {
    const mapping = EMPLOYMENT_OCCUPATIONS.find((o) => o.a4 === a4)
    if (!mapping) return { broad_field: null, medianSalary: null, estimatedSalary: null }

    let occRow: OccRow | null = null
    let matchedCode: string | null = null

    if (mapping.representative_osca_code) {
      occRow = auOccupations[mapping.representative_osca_code] ?? null
      if (occRow) matchedCode = mapping.representative_osca_code
    }

    if (!occRow) {
      const fallback = Object.values(auOccupations).find(
        (o) => o.anzsco_v13?.startsWith(a4) && o.median_salary_aud != null,
      )
      if (fallback?.anzsco_code) {
        occRow = fallback
        matchedCode = fallback.anzsco_code
      }
    }

    let medianSalary = occRow?.median_salary_aud ?? null
    let estimatedSalary: number | null = null

    if (medianSalary == null) {
      let entry = EMPLOYMENT_SALARIES.find((e) => e.a4 === a4)
      if (!entry && name) {
        entry = EMPLOYMENT_SALARIES.find((e) => {
          const m = EMPLOYMENT_OCCUPATIONS.find((o) => o.a4 === e.a4)
          return m?.name === name
        })
      }
      if (entry?.median_salary_aud) {
        medianSalary = entry.median_salary_aud
        if (stateCode) {
          const d1 = a4.charAt(0)
          const mult = stateSalaryMult[stateCode]?.[d1] ?? 1
          estimatedSalary = Math.round(medianSalary * mult)
        }
      }
    } else if (medianSalary != null && stateCode && matchedCode) {
      const d1 = matchedCode.charAt(0)
      const mult = stateSalaryMult[stateCode]?.[d1] ?? 1
      estimatedSalary = Math.round(medianSalary * mult)
    }
    return { broad_field: mapping.broad_field, medianSalary, estimatedSalary }
  }, [a4, name, stateCode, auOccupations, stateSalaryMult])

  const courses = useMemo(() => {
    if (!enrich.broad_field || !stateCode) return []
    return (coursesByFieldState[enrich.broad_field]?.[stateCode] ?? []).slice(0, 4)
  }, [enrich.broad_field, stateCode, coursesByFieldState])

  const seekUrl = useMemo(() => {
    const byA4 = JOB_SEARCH_LINKS.find((l) => l.a4 === a4)
    if (byA4) return byA4.seek_url
    const byName = JOB_SEARCH_LINKS.find((l) => l.name === name)
    if (byName) return byName.seek_url
    return null
  }, [a4, name])

  function getStateSeekUrl(baseUrl: string): string {
    const path = STATE_SEEK_PATH[stateCode]
    if (!path) return baseUrl
    return `${baseUrl}/in-${path}`
  }

  function getStateIndeedUrl(name: string): string {
    const q = name.toLowerCase().replace(/[^a-z0-9]+/g, "+").replace(/(^\+|\+$)/g, "")
    const base = `https://au.indeed.com/jobs?q=${q}`
    const l = STATE_NAMES[stateCode]
    if (!l) return base
    return `${base}&l=${encodeURIComponent(l)}`
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-4">
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          {null}
        </button>
        <button type="button" onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">{name}</h2>
          <div className="flex items-center gap-1 shrink-0">
            <button type="button"
              onClick={() => onToggleSave(a4, name)}
              aria-label="Save occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <Bookmark className="h-4 w-4"
                fill={savedOccCodes.has(a4) ? "currentColor" : "none"} />
            </button>
            <button type="button"
              onClick={() => onShare(name)}
              aria-label="Share occupation"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {/* Salary */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.employment.salary}
            </p>
            <div className="mt-2 space-y-1">
              {enrich.medianSalary != null && (
                <p className="flex items-center gap-1.5 text-sm text-slate-700">
                  <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  {t.employment.nationalMedian.replace('{amount}', enrich.medianSalary.toLocaleString())}
                </p>
              )}
              {enrich.estimatedSalary != null && (
                <p className="flex items-center gap-1.5 text-sm text-slate-700">
                  <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  {t.employment.stateEstimate.replace('{stateName}', STATE_NAMES[stateCode] ?? stateCode).replace('{amount}', enrich.estimatedSalary.toLocaleString())}
                </p>
              )}
              {enrich.medianSalary == null && (
                <p className="text-sm text-slate-400">{t.employment.salaryNotAvailable}</p>
              )}
            </div>
          </div>

          {/* Related study */}
          {enrich.broad_field && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {t.employment.relatedStudy}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {enrich.broad_field}
              </p>
              {courses.length > 0 && (
                <div className="mt-3 space-y-2">
                  {courses.map((course) => (
                    <a
                      key={course.id}
                      href={course.cricos_url ?? course.website_url ?? "#"}
                      target={course.cricos_url || course.website_url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 rounded-md border border-slate-100 bg-white px-3 py-2.5 text-sm transition-colors hover:bg-blue-50"
                    >
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-700">{course.title}</p>
                        <p className="text-xs text-slate-400">
                          {course.institution_name}
                          {course.duration_years != null && ` · ${course.duration_years} yr`}
                          {course.tuition_fee_aud != null && ` · A$${course.tuition_fee_aud.toLocaleString()}`}
                        </p>
                      </div>
                      {(course.cricos_url || course.website_url) && <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Related job links */}
          {seekUrl && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {t.employment.relatedJobs}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={getStateSeekUrl(seekUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-blue-50 border border-slate-200"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t.employment.seek}
                </a>
                <a
                  href={getStateIndeedUrl(name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-blue-50 border border-slate-200"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t.employment.indeed}
                </a>
              </div>
            </div>
          )}

          {/* Job openings */}
          <JobListings what={name} where={STATE_NAMES[stateCode] ?? stateCode} country="AU" />

          <AffiliateCtas />
        </div>
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        {t.map.source}
      </p>
    </>
  )
}

type IESchool = {
  id: number; slug: string; name_en: string; name_ko: string | null;
  city: string; lat: number | null; lng: number | null;
  price_range_week: string | null; accreditation: string[] | null;
  description_ko: string | null;
}

function IEPanel({
  schools,
  countyName,
  onClose,
}: {
  schools: IESchool[] | null
  countyName?: string
  onClose: () => void
}) {
  const t = useTranslations()
  const [ietab, setIetab] = useState<"schools" | "shortage">("schools")
  const [selectedSchool, setSelectedSchool] = useState<IESchool | null>(null)

  if (selectedSchool) {
    return (
      <>
        <div className="flex items-center justify-between px-5 pt-4">
          <button
            type="button"
            onClick={() => setSelectedSchool(null)}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.map.ieBack}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.map.close}
            className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <h2 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">
            {selectedSchool.name_en}
          </h2>
          {selectedSchool.name_ko && (
            <p className="text-sm text-muted-foreground mt-0.5">{selectedSchool.name_ko}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">{selectedSchool.city}</p>

          {selectedSchool.price_range_week && (
            <p className="mt-3 text-sm font-medium text-slate-700">
              {selectedSchool.price_range_week}
              <span className="text-xs text-slate-400 font-normal ml-1">{t.map.iePerWeek}</span>
            </p>
          )}

          {selectedSchool.accreditation && selectedSchool.accreditation.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {selectedSchool.accreditation.map((a: string) => (
                <span key={a} className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500">
                  {a}
                </span>
              ))}
            </div>
          )}

          {selectedSchool.description_ko && (
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{t.map.ieDescription}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedSchool.description_ko}</p>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex items-start justify-between gap-2 px-5 pt-4">
        <div>
          <h2 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">
            🇮🇪 {countyName ? `${countyName}` : t.map.ieIreland}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{countyName ? `${countyName} · ` : ""}{t.map.ieIreland}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pt-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-sm">
          <TabButton active={ietab === "schools"} onClick={() => setIetab("schools")}>
            {t.map.ieTabSchools}
          </TabButton>
          <TabButton active={ietab === "shortage"} onClick={() => setIetab("shortage")}>
            {t.map.ieTabShortage}
          </TabButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {ietab === "schools" && (
          schools === null ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-500" />
              <p className="text-sm text-slate-400">{t.map.ieLoading}</p>
            </div>
          ) : schools.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">{t.map.ieNoSchools}</p>
          ) : (
            <div className="space-y-2">
              {schools.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSchool(s)}
                  className="w-full text-left rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{s.name_en}</p>
                      {s.name_ko && <p className="text-xs text-muted-foreground">{s.name_ko}</p>}
                      <p className="mt-0.5 text-xs text-slate-400">{s.city}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 mt-1" />
                  </div>
                  {s.price_range_week && (
                    <p className="mt-1 text-xs font-medium text-slate-600">{s.price_range_week}{t.map.iePerWeek}</p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {s.accreditation?.slice(0, 2).map((a) => (
                      <span key={a} className="inline-flex items-center rounded-full border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500">{a}</span>
                    ))}
                  </div>
                  {s.description_ko && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{s.description_ko}</p>
                  )}
                </button>
              ))}
            </div>
          )
        )}
        {ietab === "shortage" && <IEShortageList />}
      </div>

      {ietab === "schools" && (
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          <Link href="/roi-explorer/ie/language-schools" className="text-blue-600 hover:underline">
            {t.map.ieViewAll}
          </Link>
        </p>
      )}
    </>
  )
}

function IEShortageList() {
  const t = useTranslations()
  const locale = useLocale()
  const occupations = useMemo(() => getShortageOccupations(), [])
  const [limit, setLimit] = useState(10)
  const visible = occupations.slice(0, limit)
  if (occupations.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.ieNoShortageData || t.map.noShortageData}</p>
  }
  return (
    <ol>
      {visible.map((r, i) => {
        const field = r.relatedBroadField ? getIscBroadField(r.relatedBroadField) : null
        return (
          <li key={r.socCode}>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-slate-800">
                  {r.category}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                  <span className="font-mono">SOC {r.socCode}</span>
                  {field && <span>· {locale === "ko" ? field.nameKo : field.nameEn}</span>}
                </span>
                {r.employments.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">{r.employments.slice(0, 3).join(", ")}</p>
                )}
              </span>
              <Badge tone={r.socLevel === "SOC-4" ? "blue" : "gray"}>{r.socLevel}</Badge>
            </div>
          </li>
        )
      })}
      {limit < occupations.length && (
        <li>
          <button
            type="button"
            onClick={() => setLimit((p) => Math.min(p + 10, occupations.length))}
            className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {t.map.ieShowMore} ({occupations.length - limit})
          </button>
        </li>
      )}
    </ol>
  )
}

function ShortageLabel({ rating, className }: { rating: number; className?: string }) {
  const locale = useLocale()
  const isKo = locale === "ko"
  if (rating >= 3) {
    return (
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200", className)}>
        {isKo ? "상" : "High"}
      </span>
    )
  }
  if (rating >= 2) {
    return (
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200", className)}>
        {isKo ? "중" : "Mid"}
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200", className)}>
      {isKo ? "하" : "Low"}
    </span>
  )
}

function Badge({ tone, children }: { tone: "green" | "gray" | "blue" | "amber"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "green"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : tone === "blue"
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : tone === "amber"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-slate-100 text-slate-500",
      )}
    >
      {children}
    </span>
  )
}

// ── UK components ──────────────────────────────────────────────────────────────

function UKHighPayList({ rows, onSelectOcc }: { rows: UKRegionOccupation[]; onSelectOcc?: (code: string) => void }) {
  const t = useTranslations()
  const locale = useLocale()
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {rows.map((r, i) => (
        <li key={r.soc_code}>
          <button
            type="button"
            onClick={() => onSelectOcc?.(r.soc_code)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums text-slate-700">
                {r.median_salary_gbp != null ? `£${r.median_salary_gbp.toLocaleString()}` : "—"}
              </span>
              {r.shortage_rating != null && (
                <span className="text-[10px] text-slate-400">Shortage: {r.shortage_rating}/5</span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ol>
  )
}

function UKOccupationDetail({
  occ,
  regionName,
  onBack,
  onClose,
  savedOccCodes,
  onToggleSave,
  onShare,
}: {
  occ: UKOccRow
  regionName: string
  onBack: () => void
  onClose: () => void
  savedOccCodes: Set<string>
  onToggleSave: (occCode: string, occTitle: string) => void
  onShare: () => void
}) {
  const isSaved = savedOccCodes.has(occ.soc_code)
  return (
    <>
      <div className="flex items-center gap-2 px-5 pt-4">
        <button type="button" onClick={onBack} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={onClose} className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{occ.occupation_en}</h3>
          {occ.occupation_ko && <p className="text-sm text-slate-500">{occ.occupation_ko}</p>}
          <p className="text-xs text-slate-400 mt-1">{regionName} · SOC {occ.soc_code}</p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="text-[11px] text-slate-500">Median Salary</p>
            <p className="text-lg font-bold text-slate-900">
              {occ.median_salary_gbp != null ? `£${occ.median_salary_gbp.toLocaleString()}` : "—"}
            </p>
          </div>
          {occ.on_sol && (
            <div className="flex-1 rounded-lg bg-emerald-50 px-3 py-2.5">
              <p className="text-[11px] text-emerald-600">Shortage Occupation</p>
              <p className="text-lg font-bold text-emerald-700">SOL</p>
            </div>
          )}
          {occ.on_isl && (
            <div className="flex-1 rounded-lg bg-blue-50 px-3 py-2.5">
              <p className="text-[11px] text-blue-600">Immigration Salary List</p>
              <p className="text-lg font-bold text-blue-700">ISL</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onToggleSave(occ.soc_code, occ.occupation_en)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-violet-500 text-violet-500" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={onShare} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>

        {occ.source_name && (
          <div className="rounded-lg border border-slate-200 px-3 py-2">
            <p className="text-[11px] text-slate-500">Source</p>
            <p className="text-xs text-slate-700">{occ.source_name}</p>
          </div>
        )}
      </div>
    </>
  )
}
