import { cookies } from "next/headers"
import { flowPage, htmlResponse } from "@/lib/email/flow-page"
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { siteUrl } from "@/lib/email/links"
import { supabaseAdmin } from "@/lib/supabase-admin"

const UUID_RE = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i

const COPY = {
  en: {
    title: "Australia report launch update confirmed — CampCareer",
    heading: "You are on the launch-update list",
    body: "Thanks. We will email you when the Australia reports you selected have passed their evidence, payment, and delivery checks. We will not charge you from this list.",
    already: "This email was already confirmed. You are all set.",
    invalid: "This confirmation link is invalid or has expired. Please request a new launch update from CampCareer.",
    cta: "Explore Australia paths",
  },
  ko: {
    title: "호주 리포트 출시 알림 확인 완료 — CampCareer",
    heading: "출시 알림 신청이 완료되었습니다",
    body: "감사합니다. 선택하신 호주 리포트가 근거·결제·전달 검증을 모두 통과하면 이메일로 알려드리겠습니다. 이 알림 신청만으로 결제가 진행되지는 않습니다.",
    already: "이 이메일은 이미 확인되었습니다. 별도로 하실 일은 없습니다.",
    invalid: "이 확인 링크가 유효하지 않거나 만료되었습니다. CampCareer에서 다시 출시 알림을 신청해 주세요.",
    cta: "호주 경로 둘러보기",
  },
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
    .select("id, locale, confirmed")
    .eq("confirmation_token", token)
    .maybeSingle()
  if (error || !data) return response(fallbackLocale, COPY[fallbackLocale].invalid, 400)

  const locale = isLocale(data.locale) ? data.locale : fallbackLocale
  if (data.confirmed) return response(locale, COPY[locale].already)

  const { error: updateError } = await supabaseAdmin
    .from("report_launch_interests")
    .update({ confirmed: true, confirmed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", data.id)
  if (updateError) {
    console.error("[report-launch] confirmation failed", updateError.message)
    return response(locale, COPY[locale].invalid, 400)
  }
  return response(locale, COPY[locale].body)
}
