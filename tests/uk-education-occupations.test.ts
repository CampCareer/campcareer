import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810172927_uk_education_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810173004_uk_education_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810173047_uk_education_links_and_programs.sql", import.meta.url), "utf8")

const educationCareers = [
  ["early-childhood-teacher", "2315", 28],
  ["primary-school-teacher", "2314", 23],
  ["secondary-school-teacher", "2313", 33],
  ["special-education-teacher", "2316", 28],
  ["social-worker", "2461", 47],
  ["youth-worker", "2464", 21],
  ["community-worker", "3221", 23],
  ["counsellor", "3224", 20],
] as const

test("UK Education cohort covers the canonical eight education careers", () => {
  for (const [id, soc] of educationCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "education")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${soc}'`))
  }
})

test("UK Education opportunity scores preserve shortage, regulation and visa distinctions", () => {
  const expected = [
    "'UK:early-childhood-teacher','2026-08-10',null,null,31425,5,0,0,0,10,4,0,5,4,28",
    "'UK:primary-school-teacher','2026-08-10',null,null,42031,0,0,0,0,8,8,0,5,2,23",
    "'UK:secondary-school-teacher','2026-08-10',null,null,44246,10,0,0,0,8,8,0,5,2,33",
    "'UK:special-education-teacher','2026-08-10',null,null,40363,5,0,0,0,8,8,0,5,2,28",
    "'UK:social-worker','2026-08-10',null,null,42708,20,0,0,0,8,8,0,10,1,47",
    "'UK:youth-worker','2026-08-10',null,null,34630,0,0,0,0,8,4,0,5,4,21",
    "'UK:community-worker','2026-08-10',null,null,27711,0,0,0,0,15,0,0,3,5,23",
    "'UK:counsellor','2026-08-10',null,null,27082,0,0,0,0,12,0,0,3,5,20",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment))
  assert.ok(metrics.includes("career-opportunity-uk-v1"))
  assert.ok(metrics.includes("6,000 FTE vacancies"))
  assert.ok(metrics.includes("128% of estimated 2025/26 need"))
  assert.ok(metrics.includes("89% of 2025/26 need"))
})

test("UK Education keeps professional Youth Worker separate from community-worker SOC 3221", () => {
  assert.ok(profiles.includes("'UK:youth-worker','UK','youth-worker','Youth work professionals','SOC','SOC 2020','2464'"))
  assert.ok(links.includes("'UK:community-worker','3221/01','Community workers'"))
  assert.ok(metrics.includes("SOC 3221 excludes youth work professionals"))
  assert.ok(!profiles.includes("'UK:youth-worker','UK','youth-worker','Youth and community workers"))
})

test("UK Education reflects current immigration and regulated-entry semantics", () => {
  assert.ok(metrics.includes("Health and Care Worker visa eligible; 10/10"))
  assert.ok(metrics.includes("SOC 3221 is RQF 3-5, not current TSL"))
  assert.ok(metrics.includes("SOC 3224 is RQF 3-5, not current TSL"))
  assert.ok(metrics.includes("QTS is legally required in maintained primary schools"))
  assert.ok(metrics.includes("QTS is legally required in maintained secondary schools"))
  assert.ok(profiles.includes("'UK:social-worker','UK','social-worker','Social workers','SOC','SOC 2020','2461','GBP',true"))
})

test("UK Education publishes only the verified canonical university programme while preserving official entry routes", () => {
  const programRefs = links.match(/uk-program:/g) ?? []
  assert.equal(programRefs.length, 1)
  assert.ok(links.includes("uk-program:01137e51-7937-29d8-599c-9468d121e11c"))
  assert.ok(links.includes("'UK:youth-worker','uk-program:01137e51-7937-29d8-599c-9468d121e11c','progression'"))
  for (const marker of ["ST1077", "st1502", "st0510", "st0522", "OCC0906", "OCC1192"]) {
    assert.ok(links.toLowerCase().includes(marker.toLowerCase()))
  }
})
