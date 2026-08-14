import test from "node:test"
import assert from "node:assert/strict"
import { getCareerSaveIntentFromNext } from "../src/lib/auth/career-save-intent"

test("career Save intent is parsed and removed from the return URL", () => {
  assert.deepEqual(
    getCareerSaveIntentFromNext("/career?country=AU&occupation=electrician&save=1"),
    {
      countryCode: "AU",
      careerId: "electrician",
      returnPath: "/career?country=AU&occupation=electrician",
    },
  )
})

test("localized Career Page Save intent preserves the locale", () => {
  assert.deepEqual(
    getCareerSaveIntentFromNext("/ko/career?country=ca&occupation=registered-nurse&save=1"),
    {
      countryCode: "CA",
      careerId: "registered-nurse",
      returnPath: "/ko/career?country=ca&occupation=registered-nurse",
    },
  )
})

test("ordinary Career Page visits are not save intents", () => {
  assert.equal(
    getCareerSaveIntentFromNext("/career?country=AU&occupation=electrician"),
    null,
  )
})

test("Save intent is rejected outside the Career Page", () => {
  assert.equal(
    getCareerSaveIntentFromNext("/programs?country=AU&occupation=electrician&save=1"),
    null,
  )
})

test("invalid career Save parameters are rejected", () => {
  assert.equal(
    getCareerSaveIntentFromNext("/career?country=Australia&occupation=electrician&save=1"),
    null,
  )
  assert.equal(
    getCareerSaveIntentFromNext("/career?country=AU&occupation=%2Fadmin&save=1"),
    null,
  )
})
