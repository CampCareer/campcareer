import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810133923_korea_business_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["accountant", "0271", "회계 사무원"],
  ["financial-analyst", "0311", "투자 및 신용 분석가"],
  ["business-analyst", "0221", "business analyst scope"],
  ["supply-chain-analyst", "0284", "supply-chain analyst scope"],
  ["human-resources-specialist", "0222", "HR specialist scope"],
  ["marketing-specialist", "0243", "marketing specialist scope"],
  ["auditor", "0231", "audit scope"],
  ["project-manager", "0261", "project-management scope"],
] as const

const expectedProgrammeCounts = new Map<string, number>([
  ["accountant", 1],
  ["financial-analyst", 8],
  ["business-analyst", 9],
  ["supply-chain-analyst", 5],
  ["human-resources-specialist", 1],
  ["marketing-specialist", 3],
  ["auditor", 1],
  ["project-manager", 4],
])

test("Korea business cohort covers the canonical eight business careers", () => {
  for (const [id, code, officialTitle] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "business", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'.*'${code}'`, "s"), id)
    assert.match(migration, new RegExp(officialTitle), id)
  }
})

test("Korea business keeps broad and regulated boundaries explicit", () => {
  assert.match(getOccupationEditorial("accountant")?.countries.KR?.registration ?? "", /separate 공인회계사 profession/i)
  assert.match(getOccupationEditorial("supply-chain-analyst")?.countries.KR?.entryPathway ?? "", /no standalone Supply Chain Analyst/i)
  assert.match(getOccupationEditorial("auditor")?.countries.KR?.registration ?? "", /no single universal licence/i)
  assert.match(getOccupationEditorial("project-manager")?.countries.KR?.entryPathway ?? "", /does not provide one universal Project Manager/i)
  assert.match(migration, /금융위원회 공인회계사 제도 — statutory external-audit scope only/)
})

test("Korea business v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /Exact recurring 0271 vacancy, comparable salary, shortage and growth series are not yet normalised/)
  assert.match(migration, /No occupation-specific visa credit is assigned without verified pathway evidence/g)
})

test("Korea business reuses only the 32 reviewed programme mappings", () => {
  let total = 0
  for (const [id, expected] of expectedProgrammeCounts) {
    const matches = migration.match(new RegExp(`\\('KR:${id}','studyinkorea:`, "g")) ?? []
    assert.equal(matches.length, expected, id)
    total += matches.length
  }

  assert.equal(total, 32)
  assert.doesNotMatch(migration, /'common_pathway'/)
  assert.match(migration, /'KR:accountant','studyinkorea:100061:master:accounting','direct'/)
  assert.match(migration, /'KR:business-analyst','studyinkorea:100487:bachelor:information-systems','direct'/)
  assert.match(migration, /'KR:financial-analyst','studyinkorea:100487:bachelor:finance','direct'/)
  assert.match(migration, /'KR:auditor','studyinkorea:100061:master:accounting','related'/)
})
