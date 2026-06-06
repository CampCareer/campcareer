"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Difficulty } from "../hooks/useGameState"

interface Props {
  onComplete: (difficulty: Difficulty) => void
}

type Phase = "splash" | "story" | "difficulty"

// ── Shared UI pieces ──────────────────────────────────────────────────────────
function SceneTag({ text }: { text: string }) {
  return (
    <div style={{
      display: "inline-block",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 20, padding: "6px 18px",
      fontSize: 13, color: "rgba(255,255,255,0.8)",
    }}>
      {text}
    </div>
  )
}

// ── Scene 1: Airport arrival ──────────────────────────────────────────────────
function Scene1() {
  return (
    <div className="flex flex-col items-center gap-5 text-center w-full" style={{ maxWidth: 480 }}>
      <SceneTag text="2025년 9월 · 더블린 국제공항 ✈️" />

      {/* Character card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)",
          borderRadius: 20, padding: "18px 28px",
          display: "flex", alignItems: "center", gap: 16,
        }}
      >
        <span style={{ fontSize: 48 }}>🎓</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>김석준 (25세)</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            UCD 경영학 박사과정
          </div>
        </div>
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: "16px 16px 16px 4px",
          padding: "14px 20px", fontSize: 15, color: "#fff",
          lineHeight: 1.7, textAlign: "left", maxWidth: 400,
        }}
      >
        드디어 더블린이다! 꿈에 그리던 아일랜드 유학...<br />
        일단 집부터 구해야겠어!
      </motion.div>
    </div>
  )
}

// ── Scene 2: Price shock ──────────────────────────────────────────────────────
const LISTINGS = [
  { price: "€2,100", area: "더블린 2구", type: "1베드룸 아파트", age: "3일 전" },
  { price: "€2,650", area: "더블린 4구", type: "스튜디오",       age: "1일 전" },
  { price: "€1,400", area: "더블린 9구", type: "룸 쉐어",        age: "오늘 등록" },
]

function Scene2() {
  return (
    <div className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: 420 }}>
      <SceneTag text="📱 Daft.ie 검색 중..." />

      {/* Phone mockup */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 16, width: "100%",
      }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
          Daft.ie — 더블린 렌트 매물
        </div>
        <div className="flex flex-col gap-3">
          {LISTINGS.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 + 0.2 }}
              style={{
                background: "rgba(255,255,255,0.07)", borderRadius: 12,
                padding: "12px 16px", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>
                  {l.area} · {l.type}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                  {l.age}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#FDD835" }}>{l.price}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>/월</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}
        style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}
      >
        방 하나에 월 200만원?! 😱
      </motion.div>
    </div>
  )
}

// ── Scene 3: Uncle call ───────────────────────────────────────────────────────
const CHAT: { text: string; isRight: boolean; highlight?: boolean; delay: number }[] = [
  { text: "삼촌, 저 더블린 왔는데... 방값이 미쳤어요 😭",      isRight: false, delay: 0.2 },
  { text: "얼마나 하는데?",                                    isRight: true,  delay: 1.0 },
  { text: "방 하나에 €2,000이 넘어요. 한국 돈으로 300만원...", isRight: false, delay: 1.8 },
  { text: "뭐?! 그 돈이면 서울에서 전세 끼고 집 사겠다!",     isRight: true,  delay: 2.6 },
  { text: "비어있는 땅은 엄청 많은데 집을 안 짓는대요.",       isRight: false, delay: 3.4 },
  { text: "내가 직접 지어드리겠다!!!",                         isRight: true,  highlight: true, delay: 4.2 },
]

