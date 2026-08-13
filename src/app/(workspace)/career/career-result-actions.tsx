"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Scale } from "lucide-react"
import { localizePath } from "@/lib/i18n/config"
import { createClient } from "@/lib/supabase-client"
import type { OverviewSearchValues } from "../home/home-overview-config"
import { buildCareerResultHref, getCareerResultCompareHref } from "./career-result-context"

type Locale = "en" | "ko"
type AuthState = "loading" | "signed-out" | "incomplete" | "complete"

function onboardingHref(query: OverviewSearchValues, locale: Locale) {
  const params = new URLSearchParams({ country: query.country, occupation: query.occupation })
  return `${localizePath("/onboarding", locale)}?${params.toString()}`
}

export function CareerResultActions({ query, locale }: { query: OverviewSearchValues; locale: Locale }) {
  const supabase = useMemo(() => createClient(), [])
  const [authState, setAuthState] = useState<AuthState>("loading")
  const compareHref = getCareerResultCompareHref(query)
  const onboarding = onboardingHref(query, locale)
  const personalisedResult = localizePath(buildCareerResultHref(query, true), locale)

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return
      if (!user) {
        setAuthState("signed-out")
        return
      }

      const { data } = await supabase
        .from("user_preferences")
        .select("career_personalisation_completed_at")
        .eq("id", user.id)
        .maybeSingle()

      if (!active) return
      setAuthState(data?.career_personalisation_completed_at ? "complete" : "incomplete")
    })
    return () => { active = false }
  }, [supabase])

  if (authState === "loading") {
    return <div className="mt-4 h-11 max-w-md animate-pulse rounded-xl bg-slate-100" aria-hidden="true" />
  }

  const primaryHref = authState === "signed-out"
    ? `${localizePath("/login", locale)}?next=${encodeURIComponent(onboarding)}`
    : authState === "complete"
      ? personalisedResult
      : onboarding

  const primaryLabel = locale === "ko"
    ? authState === "signed-out"
      ? "로그인하고 내 경로 보기"
      : authState === "complete"
        ? "내 경로 보기"
        : "내 조건 입력하기"
    : authState === "signed-out"
      ? "Sign in to see my path"
      : authState === "complete"
        ? "View my path"
        : "Add my details"

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={locale === "ko" ? "커리어 결과 작업" : "Career result actions"}>
      <Link href={primaryHref} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
        {primaryLabel} <ArrowRight className="size-4" />
      </Link>

      {authState === "complete" ? (
        <Link href={onboarding} className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
          {locale === "ko" ? "조건 수정" : "Update details"}
        </Link>
      ) : null}

      {compareHref ? (
        <Link href={localizePath(compareHref, locale)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800">
          <Scale className="size-4" /> {locale === "ko" ? "현재 직업으로 비교" : "Compare this career"}
        </Link>
      ) : null}
    </div>
  )
}
