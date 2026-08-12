import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810215503_nz_health_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810215527_nz_health_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810215556_nz_health_links_and_programs.sql", import.meta.url), "utf8")

const healthCareers = [
  ["registered-nurse", "2544", 49],
  ["midwife", "254111", 47],
  ["care-worker", "423313", 45],
  ["physiotherapist", "252511", 49],
  ["medical-lab-tech", "311213", 50],
  ["radiographer", "251211", 51],
  ["pharmacist", "2515", 47],
  ["occupational-therapist", "252411", 47],
] as const

test("NZ Health covers the canonical eight health careers", () => {
  for (const [id, code] of healthCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "health")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${code}'`))
  }
})

test("NZ Health uses exact ANZSCO scopes and explicit roll-ups", () => {
  for (const [id, code] of healthCareers) {
    assert.ok(profiles.includes(`'NZ:${id}'`))
    assert.ok(profiles.includes(`'ANZSCO','1.3','${code}'`))
  }

  assert.ok(profiles.includes("'Registered Nurses (roll-up)','ANZSCO','1.3','2544'"))
  assert.ok(profiles.includes("'Pharmacists (roll-up)','ANZSCO','1.3','2515'"))
  assert.ok(links.includes("'254412','Registered Nurse (Aged Care)'"))
  assert.ok(links.includes("'254499','Registered Nurses nec'"))
  assert.ok(!links.includes("'254411','Nurse Practitioner'"))
  assert.ok(links.includes("'251511','Hospital Pharmacist'"))
  assert.ok(links.includes("'251512','Industrial Pharmacist'"))
  assert.ok(links.includes("'251513','Retail Pharmacist'"))
})

test("NZ Health preserves Tier 1 and care-workforce residence policy separately", () => {
  for (const [id, , score] of healthCareers) {
    assert.ok(metrics.includes(`'NZ:${id}'`))
    assert.ok(metrics.includes(`,${score},'career-opportunity-nz-v1'`))
  }

  for (const id of ["registered-nurse", "midwife", "physiotherapist", "medical-lab-tech", "radiographer", "pharmacist", "occupational-therapist"]) {
    const start = metrics.indexOf(`'NZ:${id}'`)
    assert.ok(start >= 0)
    assert.ok(metrics.slice(start, start + 1300).includes("Green List Tier 1"), `${id} must use current Tier 1 evidence`)
  }

  assert.ok(metrics.includes("'NZ:care-worker','2026-08-10',null,25.48,53000,15,0,0,0,15,2,0,8,5,45"))
  assert.ok(metrics.includes("Care Workforce Work to Residence after 24 months"))
  assert.ok(metrics.includes("NZD 28.25/hour"))
})

test("NZ Health locks regulated professional scopes", () => {
  for (const id of ["registered-nurse", "midwife", "physiotherapist", "medical-lab-tech", "radiographer", "pharmacist", "occupational-therapist"]) {
    const line = profiles.split("\n").find((value) => value.includes(`'NZ:${id}'`))
    assert.ok(line?.includes("'NZD',true"), `${id} must be marked registration-required`)
  }

  const careLine = profiles.split("\n").find((value) => value.includes("'NZ:care-worker'"))
  assert.ok(careLine?.includes("'NZD',false"))
  assert.ok(metrics.includes("not Medical Laboratory Scientist 234611"))
  assert.ok(metrics.includes("diagnostic radiography scope"))
})

test("NZ Health publishes an official entry route for every career", () => {
  for (const profileKey of [
    "NZ:registered-nurse",
    "NZ:midwife",
    "NZ:care-worker",
    "NZ:physiotherapist",
    "NZ:medical-lab-tech",
    "NZ:radiographer",
    "NZ:pharmacist",
    "NZ:occupational-therapist",
  ]) {
    assert.ok(links.includes(`('${profileKey}','entry_program'`), `${profileKey} must have an entry link`)
  }
})

test("NZ Health derives tertiary programme links from the verified canonical NZ programme layer", () => {
  assert.ok(links.includes("from public.program_occupation_canonical_nz_v1 m"))
  assert.ok(links.includes("join public.program_catalog_canonical_nz_v1 c using (programme_id)"))
  assert.ok(links.includes("m.canonical_career_id in ('registered-nurse','midwife','physiotherapist','pharmacist')"))
  assert.ok(links.includes("c.verification_tier = 'A'"))
  assert.ok(links.includes("c.international_students_eligible is true"))
  assert.ok(links.includes("c.code_signatory_status = 'confirmed'"))
  assert.ok(!links.includes("nz-program:894c452e"), "generated programme UUIDs should not be hardcoded in the migration")
})
