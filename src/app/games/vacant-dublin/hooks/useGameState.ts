"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { SITES } from "../data/sites"
import { OBSTACLES, UNCLE_LINES } from "../data/obstacles"
import type { Site } from "../data/sites"
import type { Obstacle } from "../data/obstacles"
import { createClient } from "@/lib/supabase-client"

// ─── constants ────────────────────────────────────────────────────────────────
export const BASE_RENT = 2300
export const BASE_HL   = 13_400

const COST = { standard: 420_000, modular: 294_000 }
const UPF  = 18          // units per floor per hectare
const MR   = 2340 * 12   // market rent (annual)
const SR   = 800  * 12   // social rent (annual)
const VAC  = 0.05
const OPEX = 0.25

// ─── types ────────────────────────────────────────────────────────────────────
export type Method     = "standard" | "modular"
export type Tenure     = "market"   | "mixed" | "social"
export type Difficulty = "easy"     | "normal" | "hard"

export interface CalcResult {
  bc: number; totalInv: number; netRev: number
  roi: number; totalUnits: number; payback: number; profit10: number
}

export interface PendingScore {
  roi: number; units: number; totalInv: number; profit10: number
  site: string; method: Method; floors: number; tenure: Tenure
  id: string; diff: Difficulty; hlReduced?: number; rentDrop?: number
}

export interface ModalData {
  roi: number; units: number; profit10: number; site: string
  extra: number; hlR: number; rentR: number
}

export interface LeaderboardEntry {
  id?: string
  player_name: string; roi: number; units: number
  site: string; method: string; floors: number
  tenure: string; difficulty: string; created_at?: string
}

export interface CharacterData {
  name: string
  age: number
  gender: "남성" | "여성" | "기타"
  skinColor: string
  hairStyle: string
}

const DEFAULT_CHARACTER: CharacterData = {
  name: "김석준",
  age: 25,
  gender: "남성",
  skinColor: "#FDDBB4",
  hairStyle: "🧑",
}

// ─── pure helpers ─────────────────────────────────────────────────────────────
export function impactPerUnit(t: Tenure) {
  if (t === "social") return { hl: 2.2,  rent: 0.019 }
  if (t === "mixed")  return { hl: 0.9,  rent: 0.014 }
  return                     { hl: 0.25, rent: 0.007 }
}

export function calcGame(
  site: Site, m: Method, t: Tenure, fl: number, diff: Difficulty, extra: number
): CalcResult {
  const upf        = Math.max(4, Math.round(site.area * UPF))
  const totalUnits = upf * fl
  let bc = totalUnits * COST[m], lc = site.landVal
  if (diff !== "easy") { lc *= 1.075; bc *= 1.135; bc += totalUnits * 12_000; bc += 45_000 }
  const totalInv = bc + lc + extra
  let ar = 0
  if (t === "market") ar = totalUnits * MR * (1 - VAC)
  else if (t === "mixed") {
    const mu = Math.round(totalUnits * 0.7), su = totalUnits - mu
    ar = (mu * MR + su * SR) * (1 - VAC) + su * 75_000 * 0.1
  } else ar = totalUnits * SR
  const netRev  = ar * (1 - OPEX)
  const payback = totalInv / netRev
  const p10     = netRev * 10 - totalInv
  return { bc, totalInv, netRev, roi: (p10 / totalInv) * 100, totalUnits, payback, profit10: p10 }
}

