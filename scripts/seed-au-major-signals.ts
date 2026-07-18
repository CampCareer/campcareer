/**
 * seed-au-major-signals.ts
 *
 * Aggregates occupation-level data into per-concept signals for the
 * /au/majors decision tool. Reads from:
 *   - au-jsa-osl-2025.json  (shortage ratings)
 *   - occupations_au table  (salary, CSOL status)
 *   - occupation_outlook_au table (employment projections)
 *   - courses_au table (tuition costs)
 *
 * Writes to:
 *   - au_major_signals Supabase table
 *   - src/data/au-major-signals.json (static fallback)
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-au-major-signals.ts
 */
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import {
  AU_CONCEPT_OCCUPATIONS,
  type AuConceptOccupations,
} from "../src/data/au-major-occupation-map"
import { STUDY_CONCEPTS } from "../src/data/study-concepts"

// ── Supabase client ──────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

// ── JSA OSL data ─────────────────────────────────────────────────────────────
const oslPath = path.resolve(__dirname, "../src/data/au-jsa-osl-2025.json")
const oslData = JSON.parse(readFileSync(oslPath, "utf-8")) as {
  occupations: Array<{
    oscaCode: string
    nationalRating: string
    stateRatings: Record<string, string>
  }>
}
const oslMap = new Map(oslData.occupations.map((o) => [o.oscaCode, o]))

// ── Type for occupation rows ─────────────────────────────────────────────────
interface OccupationRow {
  anzsco_code: string
  median_salary_aud: number | null
  on_csol: boolean
  occupation_en: string
}

interface OutlookRow {
  anzsco_unit_group: string
  period_end: string
  employment_change_pct: number | null
}

interface CourseRow {
  broad_field: string
  aqf_level: number | null
  tuition_fee_aud: number | null
}

// ── Editorial overrides ──────────────────────────────────────────────────────
// PR scores and AI notes require human judgement — data alone can't capture it.
const EDITORIAL: Record<
  string,
  { prScore: number; prNote: string; aiBand: "low" | "medium" | "high"; aiNote: string }
