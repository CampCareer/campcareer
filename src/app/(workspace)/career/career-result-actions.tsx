"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Bookmark, Check, Scale } from "lucide-react"
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
  const [userId, setUserId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saveBusy, setSaveBusy] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const compareHref = getCareerResultCompareHref(query)
  const onboarding = onboardingHref(query, locale)
  const resultHref = localizePath(buildCareerResultHref(query), locale)
  const personalisedResult = localizePath(buildCareerResultHref(query, true), locale)

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return
      if (!user) {
        setAuthState("signed-out")
        setUserId(null)
        return
      }

      setUserId(user.id)
      const [preferenceResult, savedResult] = await Promise.all([
        supabase
          .from("user_preferences")
          .select("career_personalisation_completed_at")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("saved_career_results")
          .select("id")
          .eq("user_id", user.id)
          .eq("country_code", query.country.toUpperCase())
          .eq("career_id", query.occupation)
          .maybeSingle(),
      ])

      if (!active) return
      setAuthState(preferenceResult.data?.career_personalisation_completed_at ? "complete" : "incomplete")
      setSaved(Boolean(savedResult.data))
    })
    return () => { active = false }
  }, [query.country, query.occupation, supabase])

  async function toggleSaved() {
    if (!userId || saveBusy) return
    setSaveBusy(true)
    setSaveError(false)

    const countryCode = query.country.toUpperCase()
    const request = saved
      ? supabase
          .from("saved_career_results")
          .delete()
          .eq("user_id", userId)
          .eq("country_code", countryCode)
          .eq("career_id", query.occupation)
      : supabase
          .from("saved_career_results")
          .upsert(
            {
              user_id: userId,
              country_code: countryCode,
              career_id: query.occupation,
              occupation_id: query.occupation,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,country_code,career_id", ignoreDuplicates: false },
          )

    const { error } = await request
    setSaveBusy(false)
    if (error) {
      setSaveError(true)
      return
    }
    setSaved((current) => !current)
  }

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

  const signedOutSaveHref = `${localizePath("/login", locale)}?next=${encodeURIComponent(resultHref)}`

  return (
    <div className="mt-4" aria-label={locale === "ko" ? "커리어 결과 작업" : "Career result actions"}>
      <div className="flex flex-wrap items-center gap-2">
        <Link href={primaryHref} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
          {primaryLabel} <ArrowRight className="size-4" />
        </Link>

        {authState === "signed-out" ? (
          <Link href={signedOutSaveHref} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800">
            <Bookmark className="size-4" /> {locale === "ko" ? "경로 저장" : "Save path"}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => void toggleSaved()}
            disabled={saveBusy}
            aria-pressed={saved}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-wait disabled:opacity-60"
          >
            {saved ? <Check className="size-4 text-emerald-600" /> : <Bookmark className="size-4" />}
            {locale === "ko" ? (saved ? "저장됨" : "경로 저장") : (saved ? "Saved" : "Save path")}
          </button>
        )}

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
      {saveError ? (
        <p className="mt-2 text-xs font-medium text-rose-700" role="status">
          {locale === "ko" ? "저장하지 못했습니다. 다시 시도해 주세요." : "Could not save this path. Please try again."}
        </p>
      ) : null}
    </div>
  )
}
