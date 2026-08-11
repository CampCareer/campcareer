import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811105117_ie_hospitality_occupations.sql", import.meta.url),
  "utf8",
)

const hospitalityCareers = [
  ["chef", "5434", 43],
  ["cook", "5435", 17],
  ["hotel-manager", "1221", 19],
  ["restaurant-manager", "1223", 19],
  ["baker", "5432", 21],
  ["tourism-manager", "1226", 13],
  ["event-planner", "3546", 13],
  ["hospitality-supervisor", "5436", 23],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.includes(`('IE:${id}','2026-08-11'`))
}

test("Ireland Hospitality covers the canonical eight careers", () => {
  assert.equal(hospitalityCareers.length, 8)
  for (const [id, soc] of hospitalityCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "hospitality")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Hospitality preserves SOC 2010 scopes", () => {
  for (const marker of [
    "'IE:chef','IE','chef','Chefs — experienced professional chef scope','SOC','SOC 2010','5434'",
    "'IE:cook','IE','cook','Cooks','SOC','SOC 2010','5435'",
    "'IE:hotel-manager','IE','hotel-manager','Hotel and accommodation managers and proprietors — hotel manager scope','SOC','SOC 2010','1221'",
    "'IE:restaurant-manager','IE','restaurant-manager','Restaurant and catering establishment managers and proprietors — restaurant manager scope','SOC','SOC 2010','1223'",
    "'IE:baker','IE','baker','Bakers and flour confectioners — Baker scope','SOC','SOC 2010','5432'",
    "'IE:tourism-manager','IE','tourism-manager','Travel agency managers — tourism/travel management scope','SOC','SOC 2010','1226'",
    "'IE:event-planner','IE','event-planner','Conference and exhibition managers and organisers — event-planner scope','SOC','SOC 2010','3546'",
    "'IE:hospitality-supervisor','IE','hospitality-supervisor','Catering and bar managers — front-line hospitality supervision scope','SOC','SOC 2010','5436'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(!migration.includes("restaurant-manager','IE','restaurant-manager','Restaurant and catering establishment managers and proprietors — restaurant manager scope','SOC','SOC 2010','1222'"))
})

test("Ireland Hospitality scores only the direct Chef shortage", () => {
  assert.match(metricRow("chef")!, /null,null,null,20,0,0,0,12,0,0,6,5,43/)
  for (const id of ["cook", "hotel-manager", "restaurant-manager", "baker", "tourism-manager", "event-planner", "hospitality-supervisor"]) {
    assert.match(metricRow(id)!, /null,null,null,0,0,0,0,/)
  }
  assert.ok(migration.includes("directly identifies Chefs as a current Hospitality shortage"))
  assert.ok(migration.includes("identifies Chefs, not Cooks"))
})

test("Ireland Hospitality preserves current permit boundaries", () => {
  assert.match(metricRow("chef")!, /,6,5,43,/)
  assert.match(metricRow("cook")!, /,0,5,17,/)
  assert.match(metricRow("hotel-manager")!, /,6,5,19,/)
  assert.match(metricRow("restaurant-manager")!, /,6,5,19,/)
  assert.match(metricRow("baker")!, /,6,5,21,/)
  assert.match(metricRow("tourism-manager")!, /,0,5,13,/)
  assert.match(metricRow("event-planner")!, /,0,5,13,/)
  assert.match(metricRow("hospitality-supervisor")!, /,6,5,23,/)

  assert.ok(migration.includes("Executive Chef, Head Chef and Sous Chef with at least 5 years experience"))
  assert.ok(migration.includes("Chef de Partie or Commis Chef with at least 2 years experience"))
  assert.ok(migration.includes("SOC 5435 Cooks is on the current Ineligible List"))
  assert.ok(migration.includes("renewed General Employment Permit quota"))
  assert.ok(migration.includes("SOC 1226 Travel agency managers is on the current Ineligible List"))
  assert.ok(migration.includes("SOC 3546 Conference and exhibition managers and organisers is on the current Ineligible List"))
})

test("Ireland Hospitality keeps Baker separate from Flour confectioner", () => {
  assert.ok(migration.includes("Baker was removed from the Ineligible List in the 2023 occupations expansion"))
  assert.ok(migration.includes("current 2026 Ineligible List names Flour confectioners under 5432 rather than Baker"))
  assert.ok(migration.includes("Baker is kept separate from the currently ineligible Flour confectioner employment within the same SOC 5432 group"))
})

test("Ireland Hospitality keeps all eight broad profiles non-licensed", () => {
  for (const [id, soc] of hospitalityCareers) {
    const row = migration.split("\n").find((line) => line.includes(`('IE:${id}','IE','${id}'`))
    assert.ok(row)
    assert.ok(row.includes(`'${soc}','EUR',false,null,null`))
  }
})

test("Ireland Hospitality keeps salary vacancy and growth unscored", () => {
  for (const [id, , score] of hospitalityCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, /'2026-08-11',null,null,null,/)
    assert.ok(row.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }
})

test("Ireland Hospitality publishes only verified entry references and no Tier B programmes", () => {
  assert.ok(migration.includes("'IE:chef','entry_program','Generation Apprenticeship — Chef de Partie Level 7'"))
  assert.ok(migration.includes("'IE:hotel-manager','entry_program','Fáilte Ireland — tourism careers and hospitality management progression'"))
  assert.ok(migration.includes("'IE:tourism-manager','entry_program','Fáilte Ireland — learniFI tourism and management training'"))
  assert.ok(migration.includes("'IE:event-planner','entry_program','Fáilte Ireland — learniFI tourism and event-sector training'"))
  assert.ok(migration.includes("'IE:hospitality-supervisor','entry_program','Fáilte Ireland — workplace progression and hospitality leadership'"))
  assert.ok(!migration.includes("ie-program:"))
  assert.ok(migration.includes("delete from public.country_occupation_program_links"))
})
