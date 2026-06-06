"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import type { Difficulty } from "../hooks/useGameState"

interface Props {
  onComplete: (difficulty: Difficulty) => void
}

const DIFF_CARDS: {
  id: Difficulty
  emoji: string
  label: string
  color: string
  bg: string
  desc: string
  detail: string
}[] = [
  {
    id:     "easy",
    emoji:  "😊",
    label:  "EASY",
    color:  "#FDD835",
    bg:     "rgba(253,216,53,0.12)",
    desc:   "세금·장애물 없음.\n건설 전략에만 집중!",
    detail: "처음 플레이하는 분 추천",
  },
  {
    id:     "normal",
    emoji:  "😤",
    label:  "NORMAL",
    color:  "#FB8C00",
    bg:     "rgba(251,140,0,0.12)",
    desc:   "취득세 7.5%·VAT 13.5%\n개발부담금 등 실제 세금",
    detail: "부동산 관심자 추천",
  },
  {
    id:     "hard",
    emoji:  "💀",
    label:  "HARD",
    color:  "#E53935",
    bg:     "rgba(229,57,53,0.12)",
    desc:   "모든 세금 + 님비·파업\n고고학 발굴 등 랜덤 이벤트",
    detail: "도전을 즐기는 분 추천",
  },
]

export function GameIntro({ onComplete }: Props) {
  const [selected, setSelected] = useState<Difficulty | null>(null)

  return (
    <div
      className="absolute inset-0 z-[2000] flex items-center justify-center overflow-y-auto"
      style={{ background: "#0d1642" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 text-center px-6 py-10 max-w-[760px] w-full"
      >
        {/* Icon */}
        <div style={{ fontSize: 80, lineHeight: 1 }}>🏠</div>

        {/* Title */}
        <h1
          className="font-pixel"
          style={{
            fontSize:   48,
            color:      "#FDD835",
            textShadow: "0 0 40px rgba(253,216,53,0.45), 0 2px 10px rgba(0,0,0,0.9)",
            lineHeight: 1.3,
          }}
        >
          VACANT DUBLIN
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize:   18,
            color:      "#ffffff",
            lineHeight: 1.7,
            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
          }}
        >
          더블린엔 빈 땅이 있다. 그런데 왜 집은 없을까?
        </p>

        {/* Difficulty cards — horizontal */}
        <div className="flex gap-4 justify-center flex-wrap w-full">
          {DIFF_CARDS.map(card => (
            <motion.button
              key={card.id}
              onClick={() => setSelected(card.id)}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 rounded-2xl cursor-pointer transition-all"
              style={{
                width:      200,
                padding:    "24px 20px",
                background: selected === card.id ? card.bg : "rgba(255,255,255,0.05)",
                border:     selected === card.id
                  ? `2px solid ${card.color}`
                  : "2px solid rgba(255,255,255,0.14)",
                boxShadow:  selected === card.id
                  ? `0 0 24px ${card.color}40, 0 8px 32px rgba(0,0,0,0.4)`
                  : "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              <span style={{ fontSize: 40 }}>{card.emoji}</span>
              <span
                className="font-pixel"
                style={{
                  fontSize:   14,
                  color:      selected === card.id ? card.color : "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}
              >
                {card.label}
              </span>
              <span
                style={{
                  fontSize:   13,
                  color:      "rgba(255,255,255,0.82)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                }}
              >
                {card.desc}
              </span>
              <span
                style={{
                  fontSize:   11,
                  color:      "rgba(255,255,255,0.5)",
                  marginTop:  2,
                }}
              >
                {card.detail}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Start button */}
        <motion.button
          onClick={() => selected && onComplete(selected)}
          disabled={!selected}
          whileHover={selected ? { scale: 1.04, y: -3 } : {}}
          whileTap={selected ? { scale: 0.97 } : {}}
          animate={selected ? {
            boxShadow: [
              "0 6px 28px rgba(253,216,53,0.35)",
              "0 10px 48px rgba(253,216,53,0.7)",
              "0 6px 28px rgba(253,216,53,0.35)",
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-pixel rounded-2xl cursor-pointer transition-all"
          style={{
            fontSize:   20,
            padding:    "20px 48px",
            background: selected
              ? "linear-gradient(135deg,#FDD835,#FFB300)"
              : "rgba(255,255,255,0.08)",
            color:      selected ? "#0d1642" : "rgba(255,255,255,0.25)",
            border:     "none",
            cursor:     selected ? "pointer" : "not-allowed",
            textShadow: "none",
          }}
        >
          🏗 건설 시작하기!
        </motion.button>
      </motion.div>
    </div>
  )
}
