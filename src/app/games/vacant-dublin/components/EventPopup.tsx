"use client"
import { motion, AnimatePresence } from "framer-motion"
import type { Obstacle } from "../data/obstacles"

interface Props {
  show:      boolean
  event:     { ev: Obstacle; cost: number } | null
  onResolve: (accept: boolean) => void
}

export function EventPopup({ show, event, onResolve }: Props) {
  const ev   = event?.ev
  const cost = event?.cost ?? 0

  const impactText = ev?.impact.replace(
    "{val}", `€${(cost / 1e3).toFixed(0)}K`
  ) ?? ""

  return (
    <AnimatePresence>
      {show && ev && (
        <>
          {/* backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[499]" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />

          {/* popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1,   x: "-50%", y: "-50%" }}
            exit={{   opacity: 0, scale: 0.8,  x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute top-1/2 left-1/2 z-[500] rounded-2xl p-7 min-w-[340px] max-w-[90vw]"
            style={{ background: "linear-gradient(135deg,#1a237e,#283593)", border: "3px solid #E53935", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>

            <div className="text-[2.8rem] text-center mb-3">{ev.emoji}</div>
            <div className="font-pixel text-[0.6rem] text-center mb-2" style={{ color: "#E53935" }}>{ev.title}</div>
            <div className="text-[0.54rem] text-white/68 text-center leading-relaxed mb-2">{ev.desc}</div>
            <div className="font-bold text-[0.5rem] text-center mb-4" style={{ color: "#FDD835" }}>{impactText}</div>

            {/* progress bar */}
            <div className="h-[6px] bg-white/10 rounded overflow-hidden mb-5">
              <motion.div className="h-full rounded" style={{ background: "#FDD835" }}
                initial={{ width: "0%" }} animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => onResolve(true)}
                className="flex-1 py-3 font-pixel text-[0.44rem] text-[#0d1642] rounded-xl cursor-pointer hover:bg-[#ffe57f] transition-colors"
                style={{ background: "#FDD835", border: "none" }}>
                ✓ 수락하고 계속
              </button>
              <button onClick={() => onResolve(false)}
                className="px-4 py-3 font-pixel text-[0.44rem] text-white/38 rounded-xl cursor-pointer hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.1)" }}>
                ✕ 건설 포기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
