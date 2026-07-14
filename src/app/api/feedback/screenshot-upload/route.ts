import "server-only"

import { NextResponse } from "next/server"
import {
  createFeedbackScreenshotPath,
  FEEDBACK_SCREENSHOT_BUCKET,
  FEEDBACK_SCREENSHOT_MAX_BYTES,
  parseScreenshotUploadRequest,
} from "@/lib/feedback-contract"
import { getFeedbackAdminClient, readJsonBody } from "@/lib/feedback-server"

const UPLOAD_REQUEST_MAX_BYTES = 2_048
const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS })
}

export async function POST(request: Request) {
  try {
    const jsonBody = await readJsonBody(request, UPLOAD_REQUEST_MAX_BYTES)
    if (!jsonBody.ok) return json({ ok: false, code: jsonBody.code, error: jsonBody.error }, jsonBody.status)

    const parsed = parseScreenshotUploadRequest(jsonBody.data)
    if (!parsed.ok) return json({ ok: false, code: parsed.code, error: parsed.error }, 400)

    const supabase = getFeedbackAdminClient()
    if (!supabase) {
      return json(
        {
          ok: false,
          code: "SCREENSHOT_UPLOAD_UNAVAILABLE",
          error: "Screenshot upload is temporarily unavailable.",
        },
        503,
      )
    }

    const path = createFeedbackScreenshotPath(
      parsed.data.contentType,
      crypto.randomUUID(),
    )
    const { data, error } = await supabase.storage
      .from(FEEDBACK_SCREENSHOT_BUCKET)
      .createSignedUploadUrl(path, { upsert: false })

    if (error || !data?.token) {
      console.warn("[feedback] screenshot upload request failed:", error?.message ?? "No upload token")
      return json(
        {
          ok: false,
          code: "SCREENSHOT_UPLOAD_UNAVAILABLE",
          error: "Screenshot upload is temporarily unavailable.",
        },
        503,
      )
    }

    return json({
      ok: true,
      upload: {
        bucket: FEEDBACK_SCREENSHOT_BUCKET,
        path,
        token: data.token,
        expiresInSeconds: 7_200,
        maxBytes: FEEDBACK_SCREENSHOT_MAX_BYTES,
      },
    })
  } catch (error) {
    console.error("[feedback] screenshot upload request error:", error)
    return json(
      {
        ok: false,
        code: "SCREENSHOT_UPLOAD_UNAVAILABLE",
        error: "Screenshot upload is temporarily unavailable.",
      },
      503,
    )
  }
}
