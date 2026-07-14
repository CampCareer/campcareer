import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let feedbackAdminClient: SupabaseClient | null = null

export type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; status: number; code: string; error: string }

export function getFeedbackAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return null
  if (feedbackAdminClient) return feedbackAdminClient

  try {
    feedbackAdminClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    return feedbackAdminClient
  } catch (error) {
    console.error("[feedback] Supabase configuration error:", error)
    return null
  }
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, status: 413, code: "REQUEST_TOO_LARGE", error: "Request is too large" }
  }

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    return { ok: false, status: 413, code: "REQUEST_TOO_LARGE", error: "Request is too large" }
  }

  try {
    return { ok: true, data: JSON.parse(rawBody) }
  } catch {
    return { ok: false, status: 400, code: "INVALID_JSON", error: "Invalid JSON body" }
  }
}
