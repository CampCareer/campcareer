"use server"

import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { sendEmail } from "@/lib/email/send"
import { confirmEmail } from "@/lib/email/templates"
import { confirmUrl, unsubscribeUrl } from "@/lib/email/links"
import { getServerAcquisitionContext, sanitizeDecisionContext } from "@/lib/acquisition"
import {
  type Answers,
  type MajorRow,
  type ResultView,
  MAJOR_COLUMNS,
  OTHER_MAJOR,
  QUESTIONS,
  isMajorSlug,
  resolveView,
  viewCountries,
} from "@/lib/degree-risk"

export interface SubmitResult {
  ok: boolean
  assessmentId: string | null
  view: ResultView
  error?: string
}

// RLS allows anon INSERT (not SELECT) on assessments, so we generate the id
// ourselves instead of reading it back with `.select()`.
export async function submitAssessment(answers: Answers): Promise<SubmitResult> {
  const view = resolveView(answers.country_pref)

  const isOther = answers.major_pref === OTHER_MAJOR
  if (!isMajorSlug(answers.major_pref) && !isOther) {
    return { ok: false, assessmentId: null, view, error: "Unknown major." }
  }
  for (const q of QUESTIONS) {
    const value = answers[q.key]
    if (!q.options.some((o) => o.value === value)) {
      return { ok: false, assessmentId: null, view, error: "Please answer every question." }
    }
  }

  const supabase = await createClient()
  // Link the assessment to the account when the visitor is already signed in;
  // anonymous visitors leave user_id null (claimed later on login). RLS allows
  // both (insert policy: user_id IS NULL OR user_id = auth.uid()).
  const { data: authData } = await supabase.auth.getUser()
  const userId = authData.user?.id ?? null

  let majors: unknown[] | null = []
  if (!isOther) {
    const { data } = await supabase
      .from("majors")
      .select(MAJOR_COLUMNS)
      .eq("slug", answers.major_pref)
      .in("country", viewCountries(view))
    majors = data
    if (!majors || majors.length === 0) {
      console.warn(`[degree-risk] No majors row found for slug="${answers.major_pref}" countries="${viewCountries(view).join(",")}"`)
    }
  }

  const snapshot = ((majors ?? []) as unknown as MajorRow[]).map((m) => ({
    slug: m.slug,
    country: m.country,
    overall_risk: m.overall_risk,
    employment_rate: m.employment_rate,
    market_demand_score: m.market_demand_score,
    ai_exposure_band: m.ai_exposure_band,
    payback_years: m.payback_years,
  }))

  const assessmentId = randomUUID()
  const baseRow = {
    id: assessmentId,
    country_pref: answers.country_pref,
    major_pref: answers.major_pref,
    budget: answers.budget,
    primary_goal: answers.primary_goal,
    background: answers.background,
    english_level: answers.english_level,
    result_snapshot: { view, majors: snapshot },
  }

  // Stamp the account link when signed in. If the user_id column isn't present
  // yet (migration not applied), retry without it so the public funnel never
  // breaks — the linkage simply activates once the migration lands.
  let { error } = await supabase.from("assessments").insert({ ...baseRow, user_id: userId })
  if (error && (error.code === "42703" || /user_id/i.test(error.message))) {
    ;({ error } = await supabase.from("assessments").insert(baseRow))
  }

  if (error) {
    // The result is computed from majors, not from the assessment row —
    // still show it even if persisting the assessment failed.
    return { ok: true, assessmentId: null, view }
  }
  return { ok: true, assessmentId, view }
}

export interface LeadResult {
  ok: boolean
  error?: string
}

// Anon cannot UPDATE assessments, so the link lives on the leads row
// (leads.assessment_id), not assessments.lead_id.
export async function saveLead(input: {
  email: string
  consentMarketing: boolean
  assessmentId: string | null
}): Promise<LeadResult> {
  const email = input.email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("leads").insert({
    email,
    consent_marketing: input.consentMarketing,
    assessment_id: input.assessmentId,
  })

  if (error) {
    return { ok: false, error: "Something went wrong — please try again." }
  }
  return { ok: true }
}

