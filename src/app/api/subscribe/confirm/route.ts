import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { flowPage, htmlResponse } from "@/lib/email/flow-page"
import { siteUrl } from "@/lib/email/links"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function cookieLocale(): Locale {
  const v = cookies().get(LOCALE_COOKIE)?.value
  return isLocale(v) ? v : "en"
}

const COPY = {
  en: {
    title: "Subscription confirmed — CampCareer",
    cta: "Explore CampCareer",
    successHeading: "You're subscribed",
    successBody:
      "Thanks — your visa-policy alerts are now active. We'll email you the moment the rules for this path change.",
    alreadyHeading: "Already confirmed",
    alreadyBody: "This subscription was already confirmed. You're all set — no further action needed.",
    invalidHeading: "This link isn't valid",
    invalidBody:
      "This confirmation link is invalid or has expired. Please subscribe again from the site and we'll send a fresh confirmation email.",
  },
  ko: {
    title: "구독 확인 완료 — CampCareer",
    cta: "CampCareer 둘러보기",
    successHeading: "구독이 확인되었습니다",
    successBody:
      "감사합니다 — 비자정책 알림이 활성화되었습니다. 이 경로의 규정이 바뀌는 즉시 이메일로 알려드리겠습니다.",
    alreadyHeading: "이미 확인된 구독입니다",
    alreadyBody: "이 구독은 이미 확인되었습니다. 추가로 하실 일은 없습니다.",
    invalidHeading: "유효하지 않은 링크입니다",
    invalidBody:
      "이 확인 링크가 유효하지 않거나 만료되었습니다. 사이트에서 다시 구독하시면 새 확인 메일을 보내드립니다.",
  },
} satisfies Record<Locale, Record<string, string>>

export async function GET(req: Request): Promise<Response> {
  const token = new URL(req.url).searchParams.get("token") ?? ""

  const invalid = (locale: Locale) =>
    htmlResponse(
      flowPage({
        locale,
        title: COPY[locale].title,
        heading: COPY[locale].invalidHeading,
        body: COPY[locale].invalidBody,
        ctaHref: siteUrl(),
        ctaLabel: COPY[locale].cta,
      }),
      400
    )

  if (!UUID_RE.test(token)) return invalid(cookieLocale())

  const initialLookup = await supabaseAdmin
    .from("subscriptions")
    .select("id, confirmed, locale, acquisition_session_id, first_path, utm, decision_context")
    .eq("unsubscribe_token", token)
    .limit(1)
  let data: Array<{
    id: string
    confirmed: boolean
    locale: string | null
    acquisition_session_id?: string | null
    first_path?: string | null
    utm?: Record<string, string> | null
    decision_context?: Record<string, string> | null
  }> | null = initialLookup.data
  let error = initialLookup.error

  // Allow confirmation links to keep working if application code reaches a
  // deployment before the attribution migration is applied.
  if (error && (error.code === "42703" || /acquisition_session_id|first_path|decision_context|utm/i.test(error.message))) {
    const fallbackLookup = await supabaseAdmin
      .from("subscriptions")
      .select("id, confirmed, locale")
      .eq("unsubscribe_token", token)
      .limit(1)
    data = fallbackLookup.data
    error = fallbackLookup.error
  }

  if (error) {
    console.error("[visa-alert] confirm lookup failed:", error.message)
    return invalid(cookieLocale())
  }
  const row = data?.[0]
  if (!row) return invalid(cookieLocale())

  const locale: Locale = isLocale(row.locale) ? row.locale : cookieLocale()
  const c = COPY[locale]

  if (row.confirmed) {
    return htmlResponse(
      flowPage({ locale, title: c.title, heading: c.alreadyHeading, body: c.alreadyBody, ctaHref: siteUrl(), ctaLabel: c.cta })
    )
  }

  const { error: updateError } = await supabaseAdmin
    .from("subscriptions")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("id", row.id)

  if (updateError) {
    console.error("[visa-alert] confirm update failed:", updateError.message)
    return invalid(locale)
  }

  if (row.acquisition_session_id || row.first_path || row.decision_context) {
    const { error: eventError } = await supabaseAdmin.from("analytics_events").insert({
      event_name: "lead_confirmed",
      session_id: row.acquisition_session_id ?? null,
      path: "/api/subscribe/confirm",
      first_path: row.first_path ?? null,
      utm: row.utm ?? {},
      context: { lead_type: row.decision_context && Object.keys(row.decision_context).length > 0 ? "decision_brief" : "visa_alert" },
    })
    if (eventError && eventError.code !== "42P01") {
      console.error("[analytics] confirmation event write failed:", eventError.message)
    }
  }

  return htmlResponse(
    flowPage({ locale, title: c.title, heading: c.successHeading, body: c.successBody, ctaHref: siteUrl(), ctaLabel: c.cta })
  )
}
