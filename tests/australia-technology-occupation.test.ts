import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const softwareDeveloperMigration = readFileSync(
  new URL("../supabase/migrations/20260808123000_australia_software_developer_profile.sql", import.meta.url),
  "utf8",
)

const softwareDeveloperProgramAlignment = readFileSync(
  new URL("../supabase/migrations/20260808123500_australia_software_developer_program_alignment.sql", import.meta.url),
  "utf8",
)

test("Australia Software Developer maps exactly to current OSCA Software Engineer", () => {
  const career = getCanonicalCareer("software-developer")
  const editorial = getOccupationEditorial("software-developer")
  const australia = editorial?.countries.AU

  assert.ok(career)
  assert.equal(career.categoryId, "technology")
  assert.ok(editorial)
  assert.ok(australia)
  assert.ok(editorial.tasks.length >= 6)
  assert.match(softwareDeveloperMigration, /'AU:software-developer'/)
  assert.match(softwareDeveloperMigration, /'273333', 'Software Engineer'/)
  assert.match(softwareDeveloperMigration, /'OSCA', '2024 v1\.0', '2733'/)
  assert.match(
    softwareDeveloperMigration,
    /'273333', 'Software Engineer', null, null, null, null, true/,
  )
})

test("Australia Software Developer does not fabricate exact current-OSCA labour metrics", () => {
  assert.match(
    softwareDeveloperMigration,
    /'AU:software-developer', '2026-05-01', null, null, null, null/,
  )
  assert.match(softwareDeveloperMigration, /'broader_anzsco_2613_context'/)
  assert.match(softwareDeveloperMigration, /'employment_total', 203200/)
  assert.match(softwareDeveloperMigration, /'median_weekly_earnings_aud', 2537/)
  assert.match(softwareDeveloperMigration, /'median_hourly_earnings_aud', 67/)
  assert.match(softwareDeveloperMigration, /3392, '2026-05-01', -9\.86/)
  assert.match(softwareDeveloperMigration, /15\.69, 26\.67/)
  assert.match(softwareDeveloperMigration, /0, 0, 5, 0, 13, 0, 5, 10, 4, 37/)
})

test("Australia Software Developer keeps 2025 no-shortage and CSOL evidence separate", () => {
  const editorial = getOccupationEditorial("software-developer")
  const australia = editorial?.countries.AU

  assert.ok(australia)
  assert.match(softwareDeveloperMigration, /S, S, NS/)
  assert.match(softwareDeveloperMigration, /national shortage component is therefore zero/)
  assert.match(softwareDeveloperMigration, /Core Skills Occupation List/)
  assert.match(softwareDeveloperMigration, /Australian Computer Society \(ACS\)/)
  assert.match(australia.registration, /no single statutory national occupational registration or licence/i)
  assert.match(australia.jobMarketNote, /No Shortage in 2025/)
})

test("Australia Software Developer stores broader 2613 vacancies without inventing state shortages", () => {
  const expected = new Map([
    ["ACT", "312"],
    ["NSW", "1196.66667"],
    ["NT", "15.33333"],
    ["QLD", "507"],
    ["SA", "195.33333"],
    ["TAS", "24"],
    ["VIC", "910.33333"],
    ["WA", "231.33333"],
  ])

  for (const [region, vacancies] of expected) {
    assert.match(
      softwareDeveloperMigration,
      new RegExp(`'AU:software-developer', '${region}', '2026-05-01', null, ${vacancies.replace(".", "\\.")}`),
    )
  }
})

test("Australia Software Developer ends with representative ACS-accredited study routes", () => {
  assert.match(softwareDeveloperProgramAlignment, /program_ref = 'au-program:7132'/)
  assert.match(softwareDeveloperProgramAlignment, /'au-program:3384', 'direct'/)
  assert.match(softwareDeveloperMigration, /'au-program:5838', 'direct'/)
  assert.match(softwareDeveloperMigration, /'au-program:4972', 'graduate_entry'/)
  assert.match(softwareDeveloperMigration, /ACS — Accredited courses/)
  assert.match(softwareDeveloperMigration, /ACS — Migration skills assessment/)
})

test("Technology editorial composition preserves existing occupation editorial", () => {
  assert.ok(getOccupationEditorial("registered-nurse"))
  assert.ok(getOccupationEditorial("construction-manager"))
  assert.ok(getOccupationEditorial("software-developer"))
})
