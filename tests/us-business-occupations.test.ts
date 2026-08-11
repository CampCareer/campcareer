import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811235300_us_business_occupations.sql", import.meta.url),
  "utf8",
)

const businessCareers = [
  ["accountant", "13-2011", 29],
  ["financial-analyst", "13-2051", 31],
  ["business-analyst", "13-1111", 33],
  ["supply-chain-analyst", "13-1081", 34],
  ["human-resources-specialist", "13-1071", 27],
  ["marketing-specialist", "13-1161", 29],
  ["auditor", "13-2011", 28],
  ["project-manager", "13-1082", 31],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','2026-08-12'`))
}

test("US Business covers the canonical eight business careers", () => {
  assert.equal(businessCareers.length, 8)
  for (const [id, soc] of businessCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "business")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Business preserves exact SOC scopes and declared proxies", () => {
  for (const marker of [
    "'US:accountant','US','accountant','Accountants and Auditors — accountant scope','SOC','SOC 2018','13-2011'",
    "'US:financial-analyst','US','financial-analyst','Financial and Investment Analysts','SOC','SOC 2018','13-2051'",
    "'US:human-resources-specialist','US','human-resources-specialist','Human Resources Specialists','SOC','SOC 2018','13-1071'",
    "'US:marketing-specialist','US','marketing-specialist','Market Research Analysts and Marketing Specialists','SOC','SOC 2018','13-1161'",
    "'US:auditor','US','auditor','Accountants and Auditors — auditor scope','SOC','SOC 2018','13-2011'",
    "'US:project-manager','US','project-manager','Project Management Specialists','SOC','SOC 2018','13-1082'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("Management Analysts — business-analysis proxy"))
  assert.ok(migration.includes("Logisticians — supply-chain analysis proxy"))
  assert.ok(migration.includes("closest national business-process and organizational-analysis proxy"))
  assert.ok(migration.includes("closest national Supply Chain Analyst proxy"))
})

test("US Business stores BLS 2024 employment, pay and 2024-2034 projections", () => {
  const expected = [
    ["accountant", 1579800, 81680, "4.6 percent"],
    ["financial-analyst", 368500, 101350, "5.7 percent"],
    ["business-analyst", 1075100, 101190, "8.8 percent"],
    ["supply-chain-analyst", 241000, 80880, "16.7 percent"],
    ["human-resources-specialist", 944300, 72910, "6.2 percent"],
    ["marketing-specialist", 941700, 76950, "6.7 percent"],
    ["auditor", 1579800, 81680, "4.6 percent"],
    ["project-manager", 1046300, 100750, "5.6 percent"],
  ] as const

  for (const [id, employment, salary, growthText] of expected) {
    const row = metricRow(id)
    assert.ok(row)
    assert.ok(row.includes(`'2026-08-12',${employment},null,${salary}`))
    assert.ok(migration.includes(growthText))
  }
})

test("US Business locks US v1 scores without inventing shortage status", () => {
  const expectedRows: Record<string, RegExp> = {
    accountant: /1579800,null,81680,0,0,0,0,6,8,5,5,5,29/,
    "financial-analyst": /368500,null,101350,0,0,0,0,6,10,5,5,5,31/,
    "business-analyst": /1075100,null,101190,0,0,0,0,5,10,8,5,5,33/,
    "supply-chain-analyst": /241000,null,80880,0,0,0,0,6,8,10,5,5,34/,
    "human-resources-specialist": /944300,null,72910,0,0,0,0,6,6,5,5,5,27/,
    "marketing-specialist": /941700,null,76950,0,0,0,0,6,8,5,5,5,29/,
    auditor: /1579800,null,81680,0,0,0,0,6,8,5,5,4,28/,
    "project-manager": /1046300,null,100750,0,0,0,0,6,10,5,5,5,31/,
  }

  for (const [id, , score] of businessCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, expectedRows[id])
    assert.ok(row.includes(`,${score},'career-opportunity-us-v1','provisional'`))
  }
  assert.ok(migration.includes("not a formal federal shortage designation"))
})

test("US Business keeps H-1B, PERM and CPA boundaries conditional", () => {
  assert.ok(migration.includes("specific accountant position may support H-1B only when it independently requires"))
  assert.ok(migration.includes("title alone does not establish a degree in a specific specialty"))
  assert.ok(migration.includes("Generic accountants do not need one nationwide personal licence"))
  assert.ok(migration.includes("state CPA licensure is required for specific public-accounting/SEC-reporting responsibilities"))

  const profileRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'USD',false,null,null,'profile_ready'"))
  assert.equal(profileRows.length, 8)
})

test("US Business publishes official evidence and only reviewed Tier A programme relations", () => {
  const sourceRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'source'"))
  assert.equal(sourceRows.length, 24)

  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'2026-08-12')"))
    .filter((line) => line.includes("utaustin-") || line.includes("umich-") || line.includes("uw-") || line.includes("wisc-") || line.includes("psu-"))
  assert.equal(programmeRows.length, 9)
  assert.ok(migration.includes("('US:accountant','utaustin-bba-accounting','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:supply-chain-analyst','psu-bs-supply-chain-information-systems','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:business-analyst','uw-bs-informatics','related','2026-08-12')"))
  assert.ok(!migration.includes("('US:human-resources-specialist','utaustin-"))
  assert.ok(!migration.includes("('US:marketing-specialist','utaustin-"))
})
