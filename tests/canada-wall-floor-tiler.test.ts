import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"
const migration = readFileSync(new URL("../supabase/migrations/20260809214500_canada_wall_floor_tiler_profile.sql", import.meta.url), "utf8")
test("Canada Wall and Floor Tiler maps exactly to NOC 73101 Tilesetters", () => { assert.equal(getCanonicalCareer("wall-floor-tiler")?.categoryId,"trades"); assert.ok(getOccupationEditorial("wall-floor-tiler")?.countries.CA); assert.match(migration,/73101/); assert.match(migration,/Tilesetters/) })
test("Canada Tilesetter gets no shortage or visa credit", () => { assert.match(migration,/0,0,0,0,15,6,0,0,3,24/); assert.match(migration,/BALANCE/); assert.match(migration,/not in the current Express Entry trade occupations category/) })