// ── Visa-policy alert subscriptions (Phase E) ───────────────────────────────

export interface SubscribeInput {
  email: string
  country: string | null
  field: string | null
  locale: string
  sourcePath: string
  consent: boolean
  decisionContext?: Record<string, string>
}

// Machine-readable result; the client maps codes to localized copy.
export interface SubscribeResult {
  ok: boolean
  duplicate?: boolean
  error?: "invalid_email" | "consent_required" | "generic"
}

export async function subscribeVisaAlerts(input: SubscribeInput): Promise<SubscribeResult> {
  const email = input.email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "invalid_email" }
  }
  // Explicit consent is required to store the subscription (GDPR).
  if (!input.consent) {
    return { ok: false, error: "consent_required" }
  }

  const supabase = await createClient()
  const acquisition = await getServerAcquisitionContext()
  const baseRow = {
    email,
    country: input.country,
    field: input.field,
    locale: input.locale,
    source_path: input.sourcePath.slice(0, 500),
    consent_at: new Date().toISOString(),
    // confirmed defaults to false; unsubscribe_token is generated by the DB.
  }
  const attribution = {
    acquisition_session_id: acquisition.sessionId,
    first_path: acquisition.firstPath,
    utm: acquisition.utm,
    decision_context: sanitizeDecisionContext(input.decisionContext),
  }

  // Keep the public lead flow working while production catches up with the
  // attribution migration. The fallback loses attribution, not the lead.
  let { error } = await supabase.from("subscriptions").insert({ ...baseRow, ...attribution })
  if (error && (error.code === "42703" || /acquisition_session_id|first_path|decision_context|utm/i.test(error.message))) {
    ;({ error } = await supabase.from("subscriptions").insert(baseRow))
  }

  const isDuplicate = error?.code === "23505" // unique_violation on (email, country, field)
  if (error && !isDuplicate) {
    return { ok: false, error: "generic" }
  }

  // Read the row back with the service role (anon has no SELECT) to get its
  // unsubscribe_token and confirmed state. A confirmed duplicate is a no-op
  // (no mail); a new or still-unconfirmed row gets a (re)sent confirmation.
  const row = await readbackSubscription(email, input.country, input.field)

  if (isDuplicate && row?.confirmed) {
    return { ok: false, duplicate: true }
  }

  // Double opt-in: send the confirmation. Mail failure must NOT fail the
  // subscription — the row is stored; the confirm link can be re-sent.
  if (row) {
    const locale: Locale = isLocale(row.locale)
      ? row.locale
      : isLocale(input.locale)
        ? input.locale
        : "en"
    try {
      const { subject, html } = confirmEmail({
        locale,
        country: row.country,
        field: row.field,
        confirmUrl: confirmUrl(row.unsubscribe_token),
        unsubscribeUrl: unsubscribeUrl(row.unsubscribe_token),
      })
      await sendEmail({ to: email, subject, html })
    } catch (e) {
      console.error("[visa-alert] confirmation email send failed (subscription kept):", e)
    }
  } else {
    console.error("[visa-alert] could not read back subscription to send confirmation:", email)
  }

  return { ok: true }
}

interface SubscriptionRow {
  unsubscribe_token: string
  confirmed: boolean
  locale: string | null
  country: string | null
  field: string | null
}

// Latest matching subscription for (email, country, field). country/field can
// be null, so use `.is` for those; order newest-first and take one.
async function readbackSubscription(
  email: string,
  country: string | null,
  field: string | null
): Promise<SubscriptionRow | null> {
  let q = supabaseAdmin
    .from("subscriptions")
    .select("unsubscribe_token, confirmed, locale, country, field")
    .eq("email", email)
  q = country === null ? q.is("country", null) : q.eq("country", country)
  q = field === null ? q.is("field", null) : q.eq("field", field)
  const { data, error } = await q.order("created_at", { ascending: false }).limit(1)
  if (error) {
    console.error("[visa-alert] subscription readback failed:", error.message)
    return null
  }
  return (data?.[0] as SubscriptionRow | undefined) ?? null
}
