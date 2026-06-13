"use server"

import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase-server"
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

  const supabase = createClient()

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
  const { error } = await supabase.from("assessments").insert({
    id: assessmentId,
    country_pref: answers.country_pref,
    major_pref: answers.major_pref,
    budget: answers.budget,
    primary_goal: answers.primary_goal,
    background: answers.background,
    english_level: answers.english_level,
    result_snapshot: { view, majors: snapshot },
  })

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

  const supabase = createClient()
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
