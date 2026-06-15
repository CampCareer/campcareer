import { timingSafeEqual } from "crypto"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { sendBatch, type EmailMessage } from "@/lib/email/send"
import { policyAlertEmail } from "@/lib/email/templates"
import { siteUrl, unsubscribeUrl } from "@/lib/email/links"

// Protected policy-change broadcast worker. NEVER leave this open — the bearer
// secret is the only thing between this and spamming the whole list. dryRun
// defaults to true so an accidental call only previews recipients.

const BATCH_SIZE = 100 // Resend batch endpoint cap
const BATCH_DELAY_MS = 600 // gentle pacing between batches for rate limits

interface BroadcastBody {
  country?: unknown
  broadcast_key?: unknown
  subject_en?: unknown
  subject_ko?: unknown
  body_en?: unknown
  body_ko?: unknown
  dryRun?: unknown
}

interface Target {
  id: string
  email: string
  locale: string | null
  unsubscribe_token: string
  country: string | null
}

function bearerOk(req: Request): boolean {
  const secret = process.env.ADMIN_BROADCAST_SECRET
  if (!secret) return false // misconfigured → deny
  const header = req.headers.get("authorization") ?? ""
  const m = header.match(/^Bearer\s+(.+)$/i)
  if (!m) return false
  const provided = Buffer.from(m[1])
  const expected = Buffer.from(secret)
  if (provided.length !== expected.length) return false
  return timingSafeEqual(provided, expected)
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function POST(req: Request): Promise<Response> {
  // ── Auth ────────────────────────────────────────────────────────────────
  if (!bearerOk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  // ── Validate input ──────────────────────────────────────────────────────
  let payload: BroadcastBody
  try {
    payload = (await req.json()) as BroadcastBody
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const required = ["country", "broadcast_key", "subject_en", "subject_ko", "body_en", "body_ko"] as const
  const missing = required.filter((k) => !isNonEmptyString(payload[k]))
  if (missing.length > 0) {
    return NextResponse.json({ error: "missing_fields", fields: missing }, { status: 400 })
  }

  const country = (payload.country as string).trim()
  const broadcastKey = (payload.broadcast_key as string).trim()
  const subjects: Record<Locale, string> = {
    en: (payload.subject_en as string).trim(),
    ko: (payload.subject_ko as string).trim(),
  }
  const bodies: Record<Locale, string> = {
    en: payload.body_en as string,
    ko: payload.body_ko as string,
  }
  // Safety: only an explicit `false` sends. Anything else (incl. undefined) previews.
  const dryRun = payload.dryRun !== false

  // ── Resolve active targets for this country ──────────────────────────────
  const { data: subs, error: subErr } = await supabaseAdmin
    .from("subscriptions")
    .select("id, email, locale, unsubscribe_token, country")
    .eq("confirmed", true)
    .is("unsubscribed_at", null)
    .eq("country", country)

  if (subErr) {
    console.error("[broadcast] target query failed:", subErr.message)
    return NextResponse.json({ error: "target_query_failed" }, { status: 500 })
  }

  // Exclude anyone who already got this exact broadcast (idempotency).
  const { data: sentRows, error: sentErr } = await supabaseAdmin
    .from("notifications_sent")
    .select("subscription_id")
    .eq("broadcast_key", broadcastKey)
  if (sentErr) {
    console.error("[broadcast] notifications_sent query failed:", sentErr.message)
    return NextResponse.json({ error: "sent_query_failed" }, { status: 500 })
  }
  const alreadySent = new Set((sentRows ?? []).map((r) => r.subscription_id as string))

  const allTargets = (subs ?? []) as Target[]
  const eligible = allTargets.filter((t) => !alreadySent.has(t.id))
  const skipped = allTargets.length - eligible.length

  // ── Dry run: preview only, send nothing ──────────────────────────────────
  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      country,
      broadcast_key: broadcastKey,
      targetCount: eligible.length,
      skipped,
      emails: eligible.map((t) => t.email),
    })
  }

  // ── Real send: batch ≤100, record only successes ─────────────────────────
  let sent = 0
  let failed = 0

  for (let i = 0; i < eligible.length; i += BATCH_SIZE) {
    const chunk = eligible.slice(i, i + BATCH_SIZE)
    const messages: EmailMessage[] = chunk.map((t) => {
      const locale: Locale = isLocale(t.locale) ? t.locale : "en"
      const { subject, html } = policyAlertEmail({
        locale,
        country: t.country,
        subject: subjects[locale],
        body: bodies[locale],
        siteUrl: siteUrl(),
        unsubscribeUrl: unsubscribeUrl(t.unsubscribe_token),
      })
      return { to: t.email, subject, html }
    })

    try {
      await sendBatch(messages)
      // Record this chunk as sent (idempotent on the unique constraint).
      const rows = chunk.map((t) => ({ subscription_id: t.id, broadcast_key: broadcastKey }))
      const { error: insErr } = await supabaseAdmin
        .from("notifications_sent")
        .upsert(rows, { onConflict: "subscription_id,broadcast_key", ignoreDuplicates: true })
      if (insErr) {
        // Mail went out but bookkeeping failed — log loudly; a re-run could double-send this chunk.
        console.error("[broadcast] notifications_sent insert failed after send:", insErr.message)
      }
      sent += chunk.length
    } catch (e) {
      failed += chunk.length
      console.error(`[broadcast] batch send failed (${chunk.length} recipients):`, e)
    }

    if (i + BATCH_SIZE < eligible.length) await sleep(BATCH_DELAY_MS)
  }

  return NextResponse.json({
    dryRun: false,
    country,
    broadcast_key: broadcastKey,
    targetCount: eligible.length,
    sent,
    failed,
    skipped,
  })
}
