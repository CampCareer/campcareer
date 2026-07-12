import assert from "node:assert/strict"
import test from "node:test"
import {
  belongsToSegment,
  SITEMAP_SEGMENTS,
  sitemapIndexXml,
  urlSetXml,
} from "../src/lib/sitemap-segments"

test("sitemap index lists each bounded template segment", () => {
  const xml = sitemapIndexXml()
  for (const segment of SITEMAP_SEGMENTS) {
    assert.match(xml, new RegExp(`/sitemaps/${segment}\\.xml`))
  }
})

test("URLs belong to one intended sitemap family", () => {
  assert.equal(belongsToSegment("/fields/carpentry", "fields-en"), true)
  assert.equal(belongsToSegment("/ko/fields/carpentry", "fields-ko"), true)
  assert.equal(belongsToSegment("/map/au/university/example", "schools"), true)
  assert.equal(belongsToSegment("/blog/example", "blog-en"), true)
  assert.equal(belongsToSegment("/api/v1/taxonomy/search", "core-en"), false)
})

test("URL-set XML escapes query parameters", () => {
  const xml = urlSetXml([{ url: "https://www.campcareer.com/map?country=au&tab=pay" }])
  assert.match(xml, /country=au&amp;tab=pay/)
})
