import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810202502_japan_health_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["registered-nurse", null, "看護師"],
  ["midwife", "022-02", "助産師"],
  ["care-worker", null, "介護職員"],
  ["physiotherapist", "024-04", "理学療法士"],
  ["medical-laboratory-technician", "024-03", "臨床検査技師"],
  ["radiographer", "024-01", "診療放射線技師"],
  ["pharmacist", "021-04", "薬剤師"],
  ["occupational-therapist", "024-05", "作業療法士"],
] as const

test("Japan health cohort covers the canonical eight health careers", () => {
  for (const [id, code, title] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "health", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
    assert.match(migration, new RegExp(title), id)
    if (code) assert.match(migration, new RegExp(`'${code}'`), id)
  }
})

test("Japan registered nurse preserves workplace classification boundaries", () => {
  const editorial = getOccupationEditorial("registered-nurse")?.countries.JP
  assert.match(editorial?.entryPathway ?? "", /023-01[\s\S]*023-02[\s\S]*023-03[\s\S]*023-99/)
  assert.match(editorial?.entryPathway ?? "", /restricts this canonical profile to 看護師/)
  assert.match(migration, /'JP:registered-nurse'[\s\S]*null,'JPY',true/)
  for (const code of ["023-01", "023-02", "023-03", "023-99"]) {
    assert.match(migration, new RegExp(`'JP:registered-nurse','${code}'`), code)
  }
})

test("Japan care worker remains a non-licensed facility and home-care umbrella", () => {
  const editorial = getOccupationEditorial("care-worker")?.countries.JP
  assert.match(editorial?.entryPathway ?? "", /050-01\/02\/03\/99.*051-01\/02/)
  assert.match(editorial?.registration ?? "", /not universally licensed/i)
  assert.match(editorial?.registration ?? "", /介護福祉士/)
  assert.match(migration, /'JP:care-worker'[\s\S]*null,'JPY',false/)
  for (const code of ["050-01", "050-02", "050-03", "050-99", "051-01", "051-02"]) {
    assert.match(migration, new RegExp(`'JP:care-worker','${code}'`), code)
  }
})

test("Japan health licensing flags distinguish care work from regulated professions", () => {
  const licensed = [
    "registered-nurse",
    "midwife",
    "physiotherapist",
    "medical-laboratory-technician",
    "radiographer",
    "pharmacist",
    "occupational-therapist",
  ]

  for (const id of licensed) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',true`), id)
    assert.match(getOccupationEditorial(id)?.countries.JP?.registration ?? "", /licen|免許|licensed/i, id)
  }
  assert.match(migration, /'JP:care-worker'[\s\S]*'JPY',false/)
})

test("Japan health v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,10,0,0,0,1,11/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
})

test("Japan health reuses only approved programme mappings", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
