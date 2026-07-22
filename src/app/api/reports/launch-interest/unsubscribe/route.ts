import { cookies } from "next/headers"
import { flowPage, htmlResponse } from "@/lib/email/flow-page"
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { siteUrl } from "@/lib/email/links"
import { supabaseAdmin } from "@/lib/supabase-admin"

const UUID_RE = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const COPY = {
  en: { title: "Launch updates stopped — CampCareer", heading: "You will not receive launch updates", body: "Your Australia report launch-update request has been removed.", invalid: "We could not find that launch-update request.", cta: "Return to CampCareer" },
  ko: { title: "출시 알림 수신 거부 완료 — CampCareer", heading: "출시 알림을 더 이상 보내지 않습니다", body: "호주 리포트 출시 알림 신청이 삭제되었습니다.", invalid: "해당 출시 알림 신청을 찾을 수 없습니다.", cta: "CampCareer로 돌아가기" },
} satisfies Record<Locale, Record<string, string>>

async function currentLocale() {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : "en"
}

function response(locale: Locale, body: string, status = 200) {
  const c = COPY[locale]
  return htmlResponse(flowPage({ locale, title: c.title, heading: c.heading, body, ctaHref: siteUrl(), ctaLabel: c.cta }), status)
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? ""
  const fallbackLocale = await currentLocale()
  if (!UUID_RE.test(token)) return response(fallbackLocale, COPY[fallbackLocale].invalid, 400)

  const { data, error } = await supabaseAdmin
    .from("report_launch_interests")
    .select("id, locale, unsubscribed_at")
    .eq("confirmation_token", token)
    .maybeSingle()
  if (error || !data) return response(fallbackLocale, COPY[fallbackLocale].invalid, 400)

  const locale = isLocale(data.locale) ? data.locale : fallbackLocale
  if (!data.unsubscribed_at) {
    const now = new Date().toISOString()
    const { error: updateError } = await supabaseAdmin
      .from("report_launch_interests")
      .update({ unsubscribed_at: now, retention_expires_at: now, updated_at: now })
      .eq("id", data.id)
    if (updateError) {
      console.error("[report-launch] unsubscribe failed", updateError.message)
      return response(locale, COPY[locale].invalid, 400)
    }
  }
  return response(locale, COPY[locale].body)
}
