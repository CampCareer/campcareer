import "server-only"

import { NextResponse } from "next/server"
import { FEEDBACK_SCREENSHOT_BUCKET } from "@/lib/feedback-contract"
import {
  feedbackScreenshotReference,
  isAuthorizedFeedbackRetentionRequest,
  type FeedbackRetentionRow,
} from "@/lib/feedback-retention"
import { getFeedbackAdminClient } from "@/lib/feedback-server"

export const dynamic = "force-dynamic"

const BATCH_SIZE = 100
const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS })
}

function isMissingRetentionSchema(error: { code?: string; message?: string } | null) {
  return error?.code === "42703" || error?.code === "42P01" || /expires_at|report_launch_interests|schema cache/i.test(error?.message ?? "")
}

async function deleteExpiredReportLaunchInterests(supabase: ReturnType<typeof getFeedbackAdminClient>) {
  if (!supabase) return { deleted: 0, hasMore: false, unavailable: true }
  const { data, error } = await supabase
    .from("report_launch_interests")
    .select("id")
    .lte("retention_expires_at", new Date().toISOString())
    .order("retention_expires_at", { ascending: true })
    .limit(BATCH_SIZE)
  if (error) {
    if (isMissingRetentionSchema(error)) return { deleted: 0, hasMore: false, unavailable: true }
    throw error
  }
  const ids = (data ?? []).map((row) => row.id)
  if (ids.length === 0) return { deleted: 0, hasMore: false, unavailable: false }
  const { error: deleteError } = await supabase.from("report_launch_interests").delete().in("id", ids)
  if (deleteError) throw deleteError
  return { deleted: ids.length, hasMore: ids.length === BATCH_SIZE, unavailable: false }
}

/**
 * Production-only cleanup for the 180-day feedback retention policy. It is
 * deliberately a GET handler because Vercel Cron invokes configured routes
 * with GET and automatically sends `Bearer $CRON_SECRET` when configured.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return json({ ok: false, code: "CRON_NOT_CONFIGURED" }, 503)
  if (!isAuthorizedFeedbackRetentionRequest(request.headers.get("authorization"), cronSecret)) {
    return json({ ok: false, code: "UNAUTHORIZED" }, 401)
  }

  const supabase = getFeedbackAdminClient()
  if (!supabase) return json({ ok: false, code: "FEEDBACK_UNAVAILABLE" }, 503)

  const { data, error } = await supabase
    .from("feedback")
    .select("id, screenshot_bucket, screenshot_path, metadata")
    .lte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: true })
    .limit(BATCH_SIZE)

  if (error) {
    if (isMissingRetentionSchema(error)) return json({ ok: false, code: "RETENTION_SCHEMA_UNAVAILABLE" }, 503)
    console.error("[feedback-retention] unable to load expired feedback:", error.message)
    return json({ ok: false, code: "RETENTION_LOAD_FAILED" }, 500)
  }

  const rows = (data ?? []) as FeedbackRetentionRow[]
  const deletableIds: Array<string | number> = []
  let retainedForScreenshotRetry = 0

  for (const row of rows) {
    const screenshot = feedbackScreenshotReference(row)
    if (screenshot) {
      const { error: storageError } = await supabase.storage
        .from(FEEDBACK_SCREENSHOT_BUCKET)
        .remove([screenshot.path])
      if (storageError) {
        retainedForScreenshotRetry += 1
        console.warn("[feedback-retention] screenshot removal deferred:", storageError.message)
        continue
      }
    }
    deletableIds.push(row.id)
  }

  if (deletableIds.length > 0) {
    const { error: deleteError } = await supabase.from("feedback").delete().in("id", deletableIds)
    if (deleteError) {
      console.error("[feedback-retention] feedback deletion failed:", deleteError.message)
      return json({ ok: false, code: "RETENTION_DELETE_FAILED" }, 500)
    }
  }

  let reportLaunchInterests = { deleted: 0, hasMore: false, unavailable: false }
  try {
    reportLaunchInterests = await deleteExpiredReportLaunchInterests(supabase)
  } catch (error) {
    console.error("[feedback-retention] report launch-interest deletion failed:", error)
    return json({ ok: false, code: "REPORT_LAUNCH_RETENTION_DELETE_FAILED" }, 500)
  }

  return json({
    ok: true,
    processed: rows.length,
    deleted: deletableIds.length,
    retainedForScreenshotRetry,
    hasMore: rows.length === BATCH_SIZE,
    reportLaunchInterests,
  })
}
