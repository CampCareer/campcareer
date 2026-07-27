import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"

const USERNAME_REGEX = /^[a-z][a-z0-9_]*$/
const RESERVED = new Set([
  "admin", "api", "auth", "campcareer", "help", "login", "logout",
  "maps", "profile", "settings", "signup", "test", "www",
])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get("username")?.trim().toLowerCase() ?? ""

  if (!raw) {
    return NextResponse.json({ error: "Username is required." }, { status: 400 })
  }

  if (raw.length < 3 || raw.length > 30) {
    return NextResponse.json({ available: false, reason: "Username must be 3-30 characters." })
  }

  if (!USERNAME_REGEX.test(raw)) {
    return NextResponse.json({ available: false, reason: "Only lowercase letters, numbers and underscores. Must start with a letter." })
  }

  if (RESERVED.has(raw)) {
    return NextResponse.json({ available: false, reason: "This username is reserved." })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("user_preferences")
    .select("id")
    .eq("username", raw)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: "Could not check username." }, { status: 500 })
  }

  // Available if no row found, or the row belongs to the current user
  const available = !data || (user && data.id === user.id)

  return NextResponse.json({ available, reason: available ? null : "This username is already taken." })
}
