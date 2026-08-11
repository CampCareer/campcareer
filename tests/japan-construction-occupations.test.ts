import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810201721_japan_construction_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["carpenter", "091-01", "大工"],
  ["electrician", "094-05", "電気工事作業員"],
  ["plumber", "091-06", "配管工"],
  ["wall-floor-tiler", "091-02", "tile scope"],
  ["welder", "071-13", "金属溶接・溶断工"],
  ["bricklayer", "091-02", "brick/block masonry scope"],
  ["hvac-technician", null, "installation/maintenance umbrella"],
  ["construction-manager", "008-02", "建築施工管理技術者"],
] as const

test("Japan construction cohort covers the canonical eight trades careers", () => {
  for (const [id, code, title] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "trades", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
    assert.match(migration, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), id)
    if (code) assert.match(migration, new RegExp(code), id)
  }
})

test("Japan construction preserves shared and umbrella classification boundaries", () => {
  assert.match(getOccupationEditorial("wall-floor-tiler")?.countries.JP?.entryPathway ?? "", /091-02/)
  assert.match(getOccupationEditorial("wall-floor-tiler")?.countries.JP?.entryPathway ?? "", /restricted to タイル張工/i)
  assert.match(getOccupationEditorial("bricklayer")?.countries.JP?.entryPathway ?? "", /091-02/)
  assert.match(getOccupationEditorial("bricklayer")?.countries.JP?.entryPathway ?? "", /れんが積工/i)

  const hvac = getOccupationEditorial("hvac-technician")?.countries.JP
  assert.match(hvac?.entryPathway ?? "", /does not provide one single/i)
  assert.match(migration, /'JP:hvac-technician','JP','hvac-technician'[\s\S]*null,'JPY',false/)
  for (const code of ["075-01", "075-02", "091-06", "094-05"]) {
    assert.match(migration, new RegExp(`'JP:hvac-technician','${code}'[\\s\\S]*false`), code)
  }
})

test("Japan construction models universal licensing separately from role-specific requirements", () => {
  const electrician = getOccupationEditorial("electrician")?.countries.JP
  const plumber = getOccupationEditorial("plumber")?.countries.JP
  const welder = getOccupationEditorial("welder")?.countries.JP
  const manager = getOccupationEditorial("construction-manager")?.countries.JP

  assert.match(electrician?.registration ?? "", /requires the applicable 電気工事士 qualification/i)
  assert.match(migration, /'JP:electrician'[\s\S]*'JPY',true,'経済産業省 — 電気工事士'/)

  assert.match(plumber?.registration ?? "", /no single universal personal plumber licence/i)
  assert.match(plumber?.registration ?? "", /給水装置工事主任技術者/)
  assert.match(welder?.registration ?? "", /no one universal personal welder licence/i)
  assert.match(welder?.registration ?? "", /gas welding.*skills training/i)
  assert.match(welder?.registration ?? "", /arc-welding.*special education/i)
  assert.match(manager?.registration ?? "", /not universally licensed at entry/i)
  assert.match(manager?.registration ?? "", /主任技術者|監理技術者/)

  for (const id of ["carpenter", "plumber", "wall-floor-tiler", "welder", "bricklayer", "hvac-technician", "construction-manager"]) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',false`), id)
  }
})

test("Japan construction v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)

  for (const score of [
    "0,0,0,0,15,0,0,0,5,20",
    "0,0,0,0,12,0,0,0,1,13",
    "0,0,0,0,15,0,0,0,4,19",
    "0,0,0,0,15,0,0,0,3,18",
    "0,0,0,0,12,0,0,0,4,16",
    "0,0,0,0,10,0,0,0,3,13",
  ]) {
    assert.match(migration, new RegExp(score))
  }
})

test("Japan construction reuses only approved programme mappings and keeps them conservative", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /join public\.program_catalog_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)

  const manager = getOccupationEditorial("construction-manager")?.countries.JP
  assert.match(manager?.jobMarketNote ?? "", /Five approved Japanese civil and construction-related university programmes/i)
  assert.match(manager?.jobMarketNote ?? "", /does not itself confer/i)
})
