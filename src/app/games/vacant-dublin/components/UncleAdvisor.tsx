"use client"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  msg:      string
  visible:  boolean
  show:     boolean
  onCycle:  () => void
}

export function UncleAdvisor({ msg, visible, show, onCycle }: Props) {
  if (!show) return null
  return (
    <div className="absolute bottom-5 left-5 z-[150] flex items-end gap-2">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0, originX: 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{   opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="max-w-[240px] rounded-2xl rounded-bl-none px-3.5 py-2.5"
            style={{ background: "rgba(8,14,40,0.97)", border: "2px solid #FFB300", backdropFilter: "blur(12px)" }}>
            <div className="font-pixel text-[0.32rem] mb-1" style={{ color: "#FFB300" }}>👷 김건설 삼촌</div>
            <div className="text-[0.58rem] text-white/88 leading-relaxed">{msg}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={onCycle}
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 border-[3px] border-white cursor-pointer hover:scale-110 transition-transform"
        style={{ background: "linear-gradient(135deg,#FB8C00,#FFB300)", boxShadow: "0 4px 18px rgba(0,0,0,0.45)" }}>
        👷
      </button>
    </div>
  )
}
