import test from "node:test"
import assert from "node:assert/strict"
import { getCareerSaveIntentFromNext } from "../src/lib/auth/career-save-intent"

test("canonical Career Save intent is parsed and removed from the return URL", () => {
  assert.deepEqual(
    getCareerSaveIntentFromNext("/career/australia/electrician?save=1"),
    {
      countryCode: "AU",
      careerId: "electrician",
      returnPath: "/career/australia/electrician",
    },
  )
})

test("localized canonical Career Save intent preserves the locale and tracking context", () => {
  assert.deepEqual(
    getCareerSaveIntentFromNext("/ko/career/canada/registered-nurse?utm_source=tiktok&save=1"),
    {
      countryCode: "CA",
      careerId: "registered-nurse",
      returnPath: "/ko/career/canada/registered-nurse?utm_source=tiktok",
    },
  )
})

test("legacy query-style Save intent migrates to the canonical return URL", () => {
  assert.deepEqual(
    getCareerSaveIntentFromNext("/career?country=AU&occupation=electrician&save=1"),
    {
      countryCode: "AU",
      careerId: "electrician",
      returnPath: "/career/australia/electrician",
    },
  )
})

test("ordinary Career Page visits are not save intents", () => {
  assert.equal(
    getCareerSaveIntentFromNext("/career/australia/electrician"),
    null,
  )
})

test("Save intent is rejected outside the Career Page", () => {
  assert.equal(
    getCareerSaveIntentFromNext("/programs?country=AU&occupation=electrician&save=1"),
    null,
  )
})

test("invalid Career identifiers are rejected", () => {
  assert.equal(
    getCareerSaveIntentFromNext("/career/australia/not-a-career?save=1"),
    null,
  )
  assert.equal(
    getCareerSaveIntentFromNext("/career/mars/electrician?save=1"),
    null,
  )
})
