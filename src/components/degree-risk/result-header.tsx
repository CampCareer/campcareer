"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { LogoMark } from "@/components/logo-mark"

export function ResultHeader({ startOverLabel }: { startOverLabel: string }) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastY.current && currentY > 80) {
        setHidden(true)
      } else if (currentY < lastY.current) {
        setHidden(false)
      }
      lastY.current = currentY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-slate-200 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-10 md:h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={24} />
          <span className="font-semibold text-slate-900 text-sm tracking-tight">CampCareer</span>
        </Link>
        <Link href="/degree-risk" className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
          {startOverLabel}
        </Link>
      </div>
    </header>
  )
}
