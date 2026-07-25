"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import type { User } from "@supabase/supabase-js"

const YEARS = Array.from({ length: 100 }, (_, i) => 2026 - i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export function BirthdayPrompt({ user }: { user: User }) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const supabase = useMemo(() => createClient(), [])

  const [year, setYear] = useState<number | null>(null)
  const [month, setMonth] = useState<number | null>(null)
  const [day, setDay] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const maxDay = year && month ? daysInMonth(year, month) : 31
  const canSubmit = year !== null && month !== null && day !== null && day <= maxDay

  useEffect(() => {
    if (day !== null && day > maxDay) setDay(null)
  }, [maxDay, day])

  async function handleSubmit() {
    if (!canSubmit || saving) return
    setSaving(true)
    const mm = String(month).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    const birthday = `${year}-${mm}-${dd}`
    await supabase.from("user_preferences").upsert({ id: user.id, birthday, updated_at: new Date().toISOString() })
    window.location.reload()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-xl font-semibold tracking-tight text-slate-950">
          {isKo ? "생일이 언제인가요?" : "When's your birthday?"}
        </h2>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <label className="block text-xs font-semibold text-slate-500">
            {isKo ? "연도" : "Year"}
            <select value={year ?? ""} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              <option value=""></option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>

          <label className="block text-xs font-semibold text-slate-500">
            {isKo ? "월" : "Month"}
            <select value={month ?? ""} onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              <option value=""></option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>

          <label className="block text-xs font-semibold text-slate-500">
            {isKo ? "일" : "Day"}
            <select value={day ?? ""} onChange={(e) => setDay(e.target.value ? Number(e.target.value) : null)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              <option value=""></option>
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          {isKo ? "입력하신 생년월일은 공개되지 않습니다." : "Your birthday won't be shown publicly."}
        </p>

        <button disabled={!canSubmit || saving} onClick={void handleSubmit} className="mt-4 h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40">
          {isKo ? "계속하기" : "Continue"}
        </button>
      </div>
    </div>
  )
}
