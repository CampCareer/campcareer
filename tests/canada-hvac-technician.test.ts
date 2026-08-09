import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"
const migration = readFileSync(new URL("../supabase/migrations/20260809223000_canada_hvac_technician_profile.sql", import.meta.url), "utf8")
test("Canada HVAC Technician uses exact NOC 72402", () => { assert.equal(getCanonicalCareer("hvac-technician")?.categoryId,"trades"); assert.ok(getOccupationEditorial("hvac-technician")?.countries.CA); assert.match(migration,/72402/); assert.match(migration,/Heating, refrigeration and air conditioning mechanics/) })
test("Canada HVAC Technician uses strong shortage and trade-category credit", () => { assert.match(migration,/20,0,0,0,15,8,0,10,2,55/); assert.match(migration,/STRONG RISK OF SHORTAGE/); assert.match(migration,/Red Seal/) })