// ─── hook ─────────────────────────────────────────────────────────────────────
export function useGameState() {
  // render state
  const [introComplete,  setIntroComplete]  = useState(false)
  const [showHint,       setShowHint]       = useState(false)
  const [curSiteId,      setCurSiteId]      = useState<string | null>(null)
  const [method,         setMethod]         = useState<Method>("standard")
  const [tenure,         setTenure]         = useState<Tenure>("market")
  const [floors,         setFloors]         = useState(6)
  const [difficulty,     setDifficulty]     = useState<Difficulty>("easy")
  const [budget,         setBudget]         = useState(50_000_000)
  const [developed,      setDeveloped]      = useState<Set<string>>(new Set())
  const [bestROI,        setBestROI]        = useState(0)
  const [totalHomes,     setTotalHomes]     = useState(0)
  const [totalHLReduced, setTotalHLReduced] = useState(0)
  const [totalRentDrop,  setTotalRentDrop]  = useState(0)
  const [pendingScore,   setPendingScore]   = useState<PendingScore | null>(null)
  const [showPanel,      setShowPanel]      = useState(false)
  const [showLB,         setShowLB]         = useState(false)
  const [showModal,      setShowModal]      = useState(false)
  const [showShare,      setShowShare]      = useState(false)
  const [modalData,      setModalData]      = useState<ModalData | null>(null)
  const [leaderboard,    setLeaderboard]    = useState<LeaderboardEntry[]>([])
  const [lbTotal,        setLbTotal]        = useState(0)
  const [toast,          setToast]          = useState<{ msg: string; warn: boolean } | null>(null)
  const [uncleMsg,       setUncleMsg]       = useState("")
  const [uncleVisible,   setUncleVisible]   = useState(false)
  const [showEvent,      setShowEvent]      = useState(false)
  const [currentEvent,   setCurrentEvent]   = useState<{ ev: Obstacle; cost: number } | null>(null)
  const [calcResult,     setCalcResult]     = useState<CalcResult | null>(null)

  // mutable ref — always-fresh values for callbacks (avoids stale closures)
  const [character, setCharacter] = useState<CharacterData>(DEFAULT_CHARACTER)

  const g = useRef({
    curSiteId:    null as string | null,
    method:       "standard" as Method,
    tenure:       "market"   as Tenure,
    floors:       6,
    difficulty:   "easy"     as Difficulty,
    budget:       50_000_000,
    developed:    new Set<string>(),
    pendingScore: null       as PendingScore | null,
    evQueue:      []         as Obstacle[],
    evIdx:        0,
    evCostAccum:  0,
    evCurCost:    0,
    character:    DEFAULT_CHARACTER as CharacterData,
  })

  const uncleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const curSite = curSiteId ? (SITES.find(s => s.id === curSiteId) ?? null) : null

  // ── toast ───────────────────────────────────────────────────────────────────
  const doToast = useCallback((msg: string, warn = false) => {
    setToast({ msg, warn })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2900)
  }, [])

  // ── uncle ───────────────────────────────────────────────────────────────────
  const doUncle = useCallback((type: string, vars: Record<string, string | number> = {}) => {
    if (uncleTimer.current) clearTimeout(uncleTimer.current)
    const site = g.current.curSiteId ? SITES.find(s => s.id === g.current.curSiteId) : null
    let lines: string[]
    const ul = UNCLE_LINES as Record<string, string | string[] | Record<string, string>>
    if      (type === "idle")   lines = UNCLE_LINES.idle
    else if (type === "select") lines = site ? [(UNCLE_LINES.select as Record<string, string>)[site.type] ?? UNCLE_LINES.select.Vacant] : []
    else if (type === "budget") lines = [UNCLE_LINES.budget]
    else if (Array.isArray(ul[type])) lines = ul[type] as string[]
    else return
    if (!lines.length) return
    let line = lines[Math.floor(Math.random() * lines.length)]
    if (site) line = line.replace("{years}", String(site.years))
    line = line
      .replace("{name}",  g.current.character.name || "플레이어")
      .replace("{roi}",   vars.roi   !== undefined ? Number(vars.roi).toFixed(0) : "?")
      .replace("{units}", vars.units !== undefined ? String(vars.units)          : "?")
    setUncleMsg(line)
    setUncleVisible(true)
    uncleTimer.current = setTimeout(() => setUncleVisible(false), 5500)
  }, [])

  // ── finalize build ──────────────────────────────────────────────────────────
  const doFinalizeBuild = useCallback((extra: number) => {
    const { curSiteId: sid, method: m, tenure: t, floors: fl, difficulty: diff, budget: bgt, developed: dev } = g.current
    const site = sid ? SITES.find(s => s.id === sid) : null
    if (!site) return
    const res = calcGame(site, m, t, fl, diff, extra)
    const { roi, totalInv, profit10, totalUnits } = res

    g.current.budget    = bgt - totalInv
    g.current.developed = new Set(Array.from(dev).concat(site.id))
    g.current.curSiteId = null
    setBudget(bgt - totalInv)
    setDeveloped(new Set(Array.from(dev).concat(site.id)))
    setTotalHomes(prev => prev + totalUnits)
    setBestROI(prev   => Math.max(prev, roi))

    const ip   = impactPerUnit(t)
    const hlR  = Math.round(totalUnits * ip.hl)
    const rentR = parseFloat((totalUnits * ip.rent).toFixed(0))
    setTotalHLReduced(prev => prev + hlR)
    setTotalRentDrop(prev  => prev + rentR)

    const ps: PendingScore = {
      roi, units: totalUnits, totalInv, profit10, site: site.name,
      method: m, floors: fl, tenure: t, id: site.id, diff, hlReduced: hlR, rentDrop: rentR,
    }
    g.current.pendingScore = ps
    setPendingScore(ps)
    setCurSiteId(null)
    setShowPanel(false)
    setModalData({ roi, units: totalUnits, profit10, site: site.name, extra, hlR, rentR })
    setShowModal(true)
    setTimeout(() => doUncle("complete", { units: totalUnits }), 600)
  }, [doUncle])

  // ── resolve event ───────────────────────────────────────────────────────────
  const resolveEvent = useCallback((accept: boolean) => {
    setShowEvent(false)
    if (!accept) {
      doToast("🚫 건설 포기. 땅이 여전히 비어 있습니다.", true)
      setShowPanel(false)
      setCurSiteId(null)
      g.current.curSiteId = null
      return
    }
    g.current.evCostAccum += g.current.evCurCost
    g.current.evIdx += 1
    setTimeout(() => {
      if (g.current.evIdx < g.current.evQueue.length) {
        const ev = g.current.evQueue[g.current.evIdx]
        const ps = g.current.pendingScore
        let ec = 0
        if (ps) {
          if      (ev.type === "cost")    ec = ps.totalInv * (ev.pct     ?? 0)
          else if (ev.type === "flat")    ec = ev.flat     ?? 0
          else if (ev.type === "perUnit") ec = (ev.perUnit ?? 0) * ps.units
        }
        g.current.evCurCost = ec
        setCurrentEvent({ ev, cost: ec })
        setShowEvent(true)
        if (ev.emoji === "🪧" || ev.title.includes("님비")) doUncle("nimby")
      } else {
        doFinalizeBuild(g.current.evCostAccum)
      }
    }, 300)
  }, [doToast, doFinalizeBuild, doUncle])

  // ── select site ─────────────────────────────────────────────────────────────
  const selectSite = useCallback((id: string) => {
    if (g.current.developed.has(id)) return
    const site = SITES.find(s => s.id === id)
    if (!site) return
    g.current.curSiteId = id
    g.current.method    = "standard"
    g.current.tenure    = "market"
    g.current.floors    = 6
    setCurSiteId(id)
    setMethod("standard")
    setTenure("market")
    setFloors(6)
    const r = calcGame(site, "standard", "market", 6, g.current.difficulty, 0)
    setCalcResult(r)
    const ps: PendingScore = {
      roi: r.roi, units: r.totalUnits, totalInv: r.totalInv, profit10: r.profit10,
      site: site.name, method: "standard", floors: 6, tenure: "market",
      id: site.id, diff: g.current.difficulty,
    }
    g.current.pendingScore = ps
    setPendingScore(ps)
    setShowPanel(true)
    setShowLB(false)
    setTimeout(() => doUncle("select"), 700)
  }, [doUncle])

  // ── build controls ──────────────────────────────────────────────────────────
  const updateCalc = useCallback((override: Partial<{ m: Method; t: Tenure; fl: number; d: Difficulty }>) => {
    const m  = override.m  ?? g.current.method
    const t  = override.t  ?? g.current.tenure
    const fl = override.fl ?? g.current.floors
    const d  = override.d  ?? g.current.difficulty
    const site = g.current.curSiteId ? SITES.find(s => s.id === g.current.curSiteId) : null
    if (!site) return
    const r = calcGame(site, m, t, fl, d, 0)
    setCalcResult(r)
    const ps: PendingScore = {
      roi: r.roi, units: r.totalUnits, totalInv: r.totalInv, profit10: r.profit10,
      site: site.name, method: m, floors: fl, tenure: t, id: site.id, diff: d,
    }
    g.current.pendingScore = ps
    setPendingScore(ps)
    if (r.roi < 20) setTimeout(() => doUncle("lowROI"), 300)
    else if (r.roi > 80) setTimeout(() => doUncle("highROI", { roi: r.roi }), 300)
  }, [doUncle])

  const handleMethodChange = useCallback((m: Method) => {
    g.current.method = m; setMethod(m); updateCalc({ m })
  }, [updateCalc])

  const handleTenureChange = useCallback((t: Tenure) => {
    g.current.tenure = t; setTenure(t); updateCalc({ t })
  }, [updateCalc])

  const handleFloorsChange = useCallback((fl: number) => {
    g.current.floors = fl; setFloors(fl); updateCalc({ fl })
  }, [updateCalc])

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    g.current.difficulty = d; setDifficulty(d); updateCalc({ d })
  }, [updateCalc])

  // ── start build ─────────────────────────────────────────────────────────────
  const startBuild = useCallback(() => {
    const ps   = g.current.pendingScore
    const diff = g.current.difficulty
    if (!ps) return
    if (ps.totalInv > g.current.budget) {
      doToast(`❌ 예산 부족! €${(ps.totalInv / 1e6).toFixed(1)}M 필요`, true)
      doUncle("budget")
      return
    }
    if (diff === "easy") { doFinalizeBuild(0); return }
    const pool = [...OBSTACLES.normal, ...(diff === "hard" ? OBSTACLES.hard : [])]
    pool.sort(() => Math.random() - 0.5)
    const queue = pool.slice(0, diff === "normal" ? 2 : 4)
    g.current.evQueue     = queue
    g.current.evIdx       = 0
    g.current.evCostAccum = 0
    const ev = queue[0]
    let ec = 0
    if      (ev.type === "cost")    ec = ps.totalInv * (ev.pct     ?? 0)
    else if (ev.type === "flat")    ec = ev.flat     ?? 0
    else if (ev.type === "perUnit") ec = (ev.perUnit ?? 0) * ps.units
    g.current.evCurCost = ec
    setCurrentEvent({ ev, cost: ec })
    setShowEvent(true)
    if (ev.emoji === "🪧" || ev.title.includes("님비")) doUncle("nimby")
  }, [doToast, doUncle, doFinalizeBuild])

  // ── leaderboard ─────────────────────────────────────────────────────────────
  const loadLeaderboard = useCallback(async () => {
    try {
      const { data } = await createClient()
        .from("game_scores")
        .select("*")
        .order("roi", { ascending: false })
        .limit(20)
      if (data) {
        setLeaderboard(data as LeaderboardEntry[])
        setLbTotal(data.reduce((s: number, e: { units?: number }) => s + (e.units ?? 0), 0))
      }
    } catch { /* table may not exist yet */ }
  }, [])

  const saveScore = useCallback(async (playerName: string) => {
    const ps = g.current.pendingScore
    if (!ps) return
    try {
      await createClient().from("game_scores").insert({
        player_name: (playerName.trim() || "ANON").toUpperCase().slice(0, 20),
        roi: ps.roi, units: ps.units, site: ps.site,
        method: ps.method, floors: ps.floors, tenure: ps.tenure, difficulty: ps.diff,
      })
    } catch { /* graceful */ }
    setShowModal(false)
    doToast("✅ 개발 완료! 다음 땅을 고르세요.")
    loadLeaderboard()
  }, [doToast, loadLeaderboard])

  const closeModal = useCallback(() => {
    setShowModal(false)
    doToast("✅ 개발 완료! 다음 땅을 고르세요.")
  }, [doToast])

  const completeIntro = useCallback((char: CharacterData, diff: Difficulty) => {
    g.current.character  = char
    g.current.difficulty = diff
    setCharacter(char)
    setDifficulty(diff)
    setIntroComplete(true)
    setShowHint(true)
    setTimeout(() => doUncle("idle"), 1200)
  }, [doUncle])

  // ── effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadLeaderboard()
    const id = setInterval(loadLeaderboard, 18_000)
    return () => clearInterval(id)
  }, [loadLeaderboard])

  useEffect(() => {
    if (!introComplete) return
    const id = setInterval(() => { if (!g.current.curSiteId) doUncle("idle") }, 30_000)
    return () => clearInterval(id)
  }, [introComplete, doUncle])

  return {
    introComplete, showHint, setShowHint,
    character,
    curSite, method, tenure, floors, difficulty,
    budget, developed, bestROI, totalHomes, totalHLReduced, totalRentDrop,
    pendingScore, showPanel, setShowPanel, showLB, setShowLB,
    showModal, showShare, setShowShare, modalData,
    leaderboard, lbTotal, toast, uncleMsg, uncleVisible, setUncleVisible,
    showEvent, currentEvent, calcResult,
    completeIntro, selectSite,
    handleMethodChange, handleTenureChange, handleFloorsChange, handleDifficultyChange,
    startBuild, resolveEvent, saveScore, closeModal, loadLeaderboard,
    doToast, doUncle,
  }
}
