import "server-only"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, category, description, emailConsent, screenshot } = body

    if (!type || !["issue", "suggestion"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("feedback").insert({
      type,
      category: category || null,
      description: description.trim(),
      email_consent: !!emailConsent,
      screenshot_url: screenshot || null,
    })

    if (error) {
      console.error("[feedback] insert error:", error)
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[feedback] unexpected error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
