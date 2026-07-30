import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server"
import { POST } from "../src/app/api/route-requests/route"

test("route requests return a uniform accepted response for malformed and honeypot submissions", async () => {
  const malformed = await POST(new NextRequest("https://campcareer.test/api/route-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ citizenship: "not-a-country" }),
  }))
  assert.equal(malformed.status, 202)

  const honeypot = await POST(new NextRequest("https://campcareer.test/api/route-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ citizenship: "KR", destination: "AU", field: "mining", goal: "work", company: "bot" }),
  }))
  assert.equal(honeypot.status, 202)
  assert.equal(honeypot.headers.get("cache-control"), "no-store")
})
