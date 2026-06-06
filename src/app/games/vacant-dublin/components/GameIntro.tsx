"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { CharacterData, Difficulty } from "../hooks/useGameState"

interface Props {
  onComplete: (character: CharacterData, difficulty: Difficulty) => void
}

// 0=char, 1=title, 2=kim, 3=rent, 4=call, 5=mission, 6=difficulty
const SCENES = 7

// ── typing hook ──────────────────────────────────────────────────────────────
function useTyping(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState("")
  useEffect(() => {
    if (!active) { setDisplayed(""); return }
    setDisplayed("")
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, active, speed])
  return displayed
}

// ── constants ─────────────────────────────────────────────────────────────────
const TITLE_LETTERS = "VACANT DUBLIN".split("")

const SKIN_COLORS = [
  "#FDDBB4", "#F5CBA7", "#E8A87C", "#C68642", "#8D5524", "#4A2C17",
]

const HAIR_OPTIONS = [
  { emoji: "🧑",      label: "단발"  },
  { emoji: "👱",      label: "금발"  },
  { emoji: "🧑‍\u{1F9B1}", label: "곱슬"  },
  { emoji: "🧑‍\u{1F9B2}", label: "민머리" },
  { emoji: "🧑‍\u{1F9B3}", label: "은발"  },
]

const DIFF_CARDS = [
  {
    id:        "easy"   as Difficulty,
    emoji:     "😊",
    label:     "EASY",
    color:     "#FDD835",
    textColor: "#0d1642",
    desc:      "세금·장애물 없음. 건설 전략에만 집중!",
    detail:    "추천: 처음 플레이하는 분",
  },
  {
    id:        "normal" as Difficulty,
    emoji:     "😤",
    label:     "NORMAL",
    color:     "#FB8C00",
    textColor: "#fff",
    desc:      "취득세 7.5%, VAT 13.5%, 개발부담금 등 실제 아일랜드 세금 적용.",
    detail:    "추천: 부동산 관심자",
  },
  {
    id:        "hard"   as Difficulty,
    emoji:     "💀",
    label:     "HARD",
    color:     "#E53935",
    textColor: "#fff",
    desc:      "모든 세금 + 님비·파업·고고학 발굴 등 랜덤 이벤트 발생!",
    detail:    "추천: 도전을 즐기는 분",
  },
]

const DEFAULT_CHAR: CharacterData = {
  name:      "김석준",
  age:       25,
  gender:    "남성",
  skinColor: "#FDDBB4",
  hairStyle: "🧑",
}

// ── Avatar preview ────────────────────────────────────────────────────────────
function CharacterAvatar({ data }: { data: CharacterData }) {
  const genderBadge = data.gender === "남성" ? "♂" : data.gender === "여성" ? "♀" : "⚧"
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 border-white/30"
          style={{
            background:  data.skinColor,
            boxShadow:   `0 0 0 3px rgba(255,255,255,0.12), 0 6px 20px rgba(0,0,0,0.5)`,
          }}
        >
          {data.hairStyle}
        </div>
        <div
          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] font-bold"
          style={{ background: "#1a237e", border: "2px solid #FDD835", color: "#FDD835" }}
        >
          {genderBadge}
        </div>
      </div>
      <div
        className="font-pixel text-[0.52rem] text-white mt-0.5"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
      >
        {data.name || "이름 미입력"}
      </div>
      <div className="text-[0.44rem]" style={{ color: "rgba(255,255,255,0.75)" }}>
        {data.age}세 · {data.gender}
      </div>
    </div>
  )
}

// ── Shared buttons ────────────────────────────────────────────────────────────
function SceneButtons({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-1">
      <button
        onClick={onNext}
        className="font-pixel text-[0.52rem] px-8 py-2.5 rounded-lg cursor-pointer transition-all hover:-translate-y-0.5"
        style={{ background: "#FDD835", color: "#0d1642", textShadow: "none" }}
      >
        다음 →
      </button>
      <button
        onClick={onSkip}
        className="font-pixel text-[0.46rem] bg-transparent border-none cursor-pointer transition-colors"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        건너뛰기
      </button>
    </div>
  )
}

