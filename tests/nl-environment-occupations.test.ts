import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(
  new URL("../supabase/migrations/20260812012110_nl_environment_profiles.sql", import.meta.url),
  "utf8",
)
const metrics = readFileSync(
  new URL("../supabase/migrations/20260812012140_nl_environment_metrics.sql", import.meta.url),
  "utf8",
)
const classifications = readFileSync(
  new URL("../supabase/migrations/20260812012155_nl_environment_classification_evidence.sql", import.meta.url),
  "utf8",
)
const links = readFileSync(
  new URL("../supabase/migrations/20260812012210_nl_environment_links_and_programs.sql", import.meta.url),
  "utf8",
)

const environmentCareers = [
  ["environmental-scientist", "2133", 42],
  ["agronomist", "2132", 36],
  ["farm-manager", "1311", 33],
  ["forestry-technician", "3143", 34],
  ["food-technologist", "2145", 46],
  ["sustainability-specialist", null, 37],
  ["horticulturist", "6113", 46],
  ["animal-science-technician", "3141", 24],
] as const

test("NL Environment covers the canonical eight careers with deliberate classification scopes", () => {
  for (const [id, code] of environmentCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "environment")
    assert.ok(editorial?.countries.NL, `${id} must have NL editorial content`)
    assert.ok(profiles.includes(`'NL:${id}'`))
    if (code) assert.ok(profiles.includes(`'${code}'`), `${id} must publish ${code}`)
  }

  assert.ok(
    profiles.includes(
      "'NL:sustainability-specialist','NL','sustainability-specialist','Sustainability / ESG / energy-management specialist — Netherlands cross-sector career scope','NL career scope','2026-08-12',null",
    ),
  )
  assert.ok(!classifications.includes("NL:sustainability-specialist"))
})

test("NL Environment opportunity scores are occupation-specific rather than sector-wide copies", () => {
  const expected = [
    "'NL:environmental-scientist','2026-08-12',null,18.92,35424,20,0,0,0,8,6,0,3,5,42",
    "'NL:agronomist','2026-08-12',null,19.83,39180,15,0,0,0,8,6,0,3,4,36",
    "'NL:farm-manager','2026-08-12',null,16.00,33280,10,0,0,0,12,4,0,3,4,33",
    "'NL:forestry-technician','2026-08-12',null,16.00,33280,10,0,0,0,12,4,0,3,5,34",
    "'NL:food-technologist','2026-08-12',null,18.29,36144,20,0,0,0,12,6,0,3,5,46",
    "'NL:sustainability-specialist','2026-08-12',null,18.92,35424,15,0,0,0,8,6,0,3,5,37",
    "'NL:horticulturist','2026-08-12',null,16.00,33280,20,0,0,0,15,4,0,3,4,46",
    "'NL:animal-science-technician','2026-08-12',null,15.00,31200,0,0,0,0,15,4,0,3,2,24",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment), fragment)
  assert.ok(metrics.includes("career-opportunity-nl-v1"))

  // Exact recurring occupation vacancy/growth series were not available, so broad sector figures are evidence only.
  assert.ok(metrics.includes("'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')"))
  assert.ok(metrics.includes("'green_vacancy_change_since_2019_pct',114"))
  assert.ok(metrics.includes("'open_vacancies_q4_2025',3100"))
  assert.ok(metrics.includes("'open_vacancies_end_2025',28000"))
})

test("NL Environment stores granular study and vocational outcomes used to distinguish scores", () => {
  for (const marker of [
    "'sbb_job_chance_10',8",
    "'sbb_job_chance_10',10",
    "'sbb_job_chance_10',7",
    "'sbb_job_chance_10',4",
    "'substantial_job_months',6",
    "'substantial_job_months',2",
    "'substantial_job_months',11",
    "'substantial_job_months',9",
    "'field_match_pct',95",
    "'field_match_pct',83",
    "'field_match_pct',78",
    "'field_match_pct',81",
    "'fixed_contract_pct',62",
    "'fixed_contract_pct',72",
    "'fixed_contract_pct',40",
    "'fixed_contract_pct',59",
    "'self_employed_pct',36",
  ]) assert.ok(metrics.includes(marker), marker)

  assert.ok(metrics.includes("Proefdierverzorger"))
  assert.ok(metrics.includes("few matching vacancies"))
  assert.ok(metrics.includes("Food Technologist"))
  assert.ok(metrics.includes("procestechnoloog"))
})

test("NL Environment keeps personal registration separate from task and business regulation", () => {
  const profileRows = profiles.match(/\('NL:[^\n]+/g) ?? []
  assert.equal(profileRows.length, 8)
  for (const row of profileRows) assert.ok(row.includes("'EUR',false,null,null,'profile_ready'"), row)

  assert.ok(links.includes("Bewijs van vakbekwaamheid chemische bestrijdingsmiddelen"))
  assert.ok(links.includes("eisen-voor-instellingen-die-dierproeven-doen-of-proefdieren-fokken"))
  assert.ok(links.includes("Bevoegdheden diergeneeskundigen"))
  assert.ok(links.includes("NVWA — HACCP"))
  assert.ok(metrics.includes("wod_special_training_required',true"))
  assert.ok(metrics.includes("HACCP/NVWA obligations attach to food businesses/processes"))
})

test("NL Environment publishes auditable direct classification evidence without fabricating a sustainability code", () => {
  const classificationRows = classifications.match(/\('NL:/g) ?? []
  assert.equal(classificationRows.length, 7)
  for (const code of ["2133", "2132", "1311", "3143", "2145", "6113", "3141"]) {
    assert.ok(classifications.includes(`'${code}'`))
  }
  assert.ok(classifications.includes("No country_occupation_region_metrics rows are inserted"))
  assert.ok(!classifications.includes("NL-SUSTAINABILITY"))
})

test("NL Environment source layer is materially richer than a minimal score-only cohort", () => {
  const labourSources = links.match(/'official_labour_market'/g) ?? []
  const regulationSources = links.match(/'official_regulation'/g) ?? []
  const policySources = links.match(/'official_policy'/g) ?? []
  const entrySources = links.match(/'entry_program'/g) ?? []

  assert.ok(labourSources.length >= 10)
  assert.ok(regulationSources.length >= 8)
  assert.ok(policySources.length >= 4)
  assert.ok(entrySources.length >= 10)
  assert.ok(links.includes("IND — Highly Skilled Migrant"))
  assert.ok(links.includes("IND — Single Permit GVVA"))
})

test("NL Environment immigration remains separate from shortage evidence", () => {
  for (const [id] of environmentCareers) {
    assert.ok(metrics.includes(`'NL:${id}'`))
  }
  assert.ok(!metrics.includes("Green List"))
  assert.ok(!metrics.includes("occupation-specific Dutch immigration fast track; 10/10"))
  assert.ok(links.includes("https://ind.nl/en/residence-permits/work/highly-skilled-migrant"))
  assert.ok(links.includes("https://ind.nl/en/residence-permits/work/single-permit-gvva"))
})

test("NL Environment programme links reuse only the reviewed canonical NL programme layer", () => {
  assert.ok(links.includes("public.program_occupation_canonical_nl_v1 poc"))
  assert.ok(links.includes("public.program_catalog_canonical_nl_v1 pc"))
  assert.ok(links.includes("pc.verification_tier='A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.student_sponsor_eligible is true"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(links.includes("case when poc.normalized_relation_type='direct' then 'direct' else 'related' end"))
  assert.ok(!/nl-program:[0-9a-f]{8}-[0-9a-f-]{27,}/i.test(links))
})
