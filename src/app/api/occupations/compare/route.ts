import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { STATE_CODES } from "@/app/map/states"

// 직종 비교 — 주어진 코드들의 occupations_au + 주별 부족도(occupation_state_au, RLS 막혀 admin 사용).
export async function GET(req: NextRequest) {
  const codesParam = (req.nextUrl.searchParams.get("codes") ?? "").trim()
  const codes = codesParam
    .split(",")
    .map((c) => c.trim())
    .filter((c) => /^\d{6}$/.test(c))
    .slice(0, 4)
  if (codes.length === 0) return NextResponse.json({ occupations: [] })

  const [occRes, stateRes] = await Promise.all([
    supabaseAdmin
      .from("occupations_au")
      .select("anzsco_code, occupation_en, occupation_ko, median_salary_aud, on_csol, shortage_rating, confidence")
      .in("anzsco_code", codes),
    supabaseAdmin.from("occupation_state_au").select("anzsco_code, state, shortage_rating").in("anzsco_code", codes),
  ])

  if (occRes.error) return NextResponse.json({ error: occRes.error.message }, { status: 500 })

  const statesByCode: Record<string, Record<string, number>> = {}
  for (const r of stateRes.data ?? []) {
    const c = r.anzsco_code as string
    statesByCode[c] = statesByCode[c] ?? {}
    if (STATE_CODES.includes(r.state as never)) statesByCode[c][r.state as string] = r.shortage_rating as number
  }

  // 입력 순서 유지
  const byCode = new Map((occRes.data ?? []).map((o) => [o.anzsco_code as string, o]))
  const occupations = codes
    .map((c) => byCode.get(c))
    .filter(Boolean)
    .map((o) => ({ ...o, states: statesByCode[o!.anzsco_code as string] ?? {} }))

  return NextResponse.json({ occupations })
}
