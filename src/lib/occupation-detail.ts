import "server-only"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { type CourseAU, type OccupationAU } from "@/lib/occupations-au"
import type { OccupationPageData, ShortageLevel } from "@/app/roi-explorer/au/occupation/[code]/OccupationDetailPage"
import { STATE_NAMES, type StateCode } from "@/app/map/states"

const LEVEL = (r: number | null): ShortageLevel =>
  r == null ? "Low" : r >= 5 ? "Strong" : r >= 4 ? "High" : r >= 3 ? "Medium" : "Low"

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

type CourseRow = Omit<CourseAU, "course_url" | "course_link_kind"> & {
  broad_field: string
  qualifax_url: string | null
}

type MetaRow = {
  occupation_en: string
  median_salary_aud: number | null
  shortage_rating: number | null
}

let _cache: {
  byCode: Map<string, OccupationPageData>
  meta: Map<string, MetaRow>
} | null = null

async function loadAll() {
  if (_cache) return _cache

  const [occRes, courseRes, prRes, stateRes] = await Promise.all([
    supabase.from("occupations_au").select("*"),
    supabase
      .from("courses_au")
      .select("id, title, course_type, aqf_level, duration_years, tuition_fee_aud, employment_rate, official_course_url, official_url_status, official_url_checked_at, cricos_url, qualifax_url, broad_field")
      .order("employment_rate", { ascending: false, nullsFirst: false }),
    supabase.from("country_pr_pathways").select("*").ilike("country", "au").maybeSingle(),
    supabaseAdmin.from("occupation_state_au").select("*"),
  ])

  const occRows = (occRes.data ?? []) as OccupationAU[]
  const courseRows = (courseRes.data ?? []) as CourseRow[]
  const pr = prRes.data as { route_ko?: string; route_en?: string; caveat_ko?: string } | null
  const stateRows = stateRes.data ?? []

  const coursesByField = new Map<string, CourseAU[]>()
  for (const c of courseRows) {
    if (!c.broad_field) continue
    const list = coursesByField.get(c.broad_field)
    if (list) list.push({
      id: c.id, title: c.title,
      course_type: c.course_type, aqf_level: c.aqf_level,
      duration_years: c.duration_years, tuition_fee_aud: c.tuition_fee_aud,
      employment_rate: c.employment_rate,
      official_course_url: c.official_course_url,
      official_url_status: c.official_url_status,
      official_url_checked_at: c.official_url_checked_at,
      cricos_url: c.cricos_url,
      course_url: c.official_url_status === "verified" && c.official_course_url ? c.official_course_url : c.cricos_url ?? c.qualifax_url ?? null,
      course_link_kind: c.official_url_status === "verified" && c.official_course_url ? "provider" : Boolean(c.cricos_url ?? c.qualifax_url) ? "registry" : "none",
    })
    else coursesByField.set(c.broad_field, [{
      id: c.id, title: c.title,
      course_type: c.course_type, aqf_level: c.aqf_level,
      duration_years: c.duration_years, tuition_fee_aud: c.tuition_fee_aud,
      employment_rate: c.employment_rate,
      official_course_url: c.official_course_url,
      official_url_status: c.official_url_status,
      official_url_checked_at: c.official_url_checked_at,
      cricos_url: c.cricos_url,
      course_url: c.official_url_status === "verified" && c.official_course_url ? c.official_course_url : c.cricos_url ?? c.qualifax_url ?? null,
      course_link_kind: c.official_url_status === "verified" && c.official_course_url ? "provider" : Boolean(c.cricos_url ?? c.qualifax_url) ? "registry" : "none",
    }])
  }

  // Provider programme pages are deliberately ranked ahead of registry-only
  // records. This cache powers the older occupation detail route as well.
  for (const courses of coursesByField.values()) {
    courses.sort((a, b) => {
      const aVerified = a.official_url_status === "verified" && a.official_course_url ? 1 : 0
      const bVerified = b.official_url_status === "verified" && b.official_course_url ? 1 : 0
      if (aVerified !== bVerified) return bVerified - aVerified
      return (b.employment_rate ?? -1) - (a.employment_rate ?? -1) || a.id - b.id
    })
  }

  const statesByCode = new Map<string, { state: string; shortage_rating: number }[]>()
  for (const s of stateRows) {
    const list = statesByCode.get(s.anzsco_code)
    if (list) list.push(s)
    else statesByCode.set(s.anzsco_code, [s])
  }

  const byCode = new Map<string, OccupationPageData>()
  const meta = new Map<string, MetaRow>()

  for (const o of occRows) {
    const code = o.anzsco_code
    if (!code) continue

    const field = o.related_broad_field
    const courses = field ? (coursesByField.get(field) ?? []) : []
    const stateData = statesByCode.get(code) ?? []

    const byRegion = stateData
      .map((r) => {
        const sc = normalizeState(r.state)
        return {
          region: sc ? (STATE_NAMES[sc] ?? r.state) : (r.state ?? ""),
          level: STATE_LEVEL(r.shortage_rating),
          score: r.shortage_rating >= 3 ? 90 : 55,
        }
      })
      .filter((r) => r.region)

    const salary = o.median_salary_aud
    const estimate = o.confidence !== "verified"

    byCode.set(code, {
      countryCode: "AU",
      occupationName: o.occupation_en,
      occupationSlug: slug(o.occupation_en),
      anzscoCode: code,
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
          field ? `관련 분야에 ${courses.length}개 이상의 코스가 연결돼요.` : "",
          pr?.caveat_ko ?? "",
          estimate ? "일부 수치는 추정치 — 공식 출처로 검증 중." : "",
        ].filter(Boolean),
        officialUrl: o.source_url ?? undefined,
      },
      skills: [],
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
    })

    meta.set(code, {
      occupation_en: o.occupation_en,
      median_salary_aud: o.median_salary_aud,
      shortage_rating: o.shortage_rating,
    })
  }

  _cache = { byCode, meta }
  return _cache
}

export async function getOccupationPageData(code: string): Promise<OccupationPageData | null> {
  const cache = await loadAll()
  return cache.byCode.get(code) ?? null
}

export async function getOccupationMeta(code: string): Promise<MetaRow | null> {
  const cache = await loadAll()
  return cache.meta.get(code) ?? null
}
