import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811021023_ie_business_occupations.sql", import.meta.url),
  "utf8",
)

const businessCareers = [
  ["accountant", "2421", 21],
  ["financial-analyst", "3534", 19],
  ["business-analyst", "2423", 21],
  ["supply-chain-analyst", "3541", 23],
  ["human-resources-specialist", "3562", 19],
  ["marketing-specialist", "3543", 23],
  ["auditor", "2421", 16],
  ["project-manager", "2424", 21],
] as const

test("Ireland Business covers the canonical eight business careers", () => {
  for (const [id, soc] of businessCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "business")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Business preserves the intended SOC 2010 scopes", () => {
  for (const marker of [
    "'IE:accountant','IE','accountant','Chartered and certified accountants — accountant scope','SOC','SOC 2010','2421'",
    "'IE:financial-analyst','IE','financial-analyst','Finance and investment analysts and advisers','SOC','SOC 2010','3534'",
    "'IE:business-analyst','IE','business-analyst','Management consultants and business analysts','SOC','SOC 2010','2423'",
    "'IE:supply-chain-analyst','IE','supply-chain-analyst','Buyers and procurement officers — supply-chain / procurement analysis scope','SOC','SOC 2010','3541'",
    "'IE:human-resources-specialist','IE','human-resources-specialist','Human resources and industrial relations officers','SOC','SOC 2010','3562'",
    "'IE:marketing-specialist','IE','marketing-specialist','Marketing associate professionals','SOC','SOC 2010','3543'",
    "'IE:auditor','IE','auditor','Chartered and certified accountants — statutory financial-audit scope','SOC','SOC 2010','2421'",
    "'IE:project-manager','IE','project-manager','Business and financial project management professionals — business project-management scope','SOC','SOC 2010','2424'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("does not roll logistics managers, warehouse managers or generic data analysts"))
  assert.ok(migration.includes("IT project managers (2134) and construction project managers (2436)"))
})

test("Ireland Business does not infer shortage from broad business and financial demand", () => {
  for (const [id, , score] of businessCareers) {
    assert.ok(migration.includes(`'IE:${id}','2026-08-11'`))
    assert.ok(migration.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }

  for (const id of businessCareers.map(([careerId]) => careerId)) {
    const row = migration.split("\n").find((line) => line.includes(`('IE:${id}','2026-08-11'`))
    assert.ok(row, `${id} metric row must exist`)
    assert.match(row, /'2026-08-11',null,null,null,0,0,0,0,/)
  }
})

test("Ireland Business keeps conditional Critical Skills scopes separate from ordinary GEP access", () => {
  assert.ok(migration.includes("'IE:accountant','source','DETE — Critical Skills Occupations List'"))
  assert.ok(migration.includes("'IE:business-analyst','source','DETE — Critical Skills big-data business-analysis scope'"))
  assert.ok(migration.includes("'IE:auditor','source','DETE — Critical Skills qualified-accountant / audit specialist scope'"))
  assert.ok(migration.includes("'IE:project-manager','source','DETE — Critical Skills specialist SOC 2424 scope'"))

  for (const id of ["financial-analyst", "supply-chain-analyst", "human-resources-specialist", "marketing-specialist"]) {
    assert.ok(migration.includes(`'IE:${id}','source','DETE — Employment-permit occupation classification'`))
  }

  assert.ok(migration.includes("is not borrowed by generic SOC 3534 Financial Analyst"))
  assert.ok(migration.includes("Generic process, operations or change-analysis roles must not be labelled Critical Skills"))
})

test("Ireland Business separates accountant permit recognition from statutory-audit authorisation", () => {
  assert.ok(migration.includes("'IE:accountant','IE','accountant','Chartered and certified accountants — accountant scope','SOC','SOC 2010','2421','EUR',false,null,null"))
  assert.ok(migration.includes("This is not promoted into a universal legal licence for every accountant job"))

  assert.ok(migration.includes("'IE:auditor','IE','auditor','Chartered and certified accountants — statutory financial-audit scope','SOC','SOC 2010','2421','EUR',true"))
  assert.ok(migration.includes("IAASA — statutory auditor qualification and registration"))
  assert.ok(migration.includes("Internal audit, operational audit and non-statutory assurance roles can have different qualification requirements"))
})

test("Ireland Business exposes only the verified work-based entry routes", () => {
  assert.ok(migration.includes("'IE:accountant','entry_program','Generation Apprenticeship — Accounting Technician'"))
  assert.ok(migration.includes("'IE:supply-chain-analyst','entry_program','Generation Apprenticeship — Supply Chain Specialist'"))
  assert.ok(migration.includes("'IE:marketing-specialist','entry_program','Generation Apprenticeship — Digital Marketing L6'"))

  const entryRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('IE:") && line.includes("'entry_program'"))
  assert.equal(entryRows.length, 3)
})

test("Ireland Business does not publish programme links while IE programme Tier A is empty", () => {
  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
})
