import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811101442_nz_education_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811101524_nz_education_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811101558_nz_education_links_and_programs.sql", import.meta.url), "utf8")

const educationCareers = [
  ["early-childhood-teacher", "241111", 40],
  ["primary-school-teacher", "241213", 47],
  ["secondary-school-teacher", "241411", 47],
  ["special-education-teacher", "2415", 40],
  ["social-worker", "272511", 47],
  ["youth-worker", "411716", 29],
  ["community-worker", "411711", 27],
  ["counsellor", "2721", 51],
] as const

test("NZ Education covers the canonical eight careers", () => {
  for (const [id, code] of educationCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "education")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
    assert.ok(profiles.includes(`'${code}'`))
  }
})

test("NZ Education preserves reviewed ANZSCO scopes and roll-ups", () => {
  assert.ok(profiles.includes("'NZ:early-childhood-teacher','NZ','early-childhood-teacher','Early Childhood (Pre-primary School) Teacher — registered','ANZSCO','1.3','241111'"))
  assert.ok(profiles.includes("'NZ:primary-school-teacher','NZ','primary-school-teacher','Primary School Teacher','ANZSCO','1.3','241213'"))
  assert.ok(profiles.includes("'NZ:secondary-school-teacher','NZ','secondary-school-teacher','Secondary School Teacher','ANZSCO','1.3','241411'"))
  assert.ok(profiles.includes("'Special Education Teachers (roll-up)','ANZSCO','1.3','2415'"))
  for (const code of ["241511", "241512", "241513", "241599"]) assert.ok(links.includes(`'${code}'`))
  assert.ok(!links.includes("'NZ:special-education-teacher','249311'"), "TESOL must not be rolled into special education")

  for (const code of ["272111", "272113", "272114", "272115", "272199"]) assert.ok(links.includes(`'NZ:counsellor','${code}'`))
  assert.ok(!links.includes("'NZ:counsellor','272112'"), "Drug and Alcohol Counsellor uses a separate DAPAANZ pathway")

  assert.ok(profiles.includes("'NZ:community-worker','NZ','community-worker','Community Worker','ANZSCO','1.3','411711'"))
  assert.ok(!profiles.includes("'NZ:community-worker','NZ','community-worker','Personal Care Assistant'"))
})

test("NZ Education scoring preserves current Tier 1 and Tier 2 policy", () => {
  const expected = [
    "'NZ:early-childhood-teacher','2026-08-11',null,39.66,82500,15,0,0,0,8,8,0,8,1,40",
    "'NZ:primary-school-teacher','2026-08-11',null,39.66,82500,20,0,0,0,8,8,0,10,1,47",
    "'NZ:secondary-school-teacher','2026-08-11',null,39.66,82500,20,0,0,0,8,8,0,10,1,47",
    "'NZ:special-education-teacher','2026-08-11',null,39.66,82500,15,0,0,0,8,8,0,8,1,40",
    "'NZ:social-worker','2026-08-11',null,46.63,97000,20,0,0,0,8,8,0,10,1,47",
    "'NZ:youth-worker','2026-08-11',null,32.69,68000,0,0,0,0,15,4,0,5,5,29",
    "'NZ:community-worker','2026-08-11',null,26.50,55120,0,0,0,0,15,2,0,5,5,27",
    "'NZ:counsellor','2026-08-11',null,46.63,97000,20,0,0,0,10,8,0,10,3,51",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment))

  assert.ok(metrics.includes("Primary School Teacher 241213 is on current Green List Tier 1"))
  assert.ok(metrics.includes("Secondary School Teacher 241411 is on current Green List Tier 1"))
  assert.ok(metrics.includes("The four special-education teacher occupations are on current Green List Tier 2"))
  assert.ok(metrics.includes("Current Green List Tier 2 status"))
  assert.ok(metrics.includes("Social Worker 272511 is on current Green List Tier 1"))
  assert.ok(metrics.includes("NZAC-membership counsellor group is on current Green List Tier 1"))
  assert.ok(metrics.includes("career-opportunity-nz-v1"))
})

test("NZ Education locks professional registration boundaries", () => {
  for (const id of ["early-childhood-teacher", "primary-school-teacher", "secondary-school-teacher", "special-education-teacher", "social-worker"]) {
    const line = profiles.split("\n").find((value) => value.includes(`'NZ:${id}'`))
    assert.ok(line?.includes("'NZD',true"), `${id} must be registration-required`)
  }
  for (const id of ["youth-worker", "community-worker", "counsellor"]) {
    const line = profiles.split("\n").find((value) => value.includes(`'NZ:${id}'`))
    assert.ok(line?.includes("'NZD',false"), `${id} must not be marked as universally statutorily registered`)
  }
  assert.ok(metrics.includes("section 13 experience-only pathway closed to new applications on 28 February 2026"))
  assert.ok(metrics.includes("current annual Practising Certificate are legally required"))
  assert.ok(metrics.includes("Green List access for this roll-up depends on NZAC membership"))
})

test("NZ Education publishes an official entry route for every career and labels salary proxies", () => {
  for (const [id] of educationCareers) assert.ok(links.includes(`('NZ:${id}','entry_program'`), `${id} must have an entry route`)
  assert.ok(links.includes("approved ITE programmes (registered-teacher foundation)"))
  assert.ok(links.includes("Support Worker (closest community-support route)"))
  assert.ok(metrics.includes("representative teacher-pay proxy"))
  assert.ok(metrics.includes("closest transparent community-support proxy"))
})

test("NZ Education programme links come only from the reviewed NZ canonical layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(!/nz-program:[0-9a-f]{8}-[0-9a-f-]{27,}/i.test(links), "generated programme UUIDs must not be hardcoded")
})
