import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { STATE_CODES, type StateCode } from "@/app/map/states"
import {
  getPathway,
  TAFE_BY_STATE,
  VET_PORTALS,
  cricosSearchUrl,
  type Pathway,
} from "@/lib/au-pathway"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 })
  }

  const rawState = req.nextUrl.searchParams.get("state")?.toUpperCase() ?? ""
  const state = (STATE_CODES as string[]).includes(rawState) ? (rawState as StateCode) : null

  const pathway: Pathway = getPathway(code)

  const { data: occ, error: occErr } = await supabase
    .from("occupations_au")
    .select("related_broad_field")
    .eq("anzsco_code", code)
    .maybeSingle()

  if (occErr) {
    return NextResponse.json({ error: occErr.message }, { status: 500 })
  }

  const prRes = await supabase
    .from("country_pr_pathways")
    .select("*")
    .ilike("country", "au")
    .maybeSingle()

  // ── VET / 자격증 경로: 코스 데이터가 없으므로 주 TAFE + 국가 포털 링크를 돌려준다.
  if (pathway === "vet") {
    return NextResponse.json({
      pathway,
      courses: [],
      prPathway: prRes.data ?? null,
      tafe: state ? TAFE_BY_STATE[state] : null,
      vetPortals: VET_PORTALS,
      cricosSearch: cricosSearchUrl(),
    })
  }

  // ── 학위 경로: 그 주의 등록 대학 코스 + CRICOS 링크.
  const base = {
    pathway,
    prPathway: prRes.data ?? null,
    tafe: null,
    vetPortals: [] as typeof VET_PORTALS,
    cricosSearch: cricosSearchUrl(),
  }

  if (!occ?.related_broad_field) {
    return NextResponse.json({ ...base, courses: [] })
  }

  // 주가 지정되면 그 주 대학(institution_id)으로 코스를 한정한다.
  let stateInstitutionIds: string[] | null = null
  if (state) {
    const { data: stateColleges } = await supabase
      .from("colleges_au")
      .select("institution_id")
      .eq("state", state)
    stateInstitutionIds = ((stateColleges as { institution_id: string }[] | null) ?? []).map(
      (c) => c.institution_id,
    )
    // 그 주에 등록 대학이 아예 없으면 코스도 없음 → 폴백(CRICOS 검색)만.
    if (stateInstitutionIds.length === 0) {
      return NextResponse.json({ ...base, courses: [] })
    }
  }

  let q = supabase
    .from("courses_au")
    .select(
      "id, title, institution_id, course_type, aqf_level, duration_years, tuition_fee_aud, cricos_url",
    )
    .eq("broad_field", occ.related_broad_field)
  if (stateInstitutionIds) {
    q = q.in("institution_id", stateInstitutionIds)
  }
  const { data: coursesData, error: coursesErr } = await q.order("id").limit(6)

  if (coursesErr) {
    return NextResponse.json({ error: coursesErr.message }, { status: 500 })
  }

  const institutionIds = Array.from(
    new Set((coursesData ?? []).map((c) => c.institution_id).filter(Boolean)),
  ) as string[]

  interface CollegeRow {
    institution_id: string
    name: string
    state: string | null
    website_url: string | null
  }
  const collegeMap: Record<
    string,
    { name: string; state: string | null; website_url: string | null }
  > = {}
  if (institutionIds.length > 0) {
    const { data: cols } = await supabase
      .from("colleges_au")
      .select("institution_id, name, state, website_url")
      .in("institution_id", institutionIds)
    for (const c of (cols as CollegeRow[] | null) ?? []) {
      collegeMap[c.institution_id] = { name: c.name, state: c.state, website_url: c.website_url }
    }
  }

  const courses = (coursesData ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    institution_id: c.institution_id,
    institution_name: collegeMap[c.institution_id]?.name ?? null,
    state: collegeMap[c.institution_id]?.state ?? null,
    website_url: collegeMap[c.institution_id]?.website_url ?? null,
    course_type: c.course_type,
    aqf_level: c.aqf_level,
    duration_years: c.duration_years,
    tuition_fee_aud: c.tuition_fee_aud,
    cricos_url: (c as { cricos_url?: string | null }).cricos_url ?? null,
  }))

  return NextResponse.json({ ...base, courses })
}
