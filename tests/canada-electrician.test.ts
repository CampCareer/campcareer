import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"
const migration = readFileSync(new URL("../supabase/migrations/20260809211500_canada_electrician_profile.sql", import.meta.url), "utf8")
test("Canada Electrician uses exact NOC 72200", () => { assert.equal(getCanonicalCareer("electrician")?.categoryId,"trades"); assert.ok(getOccupationEditorial("electrician")?.countries.CA); assert.match(migration,/72200/); assert.match(migration,/Electricians \(except industrial and power system\)/) })
test("Canada Electrician uses moderate shortage and trade-category credit", () => { assert.match(migration,/15,0,0,0,15,8,0,10,2,50/); assert.match(migration,/MODERATE RISK OF SHORTAGE/); assert.match(migration,/Construction Electrician/) })
