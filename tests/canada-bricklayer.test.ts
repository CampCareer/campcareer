import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"
const migration = readFileSync(new URL("../supabase/migrations/20260809221500_canada_bricklayer_profile.sql", import.meta.url), "utf8")
test("Canada Bricklayer uses exact NOC 72320", () => { assert.equal(getCanonicalCareer("bricklayer")?.categoryId,"trades"); assert.ok(getOccupationEditorial("bricklayer")?.countries.CA); assert.match(migration,/72320/); assert.match(migration,/Bricklayers/) })
test("Canada Bricklayer uses exact wage and trade-category credit", () => { assert.match(migration,/15,0,0,0,15,10,0,10,3,53/); assert.match(migration,/MODERATE RISK OF SHORTAGE/); assert.match(migration,/Red Seal/) })