> = {
  "computer-science": {
    prScore: 78,
    prNote: "Software Developer on CSOL with strong 189/190 visa outcomes. ICT professionals consistently in top invitation rounds.",
    aiBand: "high",
    aiNote: "AI coding assistants are reshaping entry-level roles. Senior architects and systems designers remain in demand.",
  },
  "data-analytics": {
    prScore: 75,
    prNote: "Data Analyst roles appear on CSOL. AI/ML specialisations strengthen visa applications.",
    aiBand: "medium",
    aiNote: "AI augments analytics work. Demand for AI-literate data professionals is growing faster than traditional BI roles.",
  },
  "cybersecurity": {
    prScore: 85,
    prNote: "ICT Security Specialist on CSOL with national shortage. Critical infrastructure demand drives strong PR outcomes.",
    aiBand: "low",
    aiNote: "Cyber threats grow with AI but defenders are equally in demand. Low AI displacement risk.",
  },
  nursing: {
    prScore: 92,
    prNote: "Registered Nurse is one of the strongest PR pathways. National shortage across all states. High 189/190 invitation rates.",
    aiBand: "low",
    aiNote: "Nursing is fundamentally human-centred care. AI assists documentation but cannot replace clinical practice.",
  },
  "aged-care": {
    prScore: 85,
    prNote: "Aged care workers in critical national shortage. Direct pathway to PR via 482→186 and state nomination.",
    aiBand: "low",
    aiNote: "Care work is hands-on and emotionally complex. Minimal AI displacement risk.",
  },
  "allied-health": {
    prScore: 80,
    prNote: "Physiotherapy and OT on CSOL. Strong employment outcomes and state nomination pathways.",
    aiBand: "low",
    aiNote: "Allied health relies on physical assessment and manual therapy. Low AI exposure.",
  },
  engineering: {
    prScore: 78,
    prNote: "Engineering professionals on CSOL. Broad skill set applicable across industries.",
    aiBand: "medium",
    aiNote: "CAD and simulation tools are increasingly AI-assisted but design judgement remains human.",
  },
  "civil-engineering": {
    prScore: 82,
    prNote: "Civil Engineer on CSOL with shortage. Infrastructure boom drives demand. Strong 189/190 outcomes.",
    aiBand: "medium",
    aiNote: "Structural analysis software is AI-enhanced but site management and design judgment remain human.",
  },
  "mechanical-engineering": {
    prScore: 76,
    prNote: "Mechanical Engineer on CSOL. Defence and manufacturing sectors drive demand.",
    aiBand: "medium",
    aiNote: "CAD/CAM and simulation tools are increasingly automated but engineering judgment remains essential.",
  },
  "mining-resources": {
    prScore: 88,
    prNote: "Mining Engineer on CSOL with national shortage. Western Australia and Queensland drive demand. Very strong salary signals.",
    aiBand: "medium",
    aiNote: "Autonomous mining equipment is growing but oversight, planning and safety roles remain human.",
  },
  "business-analytics": {
    prScore: 70,
    prNote: "Business Analyst roles on CSOL. Strong demand in financial services and consulting.",
    aiBand: "medium",
    aiNote: "AI automates routine analysis. Strategic advisory and stakeholder management remain human.",
  },
  accounting: {
    prScore: 72,
    prNote: "Accountant on CSOL. CPA/CA qualification strengthens PR application. Moderate shortage.",
    aiBand: "high",
    aiNote: "AI and automation are transforming routine accounting. Advisory and forensic roles remain stable.",
  },
  law: {
    prScore: 65,
    prNote: "Solicitor on CSOL. Australian legal qualification is highly regarded. PR pathway through 189/190 for experienced lawyers.",
    aiBand: "medium",
    aiNote: "Legal research and document review are increasingly AI-assisted. Court advocacy and client counselling remain human.",
  },
  "primary-secondary-education": {
    prScore: 80,
    prNote: "Primary and Secondary Teachers on CSOL with national shortage. Strong state nomination pathways.",
    aiBand: "low",
    aiNote: "Teaching requires emotional intelligence, classroom management and mentoring. Minimal AI displacement.",
  },
  "early-childhood": {
    prScore: 82,
    prNote: "Early Childhood Teacher on CSOL with national shortage. Strong demand across all states.",
    aiBand: "low",
    aiNote: "Early childhood education is fundamentally relationship-based. Very low AI exposure.",
  },
  "social-work": {
    prScore: 78,
    prNote: "Social Worker on CSOL. Community services sector has persistent national shortage.",
    aiBand: "low",
    aiNote: "Social work requires empathy, advocacy and crisis intervention. Minimal AI displacement.",
  },
  "sport-fitness": {
    prScore: 55,
    prNote: "Sport and fitness roles have limited PR pathways. Some coaching roles on shortage list regionally.",
    aiBand: "low",
    aiNote: "Physical coaching and personal training are inherently human. Minimal AI risk.",
  },
  carpentry: {
    prScore: 90,
    prNote: "Carpenter in critical national shortage. One of the strongest trade PR pathways via 189/190/491.",
    aiBand: "low",
    aiNote: "Hands-on construction work is not automatable. Strong long-term demand.",
  },
  "wall-floor-tiling": {
    prScore: 88,
    prNote: "Wall and Floor Tiler in national shortage. Strong trade PR pathway.",
    aiBand: "low",
    aiNote: "Manual trade requiring dexterity and judgement. Not automatable.",
  },
  "electrical-trade": {
    prScore: 92,
    prNote: "Electrician in critical national shortage. One of the highest-demand trades. Excellent PR outcomes.",
    aiBand: "low",
    aiNote: "Electrical installation requires physical presence and safety certification. Not automatable.",
  },
  plumbing: {
    prScore: 90,
    prNote: "Plumber in critical national shortage. Strong trade PR pathway across all states.",
    aiBand: "low",
    aiNote: "Plumbing requires on-site physical work in varied environments. Not automatable.",
  },
  welding: {
    prScore: 85,
    prNote: "Welder in national shortage. Mining and construction sectors drive demand.",
    aiBand: "low",
    aiNote: "Welding requires manual skill and certification. Robotic welding exists but field work remains human.",
  },
  bricklaying: {
    prScore: 88,
    prNote: "Bricklayer in national shortage. Construction boom drives demand. Strong trade PR pathway.",
    aiBand: "low",
    aiNote: "Bricklaying is a physical trade requiring site presence. Not automatable.",
  },
  hvac: {
    prScore: 85,
    prNote: "Air Conditioning Mechanic in national shortage. Strong demand across all states.",
    aiBand: "low",
    aiNote: "HVAC installation and repair requires physical presence. Growing demand with climate change.",
  },
  architecture: {
    prScore: 70,
    prNote: "Architect on CSOL. Design skills are valued but employment is project-dependent.",
    aiBand: "medium",
    aiNote: "Generative AI is beginning to assist with design concepts. Creative vision remains human.",
  },
  "design-media": {
    prScore: 60,
    prNote: "Design roles have moderate PR pathways. Stronger outcomes for UX/UI with tech company sponsorship.",
    aiBand: "high",
    aiNote: "AI image generation and design tools are rapidly evolving. Senior creative direction remains more stable.",
  },
  "photography-film": {
    prScore: 50,
    prNote: "Limited direct PR pathways for photography/film. May qualify through broader media category.",
    aiBand: "medium",
    aiNote: "AI is entering video production and photography. Creative direction and storytelling remain human.",
  },
  "environmental-science": {
    prScore: 72,
    prNote: "Environmental Scientist on CSOL. Climate policy drives growing demand.",
    aiBand: "low",
    aiNote: "Field research and environmental assessment require physical presence and expert judgement.",
  },
  agriculture: {
    prScore: 80,
    prNote: "Agricultural Scientist on CSOL. Regional demand is strong. 491 visa pathway available.",
    aiBand: "low",
    aiNote: "Agricultural science combines field work with lab analysis. Low AI displacement.",
  },
  veterinary: {
    prScore: 75,
    prNote: "Veterinarian on CSOL. National shortage. Strong demand in regional areas.",
    aiBand: "low",
    aiNote: "Veterinary medicine requires hands-on animal care and clinical judgement.",
  },
  "hospitality-management": {
    prScore: 58,
    prNote: "Hotel Manager roles appear on CSOL but outcomes vary. Stronger with multi-year experience.",
    aiBand: "medium",
    aiNote: "AI handles bookings and operations. Guest experience management remains human.",
  },
  "culinary-arts": {
    prScore: 82,
    prNote: "Cook and Baker in national shortage. Certificate III pathway is fast. Strong 482/186 outcomes.",
    aiBand: "low",
    aiNote: "Commercial cookery is a hands-on craft. Automated kitchens exist but skilled chefs remain essential.",
  },
  "beauty-wellness": {
    prScore: 78,
    prNote: "Beauty Therapist and Hairdresser in national shortage. Certificate III pathway. Growing demand.",
    aiBand: "low",
    aiNote: "Beauty therapy requires physical skill and client interaction. Very low AI displacement.",
  },
  automotive: {
    prScore: 85,
    prNote: "Motor Mechanic in national shortage. Strong trade PR pathway across all states.",
    aiBand: "low",
    aiNote: "Vehicle diagnostics increasingly digital but physical repair remains essential.",
  },
  aviation: {
    prScore: 65,
    prNote: "Pilot has moderate PR pathways. High training cost but strong long-term demand.",
    aiBand: "low",
    aiNote: "Autonomous aircraft are decades away. Pilot demand remains strong with aviation growth.",
  },
  maritime: {
    prScore: 80,
    prNote: "Marine Engineer and Deck Officer in national shortage. Strong demand in port cities.",
    aiBand: "low",
    aiNote: "Maritime operations require physical presence and safety certification. Not automatable.",
  },
}