// ── Uncle call scene ──────────────────────────────────────────────────────────
function CallScene({ playerName }: { playerName: string }) {
  const line1 = `삼촌... 여기 방 하나에 월세가 200만원이에요. 빈 땅은 그렇게 많다는데...`
  const line2 = "😤 뭐?! 그 넓은 더블린에\n빈 땅이 많은데 왜 집을 안 짓는 거야?!"
  const line3 = "내가 직접 지어드리겠다!!! 🏗\n조카 걱정은 안 해도 돼!"
  const t1 = useTyping(line1, true, 30)
  const t2 = useTyping(line2, t1.length >= line1.length, 30)
  const t3 = useTyping(line3, t2.length >= line2.length, 30)

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div>
        <div className="flex items-center gap-2 text-[0.46rem]" style={{ color: "rgba(255,255,255,0.75)" }}>
          <span>🎓</span><span>{playerName} (더블린)</span>
        </div>
        <div
          className="ml-auto mt-1 rounded-2xl rounded-br-none px-3 py-2 text-[0.62rem] text-white leading-loose text-left max-w-[280px] whitespace-pre-line"
          style={{
            background:  "#1a3a1a",
            border:      "1px solid rgba(255,255,255,0.15)",
            borderLeft:  "3px solid #4CAF50",
            textShadow:  "0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          {t1}
        </div>
      </div>
      <div>
        <div
          className="flex items-center gap-2 text-[0.46rem] flex-row-reverse"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          <span>👷</span><span>김건설 삼촌 (서울)</span>
        </div>
        <div
          className="mt-1 rounded-2xl rounded-bl-none px-3 py-2 text-[0.62rem] text-white leading-loose text-left max-w-[280px] whitespace-pre-line"
          style={{
            background: "#1e3a5f",
            border:     "1px solid rgba(255,255,255,0.15)",
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          {t2}
        </div>
        {t2.length >= line2.length && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ type: "spring" }}
            className="mt-2 rounded-2xl rounded-bl-none px-3 py-2 text-[0.62rem] text-white leading-loose text-left max-w-[280px] whitespace-pre-line"
            style={{
              background: "#1a3a1a",
              borderLeft: "3px solid #4CAF50",
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            {t3}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function GameIntro({ onComplete }: Props) {
  const [scene,        setScene]        = useState(0)
  const [charData,     setCharData]     = useState<CharacterData>(DEFAULT_CHAR)
  const [selectedDiff, setSelectedDiff] = useState<Difficulty | null>(null)

  const next       = () => setScene(s => Math.min(s + 1, SCENES - 1))
  const skipToEnd  = () => setScene(SCENES - 1)

  const handleComplete = () => {
    if (!selectedDiff) return
    onComplete(
      { ...charData, name: charData.name.trim() || "김석준" },
      selectedDiff,
    )
  }

  return (
    <div
      className="absolute inset-0 z-[2000] overflow-y-auto"
      style={{ background: "#0d1642" }}
    >
      <div className="min-h-full flex flex-col items-center justify-center py-14 px-4 relative">

        {/* progress dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: SCENES }).map((_, i) => (
            <div
              key={i}
              className="h-[3px] rounded-sm transition-all duration-300"
              style={{
                width:      i === scene ? 36 : 14,
                background: i === scene ? "#FDD835" : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Scene 0: 캐릭터 만들기 ────────────────────────────── */}
          {scene === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center gap-2.5 text-center w-full max-w-md"
            >
              <p
                className="font-pixel text-[0.44rem] tracking-[0.12em] uppercase"
                style={{ color: "#FDD835", textShadow: "0 1px 6px rgba(253,216,53,0.6)" }}
              >
                👤 내 캐릭터 만들기
              </p>

              <CharacterAvatar data={charData} />

              {/* Name */}
              <div className="w-full">
                <div
                  className="text-[0.44rem] text-left mb-1 font-semibold text-white"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  이름
                </div>
                <input
                  type="text" maxLength={12} placeholder="김석준"
                  value={charData.name}
                  onChange={e => setCharData(d => ({ ...d, name: e.target.value }))}
                  className="w-full rounded-lg px-3 py-1.5 text-white text-[0.72rem] font-bold outline-none transition-colors"
                  style={{
                    background:  "rgba(255,255,255,0.08)",
                    border:      "2px solid rgba(255,255,255,0.2)",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#FDD835" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}
                />
              </div>

              {/* Age */}
              <div className="w-full">
                <div
                  className="text-[0.44rem] text-left mb-1 font-semibold text-white"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  나이
                </div>
                <input
                  type="number" min={18} max={65} placeholder="25"
                  value={charData.age}
                  onChange={e => setCharData(d => ({ ...d, age: Number(e.target.value) || 25 }))}
                  className="w-full rounded-lg px-3 py-1.5 text-white text-[0.72rem] font-bold outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border:     "2px solid rgba(255,255,255,0.2)",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#FDD835" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}
                />
              </div>

              {/* Gender */}
              <div className="w-full">
                <div
                  className="text-[0.44rem] text-left mb-1 font-semibold text-white"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  성별
                </div>
                <div className="flex gap-2">
                  {(["남성", "여성", "기타"] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setCharData(d => ({ ...d, gender: g }))}
                      className="flex-1 py-1.5 rounded-lg border-2 text-[0.54rem] font-bold cursor-pointer transition-all"
                      style={
                        charData.gender === g
                          ? { background: "#FDD835", borderColor: "#FDD835", color: "#0d1642" }
                          : { background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }
                      }
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Color */}
              <div className="w-full">
                <div
                  className="text-[0.44rem] text-left mb-1 font-semibold text-white"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  피부색
                </div>
                <div className="flex gap-2">
                  {SKIN_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setCharData(d => ({ ...d, skinColor: color }))}
                      className="flex-1 h-8 rounded-full border-[3px] cursor-pointer transition-all"
                      style={{
                        background:  color,
                        borderColor: charData.skinColor === color ? "#FDD835" : "rgba(255,255,255,0.18)",
                        transform:   charData.skinColor === color ? "scale(1.18)" : "scale(1)",
                        boxShadow:   charData.skinColor === color ? "0 0 8px rgba(253,216,53,0.7)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div className="w-full">
                <div
                  className="text-[0.44rem] text-left mb-1 font-semibold text-white"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  헤어스타일
                </div>
                <div className="flex gap-1.5">
                  {HAIR_OPTIONS.map(h => (
                    <button
                      key={h.label}
                      onClick={() => setCharData(d => ({ ...d, hairStyle: h.emoji }))}
                      className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg border-2 cursor-pointer transition-all"
                      style={
                        charData.hairStyle === h.emoji
                          ? { background: "rgba(253,216,53,0.15)", borderColor: "#FDD835" }
                          : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)" }
                      }
                    >
                      <span className="text-xl">{h.emoji}</span>
                      <span className="text-[0.36rem]" style={{ color: "rgba(255,255,255,0.75)" }}>{h.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={next}
                className="font-pixel text-[0.52rem] px-8 py-2.5 rounded-lg cursor-pointer transition-all hover:-translate-y-0.5 mt-1"
                style={{ background: "#FDD835", color: "#0d1642" }}
              >
                다음 →
              </button>
            </motion.div>
          )}

          {/* ── Scene 1: Title ────────────────────────────────────── */}
          {scene === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 text-center px-8"
            >
              <p
                className="font-pixel text-[0.44rem] tracking-[0.14em] uppercase"
                style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                실화를 바탕으로 한 시뮬레이션
              </p>
              <div className="text-[4.5rem] leading-none">🏠</div>
              <h1
                className="font-pixel leading-relaxed"
                style={{
                  color:      "#FDD835",
                  fontSize:   "clamp(0.9rem,2.8vw,1.9rem)",
                  textShadow: "0 0 40px rgba(253,216,53,0.5), 0 2px 8px rgba(0,0,0,0.9)",
                }}
              >
                {TITLE_LETTERS.map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                ))}
              </h1>
              <p
                className="text-sm text-white leading-loose max-w-[500px]"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                더블린엔 빈 땅이 있다.<br />그런데 왜 집은 없을까?
              </p>
              <SceneButtons onNext={next} onSkip={skipToEnd} />
            </motion.div>
          )}

          {/* ── Scene 2: 김석준 ───────────────────────────────────── */}
          {scene === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 text-center px-8 max-w-lg w-full"
            >
              <p
                className="font-pixel text-[0.44rem] tracking-[0.14em] uppercase"
                style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                2025년 9월 · 더블린 국제공항 ✈️
              </p>
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="flex items-center gap-4 rounded-2xl px-5 py-3 max-w-sm w-full"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)" }}
              >
                <span className="text-4xl">🎓</span>
                <div className="text-left">
                  <div
                    className="text-sm font-black text-white"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                  >
                    {charData.name.trim() || "김석준"} ({charData.age}세)
                  </div>
                  <div
                    className="font-pixel text-[0.44rem] mt-0.5"
                    style={{ color: "rgba(255,255,255,0.75)", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                  >
                    UCD 경영학 박사과정 · 전북 전주 출신
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
                className="text-[0.78rem] text-white leading-loose text-left rounded-2xl rounded-bl-none px-4 py-3 max-w-sm w-full"
                style={{
                  background:  "rgba(21,101,192,0.6)",
                  border:      "1px solid rgba(255,255,255,0.22)",
                  textShadow:  "0 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                &ldquo;드디어 더블린이다! 🍀<br />꿈에 그리던 아일랜드 유학...<br />일단 집부터 구해야겠어!&rdquo;
              </motion.div>
              <SceneButtons onNext={next} onSkip={skipToEnd} />
            </motion.div>
          )}

          {/* ── Scene 3: 집값 충격 ─────────────────────────────────── */}
          {scene === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 text-center px-8"
            >
              <p
                className="font-pixel text-[0.44rem] tracking-[0.14em] uppercase"
                style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                📱 Daft.ie 더블린 매물 검색 중...
              </p>
              <div
                className="rounded-[22px] p-3 w-60"
                style={{ background: "#0f172a", border: "3px solid #1e293b", boxShadow: "0 25px 60px rgba(0,0,0,0.65)" }}
              >
                <div
                  className="rounded-lg px-2.5 py-1 mb-2 text-[0.46rem]"
                  style={{ background: "#1e293b", color: "#94a3b8" }}
                >
                  🏠 daft.ie &nbsp;·&nbsp; Dublin
                </div>
                {[
                  { type: "Studio · Dublin City Centre", price: "€2,100", per: "/month", note: "방 1개, 화장실 공유",          hot: false },
                  { type: "1-Bed · Dublin 4",            price: "€2,650", per: "/month", note: "즉시 입주 가능",              hot: false },
                  { type: "⚡ Room Share · Dublin 7",    price: "€1,400", per: "/month", note: "오늘 마감 · 지금 12명 보는 중", hot: true  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.18, duration: 0.35 }}
                    className="rounded-lg px-2.5 py-2 mb-1 text-left"
                    style={{ background: "#1e293b", borderLeft: item.hot ? "3px solid #ef4444" : undefined }}
                  >
                    <div className="text-[0.38rem] mb-0.5" style={{ color: "#94a3b8" }}>{item.type}</div>
                    <div className="text-[0.82rem] font-black text-white leading-none">
                      {item.price}<span className="text-[0.38rem] font-normal" style={{ color: "#94a3b8" }}>{item.per}</span>
                    </div>
                    <div className="text-[0.37rem] mt-0.5" style={{ color: "#cbd5e1" }}>{item.note}</div>
                  </motion.div>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="text-[0.82rem] text-white leading-loose max-w-xs"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                &ldquo;잠깐... 😱<br />방 하나에 <strong style={{ color: "#FDD835" }}>월 200만원?!</strong><br />이게 무슨 나라야...&rdquo;
              </motion.p>
              <SceneButtons onNext={next} onSkip={skipToEnd} />
            </motion.div>
          )}

          {/* ── Scene 4: 삼촌 전화 ─────────────────────────────────── */}
          {scene === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 text-center px-8 max-w-lg w-full"
            >
              <p
                className="font-pixel text-[0.44rem] tracking-[0.14em] uppercase"
                style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                📞 한국으로 국제전화 연결 중...
              </p>
              <CallScene playerName={charData.name.trim() || "김석준"} />
              <SceneButtons onNext={next} onSkip={skipToEnd} />
            </motion.div>
          )}

          {/* ── Scene 5: 미션 브리핑 ───────────────────────────────── */}
          {scene === 5 && (
            <motion.div
              key="s5"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 text-center px-8 max-w-md w-full"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[1.9rem] border-4 border-white"
                style={{ background: "linear-gradient(135deg,#FB8C00,#FFB300)", boxShadow: "0 8px 30px rgba(251,140,0,0.4)" }}
              >
                👷
              </motion.div>
              <div
                className="font-pixel text-[0.52rem] mt-1"
                style={{ color: "#FFB300", textShadow: "0 1px 6px rgba(255,179,0,0.5)" }}
              >
                김건설 삼촌 — 건설사 대표
              </div>
              <div className="grid grid-cols-2 gap-1.5 w-full">
                {["🗺️ 더블린 빈 땅 공략", "🏗️ 아파트 설계 & 건설", "📉 전체 집값 낮추기", "🏕️ 노숙자 줄이기"].map((txt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="text-[0.58rem] text-white rounded-xl px-2.5 py-2"
                    style={{
                      background:  "rgba(255,255,255,0.1)",
                      border:      "1px solid rgba(255,255,255,0.25)",
                      textShadow:  "0 1px 3px rgba(0,0,0,0.7)",
                    }}
                  >
                    {txt}
                  </motion.div>
                ))}
              </div>
              <div
                className="w-full rounded-xl px-4 py-3"
                style={{ background: "rgba(229,57,53,0.12)", border: "1px solid rgba(229,57,53,0.38)" }}
              >
                {[
                  "📌 더블린 평균 월세 €2,300/월 (한화 약 330만원)",
                  "📌 긴급 노숙자 13,400명 (2025년 기준)",
                  "📌 수년간 방치된 빈 땅 19곳",
                ].map((l, i) => (
                  <div
                    key={i}
                    className="text-[0.54rem] text-white text-left leading-loose"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <SceneButtons onNext={next} onSkip={skipToEnd} />
            </motion.div>
          )}

          {/* ── Scene 6: 난이도 선택 ───────────────────────────────── */}
          {scene === 6 && (
            <motion.div
              key="s6"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center gap-3.5 text-center w-full max-w-md"
            >
              <p
                className="font-pixel text-[0.44rem] tracking-[0.1em] uppercase"
                style={{ color: "#FDD835", textShadow: "0 1px 6px rgba(253,216,53,0.6)" }}
              >
                ⚙️ 난이도 선택
              </p>
              <p
                className="text-[0.58rem] text-white"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                게임 방식을 선택하세요. 시작 후 변경 불가.
              </p>

              <div className="flex flex-col gap-2 w-full">
                {DIFF_CARDS.map(card => (
                  <motion.button
                    key={card.id}
                    onClick={() => setSelectedDiff(card.id)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full rounded-2xl p-3.5 text-left cursor-pointer transition-all"
                    style={
                      selectedDiff === card.id
                        ? {
                            background:  `rgba(${card.id === "easy" ? "253,216,53" : card.id === "normal" ? "251,140,0" : "229,57,53"},0.18)`,
                            border:      `2px solid ${card.color}`,
                            boxShadow:   `0 0 18px ${card.color}38`,
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border:     "2px solid rgba(255,255,255,0.16)",
                          }
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{card.emoji}</span>
                      <div className="flex-1 text-left">
                        <div
                          className="font-pixel text-[0.54rem] mb-0.5"
                          style={{
                            color:      selectedDiff === card.id ? card.color : "#fff",
                            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                          }}
                        >
                          {card.label}
                        </div>
                        <div
                          className="text-[0.5rem] text-white leading-relaxed"
                          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
                        >
                          {card.desc}
                        </div>
                        <div
                          className="text-[0.44rem] mt-0.5"
                          style={{ color: "rgba(255,255,255,0.65)", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
                        >
                          {card.detail}
                        </div>
                      </div>
                      {selectedDiff === card.id && (
                        <span className="text-xl" style={{ color: card.color }}>✓</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={handleComplete}
                disabled={!selectedDiff}
                className="font-pixel text-[0.58rem] border-none rounded-xl px-10 py-3.5 cursor-pointer mt-1 transition-all"
                style={
                  selectedDiff
                    ? { background: "linear-gradient(135deg,#FDD835,#FFB300)", color: "#0d1642", boxShadow: "0 6px 28px rgba(253,216,53,0.4)" }
                    : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", cursor: "not-allowed" }
                }
                animate={selectedDiff ? {
                  boxShadow: [
                    "0 6px 28px rgba(253,216,53,0.4)",
                    "0 10px 42px rgba(253,216,53,0.75)",
                    "0 6px 28px rgba(253,216,53,0.4)",
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={selectedDiff ? { y: -3 } : {}}
              >
                🏗️ 건설 시작하기!
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
