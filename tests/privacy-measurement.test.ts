import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server"
import { DELETE, POST } from "@/app/api/privacy/measurement/route"

const OPTIONAL_MEASUREMENT_COOKIES = [
  "cc_sid",
  "cc_first_path",
  "cc_utm_source",
  "cc_utm_medium",
  "cc_utm_campaign",
  "cc_utm_term",
  "cc_utm_content",
]

test("measurement session is not created before affirmative consent", async () => {
  const response = await POST(new NextRequest("https://www.campcareer.com/api/privacy/measurement", {
    method: "POST",
    headers: { referer: "https://www.campcareer.com/home?utm_source=newsletter" },
  }))

  assert.equal(response.status, 204)
  assert.equal(response.headers.get("set-cookie"), null)
})

test("measurement session is created only after consent with a limited attribution context", async () => {
  const response = await POST(new NextRequest("https://www.campcareer.com/api/privacy/measurement", {
    method: "POST",
    headers: {
      cookie: "cc_analytics_consent=granted",
    },
    body: JSON.stringify({ pathname: "/home", search: "?utm_source=newsletter&utm_campaign=august" }),
  }))
  const cookies = response.cookies.getAll()

  assert.equal(response.status, 204)
  assert.match(cookies.find((cookie) => cookie.name === "cc_sid")?.value ?? "", /^[0-9a-f-]{36}$/i)
  assert.equal(cookies.find((cookie) => cookie.name === "cc_first_path")?.value, "/home")
  assert.equal(cookies.find((cookie) => cookie.name === "cc_utm_source")?.value, "newsletter")
  assert.equal(cookies.find((cookie) => cookie.name === "cc_utm_campaign")?.value, "august")
  assert.equal(cookies.some((cookie) => cookie.name === "cc_utm_term"), false)
})

test("withdrawing measurement consent clears every optional CampCareer cookie", async () => {
  const response = await DELETE()
  const cookies = response.cookies.getAll()

  assert.equal(response.status, 204)
  assert.deepEqual(cookies.map((cookie) => cookie.name), OPTIONAL_MEASUREMENT_COOKIES)
  assert.ok(cookies.every((cookie) => cookie.maxAge === 0 && cookie.httpOnly && cookie.path === "/"))
})
