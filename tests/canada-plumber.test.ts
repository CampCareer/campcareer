import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"
const migration = readFileSync(new URL("../supabase/migrations/20260809213000_canada_plumber_profile.sql", import.meta.url), "utf8")
test("Canada Plumber uses exact NOC 72300", () => { assert.equal(getCanonicalCareer("plumber")?.categoryId,"trades"); assert.ok(getOccupationEditorial("plumber")?.countries.CA); assert.match(migration,/72300/); assert.match(migration,/Plumbers/) })
test("Canada Plumber uses conservative Canada v1 scoring", () => { assert.match(migration,/15,0,0,0,15,6,0,10,2,48/); assert.match(migration,/MODERATE RISK OF SHORTAGE/); assert.match(migration,/Red Seal/) })
