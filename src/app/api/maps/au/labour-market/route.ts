import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const STATES = new Set(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"])

export const dynamic = "force-dynamic"

/**
 * A deliberately small, occupation-scoped Maps endpoint. The full NERO
 * dataset has more than 31k SA4 records, while this returns only the selected
 * occupation's rows for one state plus its monthly JSA IVI series.
 */
export async function GET(request: NextRequest) {
  const occupationCode = (request.nextUrl.searchParams.get("occupation") ?? "").trim()
  const state = (request.nextUrl.searchParams.get("state") ?? "").trim().toUpperCase()
  if (!/^\d{6}$/.test(occupationCode) || !STATES.has(state)) {
    return NextResponse.json({ error: "A six-digit OSCA occupation and Australian state are required." }, { status: 400 })
  }

  const { data: occupation, error: occupationError } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, anzsco_v13, occupation_en")
    .eq("anzsco_code", occupationCode)
    .maybeSingle()
  if (occupationError) return NextResponse.json({ error: occupationError.message }, { status: 500 })
  if (!occupation?.anzsco_v13) return NextResponse.json({ error: "No ANZSCO mapping for this occupation." }, { status: 404 })

  const unitGroup = occupation.anzsco_v13.slice(0, 4)
  const [regionalResult, vacancyResult] = await Promise.all([
    supabaseAdmin
      .from("occupation_regional_employment_au")
      .select("state, sa4_code, sa4_name, employment_total, annual_change, annual_change_pct, five_year_change, five_year_change_pct, period")
      .eq("anzsco_unit_group", unitGroup)
      .eq("state", state)
      .eq("period", "2026-06-15")
      .order("employment_total", { ascending: false }),
    supabaseAdmin
      .from("occupation_vacancies_au")
      .select("state, period, vacancy_count")
      .eq("anzsco_unit_group", unitGroup)
      .eq("state", state)
      .eq("series", "three_month_average")
      .order("period", { ascending: true }),
  ])
  if (regionalResult.error) return NextResponse.json({ error: regionalResult.error.message }, { status: 500 })
  if (vacancyResult.error) return NextResponse.json({ error: vacancyResult.error.message }, { status: 500 })

  return NextResponse.json({
    occupation: { code: occupation.anzsco_code, name: occupation.occupation_en, anzscoUnitGroup: unitGroup },
    regional: regionalResult.data ?? [],
    vacancies: vacancyResult.data ?? [],
    sources: {
      regional: "JSA NERO · June 2026",
      vacancies: "JSA Internet Vacancy Index · three-month average · May 2026 latest",
    },
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
