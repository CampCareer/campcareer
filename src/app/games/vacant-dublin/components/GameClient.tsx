"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { useGameState } from "../hooks/useGameState"
import { GameIntro }    from "./GameIntro"
import { GameHUD }      from "./GameHUD"
import { BuildPanel }   from "./BuildPanel"
import { UncleAdvisor } from "./UncleAdvisor"
import { EventPopup }   from "./EventPopup"
import { ShareModal }   from "./ShareModal"
import { SITES }        from "../data/sites"
import type { LeaderboardEntry, ModalData } from "../hooks/useGameState"

const GameMap = dynamic(() => import("./GameMap"), { ssr: false })

// ─── Clouds (animated with framer-motion) ─────────────────────────────────────
const CLOUD_DEFS = [
  { w: 130, h: 42, top: 75,  dur: 38, delay: 0  },
  { w: 85,  h: 30, top: 105, dur: 52, delay: 12 },
  { w: 170, h: 54, top: 85,  dur: 45, delay: 25 },
  { w: 105, h: 33, top: 124, dur: 60, delay: 37 },
]

function Clouds() {
  return (
    <>
      {CLOUD_DEFS.map((c, i) => (
        <motion.div key={i}
          className="absolute z-[1] bg-white rounded-[50px] opacity-80"
          style={{ width: c.w, height: c.h, top: c.top }}
          animate={{ x: ["-250px", "110vw"] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "linear" }} />
      ))}
    </>
  )
}

// ─── Leaderboard panel ────────────────────────────────────────────────────────
const MEDALS = ["🥇", "🥈", "🥉"]
const DIFF_ICON: Record<string, string> = { easy: "😊", normal: "😤", hard: "💀" }

