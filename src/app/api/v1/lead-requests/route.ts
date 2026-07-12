import { NextRequest, NextResponse } from "next/server"
import { getStudyConcept } from "@/data/study-concepts"
import { createClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const HELP_OPTIONS = new Set(["COURSE_SELECTION", "APPLICATION", "ADMISSIONS", "VISA_INFORMATION"])

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: "Authentication is required" }, { status: 401 })

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const input = parseInput(payload)
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 422 })

  const { data, error } = await supabaseAdmin
    .from("lead_requests")
    .insert({
      user_id: user.id,
      concept_id: input.value.conceptId,
      destination_country: input.value.destinationCountry,
      intended_intake: input.value.intendedIntake,
      first_year_budget: input.value.budget,
      budget_currency: input.value.budget ? "USD" : null,
      help_needed: input.value.helpNeeded,
      contact_name: input.value.contactName,
      contact_email: user.email,
      consented_at: new Date().toISOString(),
      consent_version: "lead-consent-v1",
    })
    .select("id")
    .single()

  if (error || !data) {
    console.error("[lead-requests] insert failed", error?.message ?? "unknown")
    return NextResponse.json({ error: "Unable to submit your request" }, { status: 500 })
  }

  const { error: eventError } = await supabaseAdmin.from("lead_status_events").insert({
    lead_request_id: data.id,
    actor_user_id: user.id,
    next_status: "SUBMITTED",
    note: "User submitted a consented application-support request.",
  })
  if (eventError) console.error("[lead-requests] audit insert failed", eventError.message)

  return NextResponse.json({ id: data.id, status: "SUBMITTED" }, { status: 201, headers: { "Cache-Control": "no-store" } })
}

function parseInput(value: unknown):
  | { ok: true; value: { conceptId: string; destinationCountry: string; intendedIntake?: string; budget?: number; helpNeeded: string[]; contactName: string } }
  | { ok: false; error: string } {
  if (!value || typeof value !== "object") return { ok: false, error: "Body must be an object" }
  const body = value as Record<string, unknown>
  const conceptId = typeof body.conceptId === "string" ? body.conceptId : ""
  const destinationCountry = typeof body.destinationCountry === "string" ? body.destinationCountry.toUpperCase() : ""
  const contactName = typeof body.contactName === "string" ? body.contactName.trim().slice(0, 120) : ""
  const intendedIntake = typeof body.intendedIntake === "string" ? body.intendedIntake.trim().slice(0, 80) : undefined
  const budget = typeof body.budget === "number" && Number.isFinite(body.budget) && body.budget > 0 ? Math.round(body.budget) : undefined
  const helpNeeded = Array.isArray(body.helpNeeded)
    ? [...new Set(body.helpNeeded.filter((item): item is string => typeof item === "string" && HELP_OPTIONS.has(item)))].slice(0, 4)
    : []

  if (!getStudyConcept(conceptId)) return { ok: false, error: "Unknown study option" }
  if (!/^[A-Z]{2}$/.test(destinationCountry)) return { ok: false, error: "Invalid destination country" }
  if (!contactName) return { ok: false, error: "Your name is required" }
  if (helpNeeded.length === 0) return { ok: false, error: "Choose at least one type of help" }
  if (body.consent !== true) return { ok: false, error: "Consent is required before we can share this request" }

  return { ok: true, value: { conceptId, destinationCountry, intendedIntake, budget, helpNeeded, contactName } }
}
