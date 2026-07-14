import {
  FEEDBACK_SCREENSHOT_BUCKET,
  isFeedbackScreenshotPath,
  type FeedbackScreenshotReference,
} from "@/lib/feedback-contract"

type UnknownRecord = Record<string, unknown>

export type FeedbackRetentionRow = {
  id: string | number
  screenshot_bucket?: unknown
  screenshot_path?: unknown
  metadata?: unknown
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asPrivateScreenshot(value: unknown): FeedbackScreenshotReference | null {
  if (!isRecord(value)) return null
  if (value.bucket !== FEEDBACK_SCREENSHOT_BUCKET || !isFeedbackScreenshotPath(value.path)) return null
  return { bucket: FEEDBACK_SCREENSHOT_BUCKET, path: value.path }
}

/**
 * Supports both the dedicated screenshot columns introduced in the private
 * storage migration and the short-lived metadata fallback used while an older
 * production schema is awaiting that migration.
 */
export function feedbackScreenshotReference(row: FeedbackRetentionRow): FeedbackScreenshotReference | null {
  const fromColumns = asPrivateScreenshot({
    bucket: row.screenshot_bucket,
    path: row.screenshot_path,
  })
  if (fromColumns) return fromColumns

  return isRecord(row.metadata) ? asPrivateScreenshot(row.metadata.screenshot) : null
}

export function isAuthorizedFeedbackRetentionRequest(
  authorization: string | null,
  cronSecret: string | undefined,
) {
  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`)
}
