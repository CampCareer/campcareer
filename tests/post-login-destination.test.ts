import test from "node:test"
import assert from "node:assert/strict"
import { getPostLoginDestination } from "../src/lib/auth/post-login-destination"

test("first sign-in starts onboarding", () => {
  assert.equal(getPostLoginDestination("/home", false), "/onboarding")
})

test("returning sign-in resumes Home instead of onboarding", () => {
  assert.equal(getPostLoginDestination("/onboarding?country=AU", true), "/home")
})

test("first Korean sign-in retains the Korean onboarding route", () => {
  assert.equal(getPostLoginDestination("/ko/home", false), "/ko/onboarding")
})