// ── Main aggregation logic ───────────────────────────────────────────────────

interface AggregatedSignal {
  concept_id: string
  country: string
  shortage_national_pct: number | null
  shortage_states_affected: number | null
  on_csol_pct: number | null
  outlook_2030_change_pct: number | null
  outlook_2035_change_pct: number | null
  outlook_direction: string | null
  salary_min_aud: number | null
  salary_max_aud: number | null
  salary_median_aud: number | null
  cost_bachelor_median_aud: number | null
  cost_diploma_median_aud: number | null
  cost_duration_years: number | null
  pr_score: number | null
  pr_note: string | null
  ai_exposure_band: string | null
  ai_note: string | null
  occupation_count: number | null
  representative_occupations: Array<{ oscaCode: string; label: string; labelKo: string }> | null
  data_sources: Array<{ name: string; url: string }> | null
  last_verified: string | null
}

async function fetchOccupations(
  oscaCodes: string[],
): Promise<OccupationRow[]> {
  if (oscaCodes.length === 0) return []
  const { data, error } = await supabase
    .from("occupations_au")
    .select("anzsco_code, median_salary_aud, on_csol, occupation_en")
    .in("anzsco_code", oscaCodes)
  if (error) {
    console.error("[seed] occupations query failed:", error.message)
    return []
  }
  return (data ?? []) as OccupationRow[]
}

