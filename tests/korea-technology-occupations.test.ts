import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810131242_korea_technology_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["software-developer", "1332", "응용 소프트웨어 개발자"],
  ["data-analyst", "1352", "데이터 분석가"],
  ["data-engineer", "1351", "데이터 시스템 전문가"],
  ["cybersecurity-analyst", "1342", "정보 보안 전문가"],
  ["network-administrator", "1361", "정보 시스템 운영자"],
  ["cloud-engineer", "1331", "시스템 소프트웨어 개발자"],
  ["database-administrator", "1351", "데이터 시스템 전문가"],
  ["ict-support-technician", "1361", "정보 시스템 운영자"],
] as const

test("Korea technology cohort covers the canonical eight technology careers", () => {
  for (const [id, code, officialTitle] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "technology", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'.*'${code}'`, "s"), id)
    assert.match(migration, new RegExp(officialTitle), id)
  }
})

test("Korea technology keeps broader KECO mappings scoped to the canonical career", () => {
  assert.match(getOccupationEditorial("data-engineer")?.countries.KR?.entryPathway ?? "", /1351.*restricts the canonical scope/i)
  assert.match(getOccupationEditorial("network-administrator")?.countries.KR?.entryPathway ?? "", /1361.*restricts the profile/i)
  assert.match(getOccupationEditorial("database-administrator")?.countries.KR?.entryPathway ?? "", /1351.*restricts the profile/i)
  assert.match(getOccupationEditorial("ict-support-technician")?.countries.KR?.entryPathway ?? "", /1361/i)
})

test("Korea cloud engineering uses the system-software scope rather than generic operations", () => {
  const cloud = getOccupationEditorial("cloud-engineer")?.countries.KR
  assert.ok(cloud)
  assert.match(cloud.entryPathway, /1331 시스템 소프트웨어 개발자/)
  assert.match(cloud.entryPathway, /cloud-environment design and cloud-system engineering/i)
  assert.match(cloud.jobMarketNote, /Pure cloud operations.*1361/i)
})

test("Korea technology v1 stays provisional without fabricated market evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /0,0,0,0,13,0,0,0,5,18/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /No occupation-specific visa credit is assigned/)
})

test("Korea technology reuses reviewed programme mappings without promoting common pathways", () => {
  assert.match(migration, /from public\.program_occupation_kr_v1 mapping/)
  assert.match(migration, /case when mapping\.relation_type = 'direct' then 'direct' else 'related' end/)
  assert.doesNotMatch(migration, /'common_pathway'\s*then\s*'direct'/)
})
