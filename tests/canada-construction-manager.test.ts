import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"
const migration = readFileSync(new URL("../supabase/migrations/20260809224500_canada_construction_manager_profile.sql", import.meta.url), "utf8")
test("Canada Construction Manager uses exact NOC 70010", () => { assert.equal(getCanonicalCareer("construction-manager")?.categoryId,"trades"); assert.ok(getOccupationEditorial("construction-manager")?.countries.CA); assert.match(migration,/70010/); assert.match(migration,/Construction managers/) })
test("Canada Construction Manager keeps low entry-level credit and current visa credit", () => { assert.match(migration,/15,0,0,0,3,10,0,10,2,40/); assert.match(migration,/MODERATE RISK OF SHORTAGE/); assert.match(migration,/48\.72/) })
