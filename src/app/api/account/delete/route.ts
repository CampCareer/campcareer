import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin")
  const expectedOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== expectedOrigin) {
    return NextResponse.json({ ok: false, code: "invalid_origin" }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (body?.confirmation !== "DELETE") {
    return NextResponse.json({ ok: false, code: "confirmation_required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ ok: false, code: "authentication_required" }, { status: 401 })
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    console.error("[account/delete] Supabase account deletion failed", { userId: user.id, message: deleteError.message })
    return NextResponse.json({ ok: false, code: "delete_failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
}
