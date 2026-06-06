"use client"
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
const DIFF_BADGE: Record<Difficulty, string> = {
  easy:   "bg-[#FDD835] border-[#FDD835] text-[#0d1642]",
  normal: "bg-[#FB8C00] border-[#FB8C00] text-white",
  hard:   "bg-[#E53935] border-[#E53935] text-white",
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
      {/* ── Main HUD ── */}
      <div
        className="absolute top-0 left-0 right-0 h-14 z-[300] flex items-center px-3 gap-2"
        style={{
          background:   "linear-gradient(135deg,#0d1642,#1a237e)",
          borderBottom: "3px solid #FDD835",
          boxShadow:    "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* title */}
        <div className="font-pixel text-[0.625rem] text-white leading-tight shrink-0">
          VACANT<span style={{ color: "#FDD835" }}>.</span><br />DUBLIN
        </div>

        <div className="w-px h-8 bg-white/10 shrink-0" />

        {/* stats */}
        <Stat label="Best ROI"  value={bestROI > 0 ? `${bestROI.toFixed(0)}%` : "—"} color="#FDD835" />
        <div className="w-px h-8 bg-white/10 shrink-0" />
        <Stat label="주택 수"   value={totalHomes.toLocaleString()}                   color="#A5D6A7" />
        <div className="w-px h-8 bg-white/10 shrink-0" />
        <Stat label="노숙자↓"  value={`+${totalHLReduced}`}                          color="#81D4FA" />
        <div className="w-px h-8 bg-white/10 shrink-0" />
        <Stat label="예산"      value={`€${budgetM}M`}                               color="#90CAF9" />

        {/* difficulty badge (read-only) */}
        <div className="flex-1 flex justify-center items-center">
          <div className={`font-pixel text-[0.625rem] border-2 rounded px-3 py-1 ${DIFF_BADGE[difficulty]}`}>
            {DIFF_LABELS[difficulty]}
          </div>
        </div>

        {/* right buttons */}
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={onToggleLB}
            className="font-pixel text-[0.625rem] border-2 border-[#FDD835] text-[#FDD835] bg-transparent rounded px-2.5 py-1 cursor-pointer hover:bg-[#FDD835] hover:text-[#0d1642] transition-all"
          >
            🏆
          </button>
          <button
            onClick={onShare}
            className="font-pixel text-[0.625rem] border-2 border-[#FDD835] bg-[#FDD835] text-[#0d1642] rounded px-2.5 py-1 cursor-pointer hover:bg-[#ffe57f] transition-all"
          >
            📤 공유
          </button>
        </div>
      </div>

      {/* ── Impact bar ── */}
      <div
        className="absolute left-0 right-0 z-[250] flex items-center px-4 gap-5 text-white"
        style={{
          top:             56,
          height:          32,
          fontSize:        "0.615rem",
          background:      "rgba(8,14,40,0.9)",
          borderBottom:    "1px solid rgba(255,255,255,0.06)",
          backdropFilter:  "blur(10px)",
        }}
      >
        <span>🏙️ 더블린 평균 월세: <strong className="text-white">€{rent.toLocaleString()}</strong>/월</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span>🏕️ 긴급 노숙자: <strong className="text-white">{homeless.toLocaleString()}명</strong></span>
        {showMyImpact && (
          <>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span className="text-[#A5D6A7]">
              📉 내 기여: 월세 <strong>-€{Math.round(totalRentDrop)}</strong> · 노숙자 <strong>-{totalHLReduced}명</strong>
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-[5px] h-[5px] bg-[#E53935] rounded-full animate-pulse" />
          <span>실시간 더블린 주택 위기</span>
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center min-w-[68px]">
      <div className="font-pixel text-[1rem]" style={{ color }}>{value}</div>
      <div className="text-[0.525rem] text-white/60 mt-0.5 uppercase tracking-[0.04em]">{label}</div>
    </div>
  )
}
