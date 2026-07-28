"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function StepGenerating({ isKo, onComplete }: { isKo: boolean; onComplete?: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // Transition to plan when progress hits 100
  useEffect(() => {
    if (progress >= 100 && onComplete) {
      const timer = setTimeout(onComplete, 400)
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-3 rounded-full bg-blue-600"
              animate={{
                y: [0, -12, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {isKo
            ? "선택한 방향을 정리하고 있어요"
            : "Preparing your pathway overview"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          {isKo
            ? "선택한 우선순위와 학력 단계에 맞춰 다음 비교 기준을 준비합니다."
            : "We are preparing the next comparison steps for your selected priority and study stage."}
        </p>

        {/* Progress bar */}
        <div className="mx-auto mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  )
}
