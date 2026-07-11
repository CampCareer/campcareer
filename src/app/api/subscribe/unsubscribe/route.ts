import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { flowPage, htmlResponse } from "@/lib/email/flow-page"
import { siteUrl } from "@/lib/email/links"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function cookieLocale(): Promise<Locale> {
  const v = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(v) ? v : "en"
}

const COPY = {
  en: {
    title: "Unsubscribed — CampCareer",
    cta: "Return to CampCareer",
    doneHeading: "You've been unsubscribed",
    doneBody:
      "You won't receive any more visa-policy alert emails for this subscription. You can resubscribe anytime from the site.",
    alreadyHeading: "Already unsubscribed",
    alreadyBody: "This subscription was already unsubscribed — you won't receive further alerts.",
    invalidHeading: "We couldn't find that subscription",
    invalidBody:
      "This unsubscribe link is invalid or has expired. If you keep receiving emails you didn't expect, contact us at contact@campcareer.com and we'll remove you right away.",
  },
  ko: {
    title: "구독 취소 완료 — CampCareer",
    cta: "CampCareer로 돌아가기",
    doneHeading: "구독이 취소되었습니다",
    doneBody:
      "이 구독에 대한 비자정책 알림 메일을 더 이상 받지 않습니다. 사이트에서 언제든 다시 구독하실 수 있습니다.",
    alreadyHeading: "이미 취소된 구독입니다",
    alreadyBody: "이 구독은 이미 취소되어 더 이상 알림을 받지 않습니다.",
    invalidHeading: "구독을 찾을 수 없습니다",
    invalidBody:
      "이 구독 취소 링크가 유효하지 않거나 만료되었습니다. 예상치 못한 메일을 계속 받으신다면 contact@campcareer.com으로 알려주시면 즉시 처리해 드리겠습니다.",
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

  if (!UUID_RE.test(token)) return invalid(await cookieLocale())

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("id, locale, unsubscribed_at")
    .eq("unsubscribe_token", token)
    .limit(1)

  if (error) {
    console.error("[visa-alert] unsubscribe lookup failed:", error.message)
    return invalid(await cookieLocale())
  }
  const row = data?.[0]
  if (!row) return invalid(await cookieLocale())

  const locale: Locale = isLocale(row.locale) ? row.locale : await cookieLocale()
  const c = COPY[locale]

  if (row.unsubscribed_at) {
    return htmlResponse(
      flowPage({ locale, title: c.title, heading: c.alreadyHeading, body: c.alreadyBody, ctaHref: siteUrl(), ctaLabel: c.cta })
    )
  }

  // Soft unsubscribe — keep the row, set the timestamp.
  const { error: updateError } = await supabaseAdmin
    .from("subscriptions")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", row.id)

  if (updateError) {
    console.error("[visa-alert] unsubscribe update failed:", updateError.message)
    return invalid(locale)
  }

  return htmlResponse(
    flowPage({ locale, title: c.title, heading: c.doneHeading, body: c.doneBody, ctaHref: siteUrl(), ctaLabel: c.cta })
  )
}
