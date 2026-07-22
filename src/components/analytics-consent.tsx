"use client"

import { useEffect, useState } from "react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

const CONSENT_COOKIE = "cc_analytics_consent"

function writeConsent(value: "granted" | "denied") {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
  window.dispatchEvent(new Event("campcareer-consent"))
}

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(false)
  const locale = useRouteLocale()
  const isKo = locale === "ko"

  useEffect(() => {
    setVisible(!document.cookie.split("; ").some((item) => item.startsWith(`${CONSENT_COOKIE}=`)))
  }, [])

  if (!visible) return null

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[1100] mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:bottom-5" aria-label="Privacy choices">
      <p className="text-sm font-semibold text-slate-900">{isKo ? "CampCareer 개선에 도움을 주세요" : "Help us improve CampCareer"}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{isKo ? "선택적 제품 측정은 검색·비교·파트너 링크가 제대로 작동하는지 이해하는 데만 사용합니다. 이메일이나 자유 입력 내용은 포함하지 않습니다." : "Optional product measurement helps us understand whether search, comparison, and partner links work. It never includes your email or free-text answers."}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => { writeConsent("denied"); setVisible(false) }} className="min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">{isKo ? "필수 기능만" : "Essential only"}</button>
        <button type="button" onClick={() => { writeConsent("granted"); setVisible(false) }} className="min-h-9 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700">{isKo ? "측정 허용" : "Allow measurement"}</button>
      </div>
    </aside>
  )
}