async function fetchOutlook(
  anzsco4Groups: string[],
): Promise<OutlookRow[]> {
  if (anzsco4Groups.length === 0) return []
  const { data, error } = await supabase
    .from("occupation_outlook_au")
    .select("anzsco_unit_group, period_end, employment_change_pct")
    .in("anzsco_unit_group", anzsco4Groups)
    .eq("geography", "AU")
  if (error) {
    console.error("[seed] outlook query failed:", error.message)
    return []
  }
  return (data ?? []) as OutlookRow[]
}

async function fetchCourses(
  broadFields: string[],
): Promise<CourseRow[]> {
  if (broadFields.length === 0) return []
  const { data, error } = await supabase
    .from("courses_au")
    .select("broad_field, aqf_level, tuition_fee_aud")
    .in("broad_field", broadFields)
    .not("tuition_fee_aud", "is", null)
  if (error) {
    console.error("[seed] courses query failed:", error.message)
    return []
  }
  return (data ?? []) as CourseRow[]
}

function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid]
}

function aggregateConcept(
  concept: AuConceptOccupations,
  occupations: OccupationRow[],
  outlooks: OutlookRow[],
  courses: CourseRow[],
): AggregatedSignal {
  const editorial = EDITORIAL[concept.conceptId]

  // ── Shortage ────────────────────────────────────────────────────────────────
  let shortageCount = 0
  let statesWithShortage = 0
  let csolCount = 0

  for (const occ of occupations) {
    const osl = oslMap.get(occ.anzsco_code)
    if (osl) {
      if (osl.nationalRating === "S") shortageCount++
      const stateCount = Object.values(osl.stateRatings).filter(
        (r) => r === "S" || r === "M",
      ).length
      if (stateCount > 0) statesWithShortage = Math.max(statesWithShortage, stateCount)
    }
    if (occ.on_csol) csolCount++
  }

  const shortagePct =
    occupations.length > 0
      ? Number(((shortageCount / occupations.length) * 100).toFixed(1))
      : null
  const csolPct =
    occupations.length > 0
      ? Number(((csolCount / occupations.length) * 100).toFixed(1))
      : null

  // ── Outlook ─────────────────────────────────────────────────────────────────
  const outlooks2030 = outlooks
    .filter((o) => o.period_end?.includes("2030") && o.employment_change_pct != null)
    .map((o) => o.employment_change_pct!)
  const outlooks2035 = outlooks
    .filter((o) => o.period_end?.includes("2035") && o.employment_change_pct != null)
    .map((o) => o.employment_change_pct!)

  const avg2030 = outlooks2030.length > 0
    ? Number((outlooks2030.reduce((a, b) => a + b, 0) / outlooks2030.length).toFixed(2))
    : null
  const avg2035 = outlooks2035.length > 0
    ? Number((outlooks2035.reduce((a, b) => a + b, 0) / outlooks2035.length).toFixed(2))
    : null

  let direction: string | null = null
  if (avg2030 != null) {
    direction = avg2030 > 5 ? "growing" : avg2030 < -2 ? "declining" : "stable"
  }

  // ── Salary ──────────────────────────────────────────────────────────────────
  const salaries = occupations
    .map((o) => o.median_salary_aud)
    .filter((s): s is number => s != null && s > 0)

  // ── Course cost ─────────────────────────────────────────────────────────────
  const bachelorFees = courses
    .filter((c) => c.aqf_level === 7 && c.tuition_fee_aud && c.tuition_fee_aud > 0)
    .map((c) => c.tuition_fee_aud!)
  const diplomaFees = courses
    .filter(
      (c) =>
        (c.aqf_level === 5 || c.aqf_level === 6) &&
        c.tuition_fee_aud &&
        c.tuition_fee_aud > 0,
    )
    .map((c) => c.tuition_fee_aud!)

  return {
    concept_id: concept.conceptId,
    country: "AU",
    shortage_national_pct: shortagePct,
    shortage_states_affected: statesWithShortage || null,
    on_csol_pct: csolPct,
    outlook_2030_change_pct: avg2030,
    outlook_2035_change_pct: avg2035,
    outlook_direction: direction,
    salary_min_aud: salaries.length > 0 ? Math.min(...salaries) : null,
    salary_max_aud: salaries.length > 0 ? Math.max(...salaries) : null,
    salary_median_aud: median(salaries),
    cost_bachelor_median_aud: median(bachelorFees),
    cost_diploma_median_aud: median(diplomaFees),
    cost_duration_years: concept.durationYears.min,
    pr_score: editorial?.prScore ?? null,
    pr_note: editorial?.prNote ?? null,
    ai_exposure_band: editorial?.aiBand ?? null,
    ai_note: editorial?.aiNote ?? null,
    occupation_count: occupations.length,
    representative_occupations: concept.representativeOccupations,
    data_sources: [
      { name: "JSA Occupation Shortage List 2025", url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupation-profiles" },
      { name: "JSA Employment Projections", url: "https://www.jobsandskills.gov.au/data/employment-projections" },
      { name: "ABS 6306.0 Employee Earnings", url: "https://www.abs.gov.au/statistics/labour/earnings-and-hours/employee-earnings-hours-australia" },
      { name: "CRICOS Course Data", url: "https://cricos.education.gov.au/" },
    ],
    last_verified: new Date().toISOString().split("T")[0],
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== seed-au-major-signals ===")
  console.log(`Processing ${AU_CONCEPT_OCCUPATIONS.length} concepts...`)

  const signals: AggregatedSignal[] = []

  for (const concept of AU_CONCEPT_OCCUPATIONS) {
    const studyConcept = STUDY_CONCEPTS.find((s) => s.id === concept.conceptId)
    const label = studyConcept?.label ?? concept.conceptId
    process.stdout.write(`  ${label}... `)

    const [occupations, outlooks, courses] = await Promise.all([
      fetchOccupations(concept.oscaCodes),
      fetchOutlook(concept.anzsco4Groups),
      fetchCourses(concept.broadFields),
    ])

    const signal = aggregateConcept(concept, occupations, outlooks, courses)
    signals.push(signal)

    console.log(
      `occ=${occupations.length}, outlook=${outlooks.length}, courses=${courses.length}, ` +
      `shortage=${signal.shortage_national_pct ?? "n/a"}%, ` +
      `salary=$${signal.salary_median_aud ?? "n/a"}`,
    )
  }

  // ── Upsert to Supabase ──────────────────────────────────────────────────────
  console.log("\nUpserting to au_major_signals...")
  const BATCH = 10
  for (let i = 0; i < signals.length; i += BATCH) {
    const batch = signals.slice(i, i + BATCH)
    const { error } = await supabase
      .from("au_major_signals")
      .upsert(batch, { onConflict: "concept_id,country" })
    if (error) {
      console.error(`  Batch ${i}-${i + batch.length} failed:`, error.message)
    } else {
      console.log(`  Upserted ${batch.length} rows (${i + 1}–${i + batch.length})`)
    }
  }

  // ── Write static fallback JSON ──────────────────────────────────────────────
  const jsonPath = path.resolve(__dirname, "../src/data/au-major-signals.json")
  writeFileSync(jsonPath, JSON.stringify({ signals, generatedAt: new Date().toISOString() }, null, 2))
  console.log(`\nFallback JSON written to ${jsonPath}`)
  console.log("Done.")
}

main().catch((error) => {
  console.error("Fatal:", error)
  process.exit(1)
})
