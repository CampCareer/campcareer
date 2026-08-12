import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260812010700_sweden_construction_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["carpenter", "7111"],
  ["electrician", "7411"],
  ["plumber", "7125"],
  ["wall-floor-tiler", "7112"],
  ["welder", "7212"],
  ["bricklayer", "7112"],
  ["hvac-technician", "7126"],
  ["construction-manager", "1362"],
] as const

const v2Scores = [
  ["carpenter", 483600, "18,0,4,0,13,7,0,7,3,52"],
  ["electrician", 480000, "20,9,5,10,13,6,0,9,2,74"],
  ["plumber", 512400, "20,9,4,10,13,7,0,7,3,73"],
  ["wall-floor-tiler", 506400, "18,0,3,0,13,7,0,7,3,51"],
  ["welder", 426000, "20,15,5,10,14,4,0,5,3,76"],
  ["bricklayer", 506400, "18,0,3,0,13,7,0,7,3,51"],
  ["hvac-technician", 508800, "18,0,5,0,12,7,0,7,2,51"],
  ["construction-manager", 687600, "20,0,5,0,6,10,0,10,2,53"],
] as const

test("Sweden construction cohort covers the canonical eight trades careers", () => {
  for (const [id, code] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SE

    assert.ok(career, id)
    assert.equal(career.categoryId, "trades", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SE:${id}'`), id)
    assert.match(migration, new RegExp(`'${code}'`), id)
  }
})

test("Sweden construction preserves the reviewed SSYK 2012 mappings", () => {
  assert.match(migration, /'SE:carpenter'[\s\S]*?'7111','SEK',false/)
  assert.match(migration, /'SE:electrician'[\s\S]*?'7411','SEK',false/)
  assert.match(migration, /'SE:plumber'[\s\S]*?'7125','SEK',false/)
  assert.match(migration, /'SE:wall-floor-tiler'[\s\S]*?'7112','SEK',false/)
  assert.match(migration, /'SE:welder'[\s\S]*?'7212','SEK',false/)
  assert.match(migration, /'SE:bricklayer'[\s\S]*?'7112','SEK',false/)
  assert.match(migration, /'SE:hvac-technician'[\s\S]*?'7126','SEK',false/)
  assert.match(migration, /'SE:construction-manager'[\s\S]*?'1362','SEK',false/)

  assert.match(
    getOccupationEditorial("wall-floor-tiler")?.countries.SE?.entryPathway ?? "",
    /Kakelsättare[\s\S]*Klinkerläggare[\s\S]*Plattsättare/,
  )
  assert.match(
    getOccupationEditorial("construction-manager")?.countries.SE?.entryPathway ?? "",
    /Byggplatschef[\s\S]*Platschef[\s\S]*Produktionschef/,
  )
})

test("Sweden construction models regulation as activity or company scope instead of universal personal licensing", () => {
  assert.match(getOccupationEditorial("electrician")?.countries.SE?.registration ?? "", /self-audit scheme/i)
  assert.match(getOccupationEditorial("electrician")?.countries.SE?.registration ?? "", /do not all need personal authorisation/i)
  assert.match(migration, /Elsäkerhetsverket — Working with electrical installations/)

  assert.match(getOccupationEditorial("plumber")?.countries.SE?.registration ?? "", /industry authorisation/i)
  assert.match(getOccupationEditorial("plumber")?.countries.SE?.registration ?? "", /state occupational licensing/i)
  assert.match(migration, /Säker Vatten — Branschregler 2026:1/)

  assert.match(getOccupationEditorial("hvac-technician")?.countries.SE?.registration ?? "", /person certification/i)
  assert.match(getOccupationEditorial("hvac-technician")?.countries.SE?.registration ?? "", /F-gas/i)
  assert.match(migration, /Naturvårdsverket — F-gas requirements/)
})

test("Sweden construction v2 persists evidence-backed 100-point component scores", () => {
  assert.equal((migration.match(/career-opportunity-se-v2/g) ?? []).length, 8)
  assert.equal((migration.match(/'provisional'/g) ?? []).length, 8)

  for (const [id, annualSalary, components] of v2Scores) {
    const scoreBlock = new RegExp(
      `'SE:${id}','2026-08-12',${annualSalary},[\\s\\S]{0,120}?${components.replaceAll(",", ",\\s*")},[\\s\\S]{0,80}?'career-opportunity-se-v2'`,
    )
    assert.match(migration, scoreBlock, `${id} score`)
  }
})

test("Sweden construction v2 anchors salary scoring to SCB 2025 and the current work-permit threshold", () => {
  for (const salary of [40300, 40000, 42700, 42200, 35500, 42400, 57300]) {
    assert.match(migration, new RegExp(`'median_monthly_salary_sek',${salary}`), String(salary))
  }

  assert.match(migration, /'national_median_monthly_salary_sek',38300/)
  assert.equal((migration.match(/'work_permit_salary_floor_sek',34470/g) ?? []).length, 8)
  assert.match(migration, /'eu_blue_card_salary_floor_sek',53625/)
  assert.match(getOccupationEditorial("welder")?.countries.SE?.scoreCaveat ?? "", /only about 3% above/i)
  assert.match(getOccupationEditorial("construction-manager")?.countries.SE?.jobMarketNote ?? "", /SEK 57,300/)
  assert.match(getOccupationEditorial("construction-manager")?.countries.SE?.scoreCaveat ?? "", /Blue Card/i)
})

test("Sweden construction v2 uses current Yrkesbarometer demand only where an exact national match was verified", () => {
  assert.match(migration, /'SE:electrician'[\s\S]*?'yrkesbarometer_current_opportunities','medium'/)
  assert.match(migration, /'SE:electrician'[\s\S]*?'yrkesbarometer_five_year_demand','increase'/)
  assert.match(migration, /'SE:plumber'[\s\S]*?'yrkesbarometer_current_opportunities','medium'/)
  assert.match(migration, /'SE:plumber'[\s\S]*?'yrkesbarometer_five_year_demand','increase'/)
  assert.match(migration, /'SE:welder'[\s\S]*?'yrkesbarometer_current_opportunities','large'/)
  assert.match(migration, /'SE:welder'[\s\S]*?'yrkesbarometer_five_year_demand','increase'/)

  assert.match(migration, /large=15, medium=9, small=3/)
  assert.match(migration, /increase=10, unchanged=5, decrease=0/)
  assert.match(migration, /not_scored_no_exact_numeric_employment_growth_series/)
  assert.match(migration, /not_scored_directional_forecast_is_kept_in_vacancy_trend/)
})

test("Sweden construction v2 preserves 2035 shortage and foreign-labour evidence without pretending SSYK3 totals are SSYK4 counts", () => {
  assert.match(migration, /12,600–13,100/)
  assert.match(migration, /about 9 percent of 2023 employment/)
  assert.match(migration, /roughly 5,000 missing workers, around 11 percent of 2023 employment/)
  assert.match(migration, /shortage up to roughly 2,000 by 2035/)
  assert.match(migration, /rose about 80 percent from just over 130 in 2023 to just under 240 in 2025/)
  assert.match(migration, /around 870/)

  assert.match(getOccupationEditorial("carpenter")?.countries.SE?.scoreCaveat ?? "", /SSYK3 group evidence/i)
  assert.match(getOccupationEditorial("plumber")?.countries.SE?.scoreCaveat ?? "", /broader SSYK3 evidence/i)
  assert.match(getOccupationEditorial("bricklayer")?.countries.SE?.scoreCaveat ?? "", /does not relabel/i)
})

test("Sweden construction links the official evidence stack used by v2 scoring", () => {
  assert.match(migration, /SCB — 2025 median salary by SSYK/)
  assert.match(migration, /Arbetsförmedlingen — Yrkesbarometer June 2026/)
  assert.match(migration, /Arbetsförmedlingen — 2035 labour shortage and foreign labour/)
  assert.match(migration, /Swedish Migration Agency — work-permit salary requirement/)
  assert.match(migration, /Swedish Migration Agency — EU Blue Card/)
  assert.match(migration, /Arbetsförmedlingen — Svetsare job opportunities/)
  assert.match(migration, /Arbetsförmedlingen — VVS-montör job opportunities/)
  assert.match(migration, /Arbetsförmedlingen — Installations- och serviceelektriker job opportunities/)
  assert.doesNotMatch(migration, /program_occupation_se_staging/)
  assert.doesNotMatch(migration, /program_catalog_se_staging/)
})
