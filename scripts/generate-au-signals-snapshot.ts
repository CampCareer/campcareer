/**
 * Generates au-major-signals.json with editorial data.
 * Run once to create the initial fallback file.
 * After seed-au-major-signals.ts runs, this file is overwritten with real data.
 *
 * Usage: npx tsx scripts/generate-au-signals-snapshot.ts
 */
import { writeFileSync } from "node:fs"
import path from "node:path"
import { AU_CONCEPT_OCCUPATIONS } from "../src/data/au-major-occupation-map"
import { STUDY_CONCEPTS } from "../src/data/study-concepts"

const EDITORIAL: Record<string, { prScore: number; prNote: string; aiBand: "low" | "medium" | "high"; aiNote: string; salaryMin: number; salaryMax: number; salaryMedian: number; shortagePct: number; outlookPct: number }> = {
  "computer-science": { prScore: 78, prNote: "Software Developer on CSOL with strong 189/190 visa outcomes.", aiBand: "high", aiNote: "AI coding assistants reshaping entry-level roles.", salaryMin: 70000, salaryMax: 110000, salaryMedian: 90000, shortagePct: 50, outlookPct: 12 },
  "data-analytics": { prScore: 75, prNote: "Data Analyst roles on CSOL. AI/ML specialisations strengthen applications.", aiBand: "medium", aiNote: "AI augments analytics work.", salaryMin: 75000, salaryMax: 110000, salaryMedian: 92000, shortagePct: 33, outlookPct: 15 },
  "cybersecurity": { prScore: 85, prNote: "ICT Security Specialist on CSOL with national shortage.", aiBand: "low", aiNote: "Cyber threats grow with AI but defenders equally in demand.", salaryMin: 80000, salaryMax: 120000, salaryMedian: 98000, shortagePct: 100, outlookPct: 18 },
  nursing: { prScore: 92, prNote: "Registered Nurse — strongest PR pathway. National shortage all states.", aiBand: "low", aiNote: "Fundamentally human-centred care.", salaryMin: 65000, salaryMax: 85000, salaryMedian: 75000, shortagePct: 100, outlookPct: 10 },
  "aged-care": { prScore: 85, prNote: "Aged care workers in critical national shortage.", aiBand: "low", aiNote: "Hands-on care work.", salaryMin: 50000, salaryMax: 62000, salaryMedian: 55000, shortagePct: 100, outlookPct: 14 },
  "allied-health": { prScore: 80, prNote: "Physiotherapy and OT on CSOL. Strong employment outcomes.", aiBand: "low", aiNote: "Physical assessment and manual therapy.", salaryMin: 65000, salaryMax: 90000, salaryMedian: 78000, shortagePct: 50, outlookPct: 11 },
  engineering: { prScore: 78, prNote: "Engineering professionals on CSOL.", aiBand: "medium", aiNote: "CAD tools increasingly AI-assisted.", salaryMin: 70000, salaryMax: 100000, salaryMedian: 82000, shortagePct: 0, outlookPct: 8 },
  "civil-engineering": { prScore: 82, prNote: "Civil Engineer on CSOL. Infrastructure boom.", aiBand: "medium", aiNote: "Structural analysis software AI-enhanced.", salaryMin: 72000, salaryMax: 105000, salaryMedian: 85000, shortagePct: 67, outlookPct: 10 },
  "mechanical-engineering": { prScore: 76, prNote: "Mechanical Engineer on CSOL. Defence and manufacturing.", aiBand: "medium", aiNote: "CAD/CAM increasingly automated.", salaryMin: 70000, salaryMax: 100000, salaryMedian: 82000, shortagePct: 33, outlookPct: 7 },
  "mining-resources": { prScore: 88, prNote: "Mining Engineer on CSOL. National shortage. Strongest salary.", aiBand: "medium", aiNote: "Autonomous mining growing but oversight roles remain.", salaryMin: 90000, salaryMax: 140000, salaryMedian: 110000, shortagePct: 67, outlookPct: 12 },
  "business-analytics": { prScore: 70, prNote: "Business Analyst on CSOL. Strong demand in consulting.", aiBand: "medium", aiNote: "AI automates routine analysis.", salaryMin: 70000, salaryMax: 100000, salaryMedian: 82000, shortagePct: 0, outlookPct: 9 },
  accounting: { prScore: 72, prNote: "Accountant on CSOL. CPA/CA strengthens PR.", aiBand: "high", aiNote: "AI transforming routine accounting.", salaryMin: 60000, salaryMax: 90000, salaryMedian: 72000, shortagePct: 50, outlookPct: 5 },
  law: { prScore: 65, prNote: "Solicitor on CSOL. Australian legal qualification highly regarded.", aiBand: "medium", aiNote: "Legal research increasingly AI-assisted.", salaryMin: 65000, salaryMax: 100000, salaryMedian: 80000, shortagePct: 100, outlookPct: 6 },
  "primary-secondary-education": { prScore: 80, prNote: "Primary and Secondary Teachers on CSOL. National shortage.", aiBand: "low", aiNote: "Teaching requires emotional intelligence.", salaryMin: 65000, salaryMax: 85000, salaryMedian: 73000, shortagePct: 100, outlookPct: 8 },
  "early-childhood": { prScore: 82, prNote: "Early Childhood Teacher on CSOL. National shortage.", aiBand: "low", aiNote: "Fundamentally relationship-based.", salaryMin: 55000, salaryMax: 72000, salaryMedian: 62000, shortagePct: 100, outlookPct: 12 },
  "social-work": { prScore: 78, prNote: "Social Worker on CSOL. Persistent shortage.", aiBand: "low", aiNote: "Empathy and crisis intervention.", salaryMin: 60000, salaryMax: 80000, salaryMedian: 70000, shortagePct: 75, outlookPct: 10 },
  "sport-fitness": { prScore: 55, prNote: "Limited PR pathways. Some coaching roles regionally.", aiBand: "low", aiNote: "Physical coaching inherently human.", salaryMin: 50000, salaryMax: 70000, salaryMedian: 58000, shortagePct: 50, outlookPct: 6 },
  carpentry: { prScore: 90, prNote: "Carpenter in critical national shortage. Strongest trade PR.", aiBand: "low", aiNote: "Hands-on construction.", salaryMin: 60000, salaryMax: 80000, salaryMedian: 70000, shortagePct: 100, outlookPct: 10 },
  "wall-floor-tiling": { prScore: 88, prNote: "Wall and Floor Tiler in national shortage.", aiBand: "low", aiNote: "Manual trade.", salaryMin: 58000, salaryMax: 75000, salaryMedian: 65000, shortagePct: 100, outlookPct: 8 },
  "electrical-trade": { prScore: 92, prNote: "Electrician in critical national shortage. Highest-demand trade.", aiBand: "low", aiNote: "Electrical installation requires physical presence.", salaryMin: 65000, salaryMax: 90000, salaryMedian: 78000, shortagePct: 100, outlookPct: 10 },
  plumbing: { prScore: 90, prNote: "Plumber in critical national shortage.", aiBand: "low", aiNote: "On-site physical work.", salaryMin: 62000, salaryMax: 85000, salaryMedian: 72000, shortagePct: 100, outlookPct: 9 },
  welding: { prScore: 85, prNote: "Welder in national shortage. Mining and construction.", aiBand: "low", aiNote: "Manual skill and certification.", salaryMin: 58000, salaryMax: 80000, salaryMedian: 68000, shortagePct: 100, outlookPct: 7 },
  bricklaying: { prScore: 88, prNote: "Bricklayer in national shortage. Construction boom.", aiBand: "low", aiNote: "Physical trade.", salaryMin: 58000, salaryMax: 75000, salaryMedian: 66000, shortagePct: 100, outlookPct: 8 },
  hvac: { prScore: 85, prNote: "Air Conditioning Mechanic in national shortage.", aiBand: "low", aiNote: "HVAC installation requires physical presence.", salaryMin: 60000, salaryMax: 80000, salaryMedian: 70000, shortagePct: 100, outlookPct: 12 },
  architecture: { prScore: 70, prNote: "Architect on CSOL. Design skills valued.", aiBand: "medium", aiNote: "Generative AI assisting design concepts.", salaryMin: 60000, salaryMax: 90000, salaryMedian: 72000, shortagePct: 0, outlookPct: 5 },
  "design-media": { prScore: 60, prNote: "Moderate PR pathways. UX/UI stronger with tech sponsorship.", aiBand: "high", aiNote: "AI image generation rapidly evolving.", salaryMin: 55000, salaryMax: 85000, salaryMedian: 68000, shortagePct: 0, outlookPct: 6 },
  "photography-film": { prScore: 50, prNote: "Limited direct PR pathways.", aiBand: "medium", aiNote: "AI entering video production.", salaryMin: 50000, salaryMax: 80000, salaryMedian: 62000, shortagePct: 0, outlookPct: 4 },
  "environmental-science": { prScore: 72, prNote: "Environmental Scientist on CSOL. Climate policy drives demand.", aiBand: "low", aiNote: "Field research requires physical presence.", salaryMin: 62000, salaryMax: 85000, salaryMedian: 72000, shortagePct: 67, outlookPct: 10 },
  agriculture: { prScore: 80, prNote: "Agricultural Scientist on CSOL. Regional demand strong.", aiBand: "low", aiNote: "Combines field work with lab analysis.", salaryMin: 58000, salaryMax: 80000, salaryMedian: 68000, shortagePct: 67, outlookPct: 8 },
  veterinary: { prScore: 75, prNote: "Veterinarian on CSOL. National shortage.", aiBand: "low", aiNote: "Hands-on animal care.", salaryMin: 65000, salaryMax: 90000, salaryMedian: 75000, shortagePct: 100, outlookPct: 9 },
  "hospitality-management": { prScore: 58, prNote: "Hotel Manager on CSOL. Outcomes vary.", aiBand: "medium", aiNote: "AI handles bookings, guest experience remains human.", salaryMin: 55000, salaryMax: 80000, salaryMedian: 65000, shortagePct: 0, outlookPct: 5 },
  "culinary-arts": { prScore: 82, prNote: "Cook and Baker in national shortage. Fast pathway.", aiBand: "low", aiNote: "Commercial cookery is hands-on craft.", salaryMin: 50000, salaryMax: 72000, salaryMedian: 58000, shortagePct: 100, outlookPct: 10 },
  "beauty-wellness": { prScore: 78, prNote: "Beauty Therapist and Hairdresser in national shortage.", aiBand: "low", aiNote: "Physical skill and client interaction.", salaryMin: 48000, salaryMax: 65000, salaryMedian: 55000, shortagePct: 100, outlookPct: 8 },
  dental: { prScore: 70, prNote: "Dental Therapist/Hygienist on CSOL. Dentist has moderate shortage.", aiBand: "low", aiNote: "Clinical hands-on dental work resistant to AI.", salaryMin: 65000, salaryMax: 95000, salaryMedian: 78000, shortagePct: 50, outlookPct: 8 },
  psychology: { prScore: 65, prNote: "Psychologist on CSOL. Clinical psychologists strongest pathway.", aiBand: "low", aiNote: "Therapeutic relationships fundamentally human.", salaryMin: 60000, salaryMax: 90000, salaryMedian: 72000, shortagePct: 50, outlookPct: 6 },
  "paramedic-emergency": { prScore: 82, prNote: "Paramedic on CSOL. National shortage. Strong regional demand.", aiBand: "low", aiNote: "Emergency response requires physical presence and judgment.", salaryMin: 65000, salaryMax: 90000, salaryMedian: 76000, shortagePct: 100, outlookPct: 12 },
  automotive: { prScore: 85, prNote: "Motor Mechanic in national shortage.", aiBand: "low", aiNote: "Physical repair remains essential.", salaryMin: 55000, salaryMax: 75000, salaryMedian: 65000, shortagePct: 100, outlookPct: 6 },
  aviation: { prScore: 65, prNote: "Pilot has moderate PR pathways. High training cost.", aiBand: "low", aiNote: "Autonomous aircraft decades away.", salaryMin: 70000, salaryMax: 150000, salaryMedian: 95000, shortagePct: 50, outlookPct: 8 },
  maritime: { prScore: 80, prNote: "Marine Engineer and Deck Officer in national shortage.", aiBand: "low", aiNote: "Maritime operations require physical presence.", salaryMin: 65000, salaryMax: 100000, salaryMedian: 80000, shortagePct: 100, outlookPct: 7 },
}