function Scene3() {
  return (
    <div className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: 460 }}>
      <SceneTag text="📞 한국으로 국제전화" />

      {/* Speaker labels */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
        <span>🎓 김석준</span>
        <span>김건설 삼촌 👷</span>
      </div>

      {/* Chat bubbles */}
      <div className="flex flex-col gap-3" style={{ width: "100%" }}>
        {CHAT.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: line.delay, duration: 0.35 }}
            style={{
              alignSelf: line.isRight ? "flex-end" : "flex-start",
              background: line.isRight
                ? "rgba(253,216,53,0.12)"
                : "rgba(255,255,255,0.08)",
              border: `1px solid ${line.isRight ? "rgba(253,216,53,0.35)" : "rgba(255,255,255,0.14)"}`,
              borderRadius: 14,
              borderBottomRightRadius: line.isRight ? 4  : 14,
              borderBottomLeftRadius:  line.isRight ? 14 : 4,
              padding: "10px 14px",
              fontSize: 14,
              color: line.highlight ? "#FDD835" : "#fff",
              fontWeight: line.highlight ? 700 : 400,
              maxWidth: "78%",
              lineHeight: 1.55,
            }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Scene 4: Uncle intro ──────────────────────────────────────────────────────
const MISSIONS = [
  { emoji: "🗺️", text: "더블린 공략" },
  { emoji: "🏗️", text: "건설"       },
  { emoji: "📉", text: "집값인하"   },
  { emoji: "🏕️", text: "노숙자감소" },
]

const CRISIS_STATS = [
  { label: "평균 월세",  value: "€2,300" },
  { label: "노숙자",     value: "13,400명" },
  { label: "빈 땅",      value: "19곳"   },
]

function Scene4() {
  return (
    <div className="flex flex-col items-center gap-5 w-full" style={{ maxWidth: 460 }}>
      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 22 }}
        style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "#E65100", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44, flexShrink: 0,
        }}
      >
        👷
      </motion.div>

      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        style={{ textAlign: "center" }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>김건설 삼촌</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", marginTop: 4 }}>건설사 대표</div>
      </motion.div>

      {/* Mission grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
        {MISSIONS.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.44 + i * 0.12, type: "spring", stiffness: 300, damping: 22 }}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12, padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 15, color: "#fff",
            }}
          >
            <span style={{ fontSize: 22 }}>{m.emoji}</span>
            <span>{m.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Crisis stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, width: "100%",
          background: "rgba(229,57,53,0.08)", border: "1px solid rgba(229,57,53,0.22)",
          borderRadius: 14, padding: "14px 16px",
        }}
      >
        {CRISIS_STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.1 + i * 0.14 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#EF9A9A" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ── Difficulty cards ──────────────────────────────────────────────────────────
const DIFF_CARDS: {
  id: Difficulty; emoji: string; label: string; color: string; bg: string
  desc: string; detail: string
}[] = [
  {
    id: "easy",   emoji: "😊", label: "EASY",
    color: "#FDD835", bg: "rgba(253,216,53,0.12)",
    desc: "세금·장애물 없음.\n건설 전략에만 집중!", detail: "처음 플레이하는 분 추천",
  },
  {
    id: "normal", emoji: "😤", label: "NORMAL",
    color: "#FB8C00", bg: "rgba(251,140,0,0.12)",
    desc: "취득세 7.5%·VAT 13.5%\n개발부담금 등 실제 세금", detail: "부동산 관심자 추천",
  },
  {
    id: "hard",   emoji: "💀", label: "HARD",
    color: "#E53935", bg: "rgba(229,57,53,0.12)",
    desc: "모든 세금 + 님비·파업\n고고학 발굴 등 랜덤 이벤트", detail: "도전을 즐기는 분 추천",
  },
]

// ── Phase renderers ───────────────────────────────────────────────────────────
const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4]
const SCENE_COUNT = SCENE_COMPONENTS.length

function SplashPhase({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 text-center px-6"
    >
      <div style={{ fontSize: 80, lineHeight: 1 }}>🏠</div>

      <h1
        className="font-pixel"
        style={{
          fontSize: 48, color: "#FDD835", lineHeight: 1.3,
          textShadow: "0 0 40px rgba(253,216,53,0.45), 0 2px 10px rgba(0,0,0,0.9)",
        }}
      >
        VACANT DUBLIN
      </h1>

      <p style={{ fontSize: 18, color: "#fff", lineHeight: 1.7, textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
        더블린엔 빈 땅이 있다. 그런데 왜 집은 없을까?
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.04, y: -3 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          boxShadow: [
            "0 6px 28px rgba(253,216,53,0.35)",
            "0 10px 48px rgba(253,216,53,0.7)",
            "0 6px 28px rgba(253,216,53,0.35)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="font-pixel rounded-2xl cursor-pointer"
        style={{
          fontSize: 22, padding: "22px 60px",
          background: "linear-gradient(135deg,#FDD835,#FFB300)",
          color: "#0d1642", border: "none",
        }}
      >
        🏗 시작하기
      </motion.button>
    </motion.div>
  )
}

function StoryPhase({
  sceneIdx, onNext, onSkip,
}: { sceneIdx: number; onNext: () => void; onSkip: () => void }) {
  const SceneComp = SCENE_COMPONENTS[sceneIdx]
  const isLast = sceneIdx === SCENE_COUNT - 1

  return (
    <motion.div
      key={`scene-${sceneIdx}`}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0,  opacity: 1 }}
      exit={{ x: -60,   opacity: 0 }}
      transition={{ duration: 0.38, ease: "easeInOut" }}
      className="flex flex-col items-center gap-5 px-6 py-6 w-full"
      style={{ maxWidth: 520 }}
    >
      <SceneComp />

      {/* Navigation row */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", maxWidth: 460, marginTop: 12,
        }}
      >
        {/* Skip */}
        <button
          onClick={onSkip}
          style={{
            fontSize: 14, color: "rgba(255,255,255,0.38)",
            background: "none", border: "none", cursor: "pointer", padding: "8px 0",
          }}
        >
          건너뛰기
        </button>

        {/* Dot progress */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: SCENE_COUNT }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === sceneIdx ? 20 : 6, height: 6, borderRadius: 3,
                background: i === sceneIdx ? "#FDD835" : "rgba(255,255,255,0.2)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Next / go to difficulty */}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          style={{
            fontSize: 15, fontWeight: 600,
            background: isLast
              ? "linear-gradient(135deg,#FDD835,#FFB300)"
              : "rgba(253,216,53,0.15)",
            color: "#FDD835",
            border: `2px solid rgba(253,216,53,${isLast ? "0.8" : "0.35"})`,
            borderRadius: 12, padding: "10px 22px", cursor: "pointer",
          }}
        >
          다음 →
        </motion.button>
      </div>
    </motion.div>
  )
}