function Leaderboard({ isOpen, entries, total }: { isOpen: boolean; entries: LeaderboardEntry[]; total: number }) {
  return (
    <div className="absolute top-[84px] right-0 bottom-0 w-[298px] z-[200] flex flex-col transition-transform duration-300"
      style={{
        background: "rgba(13,22,66,0.96)", borderLeft: "2px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)", transform: isOpen ? "translateX(0)" : "translateX(298px)"
      }}>
      <div className="px-4 py-3 border-b border-white/8">
        <div className="font-pixel text-[0.52rem] text-[#FDD835] mb-1">🏆 LEADERBOARD</div>
        <div className="text-[0.41rem] text-white/28">10년 ROI 기준 · 전 세계 김건설</div>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {entries.length === 0 ? (
          <div className="p-8 text-center font-pixel text-[0.38rem] text-white/18 leading-[3.2]">
            아직 없음<br /><br />🏗<br /><br />먼저 건설하세요!
          </div>
        ) : entries.map((e, i) => (
          <div key={e.id ?? i}
            className={`flex items-center gap-2.5 px-4 py-2 border-b border-white/4 ${i === 0 ? "bg-[#FFB300]/7" : ""}`}>
            <div className="font-pixel text-[0.44rem] w-5 text-center">{MEDALS[i] ?? i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.5rem] font-bold text-white truncate">{e.player_name}</div>
              <div className="text-[0.37rem] text-white/28 mt-0.5">
                {e.units}채 · {e.method === "modular" ? "📦" : "🏛"} {e.floors}F · {DIFF_ICON[e.difficulty] ?? ""}
              </div>
            </div>
            <div className="text-right">
              <div className="font-pixel text-[0.52rem] text-[#FDD835]">{parseFloat(String(e.roi)).toFixed(0)}%</div>
              <div className="text-[0.36rem] text-white/22">10yr ROI</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-white/7 flex justify-between items-center">
        <span className="text-[0.38rem] text-white/28">전체 건설 세대</span>
        <span className="font-pixel text-[0.56rem] text-[#43A047]">{total.toLocaleString()}채</span>
      </div>
    </div>
  )
}

// ─── Success modal ────────────────────────────────────────────────────────────
function SuccessModal({
  data, onSave, onSkip,
}: { data: ModalData; onSave: (name: string) => void; onSkip: () => void }) {
  const [name, setName] = useState("")
  const { roi, units, profit10, site, extra, hlR, rentR } = data
  const em = roi > 100 ? "🎯" : roi > 60 ? "🔥" : roi > 30 ? "🎉" : roi > 0 ? "👍" : "😅"
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-[600] flex items-center justify-center"
      style={{ background: "rgba(4,8,25,0.88)", backdropFilter: "blur(8px)" }}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="rounded-2xl p-7 min-w-[350px] max-w-[92vw]"
        style={{ background: "linear-gradient(135deg,#0d1642,#1a237e)", border: "3px solid #FDD835", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>
        <div className="text-[2.8rem] text-center mb-2">{em}</div>
        <div className="font-pixel text-[0.6rem] text-[#FDD835] text-center mb-1">건설 완료!</div>
        <div className="font-pixel text-[1.85rem] text-white text-center mb-1">{roi.toFixed(0)}% ROI</div>
        <div className="text-[0.5rem] text-white/46 text-center leading-loose mb-2 whitespace-pre-line">
          {units.toLocaleString()}채 건설 완료 · €{(profit10 / 1e6).toFixed(1)}M 수익 · {site}
          {extra > 0 ? `\n⚠ 장애물 비용 +€${(extra / 1e3).toFixed(0)}K` : ""}
        </div>
        {/* impact */}
        <div className="grid grid-cols-2 gap-2 rounded-xl p-3 mb-5"
          style={{ background: "rgba(67,160,71,0.08)", border: "1px solid rgba(67,160,71,0.22)" }}>
          <div>
            <div className="font-pixel text-[0.58rem] text-[#A5D6A7]">-{hlR}명</div>
            <div className="text-[0.37rem] text-white/32 mt-0.5 uppercase">노숙자 감소</div>
          </div>
          <div>
            <div className="font-pixel text-[0.58rem] text-[#A5D6A7]">-€{Math.round(rentR)}</div>
            <div className="text-[0.37rem] text-white/32 mt-0.5 uppercase">월세 인하 기여</div>
          </div>
        </div>
        <div className="text-[0.41rem] text-white/36 uppercase tracking-[0.07em] mb-2">리더보드 이름 (닉네임)</div>
        <input
          type="text" maxLength={20} placeholder="DEVELOPER_01" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSave(name)}
          className="w-full bg-black/35 border-2 border-white/16 rounded-xl text-white font-bold text-[0.82rem] px-4 py-2 mb-5 outline-none focus:border-[#FDD835] transition-colors"
        />
        <div className="flex gap-3">
          <button onClick={() => onSave(name)}
            className="flex-1 py-3 font-pixel text-[0.44rem] text-[#0d1642] rounded-xl cursor-pointer hover:bg-[#ffe57f] transition-colors"
            style={{ background: "#FDD835", border: "none" }}>
            ▶ 등록
          </button>
          <button onClick={onSkip}
            className="px-4 py-3 font-pixel text-[0.44rem] text-white/30 rounded-xl cursor-pointer hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.1)" }}>
            건너뛰기
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, warn }: { msg: string; warn: boolean }) {
  return (
    <motion.div
      initial={{ y: 80, x: "-50%", opacity: 0 }}
      animate={{ y: 0,  x: "-50%", opacity: 1 }}
      exit={{   y: 80,  x: "-50%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute bottom-6 left-1/2 z-[800] rounded-xl px-6 py-3 font-pixel text-[0.42rem] text-white whitespace-nowrap"
      style={warn
        ? { background: "linear-gradient(135deg,#B71C1C,#C62828)", border: "2px solid #EF9A9A", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }
        : { background: "linear-gradient(135deg,#1B5E20,#2E7D32)", border: "2px solid #66BB6A", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
      {msg}
    </motion.div>
  )
}

// ─── Main GameClient ──────────────────────────────────────────────────────────
export function GameClient() {
  const gs = useGameState()

  return (
    <div className="relative overflow-hidden w-full h-full">

      {/* sky/ground background */}
      <div className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg,#1565C0 0%,#42A5F5 38%,#B3E5FC 62%,#E8F5E9 68%,#66BB6A 68%,#4CAF50 100%)" }} />

      <Clouds />

      {/* HUD */}
      <GameHUD
        bestROI={gs.bestROI}
        totalHomes={gs.totalHomes}
        totalHLReduced={gs.totalHLReduced}
        totalRentDrop={gs.totalRentDrop}
        budget={gs.budget}
        difficulty={gs.difficulty}
        onDifficulty={gs.handleDifficultyChange}
        onToggleLB={() => { gs.setShowLB(!gs.showLB); if (!gs.showLB) gs.loadLeaderboard() }}
        onShare={() => gs.setShowShare(true)}
      />

      {/* Map */}
      <GameMap
        sites={SITES}
        developed={gs.developed}
        onSelectSite={gs.selectSite}
        selectedSiteId={gs.curSite?.id ?? null}
      />

      {/* Build panel */}
      <BuildPanel
        isOpen={gs.showPanel}
        site={gs.curSite}
        method={gs.method}
        tenure={gs.tenure}
        floors={gs.floors}
        difficulty={gs.difficulty}
        calcResult={gs.calcResult}
        pendingScore={gs.pendingScore}
        onMethod={gs.handleMethodChange}
        onTenure={gs.handleTenureChange}
        onFloors={gs.handleFloorsChange}
        onBuild={gs.startBuild}
        onClose={() => gs.setShowPanel(false)}
      />

      {/* Leaderboard */}
      <Leaderboard isOpen={gs.showLB} entries={gs.leaderboard} total={gs.lbTotal} />

      {/* Uncle advisor */}
      <UncleAdvisor
        msg={gs.uncleMsg}
        visible={gs.uncleVisible}
        show={gs.introComplete}
        onCycle={() => gs.doUncle("idle")}
      />

      {/* Hint */}
      <AnimatePresence>
        {gs.showHint && gs.introComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[150] rounded-xl px-6 py-3 text-center cursor-pointer"
            style={{ background: "rgba(13,22,66,0.9)", border: "2px solid #FDD835", backdropFilter: "blur(10px)" }}
            onClick={() => gs.setShowHint(false)}>
            <p className="font-pixel text-[0.44rem] text-white leading-loose">
              🗺 지도의 <span style={{ color: "#FDD835" }}>📍 빨간 핀</span>을 클릭해서 개발하세요!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro overlay */}
      <AnimatePresence>
        {!gs.introComplete && (
          <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.55 }} className="absolute inset-0 z-[2000]">
            <GameIntro onComplete={gs.completeIntro} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event popup */}
      <EventPopup show={gs.showEvent} event={gs.currentEvent} onResolve={gs.resolveEvent} />

      {/* Success modal */}
      <AnimatePresence>
        {gs.showModal && gs.modalData && (
          <SuccessModal data={gs.modalData} onSave={gs.saveScore} onSkip={gs.closeModal} />
        )}
      </AnimatePresence>

      {/* Share modal */}
      <ShareModal
        show={gs.showShare}
        totalHomes={gs.totalHomes}
        bestROI={gs.bestROI}
        totalHLReduced={gs.totalHLReduced}
        totalRentDrop={gs.totalRentDrop}
        onClose={() => gs.setShowShare(false)}
      />

      {/* Toast */}
      <AnimatePresence>
        {gs.toast && <Toast key="toast" msg={gs.toast.msg} warn={gs.toast.warn} />}
      </AnimatePresence>
    </div>
  )
}
