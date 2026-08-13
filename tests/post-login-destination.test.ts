import test from "node:test"
import assert from "node:assert/strict"
import { getPostLoginDestination } from "../src/lib/auth/post-login-destination"

test("first sign-in starts onboarding", () => {
  assert.equal(getPostLoginDestination("/home", false), "/onboarding")
})

test("first sign-in saving a career result resumes the personalised result after onboarding", () => {
  const result = getPostLoginDestination(
    "/ko/career?country=AU&occupation=registered-nurse&save=1",
    false,
  )
  const onboarding = new URL(result, "https://campcareer.local")

  assert.equal(onboarding.pathname, "/ko/onboarding")
  assert.equal(onboarding.searchParams.get("country"), "AU")
  assert.equal(onboarding.searchParams.get("occupation"), "registered-nurse")
  assert.equal(
    onboarding.searchParams.get("return_to"),
    "/ko/career?country=AU&occupation=registered-nurse&save=1&personalised=1",
  )
})

test("returning sign-in resumes Home instead of onboarding", () => {
  assert.equal(getPostLoginDestination("/onboarding?country=AU", true), "/home")
})

test("career-result onboarding returns a completed member to their personalised result", () => {
  const returnTo = "/ko/career?country=AU&occupation=registered-nurse&personalised=1"
  const next = `/ko/onboarding?country=AU&occupation=registered-nurse&return_to=${encodeURIComponent(returnTo)}`
  assert.equal(getPostLoginDestination(next, true), returnTo)
})

test("first sign-in preserves the original career result through onboarding", () => {
  const returnTo = "/career?country=AU&occupation=registered-nurse&personalised=1"
  const next = `/onboarding?country=AU&occupation=registered-nurse&return_to=${encodeURIComponent(returnTo)}`
  assert.equal(getPostLoginDestination(next, false), next)
})

test("first Korean sign-in retains the Korean onboarding route", () => {
  assert.equal(getPostLoginDestination("/ko/home", false), "/ko/onboarding")
})
