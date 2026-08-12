import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(
  new URL("../supabase/migrations/20260812011110_nl_education_profiles.sql", import.meta.url),
  "utf8",
)
const metrics = readFileSync(
  new URL("../supabase/migrations/20260812011140_nl_education_metrics.sql", import.meta.url),
  "utf8",
)
const links = readFileSync(
  new URL("../supabase/migrations/20260812011210_nl_education_links_and_programs.sql", import.meta.url),
  "utf8",
)

const educationCareers = [
  ["early-childhood-teacher", "2342", 42],
  ["primary-school-teacher", "2341", 39],
  ["secondary-school-teacher", "2330", 34],
  ["special-education-teacher", "2352", 34],
  ["social-worker", "2635", 30],
  ["youth-worker", "3412", 29],
  ["community-worker", "3412", 30],
  ["counsellor", "2635", 20],
] as const

test("NL Education cohort covers the canonical eight education careers", () => {
  for (const [id, code] of educationCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "education")
    assert.ok(editorial?.countries.NL, `${id} must have NL editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${code}'`))
  }
})

test("NL Education preserves teacher qualification boundaries without over-registering social roles", () => {
  for (const id of ["primary-school-teacher", "secondary-school-teacher", "special-education-teacher"]) {
    assert.ok(profiles.includes(`'NL:${id}','NL','${id}'`))
    const row = profiles.split("\n").find((line) => line.includes(`'NL:${id}'`))
    assert.ok(row?.includes("'EUR',true,'DUO / Ministry of Education, Culture and Science'"))
  }

  for (const id of ["early-childhood-teacher", "social-worker", "youth-worker", "community-worker", "counsellor"]) {
    const row = profiles.split("\n").find((line) => line.includes(`'NL:${id}'`))
    assert.ok(row?.includes("'EUR',false,null,null"), `${id} must not be universally registration-required`)
  }

  assert.ok(links.includes("Rijksoverheid — Opleiding en ondersteuning medewerkers kinderopvang"))
  assert.ok(links.includes("Rijksoverheid — Taaleis kinderopvang"))
  assert.ok(links.includes("DUO — Werken als leraar met buitenlands diploma"))
  assert.ok(links.includes("SKJ — Registratie"))
})

test("NL Education opportunity scores preserve current shortage-strength distinctions", () => {
  const expected = [
    "'NL:early-childhood-teacher','2026-08-12',null,15.63,30876,20,0,0,0,12,4,0,3,3,42",
    "'NL:primary-school-teacher','2026-08-12',null,20.53,40572,20,0,0,0,8,6,0,3,2,39",
    "'NL:secondary-school-teacher','2026-08-12',null,20.01,39540,15,0,0,0,8,6,0,3,2,34",
    "'NL:special-education-teacher','2026-08-12',null,20.53,40572,15,0,0,0,8,6,0,3,2,34",
    "'NL:social-worker','2026-08-12',null,17.51,34596,10,0,0,0,8,4,0,3,5,30",
    "'NL:youth-worker','2026-08-12',null,17.51,34596,10,0,0,0,8,4,0,3,4,29",
    "'NL:community-worker','2026-08-12',null,17.51,34596,10,0,0,0,8,4,0,3,5,30",
    "'NL:counsellor','2026-08-12',null,16.45,32496,0,0,0,0,8,4,0,3,5,20",
  ]

  for (const fragment of expected) assert.ok(metrics.includes(fragment))
  assert.ok(metrics.includes("career-opportunity-nl-v1"))
  assert.ok(metrics.includes("very tight"))
  assert.ok(metrics.includes("shortage above 2,500 FTE in 2026"))
  assert.ok(metrics.includes("may become somewhat less tight"))
})

test("NL Education keeps shared ISCO social scopes explicit", () => {
  assert.ok(profiles.includes("'NL:social-worker','NL','social-worker','Social Work and Counselling Professionals — social-worker scope','ISCO-08','2008','2635'"))
  assert.ok(profiles.includes("'NL:counsellor','NL','counsellor','Social Work and Counselling Professionals — non-clinical counselling scope','ISCO-08','2008','2635'"))
  assert.ok(profiles.includes("'NL:youth-worker','NL','youth-worker','Social Work Associate Professionals — youth-services scope','ISCO-08','2008','3412'"))
  assert.ok(profiles.includes("'NL:community-worker','NL','community-worker','Social Work Associate Professionals — community-services scope','ISCO-08','2008','3412'"))
})

test("NL Education keeps shortage, immigration and conditional SKJ treatment separate", () => {
  assert.equal((metrics.match(/,3,/g) ?? []).length >= 8, true)
  assert.ok(links.includes("IND — Highly Skilled Migrant"))
  assert.ok(links.includes("IND — Single Permit GVVA"))
  assert.ok(!links.includes("Green List"))
  assert.ok(metrics.includes("SKJ is task-dependent rather than universal"))
  assert.ok(metrics.includes("Generic social work is not universally registered"))
})

test("NL Education publishes official study sources and only reviewed canonical programme links", () => {
  for (const marker of [
    "Pedagogisch Educatief Professional",
    "Leraar Basisonderwijs (Pabo)",
    "Lerarenopleiding 2e graad Pedagogiek",
    "Studiekeuze123 — Social Work",
    "Studiekeuze123 — Toegepaste Psychologie",
  ]) {
    assert.ok(links.includes(marker))
  }

  assert.ok(links.includes("program_occupation_canonical_nl_v1"))
  assert.ok(links.includes("program_catalog_canonical_nl_v1"))
  assert.ok(links.includes("pc.verification_tier='A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.student_sponsor_eligible is true"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(links.includes("case when poc.normalized_relation_type='direct' then 'direct' else 'related' end"))
  assert.ok(!/nl-program:[0-9a-f]{8}-[0-9a-f-]{27,}/i.test(links))
})
