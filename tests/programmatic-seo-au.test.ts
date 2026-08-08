import assert from "node:assert/strict"
import test from "node:test"
import {
  AU_PROGRAMMATIC_FIELDS,
  AU_PROGRAMMATIC_MIN_INSTITUTIONS,
  AU_PROGRAMMATIC_MIN_PROGRAMS,
  AU_PROGRAMMATIC_STUDY_PAGES,
  auProgrammaticStudyPath,
  getAuProgrammaticStudyPage,
  getAuProgrammaticStudyPagesForCity,
} from "../src/lib/programs/au-programmatic-seo"

test("Australia programmatic SEO launches only quality-gated city-field pages", () => {
  assert.equal(AU_PROGRAMMATIC_STUDY_PAGES.length, 42)
  assert.equal(new Set(AU_PROGRAMMATIC_STUDY_PAGES.map((page) => page.path)).size, 42)
  assert.ok(AU_PROGRAMMATIC_STUDY_PAGES.every((page) => page.path.startsWith("/study/au/")))
  assert.equal(getAuProgrammaticStudyPagesForCity("sydney").length, 9)
  assert.equal(getAuProgrammaticStudyPagesForCity("melbourne").length, 9)
  assert.equal(getAuProgrammaticStudyPagesForCity("brisbane").length, 8)
  assert.equal(getAuProgrammaticStudyPagesForCity("perth").length, 8)
  assert.equal(getAuProgrammaticStudyPagesForCity("adelaide").length, 8)
})

test("programmatic SEO excludes ambiguous and sub-threshold categories", () => {
  const broadFields = AU_PROGRAMMATIC_FIELDS.map((field) => field.broadField as string)
  assert.ok(!broadFields.includes("09 - Society and Culture"))
  assert.ok(!broadFields.includes("11 - Food, Hospitality and Personal Services"))
  assert.ok(!broadFields.includes("12 - Mixed Field Programmes"))
  assert.equal(getAuProgrammaticStudyPage("brisbane", "agriculture-environment"), null)
  assert.equal(getAuProgrammaticStudyPage("perth", "architecture-building"), null)
  assert.equal(getAuProgrammaticStudyPage("adelaide", "agriculture-environment"), null)
})

test("study paths are deterministic and lookups normalize casing", () => {
  assert.equal(
    auProgrammaticStudyPath("sydney", "information-technology"),
    "/study/au/sydney/information-technology",
  )

  const page = getAuProgrammaticStudyPage("PERTH", "Information-Technology")
  assert.ok(page)
  assert.equal(page?.path, "/study/au/perth/information-technology")
  assert.equal(page?.field.broadField, "02 - Information Technology")
})

test("quality gate prevents low-volume programmatic pages", () => {
  assert.equal(AU_PROGRAMMATIC_MIN_PROGRAMS, 25)
  assert.equal(AU_PROGRAMMATIC_MIN_INSTITUTIONS, 5)
})
