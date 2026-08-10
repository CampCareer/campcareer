import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"
const migration = readFileSync(new URL("../supabase/migrations/20260809220000_canada_welder_profile.sql", import.meta.url), "utf8")
test("Canada Welder uses exact NOC 72106", () => { assert.equal(getCanonicalCareer("welder")?.categoryId,"trades"); assert.ok(getOccupationEditorial("welder")?.countries.CA); assert.match(migration,/72106/); assert.match(migration,/Welders and related machine operators/) })
test("Canada Welder uses moderate shortage and current trade-category credit", () => { assert.match(migration,/15,0,0,0,15,6,0,10,3,49/); assert.match(migration,/MODERATE RISK OF SHORTAGE/); assert.match(migration,/Red Seal/) })
