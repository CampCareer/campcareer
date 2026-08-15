import assert from "node:assert/strict"
import test from "node:test"
import { buildCareerResultHref, getCareerResultCompareHref } from "../src/app/(workspace)/career/career-result-context"

test("career result href uses the canonical country slug and career identifier", () => {
  assert.equal(
    buildCareerResultHref({ country: "AU", occupation: "software-developer" }),
    "/career/australia/software-developer",
  )
  assert.equal(
    buildCareerResultHref({ country: "AU", occupation: "registered-nurse" }, true),
    "/career/australia/registered-nurse?personalised=1",
  )
})

test("AU software developer compare opens Careers with software engineer preselected", () => {
  assert.equal(
    getCareerResultCompareHref({ country: "AU", occupation: "software-developer" }),
    "/compare?type=career&country=AU&profile=starting-from-scratch&careers=software-engineer",
  )
})

test("AU nursing and early childhood preserve their career context", () => {
  assert.equal(
    getCareerResultCompareHref({ country: "AU", occupation: "registered-nurse" }),
    "/compare?type=career&country=AU&profile=starting-from-scratch&careers=registered-nurse",
  )
  assert.equal(
    getCareerResultCompareHref({ country: "AU", occupation: "early-childhood-teacher" }),
    "/compare?type=career&country=AU&profile=starting-from-scratch&careers=early-childhood-teacher",
  )
})

test("unsupported career compare contexts do not fall back to unrelated nursing programs", () => {
  assert.equal(getCareerResultCompareHref({ country: "US", occupation: "software-developer" }), null)
  assert.equal(getCareerResultCompareHref({ country: "AU", occupation: "carpenter" }), null)
})
