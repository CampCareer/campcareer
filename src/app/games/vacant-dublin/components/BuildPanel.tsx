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
      className="relative rounded-xl mb-3 p-3 flex flex-col items-center gap-px min-h-[110px] justify-end overflow-hidden"
      style={{ background: "linear-gradient(180deg,#87CEEB 0%,#B3E5FC 55%,#5D8A3C 55%,#4a7a2e 100%)", border: "2px solid rgba(255,255,255,0.12)" }}
    >
      <span className="absolute top-1.5 right-2 text-sm">☀️</span>
      <div className="flex flex-col items-center gap-px relative z-10">
        {rows.map(r => (
          <div key={r} className="flex gap-px">
            {Array.from({ length: cols2 }).map((_, u) => (
              <div
                key={u}
                className="w-[12px] h-[9px] rounded-sm"
                style={{ background: c, boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.25),inset -1px -1px 0 rgba(0,0,0,0.2)" }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="w-full h-[3px] bg-[#4a7a2e] rounded-sm relative z-10" />
      <div
        className="absolute bottom-0 left-0 right-0 h-[8px] bg-[#78909C]"
        style={{ backgroundImage: "repeating-linear-gradient(90deg,white 0,white 10px,transparent 10px,transparent 20px)", backgroundSize: "20px 2px", backgroundPosition: "center" }}
      />
    </div>
  )
}

function Chip({
  active, onClick, children, variant = "default",
}: {
  active: boolean; onClick: () => void; children: React.ReactNode; variant?: "default" | "green" | "blue"
}) {
  const activeStyle =
    variant === "green" ? { background: "#43A047", borderColor: "#43A047", color: "#fff" } :
    variant === "blue"  ? { background: "#1E88E5", borderColor: "#1E88E5", color: "#fff" } :
                          { background: "#FDD835", borderColor: "#FDD835", color: "#0d1642" }
  const inactiveStyle = { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 font-bold cursor-pointer transition-all whitespace-nowrap"
      style={{
        padding:  "8px 12px",
        fontSize: 13,
        ...(active ? activeStyle : inactiveStyle),
      }}
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
  const hlEst = r ? Math.round(r.totalUnits * ip.hl)    : 0
  const reEst = r ? (r.totalUnits * ip.rent).toFixed(0)  : "0"
  const roiC  = r ? (r.roi > 80 ? "#A5D6A7" : r.roi > 30 ? "#FDD835" : r.roi > 0 ? "#fff" : "#EF9A9A") : "#fff"
  const roiW  = r ? Math.min(100, Math.max(0, r.roi / 2)) : 0

  return (
    <div
      className="absolute right-0 bottom-0 z-[200] flex flex-col transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
      style={{
        top:             108,
        width:           400,
        background:      "rgba(13,22,66,0.97)",
        borderLeft:      "2px solid rgba(255,255,255,0.09)",
        backdropFilter:  "blur(14px)",
        transform:       isOpen ? "translateX(0)" : "translateX(400px)",
      }}
    >
      {/* close tab */}
      <button
        onClick={onClose}
        className="absolute left-[-38px] top-[0.75rem] w-9 h-9 flex items-center justify-center text-base rounded-l-lg cursor-pointer hover:text-white transition-colors"
        style={{ background: "rgba(13,22,66,0.97)", border: "2px solid rgba(255,255,255,0.1)", borderRight: "none", color: "rgba(255,255,255,0.55)", fontSize: 14 }}
      >
        ✕
      </button>

      {/* header */}
      <div className="px-5 py-4 border-b border-white/8 bg-white/[0.03]">
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{site.id} · {site.years}년 방치</div>
        <div className="font-pixel text-white leading-relaxed" style={{ fontSize: 13, marginBottom: 2 }}>{site.name}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{site.owner} · {site.area}ha</div>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#FDD835]">

        <BuildingPreview cols={upf} floors={floors} method={method} tenure={tenure} />

        {/* construction method */}
        <div>
          <div className="font-pixel mb-2" style={{ fontSize: 11, color: "#FDD835", letterSpacing: "0.06em" }}>
            🏗 BUILD METHOD
          </div>
          <div className="flex gap-2 flex-wrap">
            <Chip active={method === "standard"} onClick={() => onMethod("standard")}>🏛 Standard</Chip>
            <Chip active={method === "modular"}  onClick={() => onMethod("modular")}  variant="green">
              📦 Modular&nbsp;<span style={{ fontSize: 11, color: method === "modular" ? "#A5D6A7" : "inherit" }}>−30%</span>
            </Chip>
          </div>
        </div>

        {/* tenure */}
        <div>
          <div className="font-pixel mb-2" style={{ fontSize: 11, color: "#FDD835", letterSpacing: "0.06em" }}>
            🏘 TENURE TYPE
          </div>
          <div className="flex gap-2 flex-wrap">
            <Chip active={tenure === "market"} onClick={() => onTenure("market")}>💰 시장가</Chip>
            <Chip active={tenure === "mixed"}  onClick={() => onTenure("mixed")}  variant="green">⚖ 혼합</Chip>
            <Chip active={tenure === "social"} onClick={() => onTenure("social")} variant="blue">🏘 사회주택</Chip>
          </div>
        </div>

        {/* floors slider */}
        <div className="rounded-xl p-4 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex justify-between mb-3">
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>층수 (Floors)</span>
            <span className="font-pixel" style={{ fontSize: 16, color: "#FDD835" }}>{floors}F</span>
          </div>
          <input
            type="range" min={3} max={20} value={floors}
            onChange={e => onFloors(parseInt(e.target.value))}
            className="w-full h-[6px] bg-white/16 rounded appearance-none outline-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-[#FDD835] [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-md"
          />
          <div className="flex justify-between mt-1.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            <span>3F</span><span>20F</span>
          </div>
        </div>

        {/* stats grid */}
        {r && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: r.totalUnits.toString(),               l: "세대 수",   c: "#90CAF9" },
              { v: `€${(r.totalInv / 1e6).toFixed(1)}M`, l: "총 비용",   c: "#EF9A9A" },
              { v: `€${(r.netRev / 1e3).toFixed(0)}K`,   l: "연 순수익", c: "#A5D6A7" },
              { v: `${r.payback.toFixed(1)}yr`,           l: "회수 기간", c: "#FFE082" },
            ].map(({ v, l, c }) => (
              <div key={l} className="rounded-lg p-3 border border-white/7" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="font-pixel leading-tight" style={{ fontSize: 16, color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* ROI box */}
        {r && (
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: "linear-gradient(135deg,rgba(255,184,0,.1),rgba(229,57,53,.1))", border: "2px solid rgba(255,184,0,.3)" }}
          >
            <div className="font-pixel leading-none mb-2" style={{ fontSize: 36, color: roiC }}>{r.roi.toFixed(0)}%</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>10년 ROI (10-Year Return)</div>
            <div className="mt-3 h-[7px] rounded overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div
                className="h-full rounded transition-all duration-500"
                style={{ width: `${roiW}%`, background: "linear-gradient(90deg,#43A047,#FDD835,#E53935)" }}
              />
            </div>
          </div>
        )}

        {/* social impact preview */}
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(67,160,71,.09)", border: "1px solid rgba(67,160,71,.25)" }}
        >
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            🏕️ 사회적 임팩트 예측
          </div>
          <div className="flex justify-between mb-2" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            <span>노숙자 감소</span>
            <span className="font-bold" style={{ color: "#A5D6A7" }}>{hlEst}명</span>
          </div>
          <div className="flex justify-between" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            <span>월세 인하 기여</span>
            <span className="font-bold" style={{ color: "#A5D6A7" }}>-€{reEst}/월</span>
          </div>
        </div>

        {/* difficulty notice */}
        {difficulty !== "easy" && (
          <div
            className="rounded-xl p-3 leading-relaxed"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              ...(difficulty === "normal"
                ? { background: "rgba(229,57,53,.09)", border: "1px solid rgba(229,57,53,.28)" }
                : { background: "rgba(229,57,53,.15)", border: "1px solid rgba(229,57,53,.45)" }),
            }}
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
          className="w-full font-pixel rounded-xl cursor-pointer tracking-wide transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            fontSize:   18,
            padding:    "16px 0",
            background: "linear-gradient(135deg,#FDD835,#FFB300)",
            color:      "#0d1642",
            border:     "none",
            boxShadow:  "0 4px 16px rgba(253,216,53,.3)",
          }}
        >
          🏗 건설 시작!
        </button>
      </div>
    </div>
  )
}
