import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 직종 검색 — occupations_au(anon 읽기 허용) 에서 영문/한글명 ilike 매칭.
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim()
  if (!q) return NextResponse.json({ occupations: [] })

  // ilike 안전 처리: %, 쉼표 제거
  const safe = q.replace(/[%,]/g, " ").trim()

  const { data, error } = await supabase
    .from("occupations_au")
    .select("anzsco_code, occupation_en, occupation_ko, median_salary_aud, on_csol, shortage_rating")
    .not("anzsco_code", "is", null)
    .or(`occupation_en.ilike.%${safe}%,occupation_ko.ilike.%${safe}%`)
    .order("shortage_rating", { ascending: false, nullsFirst: false })
    .order("median_salary_aud", { ascending: false, nullsFirst: false })
    .limit(12)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ occupations: data ?? [] })
}