function DifficultyPhase({
  onComplete,
}: { onComplete: (d: Difficulty) => void }) {
  const [selected, setSelected] = useState<Difficulty | null>(null)

  return (
    <motion.div
      key="difficulty"
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.38, ease: "easeInOut" }}
      className="flex flex-col items-center gap-6 text-center px-6 py-10 w-full"
      style={{ maxWidth: 760 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}
      >
        난이도를 선택하세요
      </motion.h2>

      {/* Cards */}
      <div className="flex gap-4 justify-center flex-wrap">
        {DIFF_CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            onClick={() => setSelected(card.id)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.15, type: "spring", stiffness: 300, damping: 24 }}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center gap-3 rounded-2xl cursor-pointer"
            style={{
              width: 200, padding: "24px 20px",
              background: selected === card.id ? card.bg : "rgba(255,255,255,0.05)",
              border: selected === card.id
                ? `2px solid ${card.color}`
                : "2px solid rgba(255,255,255,0.14)",
              boxShadow: selected === card.id
                ? `0 0 24px ${card.color}40, 0 8px 32px rgba(0,0,0,0.4)`
                : "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: 40 }}>{card.emoji}</span>
            <span
              className="font-pixel"
              style={{ fontSize: 14, color: selected === card.id ? card.color : "#fff",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
            >
              {card.label}
            </span>
            <span
              style={{ fontSize: 13, color: "rgba(255,255,255,0.82)",
                lineHeight: 1.6, whiteSpace: "pre-line", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
            >
              {card.desc}
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.48)", marginTop: 2 }}>
              {card.detail}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Start button — wrap for entry animation, inner button for pulse */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
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
          } : { boxShadow: "none" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-pixel rounded-2xl"
          style={{
            fontSize: 20, padding: "20px 48px",
            background: selected ? "linear-gradient(135deg,#FDD835,#FFB300)" : "rgba(255,255,255,0.08)",
            color: selected ? "#0d1642" : "rgba(255,255,255,0.25)",
            border: "none",
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          🏗 건설 시작하기!
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export function GameIntro({ onComplete }: Props) {
  const [phase, setPhase]     = useState<Phase>("splash")
  const [sceneIdx, setSceneIdx] = useState(0)

  const goNextScene = () => {
    if (sceneIdx < SCENE_COUNT - 1) {
      setSceneIdx(s => s + 1)
    } else {
      setPhase("difficulty")
    }
  }

  return (
    <div
      className="absolute inset-0 z-[2000] flex items-center justify-center overflow-y-auto"
      style={{ background: "#0d1642" }}
    >
      <AnimatePresence mode="wait">
        {phase === "splash" && (
          <SplashPhase key="splash" onStart={() => { setSceneIdx(0); setPhase("story") }} />
        )}

        {phase === "story" && (
          <StoryPhase
            key={`scene-${sceneIdx}`}
            sceneIdx={sceneIdx}
            onNext={goNextScene}
            onSkip={() => setPhase("difficulty")}
          />
        )}

        {phase === "difficulty" && (
          <DifficultyPhase key="difficulty" onComplete={onComplete} />
        )}
      </AnimatePresence>
    </div>
  )
}
