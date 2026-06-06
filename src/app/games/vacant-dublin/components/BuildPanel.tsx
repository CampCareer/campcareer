"use client"
import type { Site } from "../data/sites"
import type { CalcResult, Method, Tenure, Difficulty, PendingScore } from "../hooks/useGameState"
import { impactPerUnit } from "../hooks/useGameState"

interface Props {
  isOpen:       boolean
  site:         Site | null
  method:       Method
  tenure:       Tenure
  floors:       number
  difficulty:   Difficulty
  calcResult:   CalcResult | null
  pendingScore: PendingScore | null
  onMethod:     (m: Method) => void
  onTenure:     (t: Tenure) => void
  onFloors:     (f: number) => void
  onBuild:      () => void
  onClose:      () => void
}

const UNIT_COLORS: Record<string, string> = {
  standard: "#E53935",
  modular:  "#FDD835",
  social:   "#42A5F5",
  mixed:    "#66BB6A",
}

function BuildingPreview({ cols, floors, method, tenure }: { cols: number; floors: number; method: Method; tenure: Tenure }) {
  const c     = tenure === "social" ? UNIT_COLORS.social : tenure === "mixed" ? UNIT_COLORS.mixed : UNIT_COLORS[method]
  const cols2 = Math.min(cols, 9)
  const rows  = Array.from({ length: floors }, (_, i) => i)
  return (
    <div
      className="relative rounded-xl mb-3 p-3 flex flex-col items-center gap-px min-h-[106px] justify-end overflow-hidden"
      style={{ background: "linear-gradient(180deg,#87CEEB 0%,#B3E5FC 55%,#5D8A3C 55%,#4a7a2e 100%)", border: "2px solid rgba(255,255,255,0.12)" }}
    >
      <span className="absolute top-1.5 right-2 text-sm">☀️</span>
      {/* building */}
      <div className="flex flex-col items-center gap-px relative z-10">
        {rows.map(r => (
          <div key={r} className="flex gap-px">
            {Array.from({ length: cols2 }).map((_, u) => (
              <div
                key={u}
                className="w-[11px] h-[8px] rounded-sm"
                style={{ background: c, boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.25),inset -1px -1px 0 rgba(0,0,0,0.2)" }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="w-full h-[3px] bg-[#4a7a2e] rounded-sm relative z-10" />
      {/* road */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[7px] bg-[#78909C]"
        style={{ backgroundImage: "repeating-linear-gradient(90deg,white 0,white 10px,transparent 10px,transparent 20px)", backgroundSize: "20px 2px", backgroundPosition: "center" }}
      />
    </div>
  )
}

function Chip({ active, onClick, children, variant = "default" }: { active: boolean; onClick: () => void; children: React.ReactNode; variant?: "default" | "green" | "blue" }) {
  const activeClass = variant === "green"
    ? "bg-[#43A047] border-[#43A047] text-white"
    : variant === "blue"
    ? "bg-[#1E88E5] border-[#1E88E5] text-white"
    : "bg-[#FDD835] border-[#FDD835] text-[#0d1642]"
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-2xl border-2 text-[0.585rem] font-bold cursor-pointer transition-all whitespace-nowrap ${active ? activeClass : "bg-white/5 border-white/15 text-white/48 hover:border-[#FDD835] hover:text-white"}`}
    >
      {children}
    </button>
  )
}

export function BuildPanel({
  isOpen, site, method, tenure, floors, difficulty,
  calcResult: r, pendingScore: ps,
  onMethod, onTenure, onFloors, onBuild, onClose,
}: Props) {
  if (!site) return null
  const upf   = Math.max(4, Math.round(site.area * 18))
  const ip    = impactPerUnit(tenure)
  const hlEst = r ? Math.round(r.totalUnits * ip.hl)   : 0
  const reEst = r ? (r.totalUnits * ip.rent).toFixed(0) : "0"
  const roiC  = r ? (r.roi > 80 ? "#A5D6A7" : r.roi > 30 ? "#FDD835" : r.roi > 0 ? "#fff" : "#EF9A9A") : "#fff"
  const roiW  = r ? Math.min(100, Math.max(0, r.roi / 2)) : 0

  return (
    <div
      className="absolute top-[88px] right-0 bottom-0 w-[328px] z-[200] flex flex-col transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
      style={{
        background:      "rgba(13,22,66,0.96)",
        borderLeft:      "2px solid rgba(255,255,255,0.08)",
        backdropFilter:  "blur(14px)",
        transform:       isOpen ? "translateX(0)" : "translateX(328px)",
      }}
    >
      {/* close tab */}
      <button
        onClick={onClose}
        className="absolute left-[-36px] top-[0.65rem] w-8 h-8 flex items-center justify-center text-sm text-white/60 rounded-l-lg cursor-pointer hover:text-white transition-colors"
        style={{ background: "rgba(13,22,66,0.96)", border: "2px solid rgba(255,255,255,0.1)", borderRight: "none" }}
      >
        ✕
      </button>

      {/* header */}
      <div className="px-4 py-3 border-b border-white/8 bg-white/[0.03]">
        <div className="text-[0.49rem] text-white/50 mb-0.5">{site.id} · {site.years}년 방치</div>
        <div className="font-pixel text-[0.625rem] text-white leading-relaxed mb-0.5">{site.name}</div>
        <div className="text-[0.53rem] text-white/50">{site.owner} · {site.area}ha</div>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#FDD835]">

        <BuildingPreview cols={upf} floors={floors} method={method} tenure={tenure} />

        {/* construction method */}
        <div>
          <div className="font-pixel text-[0.625rem] text-[#FDD835] mb-2 tracking-[0.04em]">🏗 건설 방식</div>
          <div className="flex gap-1.5 flex-wrap">
            <Chip active={method === "standard"} onClick={() => onMethod("standard")}>🏛 Standard</Chip>
            <Chip active={method === "modular"}  onClick={() => onMethod("modular")}  variant="green">
              📦 Modular <span className="text-[0.49rem] text-[#A5D6A7]">−30%</span>
            </Chip>
          </div>
        </div>

        {/* tenure */}
        <div>
          <div className="font-pixel text-[0.625rem] text-[#FDD835] mb-2 tracking-[0.04em]">🏘 임대 유형</div>
          <div className="flex gap-1.5 flex-wrap">
            <Chip active={tenure === "market"} onClick={() => onTenure("market")}>💰 시장가</Chip>
            <Chip active={tenure === "mixed"}  onClick={() => onTenure("mixed")}  variant="green">⚖ 혼합</Chip>
            <Chip active={tenure === "social"} onClick={() => onTenure("social")} variant="blue">🏘 사회주택</Chip>
          </div>
        </div>

        {/* floors slider */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/8">
          <div className="flex justify-between mb-2">
            <span className="text-[0.585rem] text-white/60">층수 (Floors)</span>
            <span className="font-pixel text-[0.75rem] text-[#FDD835]">{floors}F</span>
          </div>
          <input
            type="range" min={3} max={20} value={floors}
            onChange={e => onFloors(parseInt(e.target.value))}
            className="w-full h-[5px] bg-white/16 rounded appearance-none outline-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
              [&::-webkit-slider-thumb]:bg-[#FDD835] [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-md"
          />
          <div className="flex justify-between text-[0.455rem] text-white/30 mt-1">
            <span>3F</span><span>20F</span>
          </div>
        </div>

        {/* stats grid */}
        {r && (
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { v: r.totalUnits.toString(),               l: "세대 수",   c: "#90CAF9" },
              { v: `€${(r.totalInv / 1e6).toFixed(1)}M`, l: "총 비용",   c: "#EF9A9A" },
              { v: `€${(r.netRev / 1e3).toFixed(0)}K`,   l: "연 순수익", c: "#A5D6A7" },
              { v: `${r.payback.toFixed(1)}yr`,           l: "회수 기간", c: "#FFE082" },
            ].map(({ v, l, c }) => (
              <div key={l} className="bg-white/[0.04] rounded-lg p-3 border border-white/7">
                <div className="font-pixel text-[0.73rem] leading-tight" style={{ color: c }}>{v}</div>
                <div className="text-[0.48rem] text-white/40 mt-0.5 uppercase">{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* ROI box */}
        {r && (
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "linear-gradient(135deg,rgba(255,184,0,.1),rgba(229,57,53,.1))", border: "2px solid rgba(255,184,0,.28)" }}
          >
            <div className="font-pixel text-[1.59rem] leading-none mb-1" style={{ color: roiC }}>{r.roi.toFixed(0)}%</div>
            <div className="text-[0.49rem] text-white/50">10년 ROI (10-Year Return)</div>
            <div className="mt-2 h-[6px] bg-black/30 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-500"
                style={{ width: `${roiW}%`, background: "linear-gradient(90deg,#43A047,#FDD835,#E53935)" }}
              />
            </div>
          </div>
        )}

        {/* social impact preview */}
        <div
          className="rounded-xl px-3 py-2"
          style={{ background: "rgba(67,160,71,.08)", border: "1px solid rgba(67,160,71,.22)" }}
        >
          <div className="text-[0.48rem] text-white/50 uppercase tracking-[0.05em] mb-2">🏕️ 사회적 임팩트 예측</div>
          <div className="flex justify-between text-[0.65rem] text-white/80 mb-1">
            <span>노숙자 감소</span>
            <span className="font-bold text-[#A5D6A7]">{hlEst}명</span>
          </div>
          <div className="flex justify-between text-[0.65rem] text-white/80">
            <span>월세 인하 기여</span>
            <span className="font-bold text-[#A5D6A7]">-€{reEst}/월</span>
          </div>
        </div>

        {/* difficulty notice */}
        {difficulty !== "easy" && (
          <div
            className="rounded-xl p-2.5 text-[0.53rem] text-white/70 leading-relaxed"
            style={
              difficulty === "normal"
                ? { background: "rgba(229,57,53,.09)", border: "1px solid rgba(229,57,53,.28)" }
                : { background: "rgba(229,57,53,.15)", border: "1px solid rgba(229,57,53,.45)" }
            }
            dangerouslySetInnerHTML={{
              __html: difficulty === "normal"
                ? "⚠ <b style='color:#FB8C00'>NORMAL:</b> 취득세 7.5%, VAT 13.5%, 개발부담금 등 실제 세금 적용."
                : "💀 <b style='color:#E53935'>HARD:</b> 모든 세금 + 님비·파업·행정지연·고고학 발굴 등 랜덤 이벤트!",
            }}
          />
        )}

        {/* build button */}
        <button
          onClick={onBuild}
          disabled={!ps}
          className="w-full py-3 rounded-xl font-pixel text-[0.625rem] text-[#0d1642] cursor-pointer tracking-[0.04em] transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          style={{ background: "linear-gradient(135deg,#FDD835,#FFB300)", boxShadow: "0 4px 15px rgba(253,216,53,.28)" }}
        >
          🏗 건설 시작!
        </button>
      </div>
    </div>
  )
}
