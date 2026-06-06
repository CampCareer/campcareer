"use client"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  show:           boolean
  totalHomes:     number
  bestROI:        number
  totalHLReduced: number
  totalRentDrop:  number
  onClose:        () => void
}

export function ShareModal({ show, totalHomes, bestROI, totalHLReduced, totalRentDrop, onClose }: Props) {
  const shareLink = () => {
    const url = window.location.href
    const txt = `🏗 VACANT DUBLIN — 더블린 빈 땅 개발 시뮬레이션!\n더블린의 방치된 빈 땅에 아파트를 지어 주택 위기를 해결하세요.\n👉 ${url}\n#VacantDublin #더블린집값 #아일랜드부동산`
    if (navigator.share) navigator.share({ title: "Vacant Dublin", text: txt, url })
    else { navigator.clipboard?.writeText(txt) }
    onClose()
  }

  const shareScore = () => {
    const txt = [
      "🏗 VACANT DUBLIN 플레이 결과!", "",
      "📊 내 성과:",
      `  🏠 건설한 집: ${totalHomes.toLocaleString()}채`,
      `  💰 최고 ROI: ${bestROI.toFixed(0)}%`,
      `  🏕️ 노숙자 감소 기여: -${totalHLReduced}명`,
      `  📉 월세 인하 기여: -€${Math.round(totalRentDrop)}/월`, "",
      "💡 더블린엔 지금도 13,400명이 거리에 있습니다.",
      "   수년간 방치된 빈 땅에 직접 아파트를 지어보세요!", "",
      `👉 ${window.location.href}`, "",
      "#VacantDublin #더블린집값 #아일랜드부동산",
    ].join("\n")
    if (navigator.share) navigator.share({ title: "Vacant Dublin 점수 공유", text: txt })
    else navigator.clipboard?.writeText(txt)
    onClose()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-[700] flex items-center justify-center"
          style={{ background: "rgba(4,8,25,0.92)", backdropFilter: "blur(10px)" }}>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative rounded-2xl p-8 min-w-[360px] max-w-[92vw]"
            style={{ background: "linear-gradient(135deg,#0d1642,#1a237e,#0a1a50)", border: "3px solid #FDD835", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>

            <button onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 border-none text-white/50 cursor-pointer hover:text-white transition-colors text-sm">
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="font-pixel text-[0.65rem] text-[#FDD835]">🏗 VACANT DUBLIN</div>
              <div className="text-[0.5rem] text-white/35 mt-1">더블린 빈 땅 개발 시뮬레이션</div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                { v: `${totalHomes.toLocaleString()}채`, l: "🏠 건설한 집",   c: "#A5D6A7" },
                { v: bestROI > 0 ? `${bestROI.toFixed(0)}%` : "—", l: "💰 최고 ROI", c: "#FDD835" },
                { v: `-${totalHLReduced}명`,             l: "🏕️ 노숙자 감소", c: "#81D4FA" },
                { v: `-€${Math.round(totalRentDrop)}`,   l: "📉 월세 인하",   c: "#EF9A9A" },
              ].map(({ v, l, c }) => (
                <div key={l} className="bg-white/6 border border-white/10 rounded-xl p-4 text-center">
                  <div className="font-pixel text-[0.82rem] leading-tight" style={{ color: c }}>{v}</div>
                  <div className="text-[0.4rem] text-white/36 mt-1">{l}</div>
                </div>
              ))}
            </div>

            <div className="text-[0.56rem] text-white/58 text-center leading-loose mb-4 rounded-xl px-4 py-3"
              style={{ background: "rgba(229,57,53,0.07)", border: "1px solid rgba(229,57,53,0.18)" }}>
              💡 더블린엔 지금도 <strong style={{ color: "#EF9A9A" }}>13,400명</strong>이 거리에 있어요.<br />
              수년간 방치된 빈 땅에 아파트를 짓고<br />
              아일랜드 주택 위기를 직접 느껴보세요!
            </div>

            <div className="flex gap-3">
              <button onClick={shareLink}
                className="flex-1 py-3 font-pixel text-[0.42rem] text-white rounded-xl cursor-pointer hover:bg-white/15 transition-colors"
                style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)" }}>
                🔗 게임 링크 공유
              </button>
              <button onClick={shareScore}
                className="flex-1 py-3 font-pixel text-[0.42rem] text-[#0d1642] rounded-xl cursor-pointer hover:bg-[#ffe57f] transition-colors"
                style={{ background: "#FDD835", border: "none" }}>
                📊 내 점수 공유
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
