import assert from "node:assert/strict"
import test from "node:test"
import {
  institutionIconCandidates,
  institutionInitials,
} from "../src/lib/programs/institution-brand"

test("institution initials ignore a leading article and use up to three words", () => {
  assert.equal(institutionInitials("The University of Sydney"), "UOS")
  assert.equal(institutionInitials("Macquarie University"), "MU")
})

test("institution icon candidates stay on the official HTTPS origin", () => {
  const candidates = institutionIconCandidates("https://www.mq.edu.au/study/")

  assert.deepEqual(candidates, [
    "https://www.mq.edu.au/apple-touch-icon.png",
    "https://www.mq.edu.au/apple-touch-icon-precomposed.png",
    "https://www.mq.edu.au/favicon.svg",
    "https://www.mq.edu.au/favicon-32x32.png",
    "https://www.mq.edu.au/favicon.ico",
  ])
})

test("institution icon candidates reject missing, malformed and insecure URLs", () => {
  assert.deepEqual(institutionIconCandidates(null), [])
  assert.deepEqual(institutionIconCandidates("not a URL"), [])
  assert.deepEqual(institutionIconCandidates("http://example.edu.au"), [])
})