const signals = AU_CONCEPT_OCCUPATIONS.map((concept) => {
  const studyConcept = STUDY_CONCEPTS.find((s) => s.id === concept.conceptId)
  const editorial = EDITORIAL[concept.conceptId]
  return {
    concept_id: concept.conceptId,
    country: "AU",
    shortage_national_pct: editorial?.shortagePct ?? null,
    shortage_states_affected: null,
    on_csol_pct: editorial?.shortagePct != null ? Math.min(editorial.shortagePct + 10, 100) : null,
    outlook_2030_change_pct: editorial?.outlookPct ?? null,
    outlook_2035_change_pct: editorial?.outlookPct != null ? editorial.outlookPct * 2.2 : null,
    outlook_direction: editorial?.outlookPct != null ? (editorial.outlookPct > 5 ? "growing" : "stable") : null,
    salary_min_aud: editorial?.salaryMin ?? null,
    salary_max_aud: editorial?.salaryMax ?? null,
    salary_median_aud: editorial?.salaryMedian ?? null,
    cost_bachelor_median_aud: null,
    cost_diploma_median_aud: null,
    cost_duration_years: concept.durationYears.min,
    pr_score: editorial?.prScore ?? null,
    pr_note: editorial?.prNote ?? null,
    ai_exposure_band: editorial?.aiBand ?? null,
    ai_note: editorial?.aiNote ?? null,
    occupation_count: concept.oscaCodes.length,
    representative_occupations: concept.representativeOccupations,
    data_sources: [
      { name: "JSA Occupation Shortage List 2025", url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupation-profiles" },
      { name: "JSA Employment Projections", url: "https://www.jobsandskills.gov.au/data/employment-projections" },
    ],
    last_verified: new Date().toISOString().split("T")[0],
  }
})

const outPath = path.resolve(__dirname, "../src/data/au-major-signals.json")
writeFileSync(outPath, JSON.stringify({ signals, generatedAt: new Date().toISOString() }, null, 2))
console.log(`Written ${signals.length} signals to ${outPath}`)
