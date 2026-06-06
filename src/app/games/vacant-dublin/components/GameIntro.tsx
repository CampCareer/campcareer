"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Props { onComplete: () => void }

const SCENES = 5

// typing hook
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

const TITLE_LETTERS = "VACANT DUBLIN".split("")

export function GameIntro({ onComplete }: Props) {
  const [scene, setScene] = useState(0)

  const next = () => setScene(s => Math.min(s + 1, SCENES - 1))

  const slideVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -60 },
  }

  return (
    <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg,#020817 0%,#04091c 50%,#080f28 100%)" }}>

      {/* progress dots */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: SCENES }).map((_, i) => (
          <div key={i} className="h-[3px] rounded-sm transition-all duration-300"
            style={{ width: i === scene ? 42 : 26, background: i === scene ? "#FDD835" : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ─── Scene 0: Title ─────────────────────────────────── */}
        {scene === 0 && (
          <motion.div key="s0" variants={slideVariants} initial="initial" animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }} exit={{ opacity: 0, x: -60, transition: { duration: 0.35 } }}
            className="flex flex-col items-center gap-3 text-center px-8">
            <p className="font-pixel text-[0.38rem] text-white/25 tracking-[0.14em] uppercase">실화를 바탕으로 한 시뮬레이션</p>
            <div className="text-[4.5rem] leading-none">🏠</div>
            <h1 className="font-pixel leading-relaxed" style={{ color: "#FDD835", fontSize: "clamp(0.9rem,2.8vw,1.9rem)", textShadow: "0 0 40px rgba(253,216,53,0.35)" }}>
              {TITLE_LETTERS.map((ch, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}>
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </h1>
            <p className="text-sm text-white/55 leading-loose max-w-[500px]">
              더블린엔 빈 땅이 있다.<br />그런데 왜 집은 없을까?
            </p>
            <button onClick={next} className="mt-1 font-pixel text-[0.5rem] bg-[#FDD835] text-[#0d1642] px-8 py-3 rounded-lg cursor-pointer hover:bg-[#ffe57f] hover:-translate-y-0.5 transition-all">
              이야기 시작 →
            </button>
            <button onClick={onComplete} className="font-pixel text-[0.46rem] bg-transparent border-none text-white/20 cursor-pointer hover:text-white/50 transition-colors">
              건너뛰기
            </button>
          </motion.div>
        )}

        {/* ─── Scene 1: 김석준 ─────────────────────────────────── */}
        {scene === 1 && (
          <motion.div key="s1" variants={slideVariants} initial="initial" animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }} exit={{ opacity: 0, x: -60, transition: { duration: 0.35 } }}
            className="flex flex-col items-center gap-3 text-center px-8 max-w-lg w-full">
            <p className="font-pixel text-[0.38rem] text-white/25 tracking-[0.14em] uppercase">2025년 9월 · 더블린 국제공항 ✈️</p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 max-w-sm w-full">
              <span className="text-4xl">🎓</span>
              <div className="text-left">
                <div className="text-sm font-black text-white">김석준 (25세)</div>
                <div className="font-pixel text-[0.4rem] text-white/35 mt-0.5">UCD 경영학 박사과정 · 전북 전주 출신</div>
              </div>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
              className="text-[0.78rem] text-white/90 leading-loose text-left rounded-2xl rounded-bl-none px-4 py-3 max-w-sm w-full"
              style={{ background: "rgba(21,101,192,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}>
              "드디어 더블린이다! 🍀<br />꿈에 그리던 아일랜드 유학...<br />일단 집부터 구해야겠어!"
            </motion.div>
            <SceneButtons onNext={next} onSkip={onComplete} />
          </motion.div>
        )}

        {/* ─── Scene 2: 집값 충격 ───────────────────────────────── */}
        {scene === 2 && (
          <motion.div key="s2" variants={slideVariants} initial="initial" animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }} exit={{ opacity: 0, x: -60, transition: { duration: 0.35 } }}
            className="flex flex-col items-center gap-3 text-center px-8">
            <p className="font-pixel text-[0.38rem] text-white/25 tracking-[0.14em] uppercase">📱 Daft.ie 더블린 매물 검색 중...</p>
            <div className="rounded-[22px] p-3 w-60" style={{ background: "#0f172a", border: "3px solid #1e293b", boxShadow: "0 25px 60px rgba(0,0,0,0.65)" }}>
              <div className="rounded-lg px-2.5 py-1 mb-2 text-[0.46rem] text-[#64748b]" style={{ background: "#1e293b" }}>
                🏠 daft.ie &nbsp;·&nbsp; Dublin
              </div>
              {[
                { type: "Studio · Dublin City Centre", price: "€2,100", per: "/month", note: "방 1개, 화장실 공유", hot: false },
                { type: "1-Bed · Dublin 4",            price: "€2,650", per: "/month", note: "즉시 입주 가능",      hot: false },
                { type: "⚡ Room Share · Dublin 7",    price: "€1,400", per: "/month", note: "오늘 마감 · 지금 12명 보는 중", hot: true },
              ].map((item, i) => (
                <motion.div key={i} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.18, duration: 0.35 }}
                  className="rounded-lg px-2.5 py-2 mb-1 text-left"
                  style={{ background: "#1e293b", borderLeft: item.hot ? "3px solid #ef4444" : undefined }}>
                  <div className="text-[0.38rem] text-[#64748b] mb-0.5">{item.type}</div>
                  <div className="text-[0.82rem] font-black text-white leading-none">
                    {item.price}<span className="text-[0.38rem] font-normal text-[#64748b]">{item.per}</span>
                  </div>
                  <div className="text-[0.37rem] text-[#94a3b8] mt-0.5">{item.note}</div>
                </motion.div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-[0.82rem] text-white/92 leading-loose max-w-xs">
              "잠깐... 😱<br />방 하나에 <strong style={{ color: "#FDD835" }}>월 200만원?!</strong><br />이게 무슨 나라야..."
            </motion.p>
            <SceneButtons onNext={next} onSkip={onComplete} />
          </motion.div>
        )}

        {/* ─── Scene 3: 삼촌 전화 ──────────────────────────────── */}
        {scene === 3 && (
          <motion.div key="s3" variants={slideVariants} initial="initial" animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }} exit={{ opacity: 0, x: -60, transition: { duration: 0.35 } }}
            className="flex flex-col items-center gap-3 text-center px-8 max-w-lg w-full">
            <p className="font-pixel text-[0.38rem] text-white/25 tracking-[0.14em] uppercase">📞 한국으로 국제전화 연결 중...</p>
            <CallScene />
            <SceneButtons onNext={next} onSkip={onComplete} />
          </motion.div>
        )}

        {/* ─── Scene 4: 미션 ───────────────────────────────────── */}
        {scene === 4 && (
          <motion.div key="s4" variants={slideVariants} initial="initial" animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }} exit={{ opacity: 0, x: -60, transition: { duration: 0.35 } }}
            className="flex flex-col items-center gap-3 text-center px-8 max-w-md w-full">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[1.9rem] border-4 border-white"
              style={{ background: "linear-gradient(135deg,#FB8C00,#FFB300)", boxShadow: "0 8px 30px rgba(251,140,0,0.4)" }}>
              👷
            </motion.div>
            <div className="font-pixel text-[0.5rem] mt-1" style={{ color: "#FFB300" }}>김건설 삼촌 — 건설사 대표</div>
            <div className="grid grid-cols-2 gap-1.5 w-full">
              {["🗺️ 더블린 빈 땅 공략","🏗️ 아파트 설계 & 건설","📉 전체 집값 낮추기","🏕️ 노숙자 줄이기"].map((txt, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="text-[0.58rem] text-white/82 bg-white/5 border border-white/10 rounded-xl px-2.5 py-2">
                  {txt}
                </motion.div>
              ))}
            </div>
            <div className="w-full rounded-xl px-4 py-3" style={{ background: "rgba(229,57,53,0.07)", border: "1px solid rgba(229,57,53,0.2)" }}>
              {[
                "📌 더블린 평균 월세 €2,300/월 (한화 약 330만원)",
                "📌 긴급 노숙자 13,400명 (2025년 기준)",
                "📌 수년간 방치된 빈 땅 19곳",
              ].map((l, i) => (
                <div key={i} className="text-[0.54rem] text-white/58 text-left leading-loose">{l}</div>
              ))}
            </div>
            <motion.button onClick={onComplete}
              className="font-pixel text-[0.56rem] text-[#0d1642] border-none rounded-xl px-10 py-3.5 cursor-pointer mt-1"
              style={{ background: "linear-gradient(135deg,#FDD835,#FFB300)", boxShadow: "0 6px 28px rgba(253,216,53,0.4)" }}
              animate={{ boxShadow: ["0 6px 28px rgba(253,216,53,0.4)", "0 10px 42px rgba(253,216,53,0.75)", "0 6px 28px rgba(253,216,53,0.4)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ y: -3 }}>
              🏗️ 건설 시작하기!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SceneButtons({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-1">
      <button onClick={onNext} className="font-pixel text-[0.5rem] bg-[#FDD835] text-[#0d1642] px-8 py-2.5 rounded-lg cursor-pointer hover:bg-[#ffe57f] hover:-translate-y-0.5 transition-all">
        다음 →
      </button>
      <button onClick={onSkip} className="font-pixel text-[0.46rem] bg-transparent border-none text-white/20 cursor-pointer hover:text-white/50 transition-colors">
        건너뛰기
      </button>
    </div>
  )
}

function CallScene() {
  const line1 = "삼촌... 여기 방 하나에 월세가 200만원이에요. 빈 땅은 그렇게 많다는데..."
  const line2 = "😤 뭐?! 그 넓은 더블린에\n빈 땅이 많은데 왜 집을 안 짓는 거야?!"
  const line3 = "내가 직접 지어드리겠다!!! 🏗\n조카 걱정은 안 해도 돼!"
  const t1 = useTyping(line1, true, 30)
  const t2 = useTyping(line2, t1.length >= line1.length, 30)
  const t3 = useTyping(line3, t2.length >= line2.length, 30)

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div>
        <div className="flex items-center gap-2 text-[0.46rem] text-white/32"><span>🎓</span><span>김석준 (더블린)</span></div>
        <div className="ml-auto mt-1 rounded-2xl rounded-br-none px-3 py-2 text-[0.62rem] text-white/90 leading-loose text-left max-w-[280px] whitespace-pre-line"
          style={{ background: "#1a3a1a", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #4CAF50" }}>
          {t1}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 text-[0.46rem] text-white/32 flex-row-reverse"><span>👷</span><span>김건설 삼촌 (서울)</span></div>
        <div className="mt-1 rounded-2xl rounded-bl-none px-3 py-2 text-[0.62rem] text-white/90 leading-loose text-left max-w-[280px] whitespace-pre-line"
          style={{ background: "#1e3a5f", border: "1px solid rgba(255,255,255,0.1)" }}>
          {t2}
        </div>
        {t2.length >= line2.length && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}
            className="mt-2 rounded-2xl rounded-bl-none px-3 py-2 text-[0.62rem] text-white/90 leading-loose text-left max-w-[280px] whitespace-pre-line"
            style={{ background: "#1a3a1a", borderLeft: "3px solid #4CAF50" }}>
            {t3}
          </motion.div>
        )}
      </div>
    </div>
  )
}
