import test from "node:test"
import assert from "node:assert/strict"
import { getPostLoginDestination } from "../src/lib/auth/post-login-destination"

test("explicit Career Page return context always wins", () => {
  const next = "/career?country=AU&occupation=electrician&save=1"
  assert.equal(getPostLoginDestination(next), next)
})

test("onboarding is preserved only when explicitly requested", () => {
  assert.equal(
    getPostLoginDestination("/onboarding?country=AU"),
    "/onboarding?country=AU",
  )
})

test("login without a return destination goes to public Career discovery", () => {
  assert.equal(getPostLoginDestination(null), "/")
})

test("login without a return destination preserves the Korean locale", () => {
  assert.equal(getPostLoginDestination(undefined, "ko"), "/ko")
})

test("unsafe external return destinations fall back to public discovery", () => {
  assert.equal(getPostLoginDestination("//example.com/path"), "/")
})
