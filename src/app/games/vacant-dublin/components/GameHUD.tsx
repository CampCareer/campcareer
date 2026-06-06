"use client"
import type { CSSProperties } from "react"
import type { Difficulty } from "../hooks/useGameState"
import { BASE_RENT, BASE_HL } from "../hooks/useGameState"

interface Props {
  bestROI:        number
  totalHomes:     number
  totalHLReduced: number
  budget:         number
  difficulty:     Difficulty
  totalRentDrop:  number
  onToggleLB:     () => void
  onShare:        () => void
}

const DIFF_LABELS: Record<Difficulty, string> = { easy: "😊 EASY", normal: "😤 NORMAL", hard: "💀 HARD" }
const DIFF_BADGE: Record<Difficulty, CSSProperties> = {
  easy:   { background: "#FDD835", color: "#0d1642", border: "2px solid #FDD835" },
  normal: { background: "#FB8C00", color: "#fff",    border: "2px solid #FB8C00" },
  hard:   { background: "#E53935", color: "#fff",    border: "2px solid #E53935" },
}

export function GameHUD({
  bestROI, totalHomes, totalHLReduced, budget, difficulty,
  totalRentDrop, onToggleLB, onShare,
}: Props) {
  const budgetM      = (budget / 1e6).toFixed(1)
  const rent         = Math.max(1800, Math.round(BASE_RENT - totalRentDrop))
  const homeless     = Math.max(0, BASE_HL - totalHLReduced)
  const showMyImpact = totalHLReduced > 0 || totalRentDrop > 0

  return (
    <>
      {/* ── Main HUD (72px) ── */}
      <div
        className="absolute top-0 left-0 right-0 z-[300] flex items-center px-4 gap-3"
        style={{
          height:       72,
          background:   "linear-gradient(135deg,#0d1642,#1a237e)",
          borderBottom: "3px solid #FDD835",
          boxShadow:    "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* logo */}
        <div
          className="font-pixel leading-tight shrink-0 text-white"
          style={{ fontSize: 16 }}
        >
          VACANT<span style={{ color: "#FDD835" }}>.</span><br />DUBLIN
        </div>

        <div className="w-px h-10 bg-white/10 shrink-0" />

        {/* stats */}
        <Stat label="Best ROI"  value={bestROI > 0 ? `${bestROI.toFixed(0)}%` : "—"} color="#FDD835" />
        <div className="w-px h-10 bg-white/10 shrink-0" />
        <Stat label="주택 수"   value={totalHomes.toLocaleString()}                   color="#A5D6A7" />
        <div className="w-px h-10 bg-white/10 shrink-0" />
        <Stat label="노숙자↓"  value={`+${totalHLReduced}`}                          color="#81D4FA" />
        <div className="w-px h-10 bg-white/10 shrink-0" />
        <Stat label="예산"      value={`€${budgetM}M`}                               color="#90CAF9" />

        {/* difficulty badge */}
        <div className="flex-1 flex justify-center items-center">
          <div
            className="font-pixel rounded px-3 py-1.5"
            style={{ fontSize: 13, ...DIFF_BADGE[difficulty] }}
          >
            {DIFF_LABELS[difficulty]}
          </div>
        </div>

        {/* right buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onToggleLB}
            className="font-pixel rounded px-3 py-1.5 cursor-pointer transition-all"
            style={{
              fontSize:    13,
              border:      "2px solid #FDD835",
              color:       "#FDD835",
              background:  "transparent",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FDD835"; (e.currentTarget as HTMLButtonElement).style.color = "#0d1642" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#FDD835" }}
          >
            🏆
          </button>
          <button
            onClick={onShare}
            className="font-pixel rounded px-3 py-1.5 cursor-pointer transition-all"
            style={{
              fontSize:   13,
              border:     "2px solid #FDD835",
              background: "#FDD835",
              color:      "#0d1642",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ffe57f" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FDD835" }}
          >
            📤 공유
          </button>
        </div>
      </div>

      {/* ── Impact bar (36px, top 72) ── */}
      <div
        className="absolute left-0 right-0 z-[250] flex items-center px-4 gap-5 text-white"
        style={{
          top:            72,
          height:         36,
          fontSize:       13,
          background:     "rgba(8,14,40,0.92)",
          borderBottom:   "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(10px)",
        }}
      >
        <span>🏙️ 더블린 평균 월세: <strong>€{rent.toLocaleString()}</strong>/월</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span>🏕️ 긴급 노숙자: <strong>{homeless.toLocaleString()}명</strong></span>
        {showMyImpact && (
          <>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ color: "#A5D6A7" }}>
              📉 내 기여: 월세 <strong>-€{Math.round(totalRentDrop)}</strong> · 노숙자 <strong>-{totalHLReduced}명</strong>
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-[6px] h-[6px] bg-[#E53935] rounded-full animate-pulse" />
          <span>실시간 더블린 주택 위기</span>
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center" style={{ minWidth: 72 }}>
      <div className="font-pixel" style={{ fontSize: 16, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
    </div>
  )
}
