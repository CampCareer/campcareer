import "server-only"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getCoursesForOccupation, type CourseAU, type OccupationAU } from "@/lib/occupations-au"
import type { OccupationPageData, ShortageLevel } from "@/app/roi-explorer/au/occupation/[code]/OccupationDetailPage"
import { STATE_NAMES, type StateCode } from "@/app/map/states"

const LEVEL = (r: number | null): ShortageLevel =>
  r == null ? "Low" : r >= 5 ? "Strong" : r >= 4 ? "High" : r >= 3 ? "Medium" : "Low"

// occupation_state_au 의 shortage_rating: 3=Shortage, 2=Regional/Metro shortage
const STATE_LEVEL = (r: number): ShortageLevel => (r >= 3 ? "Strong" : r >= 2 ? "Medium" : "Low")

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

const FULL_NAME_TO_CODE: Record<string, StateCode> = {
  "new south wales": "NSW",
  victoria: "VIC",
  queensland: "QLD",
  "south australia": "SA",
  "western australia": "WA",
  tasmania: "TAS",
  "northern territory": "NT",
  "australian capital territory": "ACT",
}

function normalizeState(raw: string | null): StateCode | null {
  if (!raw) return null
  const up = raw.trim().toUpperCase() as StateCode
  if (STATE_NAMES[up]) return up
  return FULL_NAME_TO_CODE[raw.trim().toLowerCase()] ?? null
}

export async function getOccupationPageData(code: string): Promise<OccupationPageData | null> {
  const { data: occ } = await supabase
    .from("occupations_au").select("*").eq("anzsco_code", code).maybeSingle()
  if (!occ) return null
  const o = occ as OccupationAU

  const [courses, prRes, stateRes] = await Promise.all([
    o.related_broad_field ? getCoursesForOccupation(o.related_broad_field, 12) : Promise.resolve([] as CourseAU[]),
    supabase.from("country_pr_pathways").select("*").ilike("country", "au").maybeSingle(),
    supabaseAdmin
      .from("occupation_state_au")
      .select("state, shortage_rating")
      .eq("anzsco_code", code),
  ])
  const pr = prRes.data as { route_ko?: string; route_en?: string; caveat_ko?: string } | null
  const salary = o.median_salary_aud
  const estimate = o.confidence !== "verified"

  const byRegion = (stateRes.data ?? [])
    .map((r) => {
      const sc = normalizeState(r.state)
      return {
        region: sc ? (STATE_NAMES[sc] ?? r.state) : (r.state ?? ""),
        level: STATE_LEVEL(r.shortage_rating),
        score: r.shortage_rating >= 3 ? 90 : 55,
      }
    })
    .filter((r) => r.region)

  return {
    countryCode: "AU",
    occupationName: o.occupation_en,
    occupationSlug: slug(o.occupation_en),
    anzscoCode: o.anzsco_code ?? code,
    updatedAtISO: o.last_verified ?? new Date().toISOString().slice(0, 10),
    sources: [o.source_name, o.source_url].filter(Boolean) as string[],
    shortage: {
      nationalLevel: LEVEL(o.shortage_rating),
      nationalScore: o.shortage_rating ? Math.round((o.shortage_rating / 5) * 100) : 0,
      byRegion,
    },
    snapshot: {
      medianSalaryText: salary ? `A$${salary.toLocaleString()}` : "—",
      salaryRangeText: "평균 풀타임 연봉(전 경력 기준, 초봉 아님)",
      jobAdsTrend90dText: "—",
      timeToHireText: "—",
      visaPathwaysText:
        `${o.on_csol ? "CSOL 등재 · 고용주 스폰서(482/186) 적격" : "CSOL 비등재 — 확인 필요"}` +
        (pr?.route_ko ? ` · 영주권: ${pr.route_ko}` : ""),
    },
    plainEnglish: {
      bullets: [
        salary ? `평균 풀타임 연봉 약 A$${salary.toLocaleString()} (초봉 아님).` : "",
        o.shortage_rating ? `부족도 ${o.shortage_rating}/5 — ${LEVEL(o.shortage_rating)} 수준의 인력 부족.` : "",
        o.related_broad_field ? `관련 분야에 ${courses.length}개 이상의 코스가 연결돼요.` : "",
        pr?.caveat_ko ?? "",
        estimate ? "일부 수치는 추정치 — 공식 출처로 검증 중." : "",
      ].filter(Boolean),
      officialUrl: o.source_url ?? undefined,
    },
    skills: [],
    // courses를 임시로 credentials 섹션에 노출(전용 '코스' 섹션은 다음에 추가)
    credentials: courses.slice(0, 6).map((c, i) => ({
      id: String(c.id ?? i),
      name: c.title,
      type: "Qualification" as const,
      notes: [
        c.duration_years ? `${c.duration_years}년` : null,
        c.tuition_fee_aud ? `A$${c.tuition_fee_aud.toLocaleString()}` : null,
        c.employment_rate ? `취업률 ${Math.round(c.employment_rate * 100)}%` : null,
      ].filter(Boolean).join(" · "),
    })),
    jobAds: [],
    outlook: {
      why: (o.shortage_rating ?? 0) >= 4
        ? "여러 주에서 지속적인 인력 부족이 보고된 직업이에요."
        : "노동시장 수요는 보통 수준이에요.",
      index: [],
    },
    b2bCta: {
      headline: "이 경로가 나에게 맞을까?",
      bullets: ["내 상황 기준 ROI 리포트", "코스·비용·기간 비교", "영주권 경로 안내"],
      primaryCta: "ROI 리포트 받기",
      secondaryCta: "코스 비교하기",
    },
  }
}
